import React from 'react';
import styled from '@emotion/styled';
import { Channel } from 'stream-chat';
import { GlobalChannelListItem } from '@/components/GlobalChannelListItem';
import { useWorkspaceLayout } from '@/contexts/WorkspaceLayoutProvider';
import { BaseNavColumnDeviderStyled } from '@/components/WorkSpaceLayout/BaseNavColumn';

interface Props {
  title: string;
  channels: Channel[];
  activeChannelId?: string;
  onChannelSelect: (channel: Channel) => void;
}

const GroupTitle = styled.h5`
  margin-top: 0px;
  margin-bottom: 15px;
  padding: 0px 0px 0px 5px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
`;

const GroupContainer = styled.div``;

export const ChannelGroup: React.FC<Props> = ({
  title,
  channels,
  onChannelSelect
}) => {
  const { workspace, workspacelayout } = useWorkspaceLayout();
  
  if (!channels.length) {
    return null;
  }
  return (
    <GroupContainer>
      <GroupTitle>{title}</GroupTitle>
      {channels
        .sort((a, b) => {
          const aWorkspaceName = (a.data?.workspace_name as string) ?? '';
          const bWorkspaceName = (b.data?.workspace_name as string) ?? '';
          return aWorkspaceName.localeCompare(bWorkspaceName);
        })
        .map((channel) => {
        return (
          <GlobalChannelListItem
            key={channel.id}
            channelId={channel.id}
            channelType={channel.type}
            showWorkspaceName={workspace?.id? false : true}
            onChannelSelect={onChannelSelect}
          />
        )
      })}
       <BaseNavColumnDeviderStyled />
    </GroupContainer>
  );
}; 