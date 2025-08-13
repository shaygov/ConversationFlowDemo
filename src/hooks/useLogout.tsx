import React from "react";
import { useStore } from "zustand";
import appStore, { IAppState } from "@/zustand/app";
import authStore, { IAuthState } from '@/zustand/auth';
import chatStore from '@/zustand/chat';
import modalStore from '@/zustand/modal';
import usersMainStore from '@/zustand/users';
import workspacesStore from '@/zustand/workspaces';
import { workspaceLayoutStore } from '@/services/layout/workspaceLayout.store';
import { ServiceFactory } from '@/services/ServiceFactory';
import { StreamChat } from 'stream-chat';

const apiKey = process.env.REACT_APP_GET_STREAM_API_KEY;

export const useLogout = () => {
  const resetAuthStore = useStore(authStore, (state: IAuthState) => state.reset);
  const resetSidebarStore = useStore(appStore, (state: IAppState) => state.reset);

  const verifyCleanup = React.useCallback(() => {
    const authData = (authStore.getState() as IAuthState).auth;
    const appData = (appStore.getState() as IAppState).data;
    const chatData = chatStore.getState() as any;
    const modalData = modalStore.getState() as any;
    const usersMainData = usersMainStore.getState() as any;
    const workspacesData = workspacesStore.getState() as any;
    const layoutData = workspaceLayoutStore.getState() as any;

    const isClean = 
      !authData.token && 
      !authData.chatToken &&
      Object.keys(appData.workspaces).length === 0 &&
      !appData.activeWorkspace &&
      !chatData.isLoadingCreate &&
      !chatData.isLoadingDelete &&
      !modalData.content.component &&
      !usersMainData.user.data &&
      Object.keys(workspacesData.workspaces).length === 0 &&
      layoutData.workspace.id === 0;

    return {
      isClean,
      details: {
        auth: !authData.token && !authData.chatToken,
        app: Object.keys(appData.workspaces).length === 0 && !appData.activeWorkspace,
        chat: !chatData.isLoadingCreate && !chatData.isLoadingDelete,
        modal: !modalData.content.component,
        usersMain: !usersMainData.user.data,
        workspaces: Object.keys(workspacesData.workspaces).length === 0,
        layout: layoutData.workspace.id === 0,
      }
    };
  }, []);

  const comprehensiveLogout = React.useCallback(async () => {
    try {
      console.log('🔄 Starting comprehensive logout cleanup...');

      // 1. Disconnect GetStream client first
      if (apiKey) {
        try {
          const chatClient = StreamChat.getInstance(apiKey);
          if (chatClient) {
            console.log('📡 Disconnecting GetStream client...');
            await chatClient.disconnectUser();
            console.log('✅ GetStream client disconnected');
          }
        } catch (error) {
          console.warn('⚠️ Error disconnecting GetStream client:', error);
        }
      }

      // 2. Clean up all services via ServiceFactory
      try {
        console.log('🔧 Cleaning up services...');
        const serviceFactory = ServiceFactory.getInstance();
        serviceFactory.destroy();
        console.log('✅ Services cleaned up');
      } catch (error) {
        console.warn('⚠️ Error cleaning up services:', error);
      }

      // 3. Reset all Zustand stores using their reset methods
      try {
        console.log('🗂️ Resetting Zustand stores...');
        resetAuthStore();
        resetSidebarStore();
        
        // Reset additional stores using their reset methods
        (chatStore.getState() as any).reset();
        (modalStore.getState() as any).reset();
        (usersMainStore.getState() as any).reset();
        (workspacesStore.getState() as any).reset();
        (workspaceLayoutStore.getState() as any).reset();
        console.log('✅ Zustand stores reset');
      } catch (error) {
        console.warn('⚠️ Error resetting stores:', error);
      }

      // 4. Clear any browser storage
      try {
        console.log('🗑️ Clearing browser storage...');
        localStorage.removeItem('chat-messenger-app');
        localStorage.removeItem('chat-messenger-layout');
        localStorage.removeItem('users');
        console.log('✅ Browser storage cleared');
      } catch (error) {
        console.warn('⚠️ Error clearing browser storage:', error);
      }

      // 5. Clear session storage
      try {
        console.log('🗑️ Clearing session storage...');
        sessionStorage.clear();
        console.log('✅ Session storage cleared');
      } catch (error) {
        console.warn('⚠️ Error clearing session storage:', error);
      }

      // 6. Additional cleanup for potential memory leaks
      try {
        console.log('🧹 Additional cleanup...');
        
        // Clear any remaining event listeners
        if (typeof window !== 'undefined') {
          // Force garbage collection if available (Chrome DevTools)
          if (window.gc) {
            window.gc();
          }
        }
        
        // Clear any remaining timers (limited range to avoid performance issues)
        for (let i = 1; i <= 1000; i++) {
          clearTimeout(i);
          clearInterval(i);
        }
        
        console.log('✅ Additional cleanup completed');
      } catch (error) {
        console.warn('⚠️ Error during additional cleanup:', error);
      }

      // 7. Verify cleanup was successful
      const cleanupStatus = verifyCleanup();
      if (cleanupStatus.isClean) {
        console.log('✅ Comprehensive logout cleanup completed successfully');
      } else {
        console.warn('⚠️ Some cleanup may not have completed fully:', cleanupStatus.details);
      }

      return cleanupStatus;
    } catch (error) {
      console.error('❌ Critical error during logout cleanup:', error);
      // Even if cleanup fails, still reset the main stores
      try {
        resetAuthStore();
        resetSidebarStore();
        console.log('✅ Fallback store reset completed');
      } catch (fallbackError) {
        console.error('❌ Critical error during fallback cleanup:', fallbackError);
      }
      return { isClean: false, details: { error: error.message } };
    }
  }, [resetAuthStore, resetSidebarStore, verifyCleanup]);

  const logout = React.useCallback(() => {
    comprehensiveLogout();
  }, [comprehensiveLogout]);

  return {
    logout,
    comprehensiveLogout,
    verifyCleanup,
  }
};
