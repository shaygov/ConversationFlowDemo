import { useState, useEffect, startTransition, useRef } from 'react';
import { useWorkspaceUsersService } from '@/contexts/ServicesContext';
import { UserWorkspace } from '@/types/userCache';

interface FiltersType {
  request: any;
  local?: Record<string, any>;
  search?: string;
}

export const useUsersWorkspaceList = (filters: FiltersType) => {
  const usersChannelsService = useWorkspaceUsersService();
  // Get cache key for the current filters
  const cacheKey = usersChannelsService.getCombinedCacheKey(filters);
  // Check if we have cached data and use it as initial state
  const cachedUsers = usersChannelsService.getCachedUsersForFilters(filters);
  const [users, setUsers] = useState<UserWorkspace[]>(cachedUsers);
  const [isLoading, setIsLoading] = useState(cachedUsers.length === 0); // Only show loading if no cached data
  
  // Use ref to track previous search value to avoid unnecessary re-fetches
  const prevSearchRef = useRef<string | undefined>(filters.search);

  useEffect(() => {
    let isMounted = true;
    // Only fetch data if we don't have cached data
    if (cachedUsers.length === 0) {
      usersChannelsService.getUsersForFilters(filters)
        .then((result) => {
          if (isMounted) {
            // Use startTransition to batch the state updates and avoid double rendering
            startTransition(() => {
              setUsers(result);
              setIsLoading(false);
            });
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    }
    return () => { isMounted = false; };
  }, [usersChannelsService, filters, cachedUsers.length]);

  // Handle search filter changes
  useEffect(() => {
    // Only re-fetch if search has actually changed
    if (prevSearchRef.current !== filters.search) {
      setIsLoading(true);
      usersChannelsService.getUsersForFilters(filters)
        .then((result) => {
          setUsers(result);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
      // Update the ref with current search value
      prevSearchRef.current = filters.search;
    }
  }, [filters.search, usersChannelsService, filters]);

  // Subscribe for real-time changes
  useEffect(() => {
    const unsubscribe = usersChannelsService.subscribe(cacheKey, (updatedUsers) => {
      console.log('updatedUsers', updatedUsers);
      setUsers(updatedUsers);
    });

    return unsubscribe;
  }, [usersChannelsService, cacheKey]);

  return { users, isLoading};
}; 