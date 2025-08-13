import { useEffect, useState, useMemo } from "react";
import { useWorkspaceChannelsList } from '@/hooks/useWorkspaceChannelsList';
import { useWorkspace } from "@/contexts/WorkspaceProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useChatContext } from "stream-chat-react";

export function useAllMessagesWorkspaceCount() {
  const { user } = useAuth();
  const { workspace } = useWorkspace();


  return 0;


  // TODO: Implement this
  const [unreadTotal, setUnreadTotal] = useState(0);
  const { channel } = useChatContext();
  const activeChannelId = channel?.id;

  const filters = useMemo(() => ({
    request: {
      members: {
        $in: [`user_${user?.id}`]
      },
      // workspace_id: `${workspace.id}`
    },
    local: {
      workspace_id: `${workspace.id}`
    }
  }), [workspace?.id, user?.id]);

  const { channels } = useWorkspaceChannelsList({ filters });

  useEffect(() => {
    if (!channels) return;

    // Function to recalculate unread count
    const recalcUnread = () => {
      const total = channels.reduce(
        (sum, channel) =>
          channel.id === activeChannelId
            ? sum
            : sum + (channel.countUnread ? channel.countUnread() : 0),
        0
      );
      setUnreadTotal(total);
    };

    // Listen for events on all channels
    const unsubscribes = channels.map(channel => {
      const handler = () => recalcUnread();
      channel.on("message.new", handler);
      channel.on("notification.mark_read", handler);
      // You can add more events here if needed
      return () => {
        channel.off("message.new", handler);
        channel.off("notification.mark_read", handler);
      };
    });
    // Initial calculation
    recalcUnread();
    // Cleanup
    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [channels, activeChannelId]);

  return unreadTotal;
} 