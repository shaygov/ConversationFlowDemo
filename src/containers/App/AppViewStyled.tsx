import styled from '@emotion/styled';
import { timingOut, easingBasic } from '@vars/Global';
import Theme from '@vars/Theme';

const getSidebarStyle = (props: any) => props.theme.token.components.SIDEBAR;

interface AppViewProps {
  solutionColor?: string;
}

const AppViewStyled = styled.div<AppViewProps>`
    position: relative;
    height: 100%;
    display: flex;
  }
`;

const ViewBoxStyled = styled.div<AppViewProps>`
  height: 100%;
  padding-top: ${props => getSidebarStyle(props).paddingTop}px;
  margin-left: 5px;
  box-sizing: border-box;
  transition: border-color ${timingOut} ${easingBasic};
`;


export { AppViewStyled, ViewBoxStyled };