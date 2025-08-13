import React from 'react';
import { useUsersWorkspaceList } from '@/hooks/useUsersWorkspaceList';
import { UserWorkspace } from '@/types/userCache';

export interface WorkspaceUsersListProps {
  filters: any;
  options?: any;
  sort?: any;
  renderChannels: (users: UserWorkspace[]) => React.ReactNode;
  LoadingIndicator?: React.ComponentType;
  EmptyStateIndicator?: React.ComponentType;
  autoLoad?: boolean;
  autoWatch?: boolean;
  onRefresh?: () => void;
  onCacheInvalidate?: () => void;
}

export const WorkspaceUsersList: React.FC<WorkspaceUsersListProps> = ({
  filters,
  renderChannels,
  LoadingIndicator,
  EmptyStateIndicator,
  autoLoad,
  autoWatch,
  onRefresh,
  onCacheInvalidate
}) => {
  
  const { 
    users, 
    isLoading, 
  } = useUsersWorkspaceList(filters);
 

  if (isLoading && LoadingIndicator) {
    return <LoadingIndicator />;
  }

  if (users.length === 0 && EmptyStateIndicator) {
    return <EmptyStateIndicator />;
  }

  return <>{renderChannels(users)}</>;
}; 