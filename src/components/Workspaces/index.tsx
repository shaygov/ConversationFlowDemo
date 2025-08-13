import React from "react"
import { useStore } from "zustand"
import workspacesStore, { IWorkspacesState } from "@/zustand/workspaces"
import usersStore, { IUsersState } from "@/zustand/users"
import { WorkspaceService } from "./WorkspaceService"
import { workspaceLayoutService } from '@/services/layout/WorkspaceLayoutService';
import WorkspaceButton from '@/components/WorkspaceButton';
import { useWorkspace} from '@/contexts/WorkspaceProvider';
import { useServices } from '@/contexts/ServicesContext';

const Workspaces = () => {
  const workspaces = useStore(workspacesStore, (s: IWorkspacesState) => s.workspaces)
  const userWorkspaces = useStore(usersStore, (s: IUsersState) => s.user?.workspaces)
  const { workspace: activeWorkspace } = useWorkspace();
  const { workspaceUnreadService } = useServices();
  
  // State to trigger re-renders when unread counts change
  const [unreadCounts, setUnreadCounts] = React.useState<Map<string, number>>(new Map());
  
  // Subscribe to unread count changes
  React.useEffect(() => {
    if (!workspaceUnreadService?.isInitialized()) {
      return;
    }
    
    const unsubscribe = workspaceUnreadService.subscribe((counts) => {
      setUnreadCounts(new Map(counts));
    });
    
    return unsubscribe;
  }, [workspaceUnreadService]);

  const list = React.useMemo(
    () => {
      return new WorkspaceService(
        workspaces, 
        userWorkspaces
      ).buildList();
    }, [workspaces, userWorkspaces]
  );

  return (
    <ul
       style={{
          listStyle: 'none',
          margin: 0, 
          padding: 0,
          display: 'flex',
          alignItems: 'center',
        }}
    >
      {list.map(ws => (
        <li key={`${ws.id}-${ws.type}`} style={{ padding: '0 5px'}}>
           <WorkspaceButton
              badgeCount={unreadCounts.get(ws.id.toString()) || 0}
              onClick={() => {
                workspaceLayoutService.setWorkspace(ws)
              }}
              name={ws.name}
              className={( activeWorkspace?.type === ws.type && activeWorkspace?.id === ws.id) ? 'active' : ''}
              type={ws.type}
            >
            {ws.type === 0 ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1368_57835)">
                <path d="M8 1L1 5V15H6V9H10V15H15V5L8 1Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0_1368_57835">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          
      ) : null}
      </WorkspaceButton>
        </li>
      ))}
    </ul>
  )
}

export default Workspaces;