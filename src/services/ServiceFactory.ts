import { StreamChat, DefaultGenerics } from 'stream-chat';
import { MainChannelsService } from './MainChannelsService';
import { WorkspaceUsersService } from './WorkspaceUsersService';
import { StreamEventManager } from './StreamEventManager';
import { WorkspaceUnreadService } from './WorkspaceUnreadService';
import { GroupChannelsService } from './GroupChannelsService';
import { ActiveChannelService } from './ActiveChannelService';

export class ServiceFactory {
  private static instance: ServiceFactory;
  private client: StreamChat<DefaultGenerics> | null = null;
  private mainChannelsService: MainChannelsService | null = null;
  private workspaceUsersService: WorkspaceUsersService | null = null;
  private streamEventManager: StreamEventManager | null = null;
  private workspaceUnreadService: WorkspaceUnreadService | null = null;
  private groupChannelsService: GroupChannelsService | null = null;
  private activeChannelService: ActiveChannelService | null = null;

  public static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  public async initialize(client: StreamChat<DefaultGenerics>): Promise<void> {
    this.client = client;
    
    // Initialize StreamEventManager FIRST - other services may depend on it
    this.streamEventManager = StreamEventManager.getInstance();
    this.streamEventManager.initialize(client);
    
    // Initialize ActiveChannelService and reset it for new session
    this.activeChannelService = ActiveChannelService.getInstance();
    this.activeChannelService.reset();
    
    // Create services with proper dependency injection
    this.mainChannelsService = MainChannelsService.getInstance();
    this.mainChannelsService.initialize(client);
    
    // Inject MainChannelsService dependency into WorkspaceUsersService
    this.workspaceUsersService = WorkspaceUsersService.getInstance(this.mainChannelsService);
    this.workspaceUsersService.initialize(client);
    
    // Initialize WorkspaceUnreadService with its dependencies
    this.workspaceUnreadService = WorkspaceUnreadService.getInstance();
    await this.workspaceUnreadService.initialize(client, this.mainChannelsService, this.streamEventManager);
    
    // Initialize GroupChannelsService with MainChannelsService dependency
    this.groupChannelsService = GroupChannelsService.getInstance();
    this.groupChannelsService.initialize(client, this.mainChannelsService);
  }

  public getChannelService(): MainChannelsService {
    if (!this.mainChannelsService) {
      throw new Error('MainChannelsService not initialized. Call initialize() first.');
    }
    return this.mainChannelsService;
  }

  public getWorkspaceUsersService(): WorkspaceUsersService {
    if (!this.workspaceUsersService) {
      throw new Error('WorkspaceUsersService not initialized. Call initialize() first.');
    }
    return this.workspaceUsersService;
  }

  public getStreamEventManager(): StreamEventManager {
    if (!this.streamEventManager) {
      throw new Error('StreamEventManager not initialized. Call initialize() first.');
    }
    return this.streamEventManager;
  }

  public getWorkspaceUnreadService(): WorkspaceUnreadService {
    if (!this.workspaceUnreadService) {
      throw new Error('WorkspaceUnreadService not initialized. Call initialize() first.');
    }
    return this.workspaceUnreadService;
  }

  public getGroupChannelsService(): GroupChannelsService {
    if (!this.groupChannelsService) {
      throw new Error('GroupChannelsService not initialized. Call initialize() first.');
    }
    return this.groupChannelsService;
  }

  public getActiveChannelService(): ActiveChannelService {
    if (!this.activeChannelService) {
      throw new Error('ActiveChannelService not initialized. Call initialize() first.');
    }
    return this.activeChannelService;
  }



  public destroy(): void {
    // Cleanup services
    if (this.mainChannelsService) {
      this.mainChannelsService.destroy();
    }
    
    if (this.workspaceUsersService) {
      this.workspaceUsersService.destroy();
    }
    
    if (this.streamEventManager) {
      this.streamEventManager.destroy();
    }
    
    if (this.workspaceUnreadService) {
      this.workspaceUnreadService.destroy();
    }
    
    if (this.groupChannelsService) {
      this.groupChannelsService.destroy();
    }
    
    if (this.activeChannelService) {
      this.activeChannelService.reset();
    }
    
    // Reset references
    this.client = null;
    this.mainChannelsService = null;
    this.workspaceUsersService = null;
    this.streamEventManager = null;
    this.workspaceUnreadService = null;
    this.groupChannelsService = null;
    this.activeChannelService = null;
  }
} 