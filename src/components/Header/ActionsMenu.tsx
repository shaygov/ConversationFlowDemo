import React from 'react';
import { useStore } from 'zustand';
import authStore, { IAuthState } from '@/zustand/auth';
import usersStore, { IUsersState } from '@/zustand/users';
import { useLogout } from '@/hooks/useLogout';

interface ActionsMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <div 
      className="actions-menu"
      style={{
        background: 'white',
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '8px 0',
        minWidth: '150px'
      }}
    >
      <button 
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '8px 16px',
          border: 'none',
          background: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#333'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f8f9fa';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'none';
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default ActionsMenu;
