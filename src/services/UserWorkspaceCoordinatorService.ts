import { StreamChat, DefaultGenerics } from 'stream-chat';
import { Channel } from 'stream-chat';
import { UserWorkspaceEventsStateService, UserEventHandlers } from './UserWorkspaceEventsStateService';
import { UserWorkspaceChannelsService, UserChannelHandlers, SelectedChannelState } from './UserWorkspaceChannelsService';
import { MainChannelsService } from './MainChannelsService';
import { UserChannelsManager } from './UserChannelsManager';
import { UserEventsState } from '@/types/userEvents';

export class UserWorkspaceCoordinatorService {
  private static instance: UserWorkspaceCoordinatorService;
  private UserWorkspaceEventsStateService: UserWorkspaceEventsStateService;
  private UserWorkspaceChannelsService: UserWorkspaceChannelsService;
  private UserChannelsManager: UserChannelsManager;
  private mainChannelsService: MainChannelsService;
  private client: StreamChat<DefaultGenerics> | null = null;

  private constructor(mainChannelsService: MainChannelsService) {
    this.mainChannelsService = mainChannelsService;
    this.UserChannelsManager = UserChannelsManager.getInstance(mainChannelsService);
    this.UserWorkspaceEventsStateService = UserWorkspaceEventsStateService.getInstance(mainChannelsService);
    this.UserWorkspaceChannelsService = UserWorkspaceChannelsService.getInstance(mainChannelsService);
  }

  public static getInstance(mainChannelsService?: MainChannelsService): UserWorkspaceCoordinatorService {
    if (!UserWorkspaceCoordinatorService.instance) {
      if (!mainChannelsService) {
        throw new Error('MainChannelsService is required for first initialization of UserWorkspaceCoordinatorService');
      }
      UserWorkspaceCoordinatorService.instance = new UserWorkspaceCoordinatorService(mainChannelsService);
    }
    return UserWorkspaceCoordinatorService.instance;
  }

  public initialize(client: StreamChat<DefaultGenerics>): void {
    this.client = client;
    
    // Build user channels map once in the coordinator using UserChannelsManager
    this.UserChannelsManager.buildUserChannelsMap();

    // console.log('UserChannelsManager', this.UserChannelsManager.getUserChannelsMap());
    
    // Initialize both services (they now use the shared UserChannelsManager)
    this.UserWorkspaceEventsStateService.initialize(client);
    this.UserWorkspaceChannelsService.initialize();
    
    // Set up coordination between services
    this.UserWorkspaceEventsStateService.setUnreadCountChangeCallback((userId, cid, unreadCount, workspace_id) => {
      this.UserWorkspaceChannelsService.updateChannelUnreadCount(userId, cid, unreadCount, workspace_id);
    });
  }

  public isInitialized(): boolean {
    return this.UserWorkspaceEventsStateService.isInitialized() && this.UserWorkspaceChannelsService.isInitialized();
  }

  // Delegate methods to UserWorkspaceEventsStateService
  public subscribeToUserEventState(
    userId: string, 
    workspace_id: string | undefined, 
    onStateChange: (state: UserEventsState) => void
  ): () => void {
    return this.UserWorkspaceEventsStateService.subscribeToUserEventState(userId, workspace_id, onStateChange);
  }
  
  public getUserState(userId: string, workspace_id?: string): UserEventsState {
    return this.UserWorkspaceEventsStateService.getUserState(userId, workspace_id);
  }
  
  public getInitialUserEventState(userId: string, workspace_id?: string): UserEventsState {
    return this.UserWorkspaceEventsStateService.getInitialUserEventState(userId, workspace_id);
  }
  
  public updateUserFavoriteStatus(userId: string, workspace_id?: string, cid?: string | null): void {
   
    return this.UserWorkspaceEventsStateService.updateUserFavoriteStatus(userId, workspace_id, cid);
  }

  // Delegate methods to UserWorkspaceChannelsService
  public subscribeToUserChannels(
    userId: string, 
    workspace_id: string | undefined, 
    handlers: UserChannelHandlers
  ): () => void {
    return this.UserWorkspaceChannelsService.subscribeToUserChannels(userId, workspace_id, handlers);
  }
  
  public subscribeToSelectedChannel(
    userId: string, 
    workspace_id: string | undefined, 
    onStateChange: (state: SelectedChannelState) => void
  ): () => void {
    return this.UserWorkspaceChannelsService.subscribeToSelectedChannel(userId, workspace_id, onStateChange);
  }
  
  public setSelectedChannel(
    userId: string, 
    workspace_id: string | undefined, 
    channelId: string | null, 
    channelType: string | null
  ): void {
    return this.UserWorkspaceChannelsService.setSelectedChannel(userId, workspace_id, channelId, channelType);
  }
  
  public getSelectedChannelState(userId: string, workspace_id?: string): SelectedChannelState {
    return this.UserWorkspaceChannelsService.getSelectedChannelState(userId, workspace_id);
  }
  
  public getUserChannels(userId: string, workspace_id?: string): Channel<DefaultGenerics>[] {
    return this.UserWorkspaceChannelsService.getUserChannels(userId, workspace_id);
  }

  /**
   * Coordinated method to set selected channel and update favorite status
   */
  public setSelectedChannelWithFavoriteUpdate(
    userId: string,
    workspace_id: string | undefined,
    channelId: string | null,
    channelType: string | null
  ): void {
    // Set selected channel in channels service
    this.UserWorkspaceChannelsService.setSelectedChannel(userId, workspace_id, channelId, channelType);
    
    // Update favorite status in events service
    const cid = channelId && channelType ? `${channelType}:${channelId}` : null;
    this.UserWorkspaceEventsStateService.updateUserFavoriteStatus(userId, workspace_id, cid);
  }

  /**
   * Coordinated method to update channel unread count
   */
  public updateChannelUnreadCount(
    userId: string,
    channelId: string,
    unreadCount: number,
    workspace_id?: string
  ): void {
    // Update in events service (this will trigger state listeners)
    const channel = this.mainChannelsService.getChannelById(channelId);
    if (channel) {
      this.UserWorkspaceEventsStateService.updateUserUnreadCount(userId, channel.cid, unreadCount);
      this.UserWorkspaceEventsStateService.notifyUserEventStateListeners(userId, workspace_id);
    }
    
    // Update in channels service (this will trigger channel listeners)
    this.UserWorkspaceChannelsService.updateChannelUnreadCount(userId, channelId, unreadCount, workspace_id);
  }

  /**
   * Get all services for direct access when needed
   */
  public getEventsService(): UserWorkspaceEventsStateService {
    return this.UserWorkspaceEventsStateService;
  }

  public getChannelsService(): UserWorkspaceChannelsService {
    return this.UserWorkspaceChannelsService;
  }

  public getChannelsManager(): UserChannelsManager {
    return this.UserChannelsManager;
  }

  public destroy(): void {
    this.UserWorkspaceEventsStateService.destroy();
    this.UserWorkspaceChannelsService.destroy();
    this.UserChannelsManager.destroy();
    this.client = null;
  }

  public clearClient(): void {
    this.UserWorkspaceEventsStateService.clearClient();
    this.client = null;
  }

  public getClient(): StreamChat<DefaultGenerics> | null {
    return this.client;
  }

  public getMainChannelsService(): MainChannelsService {
    return this.mainChannelsService;
  }
}
