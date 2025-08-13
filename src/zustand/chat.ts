import { create } from 'zustand';
import API from '@/services/api';
import { toast } from 'react-toastify';
import { errorHandler } from '@/helpers';

export interface ICreateChannelData {
  name: string;
  type: string;
  members?: string[];
  workspace_id?: string;
  workspace_name?: string;
}

export interface IChatState {
  isLoadingCreate: boolean;
  isLoadingDelete: string;
  createChannel: (body: ICreateChannelData) => Promise<void>;
  deleteChannel: (channel: any) => Promise<void>;
  reset: () => void;
}

const store = create()(
  (set, get: any) => ({
    isLoadingCreate: false,
    isLoadingDelete: '',
    createChannel: async (body: ICreateChannelData) => {
      set({ 
        isLoadingCreate: true,
      });

      try {
        const response = await API.post({ url: '/chat/channel', body });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(JSON.stringify(responseData));
        }

        set({ 
          isLoading: false,
        });

        toast.success(`Channel "${body.name}" created successfully`);

        return responseData;
      } catch (error) {
        toast.error(errorHandler(error) || 'Error creating channel');

        set({ 
          isLoading: false,
        });

        return error;
      }
    },
    deleteChannel: async (channel: any) => {
      if (!channel?.id) {
        return;
      }

      set({ 
        isLoadingDelete: channel.id,
      });

      try {
        await channel.delete();

        toast.success(`Channel "${channel.data.name}" deleted successfully`);

        set({ 
          isLoadingDelete: '',
        });
      } catch (error) {
        toast.error(errorHandler(error) || 'Error deleting channel');

        set({ 
          isLoadingDelete: '',
        });
      }
    },
    reset: () => set({ 
      isLoadingCreate: false,
      isLoadingDelete: '',
    }),
  })
);

export default store;
