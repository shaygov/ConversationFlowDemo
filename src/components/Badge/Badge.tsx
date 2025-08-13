import React, { FC, ReactNode } from 'react';
import { BadgeProps, BadgeStyled, BadgeTextStyled } from './BadgeStyled';

export interface Props extends BadgeProps {
  badge: string | number
  className?: string;
}

export const Badge: FC<Props> = ({
  badge,
  className,
  ...rest
}) => {

  return badge? (
    <BadgeStyled {...rest} className={className}>
      <BadgeTextStyled>
        {badge}
      </BadgeTextStyled>
    </BadgeStyled>
  ): null;
};