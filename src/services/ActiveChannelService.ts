import { Channel, DefaultGenerics } from 'stream-chat';

type ActiveChannelChangeListener = (channelId: string | null) => void;

export class ActiveChannelService {
  private static instance: ActiveChannelService;
  private activeCid: string | null = null;
  private listeners: Set<ActiveChannelChangeListener> = new Set();
  private channel: Channel<DefaultGenerics> | null = null;

  public static getInstance(): ActiveChannelService {
    if (!ActiveChannelService.instance) {
      ActiveChannelService.instance = new ActiveChannelService();
    }
    return ActiveChannelService.instance;
  }

  /**
   * Set the active channel
   * @param channel The channel to set as active
   */
  public setActiveChannel(channel: Channel<DefaultGenerics> | null): void {
    const newChannelId = channel?.cid || null;
    
    // Only update if the channel actually changed
    if (this.activeCid !== newChannelId) {
      this.activeCid = newChannelId;
      this.channel = channel;
      
      // Notify all listeners about the change
      this.listeners.forEach(listener => {
        try {
          listener(newChannelId);
        } catch (error) {
          console.error('Error in active channel listener:', error);
        }
      });
    }
  }

  /**
   * Set the active channel by ID only (when channel instance is not available)
   * @param channelId The channel ID to set as active
   */
  public setActiveCid(cid: string | null): void {
    // Only update if the channel actually changed
    if (this.activeCid !== cid) {
      this.activeCid = cid;
      // Notify all listeners about the change
      this.listeners.forEach(listener => {
        try {
          listener(cid);
        } catch (error) {
          console.error('Error in active channel listener:', error);
        }
      });
    }
  }

  /**
   * Get the currently active channel ID
   */
  public getActiveCid(): string | null {
    return this.activeCid;
  }

  /**
   * Get the currently active channel object
   */
  public getActiveChannel(): Channel<DefaultGenerics> | null {
    return this.channel;
  }

  /**
   * Check if a specific channel is active
   * @param channelId The channel ID to check
   */
  public isChannelActive(cid: string | null | undefined): boolean {
    if (!cid) return false;
    return this.activeCid === cid;
  }

  /**
   * Subscribe to active channel changes
   * @param listener Callback function that receives the new active channel ID
   * @returns Unsubscribe function
   */
  public subscribe(listener: ActiveChannelChangeListener): () => void {
    this.listeners.add(listener);
    
    // Immediately call the listener with current state
    try {
      listener(this.activeCid);
    } catch (error) {
      console.error('Error in initial active channel listener call:', error);
    }
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Unsubscribe from active channel changes
   * @param listener The listener to remove
   */
  public unsubscribe(listener: ActiveChannelChangeListener): void {
    this.listeners.delete(listener);
  }

  /**
   * Get the number of active listeners
   */
  public getListenerCount(): number {
    return this.listeners.size;
  }

  /**
   * Clear all listeners (useful for cleanup)
   */
  public clearListeners(): void {
    this.listeners.clear();
  }

  /**
   * Reset the service state
   */
  public reset(): void {
    this.activeCid = null;
    this.channel = null;
    this.clearListeners();
  }
}

// Export singleton instance
export const activeChannelService = ActiveChannelService.getInstance(); 