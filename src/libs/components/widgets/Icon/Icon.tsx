import React from "react";
import classNames from "classnames";

import { IconDimensions, IconSizes } from "./Icon.constants";

import Theme from "@vars/Theme";
import SpriteM from '@/images/sprites/sprite.Icon-M.svg';
import SpriteS from '@/images/sprites/sprite.Icon-S.svg';
import SpriteFontAwesome from '@/images/sprites/sprite.Icon-FontAwesome.svg';

const GreyscaleColor = Theme["semantic-colors"].greyscale;

export interface Props {
  name: string;
  color?: string;
  stroke?: string;
  className?: string;
  dimensions?: IconDimensions;
  transition?: boolean;
  size?: IconSizes;
}
const getDefaultDimension = (size: IconSizes): IconDimensions => {
  switch (size) {
    case 'S':
      return { width: 16, height: 16 };
    case 'M':
      return { width: 16, height: 16 };
    case 'FontAwesome':
      return { width: 20, height: 20 };
    default:
      return { width: 16, height: 16 };
  }
};

const Icon: React.FC<Props> = ({
  name,
  color = GreyscaleColor['$G-0'],
  className,
  stroke,
  transition,
  size = 'M',
  dimensions = getDefaultDimension(size)
}) => {
  const classes = classNames(`icon ${className ? className : ""}`, {
    "icon--transition": transition,
    "stroke-active": stroke,
  });
  const { iconWidth, iconHeight } = { iconWidth: dimensions.width, iconHeight: dimensions.height };
  const styles = {
    stroke: stroke,
    fill: color,
    minWidth: `${iconWidth}px`,
    height: `${iconHeight}px`,
    width: `${iconWidth}px`,
  };

  let svgPath;

  switch (size) {
    case 'S':
      svgPath = SpriteS;
      break;
    case 'M':
      svgPath = SpriteM;
      break;
    case 'FontAwesome':
      svgPath = SpriteFontAwesome;
      break;
  }


  const IMAGES_ROOT =  'images'

  {/* {
        (window.location.hostname === 'localhost' && window.location.port === '6006') ? (
          <use xlinkHref={`${svgPath}#${name}`} />
        ) :  (
        )
      } */}

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={classes} style={styles}>
      <use xlinkHref={`${IMAGES_ROOT}/sprites/sprite.Icon-${size}.svg#${name}`} />
      
    </svg>
  );
};

export default Icon;
