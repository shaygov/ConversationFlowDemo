import React from "react";
import {
  Channel,
  VirtualizedMessageList,
  Thread,
  MessageInput,
} from 'stream-chat-react';
import {ChatContainerStyled} from '@components/ChatContainer/style';
import ChatInput from '@components/ChatContainer/ChatInput';
import ChannelTitleBar from './ChannelTitleBar';
import ChatPanel from '@components/ChatContainer/ChatPanel';
import TabsWithContent from '@/components/Tabs/TabsWithContent';
import CustomMessage from './CustomMessage';
import { useChatChannel } from "@/hooks/useChatChannel";
import { useReactionButtonListener } from './useReactionButtonListener';
import { SourceComponentProvider } from './SourceComponentContext';
import { useActiveChannelManager } from '@/hooks/useActiveChannelManager';
import SidePanel from './SidePanel';
import { ChannelDisplayInfo } from '@/hooks/useUserChannels';

interface MessagesCoreProps {
  channelId: string | null;
  channelType: string | null;
  userChannelsList: ChannelDisplayInfo[];
  setSelectedChannel: ((channelId: string | null, channelType: string | null) => void) | null;
}

const CustomMessageWithSourceVirtualized = (props: any) => (
  <SourceComponentProvider value="VirtualizedMessageList">
    <CustomMessage {...props} />
  </SourceComponentProvider>
);

const CustomMessageWithSourceThread = (props: any) => (
  <SourceComponentProvider value="Thread">
    <CustomMessage {...props} />
  </SourceComponentProvider>
);

const MessagesCore = ({ 
  channelId, 
  channelType, 
  userChannelsList, 
  setSelectedChannel 
}: MessagesCoreProps) => {


  
  const {
    channel,
    channelName,
    isFavorite,
    isOnline,
    isLoading,
    error,
  } = useChatChannel({
    channelId: channelId || undefined, 
    channelType: channelType || undefined
  });

  // Example badge counts (replace with real data)
  const badgeCounts = {
    chat: 3,
    profile: 1,
    saved: 5,
    assigner: 2,
  };

  useReactionButtonListener();

  // Manage active channel state
  useActiveChannelManager(channel);


  if (!channel) return null;

  return (
    <Channel channel={channel}>
      <ChatContainerStyled>
        <ChatPanel>
          <ChannelTitleBar
            channelName={`${channelName}`}
            isOnline={isOnline}
            isFavorite={isFavorite}
            channelId={channelId}
            channels={userChannelsList}
            setSelectedChannel={setSelectedChannel || (() => {})}
          />
          <TabsWithContent
            tabs={[
              {
                key: 'chat',
                label: 'Chat',
                content: <>
                  <VirtualizedMessageList Message={CustomMessageWithSourceVirtualized} disableDateSeparator={false} key={`cmwv-${channel.id}`}/>
                  <MessageInput key={`mi-${channel.id}`} Input={ChatInput} />
                </>,
              },
              {
                key: 'profile',
                label: 'Profile',
                content: <>Profile tab content</>,
              },
              {
                key: 'saved',
                label: 'Saved Messages',
                badgeCount: badgeCounts.saved,
                content: <>Saved Messages tab content</>,
              },
              {
                key: 'assigner',
                label: 'Assigner Work',
                content: <>Assigner Work tab content</>,
              },
            ]}
          />
        </ChatPanel>
        <Thread 
          key={channel.id} 
          Message={CustomMessageWithSourceThread}
          Input={ChatInput} 
        />
        <SidePanel />
      </ChatContainerStyled>
    </Channel>
  );
};

MessagesCore.displayName = 'MessagesCore';

export default MessagesCore; 