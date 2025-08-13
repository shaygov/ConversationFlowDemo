import { useEffect, useState, useMemo, useCallback } from 'react';
import { Channel, DefaultGenerics, ChannelFilters as StreamChannelFilters} from 'stream-chat';
import { useChatContext } from 'stream-chat-react';
import { useMainChannelsService } from '@/contexts/ServicesContext';
import { MainChannelsService } from '@/services/MainChannelsService';
import { useAuth } from '@/contexts/AuthContext';
import { CHANNEL_TYPES } from "@/constants/chat";


interface UseChatChannelOptions {
  channelId?: string;
  channelType?: string
}

interface UseChatChannelResult {
  channel: Channel<DefaultGenerics> | null;
  channelName: string;
  isLoading: boolean;
  isFavorite: boolean;
  isOnline: boolean;
  error: Error | null;
  refreshChannel: () => Promise<void>;
  service: MainChannelsService;
}


export function useChatChannel(config: UseChatChannelOptions): UseChatChannelResult {
  const [channel, setChannel] = useState<Channel<DefaultGenerics> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { client } = useChatContext();
  const [presenceTick, setPresenceTick] = useState(0);

  // Get MainChannelsService from context
  const mainChannelsService = useMainChannelsService();

  // Main loader
  const loadChannel = useCallback(async (forceRefresh = false) => {
    if (!config.channelId || !config.channelType) {
      setError(new Error('channelId and channelType are required'));
      setIsLoading(false);
      return;
    }



    try {
      setIsLoading(true);
      setError(null);
      
      // First check cache
      let cachedChannel = null;

      if (config.channelId) {
        cachedChannel = mainChannelsService.getChannelById(`${config.channelType}:${config.channelId}`);
      }

      if (cachedChannel && !forceRefresh) {
        setChannel(cachedChannel);
        // await cachedChannel.watch();
        setIsLoading(false);
        return;
      }

      // If not in cache or force refresh, create channel instance
      if (!client) {
        throw new Error('Chat client not available');
      }

      const channelInstance = client.channel(config.channelType, config.channelId);
      
      // Watch the channel to get its state and messages
      await channelInstance.watch();
      
      setChannel(channelInstance);
      setIsLoading(false);

    } catch (err) {
      console.error('Error loading channel:', err);
      setError(err instanceof Error ? err : new Error('Failed to load channel'));
      setIsLoading(false);
    }
  }, [config.channelId, config.channelType, client]);

  // On mount or filter change, always fetch
  useEffect(() => {
      loadChannel();
  }, [config.channelId, loadChannel]);


  // Listen for user presence changes
  useEffect(() => {
    if (!client || !channel) {
      return;
    }

    const handleUserPresenceChanged = (event: any) => {
      // Update presence tick to trigger re-render of isOnline calculation
      setPresenceTick(prev => prev + 1);
    };

    // Add event listener for user presence changes
    client.on('user.presence.changed', handleUserPresenceChanged);

    // Cleanup function to remove event listener
    return () => {
      client.off('user.presence.changed', handleUserPresenceChanged);
    };
  }, [client, channel]);

  // Refresh function
  const refreshChannel = useCallback(() => {
    return loadChannel(true);
  }, [loadChannel]);

  // Channel name logic
  const channelName = useMemo(() => {
    if (!channel) return '---';
    
    let name = channel.data?.name || '---';

    if (channel.type === CHANNEL_TYPES.dm.value) {
      const titleArray: string[] = [];
      Object.keys(channel?.state?.members || {}).forEach((memberId: string) => {
        const memberName = channel.state.members[memberId].user.name;
        if (memberId !== `user_${user?.id}`) {
          titleArray.push(memberName);
        }
      });
      if (titleArray.length) {
        name = titleArray.join(', ');
      }
    }

    return name;
  }, [channel, user]);

  // Favorite status
  const isFavorite = useMemo(() => {
    if (!channel) return false;
    const favoriteBy = channel.data?.favorite_by as string[] | undefined;
    return Array.isArray(favoriteBy) && user?.id ? favoriteBy.includes(`user_${user.id}`) : false;
  }, [channel, user]);


  const isOnline = useMemo(()=> {
    if (!channel) return false;
    const members = Object.entries(channel.state.members || {})
        .filter(([memberId]) => memberId !== `user_${user?.id}`)
        .map(([, member]) => member.user.online);
      return members.some(online => online);
    return false; // For non-DM channels, we don't track online status
  }, [channel, user, presenceTick]);


  return { 
    channel, 
    channelName, 
    isFavorite, 
    isLoading, 
    isOnline,
    error, 
    refreshChannel,
    service: mainChannelsService
  };
} 