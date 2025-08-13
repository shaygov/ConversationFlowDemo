import { Channel, DefaultGenerics, StreamChat } from 'stream-chat';
import { MainChannelsService } from './MainChannelsService';
import { UserChannelsManager } from './UserChannelsManager';

// Global function to generate workspace key
export const createWorkspaceKey = (userId: string, workspace_id?: string): string => {
  return workspace_id ? `${userId}:${workspace_id}` : userId;
};

/**
 * Base class with common functionality for user workspace services
 */
export abstract class UserWorkspaceService {
  protected mainChannelsService: MainChannelsService;
  protected userChannelsManager: UserChannelsManager;
  protected client: StreamChat<DefaultGenerics> | null = null;

  constructor(mainChannelsService: MainChannelsService) {
    this.mainChannelsService = mainChannelsService;
    this.userChannelsManager = UserChannelsManager.getInstance(mainChannelsService);
  }

  /**
   * Get DM channel type constant (delegated to UserChannelsManager)
   */
  protected getDMChannelType(): string {
    return this.userChannelsManager.getDMChannelType();
  }

  /**
   * Validates if a channel exists and is a direct message channel (delegated to UserChannelsManager)
   */
  protected validateDMChannel(cid: string): Channel<DefaultGenerics> | null {
    return this.userChannelsManager.validateDMChannel(cid);
  }

  /**
   * Validates if a channel object is a direct message channel (delegated to UserChannelsManager)
   */
  protected isValidDMChannel(channel: Channel<DefaultGenerics>): boolean {
    return this.userChannelsManager.isValidDMChannel(channel);
  }

  /**
   * Get all channels for a specific user (delegated to UserChannelsManager)
   */
  public getUserChannels(userId: string, workspace_id?: string): Channel<DefaultGenerics>[] {
    return this.userChannelsManager.getUserChannels(userId, workspace_id);
  }

  /**
   * Get all users that are members of a specific channel (delegated to UserChannelsManager)
   */
  protected getUsersForChannel(channelId: string): string[] {
    return this.userChannelsManager.getUsersForChannel(channelId);
  }

  /**
   * Check if a user has any channels (delegated to UserChannelsManager)
   */
  protected hasUserChannels(userId: string): boolean {
    return this.userChannelsManager.hasUserChannels(userId);
  }

  /**
   * Get channel count for a specific user (delegated to UserChannelsManager)
   */
  protected getUserChannelCount(userId: string): number {
    return this.userChannelsManager.getUserChannelCount(userId);
  }

  /**
   * Abstract methods that must be implemented by subclasses
   */
  public abstract isInitialized(): boolean;
  public abstract destroy(): void;
}
