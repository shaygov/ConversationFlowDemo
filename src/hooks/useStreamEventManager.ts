import { useServices } from '@/contexts/ServicesContext';
import { StreamEventManager } from '@/services/StreamEventManager';

/**
 * Hook for accessing StreamEventManager from ServicesContext
 * 
 * @returns StreamEventManager instance or null if not initialized
 * 
 * @example
 * ```typescript
 * const streamEventManager = useStreamEventManager();
 * 
 * if (streamEventManager) {
 *   const unsubscribe = streamEventManager.subscribe(myService);
 * }
 * ```
 */
export function useStreamEventManager(): StreamEventManager | null {
  const { streamEventManager } = useServices();
  return streamEventManager;
}

/**
 * Hook for accessing StreamEventManager that throws if not initialized
 * Use this when you know the manager should be available
 * 
 * @returns StreamEventManager instance (never null)
 * @throws Error if StreamEventManager is not initialized
 * 
 * @example
 * ```typescript
 * const streamEventManager = useStreamEventManagerRequired();
 * const unsubscribe = streamEventManager.subscribe(myService);
 * ```
 */
export function useStreamEventManagerRequired(): StreamEventManager {
  const streamEventManager = useStreamEventManager();
  
  if (!streamEventManager) {
    throw new Error('StreamEventManager not available. Make sure ServicesProvider is initialized.');
  }
  
  return streamEventManager;
} 