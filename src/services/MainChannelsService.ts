import { Channel, DefaultGenerics, StreamChat, ChannelFilters as StreamChannelFilters, ChannelSort as StreamChannelSort } from 'stream-chat';
import { StreamEventManager, StreamEventSubscriber } from './StreamEventManager';

export interface ChannelOptions {
  state?: boolean;
  watch?: boolean;
  presence?: boolean;
  limit?: number; // Note: GetStream API always returns max 30 channels per request
  message_limit?: number;
  offset?: number;
}

// Default constants for channel options
export const DEFAULT_CHANNEL_OPTIONS: ChannelOptions = {
  state: true,
  watch: true,
  presence: true,
  limit: 30, // GetStream API always returns max 30 channels per request
  offset: 0,
} as const;

export const DEFAULT_SORT: StreamChannelSort<DefaultGenerics> = { 
  last_message_at: -1 
} as const;

// New interface for channel change events
export interface ChannelChangeEvent {
  changeType: 'created' | 'updated' | 'deleted';
  channelInstance: Channel<DefaultGenerics>;
  affectedCacheKeys: string[];
  timestamp: number;
}

// Common interface for MainChannelsService callbacks
export interface MainChannelsServiceCallback {
  onChannelCreated?(channel: Channel<DefaultGenerics>): void | Promise<void>;
  onChannelUpdated?(channel: Channel<DefaultGenerics>): void | Promise<void>;
  onChannelDeleted?(channel: Channel<DefaultGenerics>): void | Promise<void>;
}

// Legacy callback type for backward compatibility
type LegacyMainChannelsServiceCallback = (event: ChannelChangeEvent) => void;

export class MainChannelsService implements StreamEventSubscriber {
  private static instance: MainChannelsService;
  private client: StreamChat<DefaultGenerics> | null = null;

  // Communication with other services
  private channelChangeCallbacks: MainChannelsServiceCallback[] = [];
  private legacyChannelChangeCallbacks: LegacyMainChannelsServiceCallback[] = [];

  // StreamEventManager subscription
  private streamEventUnsubscribe: (() => void) | null = null;

  // --- SIMPLE CHANNEL CACHE ---
  public static channelCache = new Map<string, Channel<DefaultGenerics>>();

  // --- REQUEST DEDUPLICATION ---
  private pendingRequests = new Map<string, Promise<Channel<DefaultGenerics>[]>>();

  // --- INITIAL FETCH MANAGEMENT ---
  private initialFetchPromise: Promise<Channel<DefaultGenerics>[]> | null = null;
  private initialFetchCompleted = false;

  private constructor() {}

  public static getInstance(): MainChannelsService {
    if (!MainChannelsService.instance) {
      MainChannelsService.instance = new MainChannelsService();
    }
    return MainChannelsService.instance;
  }

  public initialize(client: StreamChat<DefaultGenerics>): void {
    this.client = client;
    
    // Reset initial fetch state for new initialization
    this.initialFetchPromise = null;
    this.initialFetchCompleted = false;
    
    // Subscribe to StreamEventManager instead of setting up own listeners
    const streamEventManager = StreamEventManager.getInstance();
    if (streamEventManager.isInitialized()) {
      this.streamEventUnsubscribe = streamEventManager.subscribe(this);
    } else {
      console.warn('MainChannelsService: StreamEventManager not initialized, cannot subscribe to events');
    }

    // Start initial fetch of channels
    this.startInitialFetch();
  }

  public isInitialized(): boolean {
    return this.client !== null;
  }

  // Add callback registration methods
  public addMainChannelsServiceCallback(callback: MainChannelsServiceCallback): void {
    this.channelChangeCallbacks.push(callback);
  }

  public removeMainChannelsServiceCallback(callback: MainChannelsServiceCallback): void {
    const index = this.channelChangeCallbacks.indexOf(callback);
    if (index > -1) {
      this.channelChangeCallbacks.splice(index, 1);
    }
  }

  // Legacy methods for backward compatibility
  public addChannelChangeCallback(callback: MainChannelsServiceCallback): void {
    this.addMainChannelsServiceCallback(callback);
  }

  public removeChannelChangeCallback(callback: MainChannelsServiceCallback): void {
    this.removeMainChannelsServiceCallback(callback);
  }

  // Legacy methods for backward compatibility
  public addLegacyChannelChangeCallback(callback: LegacyMainChannelsServiceCallback): void {
    this.legacyChannelChangeCallbacks.push(callback);
  }

  public removeLegacyChannelChangeCallback(callback: LegacyMainChannelsServiceCallback): void {
    const index = this.legacyChannelChangeCallbacks.indexOf(callback);
    if (index > -1) {
      this.legacyChannelChangeCallbacks.splice(index, 1);
    }
  }

  private notifyChannelChangeCallbacks(
    changeType: 'created' | 'updated' | 'deleted',
    channelInstance: Channel<DefaultGenerics>
  ): void {
    
    const affectedCacheKeys = this.getAffectedCacheKeys(channelInstance);
    const event: ChannelChangeEvent = {
      changeType,
      channelInstance,
      affectedCacheKeys,
      timestamp: Date.now()
    };
    
    // Notify new interface callbacks
    this.channelChangeCallbacks.forEach(async callback => {
      try {
        switch (changeType) {
          case 'created':
            if (typeof callback.onChannelCreated === 'function') {
              await callback.onChannelCreated(channelInstance);
            }
            break;
          case 'updated':
            if (typeof callback.onChannelUpdated === 'function') {
              await callback.onChannelUpdated(channelInstance);
            }
            break;
          case 'deleted':
            if (typeof callback.onChannelDeleted === 'function') {
              await callback.onChannelDeleted(channelInstance);
            }
            break;
        }
      } catch (error) {
        console.error('MainChannelsService: Error in channel change callback:', error);
      }
    });

    // Notify legacy callbacks for backward compatibility
    this.legacyChannelChangeCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('MainChannelsService: Error in legacy channel change callback:', error);
      }
    });
  }

  /**
   * Get cache keys that are affected by a specific channel change
   */
  private getAffectedCacheKeys(channelInstance: Channel<DefaultGenerics>): string[] {
    // This method is kept for compatibility with ChannelChangeEvent interface
    // but it's no longer used since we removed the listener system
    return [];
  }

  public destroy(): void {
    // Unsubscribe from StreamEventManager
    if (this.streamEventUnsubscribe) {
      this.streamEventUnsubscribe();
      this.streamEventUnsubscribe = null;
    }

    // Clear all callbacks
    this.channelChangeCallbacks = [];
    this.legacyChannelChangeCallbacks = [];
    
    // Clear all caches and state
    MainChannelsService.channelCache.clear();
    this.pendingRequests.clear();
    
    // Reset initial fetch state
    this.initialFetchPromise = null;
    this.initialFetchCompleted = false;
    
    // Clear client reference
    this.client = null;
  }

  // StreamEventSubscriber interface implementation
  onChannelCreated(cid: string, event: any): void {
    if (!this.client || !event.channel) return;
    this.handleChannelCreatedOrUpdated(event);
  }

  onChannelUpdated(channelId: string, event: any): void {
    if (!this.client || !event.channel) return;
    this.handleChannelCreatedOrUpdated(event);
  }

  onChannelDeleted(channelId: string, event: any): void {
    if (!this.client || !event.channel) return;
    this.handleChannelDeleted(event);
  }

  /**
   * Handles channel created or updated events
   */
  private async handleChannelCreatedOrUpdated(event: any): Promise<void> {
    if (!this.client || !event.channel) return;
      const channelInstance = this.client.channel(event.channel.type, event.channel.id);
      await channelInstance.watch();
      // Check if this is a new channel BEFORE adding to cache
      const isNewChannel = !MainChannelsService.channelCache.has(channelInstance.cid);
      // Update channel cache
      MainChannelsService.channelCache.set(channelInstance.cid, channelInstance);

      this.notifyChannelChangeCallbacks(isNewChannel ? 'created' : 'updated', channelInstance);
  }

  /**
   * Handles channel deleted events
   */
  private async handleChannelDeleted(event: any): Promise<void>  {
    if (!this.client || !event.channel) return;
    const channelInstance = MainChannelsService.channelCache.get(event.channel.cid);
    
    // Remove from channel cache
    MainChannelsService.channelCache.delete(event.channel.cid);

    // Notify other services via callback
    this.notifyChannelChangeCallbacks('deleted', channelInstance);
  }

  // watchChannels and stopWatching methods removed - events now handled through StreamEventManager subscription

  public async getOrLoadChannels(
    filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any> },
    options?: ChannelOptions,
    sort?: StreamChannelSort<DefaultGenerics>,
    forceRefresh?: boolean,
    fetchAll: boolean = true,
  ): Promise<Channel<DefaultGenerics>[]> {
    if (!this.client) throw new Error('MainChannelsService not initialized. Call initialize() first.');

    // Create a unique key for this request
    const requestKey = this.createRequestKey(filters, options, sort, forceRefresh, fetchAll);

    // Check if there's already a pending request with the same parameters
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey)!;
    }


   

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedChannels = this.getCachedChannelsForFiltersInternal(filters);
      if (cachedChannels.length > 0) {
        return cachedChannels;
      }
    }

    const requestPromise = this.executeRequest(filters, options, sort, forceRefresh, fetchAll);
    this.pendingRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up the pending request
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * Create a unique key for request deduplication
   */
  private createRequestKey(
    filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any> },
    options?: ChannelOptions,
    sort?: StreamChannelSort<DefaultGenerics>,
    forceRefresh?: boolean,
    fetchAll: boolean = true,
  ): string {
    return JSON.stringify({
      filters: filters.request, // Only use request filters for deduplication
      options: options || {},
      sort: sort || {},
      fetchAll
      // Note: forceRefresh and localFilters are not included in the key to avoid duplicate requests
      // forceRefresh is used only to decide whether to use cache or make new request
      // Local filters are applied after fetching the channels
    });
  }

  /**
   * Execute the actual request logic
   */
  private async executeRequest(
    filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any> },
    options?: ChannelOptions,
    sort?: StreamChannelSort<DefaultGenerics>,
    forceRefresh?: boolean,
    fetchAll: boolean = true,
  ): Promise<Channel<DefaultGenerics>[]> {
    console.log('🚀 API REQUEST: Making actual API call to GetStream');
    
    // --- OFFSET-BASED PAGINATION ---
    const fetchAllChannelsOffset = async () => {
      const allChannels: Channel<DefaultGenerics>[] = [];
      let offset = 0;
      const maxIterations = 100; // Safety limit to prevent infinite loops
      let iteration = 0;
      
      while (iteration < maxIterations) {
        let channels: Channel<DefaultGenerics>[];
        try {
          channels = await this.client!.queryChannels(
            filters.request,
            sort || { last_message_at: -1 },
            {
              ...options,
              limit: 30, // GetStream API always returns max 30, so no need for larger limit
              offset,
              state: options?.state ?? true,
              watch: options?.watch ?? true,
              presence: options?.presence ?? true,
            }
          );
        } catch (error) {
          console.error('Error fetching channels (offset):', error);
          break;
        }
        
        // If no channels returned, we've reached the end
        if (channels.length === 0) {
          break;
        }
        
        // Add channels to cache
        channels.forEach(channel => {
          MainChannelsService.channelCache.set(channel.cid, channel);
        });
        
        allChannels.push(...channels);
        
        // GetStream API always returns max 30 channels, so we stop only when we get 0 channels
        // or when we get exactly 30 (which means there might be more)
        // We continue if we get exactly 30 channels (indicating there might be more)
        if (channels.length === 0) {
          break;
        }
        
        // If we got exactly 30 channels, continue to next page (there might be more)
        // If we got less than 30, we've reached the end
        if (channels.length < 30) {
          break;
        }
        
        // Move to next page - GetStream API always returns max 30 channels
        // So we increment offset by 30, not by the requested limit
        offset += 30;
        iteration++;
      }
      
      return allChannels;
    };

    let fetchedChannels: Channel<DefaultGenerics>[];
    if (fetchAll) {
      fetchedChannels = await fetchAllChannelsOffset();
    } else {
      // For single request, also use limit 30 since GetStream won't return more anyway
      fetchedChannels = await this.client.queryChannels(
        filters.request,
        sort || { last_message_at: -1 },
        {
          ...options,
          limit: 30, // GetStream API always returns max 30
          state: options?.state ?? true,
          watch: options?.watch ?? true,
          presence: options?.presence ?? true,
          message_limit: options?.message_limit ?? 30,
        }
      );
      
      // Add channels to cache
      fetchedChannels.forEach(channel => {
        MainChannelsService.channelCache.set(channel.cid, channel);
      });
    }

    // Apply local filters if provided
    if (filters.local) {
      fetchedChannels = this.applyLocalFilters(fetchedChannels, filters.local);
    }
   
    return fetchedChannels;
  }

  /**
   * Execute a request without any checks (used internally by initial fetch)
   */
  private async executeRequestOnly(
    filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any> },
    options?: ChannelOptions,
    sort?: StreamChannelSort<DefaultGenerics>,
    forceRefresh?: boolean,
    fetchAll: boolean = true,
  ): Promise<Channel<DefaultGenerics>[]> {
    if (!this.client) throw new Error('MainChannelsService not initialized. Call initialize() first.');

    // Create a unique key for this request
    const requestKey = this.createRequestKey(filters, options, sort, forceRefresh, fetchAll);

    // Check if there's already a pending request with the same parameters
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey)!;
    }

    // Create a promise that will be resolved by executeRequest
    let resolvePromise: (value: Channel<DefaultGenerics>[]) => void;
    let rejectPromise: (reason: any) => void;
    
    const requestPromise = new Promise<Channel<DefaultGenerics>[]>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
    
    // Add to pending requests BEFORE starting the actual request
    this.pendingRequests.set(requestKey, requestPromise);
    
    // Start the actual request
    this.executeRequest(filters, options, sort, forceRefresh, fetchAll)
      .then(resolvePromise!)
      .catch(rejectPromise!);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up the pending request
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * Get cached channels that match the given filters (public method)
   * This method only returns cached channels without making any fetch requests
   */
  public getCachedChannelsForFilters(filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any> }): Channel<DefaultGenerics>[] {
    const allCachedChannels = Array.from(MainChannelsService.channelCache.values());
    
    // Filter channels based on request filters
    let filteredChannels = allCachedChannels.filter(channel => {
      // Check if channel matches the request filters
      // This is a simplified filter check - you might need to implement more sophisticated filtering
      if (filters.request.type && channel.type !== filters.request.type) {
        return false;
      }
      
      if (filters.request.members) {
        const membersFilter = filters.request.members as any;
        if (membersFilter.$in && Array.isArray(membersFilter.$in)) {
          const channelMembers = Object.keys(channel.state?.members || {});
          const hasMatchingMember = membersFilter.$in.some((memberId: string) => 
            channelMembers.includes(memberId)
          );
          if (!hasMatchingMember) {
            return false;
          }
        }
      }
      
      // Add more filter checks as needed based on your StreamChat filter structure
      
      return true;
    });

    // Apply local filters if provided
    if (filters.local) {
      filteredChannels = this.applyLocalFilters(filteredChannels, filters.local);
    }

    return filteredChannels;
  }

  /**
   * Get cached channels that match the given filters (private method for internal use)
   */
  private getCachedChannelsForFiltersInternal(filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any> }): Channel<DefaultGenerics>[] {
    return this.getCachedChannelsForFilters(filters);
  }

  /**
   * Apply local filters to channels
   */
  private applyLocalFilters(channels: Channel<DefaultGenerics>[], localFilters: Record<string, any>): Channel<DefaultGenerics>[] {
    return channels.filter(channel => {
      for (const [key, filterValue] of Object.entries(localFilters)) {
        if (filterValue === undefined || filterValue === null) continue;
        
        const channelValue = (channel as any).data[key];
        
        if (Array.isArray(filterValue)) {
          if (filterValue.length === 0) continue;
          if (Array.isArray(channelValue)) {
            if (!filterValue.some(fv => channelValue.includes(fv))) return false;
          } else {
            if (!filterValue.includes(channelValue)) return false;
          }
        } else {
          if (channelValue !== filterValue) return false;
        }
      }
      return true;
    });
  }

  public clearClient(): void {
    this.client = null;
  }

  /**
   * Get channel by ID from the channel cache
   */
  public getChannelById(channelId: string): Channel<DefaultGenerics> | null {
    return MainChannelsService.channelCache.get(channelId) || null;
  }

  /**
   * Check if there are any pending requests
   */
  public hasPendingRequests(): boolean {
    return this.pendingRequests.size > 0;
  }

  /**
   * Wait for all pending requests to complete
   */
  public async waitForPendingRequests(): Promise<void> {
    if (this.pendingRequests.size === 0) {
      return;
    }

    const pendingPromises = Array.from(this.pendingRequests.values());
    await Promise.all(pendingPromises);
  }

  /**
   * Get all channels from cache
   */
  public getAllCachedChannels(): Channel<DefaultGenerics>[] {
    return Array.from(MainChannelsService.channelCache.values());
  }

  /**
   * Start initial fetch of channels during service initialization
   */
  public startInitialFetch(): void {
    if (this.initialFetchPromise) {
      return; // Already started
    }

    console.log('🚀 MainChannelsService: Starting initial fetch of channels');
    
    this.initialFetchPromise = this.executeRequestOnly(
      { request: { members: { $in: [this.client?.userID] } } },
      DEFAULT_CHANNEL_OPTIONS,
      DEFAULT_SORT,
      false,
      true
    );

    this.initialFetchPromise
      .then((channels) => {
        console.log('✅ MainChannelsService: Initial fetch completed, got channels:', channels.length);
        this.initialFetchCompleted = true;
      })
      .catch((error) => {
        console.error('❌ MainChannelsService: Initial fetch failed:', error);
        this.initialFetchCompleted = true;
      });
  }

  /**
   * Wait for initial fetch to complete
   */
  public async waitForInitialFetch(): Promise<void> {
    if (this.initialFetchCompleted) {
      return; // Already completed
    }

    if (this.initialFetchPromise) {
      console.log('⏳ MainChannelsService: Waiting for initial fetch to complete');
      await this.initialFetchPromise;
    }
  }

  /**
   * Check if initial fetch is completed
   */
  public isInitialFetchCompleted(): boolean {
    return this.initialFetchCompleted;
  }

  /**
   * Get channels for specific filters with smart caching and filtering logic
   * This is the main entry point for other services
   */
  public async getChannelsForFilters(
    filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any> },
    forceRefresh: boolean = false,
  ): Promise<Channel<DefaultGenerics>[]> {
    if (!this.client) throw new Error('MainChannelsService not initialized. Call initialize() first.');

    // Wait for initial fetch to complete
    await this.waitForInitialFetch();
    
    // Get channels from cache and apply filters
    return this.getCachedChannelsForFilters(filters);
  }

  /**
   * Check if there's a pending request for specific filters
   */
  public hasPendingRequestForFilters(
    filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any> },
    options?: ChannelOptions,
    sort?: StreamChannelSort<DefaultGenerics>,
    forceRefresh?: boolean,
    fetchAll: boolean = true,
  ): boolean {
    const requestKey = this.createRequestKey(filters, options, sort, forceRefresh, fetchAll);
    return this.pendingRequests.has(requestKey);
  }

  /**
   * Wait for a specific request to complete
   */
  public async waitForRequest(
    filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any> },
    options?: ChannelOptions,
    sort?: StreamChannelSort<DefaultGenerics>,
    forceRefresh?: boolean,
    fetchAll: boolean = true,
  ): Promise<void> {
    const requestKey = this.createRequestKey(filters, options, sort, forceRefresh, fetchAll);
    const pendingRequest = this.pendingRequests.get(requestKey);
    
    if (pendingRequest) {
      await pendingRequest;
    }
  }

  /**
   * Check if there are any cached channels available
   */
  public hasCachedChannels(): boolean {
    return MainChannelsService.channelCache.size > 0;
  }

  /**
   * Get the number of cached channels
   */
  public getCachedChannelsCount(): number {
    return MainChannelsService.channelCache.size;
  }

  /**
   * Clear the channel cache
   */
  public clearChannelCache(): void {
    MainChannelsService.channelCache.clear();
  }
} 