// SidePanelStore singleton + hook
import { useEffect, useState } from 'react';

export type SidePanelComponent = {
  component: React.ComponentType<any>;
  props?: Record<string, any>;
} | null;

class SidePanelStore {
  private static instance: SidePanelStore;
  private listeners: Array<(panel: SidePanelComponent) => void> = [];
  private panel: SidePanelComponent = null;

  private constructor() {}

  static getInstance() {
    if (!SidePanelStore.instance) {
      SidePanelStore.instance = new SidePanelStore();
    }
    return SidePanelStore.instance;
  }

  setPanel(panel: SidePanelComponent) {
    this.panel = panel;
    this.notify();
  }

  clearPanel() {
    this.panel = null;
    this.notify();
  }

  getPanel() {
    return this.panel;
  }

  subscribe(listener: (panel: SidePanelComponent) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    for (const l of this.listeners) l(this.panel);
  }
}

export function useSidePanel() {
  const [panel, setPanel] = useState<SidePanelComponent>(SidePanelStore.getInstance().getPanel());

  useEffect(() => {
    const unsubscribe = SidePanelStore.getInstance().subscribe(setPanel);
    return unsubscribe;
  }, []);

  return {
    panel,
    setPanel: (panel: SidePanelComponent) => SidePanelStore.getInstance().setPanel(panel),
    clearPanel: () => SidePanelStore.getInstance().clearPanel(),
  };
}

export default SidePanelStore; 