import React, { createContext, useContext, useMemo } from 'react';
import { CHANNEL_TYPES } from '@/constants/chat';
import { useWorkspace } from '@/contexts/WorkspaceProvider';
import { useSecondaryColumnSearch } from '@/contexts/WorkspaceLayoutProvider';

interface FiltersType {
  request: any;
  local?: Record<string, any>;
  search?: string;
}

interface MembersContextType {
  filters: FiltersType;
  workspace: any;
  updateWorkspaceColumn: (column: string, config: any) => void;
}

const MembersContext = createContext<MembersContextType | null>(null);

export const MembersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { workspace, baseFilters, updateWorkspaceColumn } = useWorkspace();
  const vlSearch = useSecondaryColumnSearch();

  const filters = useMemo(() => {
    const base = baseFilters();
    return {
      ...base,
      local: {
        ...base.local,
        type: CHANNEL_TYPES.dm.value,
      },
      search: vlSearch,
    };
  }, [baseFilters, vlSearch]);

  const contextValue = useMemo(() => ({
    filters,
    workspace,
    updateWorkspaceColumn,
  }), [filters, workspace, updateWorkspaceColumn]);

  return (
    <MembersContext.Provider value={contextValue}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = () => {
  const context = useContext(MembersContext);
  if (!context) {
    throw new Error('useMembers must be used within a MembersProvider');
  }
  return context;
}; 