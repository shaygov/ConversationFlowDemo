import styled from '@emotion/styled';
import { BadgeType } from './Badge.types';

export interface BadgeProps {
  type?: BadgeType;
  opened?: boolean;
};

const BadgeStyled = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  box-sizing: border-box;
  min-width: ${(props: any) => props.theme.token.components.NOTIFICATION.globals.width}px;
  height: ${(props: any) => props.theme.token.components.NOTIFICATION.globals.height}px;
  padding: ${(props: any) =>
    `${props.theme.token.components.NOTIFICATION.globals.paddingTop}px 
    ${props.theme.token.components.NOTIFICATION.globals.paddingRight}px 
    ${props.theme.token.components.NOTIFICATION.globals.paddingBottom}px 
    ${props.theme.token.components.NOTIFICATION.globals.paddingLeft}px`
  };
  
  background-color: ${(props: any) =>
    props.opened
      ? props.theme.token.components.NOTIFICATION.opened.backgroundColor
      : props.theme.token.components.NOTIFICATION.closed.backgroundColor};
  
  border: ${(props: any) =>
    props.opened
      ? `${props.theme.token.components.NOTIFICATION.opened.borderWidth}px ${props.theme.token.components.NOTIFICATION.opened.borderType} ${props.theme.token.components.NOTIFICATION.opened.borderColor}`
      : 'none'};
  
  border-radius: ${(props: any) => {
    const { borderRadius } = props.theme.token.components.NOTIFICATION.globals;
    return props.type === 'circle' ? '50px' : `${borderRadius}px`;
  }};
`;

const BadgeTextStyled = styled.span<BadgeProps>`
  ${(props: any) => {
    const {
      fontSize,
      fontWeight,
      lineHeight,
      color
    } = props.theme.token.components.NOTIFICATION.globals;

    return `
      font-size: ${fontSize}px;
      font-weight: ${fontWeight};
      line-height: ${lineHeight}px;
      color: ${color};
    `;
  }};
`;

export { BadgeStyled, BadgeTextStyled };