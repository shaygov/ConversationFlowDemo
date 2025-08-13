import { Channel, DefaultGenerics, StreamChat, ChannelFilters as StreamChannelFilters, ChannelSort as StreamChannelSort, User } from 'stream-chat';
import { MainChannelsService, ChannelChangeEvent, MainChannelsServiceCallback } from './MainChannelsService';
import { UserCacheObserver, UserWorkspace } from '@/types/userCache';

// Re-export UserWorkspace for backward compatibility
export { UserWorkspace } from '@/types/userCache';

export interface UserChannelOptions {
  state?: boolean;
  watch?: boolean;
  presence?: boolean;
  limit?: number;
  message_limit?: number;
}

// Interface for fields that determine cache groups
export interface CacheGroupFields {
  type?: string;
  workspace_id?: string;
  // Add more fields here as needed
  // team_id?: string;
  // category?: string;
  // etc.
}

type Listener = (users: UserWorkspace[]) => void;

// UserWorkspace interface is now imported from @/types/userCache

export class WorkspaceUsersService implements MainChannelsServiceCallback {
  private static instance: WorkspaceUsersService;
  private mainChannelsService: MainChannelsService;
  private client: StreamChat<DefaultGenerics> | null = null;
  private listeners: Map<string, Set<Listener>> = new Map();
  
  // Observer pattern for user cache changes
  private observers: Set<UserCacheObserver> = new Set();

  // --- LOCAL CACHE WITH FILTERS ---
  public static localFilteredCache = new Map<string, UserWorkspace[]>();

  private constructor(mainChannelsService: MainChannelsService) {
    this.mainChannelsService = mainChannelsService;
  }

  public static getInstance(mainChannelsService?: MainChannelsService): WorkspaceUsersService {
    if (!WorkspaceUsersService.instance) {
      if (!mainChannelsService) {
        throw new Error('MainChannelsService is required for first initialization of WorkspaceUsersService');
      }
      WorkspaceUsersService.instance = new WorkspaceUsersService(mainChannelsService);
    }
    return WorkspaceUsersService.instance;
  }

  public initialize(client: StreamChat<DefaultGenerics>): void {
    this.client = client;
    
    // Clear previous caches and listeners for new initialization
    WorkspaceUsersService.localFilteredCache.clear();
    this.listeners.clear();
    this.observers.clear();
    
    // Initialize MainChannelsService if not already initialized
    if (!this.mainChannelsService.isInitialized()) {
      this.mainChannelsService.initialize(client);
    }
    
    // Register as callback with MainChannelsService using new interface
    this.mainChannelsService.addMainChannelsServiceCallback(this);
    
    // Notify observers for existing users after initialization
    this.notifyObserversForExistingUsers();
  }


  public isInitialized(): boolean {
    return this.client !== null && this.mainChannelsService.isInitialized();
  }

  /**
   * Observer pattern methods
   */
  public addObserver(observer: UserCacheObserver): void {
    this.observers.add(observer);
  }

  public removeObserver(observer: UserCacheObserver): void {
    this.observers.delete(observer);
  }

  private notifyObserversForExistingUsers(): void {
    // Get all existing users from cache
    const allUsers = this.getAllExistingUsers();
    
    // Notify observers
    this.observers.forEach(observer => {
      observer.onInitialUsersLoaded(allUsers);
    });
  }

  public getAllExistingUsers(): UserWorkspace[] {
    const allUsers = new Set<UserWorkspace>();
    
    WorkspaceUsersService.localFilteredCache.forEach(users => {
      users.forEach(user => allUsers.add(user));
    });
    
    return Array.from(allUsers);
  }

  public getCombinedCacheKey(filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any> }) {
    return JSON.stringify(filters.local || {});
  }

  // --- USER-SPECIFIC GROUPING LOGIC ---
  public static matchesLocalFilters(user: UserWorkspace, local: Record<string, any>): boolean {
    if (!local) return true;
    const userData = user.user || {};
    for (const key of Object.keys(local)) {
      const filterVal = local[key];
      if (filterVal === undefined || filterVal === null) continue;
      const userVal = (userData as any)[key];
      if (Array.isArray(filterVal)) {
        if (filterVal.length === 0) continue;
        if (Array.isArray(userVal)) {
          if (!filterVal.some(fv => userVal.includes(fv))) return false;
        } else {
          if (!filterVal.includes(userVal)) return false;
        }
      } else {
        if (userVal !== filterVal) return false;
      }
    }
    return true;
  }

  /**
   * Convert channels to users with channels
   */
  public convertChannelsToUsers(
    channels: Channel<DefaultGenerics>[],
    filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any>, search?: string }
  ): UserWorkspace[] {
    if (!this.client) throw new Error('WorkspaceUsersService not initialized. Call initialize() first.');
    
    const currentUserId = this.client.userID;
    const search = (filters.search || '').toLowerCase();
    const workspaceId = filters.local?.workspace_id;
    
    // Group channels by user
    const usersMap = new Map<string, { user: { id: string; name: string; workspace_id?: string } }>();
    
    channels.forEach(channel => {
      if (!channel.state?.members) return;
      
      const membersArr = Array.isArray(channel.state.members)
        ? channel.state.members
        : Object.values(channel.state.members);
      
      membersArr.forEach((member: any) => {
        if (member?.user?.id && member.user.id !== currentUserId) {
          const userId = member.user.id;
          
          if (!usersMap.has(userId)) {
            usersMap.set(userId, {
              user: {
                id: member.user.id,
                name: member.user.name || member.user.id,
                workspace_id: workspaceId
              }
            });
          }
        }
      });
    });
    
    // Convert to UserWorkspace array
    let usersWorkspace: UserWorkspace[] = Array.from(usersMap.values()).map(({ user }) => ({
      user
    }));
    
    // Apply search filter if provided
    if (search) {
      usersWorkspace = usersWorkspace.filter(userWithChannels => {
        const userName = userWithChannels.user.name || userWithChannels.user.id || '';
        return userName.toLowerCase().includes(search);
      });
    }
    
    // Sort users by name globally (case-insensitive)
    usersWorkspace.sort((a, b) => {
      const nameA = (a.user.name || a.user.id || '').toLowerCase();
      const nameB = (b.user.name || b.user.id || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
    
    // Note: Local filters are now applied in MainChannelsService.getOrLoadChannels
    // So we don't need to apply them again here
    
    return usersWorkspace;
  }

  /**
   * Get filtered users from cache or fetch if needed
   */
  public async getFilteredUsers(
    filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any>, search?: string }
  ): Promise<UserWorkspace[]> {
    const cacheKey = this.getCombinedCacheKey({ request: filters.request, local: filters.local });
    const cachedUsers = WorkspaceUsersService.localFilteredCache.get(cacheKey);

    let users: UserWorkspace[];
    
    if (cachedUsers) {
      users = cachedUsers;
    } else {
      // Use the main method that handles all logic internally
      const channels = await this.mainChannelsService.getChannelsForFilters(
        { request: filters.request, local: filters.local },
        false
      );
      
      // Convert to users (local filters are already applied in MainChannelsService)
      users = this.convertChannelsToUsers(channels, { request: filters.request, local: filters.local });
      
      // Cache the result using only local filters as key
      WorkspaceUsersService.localFilteredCache.set(cacheKey, users);

    }
    
    // Apply search filter if provided (after caching)
    if (filters.search) {
      const search = filters.search.toLowerCase();
      users = users.filter(userWithChannels => {
        const userName = userWithChannels.user.name || userWithChannels.user.id || '';
        return userName.toLowerCase().includes(search);
      });
    }
    
    return users;
  }


  public subscribe(
    combinedCacheKey: string,
    listener: Listener
  ): () => void {

    if (!this.client) throw new Error('WorkspaceUsersService not initialized. Call initialize() first.');
    
    if (!this.listeners.has(combinedCacheKey)) {
      this.listeners.set(combinedCacheKey, new Set());
    }
    
    this.listeners.get(combinedCacheKey)!.add(listener);

    return () => {
      const filterListeners = this.listeners.get(combinedCacheKey);
      if (filterListeners) {
        filterListeners.delete(listener);
        if (filterListeners.size === 0) {
          this.listeners.delete(combinedCacheKey);
        }
      }
    };

   
  }

  private notifyListeners(filterKey: string): void {
    const listeners = this.listeners.get(filterKey);
    if (listeners) {
      const cachedUsers = WorkspaceUsersService.localFilteredCache.get(filterKey) || [];
      listeners.forEach(listener => {
        listener(cachedUsers);
      });
    }
  }

  /**
   * Notify listeners only if they exist for the given cache key
   */
  private notifyRelatedListeners(cacheKey: string): void {
    // Only notify if there are actual listeners for this cache key 
    if (this.listeners.has(cacheKey)) {
      this.notifyListeners(cacheKey);
    }
  }


  /**
   * Get cached users for specific filters
   */
   public getCachedUsersForFilters(filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any> }): UserWorkspace[] {
    const cacheKey = this.getCombinedCacheKey(filters);
    return WorkspaceUsersService.localFilteredCache.get(cacheKey) || [];
  }

  /**
   * Get users for specific filters from cache or fetch if needed
   */
  public async getUsersForFilters(
    filters: { request: StreamChannelFilters<DefaultGenerics>, local?: Record<string, any>, search?: string },
    sort?: StreamChannelSort<DefaultGenerics>,
  ): Promise<UserWorkspace[]> {
    if (!this.client) throw new Error('WorkspaceUsersService not initialized. Call initialize() first.');
    // Create cache key without search parameter
    const cacheKey = this.getCombinedCacheKey({ request: filters.request, local: filters.local });
    const cachedUsers = WorkspaceUsersService.localFilteredCache.get(cacheKey);
    
    let users: UserWorkspace[];
    
    if (cachedUsers) {
      users = cachedUsers;
    } else {
      // Use the main method that handles all logic internally
      const channels = await this.mainChannelsService.getChannelsForFilters(
        { request: filters.request, local: filters.local },
        false
      );

      users = this.convertChannelsToUsers(channels, { request: filters.request, local: filters.local });
      WorkspaceUsersService.localFilteredCache.set(cacheKey, users);
    }

    // Apply search filter if provided (after caching)
    if (filters.search) {
      const search = filters.search.toLowerCase();
      users = users.filter(userWithChannels => {
        const userName = userWithChannels.user.name || userWithChannels.user.id || '';
        return userName.toLowerCase().includes(search);
      });
    }
    return users;
  }

  /**
   * ChannelChangeCallback interface implementation
   */
  onChannelCreated(channel: Channel<DefaultGenerics>): void {
    this.handleChannelCreated(channel);
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
  private parseCacheKey(cacheKey: string): CacheGroupFields {
    try {
      return JSON.parse(cacheKey);
    } catch {
      return {};
    }
  }

  /**
   * Handle channel creation
   */
  private handleChannelCreated(channelInstance: Channel<DefaultGenerics>): void {
    if (!this.client || !channelInstance.state?.members) return;
    
    const currentUserId = this.client.userID;
    
    const membersArr = Array.isArray(channelInstance.state.members)
      ? channelInstance.state.members
      : Object.values(channelInstance.state.members);

    // Find all cache groups that this channel should be added to
    const affectedCacheKeys: string[] = [];
    const newUsers: UserWorkspace[] = [];
    
    WorkspaceUsersService.localFilteredCache.forEach((users, cacheKey) => {
      const cacheGroupFields = this.parseCacheKey(cacheKey);
      
      // Check if this channel matches this cache group
      if (this.channelMatchesCacheGroup(channelInstance, cacheGroupFields)) {
        affectedCacheKeys.push(cacheKey);
        
        // Update the cache group
        const updatedUsers = [...users];
        let hasNewUsers = false;
        
        membersArr.forEach((member: any) => {
          if (member?.user?.id && member.user.id !== currentUserId) {
            const userId = member.user.id;
            
            // Check if this user already exists in the cache
            const existingUserIndex = updatedUsers.findIndex(user => user.user.id === userId);
            if (existingUserIndex < 0) {
              // User doesn't exist, create new user
              const newUser = {
                user: {
                  id: member.user.id,
                  name: member.user.name || member.user.id,
                  workspace_id: cacheGroupFields.workspace_id
                }
              };
              updatedUsers.push(newUser);
              newUsers.push(newUser);
              hasNewUsers = true;
            }
          }
        });
        
        // Only update cache and notify if new users were added
        if (hasNewUsers) {
          WorkspaceUsersService.localFilteredCache.set(cacheKey, updatedUsers);
          this.notifyRelatedListeners(cacheKey);
        }
      }
    });
    
    // Notify observers about new users
    if (newUsers.length > 0) {
      this.observers.forEach(observer => {
        observer.onUsersAdded(newUsers);
      });
    }
  }


  /**
   * Handle channel deletion
   */
  private handleChannelDeleted(channelForDelete: Channel<DefaultGenerics>): void {
    if (!this.client) return;
    
    // Get the user ID from the deleted channel (different from current user)
    const channelMembers = Object.values(channelForDelete.state.members);

    if (channelMembers.length === 0) return;
    
    // Find cache groups that match the deleted channel
    const affectedCacheKeys: string[] = [];
    const removedUserIds: string[] = [];
    
    WorkspaceUsersService.localFilteredCache.forEach((users, cacheKey) => {
      const cacheGroupFields = this.parseCacheKey(cacheKey);
      // Check if this channel matches this cache group
      if (this.channelMatchesCacheGroup(channelForDelete, cacheGroupFields)) {
        affectedCacheKeys.push(cacheKey);
        
        // Collect user IDs that might be removed
        users.forEach(user => {
          if (!removedUserIds.includes(user.user.id)) {
            removedUserIds.push(user.user.id);
          }
        });
      }
    });

    // If no cache groups are affected, no need to do anything
    if (affectedCacheKeys.length === 0) return;

    // Delete affected cache groups
    affectedCacheKeys.forEach(cacheKey => {
      WorkspaceUsersService.localFilteredCache.delete(cacheKey);
    });

    // Regenerate only the affected cache groups
    if (this.mainChannelsService) {
      const channels = this.mainChannelsService.getAllCachedChannels();
      affectedCacheKeys.forEach(cacheKey => {
        const cacheGroupFields = this.parseCacheKey(cacheKey);
        // Find channels that match this cache group
        const matchingChannels = channels.filter((channel: Channel<DefaultGenerics>) => {
          return this.channelMatchesCacheGroup(channel, cacheGroupFields);
        });

        // Generate users for this cache group
        if (matchingChannels.length > 0) {
          const users = this.convertChannelsToUsers(matchingChannels, { request: {}, local: cacheGroupFields });
          WorkspaceUsersService.localFilteredCache.set(cacheKey, users);
        }
      });
    }

    // Notify listeners only for cache keys that have subscribers
    affectedCacheKeys.forEach(cacheKey => {
      this.notifyRelatedListeners(cacheKey);
    });
    
    // Notify observers about removed users
    if (removedUserIds.length > 0) {
      this.observers.forEach(observer => {
        observer.onUsersRemoved(removedUserIds);
      });
    }
  }


  public destroy(): void {
    // Unsubscribe from MainChannelsService
    if (this.mainChannelsService) {
      this.mainChannelsService.removeMainChannelsServiceCallback(this);
    }
    
    // Clear caches and observers
    WorkspaceUsersService.localFilteredCache.clear();
    this.listeners.clear();
    this.observers.clear();
    
    this.client = null;
    // this.streamEventManager = null;
  }

  public clearClient(): void {
    this.client = null;
  }

  // Public methods for accessing dependencies
  public getClient(): StreamChat<DefaultGenerics> | null {
    return this.client;
  }

  public getMainChannelsService(): MainChannelsService {
    return this.mainChannelsService;
  }

  // public getStreamEventManager(): StreamEventManager | null {
  //   return this.streamEventManager;
  // }
} 