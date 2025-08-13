import { Channel, DefaultGenerics } from 'stream-chat';
import { MainChannelsService, MainChannelsServiceCallback } from './MainChannelsService';
import { UserWorkspaceService, createWorkspaceKey } from './UserWorkspaceService';
import { UserWorkspaceCoordinatorService } from './UserWorkspaceCoordinatorService';

// Types for channel event listeners
export interface UserChannelHandlers {
  onChannelAdded?: (channel: Channel<DefaultGenerics>) => void;
  onChannelRemoved?: (channelId: string) => void;
  onChannelUnreadCountUpdated?: (channelId: string, unreadCount: number) => void;
}

// Types for selected channel state
export interface SelectedChannelState {
  selectedChannelId: string | null;
  selectedChannelType: string | null;
}

/**
 * Service for managing user channels
 */
export class UserWorkspaceChannelsService extends UserWorkspaceService {
  private static instance: UserWorkspaceChannelsService;
  
  // Listeners for user channels
  private userChannelListeners = new Map<string, Map<string, UserChannelHandlers>>();
  
  // Listeners for selected channel changes
  private selectedChannelListeners = new Map<string, Map<string, (state: SelectedChannelState) => void>>();
  
  // Selected channel state cache
  private selectedChannelStates = new Map<string, SelectedChannelState>();

  // MainChannelsService callback reference
  private mainChannelsServiceCallback: MainChannelsServiceCallback;

  private constructor(mainChannelsService: MainChannelsService) {
    super(mainChannelsService);
    
    // Create and register the callback for MainChannelsService
    this.mainChannelsServiceCallback = {
      onChannelCreated: this.handleChannelCreated.bind(this),
      onChannelUpdated: this.handleChannelUpdated.bind(this),
      onChannelDeleted: this.handleChannelDeleted.bind(this),
    };
  }

  public static getInstance(mainChannelsService?: MainChannelsService): UserWorkspaceChannelsService {
    if (!UserWorkspaceChannelsService.instance) {
      if (!mainChannelsService) {
        throw new Error('MainChannelsService is required for first initialization of UserWorkspaceChannelsService');
      }
      UserWorkspaceChannelsService.instance = new UserWorkspaceChannelsService(mainChannelsService);
    }
    return UserWorkspaceChannelsService.instance;
  }

  public initialize(): void {
    // Clear previous data for new initialization
    this.userChannelListeners.clear();
    this.selectedChannelListeners.clear();
    this.selectedChannelStates.clear();

    // Subscribe to MainChannelsService callbacks
    this.mainChannelsService.addMainChannelsServiceCallback(this.mainChannelsServiceCallback);
  }

  public isInitialized(): boolean {
    return this.mainChannelsService.isInitialized();
  }

  /**
   * Subscribe to user channels
   */
  public subscribeToUserChannels(
    userId: string,
    workspace_id: string | undefined,
    handlers: UserChannelHandlers
  ): () => void {
    const key = createWorkspaceKey(userId, workspace_id);
    
    if (!this.userChannelListeners.has(key)) {
      this.userChannelListeners.set(key, new Map());
    }
    
    const userListeners = this.userChannelListeners.get(key)!;
    const listenerId = Math.random().toString(36).substr(2, 9);
    userListeners.set(listenerId, handlers);
    
    return () => {
      const userListeners = this.userChannelListeners.get(key);
      if (userListeners) {
        userListeners.delete(listenerId);
        if (userListeners.size === 0) {
          this.userChannelListeners.delete(key);
        }
      }
    };
  }

  /**
   * Subscribe to selected channel changes
   */
  public subscribeToSelectedChannel(
    userId: string,
    workspace_id: string | undefined,
    onStateChange: (state: SelectedChannelState) => void
  ): () => void {
    const key = createWorkspaceKey(userId, workspace_id);
    
    if (!this.selectedChannelListeners.has(key)) {
      this.selectedChannelListeners.set(key, new Map());
    }
    
    const userListeners = this.selectedChannelListeners.get(key)!;
    const listenerId = Math.random().toString(36).substr(2, 9);
    userListeners.set(listenerId, onStateChange);
    
    // Initialize selected channel state and load cached data
    this.initializeSelectedChannelState(userId, workspace_id);
    
    // Trigger initial callback with current state
    const currentState = this.getSelectedChannelState(userId, workspace_id);
    onStateChange(currentState);
    
    return () => {
      const userListeners = this.selectedChannelListeners.get(key);
      if (userListeners) {
        userListeners.delete(listenerId);
        if (userListeners.size === 0) {
          this.selectedChannelListeners.delete(key);
        }
      }
    };
  }

  /**
   * Set selected channel for user
   */
  public setSelectedChannel(
    userId: string,
    workspace_id: string | undefined,
    channelId: string | null,
    channelType: string | null
  ): void {
    const key = createWorkspaceKey(userId, workspace_id);
    
    // Update internal state
    this.selectedChannelStates.set(key, {
      selectedChannelId: channelId,
      selectedChannelType: channelType,
    });
    
    // Notify listeners
    this.notifySelectedChannelListeners(userId, workspace_id);
  }

  /**
   * Get selected channel state
   */
  public getSelectedChannelState(userId: string, workspace_id?: string): SelectedChannelState {
    const key = createWorkspaceKey(userId, workspace_id);
    
    // First, try to get from internal state (previously selected channel)
    const internalState = this.selectedChannelStates.get(key);
    if (internalState && internalState.selectedChannelId) {
      return internalState;
    }
    
    // If no previously selected channel, try to get a better default selection
    // before falling back to the first channel
    const betterDefaultState = this.tryGetBetterDefaultChannel(userId, workspace_id);
    if (betterDefaultState) {
      // Store the better default selection
      this.selectedChannelStates.set(key, betterDefaultState);
      return betterDefaultState;
    }
    
    // If no better default found, initialize with default values from first channel
    return this.initializeSelectedChannelState(userId, workspace_id);
  }

  /**
   * Try to get a better default channel selection based on various criteria
   */
  private tryGetBetterDefaultChannel(userId: string, workspace_id?: string): SelectedChannelState | null {
    const userChannels = this.getUserChannels(userId, workspace_id);
    
    if (userChannels.length === 0) {
      return null;
    }
    
    // Priority order for channel selection:
    // 1. Channels with unread messages (most recent first)
    // 2. Favorite channels
    // 3. Most recently active channels
    // 4. First available channel
    
    // First, try to find channels with unread messages
    const channelsWithUnread = userChannels.filter(channel => {
      const unreadCount = channel.countUnread() || 0;
      return unreadCount > 0;
    });
    
    if (channelsWithUnread.length > 0) {
      // Sort by unread count (highest first) and then by last message time
      channelsWithUnread.sort((a, b) => {
        const aUnread = a.countUnread() || 0;
        const bUnread = b.countUnread() || 0;
        
        if (aUnread !== bUnread) {
          return bUnread - aUnread; // Higher unread count first
        }
        
        // If unread counts are equal, sort by last message time
        const aLastMessage = a.state.last_message_at;
        const bLastMessage = b.state.last_message_at;
        
        if (aLastMessage && bLastMessage) {
          return new Date(bLastMessage).getTime() - new Date(aLastMessage).getTime();
        }
        
        return 0;
      });
      
      const bestChannel = channelsWithUnread[0];
      return {
        selectedChannelId: bestChannel.id,
        selectedChannelType: bestChannel.type || null,
      };
    }
    
    // If no unread channels, try to find favorite channels
    const favoriteChannels = userChannels.filter(channel => {
      const favoriteBy = channel.data?.favorite_by as string[] | undefined;
      return Array.isArray(favoriteBy) && favoriteBy.includes(userId);
    });
    
    if (favoriteChannels.length > 0) {
      // Sort by last message time (most recent first)
      favoriteChannels.sort((a, b) => {
        const aLastMessage = a.state.last_message_at;
        const bLastMessage = b.state.last_message_at;
        
        if (aLastMessage && bLastMessage) {
          return new Date(bLastMessage).getTime() - new Date(aLastMessage).getTime();
        }
        
        return 0;
      });
      
      const bestChannel = favoriteChannels[0];
      return {
        selectedChannelId: bestChannel.id,
        selectedChannelType: bestChannel.type || null,
      };
    }
    
    // If no favorites, sort all channels by last message time and pick the most recent
    const sortedChannels = [...userChannels].sort((a, b) => {
      const aLastMessage = a.state.last_message_at;
      const bLastMessage = b.state.last_message_at;
      
      if (aLastMessage && bLastMessage) {
        return new Date(bLastMessage).getTime() - new Date(aLastMessage).getTime();
      }
      
      return 0;
    });
    
    const bestChannel = sortedChannels[0];
    return {
      selectedChannelId: bestChannel.id,
      selectedChannelType: bestChannel.type || null,
    };
  }

  /**
   * Initialize selected channel state with default values from first channel
   */
  private initializeSelectedChannelState(userId: string, workspace_id?: string): SelectedChannelState {
    const key = createWorkspaceKey(userId, workspace_id);
    
    if (!this.selectedChannelStates.has(key)) {
      // Get user's channels
      const userChannels = this.getUserChannels(userId, workspace_id);
      
      // Set default values from first channel if available
      let defaultChannelId: string | null = null;
      let defaultChannelType: string | null = null;
      
      if (userChannels.length > 0) {
        const firstChannel = userChannels[0];
        defaultChannelId = firstChannel.id;
        defaultChannelType = firstChannel.type || null;
      }
      
      const state = {
        selectedChannelId: defaultChannelId,
        selectedChannelType: defaultChannelType,
      };
      
      // Store in internal state
      this.selectedChannelStates.set(key, state);
      
      return state;
    }
    
    return this.selectedChannelStates.get(key)!;
  }

  /**
   * Notify selected channel listeners
   */
  private notifySelectedChannelListeners(userId: string, workspace_id?: string): void {
    const key = createWorkspaceKey(userId, workspace_id);
    const listeners = this.selectedChannelListeners.get(key);
    
    if (listeners) {
      const state = this.getSelectedChannelState(userId, workspace_id);
      listeners.forEach(listener => {
        listener(state);
      });
    }
  }

  /**
   * Notify user channel listeners
   */
  private notifyUserChannelListeners(
    userId: string,
    eventType: keyof UserChannelHandlers,
    data: any
  ): void {
    // Notify listeners for specific workspace
    const workspaceKey = createWorkspaceKey(userId, data.workspace_id);
    const workspaceListeners = this.userChannelListeners.get(workspaceKey);
    if (workspaceListeners) {
      workspaceListeners.forEach(handlers => {
        const handler = handlers[eventType];
        if (handler) {
          // Handle different handler signatures
          if (eventType === 'onChannelUnreadCountUpdated' && typeof data === 'object' && 'channelId' in data && 'unreadCount' in data) {
            (handler as any)(data.channelId, data.unreadCount);
          } else {
            (handler as any)(data);
          }
        }
      });
    }
    
    // Notify listeners without workspace filter
    const globalListeners = this.userChannelListeners.get(userId);
    if (globalListeners) {
      globalListeners.forEach(handlers => {
        const handler = handlers[eventType];
        if (handler) {
          // Handle different handler signatures
          if (eventType === 'onChannelUnreadCountUpdated' && typeof data === 'object' && 'channelId' in data && 'unreadCount' in data) {
            (handler as any)(data.channelId, data.unreadCount);
          } else {
            (handler as any)(data);
          }
        }
      });
    }
  }

  // MainChannelsService callback handlers
  private handleChannelCreated(channel: Channel<DefaultGenerics>): void {
    // Only process direct message channels
    if (!this.userChannelsManager.isValidDMChannel(channel)) return;

    // Add channel to user map via UserChannelsManager
    this.userChannelsManager.addChannelToUserMap(channel);

    // Notify affected users
    const affectedUsers = this.getUsersForChannel(channel.cid);

    affectedUsers.forEach(userId => {
      this.notifyUserChannelListeners(userId, 'onChannelAdded', {
        channel: channel,
        workspace_id: channel.data?.workspace_id
      });
      // Update default selected channel if no channel is currently selected
      this.updateDefaultSelectedChannelIfNeeded(userId, channel.data?.workspace_id?.toString());
    });
  }

  private handleChannelUpdated(channel: Channel<DefaultGenerics>): void {
    // Only process direct message channels
    if (!this.userChannelsManager.isValidDMChannel(channel)) return;

    const affectedUsers = this.getUsersForChannel(channel.cid);

    affectedUsers.forEach(userId => {
      // Get the selected channel for this user
      const selectedChannelState = this.getSelectedChannelState(userId, channel.data?.workspace_id?.toString());
      // If this is the selected channel, update favorite status
      if (selectedChannelState.selectedChannelId === channel.id) {
        // Trigger favorite status update in UserWorkspaceEventsStateServiceInheritance
        const coordinatorService = this.getCoordinatorService();
        coordinatorService.updateUserFavoriteStatus(userId, channel.data?.workspace_id?.toString(), channel.cid);
      }
    });
  }

  private handleChannelDeleted(channel: Channel<DefaultGenerics>): void {
    // Only process direct message channels
    if (!this.userChannelsManager.isValidDMChannel(channel)) return;

    // Get affected users before removing from map
    const cid = channel.cid;

    const affectedUsers = this.getUsersForChannel(cid);
    
    // Remove channel from user map via UserChannelsManager
    this.userChannelsManager.removeChannelFromUserMap(cid);
    
    // Notify affected users
    affectedUsers.forEach(userId => {
      this.notifyUserChannelListeners(userId, 'onChannelRemoved', {
        channelId: cid,  
        workspace_id: channel.data?.workspace_id
      });
    });
  }

  /**
   * Update default selected channel if no channel is currently selected
   */
  private updateDefaultSelectedChannelIfNeeded(userId: string, workspace_id?: string): void {
    const key = createWorkspaceKey(userId, workspace_id);
    const currentState = this.selectedChannelStates.get(key);
    
    // If no channel is selected, set the first available channel as default
    if (!currentState || !currentState.selectedChannelId) {
      const userChannels = this.getUserChannels(userId, workspace_id);
      
      if (userChannels.length > 0) {
        const firstChannel = userChannels[0];
        this.setSelectedChannel(userId, workspace_id, firstChannel.id, firstChannel.type || null);
      }
    }
  }

  /**
   * Public method to update channel unread count and notify listeners
   */
  public updateChannelUnreadCount(userId: string, cid: string, unreadCount: number, workspace_id?: string): void {

    const channel = this.mainChannelsService.getChannelById(cid);
    if (!channel) return;

   

    // Only process direct message channels
    if (!this.userChannelsManager.isValidDMChannel(channel)) return;
    this.notifyUserChannelListeners(userId, 'onChannelUnreadCountUpdated', {
      channelId: cid,
      unreadCount: unreadCount,
      workspace_id: workspace_id
    });
  }

  public destroy(): void {
    // Unsubscribe from MainChannelsService callbacks
    this.mainChannelsService.removeMainChannelsServiceCallback(this.mainChannelsServiceCallback);
    
    // UserChannelsMap is managed by UserChannelsManager, no need to clear here
    this.userChannelListeners.clear();
    this.selectedChannelListeners.clear();
    this.selectedChannelStates.clear();
  }

  public getMainChannelsService(): MainChannelsService {
    return this.mainChannelsService;
  }

  /**
   * Get the coordinator service to trigger favorite status updates
   */
  private getCoordinatorService(): UserWorkspaceCoordinatorService {
    return UserWorkspaceCoordinatorService.getInstance(this.mainChannelsService);
  }
}
