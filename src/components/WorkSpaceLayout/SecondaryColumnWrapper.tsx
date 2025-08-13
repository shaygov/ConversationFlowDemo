import React, {useMemo} from 'react';
import SplitPane, { Pane } from "split-pane-react";
import SecondaryColumn from './SecondaryColumn';
import MainContentColumn from './MainContentColumn';
import { ViewBoxStyled } from '@/containers/App/AppViewStyled';
import { useSplitPane } from '@/hooks/useSplitPane';
import { useWorkspaceLayout } from '@/contexts/WorkspaceLayoutProvider';


const SecondaryColumnWrapper: React.FC = () => {
  const { workspacelayout } = useWorkspaceLayout();
  const isVisible = useMemo(() => 
    Boolean(workspacelayout.secondary?.component?.type),
    [workspacelayout.secondary?.component?.type]
  );
  const { sizes, handleSizeChange } = useSplitPane({ isVisible });

  return (
    <SplitPane 
      sizes={sizes} 
      onChange={handleSizeChange} 
      className="SubSidebarWrapper"
    >
      <SecondaryColumn />
      <Pane className="ViewBox">
        <ViewBoxStyled className="ViewBoxWrapper">
          <MainContentColumn />
        </ViewBoxStyled>
      </Pane>
    </SplitPane>
  );
};

export default React.memo(SecondaryColumnWrapper); 