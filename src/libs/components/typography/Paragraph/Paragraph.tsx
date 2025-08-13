import React, { FC } from 'react';

import { Text, TextProps } from '../Text/Text';

export type ParagraphProps = TextProps;

export const Paragraph: FC<ParagraphProps> = ({
  children, ...props
}) => {
  return (
    <Text tag="p" {...props}>
      {children}
    </Text>
  )
}