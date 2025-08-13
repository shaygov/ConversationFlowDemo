import React from 'react';

interface ColumnLayoutTitleProps {
  children: React.ReactNode;
}

const ColumnLayoutTitle: React.FC<ColumnLayoutTitleProps> = ({ children }) => (
  <div
    style={{
      display: 'flex',
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      color: '#ffffff',
      padding: '10px 5px',
    }}
  >
    {children}
  </div>
);

export default ColumnLayoutTitle; 