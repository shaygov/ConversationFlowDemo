import { useMemo } from 'react';

export function useAllChannelUsers(channels: any[], excludeUserId?: string) {
  return useMemo(() => {
    const allUsersMap = new Map();
    channels.forEach(channel => {
      const members = channel.state?.members || {};
      Object.values(members).forEach((member: any) => {
        if (member.user && member.user.id && member.user.id !== excludeUserId) {
          allUsersMap.set(member.user.id, member.user);
        }
      });
    });
    return Array.from(allUsersMap.values());
  }, [channels, excludeUserId]);
} 