import { useState, useEffect, useRef, useCallback } from 'react';
import { useActiveChannelService } from '@/contexts/ServicesContext';

/**
 * 
 * @param cid The channel ID to watch for active state changes
 * @returns boolean indicating if this channel is currently active
 */
export function useIsChannelActive(cid: string | null | undefined): boolean {
  const activeChannelService = useActiveChannelService();
  
  // Initialize state with current active status - only run once
  const [isActive, setIsActive] = useState(() => {
    return activeChannelService.isChannelActive(cid);
  });
  
  // Keep track of previous cid to handle changes
  const prevChannelIdRef = useRef<string | null | undefined>(cid);
  
  // Memoize the subscription callback to prevent unnecessary re-subscriptions
  const handleActiveChange = useCallback((newActiveCId: string | null) => {
    const newIsActive = cid ? newActiveCId === cid : false;
    setIsActive(newIsActive);
  }, [cid]);
  
  useEffect(() => {
    // If cid is null/undefined, always return false
    if (!cid) {
      setIsActive(false);
      prevChannelIdRef.current = cid;
      return;
    }

    // If cid changed, update state immediately
    if (prevChannelIdRef.current !== cid) {
      const currentActiveStatus = activeChannelService.isChannelActive(cid);
      setIsActive(currentActiveStatus);
      prevChannelIdRef.current = cid;
    }

    // Subscribe to active channel changes
    const unsubscribe = activeChannelService.subscribe(handleActiveChange);
    
    // Cleanup subscription on unmount or cid change
    return unsubscribe;
  }, [cid, activeChannelService, handleActiveChange]);

  return isActive;
}

export default useIsChannelActive; 