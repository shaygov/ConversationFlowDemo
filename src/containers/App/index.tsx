import React, { useMemo } from 'react';
import cx from "classnames";
import SplitPane from "split-pane-react";
import PrimaryColumn from "@components/WorkSpaceLayout/PrimaryColumn";
import SecondaryColumnWrapper from '@components/WorkSpaceLayout/SecondaryColumnWrapper';
import { AppViewStyled } from '@/containers/App/AppViewStyled';
import { useWorkspaceLayout } from '@/contexts/WorkspaceLayoutProvider';
import { useSplitPane } from '@/hooks/useSplitPane';


const AppView: React.FC = () => {
  const { sizes, handleSizeChange } = useSplitPane();
  return (
    <AppViewStyled>
      <SplitPane
        split='vertical'
        sizes={sizes}
        onChange={handleSizeChange}
      >
        <PrimaryColumn />
        <SecondaryColumnWrapper />
      </SplitPane>
    </AppViewStyled>
  );
};

export default React.memo(AppView);