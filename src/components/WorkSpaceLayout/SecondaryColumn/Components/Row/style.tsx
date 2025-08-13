import styled from "@emotion/styled";
import { rgba } from 'emotion-rgba';

export interface RowProps {
  solutionColor?: string;
  viewOptions?: any;
  activeBg?: string;
  submenu?: boolean;
}

const RowStyled = styled.div<RowProps>`
  ${(props: any) => {
    const { globals } = props.theme.token.components.SUB_SIDEBAR_ROW.types[props.viewOptions].default;
    return `
      padding-top: ${globals.paddingTop}px;
      padding-right: ${globals.paddingRight}px;
      padding-bottom: ${globals.paddingBottom}px;
      padding-left: ${globals.paddingLeft}px;
    `;
  }};
`;

const RowStyledLoading = styled.div<RowProps>`
  ${(props: any) => {
    const { globals } = props.theme.token.components.SUB_SIDEBAR_ROW.types['inAppApp'].default;
    return `
      padding-top: ${globals.paddingTop}px;
      padding-right: ${globals.paddingRight}px;
      padding-bottom: ${globals.paddingBottom}px;
      margin-top: 10px;
      margin-bottom: 10px;
      padding-left: 36px;
      color: #fff;
      font-size: 13px;
    `;
  }};
`;

const RowInnerStyled = styled.div<RowProps>`
  ${(props: any) => {
    const propsTypes = props.theme.token.components.SUB_SIDEBAR_ROW.types;
    const {
      borderRadius,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    } = propsTypes[props.viewOptions].default.inner;
    const stateStyles = propsTypes.inAppApp.default;
    const textStyles = propsTypes[props.viewOptions].default.text;
    const badgeText = propsTypes[props.viewOptions]?.newMention?.text;
    const hoverBg = propsTypes[props.viewOptions].default.stateHover.inner.backgroundColor;
    const activeBg = props.activeBg || propsTypes[props.viewOptions].default?.stateActive?.inner?.backgroundColor;
    const newMention = propsTypes[props.viewOptions].newMention;
    const inAppRecordHeight = propsTypes.inAppRecord.default.inner.height;
    const recordActiveBg = props.solutionColor;
    
    return `
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      border-radius: ${borderRadius}px;
      padding-top: ${paddingTop}px;
      padding-right: ${paddingRight}px;
      padding-bottom: ${paddingBottom}px;
      padding-left: ${paddingLeft}px;
      // overflow: hidden;
      transition: background-color 0.15s ease-in-out;
      gap: ${stateStyles.labelOuter.gap}px;

      .RowTitle {
        color: ${textStyles.color};
        font-size: ${textStyles.fontSize}px;
        font-weight: ${textStyles.fontWeight};
        line-height: ${textStyles.lineHeight}px;
      }
      
      &.active {
        background-color: ${activeBg};
        
        .RowTitle {
          color: ${stateStyles.stateActive.text.color};
          font-weight: ${stateStyles.stateActive.text.fontWeight};
        }
      }

      &:hover {
        &:not(.active),
        &.newMention:not(.active) {
          background-color: ${hoverBg};

          .RowTitle {
            color:  ${stateStyles.stateHover.text.color};
          }
        }
      }

      &.inAppApp {  
        &.active {
          .RowArrowIcon {
            transform: rotate(0deg);
            opacity: 1;
          }
        }
      }

      &.inAppRecord {
        height: ${inAppRecordHeight}px;        
      }

      &.record {
        display: block;

        &.active {
          background-color: ${recordActiveBg !== 'transparent' ? rgba(recordActiveBg, 0.5) : 'transparent'};
        }

        .RowLabelOuter {
          padding: 0;
        }
      }

      &.badge {
        .RowTitle {
          color: ${badgeText.color};
          font-weight: ${badgeText.fontWeight};
        }
      }

      &.newMention:not(.active) {
        background-color: ${newMention.inner.backgroundColor};

        .RowTitle {
          color: ${newMention.text.color};
          font-weight: ${newMention.text.fontWeight};
        }
      }
    `;
  }};
`;

const RowLabelOuterStyled = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;

  > * {
    margin-right: 6px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const SolutionAppWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${(props: any) => props.theme.token.components.SUB_SIDEBAR_ROW.types.record.default.inner.gap}px;
  gap: ${(props: any) => props.theme.token.components.SUB_SIDEBAR_ROW.types.record.default.solutionApp.inner.gap}px;
`;

const SolutionAppTextStyled = styled.p`
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: ${(props: any) => props.theme.token.components.SUB_SIDEBAR_ROW.types.record.default.solutionApp.text.fontSize}px;
  font-weight: ${(props: any) => props.theme.token.components.SUB_SIDEBAR_ROW.types.record.default.solutionApp.text.fontWeight};
  line-height: ${(props: any) => props.theme.token.components.SUB_SIDEBAR_ROW.types.record.default.solutionApp.text.lineHeight}px;
  color: ${(props: any) => props.theme.token.components.SUB_SIDEBAR_ROW.types.record.default.solutionApp.text.color};
`;

const RowLabelInnerStyled = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  gap: ${(props: any) => props.theme.token.components.SUB_SIDEBAR_ROW.types.channel.default.labelInner.gap}px;
`;

const RowDotStyled = styled.div<RowProps>`
  background: ${({ solutionColor }) => solutionColor || "transparent"};
  flex: 0 0 auto;

  ${(props: any) => {
    const { dot } = props.theme.token.components.SUB_SIDEBAR_ROW.globals;

    return `
      width: ${dot.width}px;
      height: ${dot.height}px;
      border-radius: ${dot.borderRadius}px;
    `;
  }};
`;

const RowTitleStyled = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
  display: inline;
  margin: 0;
  transition: color 0.15s ease-in-out;
`;

const RowArrowIconStyled = styled.div`
  display: flex;
  transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
  transform: rotate(0deg);
  ${(props: any) => {
    const { arrowIcon } = props.theme.token.components.SUB_SIDEBAR_ROW.globals;
    return `
      transform: rotate(${arrowIcon.rotation}deg);
      opacity: ${arrowIcon.opacity};
    `;
  }};
  &.rotated {
    transform: rotate(0deg);
    opacity: 1;
  }
`;

export {
  RowStyled,
  RowInnerStyled,
  RowLabelOuterStyled,
  RowLabelInnerStyled,
  RowDotStyled,
  RowTitleStyled,
  RowArrowIconStyled,
  SolutionAppTextStyled,
  SolutionAppWrapperStyled,
  RowStyledLoading
};
