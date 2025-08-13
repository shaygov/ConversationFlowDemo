import React from 'react';
import styled from '@emotion/styled';
import { Align, Weight } from '../typography.constants';
import Theme from '@vars/Theme';
import { TextSize, TextSizes } from './Text.constants';

export interface TextStyledProps {
  as?: React.ElementType;
  align?: Align;
  lineHeight?: number;
  size?: TextSizes | TextSize;
  weight?: Weight;
}

const getTextSize = (size?: TextSizes | TextSize) => {
  switch (size) {
    case 'l':
      return Theme['fonts']['paragraph-l-regular'].size;
   case 'm':
        return Theme['fonts']['paragraph-l-medium'].size;
   case 's':
          return Theme['fonts']['paragraph-s-medium'].size;
    default:
      return Theme['fonts']['paragraph-l-regular'].size;
  }
};

const getTextWeight = (weight?: Weight) => {
  switch (weight) {
    case 'regular':
      return Theme['fonts']['paragraph-l-regular'].weight;
    case 'medium':
        return Theme['fonts']['paragraph-l-medium'].weight;
    default:
      return Theme['fonts']['paragraph-l-regular'].weight;
  }
};

const TextStyled = styled.p<TextStyledProps>`
  margin: 0;
  text-align: ${({align}) => align ? align : 'inherit'};
  font-size: ${props => getTextSize(props.size)};
  color: ${props => props.color ? props.color : Theme['semantic-colors'].greyscale['$G-0']};
  line-height: ${props => props.lineHeight ? props.lineHeight : 20}px;
  font-weight: ${props => getTextWeight(props.weight)};
`;


// const Text: React.FC<TextProps> = ({ as: Tag = 'span', color, children }) => {
//   return <StyledText as={Tag} color={color}>{children}</StyledText>;
// };

export default TextStyled;