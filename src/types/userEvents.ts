export interface UserEventsState {
  id: string;
  name: string;
  workspace_id?: string;
  isTyping: boolean;
  totalUnreadCount: number;
  isOnline: boolean;
  isFavorite: boolean;
}

export interface UserEventsInternalState extends UserEventsState {
  typingChannels: Set<string>;
  unreadCounts: Map<string, number>;
} 