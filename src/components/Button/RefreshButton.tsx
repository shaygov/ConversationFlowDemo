import React from "react";
import { css,  Global } from "@emotion/react";
import { FontAwesome } from "@libs/components/typography/FontAwesome/FontAwesome";
import styled from "@emotion/styled";

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  title?: string;
  style?: React.CSSProperties;
}


const ButtonStyled = styled.button`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  background: none;
  border: 0;
  color: #fff;
  border-radius: 4px;
  margin-left: 10px;
  padding: 2px 0px;
  cursor: pointer;
  .fad {
    font-size: 12px;
    transform-origin: center;
  }
`;

const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick, loading, title = "Refresh", style }) => (
  <>
    <Global
      styles={css`
        .fa-spin {
          animation: fa-spin 0.6s linear infinite !important;
        }
        @keyframes fa-spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}
    />
    <ButtonStyled
      onClick={onClick}
      title={title}
    >
      <FontAwesome
        type="fad"
        icon="sync"
        color="#fff"
        className={loading ? 'fa-spin' : undefined}
      />
    </ButtonStyled>
  </>
);

export default RefreshButton; 