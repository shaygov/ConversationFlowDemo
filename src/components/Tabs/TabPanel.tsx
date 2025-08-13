import React from 'react';

interface TabPanelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, style }) => {
  return (
    <div style={{...style, display: "flex", flexDirection: "column", flex: 1 }}>
      {children}
    </div>
  );
};

export default TabPanel; 