import styled from '@emotion/styled';
import { timingIn, easingBasic } from '@vars/Global';
import { ThreadOptions } from '../ChatBubbleThread/ChatBubbleThread.constants';

const avatarCommentProps = (props: any) => props.theme.token.chat_area.BUBBLE.avatarComment;
interface ThreadProps {
  type?: ThreadOptions;
}

const ContentStyled = styled.div<ThreadProps>`
  display: flex;
  margin: 20px 0;
  cursor: pointer;
  
  ${(props: any) => {
    const bubble = props.theme.token.chat_area.BUBBLE;
    const {
      gap,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      borderRadius,
      backgroundColor
    } = bubble.content;
    
    return `
      border-radius: ${borderRadius}px;
      gap: ${gap}px;
      padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px;
      transition: background-color ${timingIn} ${easingBasic};


      &.recordComment {
        background-color: ${backgroundColor};
      }
    `;
  }}

  &:hover {
    background-color: ${(props: any) => props.theme.token.chat_area.BUBBLE.hoverBlock.backgroundColor};

    .ChatBubbleMenu,
    .threadPersonalMessage {
      opacity: 1;
      pointer-events: all;
    }

    .CommentBadge {
      opacity: 0;
      pointer-events: none;
    }

    .ChatBubbleThread {
      ${(props: any) => {
        const bubbleThread = props.theme.token.chat_area.BUBBLE_THREAD;
        const { blockHover } = bubbleThread[props.type];
        return `
          ${blockHover && `
            background-color: ${blockHover?.backgroundColor || "transparent"};
            border-color: ${blockHover?.border?.borderColor || "transparent"};
          `}
        `;
      }}
    }
  }
`;

const AvatarCommentStyled = styled.div`
  width: 100%;
  display: flex;
  border-radius: ${props => avatarCommentProps(props).borderRadius}px;
  gap: ${props => avatarCommentProps(props).gap}px;
  flex-direction: column;
`;

const AvatarNameTimestampStyled = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => avatarCommentProps(props).avatarNameTimestampTop.avatarNameTimestamp.gap}px;
`;

const AvatarsTextStyled = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => avatarCommentProps(props).avatarsText.gap}px;
  padding: 
    ${props => avatarCommentProps(props).avatarsText.paddingTop}px 
    ${props => avatarCommentProps(props).avatarsText.paddingRight}px
    ${props => avatarCommentProps(props).avatarsText.paddingBottom}px
    ${props => avatarCommentProps(props).avatarsText.paddingLeft}px;
`;

const NameWrapperStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${props => avatarCommentProps(props).avatarNameTimestampTop.avatarNameTimestamp.nameWrapper.gap}px;
`;

const NameInnerStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${props => avatarCommentProps(props).avatarNameTimestampTop.avatarNameTimestamp.nameWrapper.nameInner.gap}px;
  position: relative;
`;

const NameStyled = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => avatarCommentProps(props).avatarNameTimestampTop.avatarNameTimestamp.nameWrapper.nameInner.name.gap}px;
`;

const nameTextProps = (props: any) => props.theme.token.chat_area.BUBBLE.avatarComment.avatarNameTimestampTop.avatarNameTimestamp.nameWrapper.nameInner.name.text;
const NameTextStyled = styled.p`
  margin: 0;
  font-size: ${props => nameTextProps(props).fontSize}px;
  line-height: ${props => nameTextProps(props).lineHeight}px;
  font-weight: ${props => nameTextProps(props).fontWeight};
  color: ${props => nameTextProps(props).color};
`;

const textWrapperProps = (props: any) => props.theme.token.chat_area.BUBBLE.avatarComment.avatarNameTimestampTop.textWrapper;
const TextWrapperStyled = styled.div`
  display: flex;
  gap: ${props => textWrapperProps(props).gap}px;
`;

const TextInnerStyled = styled.div`
  display: flex;
  gap: ${props => textWrapperProps(props).textInner.gap}px;
  padding: 
    ${props => textWrapperProps(props).textInner.paddingTop}px 
    ${props => textWrapperProps(props).textInner.paddingRight}px
    ${props => textWrapperProps(props).textInner.paddingBottom}px
    ${props => textWrapperProps(props).textInner.paddingLeft}px;
`;

const TextStyled = styled.p`
  font-size: ${props => textWrapperProps(props).textInner.text.fontSize}px;
  line-height: ${props => textWrapperProps(props).textInner.text.lineHeight}px;
  font-weight: ${props => textWrapperProps(props).textInner.text.fontWeight};
  color: ${props => textWrapperProps(props).textInner.text.color};
  margin: 0;
`;

const ChatOptionsStyled = styled.div`
  display: inline-flex;
`;

const commentBadgeProps = (props: any) => props.theme.token.chat_area.BUBBLE.commentBadge;
const CommentBadgeStyled = styled.div`
  height: ${props => commentBadgeProps(props).height}px;
  gap: ${props => commentBadgeProps(props).gap}px;
  border-radius: ${props => commentBadgeProps(props).borderRadius}px;
  padding: 
    ${props => commentBadgeProps(props).paddingTop}px 
    ${props => commentBadgeProps(props).paddingRight}px
    ${props => commentBadgeProps(props).paddingBottom}px
    ${props => commentBadgeProps(props).paddingLeft}px;
  background-color: ${props => commentBadgeProps(props).backgroundColor};
  display: inline-flex;
  transition: opacity ${timingIn} ${easingBasic};
`;

const CommentBadgeWrapperStyled = styled.div`
  gap: ${props => commentBadgeProps(props).wrapper.gap}px;
  display: flex;
  align-items: center;
`;

const CommentBadgeTextLeftStyled = styled.div`
  font-size: ${props => commentBadgeProps(props).wrapper.leftText.fontSize}px;
  line-height: ${props => commentBadgeProps(props).wrapper.leftText.lineHeight}px;
  font-weight: ${props => commentBadgeProps(props).wrapper.leftText.fontWeight};
  color: ${props => commentBadgeProps(props).wrapper.leftText.color};
`;

const CommentBadgeTextRightStyled = styled.div`
  font-size: ${props => commentBadgeProps(props).wrapper.rightText.fontSize}px;
  line-height: ${props => commentBadgeProps(props).wrapper.rightText.lineHeight}px;
  font-weight: ${props => commentBadgeProps(props).wrapper.rightText.fontWeight};
  color: ${props => commentBadgeProps(props).wrapper.rightText.color};
`;

const AvatarNameTimestampTopStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => avatarCommentProps(props).avatarNameTimestampTop.gap}px;
`;

const timeTextProps = (props: any) => props.theme.token.chat_area.BUBBLE.avatarComment.avatarNameTimestampTop.avatarNameTimestamp.nameWrapper.nameInner.name.timeText;
const TimeTextStyled = styled.p`
  margin: 0;
  font-size: ${props => timeTextProps(props).fontSize}px;
  line-height: ${props => timeTextProps(props).lineHeight}px;
  font-weight: ${props => timeTextProps(props).fontWeight};
  color: ${props => timeTextProps(props).color};
`;

const LastReplyTextStyled = styled.p`
  margin: 0;
  font-size: ${props => avatarCommentProps(props).avatarsText.lastReplyText.fontSize}px;
  line-height: ${props => avatarCommentProps(props).avatarsText.lastReplyText.lineHeight}px;
  font-weight: ${props => avatarCommentProps(props).avatarsText.lastReplyText.fontWeight};
  color: ${props => avatarCommentProps(props).avatarsText.lastReplyText.color};
`;

export { 
  ContentStyled, 
  AvatarCommentStyled, 
  AvatarNameTimestampStyled, 
  AvatarsTextStyled, 
  NameWrapperStyled,
  NameInnerStyled,
  NameStyled,
  NameTextStyled,
  ChatOptionsStyled,
  TextWrapperStyled,
  TextInnerStyled,
  TextStyled,
  CommentBadgeStyled,
  CommentBadgeWrapperStyled,
  CommentBadgeTextLeftStyled,
  CommentBadgeTextRightStyled,
  AvatarNameTimestampTopStyled,
  TimeTextStyled,
  LastReplyTextStyled
};