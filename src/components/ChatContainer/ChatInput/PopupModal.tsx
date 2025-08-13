import React, { useEffect, useRef } from 'react';
import PopupModalStyled from './PopupInputModalStyled';

interface PopupModalProps {
  open: boolean;
  onClose: () => void;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  zIndex?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
  triggerRef?: React.RefObject<HTMLElement>;
}

const PopupModal: React.FC<PopupModalProps> = ({
  open,
  onClose,
  left,
  right,
  top,
  bottom,
  zIndex,
  style,
  children,
  triggerRef,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        (!triggerRef?.current || !triggerRef.current.contains(event.target as Node))
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <PopupModalStyled
      ref={ref}
      left={left}
      right={right}
      top={top}
      bottom={bottom}
      zIndex={zIndex}
      style={style}
    >
      {children}
    </PopupModalStyled>
  );
};

export default PopupModal; 