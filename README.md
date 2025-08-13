# ConversationFlowDemo - Advanced Chat Application

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg)](https://prettier.io/)

A sophisticated, enterprise-grade chat application built with modern web technologies, featuring advanced service architecture, real-time communication, and comprehensive workspace management.

## 🚀 Features

- **Real-time Chat**: Powered by GetStream Chat API with instant messaging
- **Advanced Workspace Management**: Multi-workspace support with sophisticated layout system
- **Modern UI/UX**: Beautiful, responsive interface with dark/light themes
- **Service Layer Architecture**: Well-structured, maintainable codebase
- **Advanced Caching**: Multi-level caching strategy for optimal performance
- **Event-Driven Architecture**: Centralized event management system
- **TypeScript**: Full type safety with strict mode enabled

## 🏗️ Architecture Highlights

### Service Layer Pattern
The application follows a sophisticated service layer architecture with dependency injection:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   UI Components │◄──►│  Service Layer   │◄──►│  GetStream API  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                       ┌──────────────────┐
                       │  Event Manager   │
                       └──────────────────┘
```

### Advanced Caching Strategy
- **Multi-level caching**: Channel cache, user cache, workspace cache
- **Smart invalidation**: Automatic cache updates on data changes
- **Request deduplication**: Prevents duplicate API calls
- **Memory optimization**: Efficient storage and retrieval

### Event-Driven Architecture
- **Centralized event management**: Single point of control for all events
- **Throttling system**: Prevents performance issues from rapid events
- **Observer pattern**: Reactive updates across components
- **Real-time synchronization**: Instant updates across all connected clients

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand with custom middleware
- **Chat API**: GetStream Chat
- **Styling**: Emotion with theme system
- **Build Tool**: Webpack with hot reload
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
├── services/            # Core business logic services
│   ├── ServiceFactory.ts          # Main service coordinator
│   ├── MainChannelsService.ts     # Core channel management
│   ├── StreamEventManager.ts      # Event handling system
│   ├── GroupChannelsService.ts    # Channel grouping & caching
│   ├── WorkspaceUsersService.ts   # User management
│   ├── WorkspaceUnreadService.ts  # Unread message tracking
│   ├── ActiveChannelService.ts    # Active channel state
│   └── UserWorkspaceCoordinatorService.ts # User workspace coordination
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── zustand/             # State management stores
└── theme-variables/     # Design system
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GetStream account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shaygov/ConversationFlowDemo.git
   cd ConversationFlowDemo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your GetStream credentials
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# GetStream Chat Configuration
REACT_APP_GET_STREAM_API_KEY=your_getstream_api_key_here
REACT_APP_GET_STREAM_APP_ID=your_getstream_app_id_here

# Backend API Configuration
REACT_APP_API_URL=https://your-backend-api.com/api

# Environment
NODE_ENV=development
```

### GetStream Setup

1. Create a GetStream account at [getstream.io](https://getstream.io)
2. Create a new app
3. Copy your API key and App ID
4. Add them to your `.env` file

## 🏗️ Service Architecture Deep Dive

### ServiceFactory
The central coordinator that initializes and manages all services:

```typescript
export class ServiceFactory {
  public async initialize(client: StreamChat<DefaultGenerics>): Promise<void> {
    // Initialize services in dependency order
    this.streamEventManager = StreamEventManager.getInstance();
    this.mainChannelsService = MainChannelsService.getInstance();
    // ... other services
  }
}
```

### MainChannelsService
Core service for channel management with advanced caching:

```typescript
export class MainChannelsService {
  // Multi-level caching system
  public static channelCache = new Map<string, Channel<DefaultGenerics>>();
  
  // Request deduplication
  private pendingRequests = new Map<string, Promise<Channel<DefaultGenerics>[]>>();
  
  // Smart pagination
  public async getOrLoadChannels(filters, options, sort, forceRefresh, fetchAll) {
    // Intelligent caching and API call optimization
  }
}
```

### StreamEventManager
Centralized event handling with throttling:

```typescript
export class StreamEventManager {
  // Throttling system for performance
  private readonly THROTTLE_DELAY = 500;
  
  // Event subscription management
  public subscribe(subscriber: StreamEventSubscriber): () => void {
    // Efficient event distribution
  }
}
```

## 🎯 Key Technical Achievements

### 1. Service Architecture
- **Problem**: Complex chat application with multiple data sources
- **Solution**: Layered service architecture with dependency injection
- **Result**: Maintainable, testable, and scalable codebase

### 2. Event Management
- **Problem**: Real-time updates across multiple components
- **Solution**: Centralized event manager with throttling
- **Result**: Efficient real-time updates without performance issues

### 3. Caching Strategy
- **Problem**: Multiple API calls and slow UI updates
- **Solution**: Multi-level caching with smart invalidation
- **Result**: Fast UI updates and reduced API calls

### 4. Performance Optimization
- **Problem**: Large datasets and real-time updates
- **Solution**: Request deduplication and intelligent pagination
- **Result**: Smooth user experience with minimal API calls

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Build analysis
npm run build:analyze

# Deploy to production
npm run deploy
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- TypeScript strict mode
- ESLint + Prettier configuration
- Component-based architecture
- Service layer pattern adherence

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GetStream](https://getstream.io) for the excellent chat API
- [React](https://reactjs.org) team for the amazing framework
- [TypeScript](https://www.typescriptlang.org) for type safety
- [Zustand](https://github.com/pmndrs/zustand) for state management

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/shaygov/ConversationFlowDemo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/shaygov/ConversationFlowDemo/discussions)
- **Documentation**: [Wiki](https://github.com/shaygov/ConversationFlowDemo/wiki)

---

**Built with ❤️ using modern web technologies**
