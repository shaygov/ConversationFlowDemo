import { useState, useEffect } from 'react';
import { useUserWorkspaceCoordinatorService } from '@/contexts/ServicesContext';
import { UserEventsState } from '@/types/userEvents';
import { useUserEventsStore } from '@/zustand/userEvents';
import { useStore } from 'zustand';

export type UserWorkspaceEventsState = UserEventsState;

export const useUserWorkspaceEvents = (
  userId: string, 
  workspace_id?: string
): UserWorkspaceEventsState => {
  const userWorkspaceCoordinatorService = useUserWorkspaceCoordinatorService();
  
  const [userState, setUserState] = useState<UserEventsState>(() => {
    // Get initial state from service if available
    if (userWorkspaceCoordinatorService.isInitialized()) {
      const initialState = userWorkspaceCoordinatorService.getInitialUserEventState(userId, workspace_id);
      return initialState;
    }
    return {
      id: userId,
      name: '', // This should be populated from user data
      workspace_id: workspace_id,
      isTyping: false,
      totalUnreadCount: 0,
      isOnline: false,
      isFavorite: false,
    };
  });

  // Subscribe to user events
  useEffect(() => {
    if (!userWorkspaceCoordinatorService.isInitialized()) {
      return;
    }

    // Subscribe to changes (this will also load initial data)
    const unsubscribe = userWorkspaceCoordinatorService.subscribeToUserEventState(
      userId,
      workspace_id,
      (state) => {
        setUserState(state);
        // Also update the store for other hooks to use
        // setStoreUserState(userId, workspace_id, state);
      }
    );

    return unsubscribe;
  }, [userWorkspaceCoordinatorService, userId, workspace_id]);

  
  return userState;
};


// Re-export the type from the store
export type { UserWithState } from '@/zustand/userEvents';

export const useFavoriteUsersList = () => {
  const favoriteUsers = useStore(useUserEventsStore, (state) => state.getFavoriteUsers());
  return {
    favoriteUsers,
    isLoading: false,
    error: null as any
  };
};

export const useUnreadUsersList = () => {
  const unreadUsers = useStore(useUserEventsStore, (state) => state.getUnreadUsers());
  return {
    unreadUsers,
    isLoading: false,
    error: null as any
  };
};
