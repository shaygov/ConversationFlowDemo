import styled from '@emotion/styled';
import { rgba } from 'emotion-rgba';
import Theme from '@vars/Theme';
import { timingIn, easingBasic } from '@vars/Global';


const ChatBubbleMenuWrapperStyled = styled.div`
  display: flex;
  position: absolute;
  right: 0px;
  top: -10px;
  transition: opacity ${timingIn} ${easingBasic};
`;

const ChatBubbleMenuStyled = styled.div`
  display: inline-flex;
  box-sizing: border-box;
  margin-right: 3px;
  &:last-child {
    margin-right: 0px;
  }
  ${(props: any) => {
    const bubbleMenu = props.theme.token.chat_area.BUBBLE_MENU;
    const { 
      gap,
      borderRadius,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      backgroundColor
    } = bubbleMenu.menu;
    
    const { 
      borderWidth,
      borderType,
      borderColor
    } = bubbleMenu.menu.border;

    return `
      gap: ${gap}px;
      border: ${borderWidth}px ${borderType} ${borderColor};
      border-radius: ${borderRadius}px;
      background-color: ${backgroundColor};
      padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px;
    `;
  }}
`;
const getBubbleMenuIconStyle = (props: any) => props.theme.token.chat_area.BUBBLE_MENU.menu.icon;
const ChatBubbleMenuIconStyled = styled.button<{ active?: boolean }>`
  padding-top: ${props => getBubbleMenuIconStyle(props).paddingTop}px;
  padding-right: ${props => getBubbleMenuIconStyle(props).paddingRight}px;
  padding-bottom: ${props => getBubbleMenuIconStyle(props).paddingBottom}px;
  padding-left: ${props => getBubbleMenuIconStyle(props).paddingLeft}px;
  border-radius: ${props => getBubbleMenuIconStyle(props).borderRadius}px;
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${({ active }) => (active ? rgba(Theme['semantic-colors'].greyscale['$G-0'], 0.08) : "none")};
  &:hover {
    background: ${rgba(Theme['semantic-colors'].greyscale['$G-0'], 0.08)}
  }
  &:disabled {
   cursor: default;
   opacity: 0.1
  }
`;

export { ChatBubbleMenuWrapperStyled, ChatBubbleMenuStyled, ChatBubbleMenuIconStyled };