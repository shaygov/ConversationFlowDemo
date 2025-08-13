import { useMemo } from 'react';
import { useWorkspaceChannelsList } from '@/hooks/useWorkspaceChannelsList';
import { CHANNEL_TYPES } from '@/constants/chat';
import { useWorkspace } from '@/contexts/WorkspaceProvider';
import { useChatContext } from 'stream-chat-react';

export function useAllWorkspaceChannelUsers() {

  const { workspace } = useWorkspace();
  const { client } = useChatContext();
  const workspaceId = `${workspace.id}`;

  const filters = useMemo(() => ({
    request: {
      members: { $in: [client.userID] },
      // workspace_id: workspaceId,
    },
    local: {
      type: CHANNEL_TYPES.dm.value,
      workspace_id: workspaceId,
    },
  }), [workspaceId, client.userID]);

  const { channels, isLoading, error } = useWorkspaceChannelsList({ filters });

  const allUsers = useMemo(() => {
    const allUsersMap = new Map();
    channels.forEach(channel => {
      const members = channel.state?.members || {};
      Object.values(members).forEach((member: any) => {
        if (member.user && member.user.id && member.user.id !== client.userID) {
          allUsersMap.set(member.user.id, member.user);
        }
      });
    });
    return Array.from(allUsersMap.values());
  }, [channels, client.userID]);

  return { allUsers, isLoading, error, channels };
} 