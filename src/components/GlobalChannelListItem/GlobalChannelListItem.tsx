import React from 'react';
import Avatar from '@/libs/components/widgets/Avatar/Avatar';
import { getInitials } from '@/helpers';
import SidebarRow from '@/components/WorkSpaceLayout/PrimaryColumn/Components/Row';
import Theme from '@vars/Theme';
import { useChannelsListItem } from '@/hooks/useChannelsListItem';
import useIsChannelActive from '@/hooks/useIsChannelActive';

export interface GlobalChannelListItemProps {
  channelId: string;
  channelType: string;
  showWorkspaceName?: boolean;
  onChannelSelect: (channel: any) => void;
}

export const GlobalChannelListItem: React.FC<GlobalChannelListItemProps> = ({ 
  channelId, 
  channelType,
  showWorkspaceName,
  onChannelSelect,
}) => {

  const {
    channel,
    channelName,
    isTyping,
    markAsRead,
    isOnline,
    unreadCount
  } = useChannelsListItem(channelId, channelType);

  const isActive = useIsChannelActive(channel?.cid);

  const handleClick = () => {
    if (channel) {
      markAsRead();
      onChannelSelect(channel);
    }
  };

  const initials = getInitials(channelName);
  const workspaceName = showWorkspaceName ? channel?.data?.workspace_name ?? '' : '';

  return (
    <div 
      onClick={handleClick}
      className={`global-channel-list-item ${isActive ? 'active' : ''}`}
    >
      <SidebarRow 
       active = {isActive}
        item={{
          isTyping: isTyping,
          badgeProvider: ()=>  unreadCount,
          bgColor: Theme['semantic-colors'].base['b-dark-blue'],
          icon: () => initials ? <Avatar text={initials} online={isOnline} /> : null,
          label: workspaceName ? `${channelName} (${workspaceName})` : channelName,
        }} 
      />
    </div>
  );
}; 