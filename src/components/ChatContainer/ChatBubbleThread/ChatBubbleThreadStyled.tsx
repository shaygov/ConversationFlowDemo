import styled from '@emotion/styled';
import { ThreadOptions } from './ChatBubbleThread.constants';
import { timingIn, easingBasic } from '@vars/Global';

interface ThreadProps {
  type?: ThreadOptions;
}

const ChatBubbleThreadStyled = styled.div<ThreadProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  ${(props: any) => {
    const propsTypes = props.theme.token.chat_area.BUBBLE_THREAD;
    const {
      borderRadius,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      gap,
      border,
      backgroundColor,
      hover,
      text
    } = propsTypes[props.type];

    return `
      padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px;
      border-radius: ${borderRadius}px;
      gap: ${gap}px;
      border: ${border.borderWidth}px ${border.borderType} ${border.borderColor || "transparent"};
      background-color: ${backgroundColor || "transparent"};
      transition: background-color ${timingIn} ${easingBasic}, border-color ${timingIn} ${easingBasic}, opacity ${timingIn} ${easingBasic};

      &:hover {
        ${hover && `
          border-color: ${hover?.border?.borderColor} !important;
        `}
      }

      &.comment {
        margin-left: -${paddingLeft}px;
      }

      &.threadPersonalMessage {
        width: 32px;
        height: 30px;
        box-sizing: border-box;
        opacity: 0;
        pointer-events: none;
      }

      ${text && `
        .ThreadText {
          margin: 2px 0;
          color: ${text.color};
          font-size: ${text.fontSize}px;
          font-weight: ${text.fontWeight};
          line-height: ${text.lineHeight}px;
        }
      `}
    `;
  }}
`;

const AvatarWrapperStyled = styled.div`
  display: inline-flex;
  gap: ${(props: any) => props.theme.token.chat_area.BUBBLE_THREAD.comment.avatarWrapper.gap}px;
`;

export { ChatBubbleThreadStyled, AvatarWrapperStyled };