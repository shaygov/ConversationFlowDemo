import { StreamChat, DefaultGenerics } from 'stream-chat';
import { StreamEventSubscriber } from './StreamEventManager';
import { MainChannelsService } from './MainChannelsService';
import { UserEventsState, UserEventsInternalState } from '@/types/userEvents';
import { UserWorkspaceService, createWorkspaceKey } from './UserWorkspaceService';
import { UserWorkspaceCoordinatorService } from './UserWorkspaceCoordinatorService';

// Types for user event listeners
export interface UserEventHandlers {
  onMessageNew?: (data: { cid: string; event: any }) => void;
  onMessageRead?: (data: { cid: string; event: any }) => void;
  onTypingStart?: (data: { cid: string; event: any }) => void;
  onTypingStop?: (data: { cid: string; event: any }) => void;
  onUserPresenceChanged?: (data: { userId: string; event: any }) => void;
}

/**
 * Service for managing user events state
 */
export class UserWorkspaceEventsStateService extends UserWorkspaceService implements StreamEventSubscriber {
  private static instance: UserWorkspaceEventsStateService;
  
  // Listeners for user state changes
  private userStateListeners = new Map<string, Map<string, (state: UserEventsState) => void>>();
  
  // Track which users are being monitored
  private monitoredUsers = new Set<string>();
  
  // User state cache
  private userStates = new Map<string, UserEventsInternalState>();
  
  // Callback for unread count changes (to notify channels service)
  private onUnreadCountChange?: (userId: string, channelId: string, unreadCount: number, workspace_id?: string) => void;

  // Reference to coordinator service for selected channel access
  private coordinatorService: UserWorkspaceCoordinatorService | null = null;

  private constructor(mainChannelsService: MainChannelsService) {
    super(mainChannelsService);
  }

  public static getInstance(mainChannelsService?: MainChannelsService): UserWorkspaceEventsStateService {
    if (!UserWorkspaceEventsStateService.instance) {
      if (!mainChannelsService) {
        throw new Error('MainChannelsService is required for first initialization of UserWorkspaceEventsStateService');
      }
      UserWorkspaceEventsStateService.instance = new UserWorkspaceEventsStateService(mainChannelsService);
    }
    return UserWorkspaceEventsStateService.instance;
  }

  public initialize(client: StreamChat<DefaultGenerics>): void {
    this.client = client;
    
    // UserChannelsMap is now managed by UserChannelsManager, no need to clear here
    this.userStateListeners.clear();
    this.monitoredUsers.clear();
    this.userStates.clear();

    // Initialize coordinator service reference
    this.coordinatorService = UserWorkspaceCoordinatorService.getInstance(this.mainChannelsService);

    // UserChannelsMap is now managed by UserChannelsManager, no need to build here
  }

  public isInitialized(): boolean {
    return this.client !== null && this.mainChannelsService.isInitialized();
  }

  /**
   * Subscribe to user events
   */
  public subscribeToUserEventState(
    userId: string,
    workspace_id: string | undefined,
    onStateChange: (state: UserEventsState) => void
  ): () => void {
    const key = createWorkspaceKey(userId, workspace_id);
    
    if (!this.userStateListeners.has(key)) {
      this.userStateListeners.set(key, new Map());
    }
    
    const userListeners = this.userStateListeners.get(key)!;
    const listenerId = Math.random().toString(36).substr(2, 9);
    userListeners.set(listenerId, onStateChange);
    
    // Mark user as monitored
    this.monitoredUsers.add(userId);
    
    // Initialize user state and load initial data
    this.initializeUserState(userId);
    this.loadInitialUserState(userId, workspace_id);
    
    return () => {
      const userListeners = this.userStateListeners.get(key);
      if (userListeners) {
        userListeners.delete(listenerId);
        if (userListeners.size === 0) {
          this.userStateListeners.delete(key);
        }
      }
      
      // Remove from monitored users if no more listeners
      if (!this.hasAnyListenersForUser(userId)) {
        this.monitoredUsers.delete(userId);
      }
    };
  }

  /**
   * Check if user has any listeners
   */
  private hasAnyListenersForUser(userId: string): boolean {
    const stateKeys = Array.from(this.userStateListeners.keys());
    for (const key of stateKeys) {
      if (key.startsWith(userId + ':') || key === userId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Notify user state listeners
   */
  public notifyUserEventStateListeners(
    userId: string,
    workspace_id?: string,
    isGlobalEvent: boolean = false
  ): void {
    // For global events (like presence), notify all listeners
    if (isGlobalEvent) {
      // Notify all workspace-specific listeners
      const allKeys = Array.from(this.userStateListeners.keys());
      allKeys.forEach(key => {
        if (key.startsWith(userId + ':')) {
          const workspaceListeners = this.userStateListeners.get(key);
          if (workspaceListeners) {
            const workspaceId = key.split(':')[1];
            const state = this.getUserState(userId, workspaceId);
            workspaceListeners.forEach(listener => {
              listener(state);
            });
          }
        }
      });
      
      // Notify global listeners
      const globalListeners = this.userStateListeners.get(userId);
      if (globalListeners) {
        const state = this.getUserState(userId);
        globalListeners.forEach(listener => {
          listener(state);
        });
      }
      return;
    }
    
    // For workspace-specific events, notify only relevant listeners
    if (workspace_id) {
      const workspaceKey = createWorkspaceKey(userId, workspace_id);
      const workspaceListeners = this.userStateListeners.get(workspaceKey);

      if (workspaceListeners && workspaceListeners.size > 0) {
        const state = this.getUserState(userId, workspace_id);
        workspaceListeners.forEach(listener => {
          listener(state);
        });
        return; // Only notify workspace-specific listeners if they exist
      }
    }
    
    // If no workspace-specific listeners or no workspace_id, notify global listeners
    const globalListeners = this.userStateListeners.get(userId);
    if (globalListeners) {
      const state = this.getUserState(userId);
      globalListeners.forEach(listener => {
        listener(state);
      });
    }
  }

  // StreamEventSubscriber interface implementation
  onMessageNew(cid: string, event: any): void {
    const channel = this.userChannelsManager.validateDMChannel(cid);
    if (!channel) return;
    
    const affectedUsers = this.getUsersForChannel(cid);
    
    affectedUsers.forEach(userId => {
      if (this.monitoredUsers.has(userId)) {
        const currentCount = this.getUserState(userId, channel?.data?.workspace_id?.toString())?.totalUnreadCount || 0;
        this.updateUserUnreadCount(userId, cid, currentCount + 1);
      }
    });
  }

  onMessageRead(cid: string, event: any): void {
    const channel = this.userChannelsManager.validateDMChannel(cid);
    if (!channel) return;
    
    const affectedUsers = this.getUsersForChannel(cid);

    affectedUsers.forEach(userId => {
      if (this.monitoredUsers.has(userId)) {
        this.updateUserUnreadCount(userId, cid, 0);
      }
    });
  }

  onTypingStart(cid: string, event: any): void {
    const channel = this.userChannelsManager.validateDMChannel(cid);
    if (!channel) return;
    
    const affectedUsers = this.getUsersForChannel(cid);
    affectedUsers.forEach(userId => {
      if (this.monitoredUsers.has(userId)) {
        this.updateUserTypingState(userId, cid, true);
        this.notifyUserEventStateListeners(userId, channel?.data?.workspace_id?.toString());
      }
    });
  }

  onTypingStop(cid: string, event: any): void {
    const channel = this.userChannelsManager.validateDMChannel(cid);
    if (!channel) return;
    
    const affectedUsers = this.getUsersForChannel(cid);
    affectedUsers.forEach(userId => {
      if (this.monitoredUsers.has(userId)) {
        this.updateUserTypingState(userId, cid, false);
        this.notifyUserEventStateListeners(userId, channel?.data?.workspace_id?.toString());
      }
    });
  }

  onUserPresenceChanged(userId: string, event: any): void {
    if (this.monitoredUsers.has(userId)) {
      const presence = event.user?.online;
      this.updateUserOnlineStatus(userId, presence === true);
      this.notifyUserEventStateListeners(userId, undefined, true);
    }
  }

  /**
   * Get user state (isTyping, totalUnreadCount, isOnline, isFavorite)
   */
  public getUserState(userId: string, workspace_id?: string): UserEventsState {
    const userState = this.userStates.get(userId);
    if (!userState) {
      return {
        id: userId,
        name: this.getUserName(userId),
        workspace_id: workspace_id,
        isTyping: false,
        totalUnreadCount: 0,
        isOnline: false,
        isFavorite: false,
      };
    }

    // Calculate total unread count
    const totalUnreadCount = Array.from(userState.unreadCounts.entries())
      .filter(([channelId]) => {
        if (workspace_id === undefined) {
          return true; // Include all channels if no workspace filter
        }
        const channel = this.mainChannelsService.getChannelById(channelId);
        const channelWorkspaceId = channel?.data?.workspace_id?.toString();
        return channelWorkspaceId === workspace_id;
      })
      .reduce((sum, [, count]) => sum + count, 0);

    return {
      id: userId,
      name: this.getUserName(userId),
      workspace_id: workspace_id,
      isTyping: userState.isTyping,
      totalUnreadCount,
      isOnline: userState.isOnline,
      isFavorite: userState.isFavorite,
    };
  }

  /**
   * Get initial user state data (for hook initialization)
   */
  public getInitialUserEventState(userId: string, workspace_id?: string): UserEventsState {
    this.initializeUserState(userId);
    
    if (!this.monitoredUsers.has(userId)) {
      this.monitoredUsers.add(userId);
    }
    
    this.loadInitialUserState(userId, workspace_id);

    const usrState = this.getUserState(userId, workspace_id);


    return usrState;
  }

  /**
   * Initialize user state
   */
  private initializeUserState(userId: string): void {
    if (!this.userStates.has(userId)) {
      this.userStates.set(userId, {
        isTyping: false,
        totalUnreadCount: 0,
        isOnline: false,
        isFavorite: false,
        typingChannels: new Set(),
        unreadCounts: new Map(),
      } as UserEventsInternalState);
    }
  }

  /**
   * Update user typing state
   */
  private updateUserTypingState(userId: string, channelId: string, isTyping: boolean): void {
    this.initializeUserState(userId);
    const userState = this.userStates.get(userId)!;
    
    if (isTyping) {
      userState.typingChannels.add(channelId);
    } else {
      userState.typingChannels.delete(channelId);
    }
    
    userState.isTyping = userState.typingChannels.size > 0;
  }

  /**
   * Update user unread count
   */
  public updateUserUnreadCount(userId: string, cid: string, count: number): void {
    const channel = this.userChannelsManager.validateDMChannel(cid);
    if (!channel) return;
    
    if (count > 0) {
      this.setUnreadCount(userId, channel.cid, count);
    } else {
      this.clearUnreadCount(userId, channel.cid);
    }
  }

  private setUnreadCount(userId: string, cid: string, count: number): void {
    this.initializeUserState(userId);
    const userState = this.userStates.get(userId)!;
    userState.unreadCounts.set(cid, count);

    // Notify unread count change callback
    if (this.onUnreadCountChange) {
      const workspace_id = this.getWorkspaceIdFromCid(cid);
      this.onUnreadCountChange(userId, cid, count, workspace_id);
    }

    // Notify state listeners about the change
    const workspace_id = this.getWorkspaceIdFromCid(cid);
    this.notifyUserEventStateListeners(userId, workspace_id);
  }

  private clearUnreadCount(userId: string, cid: string): void {
    this.initializeUserState(userId);
    const userState = this.userStates.get(userId)!;
    userState.unreadCounts.delete(cid);

    // Notify unread count change callback
    if (this.onUnreadCountChange) {
      const workspace_id = this.getWorkspaceIdFromCid(cid);
      this.onUnreadCountChange(userId, cid, 0, workspace_id);
    }

    // Notify state listeners about the change
    const workspace_id = this.getWorkspaceIdFromCid(cid);
    this.notifyUserEventStateListeners(userId, workspace_id);
  }

  /**
   * Update user online status
   */
  private updateUserOnlineStatus(userId: string, isOnline: boolean): void {
    this.initializeUserState(userId);
    const userState = this.userStates.get(userId)!;
    userState.isOnline = isOnline;
  }

  /**
   * Update user favorite status
   */
  public updateUserFavoriteStatus(userId: string, workspace_id?: string, cid?: string | null): void {
    this.initializeUserState(userId);
    const userState = this.userStates.get(userId)!;
    
    if (!cid) {
      userState.isFavorite = false;
      return;
    }

    const channel = this.mainChannelsService.getChannelById(cid);
   
    if (!channel || !this.userChannelsManager.isValidDMChannel(channel)) {
      userState.isFavorite = false;
      return;
    }

    const favoriteBy = channel.data?.favorite_by as string[] | undefined;
    const newIsFavorite = Array.isArray(favoriteBy) && favoriteBy.includes(this.client?.userID);

    if (userState.isFavorite !== newIsFavorite) {
      userState.isFavorite = newIsFavorite;
      this.notifyUserEventStateListeners(userId, workspace_id);
    }
  }

  /**
   * Load initial user state from existing channels
   */
  private loadInitialUserState(userId: string, workspace_id?: string): void {
    const userChannels = this.getUserChannels(userId, workspace_id);
    const userState = this.userStates.get(userId)!;
    
    // Load unread counts
    userChannels.forEach(channel => {
      const unreadCount = channel.countUnread() || 0;
      if (unreadCount > 0) {
        userState.unreadCounts.set(channel.cid, unreadCount);
      }
    });
    
    // Try to get selected channel from coordinator first
    let channel = null;
    if (this.coordinatorService) {
      const selectedChannelState = this.coordinatorService.getSelectedChannelState(userId, workspace_id);
      
      if (selectedChannelState.selectedChannelId && selectedChannelState.selectedChannelType) {
        const selectedChannel = this.mainChannelsService.getChannelById(
          `${selectedChannelState.selectedChannelType}:${selectedChannelState.selectedChannelId}`
        );
        if (selectedChannel) {
          channel = selectedChannel;
        }
      }
    }
    
    // Fallback to first channel if no selected channel found
    if (!channel && userChannels.length > 0) {
      channel = userChannels[0];
    }
    
    // Load online status from selected/first channel
    const user = channel?.state?.members?.[userId]?.user;

    const favoriteBy = channel?.data?.favorite_by as string[] | undefined;
    const newIsFavorite = Array.isArray(favoriteBy) && favoriteBy.includes(this.client?.userID);

    if (user) {
      userState.isOnline = user.online === true;
      userState.isFavorite = newIsFavorite;
    }
  }

  public destroy(): void {
    // UserChannelsMap is now managed by UserChannelsManager, no need to clear here
    this.userStateListeners.clear();
    this.monitoredUsers.clear();
    this.userStates.clear();
    this.client = null;
    this.coordinatorService = null;
  }

  public clearClient(): void {
    this.client = null;
  }

  public getClient(): StreamChat<DefaultGenerics> | null {
    return this.client;
  }

  public getMainChannelsService(): MainChannelsService {
    return this.mainChannelsService;
  }
  
  /**
   * Extract workspace ID from channel CID
   */
  private getWorkspaceIdFromCid(cid: string): string | undefined {
    const channel = this.mainChannelsService.getChannelById(cid);
    return channel ? this.userChannelsManager.getChannelWorkspaceId(channel) : undefined;
  }

  /**
   * Get user name from channels or client
   */
  private getUserName(userId: string): string {
    // Try to get user name from channels first
    const userChannels = this.getUserChannels(userId);
    for (const channel of userChannels) {
      const user = channel?.state?.members?.[userId]?.user;
      if (user?.name) {
        return user.name;
      }
    }
    
    // Fallback to client user data
    if (this.client?.userID === userId) {
      return this.client.user?.name || '';
    }
    
    return '';
  }
  
  /**
   * Set callback for unread count changes
   */
  public setUnreadCountChangeCallback(callback: (userId: string, channelId: string, unreadCount: number, workspace_id?: string) => void): void {
    this.onUnreadCountChange = callback;
  }
}
