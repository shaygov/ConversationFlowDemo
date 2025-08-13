import { useState, useEffect } from 'react';
import { Channel, DefaultGenerics, ChannelFilters as StreamChannelFilters } from 'stream-chat';
import { useGroupChannelsService } from '@/contexts/ServicesContext';

interface FiltersType {
  request: StreamChannelFilters<DefaultGenerics>;
  local?: Record<string, any>;
}

interface UseChannelListConfig {
  filters: FiltersType;
}

export const useWorkspaceChannelsList = (config: FiltersType | UseChannelListConfig) => {
  const groupChannelsService = useGroupChannelsService();
  
  // Handle both direct filters and config object
  const filters = 'filters' in config ? config.filters : config;
  
  // Initialize with cached channels if available
  const initialChannels = groupChannelsService.getCachedChannelsForFilters(filters);
  const [channels, setChannels] = useState<Channel<DefaultGenerics>[]>(initialChannels);
  const [isLoading, setIsLoading] = useState(initialChannels.length === 0); // Only loading if no cached channels
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadChannels = async () => {
      try {
        // If we already have cached channels, don't show loading
        if (initialChannels.length > 0) {
          // Using cached channels from initial state
        }

        // Wait for initial fetch to complete and get updated channels
        const freshChannels = await groupChannelsService.getChannelsForFilters(filters, false);
        
        if (isMounted) {
          setChannels(freshChannels);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load channels'));
          setIsLoading(false);
        }
      }
    };

    // Only set loading if we don't have cached channels
    if (initialChannels.length === 0) {
      setIsLoading(true);
    }
    setError(null);
    loadChannels();

    return () => { isMounted = false; };
  }, [groupChannelsService, filters, initialChannels.length]);

  // Subscribe for real-time changes
  useEffect(() => {
    const unsubscribe = groupChannelsService.subscribeToGroup(filters, (updatedChannels) => {
      setChannels(updatedChannels);
    });

    return unsubscribe;
  }, [groupChannelsService, filters]);

  return { channels, isLoading, error };
}; 