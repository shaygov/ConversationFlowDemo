import React from 'react';
// @ts-ignore
import { toggleMark, setBlockType, wrapIn, lift, chainCommands, exitCode, joinUp, joinDown, liftEmptyBlock, splitBlock } from 'prosemirror-commands';
// @ts-ignore
import { undo, redo } from 'prosemirror-history';
// @ts-ignore
import { EditorView } from 'prosemirror-view';
// @ts-ignore
import { Schema } from 'prosemirror-model';
// @ts-ignore
import { toggleList } from './toggleList';
import Icon from '@/libs/components/widgets/Icon/Icon';
import styled from '@emotion/styled';

// SVG/Unicode icons for the buttons
const icons = {
  bold: <b>B</b>,
  italic: <i>I</i>,
  underline: <u>U</u>,
  strikethrough: <s>S</s>,
  code: <span>{'<>'}</span>,
  quote: <span>“”</span>,
  ol: <span>1.</span>,
  ul: <span>•</span>,
  table: <span style={{fontWeight: 'bold', fontSize: 15}}>🗔</span>,
  undo: <span>&#8634;</span>,
  redo: <span>&#8635;</span>,
  link: <Icon className="icon" name="formatting-link" size="S"  color="#ffff"/>,
  mention: <Icon className="icon" name="formatting-mail" size="S"  color="#fff"/>,
  emoji: <Icon className="icon" name="formatting-smile" size="S"  color="#fff"/>,
  attachment: <Icon className="icon" name="formatting-attachment" size="S"  color="#fff"/>,
};

// MenuItem type
interface MenuItem {
  icon: React.ReactNode;
  title: string;
  command: (view: EditorView) => void;
  isActive?: (view: EditorView) => boolean;
}

// Menu items
export const getMenuItems = (schema: Schema): MenuItem[] => [
  // 1. Bold
  {
    icon: icons.bold,
    title: 'Bold',
    command: (view) => toggleMark(schema.marks.strong)(view.state, view.dispatch),
    isActive: (view) => !!schema.marks.strong && isMarkActive(view, schema.marks.strong),
  },
  // 2. Italic
  {
    icon: icons.italic,
    title: 'Italic',
    command: (view) => toggleMark(schema.marks.em)(view.state, view.dispatch),
    isActive: (view) => !!schema.marks.em && isMarkActive(view, schema.marks.em),
  },
  // 3. Underline
  {
    icon: icons.underline,
    title: 'Underline',
    command: (view) => schema.marks.underline ? toggleMark(schema.marks.underline)(view.state, view.dispatch) : undefined,
    isActive: (view) => !!schema.marks.underline && isMarkActive(view, schema.marks.underline),
  },
  // 4. Strikethrough
  {
    icon: icons.strikethrough,
    title: 'Strikethrough',
    command: (view) => schema.marks.strikethrough ? toggleMark(schema.marks.strikethrough)(view.state, view.dispatch) : undefined,
    isActive: (view) => !!schema.marks.strikethrough && isMarkActive(view, schema.marks.strikethrough),
  },
  // 5. Code
  {
    icon: icons.code,
    title: 'Code',
    command: (view) => toggleMark(schema.marks.code)(view.state, view.dispatch),
    isActive: (view) => !!schema.marks.code && isMarkActive(view, schema.marks.code),
  },
  // 6. Link
  {
    icon: icons.link,
    title: 'Link',
    command: (view) => alert('Link button clicked!'), // TODO: add link logic
  },
  // 7. Ordered List
  {
    icon: icons.ol,
    title: 'Ordered List',
    command: (view) => toggleList(schema.nodes.ordered_list, schema.nodes.list_item)(view.state, view.dispatch),
    isActive: (view) => isNodeActive(view, schema.nodes.ordered_list),
  },
  // 8. Bullet List
  {
    icon: icons.ul,
    title: 'Bullet List',
    command: (view) => toggleList(schema.nodes.bullet_list, schema.nodes.list_item)(view.state, view.dispatch),
    isActive: (view) => isNodeActive(view, schema.nodes.bullet_list),
  },
  // 9. Blockquote
  {
    icon: icons.quote,
    title: 'Blockquote',
    command: (view) => {
      const { state, dispatch } = view;
      const { schema } = state;
      const { $from } = state.selection;
      let inBlockquote = false;
      for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type === schema.nodes.blockquote) {
          inBlockquote = true;
          break;
        }
      }
      if (inBlockquote) {
        return lift(state, dispatch);
      } else {
        return wrapIn(schema.nodes.blockquote)(state, dispatch);
      }
    },
    isActive: (view) => isNodeActive(view, schema.nodes.blockquote),
  },
  // 10. Code Block (instead of Table)
  {
    icon: <span style={{fontWeight: 'bold', fontSize: 15}}>{'{ }'}</span>,
    title: 'Code Block',
    command: (view) => setBlockType(schema.nodes.code_block)(view.state, view.dispatch),
    isActive: (view) => isNodeActive(view, schema.nodes.code_block),
  },
  // Right group (Mention, Emoji, Attachment) remain as they are
  {
    icon: icons.mention,
    title: 'Mention',
    command: (view) => {
      alert('Mention button clicked!');
      view.focus();
    },
  },
  {
    icon: icons.emoji,
    title: 'Emoji',
    command: () => {}, // no-op, use onEmoji prop in toolbar
  },
  {
    icon: icons.attachment,
    title: 'Attachment',
    command: (view) => {
      alert('Attachment button clicked!');
      view.focus();
    },
  },
];

// Helpers
function isMarkActive(view: EditorView, markType: any) {
  const { from, $from, to, empty } = view.state.selection;
  if (empty) {
    return !!markType.isInSet(view.state.storedMarks || $from.marks());
  } else {
    return view.state.doc.rangeHasMark(from, to, markType);
  }
}

function isNodeActive(view: EditorView, nodeType: any) {
  const { $from, to, node } = view.state.selection as any;
  if (node) {
    return node.hasMarkup(nodeType);
  }
  return to <= $from.end() && $from.parent.hasMarkup(nodeType);
}

// Toolbar React component
interface ProseMirrorMenuBarProps {
  view: EditorView | null;
  onMention?: () => void;
  onEmoji?: () => void;
  onAttachment?: () => void;
  emojiButtonRef?: React.Ref<HTMLButtonElement>;
  onLink?: () => void;
  linkButtonRef?: React.Ref<HTMLButtonElement>;
}

// Shared button style for toolbar buttons
const ToolbarButton = styled.button<{
  active?: boolean;
  disabled?: boolean;
}>`
  background: none;
  border: none;
  padding: 4px;
  margin: 0;
  cursor: ${({disabled}) => disabled ? 'not-allowed' : 'pointer'};
  font-weight: bold;
  font-size: 16px;
  color: #fff;
  outline: none;
  opacity: ${({active}) => active ? 1 : 0.5};
`;

export const ProseMirrorMenuBar: React.FC<ProseMirrorMenuBarProps> = ({ view, onMention, onEmoji, onAttachment, emojiButtonRef, onLink, linkButtonRef }) => {
  if (!view) return null;
  const schema = view.state.schema;
  const items = getMenuItems(schema);

  // Split the buttons into two groups
  const rightGroupTitles = ['Mention', 'Emoji', 'Attachment'];
  const mainItems = items.filter(item => !rightGroupTitles.includes(item.title));
  const rightItems = items.filter(item => rightGroupTitles.includes(item.title));

  return (
    <div style={{ display: 'flex', width: "100%", padding: '4px 8px', gap: 8 }}>
      {/* Main buttons */}
      <div style={{ display: 'flex', gap: 8, flexGrow: 1 }}>
        {mainItems.map((item, i) => {
          if (item.title === 'Link' && onLink) {
            const { from, to, empty } = view.state.selection;
            const isDisabled = empty || from === to;
            return (
              <ToolbarButton
                key={i}
                type="button"
                title={item.title}
                disabled={isDisabled}
                ref={linkButtonRef}
                active={item.isActive && item.isActive(view)}
                onMouseDown={e => {
                  e.preventDefault();
                  if (!isDisabled) {
                    onLink();
                    view.focus();
                  }
                }}
              >
                {item.icon}
              </ToolbarButton>
            );
          }
          return (
            <ToolbarButton
              key={i}
              type="button"
              title={item.title}
              active={item.isActive && item.isActive(view)}
              onMouseDown={e => {
                e.preventDefault();
                item.command(view);
                view.focus();
              }}
            >
              {item.icon}
            </ToolbarButton>
          );
        })}
      </div>
      {/* Right group buttons */}
      <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
        {rightItems.map((item, i) => {
          if (item.title === 'Mention' && onMention) {
            return (
              <ToolbarButton
                key={item.title}
                type="button"
                title={item.title}
                active={item.isActive && item.isActive(view)}
                onMouseDown={e => {
                  e.preventDefault();
                  onMention();
                  view.focus();
                }}
              >
                {item.icon}
              </ToolbarButton>
            );
          }
          if (item.title === 'Emoji' && onEmoji) {
            return (
              <ToolbarButton
                key={item.title}
                type="button"
                title={item.title}
                ref={emojiButtonRef}
                active={item.isActive && item.isActive(view)}
                onMouseDown={e => {
                  e.preventDefault();
                  onEmoji();
                  view.focus(); // Removed to prevent closing the emoji picker immediately
                }}
              >
                {item.icon}
              </ToolbarButton>
            );
          }
          if (item.title === 'Attachment' && onAttachment) {
            return (
              <ToolbarButton
                key={item.title}
                type="button"
                title={item.title}
                active={item.isActive && item.isActive(view)}
                onMouseDown={e => {
                  e.preventDefault();
                  onAttachment();
                  view.focus();
                }}
              >
                {item.icon}
              </ToolbarButton>
            );
          }
          // fallback (if there is no prop function)
          return (
            <ToolbarButton
              key={item.title}
              type="button"
              title={item.title}
              active={item.isActive && item.isActive(view)}
              onMouseDown={e => {
                e.preventDefault();
                item.command(view);
                view.focus();
              }}
            >
              {item.icon}
            </ToolbarButton>
          );
        })}
      </div>
    </div>
  );
}; 