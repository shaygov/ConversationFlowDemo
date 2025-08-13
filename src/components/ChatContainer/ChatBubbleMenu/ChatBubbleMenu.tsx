import React, { memo } from 'react';
import { ChatBubbleMenuStyled, ChatBubbleMenuIconStyled, ChatBubbleMenuWrapperStyled } from './ChatBubbleMenuStyled';
import Icon from '@libs/components/widgets/Icon/Icon';

type innerItems = {
  icon: string;
  onClick: () => void;
  title: string;
  active?: boolean;
  disabled?: boolean;
  ref?: React.RefObject<HTMLButtonElement>;
}

interface ActionItem {
  group: string,
  items: innerItems[]
}

const ChatBubbleMenu: React.FC<{ items: ActionItem[] }> = ({items}) => {
  return <ChatBubbleMenuWrapperStyled> 
   {
    items.map((pitm, index) => (<ChatBubbleMenuStyled className="ChatBubbleMenu" key={pitm.group}>
      {pitm.items.map((itm, index) => (
        <ChatBubbleMenuIconStyled 
          disabled={itm.disabled}
          key={itm.icon} 
          onClick={itm.onClick} 
          ref={itm.ref} 
          active={itm.active}>
          <Icon name={itm.icon} size="S" />
        </ChatBubbleMenuIconStyled>
      ))}
    </ChatBubbleMenuStyled>))
  }
  </ChatBubbleMenuWrapperStyled>
};

export default memo(ChatBubbleMenu);