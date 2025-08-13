import { useMemo } from 'react';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';

export function useCurrentChannelUsers() {
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  const channelUsers = useMemo(() => {
    if (!channel || !channel.state?.members) {
      return [];
    }

    const members = channel.state.members;
    const users: any[] = [];

    Object.values(members).forEach((member: any) => {
      if (member.user && member.user.id && member.user.id !== client.userID) {
        users.push(member.user);
      }
    });

    return users;
  }, [channel, client.userID]);

  return { channelUsers, isLoading: false, error: null as Error | null };
} 