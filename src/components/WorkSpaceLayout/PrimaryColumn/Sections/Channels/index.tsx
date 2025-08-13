import React from "react";
import { Channel, DefaultGenerics } from 'stream-chat';
import { CHANNEL_TYPES } from "@/constants/chat";
import useModalStore from '@/zustand/modal';
import { useWorkspace } from "@/contexts/WorkspaceProvider";
import { GlobalChannelList } from "@/components/GlobalChannelList";
import { GlobalChannelListItem } from '@/components/GlobalChannelListItem';
import Icon from '@/libs/components/widgets/Icon/Icon';
import ColumnLayoutTitle from "@components/WorkSpaceLayout/ColumnLayout/ColumnLayoutTitle";

export const CURRENT_SECTION_NAME = 'channels';

const Channels: React.FC = () => {
  const setModalContent = useModalStore((state: any) => state.set);
  const { workspace, baseFilters, updateWorkspaceColumn } = useWorkspace();

  const publicFilters = React.useMemo(() => {
    const base = baseFilters();
    return {
      ...base,
      local: {
        ...base.local,
        type: CHANNEL_TYPES.public.value,
      },
    };
  }, [baseFilters]);

  const privateFilters = React.useMemo(() => {
    const base = baseFilters(); 
    return {
      ...base,
      local: {
        ...base.local,
        type: CHANNEL_TYPES.private.value,
      },
    };
  }, [baseFilters]);

  const handlePublicChannelSelect = React.useCallback((channel: Channel<DefaultGenerics>) => {
    updateWorkspaceColumn('secondary', {
      component: null,
      mainComponent: {
        type: 'ChatMessages',
        props: { 
          id: channel.id,
          channelType: channel.type,
          channelId: channel.id,
        },
      },
    });
  }, [publicFilters]);

  const handlePrivateChannelSelect = React.useCallback((channel: Channel<DefaultGenerics>) => {
    updateWorkspaceColumn('secondary', {
      component: null,
      mainComponent: {
        type: 'ChatMessages',
        props: { 
          id: channel.id,
          channelType: channel.type,
          channelId: channel.id,
        },
      },
    });
  }, [privateFilters]);


  const renderPublicChannels = (channels: Channel<DefaultGenerics>[]) => {
    return channels.map((channel) => (
      <GlobalChannelListItem 
        key={`public-${channel.id}`}
        channelId={channel.id}
        channelType={channel.type}
        onChannelSelect={handlePublicChannelSelect}
      />
    ));
  };

  const renderPrivateChannels = (channels: Channel<DefaultGenerics>[]) => {
    return channels.map((channel) => (
      <GlobalChannelListItem 
        key={`private-${channel.id}`}
        channelId={channel.id}
        channelType={channel.type}
        onChannelSelect={handlePrivateChannelSelect}
      />
    ));
  };

  return  (
    <div style={{ width: '100%' }}>
      <ColumnLayoutTitle>
        <div>Channels</div>
        <button 
          style={{ background: 'none', border: '0', color: '#fff', borderRadius: 4, padding: '2px 0px', cursor: 'pointer' }}
        onClick={() => {
          setModalContent({
            '@components/Settings/Modals/ChannelsManager/Create': {}
          });
        }}>
          <Icon name="plus" size="S" />
        </button>
      </ColumnLayoutTitle>
      <GlobalChannelList
        key={`public-${workspace?.id}`}
        filters={publicFilters}
        renderChannels={renderPublicChannels}
        EmptyStateIndicator={() => null}
        autoWatch={true}
      />
      <GlobalChannelList
        key={`private-${workspace?.id}`}
        filters={privateFilters}
        renderChannels={renderPrivateChannels}
        EmptyStateIndicator={() => null}
        autoWatch={true}
      />
    </div>
  );
};

export default Channels;
