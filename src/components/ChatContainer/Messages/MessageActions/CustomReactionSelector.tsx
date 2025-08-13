import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useMessageContext } from 'stream-chat-react';
import {CustomEmojiPickerForReaction} from '../CustomEmojiPicker';

interface CustomReactionSelectorProps {
  onClose?: () => void;
  anchorRect?: DOMRect | null;
}

const CustomReactionSelector = React.forwardRef<HTMLDivElement, CustomReactionSelectorProps>((props, ref) => {
  const { handleReaction} = useMessageContext();
  const handleSelect = (slug: string) => {
    handleReaction(slug, undefined);
  };
  return <CustomEmojiPickerForReaction onSelect={handleSelect}/>
});

export default CustomReactionSelector; 