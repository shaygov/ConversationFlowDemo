import React from 'react';
import { GroupTitle, GroupContainer } from './UserChannelGroup.styles';

interface Props<T = any> {
  title: string;
  items: T[];
  ItemComponent: React.ComponentType<{
    item: T;
    onItemSelect: (item: T) => void;
  }>;
  onItemSelect: (item: T) => void;
  getItemKey?: (item: T) => string | number;
}

export const UserChannelGroup = <T,>({
  title,
  items,
  ItemComponent,
  onItemSelect,
  getItemKey,
}: Props<T>) => {
  if (!items.length) {
    return null;
  }

  return (
    <GroupContainer>
      <GroupTitle>{title}</GroupTitle>
      {items.map((item) => (
          <ItemComponent
            key={getItemKey ? getItemKey(item) : (item as any).id || (item as any).user?.id}
            item={item}
            onItemSelect={onItemSelect}
          />
      ))}
    </GroupContainer>
  );
};


