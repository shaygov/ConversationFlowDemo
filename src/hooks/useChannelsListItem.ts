import { useState, useEffect, useRef } from 'react';
import { Channel } from 'stream-chat';
import { useChatContext } from 'stream-chat-react';
import { useAuth } from '@/contexts/AuthContext';
import { CHANNEL_TYPES } from '@/constants/chat';


interface ChannelState {
  channel: Channel | null;
  channelName: string;
  isTyping: boolean;
  isOnline: boolean;
  unreadCount: number;
}

export const useChannelsListItem = (channelId: string, channelType: string) => {
  const [state, setState] = useState<ChannelState>({
    channel: null,
    channelName: '',
    isTyping: false,
    isOnline: false,
    unreadCount: 0
  });

  const { client } = useChatContext();
  const { user } = useAuth();
  const mountedRef = useRef(true);
  const channelRef = useRef<Channel | null>(null);

  // Function to get channel name based on channel type
  const getChannelName = (channelInstance: Channel): string => {
    if (channelType === CHANNEL_TYPES.dm.value) {
      // For direct messages, use member names
      const members = Object.entries(channelInstance.state.members || {})
        .filter(([memberId]) => memberId !== `user_${user?.id}`)
        .map(([, member]) => member.user.name);
      
      return members.join(', ');
    } else {
      // For other channel types, use channel name from data
      return channelInstance.data?.name || '';
    }
  };

  // Function to get online status (only for DM channels)
  const getOnlineStatus = (channelInstance: Channel): boolean => {
    if (channelType === CHANNEL_TYPES.dm.value) {
      const members = Object.entries(channelInstance.state.members || {})
        .filter(([memberId]) => memberId !== `user_${user?.id}`)
        .map(([, member]) => member.user.online);
      
      return members.some(online => online);
    }
    return false; // For non-DM channels, we don't track online status
  };

  useEffect(() => {
    mountedRef.current = true;
    // alert("test");

    const setupChannel = async () => {
      if (!client || !channelId) return;

      try {
        // Get or create channel instance
        const channelInstance =  client.channel(channelType, channelId);
        
        channelRef.current = channelInstance;

        if (!mountedRef.current) return;

        // Calculate channelName and isOnline using helper functions
        const channelName = getChannelName(channelInstance);
        const isOnline = getOnlineStatus(channelInstance);
        const unreadCount = channelInstance.countUnread() || 0;

        // Initialize state
        setState(prev => ({
          ...prev,
          channel: channelInstance,
          channelName,
          isOnline,
          unreadCount
        }));

        // Event listeners
        const handleTypingStart = (event: any) => {

          if (!mountedRef.current) return;
          if (event.user.id === `user_${user?.id}`) return;
          
          setState(prev => ({
            ...prev,
            isTyping: true
          }));
          
        };

        const handleTypingStop = (event: any) => {
          if (!mountedRef.current) return;
          if (event.user.id === `user_${user?.id}`) return;
          setState(prev => ({
            ...prev,
            isTyping: false
          }));
        };

        const handleMessageNew = () => {
          if (!mountedRef.current) return;
          
          const unreadCount = channelInstance.countUnread() || 0;
          
          setState(prev => ({
            ...prev,
            unreadCount
          }));
        };

        const handleMessageRead = () => {
          if (!mountedRef.current) return;
          
          const unreadCount = channelInstance.countUnread() || 0;
          
          setState(prev => ({
            ...prev,
            unreadCount
          }));
        };

        const handleUserPresenceChanged = () => {
          if (!mountedRef.current) return;
          
          const isOnline = getOnlineStatus(channelInstance);

          setState(prev => ({
            ...prev,
            isOnline
          }));
        };

        // Attach event listeners
        channelInstance.on('typing.start', handleTypingStart);
        channelInstance.on('typing.stop', handleTypingStop);
        // channelInstance.on('member.added', handleMemberAdded);
        // channelInstance.on('member.removed', handleMemberRemoved);
        channelInstance.on('message.new', handleMessageNew);
        channelInstance.on('message.read', handleMessageRead);
        channelInstance.on('user.watching.start', handleUserPresenceChanged);
        channelInstance.on('user.watching.stop', handleUserPresenceChanged);

        // Cleanup function
        return () => {
          channelInstance.off('typing.start', handleTypingStart);
          channelInstance.off('typing.stop', handleTypingStop);
          // channelInstance.off('member.added', handleMemberAdded);
          // channelInstance.off('member.removed', handleMemberRemoved);
          channelInstance.off('message.new', handleMessageNew);
          channelInstance.off('message.read', handleMessageRead);
          channelInstance.off('user.watching.start', handleUserPresenceChanged);
          channelInstance.off('user.watching.stop', handleUserPresenceChanged);
        };

      } catch (error) {
        console.error('Error setting up channel:', error);
      }
    };

    setupChannel();

    return () => {
      mountedRef.current = false;
    };
  }, [client, channelId, user?.id]);

  // Utility functions
  const markAsRead = () => {
    if (channelRef.current) {
      channelRef.current.markRead();
      // Update unread count after marking as read
      const unreadCount = channelRef.current.countUnread() || 0;
      setState(prev => ({
        ...prev,
        unreadCount
      }));
    }
  };

  return {
    ...state,
    markAsRead
  };
}; 