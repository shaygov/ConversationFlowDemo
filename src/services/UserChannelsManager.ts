import { Channel, DefaultGenerics } from 'stream-chat';
import { MainChannelsService } from './MainChannelsService';
import { CHANNEL_TYPES } from "@/constants/chat";

export class UserChannelsManager {
  private static instance: UserChannelsManager;
  private userChannelsMap: Map<string, Set<string>> = new Map();
  private mainChannelsService: MainChannelsService;
  private readonly DM_CHANNEL_TYPE = CHANNEL_TYPES.dm.value;

  private constructor(mainChannelsService: MainChannelsService) {
    this.mainChannelsService = mainChannelsService;
  }

  public static getInstance(mainChannelsService: MainChannelsService): UserChannelsManager {
    if (!UserChannelsManager.instance) {
      UserChannelsManager.instance = new UserChannelsManager(mainChannelsService);
    }
    return UserChannelsManager.instance;
  }

  /**
   * Get the DM channel type constant
   */
  public getDMChannelType(): string {
    return this.DM_CHANNEL_TYPE;
  }

  /**
   * Validates if a channel exists and is a direct message channel
   */
  public validateDMChannel(cid: string): Channel<DefaultGenerics> | null {
    const channel = this.mainChannelsService.getChannelById(cid);
    if (!channel || (channel.type !== this.DM_CHANNEL_TYPE)) {
      return null;
    }
    return channel;
  }

  /**
   * Validates if a channel object is a direct message channel
   */
  public isValidDMChannel(channel: Channel<DefaultGenerics>): boolean {
    return channel.type === this.DM_CHANNEL_TYPE;
  }

  /**
   * Check if a user is a member of a specific channel
   */
  public isUserMemberOfChannel(channel: Channel<DefaultGenerics>, userId: string): boolean {
    if (!this.isValidDMChannel(channel)) return false;
    
    const members = channel.state?.members || {};
    return Object.keys(members).some(memberId => 
      memberId === `user_${userId}` || memberId === userId
    );
  }

  /**
   * Get channel workspace ID
   */
  public getChannelWorkspaceId(channel: Channel<DefaultGenerics>): string | undefined {
    return channel.data?.workspace_id?.toString();
  }

  /**
   * Check if channel belongs to specific workspace
   */
  public isChannelInWorkspace(channel: Channel<DefaultGenerics>, workspaceId: string): boolean {
    const channelWorkspaceId = this.getChannelWorkspaceId(channel);
    return channelWorkspaceId === workspaceId;
  }

  /**
   * Build user-channels map from all cached channels
   */
  public buildUserChannelsMap(): void {
    if (!this.mainChannelsService) return;
    
    this.clearUserChannelsMap();
    
    const allChannels = this.mainChannelsService.getAllCachedChannels();

    allChannels.forEach(channel => {
      this.addChannelToUserMap(channel);
    });
    
  }

  /**
   * Add a channel to the user-channels map
   */
  public addChannelToUserMap(channel: Channel<DefaultGenerics>): void {

    if (!this.isValidDMChannel(channel)) return;
    
    
    if (!channel.state?.members) return;
    
    const membersArr = Array.isArray(channel.state.members)
      ? channel.state.members
      : Object.values(channel.state.members);

    membersArr.forEach((member: any) => {
      if (member?.user?.id) {
        const userId = member.user.id;
        if (!this.userChannelsMap.has(userId)) {
          this.userChannelsMap.set(userId, new Set());
        }
        
        this.userChannelsMap.get(userId)!.add(channel.cid);
      }
    });
  }

  /**
   * Remove a channel from the user-channels map
   */
  public removeChannelFromUserMap(channelId: string): void {
    this.userChannelsMap.forEach((channels, userId) => {
      channels.delete(channelId);
    });
  }

  /**
   * Get all users that are members of a specific channel
   */
  public getUsersForChannel(channelId: string): string[] {
    const users: string[] = [];
    this.userChannelsMap.forEach((channels, userId) => {
      if (channels.has(channelId)) {
        users.push(userId);
      }
    });
    return users;
  }

  /**
   * Get all channels for a specific user
   */
  public getUserChannels(userId: string, workspace_id?: string): Channel<DefaultGenerics>[] {
    const userChannels = this.userChannelsMap.get(userId) || new Set();
    const channels: Channel<DefaultGenerics>[] = [];
    
    userChannels.forEach(channelId => {
      const channel = this.mainChannelsService.getChannelById(channelId);
      if (channel) {
        if (!this.isValidDMChannel(channel)) return;
        
        const channelWorkspaceId = this.getChannelWorkspaceId(channel);
        if (workspace_id === undefined || channelWorkspaceId === workspace_id) {
          channels.push(channel);
        }
      }
    });
    return channels;
  }

  /**
   * Clear user channels map
   */
  public clearUserChannelsMap(): void {
    this.userChannelsMap.clear();
  }

  /**
   * Get the raw user channels map for internal use
   */
  public getUserChannelsMap(): Map<string, Set<string>> {
    return this.userChannelsMap;
  }

  /**
   * Check if a user has any channels
   */
  public hasUserChannels(userId: string): boolean {
    const userChannels = this.userChannelsMap.get(userId);
    return userChannels ? userChannels.size > 0 : false;
  }

  /**
   * Get channel count for a specific user
   */
  public getUserChannelCount(userId: string): number {
    const userChannels = this.userChannelsMap.get(userId);
    return userChannels ? userChannels.size : 0;
  }

  /**
   * Destroy the manager instance
   */
  public destroy(): void {
    this.clearUserChannelsMap();
    UserChannelsManager.instance = null as any;
  }
}
