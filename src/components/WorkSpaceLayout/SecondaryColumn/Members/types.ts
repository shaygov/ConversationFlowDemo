import { Channel, ChannelFilters } from 'stream-chat';
import { StreamChatType } from '@/types/stream-chat';

export interface UserListItemProps {
  channelId: string;
  channelType: string;
  isActive?: boolean;
  showWorkspaceName?: boolean;
  onChannelSelect: (channel: Channel) => void;
}

export interface ChannelGroup {
  title: string;
  channels: Channel[];
}

export interface WorkspaceChannels {
  activeChannels: Channel[];
  inactiveChannels: Channel[];
}

export interface RenderChannelsProps {
  channels: Channel[];
  activeChannelId?: string;
  onChannelSelect: (channel: Channel) => void;
} 