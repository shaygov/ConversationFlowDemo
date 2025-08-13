import { useEffect } from 'react';
import { useReactionAnchor } from '@/hooks/useReactionAnchor';

export function useReactionButtonListener() {
  const { setAnchorRect } = useReactionAnchor();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      // Search for button by class
      const button = target.closest('.str-chat__message-reactions-button');
      if (button) {
        const rect = button.getBoundingClientRect();
        setAnchorRect(rect);
      }
    }
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [setAnchorRect]);
} 