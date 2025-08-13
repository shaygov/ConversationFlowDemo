import { FC, memo} from "react";
import { BaseNavColumnStyled } from "@components/WorkSpaceLayout/BaseNavColumn";
import DynamicWorkSpaceColumn from "@/components/WorkSpaceLayout/DynamicWorkSpaceColumn";
const SubSidebar: FC = () => {
  return (
    <BaseNavColumnStyled>
      <DynamicWorkSpaceColumn 
         type="secondary"
         layoutComponentType="component"
      />
    </BaseNavColumnStyled>
  );
};

export default memo(SubSidebar);
