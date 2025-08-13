import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat, DefaultGenerics } from 'stream-chat';
import { ServiceFactory } from '@/services/ServiceFactory';
import { MainChannelsService } from '@/services/MainChannelsService';
import { WorkspaceUsersService } from '@/services/WorkspaceUsersService'; 
import { StreamEventManager } from '@/services/StreamEventManager';
import { WorkspaceUnreadService } from '@/services/WorkspaceUnreadService';
import { GroupChannelsService } from '@/services/GroupChannelsService';
import { ActiveChannelService } from '@/services/ActiveChannelService';
import { UserWorkspaceCoordinatorService } from '@/services/UserWorkspaceCoordinatorService';
import { UserChannelsManager } from '@/services/UserChannelsManager';

interface ServicesContextValue {
  mainChannelsService: MainChannelsService | null;
  workspaceUsersService: WorkspaceUsersService | null;
  streamEventManager: StreamEventManager | null;
  workspaceUnreadService: WorkspaceUnreadService | null;
  groupChannelsService: GroupChannelsService | null;
  activeChannelService: ActiveChannelService | null;
  userWorkspaceCoordinatorService: UserWorkspaceCoordinatorService | null;
  isInitialized: boolean;
}

const ServicesContext = createContext<ServicesContextValue>({
  mainChannelsService: null,
  workspaceUsersService: null,
  streamEventManager: null,
  workspaceUnreadService: null,
  groupChannelsService: null,
  activeChannelService: null,
  userWorkspaceCoordinatorService: null,
  isInitialized: false,
});

interface ServicesProviderProps {
  children: React.ReactNode;
  client: StreamChat<DefaultGenerics> | null;
}

export const ServicesProvider: React.FC<ServicesProviderProps> = ({ children, client }) => {
  const [services, setServices] = useState<ServicesContextValue>({
    mainChannelsService: null,
    workspaceUsersService: null,
    streamEventManager: null,
    workspaceUnreadService: null,
    groupChannelsService: null,
    activeChannelService: null,
    userWorkspaceCoordinatorService: null,
    isInitialized: false,
  });

  useEffect(() => {
    if (!client) {
      setServices({
        mainChannelsService: null,
        workspaceUsersService: null,
        streamEventManager: null,
        workspaceUnreadService: null,
        groupChannelsService: null,
        activeChannelService: null,
        userWorkspaceCoordinatorService: null,
        isInitialized: false,
      });
      return;
    }

    // Initialize services using factory
    const serviceFactory = ServiceFactory.getInstance();
    serviceFactory.initialize(client).then(() => {
      const mainChannelsService = serviceFactory.getChannelService();
      const streamEventManager = serviceFactory.getStreamEventManager();
      
      // Initialize the new coordinator service
      const userWorkspaceCoordinatorService = UserWorkspaceCoordinatorService.getInstance(mainChannelsService);
      userWorkspaceCoordinatorService.initialize(client);
      
      // Subscribe the events service to StreamEventManager
      const eventsService = userWorkspaceCoordinatorService.getEventsService();
      streamEventManager.subscribe(eventsService);
      
      setServices({
        mainChannelsService: mainChannelsService,
        workspaceUsersService: serviceFactory.getWorkspaceUsersService(),
        streamEventManager: streamEventManager,
        workspaceUnreadService: serviceFactory.getWorkspaceUnreadService(),
        groupChannelsService: serviceFactory.getGroupChannelsService(),
        activeChannelService: serviceFactory.getActiveChannelService(),
        userWorkspaceCoordinatorService: userWorkspaceCoordinatorService,
        isInitialized: true,
      });
    }).catch(error => {
      console.error('Failed to initialize services:', error);
    });

    // Cleanup on unmount or client change
    return () => {
      serviceFactory.destroy();
    };
  }, [client]);

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

// Custom hooks for accessing services
export const useMainChannelsService = (): MainChannelsService => {
  const { mainChannelsService, isInitialized } = useContext(ServicesContext);

  if (!isInitialized || !mainChannelsService) {
    throw new Error('MainChannelsService not available. Make sure ServicesGuard wraps the component.');
  }

  return mainChannelsService;
};

export const useWorkspaceUsersService = (): WorkspaceUsersService => {
  const { workspaceUsersService, isInitialized } = useContext(ServicesContext);
  
  if (!isInitialized || !workspaceUsersService) {
    throw new Error('WorkspaceUsersService not available. Make sure ServicesGuard wraps the component.');
  }
  
  return workspaceUsersService;
};

export const useGroupChannelsService = (): GroupChannelsService => {
  const { groupChannelsService, isInitialized } = useContext(ServicesContext);
  
  if (!isInitialized || !groupChannelsService) {
    throw new Error('GroupChannelsService not available. Make sure ServicesGuard wraps the component.');
  }
  
  return groupChannelsService;
};

export const useActiveChannelService = (): ActiveChannelService => {
  const { activeChannelService, isInitialized } = useContext(ServicesContext);
  
  if (!isInitialized || !activeChannelService) {
    throw new Error('ActiveChannelService not available. Make sure ServicesGuard wraps the component.');
  }
  
  return activeChannelService;
};



export const useUserWorkspaceCoordinatorService = (): UserWorkspaceCoordinatorService => {
  const { userWorkspaceCoordinatorService, isInitialized } = useContext(ServicesContext);

  if (!isInitialized || !userWorkspaceCoordinatorService) {
    throw new Error('UserWorkspaceCoordinatorService not available. Make sure ServicesGuard wraps the component.');
  }

  return userWorkspaceCoordinatorService;
};

export const useUserChannelsManager = (): UserChannelsManager => {
  const { userWorkspaceCoordinatorService, isInitialized } = useContext(ServicesContext);

  if (!isInitialized || !userWorkspaceCoordinatorService) {
    throw new Error('UserChannelsManager not available. Make sure ServicesGuard wraps the component.');
  }

  return userWorkspaceCoordinatorService.getChannelsManager();
};

export const useServices = (): ServicesContextValue => {
  return useContext(ServicesContext);
}; 