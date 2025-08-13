import { useEffect } from 'react';
import { Channel, DefaultGenerics } from 'stream-chat';
import { useActiveChannelService } from '@/contexts/ServicesContext';
/**
 * Hook that automatically manages the active channel state
 * 
 * @param channel The channel to set as active, or null to clear active channel
 */
export function useActiveChannelManager(channel: Channel<DefaultGenerics> | null): void {
  const activeChannelService = useActiveChannelService();

  useEffect(() => {
    // Set the active channel whenever the channel prop changes
    activeChannelService.setActiveChannel(channel);
  }, [channel, activeChannelService]);

  useEffect(() => {
    return () => {
      activeChannelService.setActiveChannel(null);
    }
  }, []);
}

export default useActiveChannelManager; 