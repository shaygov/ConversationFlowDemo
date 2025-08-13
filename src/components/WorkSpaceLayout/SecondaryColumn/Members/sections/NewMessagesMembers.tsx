import { useUnreadUsersList } from '@/hooks/useUserWorkspaceEvents';
import { GroupTitle, GroupContainer } from '../components/UserChannelGroup.styles';
import MemberItem from '../components/MemberItem';
import { useMembers } from '../MembersContext';
import { useCallback } from 'react';
import { UserWorkspace } from '@/types/userCache';

function NewMessagesMembers() {
    const { unreadUsers, isLoading: unreadLoading, error: unreadError } = useUnreadUsersList();
    const { updateWorkspaceColumn } = useMembers();
    const handleChannelSelect = useCallback((user: UserWorkspace['user']) => {
      updateWorkspaceColumn('secondary', {
        mainComponent: {
          type: 'ChatMessages',
          props: {
            user: user
          }
        },
      });
    }, [updateWorkspaceColumn]);
    return (
        <GroupContainer>
            <GroupTitle>New messages</GroupTitle>
            {unreadUsers.map((user) => {
                return (<MemberItem key={user.userId} userId={user.userId} onUserSelect={handleChannelSelect} />)
            })}
        </GroupContainer>
    );
  }
  
  export default NewMessagesMembers