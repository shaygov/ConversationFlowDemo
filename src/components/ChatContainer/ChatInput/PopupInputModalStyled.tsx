import styled from '@emotion/styled';

interface PopupModalProps {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  zIndex?: number;
}

const PopupInputModalStyled = styled.div<PopupModalProps>`
  position: absolute;
  top: 0;
  margin-top: -5px;
  transform: translateY(-100%);
  background: #444444;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #fff;
  ${(props) => props.left !== undefined && `left: ${props.left};`}
  ${(props) => props.right !== undefined && `right: ${props.right};`}
  ${(props) => props.top !== undefined && `top: ${props.top};`}
  ${(props) => props.bottom !== undefined && `bottom: ${props.bottom};`}
  display: flex;
  z-index: ${(props) => props.zIndex || 100};
  input {
   padding: 4px 10px;
   height: 38px;
   background-color: #fff;
   color: #000;
   border-radius: 4px;
  }
`;




export default PopupInputModalStyled; 