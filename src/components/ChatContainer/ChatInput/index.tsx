import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  ChatInputStyled,
  ChatInputInnerStyled,
  IconTextStyled,
  FormatingStyled
} from './ChatInputStyled';
import { useMessageInputContext, useChannelStateContext, useChatContext } from 'stream-chat-react';
import MentionsDropdown from './MentionsDropdown';
import { useCurrentChannelUsers } from '@/hooks/useCurrentChannelUsers';
import CustomEmojiPicker from '@/components/ChatContainer/Messages/CustomEmojiPicker';
import emojiData from '@/assets/emoji/data-by-emoji.json';
// @ts-ignore
import { EditorState } from 'prosemirror-state';
// @ts-ignore
import { EditorView } from 'prosemirror-view';
// @ts-ignore
import { customSchema } from './customSchema';
// @ts-ignore
import { keymap } from 'prosemirror-keymap';
// @ts-ignore
import { baseKeymap, splitBlock } from 'prosemirror-commands';
import 'prosemirror-view/style/prosemirror.css';
// @ts-ignore
import { DOMSerializer } from 'prosemirror-model';
import { ProseMirrorMenuBar } from './ProseMirrorMenuHelpers';
import styled from '@emotion/styled';
import { codeCss } from './codeStyle';
import AddLinkModal from './AddLinkModal';
import { liftListItem, splitListItem } from 'prosemirror-schema-list';
// @ts-ignore
import { CodeMirrorNodeView } from './CodeMirrorBlock';
import PopupModal from './PopupModal';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';

const LANGUAGES = [
  { label: 'Plain Text', value: 'plaintext' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'PHP', value: 'php' },
  { label: 'JSON', value: 'json' },
  { label: 'Markdown', value: 'markdown' },
];

const Placeholder: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        color: '#888',
        pointerEvents: 'none',
        fontSize: 15,
        width: '100%',
        zIndex: 1,
      }}
    >
      Start a conversation
    </div>
    <div style={{ color: '#aaa', fontSize: 13, marginTop: 28, marginLeft: 2, position: 'absolute', left: 0, bottom: 0 }}>
      Tip: Type @ to mention someone
    </div>
  </>
);

const ProseMirrorEditorStyled = styled.div`
  width: 100%;
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
  outline: none;
  padding: 0;
  position: relative;
  z-index: 2;
  .ProseMirror {
    outline: none;
    background: transparent;
    color: inherit;
    font: inherit;
    border: none;
    width: 100%;
    cursor: text;
  }
  p {
    margin-top: 0px;
  }
  a {
   color: rgba(58, 134, 255, 1);
  }
  ${codeCss}
`;

const ChatInput: React.FC = () => {
  const {
    setText,
    isUploadEnabled,
    uploadNewFiles,
    textareaRef,
    attachments,
    removeAttachments,
    text,
    mentioned_users,
    message,
    clearEditingState
  } = useMessageInputContext();
  const {
    thread,
    channel
  } = useChannelStateContext();
  const { client } = useChatContext();


  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const { channelUsers } = useCurrentChannelUsers();
  const [showMentions, setShowMentions] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [mentions, setMentions] = useState<{name: string, id: string, start: number, end: number}[]>([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [languageModalPos, setLanguageModalPos] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('plaintext');
  const [wrapLines, setWrapLines] = useState(true);

  // Callback for nodeView to show language modal
  const handleShowLanguageModal = useCallback((pos: number) => {
    setLanguageModalPos(pos);
    setShowLanguageModal(true);
  }, []);

  // ProseMirror integration
  const editorRef = useRef<HTMLDivElement>(null);
  const pmViewRef = useRef<any>(null);
  const [editorState, setEditorState] = useState<any>(null);


  const handlePMSubmit = useCallback(async () => {
    if (!pmViewRef.current) return;
    const html = getEditorContent();
    if (!html || !html.trim()) return;
   
    if (!channel) return;
    try {
      if (message && message.id) {
        await client.updateMessage({
          ...message,
          text: html,
          attachments: attachments || [],
          mentioned_users: mentions.map(m => m.id),
        });
        if (clearEditingState) {
          clearEditingState();
        }
      } else {
        await channel.sendMessage({
          text: html,
          attachments: attachments || [],
          mentioned_users: mentions.map(m => m.id),
          ...(thread ? { parent_id: thread.id } : {}),
        });
      }
      // Clear editor
      const { state, dispatch } = pmViewRef.current;
      const tr = state.tr.delete(0, state.doc.content.size);
      dispatch(tr);
      setMentions([]);
      if (removeAttachments) removeAttachments(attachments.map((a: any) => a.localMetadata.id));
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }, [attachments, channel, mentions, removeAttachments, message, thread]);


  const customKeymap = useMemo(
    () =>
      keymap({
        'Enter': (state: any, dispatch: any, view: any) => {
          // If selection is inside code_block, let CodeMirror handle Enter
          const { $from } = state.selection;
          for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.name === 'code_block') {
              return false; // Let CodeMirror handle Enter
            }
          }
          handlePMSubmit();
          return true;
        },
        'Shift-Enter': (state: any, dispatch: any, view: any) => {
          const { $from } = state.selection;
          const listItemType = state.schema.nodes.list_item;
          if (
            listItemType &&
            $from.depth > 1 &&
            $from.node($from.depth - 1).type === listItemType
          ) {
            if ($from.parent.content.size === 0) {
              return liftListItem(listItemType)(state, dispatch);
            }
            return splitListItem(listItemType)(state, dispatch);
          }
          return splitBlock(state, dispatch);
        },
      }),
    [handlePMSubmit]
  );

  useEffect(() => {
    if (!editorRef.current) return;
    const schema = customSchema;
    let doc;
    if (text && text.startsWith('<')) {
      // If it's ProseMirror HTML
      const parser = new window.DOMParser();
      const htmlDoc = parser.parseFromString(`<div>${text}</div>`, 'text/html');
      doc = ProseMirrorDOMParser.fromSchema(schema).parse(htmlDoc.body.firstChild);
    } else if (text) {
      // If it's plain text
      doc = schema.node('doc', null, [schema.node('paragraph', null, schema.text(text))]);
    }
    const state = EditorState.create({
      schema,
      doc,
      plugins: [keymap(baseKeymap)]
    });
    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(tr) {
        let newState = view.state.apply(tr);
        // Always ensure a paragraph after code_block or blockquote
        const doc = newState.doc;
        const lastNode = doc.lastChild;
        if (lastNode && (lastNode.type.name === 'code_block' || lastNode.type.name === 'blockquote')) {
          // If not already followed by a paragraph, add one
          const paragraph = newState.schema.nodes.paragraph.create();
          const tr2 = newState.tr.insert(doc.content.size, paragraph);
          newState = newState.apply(tr2);
        }
        view.updateState(newState);
        setEditorState(newState);
        if (channel && typeof channel.keystroke === 'function') {
          channel.keystroke();
        }
        // Mentions logic for ProseMirror
        const { from } = newState.selection;
        const textBefore = newState.doc.textBetween(Math.max(0, from - 50), from, '\u0000', '\u0000');
        const atIdx = textBefore.lastIndexOf('@');
        if (atIdx !== -1) {
          const query = textBefore.slice(atIdx + 1);
          setShowMentions(true);
          setFilteredUsers(
            channelUsers.filter((u: any) =>
              (u.name?.toLowerCase().includes(query.toLowerCase()) ||
                u.id?.toLowerCase().includes(query.toLowerCase())) &&
              u.id !== client.userID
            )
          );
        } else {
          setShowMentions(false);
        }
      },
      attributes: { style: 'min-height:38px; outline:none; background:transparent; color:inherit; font:inherit; border:none; width:100%;' },
      nodeViews: {
        code_block(node, view, getPos) {
          return new CodeMirrorNodeView(node, view, getPos, { onShowLanguageModal: handleShowLanguageModal });
        },
      },
    });
    pmViewRef.current = view;
    setEditorState(state);
    return () => {
      view.destroy();
      pmViewRef.current = null;
    };
  }, [editorRef, text]);


  useEffect(() => {
    if (!pmViewRef.current) return;
    // Update editor plugins while preserving content
    const state = pmViewRef.current.state.reconfigure({
      plugins: [
        customKeymap,
        keymap(baseKeymap),
        // ... other plugins if you have any ...
      ]
    });
    pmViewRef.current.updateState(state);
  }, [handlePMSubmit, channelUsers, client.userID, customKeymap, handleShowLanguageModal]);


  const getEditorContent = () => {
    if (!pmViewRef.current) return '';
    const div = document.createElement('div');
    const serializer = DOMSerializer.fromSchema(pmViewRef.current.state.schema);
    pmViewRef.current.state.doc.content.forEach((node: any) => {
      div.appendChild(serializer.serializeNode(node));
    });
    return div.innerHTML;
  };

  
  const handleMentionSelect = useCallback((user: any) => {
    if (pmViewRef.current) {
      const view = pmViewRef.current;
      const { state, dispatch } = view;
      const { from } = state.selection;
      const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, '\0', '\0');
      const atIdx = textBefore.lastIndexOf('@');
      if (atIdx !== -1) {
        const start = from - (textBefore.length - atIdx);
        const end = from;
        const mentionText = '@' + user.name + ' ';
        const tr = state.tr.insertText(mentionText, start, end);
        dispatch(tr);
        view.focus();
        setMentions(prev => [
          ...prev,
          {
            name: mentionText.trim(),
            id: user.id,
            start,
            end: start + mentionText.length
          }
        ]);
      }
      setShowMentions(false);
    }
  }, []);

  const handleToolbarEmoji = useCallback(() => {
    setShowEmojiPicker(v => !v);
  }, []);

  const handleToolbarMention = useCallback(() => {
    if (pmViewRef.current) {
      pmViewRef.current.focus();
      const { state, dispatch } = pmViewRef.current;
      dispatch(state.tr.insertText('@'));
      setShowMentions(true);
      setFilteredUsers(channelUsers);
    }
  }, [channelUsers]);

  const handleToolbarAttachment = useCallback(() => {
    if (attachmentInputRef.current) {
      attachmentInputRef.current.click();
    }
  }, []);

  const handleEmojiSelect = useCallback((slug: string) => {
    const emojiChar = Object.keys(emojiData).find(
      (key) => (emojiData as any)[key].slug === slug
    );
    if (!emojiChar) {
      setShowEmojiPicker(false);
      return;
    }
    if (pmViewRef.current) {
      const view = pmViewRef.current;
      const { state, dispatch } = view;
      const { from, to } = state.selection;
      const tr = state.tr.insertText(emojiChar, from, to);
      dispatch(tr);
      view.focus();
    } else {
      setText(emojiChar);
    }
    setShowEmojiPicker(false);
  }, [setText]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadNewFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  }, [uploadNewFiles]);

  // Add link mark to selection
  const handleAddLink = useCallback((url: string) => {
    if (pmViewRef.current && url) {
      const view = pmViewRef.current;
      const { state, dispatch } = view;
      const { from, to, empty } = state.selection;
      if (!empty) {
        const tr = state.tr.addMark(from, to, state.schema.marks.link.create({ href: url }));
        dispatch(tr);
      }
      setShowLinkModal(false);
      setTimeout(() => view.focus(), 0);
    }
  }, []);

  // Handle language change from modal
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    if (pmViewRef.current && languageModalPos !== null) {
      const view = pmViewRef.current;
      const node = view.state.doc.nodeAt(languageModalPos);
      if (node) {
        const tr = view.state.tr.setNodeMarkup(languageModalPos, undefined, {
          ...node.attrs,
          language: newLang,
        });
        view.dispatch(tr);
      }
    }
    setShowLanguageModal(false);
    setLanguageModalPos(null);
  };

  // Handler: Toggle wrap lines
  const handleWrapLines = () => {
    setWrapLines((prev) => !prev);
    // Optionally, update CodeMirror extension for wrapping if needed
  };

  // Handler: Copy code block content
  const handleCopyCodeBlock = () => {
    if (pmViewRef.current && languageModalPos !== null) {
      const node = pmViewRef.current.state.doc.nodeAt(languageModalPos);
      if (node) {
        navigator.clipboard.writeText(node.textContent || '');
      }
    }
  };

  // Handler: Delete code block
  const handleDeleteCodeBlock = () => {
    if (pmViewRef.current && languageModalPos !== null) {
      const view = pmViewRef.current;
      const node = view.state.doc.nodeAt(languageModalPos);
      if (node) {
        const tr = view.state.tr.delete(languageModalPos, languageModalPos + node.nodeSize);
        view.dispatch(tr);
      }
    }
    setShowLanguageModal(false);
    setLanguageModalPos(null);
  };

  return (
    <ChatInputStyled ref={inputWrapperRef} style={{ position: 'relative' }}>
      {/* Attachments visualization */}
      {attachments && attachments.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <strong>Attachments:</strong>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {attachments.map((file: any) => (
              <li key={file.localMetadata?.id || file.id} style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
                <span style={{ marginRight: 8 }}>
                  {file.title || file.file?.name || file.name || 'Attachment'}
                </span>
                {removeAttachments && file.localMetadata?.id && (
                  <button
                    type="button"
                    onClick={() => removeAttachments([`${file.localMetadata.id}`])}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f00',
                      cursor: 'pointer',
                      fontSize: 16,
                    }}
                    title="delete"
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ChatInputInnerStyled>
        <IconTextStyled>
          <div style={{ position: 'relative', width: '100%', minHeight: 78 }}>
            {pmViewRef.current && pmViewRef.current.state.doc.textContent.length === 0 && <Placeholder />}
            <ProseMirrorEditorStyled
              ref={editorRef}
              tabIndex={0}
              onClick={() => {
                if (pmViewRef.current) pmViewRef.current.focus();
              }}
            />
          </div>
          <MentionsDropdown
            showMentions={showMentions}
            filteredUsers={filteredUsers}
            onSelect={handleMentionSelect}
          />
        </IconTextStyled>
        <ProseMirrorMenuBar
          key={pmViewRef.current ? 'pmView' : 'noView'}
          view={pmViewRef.current}
          onMention={handleToolbarMention}
          onEmoji={handleToolbarEmoji}
          onAttachment={handleToolbarAttachment}
          emojiButtonRef={emojiButtonRef}
          onLink={() => setShowLinkModal(true)}
          linkButtonRef={linkButtonRef}
        />
        <FormatingStyled>
          <label style={{ cursor: isUploadEnabled ? 'pointer' : 'not-allowed', margin: 0 }}>
            <input
              ref={attachmentInputRef}
              type="file"
              style={{ display: 'none' }}
              disabled={!isUploadEnabled}
              onChange={handleFileChange}
              multiple
            />
          </label>
        </FormatingStyled>
        {showEmojiPicker && (
          <PopupModal open={showEmojiPicker} onClose={() => setShowEmojiPicker(false)} right="0px" triggerRef={emojiButtonRef}>
            <CustomEmojiPicker onSelect={handleEmojiSelect} />
          </PopupModal>
        )}
        {showLinkModal && (
           <PopupModal open={showLinkModal} onClose={() => setShowLinkModal(false)} left="0px" triggerRef={linkButtonRef}>
              <AddLinkModal
                onClose={() => setShowLinkModal(false)}
                onSubmit={handleAddLink}
              />
           </PopupModal>
        )}
      </ChatInputInnerStyled>
      {showLanguageModal && (
        <PopupModal open={showLanguageModal} onClose={() => { setShowLanguageModal(false); setLanguageModalPos(null); }} left="0px">
          <select value={selectedLanguage} onChange={handleLanguageChange} style={{ fontSize: 16, padding: 8, marginRight: "10px" }}>
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
          <div style={{display: 'flex', gap: 8 }}>
            <button title={wrapLines ? 'Don\'t wrap lines' : 'Wrap lines'} onClick={handleWrapLines} style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc', background: wrapLines ? '#e0e0e0' : '#fff' }}>
              {wrapLines ? '⤶' : '➡️'}
            </button>
            <button title="Copy" onClick={handleCopyCodeBlock} style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc', background: '#fff' }}>📋</button>
            <button title="Delete" onClick={handleDeleteCodeBlock} style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', color: '#f00' }}>🗑️</button>
          </div>
        </PopupModal>
      )}
    </ChatInputStyled>
  );
};

export default ChatInput;