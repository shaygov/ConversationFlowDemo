import React, { createContext, useContext, useMemo } from 'react';
import { workspaceLayoutService } from '@/services/layout/WorkspaceLayoutService';
import type { WorkspaceLayoutService } from '@/services/layout/WorkspaceLayoutService';
import { workspaceLayoutStore } from "@/services/layout/workspaceLayout.store";

const WorkspaceLayoutContext = createContext<WorkspaceLayoutService | null>(null);

export const WorkspaceLayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { workspace, workspaces } = workspaceLayoutStore();

  const workspacelayout = workspaces[workspace?.id]?.current || {};

  const serviceWithLayout = useMemo(() => {
    const service = Object.create(
      Object.getPrototypeOf(workspaceLayoutService),
      Object.getOwnPropertyDescriptors(workspaceLayoutService)
    );
    // const activePrimaryNavLink = workspacelayout.secondary?.component?.type && workspacelayout.secondary?.component?.props?.id
    //   ? `${workspacelayout.secondary.component.type}_${workspacelayout.secondary.component.props.id}`
    //   : '';
    // const activeMainColumnNavLink = workspacelayout.secondary?.mainComponent?.type && workspacelayout.secondary?.mainComponent?.props?.id
    //   ? `${workspacelayout.secondary.mainComponent.type}_${workspacelayout.secondary.mainComponent.props.id}`
    //   : '';
    // workspacelayout.activePrimaryNavLink = activePrimaryNavLink;
    // workspacelayout.activeMainColumnNavLink = activeMainColumnNavLink;
    service.workspacelayout = workspacelayout;
    return service;
  }, [workspacelayout]);

  return (
    <WorkspaceLayoutContext.Provider value={serviceWithLayout}>
      {children}
    </WorkspaceLayoutContext.Provider>
  );
};

export const useWorkspaceLayout = () => {
  const context = useContext(WorkspaceLayoutContext);
  if (!context) {
    throw new Error('useWorkspaceLayout must be used within a WorkspaceLayoutProvider');
  }
  return context;
};

// Optimized selector hook to prevent unnecessary rerenders
export const useWorkspaceLayoutSelector = <T,>(
  selector: (workspacelayout: any) => T
): T => {
  return workspaceLayoutStore((state) => {
    const workspacelayout = state.workspaces[state.workspace?.id]?.current || {};
    return selector(workspacelayout);
  });
};

// Specialized hook for secondary column search value
export const useSecondaryColumnSearch = (): string => {
  return workspaceLayoutStore((state) => {
    const workspacelayout = state.workspaces[state.workspace?.id]?.current || {};
    return workspacelayout?.secondary?.component?.props?.search || '';
  });
};

// Specialized hook for active main component type and id (used for active links)
export const useActiveSecondaryMainComponent = (): { activeSecondaryNavLink: string } => {
  const type = workspaceLayoutStore((state) => {
    const workspacelayout = state.workspaces[state.workspace?.id]?.current || {};
    return workspacelayout?.secondary?.mainComponent?.type;
  });
  
  const id = workspaceLayoutStore((state) => {
    const workspacelayout = state.workspaces[state.workspace?.id]?.current || {};
    return workspacelayout?.secondary?.mainComponent?.props?.id;
  });
  
  return useMemo(() =>{ return {
    activeSecondaryNavLink: `${type}_${id}`
  }}, [type, id]);
}; 


export const useActiveSecondaryComponent = (): { activeMainNavLink: string } => {
  const type = workspaceLayoutStore((state) => {
    const workspacelayout = state.workspaces[state.workspace?.id]?.current || {};
    return workspacelayout?.secondary?.component?.type;
  });
  
  const id = workspaceLayoutStore((state) => {
    const workspacelayout = state.workspaces[state.workspace?.id]?.current || {};
    return workspacelayout?.secondary?.component?.props?.id;
  });
  
  return useMemo(() =>{ return {
    activeMainNavLink: `${type}_${id}`
  }}, [type, id]);
}; 