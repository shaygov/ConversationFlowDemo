import { create } from 'zustand';
import { UserEventsState } from '@/types/userEvents';

export interface UserWithState {
  userId: string;
  state: UserEventsState;
}

interface UserEventsStore {
  // Lists of users with specific states
  favoriteUsers: UserWithState[];
  unreadUsers: UserWithState[];
  
  // Actions
  setUserState: (userId: string, state: UserEventsState) => void;
  addFavoriteUser: (userId: string, state: UserEventsState) => void;
  removeFavoriteUser: (userId: string) => void;
  addUnreadUser: (userId: string, state: UserEventsState) => void;
  removeUnreadUser: (userId: string) => void;
  removeUser: (userId: string) => void;
  updateUserState: (userId: string, state: UserEventsState) => void;
  
  // List getters (always sorted by name)
  getFavoriteUsers: () => UserWithState[];
  getUnreadUsers: () => UserWithState[];
  getFavoriteUsersSorted: () => UserWithState[];
  getUnreadUsersSorted: () => UserWithState[];
  
  // List management
  clearFavoriteUsers: () => void;
  clearUnreadUsers: () => void;
  clearAll: () => void;
}

// Helper function to sort users by name
const sortUsersByName = (users: UserWithState[]): UserWithState[] => {
  return [...users].sort((a, b) => {
    const nameA = a.state.name.toLowerCase();
    const nameB = b.state.name.toLowerCase();
    return nameA.localeCompare(nameB);
  });
};

export const useUserEventsStore = create<UserEventsStore>((set, get) => ({
  favoriteUsers: [],
  unreadUsers: [],
  
  setUserState: (userId: string, state: UserEventsState) => {
    set((store) => {
      const newFavoriteUsers = [...store.favoriteUsers];
      const newUnreadUsers = [...store.unreadUsers];
      
      // Update favorite users list
      const existingFavoriteIndex = newFavoriteUsers.findIndex(u => u.userId === userId);
      if (state.isFavorite && state.totalUnreadCount === 0) {
        const userWithState: UserWithState = { userId, state };
        if (existingFavoriteIndex >= 0) {
          newFavoriteUsers[existingFavoriteIndex] = userWithState;
        } else {
          newFavoriteUsers.push(userWithState);
        }
      } else {
        if (existingFavoriteIndex >= 0) {
          newFavoriteUsers.splice(existingFavoriteIndex, 1);
        }
      }
      
      // Update unread users list
      const existingUnreadIndex = newUnreadUsers.findIndex(u => u.userId === userId);
      if (state.totalUnreadCount > 0) {
        const userWithState: UserWithState = { userId, state };
        if (existingUnreadIndex >= 0) {
          newUnreadUsers[existingUnreadIndex] = userWithState;
        } else {
          newUnreadUsers.push(userWithState);
        }
      } else {
        if (existingUnreadIndex >= 0) {
          newUnreadUsers.splice(existingUnreadIndex, 1);
        }
      }
      
      return { 
        favoriteUsers: newFavoriteUsers,
        unreadUsers: newUnreadUsers
      };
    });
  },
  
  addFavoriteUser: (userId: string, state: UserEventsState) => {
    set((store) => {
      const existingIndex = store.favoriteUsers.findIndex(u => u.userId === userId);
      const userWithState: UserWithState = { userId, state };
      
      if (existingIndex >= 0) {
        const newFavoriteUsers = [...store.favoriteUsers];
        newFavoriteUsers[existingIndex] = userWithState;
        return { favoriteUsers: newFavoriteUsers };
      } else {
        return { favoriteUsers: [...store.favoriteUsers, userWithState] };
      }
    });
  },
  
  removeFavoriteUser: (userId: string) => {
    set((store) => ({
      favoriteUsers: store.favoriteUsers.filter(u => u.userId !== userId)
    }));
  },

  removeUser: (userId: string) => {
    set((store) => ({
      favoriteUsers: store.favoriteUsers.filter(u => u.userId !== userId),
      unreadUsers: store.unreadUsers.filter(u => u.userId !== userId)
    }));
  },
  
  addUnreadUser: (userId: string, state: UserEventsState) => {
    set((store) => {
      const existingIndex = store.unreadUsers.findIndex(u => u.userId === userId);
      const userWithState: UserWithState = { userId, state };
      
      if (existingIndex >= 0) {
        const newUnreadUsers = [...store.unreadUsers];
        newUnreadUsers[existingIndex] = userWithState;
        return { unreadUsers: newUnreadUsers };
      } else {
        return { unreadUsers: [...store.unreadUsers, userWithState] };
      }
    });
  },
  
  removeUnreadUser: (userId: string) => {
    set((store) => ({
      unreadUsers: store.unreadUsers.filter(u => u.userId !== userId)
    }));
  },
  
  updateUserState: (userId: string, state: UserEventsState) => {
    set((store) => {
      const newFavoriteUsers = [...store.favoriteUsers];
      const newUnreadUsers = [...store.unreadUsers];
      
      // Update favorite users list
      const existingFavoriteIndex = newFavoriteUsers.findIndex(u => u.userId === userId);
      if (state.isFavorite && state.totalUnreadCount === 0) {
        const userWithState: UserWithState = { userId, state };
        if (existingFavoriteIndex >= 0) {
          newFavoriteUsers[existingFavoriteIndex] = userWithState;
        } else {
          newFavoriteUsers.push(userWithState);
        }
      } else {
        if (existingFavoriteIndex >= 0) {
          newFavoriteUsers.splice(existingFavoriteIndex, 1);
        }
      }
      
      // Update unread users list
      const existingUnreadIndex = newUnreadUsers.findIndex(u => u.userId === userId);
      if (state.totalUnreadCount > 0) {
        const userWithState: UserWithState = { userId, state };
        if (existingUnreadIndex >= 0) {
          newUnreadUsers[existingUnreadIndex] = userWithState;
        } else {
          newUnreadUsers.push(userWithState);
        }
      } else {
        if (existingUnreadIndex >= 0) {
          newUnreadUsers.splice(existingUnreadIndex, 1);
        }
      }
      
      return { 
        favoriteUsers: newFavoriteUsers,
        unreadUsers: newUnreadUsers
      };
    });
  },
  
  getFavoriteUsers: () => {
    const store = get();
    return store.favoriteUsers;
  },
  
  getUnreadUsers: () => {
    const store = get();
    return store.unreadUsers;
  },
  
  getFavoriteUsersSorted: () => {
    const store = get();
    return sortUsersByName(store.favoriteUsers);
  },
  
  getUnreadUsersSorted: () => {
    const store = get();
    return sortUsersByName(store.unreadUsers);
  },
  
  clearFavoriteUsers: () => {
    set({ favoriteUsers: [] });
  },
  
  clearUnreadUsers: () => {
    set({ unreadUsers: [] });
  },
  
  clearAll: () => {
    set({ 
      favoriteUsers: [],
      unreadUsers: []
    });
  },
}));
