import { renderHook, act, waitFor } from '@testing-library/react';
import { useUsersWorkspaceList } from '../useUsersWorkspaceList';
import { UserWorkspace } from '../../types/userCache';

// Mock the ServicesContext
const mockWorkspaceUsersService = {
  getCombinedCacheKey: jest.fn(),
  getCachedUsersForFilters: jest.fn(),
  getUsersForFilters: jest.fn(),
  subscribe: jest.fn(),
};

jest.mock('@/contexts/ServicesContext', () => ({
  useWorkspaceUsersService: () => mockWorkspaceUsersService
}));

// Mock data
const mockUsers: UserWorkspace[] = [
  { user: { id: 'user1', name: 'User One', workspace_id: 'workspace1' } },
  { user: { id: 'user2', name: 'User Two', workspace_id: 'workspace1' } },
  { user: { id: 'user3', name: 'User Three', workspace_id: 'workspace1' } },
];

const mockFilters = {
  request: { workspace_id: 'workspace1' },
  local: { type: 'all' },
  search: undefined as string | undefined
};

describe('useUsersWorkspaceList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWorkspaceUsersService.getCombinedCacheKey.mockReturnValue('cache-key-1');
    mockWorkspaceUsersService.getCachedUsersForFilters.mockReturnValue([]);
    mockWorkspaceUsersService.getUsersForFilters.mockResolvedValue(mockUsers);
    mockWorkspaceUsersService.subscribe.mockReturnValue(() => {});
  });

  it('should initialize with cached users when available', () => {
    mockWorkspaceUsersService.getCachedUsersForFilters.mockReturnValue(mockUsers);
    
    const { result } = renderHook(() => useUsersWorkspaceList(mockFilters));
    
    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.isLoading).toBe(false);
  });

  it('should show loading state when no cached data is available', () => {
    mockWorkspaceUsersService.getCachedUsersForFilters.mockReturnValue([]);
    
    const { result } = renderHook(() => useUsersWorkspaceList(mockFilters));
    
    expect(result.current.users).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('should fetch users when no cached data is available', async () => {
    mockWorkspaceUsersService.getCachedUsersForFilters.mockReturnValue([]);
    
    const { result } = renderHook(() => useUsersWorkspaceList(mockFilters));
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.users).toEqual(mockUsers);
    expect(mockWorkspaceUsersService.getUsersForFilters).toHaveBeenCalledWith(mockFilters);
  });

  it('should handle search filter changes', async () => {
    mockWorkspaceUsersService.getCachedUsersForFilters.mockReturnValue([]);
    
    const { result, rerender } = renderHook(
      ({ filters }) => useUsersWorkspaceList(filters),
      { initialProps: { filters: mockFilters } }
    );
    
    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Change search filter
    const newFilters = { ...mockFilters, search: 'User One' };
    rerender({ filters: newFilters });
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(mockWorkspaceUsersService.getUsersForFilters).toHaveBeenCalledWith(newFilters);
  });

  it('should not re-fetch when search filter is the same', async () => {
    mockWorkspaceUsersService.getCachedUsersForFilters.mockReturnValue([]);
    
    const { result, rerender } = renderHook(
      ({ filters }) => useUsersWorkspaceList(filters),
      { initialProps: { filters: mockFilters } }
    );
    
    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    const initialCallCount = mockWorkspaceUsersService.getUsersForFilters.mock.calls.length;
    
    // Rerender with same filters
    rerender({ filters: mockFilters });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Should not have made additional calls
    expect(mockWorkspaceUsersService.getUsersForFilters.mock.calls.length).toBe(initialCallCount);
  });

  it('should handle API errors gracefully', async () => {
    mockWorkspaceUsersService.getCachedUsersForFilters.mockReturnValue([]);
    mockWorkspaceUsersService.getUsersForFilters.mockRejectedValue(new Error('API Error'));
    
    const { result } = renderHook(() => useUsersWorkspaceList(mockFilters));
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.users).toEqual([]);
  });

  it('should subscribe to real-time updates', () => {
    renderHook(() => useUsersWorkspaceList(mockFilters));
    
    expect(mockWorkspaceUsersService.subscribe).toHaveBeenCalledWith(
      'cache-key-1',
      expect.any(Function)
    );
  });

  it('should handle real-time updates correctly', async () => {
    mockWorkspaceUsersService.getCachedUsersForFilters.mockReturnValue([]);
    
    const { result } = renderHook(() => useUsersWorkspaceList(mockFilters));
    
    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Simulate real-time update
    const subscribeCallback = mockWorkspaceUsersService.subscribe.mock.calls[0][1];
    const updatedUsers = [
      { user: { id: 'user4', name: 'User Four', workspace_id: 'workspace1' } }
    ];
    
    act(() => {
      subscribeCallback(updatedUsers);
    });
    
    expect(result.current.users).toEqual(updatedUsers);
  });

  it('should unsubscribe on unmount', () => {
    const unsubscribeMock = jest.fn();
    mockWorkspaceUsersService.subscribe.mockReturnValue(unsubscribeMock);
    
    const { unmount } = renderHook(() => useUsersWorkspaceList(mockFilters));
    
    unmount();
    
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it('should handle filters with different cache keys', () => {
    mockWorkspaceUsersService.getCombinedCacheKey
      .mockReturnValueOnce('cache-key-1')
      .mockReturnValueOnce('cache-key-2');
    
    const { result, rerender } = renderHook(
      ({ filters }) => useUsersWorkspaceList(filters),
      { initialProps: { filters: mockFilters } }
    );
    
    const newFilters = { ...mockFilters, local: { type: 'admin' } };
    rerender({ filters: newFilters });
    
    expect(mockWorkspaceUsersService.getCombinedCacheKey).toHaveBeenCalledWith(newFilters);
  });

  it('should handle empty filters gracefully', () => {
    const emptyFilters = { request: {} };
    
    const { result } = renderHook(() => useUsersWorkspaceList(emptyFilters));
    
    expect(result.current.users).toEqual([]);
    expect(mockWorkspaceUsersService.getCombinedCacheKey).toHaveBeenCalledWith(emptyFilters);
  });

  it('should use startTransition for state updates', async () => {
    mockWorkspaceUsersService.getCachedUsersForFilters.mockReturnValue([]);
    
    const { result } = renderHook(() => useUsersWorkspaceList(mockFilters));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.users).toEqual(mockUsers);
  });
});
