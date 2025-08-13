import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import data from '@emoji-mart/data';
// import Emoji from '@emoji-mart/react'; // No longer needed
import emojiData from '@/assets/emoji/data-by-emoji.json';
import { Global, css } from '@emotion/react';
import { codeCss } from '../ChatInput/codeStyle';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { useRef, useEffect } from 'react';
import {CustomMessageActions} from './MessageActions';
import Icon from '@/libs/components/widgets/Icon/Icon';
import MessageRepliesCountButton from './MessageBubble/MessageRepliesCountButton';
import ChatInput from '@components/ChatContainer/ChatInput';
const CUSTOM_MESSAGE_TYPE = {
  date: 'message.date',
  intro: 'channel.intro',
} as const;

import { 
  MessageErrorIcon, 
  MessageDeleted as DefaultMessageDeleted,
  MessageOptions as DefaultMessageOptions,
  // MessageRepliesCountButton as DefaultMessageRepliesCountButton,
  MessageStatus as DefaultMessageStatus,
  MessageTimestamp as DefaultMessageTimestamp,
  MessageText,
  areMessageUIPropsEqual,
  isMessageBounced,
  isMessageEdited,
  messageHasAttachments,
  messageHasReactions,
  Avatar as DefaultAvatar,
  Attachment as DefaultAttachment,
  EditMessageForm as DefaultEditMessageForm, MessageInput,
  MML,
  Modal,
  Poll,
  ReactionsList as DefaultReactionList,
  useComponentContext,
  MessageContextValue, 
  useMessageContext,
  useChatContext, 
  useTranslationContext,
  MessageUIComponentProps,
  DefaultStreamChatGenerics,
  StreamedMessageText as DefaultStreamedMessageText,
} from 'stream-chat-react';
import { MessageBounceModal } from 'stream-chat-react/dist/components/MessageBounce';
import MessageBubble from './MessageBubble';
import {MessageMetaStyled, MessageFooterBarStyled} from './MessageBubble/style';
import LatestReply from './LatestReply';
import { useSourceComponent } from './SourceComponentContext';

// import { MessageBounceModal } from 'stream-chat-react/dist/components/MessageBounce/MessageBounceModal';
// import { MessageBouncePrompt as DefaultMessageBouncePrompt } from 'stream-chat-react/dist/components/MessageBounce';
// import { CUSTOM_MESSAGE_TYPE } from 'stream-chat-react/dist/constants/messageTypes';
// import { MessageEditedTimestamp } from 'stream-chat-react/dist/components/Message/MessageEditedTimestamp';


const MessageSimpleWithContext = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
>(
  props: MessageContextValue<StreamChatGenerics>,
) => {
  const {
    additionalMessageInputProps,
    clearEditingState,
    editing,
    endOfGroup,
    firstOfGroup,
    groupedByUser,
    handleAction,
    handleOpenThread,
    handleRetry,
    highlighted,
    isMessageAIGenerated,
    isMyMessage,
    message,
    onUserClick,
    onUserHover,
    // renderText,
    threadList,
  } = props;
  const { client, channel } = useChatContext('MessageSimple');
  const {
    MessageDeleted = DefaultMessageDeleted,
  }  = useComponentContext<StreamChatGenerics>('MessageSimple');

  if (!message || message.deleted_at || (message.type === 'deleted')) {
    return null;
    // return <MessageDeleted message={message} />;
  }
 
  const { t } = useTranslationContext('MessageSimple');
  const [isBounceDialogOpen, setIsBounceDialogOpen] = useState(false);
  const [isEditedTimestampOpen, setEditedTimestampOpen] = useState(false);
  const [isActionActive, setIsActionActive] = useState(false);

  const {
    Attachment = DefaultAttachment,
    Avatar = DefaultAvatar,
    // EditMessageInput = DefaultEditMessageForm,
    // MessageOptions = DefaultMessageOptions,
    // TODO: remove this "passthrough" in the next
    // major release and use the new default instead
    // MessageActions = MessageOptions,
    // MessageBouncePrompt = DefaultMessageBouncePrompt,
    // MessageRepliesCountButton = DefaultMessageRepliesCountButton,
    MessageStatus = DefaultMessageStatus,
    MessageTimestamp = DefaultMessageTimestamp,
    ReactionsList = DefaultReactionList,
    StreamedMessageText = DefaultStreamedMessageText,
    PinIndicator,
  } = useComponentContext<StreamChatGenerics>('MessageSimple');
  // const hasAttachment = messageHasAttachments(message);
  // const hasReactions = messageHasReactions(message);
  const isAIGenerated = useMemo(
    () => isMessageAIGenerated?.(message),
    [isMessageAIGenerated, message],
  );

  // Add function for beautiful rendering of mentions
  const renderTextWithMentions = (text: string, mentionedUsers: any[] = []) => {
    if (!mentionedUsers.length) return text;
    const names = mentionedUsers.map(u => u.name).filter(Boolean);
    if (!names.length) return text;
    // Create regex: @Marie Dubois|@Layla Amari|...
    const mentionRegex = new RegExp(`@(${names.map(n => n.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})`, 'g');
    return text.split(mentionRegex).map((part, i) => {
      if (names.includes(part)) {
        return (
          <span className="str-chat__message-mention" key={i}>
            @{part}
          </span>
        );
      }
      return part;
    });
  };
  // Ref for message text container
  const messageTextRef = useRef<HTMLDivElement>(null);
  // Track expanded state for each code block
  const [expandedBlocks, setExpandedBlocks] = useState<{[key: number]: boolean}>({});
  // Track which code blocks are multiline (over 10 lines)
  const [multilineBlocks, setMultilineBlocks] = useState<{[key: number]: boolean}>({});

  // Highlight code blocks after rendering
  useEffect(() => {
    if (messageTextRef.current && !message.deleted_at) {
      messageTextRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [message.text]);

  // After rendering, check which code blocks are over 10 lines
  useEffect(() => {
    if (!messageTextRef.current || !message.deleted_at) return;
    const preBlocks = Array.from(messageTextRef.current.querySelectorAll('pre'));
    const newMultiline: {[key: number]: boolean} = {};
    preBlocks.forEach((pre, idx) => {
      // Count lines: split by \n or count clientRects
      let lineCount = 0;
      const code = pre.querySelector('code');
      if (code) {
        lineCount = (code.textContent || '').split('\n').length;
      } else {
        lineCount = (pre.textContent || '').split('\n').length;
      }
      newMultiline[idx] = lineCount > 10;
    });
    setMultilineBlocks(newMultiline);
  }, [message.text]);

  // Render code blocks with show more/less
  const renderMessageHtmlWithShowMore = () => {
    if (!message.text || !message.text.startsWith('<')) return null;
    // Parse HTML and replace <pre> blocks with React elements
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(`<div>${highlightMentionsInHtml(message.text)}</div>`, 'text/html');
    const nodes: React.ReactNode[] = [];
    let codeBlockIdx = 0;
    function walk(node: Node): React.ReactNode {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'PRE') {
        const pre = node as HTMLElement;
        const code = pre.querySelector('code');
        const isExpanded = !!expandedBlocks[codeBlockIdx];
        const isMultiline = !!multilineBlocks[codeBlockIdx];
        const blockIdx = codeBlockIdx;
        codeBlockIdx++;
        // CSS for 10 lines clamp
        const lineClampStyle = !isExpanded && isMultiline ? {
          display: 'block',
          overflow: 'auto',
          maxHeight: 'calc(1.6em * 10)', // 10 lines, 1.6em line height
          lineHeight: 1.6,
          borderRadius: '6px',
          background: '#f6f8fa',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          padding: '12px',
          fontSize: 15,
          position: 'relative' as React.CSSProperties['position'],
          transition: 'max-height 0.2s',
        } : {
          display: 'block',
          overflow: 'auto',
          borderRadius: '6px',
          background: '#f6f8fa',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          padding: '12px',
          fontSize: 15,
          position: 'relative' as React.CSSProperties['position'],
          lineHeight: 1.6,
        };
        return (
          <div key={`codeblock-${blockIdx}`} style={{ position: 'relative', margin: '8px 0' }}>
            <pre
              style={lineClampStyle}
              dangerouslySetInnerHTML={{ __html: code ? code.outerHTML : pre.innerHTML }}
            />
            {!isExpanded && isMultiline && (
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 48,
                background: 'linear-gradient(to bottom, rgba(246,248,250,0) 0%, #f6f8fa 80%)',
                pointerEvents: 'none',
                borderRadius: '0 0 6px 6px',
              }} />
            )}
            {isMultiline && (
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: 16,
                  bottom: 8,
                  zIndex: 2,
                  background: '#fff',
                  border: '1px solid #d1d5da',
                  borderRadius: 4,
                  padding: '2px 10px',
                  fontSize: 13,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
                onClick={() => setExpandedBlocks(e => ({ ...e, [blockIdx]: !e[blockIdx] }))}
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        );
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        return React.createElement(
          el.tagName.toLowerCase(),
          { key: Math.random(), ...Array.from(el.attributes).reduce((acc, attr) => { acc[attr.name] = attr.value; return acc; }, {} as any) },
          ...Array.from(el.childNodes).map(walk)
        );
      } else if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      return null;
    }
    const root = doc.body.firstChild;
    if (root) {
      nodes.push(walk(root));
    }
    return nodes;
  };


  // Wrap mentions in span for highlighting
  function highlightMentionsInHtml(html: string) {
    if (typeof window === 'undefined' || !window.DOMParser) return html;
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    function walk(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        // Replace only in text nodes
        const mentionRegex = /(@[A-Za-zА-Яа-я0-9_]+(?: [A-Za-zА-Яа-я0-9_]+)?)/g;
        if (mentionRegex.test(node.textContent || '')) {
          const span = doc.createElement('span');
          span.innerHTML = (node.textContent || '').replace(mentionRegex, '<span class="str-chat__message-mention">$1</span>');
          const parent = node.parentNode;
          if (parent) {
            Array.from(span.childNodes).forEach(child => {
              parent.insertBefore(child, node);
            });
            parent.removeChild(node);
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    }
    const root = doc.body.firstChild;
    if (root) walk(root);
    return root ? (root as HTMLElement).innerHTML : html;
  }

  if (message.customType === CUSTOM_MESSAGE_TYPE.date) {
    return null;
  }

  const showMetadata = !groupedByUser || endOfGroup;
  const showReplyCountButton = !threadList && !!message.reply_count && (message.reply_count > message.deleted_reply_count);
  const allowRetry = message.status === 'failed' && message.errorStatusCode !== 403;
  const isBounced = isMessageBounced(message);
  const isEdited = isMessageEdited(message) && !isAIGenerated;

  let handleClick: (() => void) | undefined = undefined;

  if (allowRetry) {
    handleClick = () => handleRetry(message);
  } else if (isBounced) {
    handleClick = () => setIsBounceDialogOpen(true);
  } else if (isEdited) {
    handleClick = () => setEditedTimestampOpen((prev) => !prev);
  }

  const poll = message.poll_id && client.polls.fromState(message.poll_id);

  const [lastReplayAt, setLastReplayAt] = useState(null);
  useEffect(() => {
    let isMounted = true;
    if (message.reply_count > 0 && channel && message.id) {
      channel.getReplies(message.id, { limit: 100 }) // remove sort, take up to 100 replies
        .then(({ messages: replies }) => {
          if (isMounted && replies && replies.length > 0) {
            setLastReplayAt(replies[replies.length - 1].created_at); 
          }
        });
    } else {
      setLastReplayAt(null);
    }
    return () => { isMounted = false; };
  }, [message.id, message.reply_count]);

  return (
    <div>
      
      {/* {isBounceDialogOpen && (
        <MessageBounceModal
          MessageBouncePrompt={MessageBouncePrompt}
          onClose={() => setIsBounceDialogOpen(false)}
          open={isBounceDialogOpen}
        />
      )} */}

      <MessageBubble
        className={clsx({ active: isActionActive })}
        key={message.id}
        isMyMessage = {isMyMessage()}
        user = {{ 
          avatarUrl: message.user.image,
          username: message.user.name || message.user.id,
          isOnline:  message.user.online
        }}
        message={ {
          timestamp: message.created_at,
          reactions:  message.latest_reactions && message.latest_reactions.length > 0 ? message.latest_reactions.map(r => r.type) : [],
        }}
      >

      {editing?  (
            <MessageInput
              clearEditingState={clearEditingState}
              grow
              hideSendButton
              Input={ChatInput}
              message={message}
              {...additionalMessageInputProps}
            />
        ): <>
           {PinIndicator && <PinIndicator />}
          <div>
            {poll && <Poll poll={poll} />}
            {message.attachments?.length && !message.quoted_message ? (
              <Attachment
                actionHandler={handleAction}
                attachments={message.attachments}
              />
            ) : null}
            {/* Render HTML if available (from ProseMirror) */}
            {message.text && message.text.startsWith('<') ? (
              <div
                ref={messageTextRef}
                style={{whiteSpace: 'pre-wrap'}}
              >
                {renderMessageHtmlWithShowMore()}
              </div>
            ) : (
              isAIGenerated ? (
                <StreamedMessageText message={message} renderText={text => renderTextWithMentions(text, message.mentioned_users)} />
              ) : (
                <MessageText message={message} renderText={text => renderTextWithMentions(text, message.mentioned_users)} />
              )
            )}
            {message.mml && (
              <MML
                actionHandler={handleAction}
                align={isMyMessage() ? 'right' : 'left'}
                source={message.mml}
              />
            )}
            {message.status === 'failed' && (
              <MessageErrorIcon />
            )}
          </div>
          <CustomMessageActions isActionActive={isActionActive} onActionActiveChange={setIsActionActive} />
          <MessageFooterBarStyled>
          {showReplyCountButton && (<MessageRepliesCountButton
                  onClick={handleOpenThread}
                  replyCount={(message.reply_count - message.deleted_reply_count)}
                  lastReplayAt={lastReplayAt}
                />
            )}
            {showMetadata && (
              <>
                {/* <MessageStatus /> */}
                {isEdited && (<MessageMetaStyled>{t<string>('Edited')}</MessageMetaStyled>)}
                {/* {isEdited && (
                  <MessageEditedTimestamp calendar open={isEditedTimestampOpen} />
                )} */}
              </>
            )}
          </MessageFooterBarStyled>
        </>
      }
      </MessageBubble>

{/* rest -- */}
      {/* {
        <div className={rootClassName} key={message.id}>
          <div className="str-chat__custom__message-header">
            <div
              className={clsx('str-chat__message-inner', {
                'str-chat__simple-message--error-failed': allowRetry || isBounced,
              })}
              data-testid='message-inner'
              onClick={handleClick}
              onKeyUp={handleClick}
            >
            </div>
          </div>
        </div>
      } */}
      
    </div>
  );
};

const MemoizedMessageSimple = React.memo(
  MessageSimpleWithContext,
  areMessageUIPropsEqual,
) as typeof MessageSimpleWithContext;

/**
 * The default UI component that renders a message and receives functionality and logic from the MessageContext.
 */
const MessageSimple = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
>(
  props: MessageUIComponentProps<StreamChatGenerics> & { sourceComponent?: string }
) => {
  const messageContext = useMessageContext<StreamChatGenerics>('MessageSimple');
  return <>
    <Global styles={codeCss} />
    <MemoizedMessageSimple {...messageContext} {...props} />
  </>;
};

export default MessageSimple