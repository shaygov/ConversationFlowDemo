import { useState, useEffect, useRef, useCallback } from 'react';
import { useActiveChannelService } from '@/contexts/ServicesContext';
import { useUserChannelsManager } from '@/contexts/ServicesContext';

/**
 * Hook that checks if a given user is a member of the currently active channel
 * @param userId The user ID to check for membership in the active channel
 * @returns boolean indicating if the user is a member of the active channel
 */
export function useIsUserInActiveChannel(userId: string | null | undefined): boolean {
  const activeChannelService = useActiveChannelService();
  const userChannelsManager = useUserChannelsManager();
  
  // Initialize state with current membership status - only run once
  const [isMember, setIsMember] = useState(() => {
    const activeChannel = activeChannelService.getActiveChannel();
    if (!activeChannel || !userId) return false;
    return userChannelsManager.isUserMemberOfChannel(activeChannel, userId);
  });
  
  // Keep track of previous userId to handle changes
  const prevUserIdRef = useRef<string | null | undefined>(userId);
  
  // Memoize the subscription callback to prevent unnecessary re-subscriptions
  const handleActiveChange = useCallback((newActiveChannelId: string | null) => {
    if (!userId) {
      setIsMember(false);
      return;
    }
    
    // Get the new active channel
    const activeChannel = activeChannelService.getActiveChannel();
    
    // Use UserChannelsManager for validation
    const newIsMember = activeChannel ? userChannelsManager.isUserMemberOfChannel(activeChannel, userId) : false;
    setIsMember(newIsMember);
  }, [userId, activeChannelService, userChannelsManager]);
  
  useEffect(() => {
    // If userId is null/undefined, always return false
    if (!userId) {
      setIsMember(false);
      prevUserIdRef.current = userId;
      return;
    }

    // If userId changed, update state immediately
    if (prevUserIdRef.current !== userId) {
      const activeChannel = activeChannelService.getActiveChannel();
      const currentMembershipStatus = activeChannel ? userChannelsManager.isUserMemberOfChannel(activeChannel, userId) : false;
      setIsMember(currentMembershipStatus);
      prevUserIdRef.current = userId;
    }

    // Subscribe to active channel changes
    const unsubscribe = activeChannelService.subscribe(handleActiveChange);
    
    // Cleanup subscription on unmount or userId change
    return unsubscribe;
  }, [userId, activeChannelService, handleActiveChange, userChannelsManager]);

  return isMember;
}

export default useIsUserInActiveChannel;
