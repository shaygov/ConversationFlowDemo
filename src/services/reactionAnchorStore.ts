type Listener = () => void;

class ReactionAnchorStore {
  private anchorRect: DOMRect | null = null;
  private listeners: Listener[] = [];

  getAnchorRect() {
    return this.anchorRect;
  }

  setAnchorRect(rect: DOMRect | null) {
    this.anchorRect = rect;
    this.listeners.forEach((cb) => cb());
  }

  subscribe(cb: Listener) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }
}

export const reactionAnchorStore = new ReactionAnchorStore(); 