import React from 'react';
import ButtonStyled, { ButtonProps } from './ButtonStyled';

export interface Props extends ButtonProps {
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
};

const Button: React.FC<Props> = ({ label, onClick, ...rest }) => (
  <ButtonStyled onClick={onClick} {...rest}>
    {label}
  </ButtonStyled>
);

export default Button;