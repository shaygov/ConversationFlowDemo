import React from "react";
import { useStore } from "zustand";
import { useLogout } from "@/hooks/useLogout";
import authStore, { IAuthState } from '@/zustand/auth';

const LogoutButton = () => {
  const { logout } = useLogout();
  const apiLogout = useStore(authStore, (state: IAuthState) => state.logout);

  return (
    <button onClick={async () => {
      try { 
        const response: any = await apiLogout();

        if (response instanceof Error) {
          throw response;
        }

        logout();
      }
      catch (error) {
        logout();
      }
    }}>Logout</button>
  )
}

export default LogoutButton;
