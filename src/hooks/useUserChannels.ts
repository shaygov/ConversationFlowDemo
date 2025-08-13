import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Channel, DefaultGenerics } from 'stream-chat';
import { useUserWorkspaceCoordinatorService } from '@/contexts/ServicesContext';

// ChannelDisplayInfo interface matching the one in ChannelTitleBar
export interface ChannelDisplayInfo {
  id: string;
  cid: string;
  type: string;
  workspace_name?: string;
  workspace_type_id?: number;
  unread_count?: number;
}

export interface UserChannelsState {
  channels: ChannelDisplayInfo[];
  selectedChannelId: string | null;
  selectedChannelType: string | null;
}

// Helper function to transform Channel to ChannelDisplayInfo
const transformChannelToDisplayInfo = (channel: Channel<DefaultGenerics>): ChannelDisplayInfo => {
  return {
    id: channel.id,
    cid: channel.cid,
    type: channel.type || '',
    workspace_name: channel.data?.workspace_name as string,
    workspace_type_id: channel.data?.workspace_type_id as number,
    unread_count: channel.countUnread() || 0,
  };
};

/**
 * Hook to manage user channels with real-time updates including unread count changes
 * 
 * @param userId - The user ID to get channels for
 * @param workspace_id - Optional workspace ID to filter channels
 * @returns Object containing:
 *   - channels: Array of channel display info with unread counts
 *   - selectedChannelId: Currently selected channel ID
 *   - selectedChannelType: Currently selected channel type
 *   - setSelectedChannel: Function to set selected channel
 */
export const useUserChannelsInheritance = (
  userId: string, 
  workspace_id?: string
): UserChannelsState & { 
  setSelectedChannel: (channelId: string | null, channelType: string | null) => void;
} => {
  const userWorkspaceCoordinatorService = useUserWorkspaceCoordinatorService();
  
  const [selectedChannelUpdateTrigger, setSelectedChannelUpdateTrigger] = useState(0);
  const [channelsUpdateTrigger, setChannelsUpdateTrigger] = useState(0);
  const lastSelectedChannelIdRef = useRef<string | null>(null);
  const lastChannelsRef = useRef<ChannelDisplayInfo[]>([]);
  
  // Use useMemo to compute channels based on userId and workspace_id
  const channels = useMemo(() => {
    if (!userWorkspaceCoordinatorService.isInitialized()) {
      return [];
    }
    
    try {
      const userChannels = userWorkspaceCoordinatorService.getUserChannels(userId, workspace_id);
      const displayInfo = userChannels.map(transformChannelToDisplayInfo);
      
      // Update the ref with current channels
      lastChannelsRef.current = displayInfo;
      
      return displayInfo;
    } catch (error) {
      console.error('Error loading user channels:', error);
      return [];
    }
  }, [userWorkspaceCoordinatorService, userId, workspace_id, channelsUpdateTrigger]);

  // Use useMemo to compute selected channel state
  const selectedChannelState = useMemo(() => {

    if (!userWorkspaceCoordinatorService.isInitialized()) {
      return { selectedChannelId: null, selectedChannelType: null };
    }

    const selectedChannel = userWorkspaceCoordinatorService.getSelectedChannelState(userId, workspace_id);

    lastSelectedChannelIdRef.current = selectedChannel.selectedChannelId;
    
    return selectedChannel;
  }, [userWorkspaceCoordinatorService, userId, workspace_id, selectedChannelUpdateTrigger]);

  // Function to update selected channel using service
  const setSelectedChannel = useCallback((channelId: string | null, channelType: string | null) => {
    userWorkspaceCoordinatorService.setSelectedChannelWithFavoriteUpdate(userId, workspace_id, channelId, channelType);
  }, [userWorkspaceCoordinatorService, userId, workspace_id]);

  // Subscribe to selected channel changes
  useEffect(() => {
    if (!userWorkspaceCoordinatorService.isInitialized()) {
      return;
    }

    const unsubscribe = userWorkspaceCoordinatorService.subscribeToSelectedChannel(
      userId,
      workspace_id,
      (newState) => {
         
        // Only trigger re-render if selectedChannelId has changed
        if (newState.selectedChannelId !== lastSelectedChannelIdRef.current) {
          lastSelectedChannelIdRef.current = newState.selectedChannelId;
          setSelectedChannelUpdateTrigger(prev => prev + 1);
        }
      }
    );

    return unsubscribe;
  }, [userWorkspaceCoordinatorService, userId, workspace_id]);

  // Subscribe to channel events
  useEffect(() => {
    if (!userWorkspaceCoordinatorService.isInitialized()) {
      return;
    }

    const unsubscribe = userWorkspaceCoordinatorService.subscribeToUserChannels(
      userId,
      workspace_id,
      {
        onChannelAdded: (channel: Channel<DefaultGenerics>) => {
          // Only trigger re-render if channels have actually changed
          const newChannelInfo = transformChannelToDisplayInfo(channel);
          const hasChanged = !lastChannelsRef.current.some(ch => ch.id === channel.id);
          
          if (hasChanged) {
            setChannelsUpdateTrigger(prev => prev + 1);
          }
        },
        onChannelRemoved: (channelId: string) => {
          // Only trigger re-render if channel was actually removed
          const hasChanged = lastChannelsRef.current.some(ch => ch.id === channelId);
          
          if (hasChanged) {
            setChannelsUpdateTrigger(prev => prev + 1);
          }
        },
        onChannelUnreadCountUpdated: (cid: string, unreadCount: number) => {
          // Only trigger re-render if unread count has actually changed
          const currentChannel = lastChannelsRef.current.find(ch => ch.cid === cid);
          const hasChanged = currentChannel && currentChannel.unread_count !== unreadCount;
          
          if (hasChanged) {
            setChannelsUpdateTrigger(prev => prev + 1);
          }
        },
      }
    );

    return unsubscribe;
  }, [userWorkspaceCoordinatorService, userId, workspace_id]);


  return {
    channels,
    selectedChannelId: selectedChannelState.selectedChannelId,
    selectedChannelType: selectedChannelState.selectedChannelType,
    setSelectedChannel,
  };
};
