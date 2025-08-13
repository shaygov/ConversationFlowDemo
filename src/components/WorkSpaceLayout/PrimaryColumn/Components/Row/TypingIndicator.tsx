import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

const TypingIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin-left: 4px;
`;

const Dot = styled.div<{ delay: number }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props: any) => props.theme.token.components.SIDEBAR_ROW.types.default.text.color};
  animation: ${bounce} 1.4s ease-in-out infinite both;
  animation-delay: ${props => props.delay}s;
`;

const TypingIndicator: React.FC = () => {
  return (
    <TypingIndicatorContainer>
      <Dot delay={-0.32} />
      <Dot delay={-0.16} />
      <Dot delay={0} />
    </TypingIndicatorContainer>
  );
};

export default TypingIndicator; 