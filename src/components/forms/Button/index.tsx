import React from "react";
import { ButtonStyled } from "./style";

interface IButtonProps {
  children: React.ReactNode;
  name: string;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  disabled?: boolean;
  onClick?: (e: any) => void;
}

const Button = ({
  children,
  onClick,
  name,
  ...restProps
}: IButtonProps) => {
  return (
    <ButtonStyled
      onClick={(e: any) => onClick && onClick(e)}
      name={name}
      {...restProps}
    >
      {children}
    </ButtonStyled>
  );
}

export default Button;
