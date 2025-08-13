import React from 'react';

interface WorkspaceButtonProps {
  name: string;
  type: number;
  className?: string;
  onClick: () => void;
  badgeCount?: number;
  children?: React.ReactNode;
}

const WorkspaceButton: React.FC<WorkspaceButtonProps> = ({ 
  name, 
  type, 
  className, 
  onClick, 
  badgeCount = 0,
  children
}) => {
  const isActive = className?.includes('active');
  
  return (
    <button 
      onClick={onClick}
      className={`workspace-button ${className || ''} ${isActive ? 'active' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        border: '1px solid #e1e5e9',
        borderRadius: '6px',
        background: isActive ? '#007bff' : '#ffffff',
        color: isActive ? '#ffffff' : '#333333',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s ease'
      }}
    >
      {children}
      <span>{name}</span>
      {badgeCount > 0 && (
        <span 
          className="badge"
          style={{
            background: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px',
            minWidth: '18px',
            textAlign: 'center'
          }}
        >
          {badgeCount}
        </span>
      )}
    </button>
  );
};

export default WorkspaceButton; 