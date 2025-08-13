import React from 'react';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import cx from 'classnames';

export type FontAwesomeIconSize =
  | 'xs'
  | 'sm'
  | 'lg'
  | '2x'
  | '3x'
  | '4x'
  | '5x'
  | '6x'
  | '7x'
  | '8x'
  | '9x'
  | '10x';

export type FontAwesomeIconName = IconName;

export type FontAwesomeIconPrefix = IconPrefix;

export interface FontAwesomeProps {
  type?: IconPrefix;
  icon?: IconName;
  inverse?: boolean;
  color?: string;
  size?: FontAwesomeIconSize;
  style?: React.CSSProperties;
  className?: string;
}

export const FontAwesome: React.FunctionComponent<FontAwesomeProps> = (props: FontAwesomeProps) => {
  const { type, icon, inverse, size, color, style, className } = props;

  const styleIcon = { color, ...style };

  return (
    <i
      data-testid="font-awesome"
      className={cx(
        type,
        [`fa-${icon}`],
        { [`fa-${size}`]: !!size, 'fa-inverse': inverse },
        className
      )}
      style={styleIcon}
    ></i>
  );
};