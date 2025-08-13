export interface UserWorkspace {
  user: { id: string; name: string; workspace_id?: string };
}

export interface UserCacheObserver {
  onInitialUsersLoaded(users: UserWorkspace[]): void;
  onUsersAdded(users: UserWorkspace[]): void;
  onUsersRemoved(userIds: string[]): void;
  onUsersUpdated(users: UserWorkspace[]): void;
} 