import styled from '@emotion/styled';
// import Theme from '@vars/Theme';

const getChatInputStyle = (props: any) => props.theme.token.chat_area.CHAT_INPUT;
const ChatInputStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => getChatInputStyle(props).wrapper.gap}px;
  border-radius: ${props => getChatInputStyle(props).wrapper.borderRadius}px;
  background-color: ${props => getChatInputStyle(props).wrapper.backgroundColor};
  border: 
    ${props => getChatInputStyle(props).wrapper.border.borderWidth}px
    ${props => getChatInputStyle(props).wrapper.border.borderType}
    ${props => getChatInputStyle(props).wrapper.border.borderColor};
 
`;

const ChatInputInnerStyled = styled.div`
  min-height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column
`;

const IconTextStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-items: center;
  color: #fff;
  .mentions__input {
   height: 38px;
   color: #fff;
  }
  .CommentIcon {
    opacity: ${props => getChatInputStyle(props).iconText.iconOpacity};
  }
`;

const InputStyled = styled.input`
  color: #fff;
  font-size: ${props => getChatInputStyle(props).iconText.text.fontSize}px;
  font-weight: ${props => getChatInputStyle(props).iconText.text.fontWeight};
  line-height: ${props => getChatInputStyle(props).iconText.text.lineHeight}px;
`;

const FormatingStyled = styled.div`
  display: flex;
  gap: ${props => getChatInputStyle(props).formating.gap}px;
`;

export { ChatInputStyled, ChatInputInnerStyled, InputStyled, FormatingStyled, IconTextStyled};