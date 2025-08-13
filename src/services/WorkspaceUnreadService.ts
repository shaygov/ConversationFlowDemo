import { StreamChat, DefaultGenerics, Channel } from 'stream-chat';
import { StreamEventSubscriber, StreamEventManager } from './StreamEventManager';
import { MainChannelsService } from './MainChannelsService';

export class WorkspaceUnreadService implements StreamEventSubscriber {
  private static instance: WorkspaceUnreadService | null = null;
  private client: StreamChat<DefaultGenerics> | null = null;
  private channelsService: MainChannelsService | null = null;
  private streamEventManager: StreamEventManager | null = null;
  private unreadCounts: Map<string, number> = new Map(); // workspace_id -> unread_count
  private listeners: Set<(counts: Map<string, number>) => void> = new Set();
  private unsubscribeFromEvents: (() => void) | null = null;

  private constructor() {}

  public static getInstance(): WorkspaceUnreadService {
    if (!WorkspaceUnreadService.instance) {
      WorkspaceUnreadService.instance = new WorkspaceUnreadService();
    }
    return WorkspaceUnreadService.instance;
  }

  public async initialize(
    client: StreamChat<DefaultGenerics>,
    channelsService: MainChannelsService,
    streamEventManager: StreamEventManager
  ): Promise<void> {
    this.client = client;
    this.channelsService = channelsService;
    this.streamEventManager = streamEventManager;

    // Clear previous unread counts for new initialization
    this.unreadCounts.clear();

    // Subscribe to Stream events
    this.unsubscribeFromEvents = this.streamEventManager.subscribe(this);

    // Initial calculation of unread counts
    await this.calculateAllUnreadCounts();
  }

  public isInitialized(): boolean {
    return this.client !== null && this.channelsService !== null && this.streamEventManager !== null;
  }

  /**
   * Calculate unread counts for all workspaces
   */
  private async calculateAllUnreadCounts(): Promise<void> {
    if (!this.client || !this.channelsService) return;

    try {
      
      // Use the main method that handles all logic internally
      const allChannels = await this.channelsService.getChannelsForFilters(
        {
          request: {
            members: {
              $in: [this.client.userID]
            }
          }
        },
        true // forceRefresh = true to ensure fresh data
      );

      // Clear previous counts
      this.unreadCounts.clear();

      // Group unread counts by workspace_id
      allChannels.forEach(channel => {
        const workspaceId = channel.data?.workspace_id;
        if (!workspaceId) return;

        const workspaceIdStr = String(workspaceId);
        const unreadCount = channel.countUnread ? channel.countUnread() : 0;
        
        if (unreadCount > 0) {
          const currentCount = this.unreadCounts.get(workspaceIdStr) || 0;
          this.unreadCounts.set(workspaceIdStr, currentCount + unreadCount);
        }
      });

      // Notify listeners
      this.notifyListeners();
    } catch (error) {
      console.error('WorkspaceUnreadService: Error calculating unread counts:', error);
    }
  }

  /**
   * Get unread count for specific workspace
   */
  public getUnreadCount(workspaceId: string | number): number {
    return this.unreadCounts.get(String(workspaceId)) || 0;
  }

  /**
   * Get all unread counts
   */
  public getAllUnreadCounts(): Map<string, number> {
    return new Map(this.unreadCounts);
  }

  /**
   * Subscribe to unread count changes
   */
  public subscribe(listener: (counts: Map<string, number>) => void): () => void {
    this.listeners.add(listener);
    
    // Immediately call with current counts
    listener(this.getAllUnreadCounts());
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners about count changes
   */
  private notifyListeners(): void {
    const counts = this.getAllUnreadCounts();
    this.listeners.forEach(listener => {
      try {
        listener(counts);
      } catch (error) {
        console.error('WorkspaceUnreadService: Error notifying listener:', error);
      }
    });
  }

  /**
   * StreamEventSubscriber implementation - handle new messages
   */
  public onMessageNew(channelId: string, event: any): void {
    // Check for workspace_id in channel_custom first, then fallback to channel.data
    const workspaceId = event.channel_custom?.workspace_id || event.channel?.data?.workspace_id;
    if (!workspaceId) {
      return;
    }
    
    const workspaceIdStr = String(workspaceId);
    const currentCount = this.unreadCounts.get(workspaceIdStr) || 0;
    // Increment unread count if message is not from current user
    this.unreadCounts.set(workspaceIdStr, currentCount + 1);
    this.notifyListeners();
  }

  /**
   * StreamEventSubscriber implementation - handle message read events
   */
  public onMessageRead(channelId: string, event: any): void {
    // When messages are read, recalculate counts for affected workspace
    const workspaceId = event.channel_custom?.workspace_id || event.channel?.data?.workspace_id;
    if (workspaceId) {
      this.recalculateWorkspaceUnread(String(workspaceId));
    }
  }

  /**
   * Recalculate unread count for specific workspace
   */
  private async recalculateWorkspaceUnread(workspaceId: string): Promise<void> {
    if (!workspaceId || !this.channelsService || !this.client) return;

    try {
      // Use the main method that handles all logic internally
      const workspaceChannels = await this.channelsService.getChannelsForFilters(
        {
          request: {
            members: {
              $in: [this.client.userID]
            },
            workspace_id: workspaceId
          }
        },
        true // forceRefresh = true
      );

      // Calculate total unread for this workspace
      const totalUnread = workspaceChannels.reduce((sum: number, channel: any) => {
        const unreadCount = channel.countUnread ? channel.countUnread() : 0;
        return sum + unreadCount;
      }, 0);

      // Update the count
      if (totalUnread > 0) {
        this.unreadCounts.set(workspaceId, totalUnread);
      } else {
        this.unreadCounts.delete(workspaceId);
      }

      this.notifyListeners();
    } catch (error) {
      console.error('WorkspaceUnreadService: Error recalculating workspace unread:', error);
    }
  }

  /**
   * Manually refresh all unread counts
   */
  public async refresh(): Promise<void> {
    await this.calculateAllUnreadCounts();
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    if (this.unsubscribeFromEvents) {
      this.unsubscribeFromEvents();
      this.unsubscribeFromEvents = null;
    }
    
    this.listeners.clear();
    this.unreadCounts.clear();
    this.client = null;
    this.channelsService = null;
    this.streamEventManager = null;
  }

  /**
   * Get debug info
   */
  public getDebugInfo(): {
    isInitialized: boolean;
    unreadCounts: Record<string, number>;
    listenerCount: number;
  } {
    return {
      isInitialized: this.isInitialized(),
      unreadCounts: Object.fromEntries(this.unreadCounts),
      listenerCount: this.listeners.size,
    };
  }
} 