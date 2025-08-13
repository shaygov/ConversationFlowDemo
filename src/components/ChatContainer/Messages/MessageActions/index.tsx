import React, { useRef, useState } from "react";
import { useMessageContext, useChannelActionContext, useChannelStateContext } from 'stream-chat-react';
import styled from '@emotion/styled';
import ActionModal from './ActionModal';
import CustomReactionSelector from './CustomReactionSelector';
import ChatBubbleMenu  from '@/components/ChatContainer/ChatBubbleMenu/ChatBubbleMenu';
import { useSourceComponent } from '@/components/ChatContainer/Messages/SourceComponentContext';


const GroupActionButtonsStyled = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  right: 0px;
`;

interface CustomMessageActionsProps {
  isActionActive: boolean;
  onActionActiveChange: (active: boolean) => void;
}

export const CustomMessageActions: React.FC<CustomMessageActionsProps> = ({ isActionActive, onActionActiveChange }) => {
  const [openModal, setOpenModal] = useState<null | "reactions" | "actions">(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const reactionBtnRef = useRef<HTMLButtonElement>(null);
  const actionsBtnRef = useRef<HTMLButtonElement>(null);
  const { message } = useMessageContext();
  const { openThread } = useChannelActionContext();
  const sourceComponent = useSourceComponent();

  // Unified click handler for both actions and reactions
  const handleButtonClick = React.useCallback((type: "reactions" | "actions", ref: React.RefObject<HTMLButtonElement>) => {
    if (ref.current) {
      setAnchorRect(ref.current.getBoundingClientRect());
    }
    setOpenModal(type);
    onActionActiveChange(true);
  }, [onActionActiveChange]);

  const handleCloseModal = () => {
    setOpenModal(null);
    onActionActiveChange(false);
  };

  // Hide reactions on outside click
  React.useEffect(() => {
    if (!openModal) return;
    function handleClickOutside(event: MouseEvent) {
      const selector = selectorRef.current;
      if (
        selector &&
        !selector.contains(event.target as Node)
      ) {
        handleCloseModal();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openModal]);

  const selectorRef = useRef<HTMLDivElement>(null);
  
  const rawActionItems = React.useMemo(() => [
     {
      group: 'First group',
      items: [
        {
          icon: "thread",
          onClick: () => openThread && openThread(message),
          title: "Thread",
          hide: (sourceComponent==='Thread'),
        },
      ]
     }, {
      group: 'Second group',
      items: [
        {
          icon: "add-reaction",
          onClick: () => handleButtonClick("reactions", reactionBtnRef),
          title: "Add reaction",
          active: openModal === "reactions",
          ref: reactionBtnRef,
        },
        {
          icon: "forward",
          onClick: () => {},
          title: "Forward",
          disabled: true
        },
        {
          icon: "favourite",
          onClick: () => {},
          title: "Favourite",
          disabled: true
        },
        {
          icon: "plus",
          onClick: () => {},
          title: "Plus",
          disabled: true
        },
        {
          icon: "3-dot-more-vertical",
          onClick: () => handleButtonClick("actions", actionsBtnRef),
          title: "More actions",
          active: openModal === "actions",
          ref: actionsBtnRef,
        },
      ]
     } 
  ], [openModal, sourceComponent, openThread, message, handleButtonClick]);

  // Filter internal items according to hide (only if it exists)
  const actionItems = rawActionItems
    .map(group => ({
      ...group,
      items: group.items.filter(item => !("hide" in item && item.hide))
    }))
    .filter(group => group.items.length > 0); // remove groups with empty items

  return (
    <GroupActionButtonsStyled className="message-actions">
      <ChatBubbleMenu
        items = {actionItems}
      />
      {openModal === "reactions" && (
        <ActionModal
          anchorRect={anchorRect}
          ref={selectorRef}
          MODAL_WIDTH={340}
          MODAL_HEIGHT={400}
          ReactionSelectorComponent={CustomReactionSelector}
          onClose={handleCloseModal}
        />
      )}
    </GroupActionButtonsStyled>
  );
};



