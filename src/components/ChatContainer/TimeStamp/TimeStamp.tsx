import React, { memo } from 'react';
import {  
  TimeStampStyled,
  TimeStampTextStyled
} from './TimeStampStyled';
import Icon from '@libs/components/widgets/Icon/Icon';

export interface Props {
  label?: string;
}

const TimeStamp: React.FC<Props> = ({
  label
}) => {
  return (
    <TimeStampStyled>
      <Icon name="clock-thiner" size="S" className="TimeStampIcon"/>
      <TimeStampTextStyled>{label}</TimeStampTextStyled>
    </TimeStampStyled>
  )
};

export default memo(TimeStamp);