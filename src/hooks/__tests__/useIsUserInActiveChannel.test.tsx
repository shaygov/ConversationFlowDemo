import { renderHook, act } from '@testing-library/react';
import { Channel, DefaultGenerics } from 'stream-chat'; 
import { useIsUserInActiveChannel } from '../useIsUserInActiveChannel';
import { ActiveChannelService } from '../../services/ActiveChannelService';
import { UserChannelsManager } from '../../services/UserChannelsManager';
import { MainChannelsService } from '../../services/MainChannelsService';

// Mock MainChannelsService
jest.mock('../../services/MainChannelsService', () => ({
  MainChannelsService: {
    getInstance: jest.fn(() => ({
      getChannelById: jest.fn(),
      getAllCachedChannels: jest.fn(() => [])
    }))
  }
}));

// Mock the ServicesContext
jest.mock('@/contexts/ServicesContext', () => ({
  useActiveChannelService: () => ActiveChannelService.getInstance(),
  useUserChannelsManager: () => UserChannelsManager.getInstance(MainChannelsService.getInstance())
}));

// Mock channel for testing
const createMockChannel = (id: string, members: string[]): Channel<DefaultGenerics> => {
  const mockChannel = {
    id,
    cid: id,
    type: 'dm',
    state: {
      members: members.reduce((acc, memberId) => {
        acc[`user_${memberId}`] = {
          user: { id: memberId, name: `User ${memberId}` }
        };
        return acc;
      }, {} as any)
    }
  } as Channel<DefaultGenerics>;
  
  return mockChannel;
};

describe('useIsUserInActiveChannel', () => {
  let activeChannelService: ActiveChannelService;
  let userChannelsManager: UserChannelsManager;
  let mockMainChannelsService: any;

  beforeEach(() => {
    activeChannelService = ActiveChannelService.getInstance();
    mockMainChannelsService = MainChannelsService.getInstance();
    userChannelsManager = UserChannelsManager.getInstance(mockMainChannelsService);
    activeChannelService.reset();
  });

  afterEach(() => {
    activeChannelService.reset();
  });

  it('should return false when userId is null', () => {
    const { result } = renderHook(() => useIsUserInActiveChannel(null));
    expect(result.current).toBe(false);
  });

  it('should return false when userId is undefined', () => {
    const { result } = renderHook(() => useIsUserInActiveChannel(undefined));
    expect(result.current).toBe(false);
  });

  it('should return false when no active channel is set', () => {
    const { result } = renderHook(() => useIsUserInActiveChannel('user123'));
    expect(result.current).toBe(false);
  });

  it('should return true when user is a member of the active channel', () => {
    const mockChannel = createMockChannel('channel1', ['user123', 'user456']);
    
    act(() => {
      activeChannelService.setActiveChannel(mockChannel);
    });

    const { result } = renderHook(() => useIsUserInActiveChannel('user123'));
    expect(result.current).toBe(true);
  });

  it('should return false when user is not a member of the active channel', () => {
    const mockChannel = createMockChannel('channel1', ['user123', 'user456']);
    
    act(() => {
      activeChannelService.setActiveChannel(mockChannel);
    });

    const { result } = renderHook(() => useIsUserInActiveChannel('user789'));
    expect(result.current).toBe(false);
  });

  it('should update when active channel changes', () => {
    const { result, rerender } = renderHook(
      ({ userId }) => useIsUserInActiveChannel(userId),
      { initialProps: { userId: 'user123' } }
    );

    // Initially no active channel
    expect(result.current).toBe(false);

    // Set first channel
    act(() => {
      const mockChannel1 = createMockChannel('channel1', ['user123', 'user456']);
      activeChannelService.setActiveChannel(mockChannel1);
    });
    expect(result.current).toBe(true);

    // Change to second channel
    act(() => {
      const mockChannel2 = createMockChannel('channel2', ['user789', 'user101']);
      activeChannelService.setActiveChannel(mockChannel2);
    });
    expect(result.current).toBe(false);

    // Change back to first channel
    act(() => {
      const mockChannel1 = createMockChannel('channel1', ['user123', 'user456']);
      activeChannelService.setActiveChannel(mockChannel1);
    });
    expect(result.current).toBe(true);
  });

  it('should update when userId changes', () => {
    const { result, rerender } = renderHook(
      ({ userId }) => useIsUserInActiveChannel(userId),
      { initialProps: { userId: 'user123' } }
    );

    // Set active channel
    act(() => {
      const mockChannel = createMockChannel('channel1', ['user123', 'user456']);
      activeChannelService.setActiveChannel(mockChannel);
    });

    // Check first user
    expect(result.current).toBe(true);

    // Change to second user
    rerender({ userId: 'user456' });
    expect(result.current).toBe(true);

    // Change to user not in channel
    rerender({ userId: 'user789' });
    expect(result.current).toBe(false);
  });

  it('should handle channel with no members', () => {
    const mockChannel = createMockChannel('channel1', []);
    
    act(() => {
      activeChannelService.setActiveChannel(mockChannel);
    });

    const { result } = renderHook(() => useIsUserInActiveChannel('user123'));
    expect(result.current).toBe(false);
  });

  it('should handle channel with null/undefined members state', () => {
    const mockChannel = {
      id: 'channel1',
      cid: 'channel1',
      type: 'dm',
      state: { members: null }
    } as unknown as Channel<DefaultGenerics>;
    
    act(() => {
      activeChannelService.setActiveChannel(mockChannel);
    });

    const { result } = renderHook(() => useIsUserInActiveChannel('user123'));
    expect(result.current).toBe(false);
  });
});
