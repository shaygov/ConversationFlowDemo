import React, { memo } from 'react';
import cx from "classnames";

import { ChatBubbleThreadStyled, AvatarWrapperStyled } from './ChatBubbleThreadStyled';
import Icon from '@libs/components/widgets/Icon/Icon';
import { ThreadOptions } from './ChatBubbleThread.constants';
import Avatar from '@libs/components/widgets/Avatar/Avatar';
import { AvatarSizes } from '@libs/components/widgets/Avatar/Avatar.types';
import { Paragraph } from '@libs/components/typography/Paragraph/Paragraph';

interface Props {
  type?: ThreadOptions;
}

const ChatBubbleThread: React.FC<Props> = ({ type = 'personalMessage' }) => {

  const classes = cx("ChatBubbleThread ", {
    [type]: true
  });

  return (
    <ChatBubbleThreadStyled className={classes} type={type}>
      {type === 'threadPersonalMessage' &&
        <Icon name="thread" size="S" />
      }
      {type === 'personalMessage' &&
        <Paragraph className="ThreadText">3 replies</Paragraph>
      }

      {type === 'comment' &&
        <>
          <AvatarWrapperStyled>
            <Avatar size={AvatarSizes.s} text='ml'/>
            <Avatar size={AvatarSizes.s}/>
            <Avatar size={AvatarSizes.s}/>
          </AvatarWrapperStyled>
          <Paragraph className="ThreadText">12 replies</Paragraph>
        </>
      }
    </ChatBubbleThreadStyled>
  )
};

export default memo(ChatBubbleThread);