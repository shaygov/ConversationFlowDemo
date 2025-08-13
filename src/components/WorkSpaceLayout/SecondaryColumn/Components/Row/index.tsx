import React, { Suspense, memo } from "react";
import cx from "classnames";
import { ID } from "@datorama/akita/src/lib/types";
import { useStore } from "zustand";

import {
  RowStyled,
  RowInnerStyled,
  RowLabelOuterStyled,
  RowLabelInnerStyled,
  RowDotStyled,
  RowTitleStyled,
  RowArrowIconStyled,
  SolutionAppWrapperStyled,
  SolutionAppTextStyled,
  RowProps,
} from "./style";
// import { SubSidebarOptions } from "./Row.d";
import Icon from "@libs/components/widgets/Icon/Icon";
import { Badge } from "@/components/Badge/Badge";
import Avatar from "@libs/components/widgets/Avatar/Avatar";
import { AvatarSizes } from "@libs/components/widgets/Avatar/Avatar.types";
import appStore, { IAppState } from "@/zustand/app";

export interface Props extends RowProps {
  label: string;
  active?: boolean;
  id?: ID;
  viewOptions?: any;
  solutionColor?: string;
  badge?: number;
  // newMention?: number;
  onClick?: () => void;
}

const RowContent = ({
  viewOptions,
  label,
  active,
  solutionColor,
  badge,
}: any) => {
  const sidebarSolutionColor = useStore(appStore, (state: IAppState) => state.get('solutionColor'));

  return (
    <>
      <RowLabelOuterStyled className="RowLabelOuter">
        <RowLabelInnerStyled>
          { viewOptions === 'inAppApp' ? (
            <RowDotStyled solutionColor={sidebarSolutionColor || solutionColor} />
          ) : null }

          { viewOptions === 'channel' ? (
            <Icon
              className="ChannelIcon"
              name="hashtag"
              size="S"
            />
          ) : null }

          { viewOptions === "member" ? (
            <Avatar size={AvatarSizes.s} className="MemberAvatar"/>
          ) : null }

          <RowTitleStyled className="RowTitle">{label}</RowTitleStyled>

          { badge ? (
            <Badge badge={badge} opened={active} className="Notification"/>
          ) : null }
        </RowLabelInnerStyled>
      </RowLabelOuterStyled>

      { viewOptions === 'record' ? (
        <SolutionAppWrapperStyled>
          <RowDotStyled solutionColor={solutionColor || sidebarSolutionColor} />
          <SolutionAppTextStyled>Software Development • User Stories</SolutionAppTextStyled>
        </SolutionAppWrapperStyled>
      ) : null }

      { viewOptions === 'inAppApp' ? (
        <RowArrowIconStyled className="RowArrowIcon">
          <Icon
            name="arrow-down-small"
            size="M"
          />
        </RowArrowIconStyled>
      ) : null }
    </>
  )
};

const Row: React.FC<Props> = ({
  label,
  active = false,
  viewOptions = 'inAppApp' as any,
  solutionColor,
  badge,
  id,
  onClick,
  ...rest
}) => {
  const sidebarSolutionColor = useStore(appStore, (state: IAppState) => state.get('solutionColor'));
  const classesTitle = cx("RowInner ", {
    "badge": badge,
    // "newMention": newMention,
    "active": active,
    [viewOptions]: true
  });

  return (
    <>
      <RowStyled {...rest} viewOptions={viewOptions} onClick={onClick}>
        <RowInnerStyled viewOptions={viewOptions} className={classesTitle} solutionColor={solutionColor || sidebarSolutionColor}>
          <RowContent 
            viewOptions={viewOptions}
            label={label}
            active={active}
            solutionColor={solutionColor}
            badge={badge}
          />
        </RowInnerStyled>
      </RowStyled>
 
      {/* <Suspense fallback={<div>SubSidebar Row Loading...</div>}>
        <RowInner />
      </Suspense> */} 
    </>
  );
};

export default memo(Row);
