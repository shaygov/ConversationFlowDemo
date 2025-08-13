import React from 'react';
import { Badge } from "@/components/Badge/Badge";
interface Tab {
  key: string;
  label: string;
  badgeCount?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid rgba(255, 255, 255, 0.12)', marginBottom: 16 }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          style={{
            position: 'relative',
            padding: '8px',
            background: 'transparent',
            color: '#fff',
            border: 'none',
            borderBottom: activeTab === tab.key ? '2px solid #007bff' : '2px solid transparent',
            cursor: 'pointer',
            opacity: activeTab  === tab.key ? '1' : '0.5',
            fontWeight: 500,
            outline: 'none',
          }}
        >
          {tab.label}
          {typeof tab.badgeCount === 'number' && (<span style={{display: "inline-block", marginLeft: "10px", verticalAlign: "middle"}}>
            <Badge 
              badge={tab.badgeCount} 
              opened={true}
              />
          </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs; 