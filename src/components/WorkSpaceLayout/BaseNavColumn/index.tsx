import styled from "@emotion/styled";

const getSidebarStyle = (props: any) => props.theme.token.components.SIDEBAR;


export const BaseNavColumnStyled = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding-top: ${props => getSidebarStyle(props).paddingTop}px;
  padding-right: 10px;
  padding-bottom: ${props => getSidebarStyle(props).paddingBottom}px;
  padding-left: 10px;

  &::selection {
    background-color: transparent;
  }

  &.SearchResults,
  &.ShowAllMessages {
    .RowInner {
      margin: 8px 0;
      position: relative;

      &:after {
        width: 100%;
        height: 1px;
        position: absolute;
        left: 0;
        bottom: -9px;
        content: '';
        background: #000000;
        opacity: 0.2;
        pointer-events: none;
      }
    }
  }
`;

export const BaseNavColumnDeviderStyled = styled.div`
  width: 100%;
  height: 1px;
  background-color: #FFFFFF;
  opacity: 0.08;
  margin: 12px 0 20px;
`;
