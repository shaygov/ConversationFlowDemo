import React from 'react';
import { Channel, DefaultGenerics } from 'stream-chat';
import { useWorkspaceChannelsList } from '@/hooks/useWorkspaceChannelsList';

export interface GlobalChannelListProps {
  filters: any;
  options?: any;
  sort?: any;
  renderChannels: (channels: Channel<DefaultGenerics>[]) => React.ReactNode;
  LoadingIndicator?: React.ComponentType;
  EmptyStateIndicator?: React.ComponentType;
  autoLoad?: boolean;
  autoWatch?: boolean;
  onRefresh?: () => void;
  onCacheInvalidate?: () => void;
}

export const GlobalChannelList: React.FC<GlobalChannelListProps> = ({
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
    channels, 
    isLoading, 
    error, 
  } = useWorkspaceChannelsList({
    filters
  });


  if (error) {
    console.error('GlobalChannelList error:', error);
    return null;
  }

  if (isLoading && LoadingIndicator) {
    return <LoadingIndicator />;
  }

  if (channels.length === 0 && EmptyStateIndicator) {
    return <EmptyStateIndicator />;
  }

  return <>{renderChannels(channels)}</>;
}; 