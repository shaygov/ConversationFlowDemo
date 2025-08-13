import React, { useCallback, useEffect } from 'react';
import { UserWorkspace } from '@/types/userCache';
import { WorkspaceUsersList } from '@/components/WorkSpaceLayout/SecondaryColumn/Members/components/WorkspaceUsersList';
import { UserChannelGroup } from '@/components/WorkSpaceLayout/SecondaryColumn/Members/components/UserChannelGroup';
import { useMembers } from '@/components/WorkSpaceLayout/SecondaryColumn/Members/MembersContext';

import MemberItem from '../components/MemberItem';

const AllMembers: React.FC = () => {
  const { workspace, filters, updateWorkspaceColumn } = useMembers();

  const handleChannelSelect = useCallback((user: UserWorkspace['user']) => {
    updateWorkspaceColumn('secondary', {
      mainComponent: {
        type: 'ChatMessages',
        props: {
          userId: user.id,
          user: user
        }
      },
    });
  }, [updateWorkspaceColumn]);


  // Use grouped logic on already loaded channels
  const renderChannels = useCallback((loadedUsers: UserWorkspace[]) => {
    return (
      <UserChannelGroup
        title="All members"
        items={loadedUsers}
        onItemSelect={(item) => handleChannelSelect(item.user)}
        ItemComponent={({ item, onItemSelect }) => (
          <MemberItem
            mode="basic"
            key={item.user.id}
            userId={item.user.id}
            onUserSelect={() => onItemSelect(item)}
          />
        )}    
      />
    );
  }, [handleChannelSelect, filters]);
  return (
    <WorkspaceUsersList
      key={workspace?.id}
      filters={filters}
      renderChannels={renderChannels}
    />
  );
};

export default AllMembers;

