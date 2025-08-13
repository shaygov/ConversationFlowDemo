import React, { createContext, useContext, useMemo } from 'react';
import { workspaceLayoutService } from '@/services/layout/WorkspaceLayoutService';
import type { WorkspaceLayoutService } from '@/services/layout/WorkspaceLayoutService';
import { workspaceLayoutStore } from "@/services/layout/workspaceLayout.store";
import type { IWorkspaceModel, WorkspaceModel, ColumnKey, ColumnContent, ColumnState, LayoutState } from '@/services/layout/workspaceLayout.types';
import { useAuth } from '@/contexts/AuthContext';

interface WorkspaceContextValue {
  workspace: IWorkspaceModel | null;
  // All WorkspaceLayoutService methods
  // setWorkspace: (ws: WorkspaceModel) => void;
  // setWorkspaceLayout: (layout: ColumnState) => void;
  openWorkspaceColumn: (column: ColumnKey, content: ColumnContent) => void;
  updateWorkspaceColumn: (column: ColumnKey, content: Partial<ColumnContent>) => void;
  // resetWorkspace: (workspaceId?: string) => void;
  // getWorkspaceLayout: () => LayoutState;
  // getCurrentWorkspace: () => IWorkspaceModel | null;
  // getCurrentWorkspaceLayout: () => ColumnState | null;
  // getActiveWorkspaceLayoutId: (column: ColumnKey) => string | null;
  // goBackWorkspace: (workspaceId: string) => void;
  // goForwardWorkspace: (workspaceId: string) => void;
  baseFilters: () => { request: any; local: any };
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Subscribe only to workspace changes to minimize rerenders
  const workspace = workspaceLayoutStore(state => state.workspace);
  const { user } = useAuth();

  const contextValue = useMemo(() => {
    // Base filters factory function
    const baseFilters = () => ({
      request: {
        members: {
          $in: [`user_${user?.id}`],
        },
      },
      local: {
        ...(workspace?.id && { workspace_id: `${workspace.id}` }),
      },
    });

    // Return service methods along with current workspace
    // Explicitly bind all methods to ensure they're available
    return {
      workspace,
      baseFilters,
      // Explicit method bindings to ensure they're available
      // setWorkspace: workspaceLayoutService.setWorkspace.bind(workspaceLayoutService),
      // setWorkspaceLayout: workspaceLayoutService.setWorkspaceLayout.bind(workspaceLayoutService),
      openWorkspaceColumn: workspaceLayoutService.openWorkspaceColumn.bind(workspaceLayoutService),
      updateWorkspaceColumn: workspaceLayoutService.updateWorkspaceColumn.bind(workspaceLayoutService),
      // resetWorkspace: workspaceLayoutService.resetWorkspace.bind(workspaceLayoutService),
      // getWorkspaceLayout: workspaceLayoutService.getWorkspaceLayout.bind(workspaceLayoutService),
      // getCurrentWorkspace: workspaceLayoutService.getCurrentWorkspace.bind(workspaceLayoutService),
      // getCurrentWorkspaceLayout: workspaceLayoutService.getCurrentWorkspaceLayout.bind(workspaceLayoutService),
      // getActiveWorkspaceLayoutId: workspaceLayoutService.getActiveWorkspaceLayoutId.bind(workspaceLayoutService),
      // goBackWorkspace: workspaceLayoutService.goBackWorkspace.bind(workspaceLayoutService),
      // goForwardWorkspace: workspaceLayoutService.goForwardWorkspace.bind(workspaceLayoutService),
    } as WorkspaceContextValue;
  }, [workspace, user?.id]); // Only re-create when workspace or user changes

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}; 