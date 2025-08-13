import { useState, useCallback, useEffect } from 'react';

interface UseSplitPaneProps {
  initialSize?: number;
  isVisible?: boolean;
}

export const useSplitPane = ({ initialSize = 260, isVisible = true }: UseSplitPaneProps = {}) => {
  const [sizes, setSizes] = useState<(number | string)[]>([
    isVisible ? initialSize : 0,
    'auto'
  ]);

  useEffect(() => {
    setSizes([isVisible ? initialSize : 0, 'auto']);
  }, [isVisible, initialSize]);

  const handleSizeChange = useCallback((newSizes: (number | string)[]) => {
    requestAnimationFrame(() => {
      setSizes(newSizes);
    });
  }, []);

  return {
    sizes,
    handleSizeChange
  };
}; 