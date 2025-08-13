import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import API from '@services/api';
import { errorHandler } from '@/helpers';
import userStore from '@/zustand/users';

const excludeKeys = ['isLoading'];

interface IAuthData {
  token?: string;
  chatToken?: string;
}

export interface IRegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IInviteUserData {
  email: string;
  workspace: number;
}

export interface IAuthState {
  auth: IAuthData;
  isLoading: boolean;
  set: (data: IAuthData) => void;
  reset: () => void;
  register: (body: IRegisterData) => Promise<void>;
  login: (body: ILoginData) => Promise<void>;
  logout: () => Promise<void>;
  activation: (hash: string) => Promise<void>;
  inviteUser: (body: IInviteUserData) => Promise<void>;
  acceptInvitation: (hash: string) => Promise<void>;
}

const defaultData: IAuthData = {};

const store = createStore()(
  persist(
    (set: any, get: any) => ({
      auth: defaultData,
      isLoading: false,
      set: (data: IAuthData) => {
        set({
          auth: {
            ...get().auth,
            ...data,
          },
        });
      },
      reset: () => set({ auth: defaultData }),
      register: async (body: IRegisterData) => {
        set({ isLoading: true });

        try {
          const response = await API.post({
            url: '/auth/register', 
            body,
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(JSON.stringify(responseData));
          }

          toast.success('Registration successful! You need to activate your account.');

          set({ isLoading: false });

          return responseData;
        } catch (error) {
          toast.error(JSON.parse(error.message).message || 'Registration failed!');

          set({ isLoading: false });

          return error;
        }
      },
      login: async (body: ILoginData) => {
        set({ isLoading: true });

        try {
          const response = await API.post({
            url: '/auth/login', 
            body,
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(JSON.stringify(responseData));
          }

          const { user, ...authData } = responseData;

          const userState: any = await userStore.getState();

          userState.setUser(user);

          set({ 
            isLoading: false,
            auth: {
              ...(get().auth || {}),
              ...authData,
            },
          });

          return authData;
        } catch (error) {
          toast.error(errorHandler(error, 'Login failed!'));

          set({ isLoading: false });

          return error;
        }
      },
      logout: async () => {
        set({ isLoading: true });

        try {
          const response = await API.post({
            url: '/auth/logout',
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(JSON.stringify(responseData));
          }

          set({ 
            isLoading: false,
            auth: defaultData,
          });

          return responseData;
        } catch (error) {
          toast.error(JSON.parse(error.message).message || 'Logout failed!');

          set({ isLoading: false });

          return error;
        }
      },
      activation: async (hash: string) => {
        if (!hash) {
          return;
        }

        set({ isLoading: true });

        try {
          const response = await API.post({
            url: '/auth/activation',
            body: { hash },
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(JSON.stringify(responseData));
          }

          set({ 
            isLoading: false,
          });

          return responseData;
        } catch (error) {
          toast.error(JSON.parse(error.message).message || 'Activation failed!');

          set({ isLoading: false });

          return error;
        }
      },
      inviteUser: async (body: IInviteUserData) => {
        if (!body) {
          return;
        }

        set({ isLoading: true });

        try {
          const response = await API.post({
            url: '/auth/invite',
            body,
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(JSON.stringify(responseData));
          }

          set({ 
            isLoading: false,
          });

          toast.success(responseData?.message || 'Invitation sent!');

          return responseData;
        } catch (error) {
          toast.error(JSON.parse(error.message).message || 'Invitation failed!');

          set({ isLoading: false });

          return error;
        }
      },
      acceptInvitation: async ({ hash, user = null}: { hash: string, user: any }) => {
        if (!hash) {
          return;
        }

        set({ isLoading: true });

        try {
          const response = await API.post({
            url: '/auth/accept-invitation',
            body: { hash, user },
          });

          const responseData = await response.json();

          if (!response.ok) {
            // Everything is alright, but the user is not registered yet
            if (response.status === 400) {
              set({ isLoading: false });

              return responseData;
            }

            throw new Error(JSON.stringify(responseData));
          }

          set({ 
            isLoading: false,
          });

          return responseData;
        } catch (error) {
          toast.error(JSON.parse(error.message).message || 'Accepting invitation failed!');

          set({ isLoading: false });

          return error;
        }
      }
    }),
    {
      name: 'chat-messenger-auth',
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !excludeKeys.includes(key))
      ),
    }
  )
);

export default store;
