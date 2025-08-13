import React, { memo } from "react";
import cx from "classnames";

import {
  SidebarRowStyled,
  SidebarRowInnerStyled,
  SidebarRowCloseIcon,
  SidebarRowTitleStyled,
  SidebarRowNameNumberStyled,
  SidebarRowProps,
  SidebarRowInnerContentStyled,
} from "./style";

import WidgetIcon from "@libs/components/widgets/Icon/Icon";
import { ISidebarItemProps } from "@/types/sidebar";
import TypingIndicator from "./TypingIndicator";

import { Badge } from "@/components/Badge/Badge";


export interface Props extends SidebarRowProps {
  item: ISidebarItemProps;
  active?: boolean;
}

const SidebarRow: React.FC<Props> = ({
  item,
  active
}) => {
  const badgeValue = typeof item.badgeProvider === 'function' ? item.badgeProvider() : 0;

  const classesRowInner = cx({
    "active": active,
    "badge": badgeValue>0,
    // "newMessages": badgeValue > 0,
  });

  const handleRemoveItem = (e: React.MouseEvent): void => {
    e.stopPropagation();
    item?.onRemove && item?.onRemove();
  };

  return (
    <SidebarRowStyled>
      <SidebarRowInnerStyled 
        onClick={() => item?.onClick ? item?.onClick() : {}} 
        className={classesRowInner} 
        iconBgColor={item?.bgColor || null}
      >
        <SidebarRowInnerContentStyled>
          { item?.icon ? item.icon() : null }
          <SidebarRowNameNumberStyled>
            { item?.label ? (
              <SidebarRowTitleStyled 
                className='SidebarRowTitle'
              >
                {item.label}
              </SidebarRowTitleStyled>
            ) : null }

            { badgeValue > 0 && (
              <Badge badge={badgeValue} className="Notification" />
            ) }

            {item?.isTyping ? (
              <TypingIndicator />
            ) : null }
          </SidebarRowNameNumberStyled>

          { item?.onRemove ? (
            <SidebarRowCloseIcon className="SidebarRowCloseIcon" onClick={handleRemoveItem}>
              <WidgetIcon name="close" />
            </SidebarRowCloseIcon>
          ) : null }
          
          </SidebarRowInnerContentStyled>
      </SidebarRowInnerStyled>
    </SidebarRowStyled>
  );
};

export default memo(SidebarRow);
