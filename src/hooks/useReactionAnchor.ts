import { useEffect, useState } from "react";
import { reactionAnchorStore } from "../services/reactionAnchorStore";

export function useReactionAnchor() {
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(reactionAnchorStore.getAnchorRect());

  useEffect(() => {
    const update = () => setAnchorRect(reactionAnchorStore.getAnchorRect());
    const unsubscribe = reactionAnchorStore.subscribe(update);
    return unsubscribe;
  }, []);

  return {
    anchorRect,
    setAnchorRect: (rect: DOMRect | null) => reactionAnchorStore.setAnchorRect(rect),
  };
} 