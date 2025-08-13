import styled from "@emotion/styled";


export const BoxTextAreaFieldStyled = styled.div`
  border: none;
  outline: none;
  border-radius: 6px;
  min-height: 100px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px SOLID rgba(243.00000071525574, 243.00000071525574, 244.0000006556511, 0.08);
  width: 100%;
`;


export const Input = styled.input`
  background-color: rgba(0, 0, 0, 0.2) !important;
  border: none;
  outline: none;
  border-radius: 6px;
  height: 42px;
  padding: 10px 16px!important;
  color: rgba(255, 255, 255, 0.8);
  width: 100%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

export const Textarea = styled.textarea`
  background-color: rgba(0, 0, 0, 0.2) !important;
  border: none;
  outline: none;
  border-radius: 6px;
  padding: 10px 16px!important;
  color: rgba(255, 255, 255, 0.8);
  width: 100%;
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;


export const InputWrapper = styled.div`
  background-color: rgba(52, 52, 52, 1);
`;