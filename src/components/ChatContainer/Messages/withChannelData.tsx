import React from 'react';
import { useUserChannelsInheritance } from '@/hooks/useUserChannels';
import { UserWorkspace } from '@/types/userCache';
import { ChannelDisplayInfo } from '@/hooks/useUserChannels';

interface ChannelData {
  channelId: string | null;
  channelType: string | null;
  userChannelsList: ChannelDisplayInfo[];
  setSelectedChannel: ((channelId: string | null, channelType: string | null) => void) | null;
}

interface WithChannelDataProps {
  user?: UserWorkspace['user'];
  channelId?: string;
  channelType?: string;
}

export const withChannelData = <P extends object>(
  WrappedComponent: React.ComponentType<P & ChannelData>
) => {
  const WithChannelDataComponent = (props: P & WithChannelDataProps) => {
    const { user, channelId: directChannelId, channelType: directChannelType, ...restProps } = props;


    let channelData: ChannelData;

    if (user) {
      const userChannels = useUserChannelsInheritance(user.id, user.workspace_id);
      channelData = {
        channelId: userChannels.selectedChannelId,
        channelType: userChannels.selectedChannelType,
        userChannelsList: userChannels.channels,
        setSelectedChannel: userChannels.setSelectedChannel,
      };
    } else {
      channelData = {
        channelId: directChannelId || null,
        channelType: directChannelType || null,
        userChannelsList: [],
        setSelectedChannel: null,
      };
    }
    const componentProps = { ...restProps, ...channelData } as P & ChannelData;
    return <WrappedComponent {...componentProps} />;
  };

  WithChannelDataComponent.displayName = `withChannelData(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithChannelDataComponent;
}; 