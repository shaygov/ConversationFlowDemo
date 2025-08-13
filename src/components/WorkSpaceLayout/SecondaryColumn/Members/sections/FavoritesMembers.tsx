import { useFavoriteUsersList, useUnreadUsersList, UserWithState, useUserWorkspaceEvents } from '@/hooks/useUserWorkspaceEvents';
import { GroupTitle, GroupContainer } from '../components/UserChannelGroup.styles';
import MemberItem from '../components/MemberItem';
import { useCallback } from 'react';
import { UserWorkspace } from '@/types/userCache';
import { useMembers } from '../MembersContext';
import { useEffect } from 'react';

function FavoritesMembers() {
    const { favoriteUsers, isLoading: favoriteLoading, error: favoriteError } = useFavoriteUsersList();
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
            <GroupTitle>Favorites</GroupTitle>
            {favoriteUsers.map((user) => {
                return (<MemberItem key={user.userId} userId={user.userId} onUserSelect={handleChannelSelect} />)
            })}
        </GroupContainer>
    );
}

export default FavoritesMembers
