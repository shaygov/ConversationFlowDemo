import React, { useRef, HTMLAttributes, FunctionComponent, memo } from 'react';
// import cx from 'classnames';
import isEqual from 'react-fast-compare';

import TextStyled from './TextStyled';

// import { ColorNames, Colors } from '../../../constants/color';
// import { isFirefox, isWindows } from '../../../helpers/browser';
import {
  Weight,
  WrapMode,
  Align,
  LineClamps,
  TransformMode,
  BreakMode,
} from '../typography.constants';

import { TextSizes, TextSize } from './Text.constants';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  tag?: 'p' | 'span' | 'div' | 'button' | 'h3';
  styles?: React.CSSProperties;
  children?: React.ReactNode;
  size?: TextSizes | TextSize;
  weight?: Weight;
  color?: string;
  active?: boolean;
  hover?: boolean;
  wrapMode?: WrapMode;
  transformMode?: TransformMode;
  align?: Align;
  lineClamps?: LineClamps;
  lineHeight?: number;
  wordBreak?: BreakMode;
  letterSpace?: boolean;
  transition?: boolean;
  className?: string;
  title?: string;
  dataTestId?: string;
  ariaLabel?: string;
  role?: string;
}

const TextRaw: FunctionComponent<TextProps> = ({
  tag,
  styles,
  size,
  weight = 'regular',
  color,
  active = false,
  hover = false,
  wrapMode,
  transformMode,
  align,
  lineClamps,
  lineHeight,
  wordBreak,
  letterSpace = false,
  transition = false,
  className,
  children,
  title,
  ariaLabel = 'test',
  dataTestId,
  role = 'paragraph',
  ...props
}) => {
  const labelRefElement = useRef(null);

  // const classes = cx(
  //   className,
  //   'text',
  //   wrapMode && text--${wrapMode},
  //   {
  //     [`text--${size}`]: !!size,
  //     [`text--${transformMode}`]: !!transformMode,
  //     [`text--align-${align}`]: !!align,
  //     [`text--clamps text--clamps-${lineClamps}`]: !!lineClamps,
  //     [`text--transition`]: transition,
  //     [`text--${wordBreak}`]: !!wordBreak,
  //     'text--letter-space': letterSpace,
  //     'typo-active': active,
  //     'typo-hover': hover,
  //   },
  //   ${weight},
  //   ${color}
  // );

  const Tag = tag;

  return (
      <TextStyled 
        {...props}
        as={Tag} 
        style={styles}
        title={title}
        size={size}
        lineHeight={lineHeight}
        color={color}
        weight={weight}
        align={align}
        ref={labelRefElement}
        className={className}
        data-testid={dataTestId}
        aria-label={ariaLabel}
        role={role}
      >{children}</TextStyled>
    
  );
};

export const Text = memo(TextRaw, isEqual);