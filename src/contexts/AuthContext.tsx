import React, { createContext, useContext, useMemo } from 'react';
import { useStore } from 'zustand';
import authStore, { IAuthState } from '@/zustand/auth';
import usersStore, { IUsersState } from '@/zustand/users';

/**
 * AuthContext provides centralized access to authenticated user data
 * and authorization functions throughout the application.
 * 
 * Benefits of using context:
 * - Cleaner code in components
 * - Better performance (avoids unnecessary re-renders)
 * - Easier maintenance and testing
 * - Follows React best practices
 */
export interface IAuthContextValue {
  // User data
  user: IUsersState['user']['data'] | null;
  userWorkspaces: IUsersState['user']['workspaces'] | null;
  
  // Auth data
  isAuthenticated: boolean;
  authorizationToken: string | null;
  
  // Loading states
  isLoadingUser: boolean;
  isLoadingAuth: boolean;
  
  // Actions
  getUserInfo: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContextValue | null>(null);

/**
 * AuthProvider component that wraps the application and provides
 * authorization data to all child components.
 * 
 * Should be used in App.tsx, wrapping the existing AuthProvider.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User data
  const user = useStore(usersStore, (state: IUsersState) => state.user?.data);
  const userWorkspaces = useStore(usersStore, (state: IUsersState) => state.user?.workspaces);
  const isLoadingUser = useStore(usersStore, (state: IUsersState) => state.isLoadingUser);
  const getUserInfo = useStore(usersStore, (state: IUsersState) => state.getUserInfo);
  
  // Auth data
  const authorizationToken = useStore(authStore, (state: IAuthState) => state.auth?.token);
  const isLoadingAuth = useStore(authStore, (state: IAuthState) => state.isLoading);
  const logout = useStore(authStore, (state: IAuthState) => state.logout);

  const contextValue = useMemo<IAuthContextValue>(() => ({
    // User data
    user,
    userWorkspaces,
    
    // Auth data
    isAuthenticated: !!authorizationToken,
    authorizationToken,
    
    // Loading states
    isLoadingUser,
    isLoadingAuth,
    
    // Actions
    getUserInfo,
    logout,
  }), [
    user,
    userWorkspaces,
    authorizationToken,
    isLoadingUser,
    isLoadingAuth,
    getUserInfo,
    logout,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth hook for accessing authorization data in components.
 * 
 * Usage examples:
 * 
 * ```tsx
 * // In component
 * const { user, isAuthenticated, logout } = useAuth();
 * 
 * // Check if user is authenticated
 * if (isAuthenticated) {
 *   // User is logged in
 * }
 * 
 * // Access user data
 * console.log(user?.email);
 * 
 * // Logout user
 * await logout();
 * ```
 */
export const useAuth = (): IAuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 