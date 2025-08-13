import { Channel, DefaultGenerics, StreamChat, ChannelFilters as StreamChannelFilters } from 'stream-chat';
import { MainChannelsService, ChannelChangeEvent, MainChannelsServiceCallback } from './MainChannelsService';

export interface ChannelFilters {
  request: StreamChannelFilters<DefaultGenerics>;
  local?: Record<string, any>;
}

// Interface for fields that determine cache groups (same as UsersChannelsService)
export interface CacheGroupFields {
  type?: string;
  workspace_id?: string;
  // Add more fields here as needed
  // team_id?: string;
  // category?: string;
  // etc.
}

export interface GroupedChannels {
  channelIds: string[];
  filters: ChannelFilters;
  lastUpdated: number;
}

export class GroupChannelsService implements MainChannelsServiceCallback {
  private static instance: GroupChannelsService;
  private client: StreamChat<DefaultGenerics> | null = null;
  private mainChannelsService: MainChannelsService | null = null;
  
  // Local cache for grouped channels - stores only channel IDs
  private groupedChannelsCache = new Map<string, GroupedChannels>();
  
  // Listeners for filter groups
  private groupListeners = new Map<string, Set<(channels: Channel<DefaultGenerics>[]) => void>>();

  private constructor() {}

  public static getInstance(): GroupChannelsService {
    if (!GroupChannelsService.instance) {
      GroupChannelsService.instance = new GroupChannelsService();
    }
    return GroupChannelsService.instance;
  }

  public initialize(client: StreamChat<DefaultGenerics>, mainChannelsService: MainChannelsService): void {
    this.client = client;
    this.mainChannelsService = mainChannelsService;
    
    // Clear previous caches and listeners for new initialization
    this.groupedChannelsCache.clear();
    this.groupListeners.clear();
    
    // Subscribe to MainChannelsService events using new interface
    this.mainChannelsService.addMainChannelsServiceCallback(this);
  }

  public destroy(): void {
    // Unsubscribe from MainChannelsService events
    if (this.mainChannelsService) {
      this.mainChannelsService.removeMainChannelsServiceCallback(this);
    }

    // Clear all caches and listeners
    this.groupedChannelsCache.clear();
    this.groupListeners.clear();
    
    // Clear client and service references
    this.client = null;
    this.mainChannelsService = null;
  }

  /**
   * MainChannelsServiceCallback interface implementation
   */
  onChannelCreated(channel: Channel<DefaultGenerics>): void {
    this.handleChannelCreated(channel);
  }

  onChannelUpdated(channel: Channel<DefaultGenerics>): void {
    this.handleChannelUpdated(channel);
  }

  onChannelDeleted(channel: Channel<DefaultGenerics>): void {
    this.handleChannelDeleted(channel);
  }

  /**
   * Extract cache group fields from channel data
   * 
   * TO ADD NEW FIELDS:
   * 1. Add the field to CacheGroupFields interface above
   * 2. Add the field extraction here
   * 3. The rest of the functionality will automatically work!
   */
  private extractCacheGroupFields(channel: Channel<DefaultGenerics>): CacheGroupFields {
    const channelData = channel.data || {};
    return {
      type: channelData.type as string,
      workspace_id: channelData.workspace_id as string,
      // Add more fields here as needed when they are added to CacheGroupFields interface
      // team_id: channelData.team_id as string,
      // category: channelData.category as string,
    };
  }

  /**
   * Check if a channel matches a cache group
   */
  private channelMatchesCacheGroup(channel: Channel<DefaultGenerics>, cacheGroupFields: CacheGroupFields): boolean {
    const channelFields = this.extractCacheGroupFields(channel);
    
    // Check each field in the cache group
    for (const [key, value] of Object.entries(cacheGroupFields)) {
      if (value !== undefined && channelFields[key as keyof CacheGroupFields] !== value) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Parse cache key back to CacheGroupFields
   */
  private parseCacheKeyToFields(cacheKey: string): CacheGroupFields {
    try {
      return JSON.parse(cacheKey);
    } catch {
      return {};
    }
  }

  /**
   * Handle newly created channel
   */
  private handleChannelCreated(channel: Channel<DefaultGenerics>): void {
    // Find all cache groups that this channel should be added to
    const affectedCacheKeys: string[] = [];
    
    this.groupedChannelsCache.forEach((groupedChannels, cacheKey) => {
      const cacheGroupFields = this.parseCacheKeyToFields(cacheKey);
      
      // Check if this channel matches this cache group
      if (this.channelMatchesCacheGroup(channel, cacheGroupFields)) {
        affectedCacheKeys.push(cacheKey);
        
        // Add channel to the cache group if not already there
        if (!groupedChannels.channelIds.includes(channel.cid)) {
          groupedChannels.channelIds.push(channel.cid);
          groupedChannels.lastUpdated = Date.now();
        }
      }
    });
    
    // Notify affected groups
    if (affectedCacheKeys.length > 0) {
      this.notifyGroups(affectedCacheKeys);
    }
  }

  /**
   * Handle channel update
   */
  private handleChannelUpdated(channel: Channel<DefaultGenerics>): void {
    // For updates, we just need to notify existing groups that contain this channel
    const affectedCacheKeys: string[] = [];
    
    this.groupedChannelsCache.forEach((groupedChannels, cacheKey) => {
      if (groupedChannels.channelIds.includes(channel.cid)) {
        affectedCacheKeys.push(cacheKey);
        groupedChannels.lastUpdated = Date.now();
      }
    });
    
    // Notify affected groups
    if (affectedCacheKeys.length > 0) {
      this.notifyGroups(affectedCacheKeys);
    }
  }

  /**
   * Handle channel deletion
   */
  private handleChannelDeleted(channel: Channel<DefaultGenerics>): void {
    const channelId = channel.cid;
    
    // Find all cache groups that this channel should be removed from
    const affectedCacheKeys: string[] = [];
    
    this.groupedChannelsCache.forEach((groupedChannels, cacheKey) => {
      const existingIndex = groupedChannels.channelIds.indexOf(channelId);
      if (existingIndex >= 0) {
        affectedCacheKeys.push(cacheKey);
        
        // Remove channel from the cache group
        groupedChannels.channelIds.splice(existingIndex, 1);
        groupedChannels.lastUpdated = Date.now();
      }
    });
    
    // Notify affected groups
    if (affectedCacheKeys.length > 0) {
      this.notifyGroups(affectedCacheKeys);
    }
  }

  /**
   * Get channels for specific filters
   */
  public async getChannelsForFilters(filters: ChannelFilters, forceRefresh: boolean = false): Promise<Channel<DefaultGenerics>[]> {
    const cacheKey = this.getCacheKey(filters);
    const cachedGroup = this.groupedChannelsCache.get(cacheKey);
    
    if (cachedGroup && !forceRefresh) {
      // Return cached channels
      return this.getChannelsByIds(cachedGroup.channelIds);
    }
    
    // If not cached or force refresh, use MainChannelsService
    if (this.mainChannelsService) {
      // Use the main method that handles all logic internally
      const channels = await this.mainChannelsService.getChannelsForFilters(
        { request: filters.request, local: filters.local },
        forceRefresh
      );
      
      // Cache the channel IDs
      const channelIds = channels.map(channel => channel.cid);
      this.cacheGroupedChannels(cacheKey, channelIds, filters);
      
      return channels;
    }
    
    return [];
  }

  /**
   * Get channel objects by their IDs from MainChannelsService
   */
  private getChannelsByIds(channelIds: string[]): Channel<DefaultGenerics>[] {
    if (!this.mainChannelsService) {
      return [];
    }

    const channels: Channel<DefaultGenerics>[] = [];
    for (const channelId of channelIds) {
      const channel = this.mainChannelsService.getChannelById(channelId);
      if (channel) {
        channels.push(channel);
      }
    }
    
    return channels;
  }

  /**
   * Subscribe to changes for a specific filter group
   */
  public subscribeToGroup(
    filters: ChannelFilters, 
    listener: (channels: Channel<DefaultGenerics>[]) => void
  ): () => void {
    const cacheKey = this.getCacheKey(filters);
    
    if (!this.groupListeners.has(cacheKey)) {
      this.groupListeners.set(cacheKey, new Set());
    }
    
    this.groupListeners.get(cacheKey)!.add(listener);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.groupListeners.get(cacheKey);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.groupListeners.delete(cacheKey);
        }
      }
    };
  }

  /**
   * Clear cache for specific filters or all cache
   */
  public clearCache(filters?: ChannelFilters): void {
    if (filters) {
      const cacheKey = this.getCacheKey(filters);
      this.groupedChannelsCache.delete(cacheKey);
    } else {
      this.groupedChannelsCache.clear();
    }
  }

 

  /**
   * Update channel in cache when it changes
   */
  public updateChannelInCache(channel: Channel<DefaultGenerics>): void {
    const channelId = channel.cid;
    const affectedGroups = new Set<string>();
    
    // Check which groups the channel should belong to now
    for (const [cacheKey, groupedChannels] of Array.from(this.groupedChannelsCache.entries())) {
      const filters = this.parseCacheKey(cacheKey);
      const shouldBeInGroup = this.channelMatchesFilters(channel, filters);
      
      if (shouldBeInGroup) {
        // Add channel ID to group if not already there
        if (!groupedChannels.channelIds.includes(channelId)) {
          groupedChannels.channelIds.push(channelId);
          groupedChannels.lastUpdated = Date.now();
          affectedGroups.add(cacheKey);
        }
      } else {
        // Remove from group if it was there
        const existingIndex = groupedChannels.channelIds.indexOf(channelId);
        if (existingIndex >= 0) {
          groupedChannels.channelIds.splice(existingIndex, 1);
          groupedChannels.lastUpdated = Date.now();
          affectedGroups.add(cacheKey);
        }
      }
    }
    
    // Notify affected groups
    this.notifyGroups(Array.from(affectedGroups));
  }

  /**
   * Remove channel from cache when it's deleted
   */
  public removeChannelFromCache(channel: Channel<DefaultGenerics>): void {
    const channelId = channel.cid;
    const affectedGroups = new Set<string>();
    
    // Remove channel from all groups
    for (const [cacheKey, groupedChannels] of Array.from(this.groupedChannelsCache.entries())) {
      const existingIndex = groupedChannels.channelIds.indexOf(channelId);
      if (existingIndex >= 0) {
        groupedChannels.channelIds.splice(existingIndex, 1);
        groupedChannels.lastUpdated = Date.now();
        affectedGroups.add(cacheKey);
      }
    }
    
    // Notify affected groups
    this.notifyGroups(Array.from(affectedGroups));
  }

  /**
   * Notify listeners for specific cache keys
   */
  private notifyGroups(cacheKeys: string[]): void {
    for (const cacheKey of cacheKeys) {
      const listeners = this.groupListeners.get(cacheKey);
      if (listeners) {
        const groupedChannels = this.groupedChannelsCache.get(cacheKey);
        if (groupedChannels) {
          const channels = this.getChannelsByIds(groupedChannels.channelIds);
          listeners.forEach(listener => {
            listener(channels);
          });
        }
      }
    }
  }

  /**
   * Cache grouped channels
   */
  private cacheGroupedChannels(cacheKey: string, channelIds: string[], filters: ChannelFilters): void {
    this.groupedChannelsCache.set(cacheKey, {
      channelIds,
      filters,
      lastUpdated: Date.now()
    });
  }

  /**
   * Generate cache key from filters
   */
  private getCacheKey(filters: ChannelFilters): string {
    return JSON.stringify(filters.local || {});
  }

  /**
   * Parse cache key back to filters
   */
  private parseCacheKey(cacheKey: string): ChannelFilters {
    try {
      const parsed = JSON.parse(cacheKey);
      return {
        request: {}, // Request filters are handled by MainChannelsService
        local: parsed || {}
      };
    } catch {
      return { request: {}, local: {} };
    }
  }

  /**
   * Check if a channel matches the given filters
   */
  private channelMatchesFilters(channel: Channel<DefaultGenerics>, filters: ChannelFilters): boolean {
    // Only check local filters since request filters are handled by MainChannelsService
    if (filters.local) {
      const data = channel.data || {};
      for (const key of Object.keys(filters.local)) {
        const filterVal = filters.local[key];
        if (filterVal === undefined || filterVal === null) continue;
        const channelVal = data[key];
        
        if (Array.isArray(filterVal)) {
          if (filterVal.length === 0) continue;
          if (Array.isArray(channelVal)) {
            if (!filterVal.some(fv => channelVal.includes(fv))) return false;
          } else {
            if (!filterVal.includes(channelVal)) return false;
          }
        } else {
          if (channelVal !== filterVal) return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Get cached channels for specific filters
   */
  public getCachedChannelsForFilters(filters: ChannelFilters): Channel<DefaultGenerics>[] {
    const cacheKey = this.getCacheKey(filters);
    const cachedGroup = this.groupedChannelsCache.get(cacheKey);
    
    if (cachedGroup) {
      return this.getChannelsByIds(cachedGroup.channelIds);
    }
    
    return [];
  }

  /**
   * Wait for pending requests in MainChannelsService to complete
   */
  public async waitForMainChannelsServiceRequests(): Promise<void> {
    if (this.mainChannelsService) {
      await this.mainChannelsService.waitForPendingRequests();
    }
  }

  /**
   * Check if there are cached channels available in MainChannelsService
   */
  public hasCachedChannels(): boolean {
    return this.mainChannelsService?.hasCachedChannels() || false;
  }

  /**
   * Get the number of cached channels in MainChannelsService
   */
  public getCachedChannelsCount(): number {
    return this.mainChannelsService?.getCachedChannelsCount() || 0;
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): {
    groupCount: number;
    totalChannels: number;
  } {
    let totalChannels = 0;
    const uniqueChannels = new Set<string>();
    
    for (const groupedChannels of Array.from(this.groupedChannelsCache.values())) {
      groupedChannels.channelIds.forEach((channelId: string) => {
        uniqueChannels.add(channelId);
      });
      totalChannels += groupedChannels.channelIds.length;
    }
    
    return {
      groupCount: this.groupedChannelsCache.size,
      totalChannels: uniqueChannels.size
    };
  }
} 