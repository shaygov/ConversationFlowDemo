import React, { useState } from 'react';
import Tabs from './index';
import TabPanel from './TabPanel';

interface TabWithContent {
  key: string;
  label: string;
  badgeCount?: number;
  content: React.ReactNode;
}

interface TabsWithContentProps {
  tabs: TabWithContent[];
  initialActiveTab?: string;
}

const TabsWithContent: React.FC<TabsWithContentProps> = ({ tabs, initialActiveTab }) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab || tabs[0]?.key);
  const active = tabs.find(tab => tab.key === activeTab);

  return (
    <>
      <Tabs
        tabs={tabs.map(({ key, label, badgeCount }) => ({ key, label, badgeCount }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {active && <TabPanel>{active.content}</TabPanel>}
    </>
  );
};

export default TabsWithContent; 