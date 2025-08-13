import { create } from 'zustand';
import { toast } from 'react-toastify';
import API from '@/services/api';
import { dexieMiddleware } from '@/zustand/middleware/dexieMiddleware';
import authStore from '@/zustand/auth';

export interface IUserProps {
  id: number;
  fullName: string;
  email: string;
}

export interface IUserData {
  data?: IUserProps;
  workspaces?: any[];
}

export interface IUsersState {
  users: IUserProps[];
  user: IUserData;
  isLoadingUsers: boolean;
  isLoadingUser: boolean;
  setUser: (user: IUserData) => void;
  getUsers: (workspaceId?: string) => Promise<void>;
  getUserInfo: () => Promise<void>;
  reset: () => void;
}

const defaultUsersData: any = null;
const defaultUserData: IUserData = {};

const store = create()(
  dexieMiddleware(
    (set, get: any) => ({
      users: defaultUsersData,
      user: defaultUserData,
      isLoadingUsers: false,
      isLoadingUser: false,
      setUser: (user: IUserData) => set({ user }),
      getUsers: async (workspaceId?: string) => {
        set({ isLoadingUsers: true });

        try {
          const response = await API.get({ url: `/users?workspace_id=${workspaceId}` });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(JSON.stringify(responseData));
          }

          set({ users: responseData?.data || [], isLoadingUsers: false });

          return responseData;
        } catch (error) {
          set({ isLoadingUsers: false });

          return error;
        }
      },
      getUserInfo: async () => {
        set({ isLoading: true });

        try {
          const response = await API.get({ url: '/user' });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(JSON.stringify(responseData));
          }

          set({ 
            isLoading: false,
            user: responseData,
          });

          return responseData;
        } catch (error) {
          set({ isLoading: false });

          return error;
        }
      },
      reset: () => set({ 
        users: null,
        user: {},
        isLoadingUsers: false,
        isLoadingUser: false,
      }),
    }),
    {
      name: 'users',
      persist: ['user'],
    }
  )
);

export default store;
