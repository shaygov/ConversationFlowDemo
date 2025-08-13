import React, {Suspense, memo} from "react";
import { Pane } from "split-pane-react";
import { BaseNavColumnStyled } from "@components/WorkSpaceLayout/BaseNavColumn";
import Channels from "@components/WorkSpaceLayout/PrimaryColumn/Sections/Channels";
import Navigation from "@/components/WorkSpaceLayout/PrimaryColumn/Sections/Navigation";
import withColumnLayout from "@/components/WorkSpaceLayout/ColumnLayout/withColumnLayout";

const EnhancedNavigation= withColumnLayout(Navigation);
const EnhancedChannels = withColumnLayout(Channels);

const Sidebar = () => {
  return (
    <BaseNavColumnStyled>
      <Pane minSize={150} maxSize='40%'>
        <Suspense fallback={<div>Sidebar Loading...</div>}>
          <EnhancedNavigation />
          <EnhancedChannels />
        </Suspense>
      </Pane>
    </BaseNavColumnStyled>
  )
}

export default memo(Sidebar);
