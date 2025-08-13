import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserWorkspaceEvents, useFavoriteUsersList, useUnreadUsersList } from '../useUserWorkspaceEvents';
import { UserEventsState } from '@/types/userEvents';

// Mock the ServicesContext
const mockUserWorkspaceCoordinatorService = {
  isInitialized: jest.fn(),
  getInitialUserEventState: jest.fn(),
  subscribeToUserEventState: jest.fn(),
};

jest.mock('@/contexts/ServicesContext', () => ({
  useUserWorkspaceCoordinatorService: () => mockUserWorkspaceCoordinatorService
}));

// Mock the Zustand store
const mockUserEventsStore = {
  getFavoriteUsers: jest.fn(),
  getUnreadUsers: jest.fn(),
};

jest.mock('@/zustand/userEvents', () => ({
  useUserEventsStore: () => mockUserEventsStore
}));

// Mock Zustand's useStore to return the mock store
jest.mock('zustand', () => ({
  useStore: jest.fn((store, selector) => {
    // Return the result of calling the selector with the mock store
    return selector(mockUserEventsStore);
  })
}));

// Mock data
const mockUserState: UserEventsState = {
  id: 'user1',
  name: 'Test User',
  workspace_id: 'workspace1',
  isTyping: false,
  totalUnreadCount: 5,
  isOnline: true,
  isFavorite: true,
};

const mockInitialState: UserEventsState = {
  id: 'user1',
  name: '',
  workspace_id: 'workspace1',
  isTyping: false,
  totalUnreadCount: 0,
  isOnline: false,
  isFavorite: false,
};

const mockFavoriteUsers = [
  { userId: 'user1', state: { ...mockUserState, isFavorite: true } },
  { userId: 'user2', state: { id: 'user2', name: 'User Two', isFavorite: true, totalUnreadCount: 0, isOnline: false, isTyping: false } }
];

const mockUnreadUsers = [
  { userId: 'user1', state: { ...mockUserState, totalUnreadCount: 5 } },
  { userId: 'user3', state: { id: 'user3', name: 'User Three', isFavorite: false, totalUnreadCount: 3, isOnline: true, isTyping: false } }
];

describe('useUserWorkspaceEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserWorkspaceCoordinatorService.isInitialized.mockReturnValue(false);
    mockUserWorkspaceCoordinatorService.getInitialUserEventState.mockReturnValue(mockInitialState);
    mockUserWorkspaceCoordinatorService.subscribeToUserEventState.mockReturnValue(() => {});
  });

  describe('Initialization', () => {
    it('should return initial state when service is not initialized', () => {
      mockUserWorkspaceCoordinatorService.isInitialized.mockReturnValue(false);
      
      const { result } = renderHook(() => useUserWorkspaceEvents('user1', 'workspace1'));
      
      expect(result.current).toEqual({
        id: 'user1',
        name: '',
        workspace_id: 'workspace1',
        isTyping: false,
        totalUnreadCount: 0,
        isOnline: false,
        isFavorite: false,
      });
    });

    it('should return initial state from service when available', () => {
      mockUserWorkspaceCoordinatorService.isInitialized.mockReturnValue(true);
      mockUserWorkspaceCoordinatorService.getInitialUserEventState.mockReturnValue(mockUserState);
      
      const { result } = renderHook(() => useUserWorkspaceEvents('user1', 'workspace1'));
      
      expect(result.current).toEqual(mockUserState);
      expect(mockUserWorkspaceCoordinatorService.getInitialUserEventState).toHaveBeenCalledWith('user1', 'workspace1');
    });

    it('should handle undefined workspace_id', () => {
      mockUserWorkspaceCoordinatorService.isInitialized.mockReturnValue(false);
      
      const { result } = renderHook(() => useUserWorkspaceEvents('user1'));
      
      expect(result.current.workspace_id).toBeUndefined();
    });
  });

  describe('Subscription and Updates', () => {
    it('should subscribe to user events when service is initialized', () => {
      mockUserWorkspaceCoordinatorService.isInitialized.mockReturnValue(true);
      mockUserWorkspaceCoordinatorService.getInitialUserEventState.mockReturnValue(mockInitialState);
      
      renderHook(() => useUserWorkspaceEvents('user1', 'workspace1'));
      
      expect(mockUserWorkspaceCoordinatorService.subscribeToUserEventState).toHaveBeenCalledWith(
        'user1',
        'workspace1',
        expect.any(Function)
      );
    });

    it('should not subscribe when service is not initialized', () => {
      mockUserWorkspaceCoordinatorService.isInitialized.mockReturnValue(false);
      
      renderHook(() => useUserWorkspaceEvents('user1', 'workspace1'));
      
      expect(mockUserWorkspaceCoordinatorService.subscribeToUserEventState).not.toHaveBeenCalled();
    });

    it('should update state when subscription callback is called', async () => {
      mockUserWorkspaceCoordinatorService.isInitialized.mockReturnValue(true);
      mockUserWorkspaceCoordinatorService.getInitialUserEventState.mockReturnValue(mockInitialState);
      
      let subscriptionCallback: ((state: UserEventsState) => void) | null = null;
      mockUserWorkspaceCoordinatorService.subscribeToUserEventState.mockImplementation((userId, workspaceId, callback) => {
        subscriptionCallback = callback;
        return () => {};
      });
      
      const { result } = renderHook(() => useUserWorkspaceEvents('user1', 'workspace1'));
      
      expect(result.current).toEqual(mockInitialState);
      
      // Simulate state update from subscription
      act(() => {
        if (subscriptionCallback) {
          subscriptionCallback(mockUserState);
        }
      });
      
      expect(result.current).toEqual(mockUserState);
    });

    it('should unsubscribe when component unmounts', () => {
      const unsubscribeMock = jest.fn();
      mockUserWorkspaceCoordinatorService.isInitialized.mockReturnValue(true);
      mockUserWorkspaceCoordinatorService.getInitialUserEventState.mockReturnValue(mockInitialState);
      mockUserWorkspaceCoordinatorService.subscribeToUserEventState.mockReturnValue(unsubscribeMock);
      
      const { unmount } = renderHook(() => useUserWorkspaceEvents('user1', 'workspace1'));
      
      unmount();
      
      expect(unsubscribeMock).toHaveBeenCalled();
    });
  });

  describe('Dependencies and Re-renders', () => {
    it('should re-subscribe when userId changes', () => {
      mockUserWorkspaceCoordinatorService.isInitialized.mockReturnValue(true);
      mockUserWorkspaceCoordinatorService.getInitialUserEventState.mockReturnValue(mockInitialState);
      
      const { rerender } = renderHook(
        ({ userId, workspaceId }) => useUserWorkspaceEvents(userId, workspaceId),
        { initialProps: { userId: 'user1', workspaceId: 'workspace1' } }
      );
      
      expect(mockUserWorkspaceCoordinatorService.subscribeToUserEventState).toHaveBeenCalledWith(
        'user1',
        'workspace1',
        expect.any(Function)
      );
      
      // Change userId
      rerender({ userId: 'user2', workspaceId: 'workspace1' });
      
      expect(mockUserWorkspaceCoordinatorService.subscribeToUserEventState).toHaveBeenCalledWith(
        'user2',
        'workspace1',
        expect.any(Function)
      );
    });

    it('should re-subscribe when workspace_id changes', () => {
      mockUserWorkspaceCoordinatorService.isInitialized.mockReturnValue(true);
      mockUserWorkspaceCoordinatorService.getInitialUserEventState.mockReturnValue(mockInitialState);
      
      const { rerender } = renderHook(
        ({ userId, workspaceId }) => useUserWorkspaceEvents(userId, workspaceId),
        { initialProps: { userId: 'user1', workspaceId: 'workspace1' } }
      );
      
      expect(mockUserWorkspaceCoordinatorService.subscribeToUserEventState).toHaveBeenCalledWith(
        'user1',
        'workspace1',
        expect.any(Function)
      );
      
      // Change workspace_id
      rerender({ userId: 'user1', workspaceId: 'workspace2' });
      
      expect(mockUserWorkspaceCoordinatorService.subscribeToUserEventState).toHaveBeenCalledWith(
        'user1',
        'workspace2',
        expect.any(Function)
      );
    });
  });
});

describe('useFavoriteUsersList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserEventsStore.getFavoriteUsers.mockReturnValue(mockFavoriteUsers);
  });

  it('should return favorite users from store', () => {
    const { result } = renderHook(() => useFavoriteUsersList());
    
    expect(result.current.favoriteUsers).toEqual(mockFavoriteUsers);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should call getFavoriteUsers from store', () => {
    renderHook(() => useFavoriteUsersList());
    
    expect(mockUserEventsStore.getFavoriteUsers).toHaveBeenCalled();
  });
});

describe('useUnreadUsersList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserEventsStore.getUnreadUsers.mockReturnValue(mockUnreadUsers);
  });

  it('should return unread users from store', () => {
    const { result } = renderHook(() => useUnreadUsersList());
    
    expect(result.current.unreadUsers).toEqual(mockUnreadUsers);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should call getUnreadUsers from store', () => {
    renderHook(() => useUnreadUsersList());
    
    expect(mockUserEventsStore.getUnreadUsers).toHaveBeenCalled();
  });
});
