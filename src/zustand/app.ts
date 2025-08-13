import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import usersStore, {IUsersState} from '@/zustand/users';
import { workspaceLayoutService } from '@/services/layout/WorkspaceLayoutService';

const excludeKeys: any = [];

export interface ISidebarData {
  solutionColor: string;
  activeRecord: string | null;
}

export interface IActiveWorkspace {
  id: string;
  slug: string;
  type: string;
}

export interface IAppData {
  workspaces: {
    [key: string]: ISidebarData;
  },
  activeWorkspace: IActiveWorkspace | null;
}

export interface IAppState {
  data: IAppData;
  set: (wsData: IAppData) => void;
  get: (key: string) => string | null;
  reset: () => void;
  setActiveWorkspace: (wsData: IActiveWorkspace | null) => Promise<void>;
  setWorkspaces: (workspaces: {
    [key: string]: ISidebarData;
  }[]) => Promise<void>;
}

export const defaultSidebarData: ISidebarData = {
  solutionColor: 'transparent',
  activeRecord: null,
};

const defaultData: IAppData = {
  workspaces: {},
  activeWorkspace: null,
}

const store = create()(
  persist(
    (set: any, get: any) => ({
      data: defaultData,
      get: (key: string) => {
        const activeWorkspace = workspaceLayoutService.getCurrentWorkspace();

        if (!activeWorkspace || !key) {
          return null;
        }

        const alias = `${activeWorkspace.type}_${activeWorkspace.id}`;
        const currentWorkspace = get().data.workspaces?.[alias];

        if (!currentWorkspace) {
          return null;
        }

        return get().data.workspaces[alias][key];
      },
      setActiveWorkspace: (wsData: IActiveWorkspace | null) => {
        set({
          data: {
            ...get().data,
            activeWorkspace: wsData,
          },
        })
      },
      set: (wsData: IAppData) => {
        const activeWorkspace = workspaceLayoutService.getCurrentWorkspace();

        if (!activeWorkspace) {
          return;
        }

        const alias = `${activeWorkspace.type}_${activeWorkspace.id}`;
        const currentWorkspace = get().data.workspaces?.[alias] || defaultSidebarData;

        set({
          data: {
            ...get().data,
            workspaces: {
              ...get().data.workspaces,
              [alias]: {
                ...currentWorkspace,
                ...wsData,
              },
            }
          },
        })
      },
      setWorkspaces: (workspaces: any) => {
        set({
          data: {
            ...get().data,
            workspaces,
          },
        })
      },
      reset: () => set({ data: defaultData }),
    }),
    {
      name: 'chat-messenger-app',
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !excludeKeys.includes(key))
      ),
    }
  )
);

/**
 * Spread workspaces data after login/user fetch.
 */
export const spreadWorkspaces = async () => {
  const userWorkspaces = (usersStore.getState() as IUsersState).user?.workspaces;

  if (!userWorkspaces?.length) {
    return;
  }

  const data = (store.getState() as IAppState).data;
  const setWorkspaces = (store.getState() as IAppState).setWorkspaces;
  const setActiveWorkspace = (store.getState() as IAppState).setActiveWorkspace;

  let result: any = {};
  let activeWorkspace = data.activeWorkspace;

  userWorkspaces.sort((a: any, b: any) => a.id - b.id)

  userWorkspaces.map((ws: any) => {
    const alias = `${ws.workspaceTypeId}_${ws.workspaceId}`;

    if (!data.workspaces[alias]) {
      result[alias] = defaultSidebarData;
    } else {
      result[alias] = data.workspaces[alias];
    }
  });

  if (!activeWorkspace) {
    await setActiveWorkspace({
      id: userWorkspaces[0].workspaceId,
      slug: userWorkspaces[0].workspaceSlug,
      type: userWorkspaces[0].workspaceTypeId,
    });
  }

  await setWorkspaces(result);
}

export default store;
