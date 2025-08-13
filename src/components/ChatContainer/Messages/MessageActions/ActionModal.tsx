import React from 'react';
import { ReactionSelectorProps, DefaultStreamChatGenerics } from 'stream-chat-react';
import ReactDOM from 'react-dom';


interface ActionModalProps extends ReactionSelectorProps<DefaultStreamChatGenerics> {
  anchorRect?: DOMRect | null;
  MODAL_HEIGHT?: number,
  MODAL_WIDTH?: number,
  onClose?: () => void;
  
  ReactionSelectorComponent?: React.ComponentType<any>;
}

const GAPX = 40;
const GAPY = 12;


const ActionModal = React.forwardRef<any, ActionModalProps>(
  (props, ref) => {
    // If anchorRect is passed as prop, use it, otherwise fallback to useReactionAnchor
    const { anchorRect, MODAL_HEIGHT, MODAL_WIDTH,  onClose, ReactionSelectorComponent, ...rest } = props;
    
    let style: React.CSSProperties;
    if (anchorRect) {
      const spaceBelow = window.innerHeight - anchorRect.bottom;
      const showAbove = spaceBelow < MODAL_HEIGHT;
      let top;
      if (showAbove) {
        top = Math.max(GAPY, anchorRect.top - MODAL_HEIGHT - GAPY);
      } else {
        top = Math.min(window.innerHeight - MODAL_HEIGHT - GAPY, anchorRect.bottom + GAPY);
      }
      let left = anchorRect.left;
      if (left + MODAL_WIDTH > window.innerWidth - GAPX) {
        left = window.innerWidth - MODAL_WIDTH - GAPX;
      }
      left = Math.max(GAPX, left);
      style = {
        position: 'fixed',
        left,
        top,
        width: MODAL_WIDTH,
        zIndex: 1000,
        background: '#444444',
        borderRadius: 8,
        boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
      };
    } else {
      style = {
        position: 'fixed',
        right: GAPX,
        top: 100,
        width: MODAL_WIDTH,
        zIndex: 1000,
        background: '#444444',
        borderRadius: 6,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      };
    }

    // Outside click logic
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        const node = (ref as React.RefObject<HTMLDivElement>)?.current;
        if (node && !node.contains(event.target as Node)) {
            props.onClose?.();
        }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, props.onClose]);


    const DinamicComponent = (<div ref={ref} style={style}>
       <ReactionSelectorComponent {...rest}  />
    </div>);


//    return DinamicComponent

    return ReactDOM.createPortal(DinamicComponent, document.body);
   
  }
);

export default ActionModal; 