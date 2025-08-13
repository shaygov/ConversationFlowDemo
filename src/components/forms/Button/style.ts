import styled from "@emotion/styled";

export const ButtonStyled = styled.button`
  background-color: rgba(135, 139, 146, 1);
  color: rgba(255, 255, 255, 1);
  border: none;
  outline: none;
  border-radius: 6px;
  height: 42px;
  padding: 0 16px;
  cursor: pointer;
  &:disabled {
    opacity: 0.2;
    cursor: default;
  }
`;