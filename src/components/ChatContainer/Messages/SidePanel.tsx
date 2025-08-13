import React from 'react';
import { useSidePanel } from './sidePanelStore';
import Icon from '@/libs/components/widgets/Icon/Icon';
const SidePanel: React.FC = () => {
  const { panel, clearPanel } = useSidePanel();
  if (!panel) return null;
  const { component: Component, props } = panel;
  return (
    <div style={{flex: 0.8, marginLeft: 16,  position: 'relative', display: "flex", flexDirection: "column" }}>
      <div style={{ 
        width: "100%", 
        display: 'flex', 
        justifyContent: "space-between", 
        background: "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), rgb(58, 58, 58)",
        zIndex: 1
        }}>
        <h3>{props.title}</h3>
        <button onClick={clearPanel} style={{background: 'none', border: 'none', cursor: 'pointer'}} >
          <Icon name="close" color="white" size={'M'} dimensions={{ width: 19, height: 19 }}/>
        </button>
      </div>
      <div style={{height: '100%', overflow: 'auto'}}>
        <Component {...props} />
      </div>
    </div>
  );
};

export default SidePanel; 