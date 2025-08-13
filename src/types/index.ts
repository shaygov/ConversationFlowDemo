import { Message, User } from 'stream-chat';
export * from './sidebar';
export * from './apps';
export * from './jest';
export type DefaultStreamChatGenerics = {
    attachmentType: Record<string, unknown>;
    channelType: Record<string, unknown>;
    commandType: string;
    eventType: Record<string, unknown>;
    messageType: Message;
    reactionType: Record<string, unknown>;
    userType: User;
}; 