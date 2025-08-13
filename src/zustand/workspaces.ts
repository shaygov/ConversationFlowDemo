import { create } from 'zustand';
import API from '@/services/api';
import { toast } from 'react-toastify';
import * as wsConst from '@/constants/workspaces';
import authStore from '@/zustand/auth';
import usersStore, {IUsersState} from '@/zustand/users';
import appStore, {IAppState, ISidebarData} from '@/zustand/app';
import { errorHandler } from '@/helpers';

export interface IWorkspacesState {
  workspaces: {
    [key: string]: any[];
  };
  isLoading: {
    [key: string]: boolean;
  };
  getChatWorkspaces: () => Promise<void>;
  disconnectWorkspace: (body: {
    id: number;
    workspaceId: number; 
    workspaceTypeId: number;
  }) => Promise<void>;
  connectWorkspace: (body: {
    id: number;
    type: number;
    name?: string;
  }) => Promise<void>;
  isLoadingAll: () => boolean;
  getAllWorkspaces: () => Promise<void>;
  createWorkspace: (name: string) => Promise<void>;
  deleteWorkspace: (id: number) => Promise<void>;
  reset: () => void;
}

const getDefaultData: any = () => {
  const result: any = {};

  Object.values(wsConst.ids).forEach(value => {
    result[value] = [];
  });

  return result;
};

const getDefaultLoading: any = () => {
  const result: any = {};

  Object.values(wsConst.ids).forEach(value => {
    result[value] = false;
  });

  return result;
};

const defaultData: any = getDefaultData();
const defaultLoading: any = getDefaultLoading();

const store = create()(
  (set, get: any) => ({
    workspaces: defaultData,
    isLoading: defaultLoading,
    getChatWorkspaces: async () => {
      set({ 
        isLoading: {
          ...get().isLoading,
          [wsConst.ids.chat]: true,
        }
      });

      try {
        const response = await API.get({ url: '/workspaces' });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(JSON.stringify(responseData));
        }

        set({ 
          isLoading: {
            ...get().isLoading,
            [wsConst.ids.chat]: false,
          },
          workspaces: {
            ...get().workspaces,
            [wsConst.ids.chat]: responseData,
          },
        });

        return responseData;
      } catch (error) {
        console.error(error);

        set({ 
          isLoading: {
            ...get().isLoading,
            [wsConst.ids.chat]: false,
          },
         });

        return error;
      }
    },
    disconnectWorkspace: async (body: {
      id: number;
      workspaceId: number; 
      workspaceTypeId: number;
    }) => {
      if (!body.id) {
        return false;
      }

      const wsTypeString = Object.keys(wsConst.ids).find((key: string) => (wsConst as any).ids[key] === body.workspaceTypeId);
      const wsType = (wsConst as any).ids[wsTypeString];

      set({ 
        isLoading: {
          ...get().isLoading,
          [wsType]: true,
        },
       });

      try {
        const response = await API.post({ url: `/user/workspace/disconnect`, body });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(JSON.stringify(responseData));
        }

        await (usersStore.getState() as { getUserInfo: () => Promise<void> }).getUserInfo();

        const currentActiveWorkspace = (appStore.getState() as IAppState).data.activeWorkspace;

        if (
          currentActiveWorkspace?.id && 
          currentActiveWorkspace?.type && 
          currentActiveWorkspace.id.toString() === body.workspaceId.toString() &&
          currentActiveWorkspace.type.toString() === body.workspaceTypeId.toString()
        ) {
          const workspaces = get().workspaces;
          const userWorkspaces = (usersStore.getState() as IUsersState).user?.workspaces || [];

          for (let i = 0; i < userWorkspaces.length; i++) {
            const userWS = userWorkspaces[i];
            const { workspaceTypeId, workspaceId, workspaceSlug } = userWS;
            const isDifferentWoekspace = body.workspaceTypeId !== workspaceTypeId || body.workspaceId !== workspaceId;
            const existingWS = workspaces?.[workspaceTypeId] || [];
            const existingWSData = existingWS.find((ws: any) => ws.id === workspaceId);

            if (isDifferentWoekspace && existingWSData) {
              await (appStore.getState() as IAppState).setActiveWorkspace({
                id: existingWSData.id,
                type: workspaceTypeId,
                slug: workspaceSlug || null,
              });

              break;
            }
          }
        }

        set({ 
          isLoading: {
            ...get().isLoading,
            [wsType]: false,
          },
         });

        toast.success('Workspace disconnected successfully');

        return responseData;
      } catch (error) {
        console.error(error);

        toast.error(errorHandler(error, 'Error disconnecting workspace'));

        set({ 
          isLoading: {
            ...get().isLoading,
            [wsType]: false,
          },
        });

        return error;
      }
    },
    connectWorkspace: async (body: {
      id: number;
      type: number;
      name?: string;
    }) => {
      const wsTypeString = Object.keys(wsConst.ids).find((key: string) => (wsConst as any).ids[key] === body.type);
      const wsType = (wsConst as any).ids[wsTypeString];

      set({ 
        isLoading: {
          ...get().isLoading,
          [wsType]: true,
        },
       });

      try {
        const response = await API.post({
          url: '/user/workspace/connect',
          body,
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(JSON.stringify(responseData));
        }

        await (usersStore.getState() as { getUserInfo: () => Promise<void> }).getUserInfo();
  
        toast.success('Workspace connected successfully');

        set({ 
          isLoading: {
            ...get().isLoading,
            [wsType]: false,
          },
         });

        return responseData;
      } catch (error) {
        toast.error(errorHandler(error, 'Error connecting workspace'));

        set({ 
          isLoading: {
            ...get().isLoading,
            [wsType]: false,
          },
         });

        return error;
      }
    },
    isLoadingAll: () => {    
      let result = false;

      Object.values(get().isLoading).forEach(value => {
        if (value) {
          result = true;
        }
      });
  
      return result;
    },
    getAllWorkspaces: async () => {
      const promises: any = [];

      const {
        workspaces,
        getChatWorkspaces,
      } = get();

      Object.keys(workspaces).forEach(async (key: any) => {
        if (!workspaces[key].length) {
          if (Number(key) === wsConst.ids.chat) {
            promises.push(await getChatWorkspaces());
          }
        }
      });

      return await Promise.all(promises);
    },
    createWorkspace: async (name: any) => {
      set({ 
        isLoading: {
          ...get().isLoading,
          [wsConst.ids.chat]: true,
        },
      });

      try {
        const response = await API.post({
          url: '/workspaces',
          body: {
            name,
          },
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(JSON.stringify(responseData));
        }

        await get().getChatWorkspaces();

        set({
          isLoading: {
            ...get().isLoading,
            [wsConst.ids.chat]: false,
          },
        });
         
        toast.success('Workspace created successfully');

        return responseData;
      } catch (error) {
        toast.error(errorHandler(error, 'Error creating workspace'));

        set({ 
          isLoading: {
            ...get().isLoading,
            [wsConst.ids.chat]: false,
          },
         });

        return error;
      }
    },
    deleteWorkspace: async (id: number) => {      
      set({ 
        isLoading: {
          ...get().isLoading,
          [wsConst.ids.chat]: true,
        },
      });

      try {
        const response = await API.delete({
          url: `/workspaces/${id}`,
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(JSON.stringify(responseData));
        }

        await get().getChatWorkspaces();

        set({
          isLoading: {
            ...get().isLoading,
            [wsConst.ids.chat]: false,
          },
        });
        
        toast.success('Workspace deleted successfully');

        return responseData;
      } catch (error) {
        toast.error(errorHandler(error, 'Error deleting workspace'));

        set({ 
          isLoading: {
            ...get().isLoading,
            [wsConst.ids.chat]: false,
          },
        });

        return error;
      }
    },
    reset: () => set({ 
      workspaces: defaultData,
      isLoading: defaultLoading,
    }),
  })
);

export default store;
