import React, { FC, memo } from 'react';
import cx from "classnames";
import { AvatarStyled, AvatarInitialsStyled } from './AvatarStyled';
import { AvatarImage } from './Avatar.constants';
import { AvatarSizes } from './Avatar.types';

export interface Props {
  className?: string;
  text?: string;
  size?: AvatarSizes;
  image?: AvatarImage;
  online?: boolean;
}

const Avatar: FC<Props> = ({
  className,
  size = AvatarSizes.m,
  text,
  image,
  online,
  ...rest
}) => {
  const classes = cx(className, {
    [size]: true,
    'Initials' : text,
    'online': online ? 'online' : ''
  });

  return (
    <AvatarStyled {...rest} className={classes} size={size}>
      {image?.src ? (
        <img src={image.src} alt={image?.alt || ''} />
      ) : text ? (
        <AvatarInitialsStyled className={classes}>
          {text}
        </AvatarInitialsStyled>
      ) : null }
    </AvatarStyled>
  );
};

export default memo(Avatar);
