import { StreamChat, DefaultGenerics } from 'stream-chat';
import { ActiveChannelService } from './ActiveChannelService';

// Event subscriber interface - services implement this to receive events
export interface StreamEventSubscriber {
  onMessageNew?(cid: string, event: any): void;
  onMessageRead?(cid: string, event: any): void;
  onTypingStart?(cid: string, event: any): void;
  onTypingStop?(cid: string, event: any): void;
  onChannelUpdated?(cid: string, event: any): void;
  onChannelDeleted?(channelId: string, event: any): void;
  onChannelCreated?(channelId: string, event: any): void;
  onMemberAdded?(channelId: string, event: any): void;
  onMemberRemoved?(channelId: string, event: any): void;
  
  onNotificationMarkRead?(channelId: string, event: any): void;
  onNotificationMarkUnread?(channelId: string, event: any): void;
  onUserPresenceChanged?(userId: string, event: any): void;
  onUserWatchingStart?(channelId: string, event: any): void;
  // Easy to extend with new event types
}

// Event types for better type safety
export type StreamEventType = 
  | 'message.new'
  | 'typing.start' 
  | 'typing.stop'
  | 'channel.updated'
  | 'notification.added_to_channel'
  | 'notification.channel_deleted'
  | 'member.added'
  | 'member.removed'
  | 'message.read'
  | 'notification.mark_read'
  | 'notification.mark_unread'
  | 'user.presence.changed';

// Debounced event queue interface
interface ThrottledEvent {
  methodName: keyof StreamEventSubscriber;
  cid: string;
  event: any;
}

export class StreamEventManager {
  private static instance: StreamEventManager | null = null;
  private client: StreamChat<DefaultGenerics> | null = null;
  private subscribers: Set<StreamEventSubscriber> = new Set();
  private globalEventHandlers: Map<StreamEventType, (event: any) => void> = new Map();
  private isSubscribedToGlobalEvents = false;
  
  // Throttling properties
  private throttledEventQueue: ThrottledEvent[] = [];
  private throttleTimer: NodeJS.Timeout | null = null;
  private readonly THROTTLE_DELAY = 500; // 2000ms interval between notifications
  private isThrottleTimerRunning = false;
  private lastNotificationTime = 0;
  

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): StreamEventManager {
    if (!StreamEventManager.instance) {
      StreamEventManager.instance = new StreamEventManager();
    }
    return StreamEventManager.instance;
  }

  /**
   * Global throttled notification function
   * Processes events with 2000ms interval between each notification
   */
  private throttledNotify(
    methodName: keyof StreamEventSubscriber,
    cid: string,
    event: any
  ): void {
    // Add event to queue
    this.throttledEventQueue.push({ methodName, cid, event });
    
    // Start processing if not already running
    if (!this.isThrottleTimerRunning) {
      this.processNextThrottledEvent();
    }
  }

  /**
   * Process the next event in the throttled queue with proper timing
   */
  private processNextThrottledEvent(): void {
    if (this.throttledEventQueue.length === 0) {
      this.isThrottleTimerRunning = false;
      return;
    }

    // Always start with a delay for the first event
    this.throttleTimer = setTimeout(() => {
      this.processSingleThrottledEvent();
    }, this.THROTTLE_DELAY);
  }

  /**
   * Process a single event from the throttled queue
   */
  private processSingleThrottledEvent(): void {
    if (this.throttledEventQueue.length === 0) {
      this.isThrottleTimerRunning = false;
      return;
    }

    const now = Date.now();
    const timeSinceLastNotification = now - this.lastNotificationTime;
    
    // If not enough time has passed, wait
    if (timeSinceLastNotification < this.THROTTLE_DELAY) {
      const delay = this.THROTTLE_DELAY - timeSinceLastNotification;
      this.throttleTimer = setTimeout(() => {
        this.processSingleThrottledEvent();
      }, delay);
      return;
    }

    // Get unique events (remove duplicates based on methodName and channelId)
    const uniqueEvents = this.getUniqueEvents();
    
    // Process only the first unique event
    if (uniqueEvents.length > 0) {
      const { methodName, cid, event } = uniqueEvents[0];
      console.log(`[Throttle] Processing event: ${methodName} for ${cid} at ${new Date().toISOString()}`);
      this.notifySubscribers(methodName, cid, event);
      this.lastNotificationTime = Date.now();
      
      // Remove the processed event from the queue
      this.removeEventFromQueue(methodName, cid);
    }
    
    // Schedule next event processing
    if (this.throttledEventQueue.length > 0) {
      this.throttleTimer = setTimeout(() => {
        this.processSingleThrottledEvent();
      }, this.THROTTLE_DELAY);
    } else {
      this.isThrottleTimerRunning = false;
    }
  }

  /**
   * Remove a specific event from the queue
   */
  private removeEventFromQueue(methodName: keyof StreamEventSubscriber, cid: string): void {
    const key = `${methodName}:${cid}`;
    this.throttledEventQueue = this.throttledEventQueue.filter(event => 
      `${event.methodName}:${event.cid}` !== key
    );
  }

  /**
   * Process all events in the throttled queue (legacy method - kept for compatibility)
   */
  private processThrottledEvents(): void {
    if (this.throttledEventQueue.length === 0) {
      return;
    }

    // Get unique events (remove duplicates based on methodName and channelId)
    const uniqueEvents = this.getUniqueEvents();
    
    // Process all unique events immediately
    uniqueEvents.forEach(({ methodName, cid, event }) => {
      this.notifySubscribers(methodName, cid, event);
    });
    
    // Clear the queue
    this.throttledEventQueue = [];
  }

  /**
   * Get unique events from the queue (remove duplicates)
   */
  private getUniqueEvents(): ThrottledEvent[] {
    const uniqueMap = new Map<string, ThrottledEvent>();
    
    this.throttledEventQueue.forEach(event => {
      const key = `${event.methodName}:${event.cid}`;
      // Keep the latest event for each unique key
      uniqueMap.set(key, event);
    });
    
    return Array.from(uniqueMap.values());
  }

  /**
   * Initialize with StreamChat client (follows ServiceFactory pattern)
   */
  public initialize(client: StreamChat<DefaultGenerics>): void {
    this.client = client;
    
    // Reset subscription state for new initialization
    this.isSubscribedToGlobalEvents = false;
    this.globalEventHandlers.clear();
    
    this.setupGlobalEventListeners();
    // console.log('StreamEventManager initialized with StreamChat client');
  }

  /**
   * Check if service is initialized
   */
  public isInitialized(): boolean {
    return this.client !== null;
  }

  /**
   * Subscribe to Stream Chat events
   * Returns unsubscribe function
   */
  public subscribe(subscriber: StreamEventSubscriber): () => void {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  /**
   * Get number of active subscribers (for debugging)
   */
  public getSubscriberCount(): number {
    return this.subscribers.size;
  }

  /**
   * Set up global event listeners - only called once
   */
  private setupGlobalEventListeners(): void {
    if (!this.client || this.isSubscribedToGlobalEvents) {
      return;
    }

    // Message events
    const messageNewHandler = (event: any) => {
      // For now, we'll notify all subscribers about new messages
      // Send if the channel is active
      const isActive = ActiveChannelService.getInstance().isChannelActive(event.cid);
      if (!isActive) {
        this.notifySubscribers('onMessageNew', event.cid, event);
      }
    };

    // Message read events
    const messageReadHandler = (event: any) => {
       if(event.user?.id === this.client?.userID) {
        this.notifySubscribers('onMessageRead', event.cid, event);
      }
    };

    // Typing events
    const typingStartHandler = (event: any) => {
      if (event.user?.id !== this.client?.user?.id) {
        this.notifySubscribers('onTypingStart', event.cid, event);
      }
    };

    const typingStopHandler = (event: any) => {
      if (event.user?.id !== this.client?.user?.id) {
        this.notifySubscribers('onTypingStop', event.cid, event);
      }
    };

    // Channel events
    const channelUpdatedHandler = (event: any) => {
      this.notifySubscribers('onChannelUpdated', event.cid, event);
    };

    const channelDeletedHandler = (event: any) => {
      const channelId = this.extractChannelId(event.cid);
      this.notifySubscribers('onChannelDeleted', channelId, event);
    };

    // Channel creation events (when user is added to channel)
    const channelCreatedHandler = (event: any) => {
      // Use throttled notification for channel created events
      this.throttledNotify('onChannelCreated', event.cid, event);
      // this.notifySubscribers('onChannelCreated', event.cid, event);
    };

    // Member events
    const memberAddedHandler = (event: any) => {
      const channelId = this.extractChannelId(event.cid);
      this.notifySubscribers('onMemberAdded', channelId, event);
    };

    const memberRemovedHandler = (event: any) => {
      const channelId = this.extractChannelId(event.cid);
      this.notifySubscribers('onMemberRemoved', channelId, event);
    };

    // User presence events
    const userPresenceChangedHandler = (event: any) => {
      const userId = event.user?.id || '';
      this.notifySubscribers('onUserPresenceChanged', userId, event);
    };

    const notificationMarkReadHandler = (event: any) => {
      const channelId = this.extractChannelId(event.cid);
      this.notifySubscribers('onNotificationMarkRead', channelId, event);
    };

    const notificationMarkUnreadHandler = (event: any) => {
      const channelId = this.extractChannelId(event.cid);
      this.notifySubscribers('onNotificationMarkUnread', channelId, event);
    };

    // Subscribe to ALL global events - CENTRALIZED EVENT MANAGEMENT
    this.client.on('message.new', messageNewHandler);
    this.client.on('typing.start', typingStartHandler);
    this.client.on('typing.stop', typingStopHandler);
    this.client.on('channel.updated', channelUpdatedHandler);
    this.client.on('notification.added_to_channel', channelCreatedHandler);
    this.client.on('notification.channel_deleted', channelDeletedHandler);
    this.client.on('member.added', memberAddedHandler);
    this.client.on('member.removed', memberRemovedHandler);
    this.client.on('message.read', messageReadHandler);
    this.client.on('notification.mark_read', notificationMarkReadHandler);
    this.client.on('notification.mark_unread', notificationMarkUnreadHandler);
    this.client.on('user.presence.changed', userPresenceChangedHandler);

    // Store handlers for cleanup
    this.globalEventHandlers.set('message.new', messageNewHandler);
    this.globalEventHandlers.set('typing.start', typingStartHandler);
    this.globalEventHandlers.set('typing.stop', typingStopHandler);
    this.globalEventHandlers.set('channel.updated', channelUpdatedHandler);
    this.globalEventHandlers.set('notification.added_to_channel', channelCreatedHandler);
    this.globalEventHandlers.set('notification.channel_deleted', channelDeletedHandler);
    this.globalEventHandlers.set('member.added', memberAddedHandler);
    this.globalEventHandlers.set('member.removed', memberRemovedHandler);
    this.globalEventHandlers.set('message.read', messageReadHandler);
    this.globalEventHandlers.set('notification.mark_read', notificationMarkReadHandler);
    this.globalEventHandlers.set('notification.mark_unread', notificationMarkUnreadHandler);
    this.globalEventHandlers.set('user.presence.changed', userPresenceChangedHandler);

    this.isSubscribedToGlobalEvents = true;
  }

  /**
   * Notify all subscribers about an event
   */
  private notifySubscribers(
    methodName: keyof StreamEventSubscriber, 
    channelId: string, 
    event: any
  ): void {
    this.subscribers.forEach(subscriber => {
      const method = subscriber[methodName];
      if (typeof method === 'function') {
        try {
          method.call(subscriber, channelId, event);
        } catch (error) {
          console.error(`Error in ${methodName} handler:`, error);
        }
      }
    });
  }

  /**
   * Extract channel ID from Stream Chat cid format ("messaging:channel_id")
   */
  private extractChannelId(cid: string): string {
    const parts = cid.split(':');
    return parts[parts.length - 1] || '';
  }

  /**
   * Cleanup - remove all event listeners and clear subscribers
   */
  public destroy(): void {
    if (!this.client || !this.isSubscribedToGlobalEvents) {
      return;
    }

    // Clear throttle timer
    this.stopThrottleTimer();

    // Clear throttled event queue
    this.throttledEventQueue = [];
    this.lastNotificationTime = 0;

    // Remove all global event handlers
    this.globalEventHandlers.forEach((handler, eventType) => {
      this.client!.off(eventType, handler);
    });

    this.globalEventHandlers.clear();
    this.subscribers.clear();
    this.isSubscribedToGlobalEvents = false;
    this.client = null;
  }

  /**
   * Force process throttled events immediately (for testing or urgent cases)
   */
  public forceProcessThrottledEvents(): void {
    this.stopThrottleTimer();
    this.lastNotificationTime = 0; // Reset timing to allow immediate processing
    
    // Process all events immediately without throttling
    const uniqueEvents = this.getUniqueEvents();
    uniqueEvents.forEach(({ methodName, cid, event }) => {
      console.log(`[Throttle] Force processing event: ${methodName} for ${cid}`);
      this.notifySubscribers(methodName, cid, event);
    });
    
    // Clear the queue
    this.throttledEventQueue = [];
  }

  /**
   * Stop the throttle timer
   */
  public stopThrottleTimer(): void {
    if (this.throttleTimer) {
      clearTimeout(this.throttleTimer);
      this.throttleTimer = null;
    }
    this.isThrottleTimerRunning = false;
  }

  /**
   * Get debug info about current state
   */
  public getDebugInfo(): {
    isInitialized: boolean;
    subscriberCount: number;
    eventHandlerCount: number;
    isSubscribedToEvents: boolean;
    throttledQueueSize: number;
    hasActiveThrottleTimer: boolean;
  } {
    return {
      isInitialized: this.isInitialized(),
      subscriberCount: this.subscribers.size,
      eventHandlerCount: this.globalEventHandlers.size,
      isSubscribedToEvents: this.isSubscribedToGlobalEvents,
      throttledQueueSize: this.throttledEventQueue.length,
      hasActiveThrottleTimer: this.throttleTimer !== null,
    };
  }
}