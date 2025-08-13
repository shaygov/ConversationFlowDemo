import React from "react";
import { useStore } from "zustand";
import Login from "@containers/Login";
import authStore, { IAuthState } from '@/zustand/auth';
import usersStore, {IUsersState} from '@/zustand/users';
import { useLogout } from "@/hooks/useLogout";
import modalStore, { IModalState } from "@/zustand/modal";
import workspacesStore, { IWorkspacesState } from '@/zustand/workspaces';
import { toast } from "react-toastify";
import Loader from "@components/Loader";
import { spreadWorkspaces } from "@/zustand/app";

const AuthProvider: any = ({ children }: any) => {
  const authorizationToken = useStore(authStore, (state: IAuthState) => state.auth?.token);
  const [authenticating, setAuthenticating] = React.useState<boolean>(authorizationToken ? true : false);
  const { logout } = useLogout();
  const userWorkspaces = useStore(usersStore, (state: IUsersState) => state.user?.workspaces);
  const getUserInfo = useStore(usersStore, (state: IUsersState) => state.getUserInfo);
  const setModalContent = useStore(modalStore, (state: IModalState) => state.set);
  const getAllWorkspaces = useStore(workspacesStore, (state: IWorkspacesState) => state.getAllWorkspaces);
  const [waitForWorkspaces, setWaitForWorkspaces] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!authenticating && authorizationToken) {
      getAllWorkspaces().then(() => {
        if (!userWorkspaces?.length) {
          setModalContent({
            '@components/Settings/Modals/WorkspaceConnections': {}
          }, { 
            disableClose: userWorkspaces?.length ? false : true
          });
        } else {
          spreadWorkspaces();
        }
      }).catch(() => {
        toast.error('Error loading workspaces');
      }).finally(() => {
        setWaitForWorkspaces(false);
      });
    }
  }, [userWorkspaces, authenticating, authorizationToken]);

  React.useEffect(() => {
    authorizationToken && getUserInfo().then((res: any) => {
      if (res instanceof Error) {
        logout();
        setAuthenticating(false);

        return;
      }

      setAuthenticating(false);
    });
  }, []);

  return authenticating ? 
    <Loader loaderStyle={{ color: '#ffffff' }}>Checking authentication ...</Loader> : 
    !authorizationToken ? 
      <Login /> : 
      waitForWorkspaces ? 
        <Loader loaderStyle={{ color: '#ffffff' }}>Loading workspaces ...</Loader> :
        !userWorkspaces ? 
          null : 
          children;
};

export default AuthProvider;
