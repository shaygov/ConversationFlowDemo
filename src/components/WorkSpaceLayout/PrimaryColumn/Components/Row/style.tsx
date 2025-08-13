import styled from "@emotion/styled";

import { SidebarOptions } from "@/types/sidebar/Row.d";

import { timingIn, easingBasic } from "@vars/Global";

export interface SidebarRowProps {
  iconBgColor?: string;
  viewOptions?: SidebarOptions;
}

const SidebarRowTitleStyled = styled.p`
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;

  ${(props: any) => {
    const sidebarRow = props.theme.token.components.SIDEBAR_ROW;
    return `
      color: ${sidebarRow.types.default.text.color};
      font-size: ${sidebarRow.types.default.text.fontSize}px;
      font-weight: ${sidebarRow.types.default.text.fontWeight};
      line-height: ${sidebarRow.types.default.text.lineHeight}px;
      transition: color ${timingIn} ${easingBasic};
    `;
  }};
`;



const SidebarRowIconStyled = styled.div<SidebarRowProps>`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;

  ${(props: any) => {
    const sidebarRow = props.theme.token.components.SIDEBAR_ROW;
    const { width, height } = sidebarRow.options.rectangleIcon;
    const viewOptions = sidebarRow.options[props.viewOptions] || {}; // If viewOptions doesn't exists, then we create an empty obj
    const paddingTop = viewOptions.paddingTop || 0;
    const paddingRight = viewOptions.paddingRight || 0;
    const paddingBottom = viewOptions.paddingBottom || 0;
    const paddingLeft = viewOptions.paddingLeft || 0;
    return `
      width: ${width}px;
      height: ${height}px;
      box-sizing: border-box;
      padding-top: ${paddingTop}px;
      padding-right: ${paddingRight}px;
      padding-bottom: ${paddingBottom}px;
      padding-left: ${paddingLeft}px;
    `;
  }}

  svg {
    width: 10px;
  }

  &:before {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    content: "";
    z-index: -1;
    background-color: ${({ iconBgColor }) => iconBgColor || "transparent"};
    
    ${(props: any) => {
      const sidebarRow = props.theme.token.components.SIDEBAR_ROW;
      
      return `
        opacity: ${sidebarRow.options[props.viewOptions]?.opacity || 1};
        border-radius: ${(sidebarRow.options[props.viewOptions]?.borderRadius || 0) + "px"};
        transition: opacity ${timingIn} ${easingBasic};
      `;
    }};
  }
`;

const SidebarRowStyled = styled.div`
  ${(props: any) => {4
    const { wrapper } = props.theme.token.components.SIDEBAR_ROW.types.default;
    return `
      width: 100%;
      padding-top: ${wrapper.paddingTop}px;
      padding-bottom: ${wrapper.paddingBottom}px;
    `;
  }};
`;


export const SidebarRowInnerContentStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  width: 100%;

   ${(props: any) => {
    const { inner } = props.theme.token.components.SIDEBAR_ROW.types.default;
    return `
      gap: ${inner.gap}px;
    `;
  }};
`;

const SidebarRowInnerStyled = styled.div<SidebarRowProps>`
  display: flex;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  
  ${(props: any) => {
    const { inner } = props.theme.token.components.SIDEBAR_ROW.types.default;
    return `
      padding-top: ${inner.paddingTop}px;
      padding-right: ${inner.paddingRight}px;
      padding-bottom: ${inner.paddingBottom}px;
      padding-left: ${inner.paddingLeft}px;
      border-radius: ${inner.borderRadius}px;
      transition: background-color ${timingIn} ${easingBasic};
    `;
  }};

  &:before {
    width: 100%;
    height: 100%;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    background-color: transparent;
    opacity: 0.5;
    pointer-events: none;
    transition: background-color ${timingIn} ${easingBasic};
  }

  

  &.newMention {
    ${(props: any) => {
    const { newMention } = props.theme.token.components.SIDEBAR_ROW.types;
    return `
      &:before {
        background-color: ${newMention.inner.backgroundColor};
      }
      .SidebarRowTitle {
        color: ${newMention.text.color};
        font-weight: ${newMention.text.fontWeight};
      }
    `;
  }}
  }

  &.badge {
    ${(props: any) => {
    const { badge } = props.theme.token.components.SIDEBAR_ROW.types;
    return `    
      .SidebarRowTitle {
        color: ${badge.text.color};
        font-weight: ${badge.text.fontWeight};
      }
    `;
  }}
  }

  &:hover {
    &:not(.active) {
      background-color: ${(props: any) => props.theme.token.components.SIDEBAR_ROW.types.default.stateHover.inner.backgroundColor};
    }

    .SidebarRowTitle {
      color: ${(props: any) => props.theme.token.components.SIDEBAR_ROW.types.default.stateHover.text.color};
    }

    .SidebarRowIcon:before {
      opacity: 1;
    }

    .SidebarRowCloseIcon {
      opacity: ${(props: any) => props.theme.token.components.SIDEBAR_ROW.closeIcon.opacity};
      margin-right: 5px;
    }
  }

  &.channel {
    .SidebarRowIcon {
      transition: opacity ${timingIn} ${easingBasic};
    }
  }

  &.nameNumber {
    height: 38px;
    box-sizing: border-box;
  }

  &.active {
    &:before {
      background-color: ${({ iconBgColor }) => iconBgColor || "transparent"};
    }

    .SidebarRowTitle {
      font-weight: ${(props: any) => props.theme.token.components.SIDEBAR_ROW.types.default.stateActive.text.fontWeight};
      color: ${(props: any) => props.theme.token.components.SIDEBAR_ROW.types.default.stateActive.text.color};
    }

    &.user:before,
    &.nameNumber:before {
      background-color: ${(props: any) => props.theme.token.components.SIDEBAR_ROW.types.default.stateActive.inner.backgroundColor};
    }
  }

  &.newMessages {
    &:before {
      background-color:  ${(props: any) => props.theme.token.components.SIDEBAR_ROW.types.default.stateHover.inner.backgroundColor};
    }
  }
`;

const SidebarRowCloseIcon = styled.div`
  opacity: 0;
  margin-left: auto;

  ${(props: any) => {
    const { closeIcon } = props.theme.token.components.SIDEBAR_ROW;
    const { width, height } = closeIcon;

    return `
      width: ${width}px;
      height: ${height}px;
      margin-right: -${width}px;
      transition: opacity ${timingIn} ${easingBasic}, margin-right ${timingIn} ${easingBasic};
    `;
  }};

  &:hover {
    opacity: 1 !important;
  }
`;

const SidebarRowNameNumberStyled = styled.div`
  ${(props: any) => {
    const sidebarRow = props.theme.token.components.SIDEBAR_ROW;
    const { paddingLeft } = sidebarRow.types.default.nameNumber;
    const notificationGap = sidebarRow.types.default.nameNumber.gap;

    return `
      display: flex;
      align-items: center;
      overflow: hidden;
      padding-left: ${paddingLeft}px;

      .Notification {
        margin-left: ${notificationGap}px;
      }
    `;
  }};
`;

export {
  SidebarRowStyled,
  SidebarRowIconStyled,
  SidebarRowInnerStyled,
  SidebarRowCloseIcon,
  SidebarRowTitleStyled,
  SidebarRowNameNumberStyled
};
