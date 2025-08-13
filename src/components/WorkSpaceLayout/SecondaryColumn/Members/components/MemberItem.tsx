import { useEffect } from 'react';
import { useUserWorkspaceEvents } from '@/hooks/useUserWorkspaceEvents';
import { ItemRowStyled } from '../components/UserChannelGroup.styles';
import { getInitials } from '@/helpers';
import Avatar from '@/libs/components/widgets/Avatar/Avatar';
import Theme from '@vars/Theme';
import { useWorkspace } from '@/contexts/WorkspaceProvider';
import { UserWorkspace } from '@/types/userCache';
import SidebarRow from '@/components/WorkSpaceLayout/PrimaryColumn/Components/Row';
import { useUserEventsStore } from '@/zustand/userEvents';
import { useIsChannelActive } from '@/hooks/useIsChannelActive';
import { useIsUserInActiveChannel } from '@/hooks/useIsUserInActiveChannel';

export default function MemberItem({ userId, onUserSelect, mode }: { userId: string, onUserSelect: (user: UserWorkspace['user']) => void, mode?: 'basic' }) {
    const { workspace } = useWorkspace();
    const { setUserState: setStoreUserState, removeUser } = useUserEventsStore();
    const workspace_id = workspace?.id ? workspace.id.toString() : undefined;
    const { isTyping, totalUnreadCount, isOnline, isFavorite, name: userName } = useUserWorkspaceEvents(userId, workspace_id);
    const initials = getInitials(userName);
    
    const handleClick = () => {
        onUserSelect({
            id: userId,
            name: userName,
            workspace_id: workspace?.id ? workspace.id.toString() : undefined
        });
    }
    useEffect(() => {
        if(mode==='basic') {
            setStoreUserState(userId, {
                id: userId,
                totalUnreadCount,
                isFavorite,
                isOnline,
                isTyping,
                name: userName
            });
        };
        return () => {
            if(mode==='basic') {
                removeUser(userId);
            }
        }
    }, [totalUnreadCount, isFavorite, userId, workspace_id]);

    if (mode === 'basic' && (isFavorite || totalUnreadCount > 0)) { 
        return null;
    }

    return (    
        <ItemRowStyled key={userId}>
            <SidebarRowWithActiveHook 
                userId={userId}
                item={{
                    isTyping: isTyping,
                    badgeProvider: () => {
                        return totalUnreadCount;
                    },
                    bgColor: Theme['semantic-colors'].base['b-dark-blue'],
                    icon: () => initials ? <Avatar text={initials} online={isOnline} /> : null,
                    label: userName,
                    onClick: handleClick,
                }}  
            />
        </ItemRowStyled>
    )
}


const SidebarRowWithActiveHook = (props: any) => {
    const isActive = useIsUserInActiveChannel(props.userId);
    return <SidebarRow {...props} active={isActive} />
}
