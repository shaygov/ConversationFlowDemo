// @ts-ignore
import { EditorView as PMEditorView, NodeView } from 'prosemirror-view';
// @ts-ignore
import { EditorState, Transaction } from 'prosemirror-state';
// @ts-ignore
import { EditorView, basicSetup } from 'codemirror';
// @ts-ignore
import { javascript } from '@codemirror/lang-javascript';
// @ts-ignore
import { python } from '@codemirror/lang-python';
// @ts-ignore
import { php } from '@codemirror/lang-php';
// @ts-ignore
import { json } from '@codemirror/lang-json';
// @ts-ignore
import { markdown } from '@codemirror/lang-markdown';
// @ts-ignore
import { Compartment } from '@codemirror/state';

const LANGUAGES = [
  { label: 'Plain Text', value: 'plaintext', extension: null },
  { label: 'JavaScript', value: 'javascript', extension: javascript() },
  { label: 'Python', value: 'python', extension: python() },
  { label: 'PHP', value: 'php', extension: php() },
  { label: 'JSON', value: 'json', extension: json() },
  { label: 'Markdown', value: 'markdown', extension: markdown() },
];

export class CodeMirrorNodeView implements NodeView {
  dom: HTMLElement;
  codeMirror: EditorView | null = null;
  updating = false;
  currentLanguage: string;
  languageCompartment: any;
  onShowLanguageModal?: (pos: number) => void;

  constructor(node: any, view: PMEditorView, getPos: () => number, options?: { onShowLanguageModal?: (pos: number) => void }) {
    this.dom = document.createElement('div');
    this.dom.style.border = '1px solid #eee';
    this.dom.style.borderRadius = '4px';
    this.dom.style.overflow = 'auto';
    this.dom.style.maxHeight = '200px'; // Scrollbar
    this.dom.style.background = '#fafafa';
    this.dom.style.fontSize = '14px';
    this.dom.style.margin = '4px 0';
    this.dom.style.padding = '4px 0 0 0';
    this.dom.style.color = 'black'; // Make text black

    this.currentLanguage = node.attrs.language || 'plaintext';
    this.languageCompartment = new Compartment();
    this.onShowLanguageModal = options?.onShowLanguageModal;

    // Show language modal on focus/click
    this.dom.addEventListener('focusin', () => {
      if (this.onShowLanguageModal) {
        this.onShowLanguageModal(getPos());
      }
    });
    this.dom.addEventListener('click', () => {
      if (this.onShowLanguageModal) {
        this.onShowLanguageModal(getPos());
      }
    });

    // Prevent ProseMirror from stealing focus when clicking inside CodeMirror
    ['mousedown', 'mouseup', 'click'].forEach(eventName => {
      this.dom.addEventListener(eventName, (e) => {
        e.stopPropagation();
        if (eventName === 'mousedown') {
          setTimeout(() => {
            this.codeMirror && this.codeMirror.focus();
          }, 0);
        }
      });
    });

    // CodeMirror instance
    this.codeMirror = new EditorView({
      doc: node.textContent,
      extensions: [
        basicSetup,
        this.languageCompartment.of(this.getLanguageExtension(this.currentLanguage)),
        EditorView.updateListener.of((update: any) => {
          if (update.docChanged && !this.updating) {
            const text = update.state.doc.toString();
            const pos = getPos();
            const pmNode = view.state.doc.nodeAt(pos);
            const pmText = pmNode?.textContent || '';
            const pmType = pmNode?.type;
            const pmAttrs = pmNode?.attrs;
            if (pmText !== text && pmType && pmAttrs) {
              // Only update text if type and attrs are unchanged
              const tr = view.state.tr.insertText(
                text,
                pos + 1,
                pos + 1 + pmText.length
              );
              view.dispatch(tr);
            }
          }
        }),
      ].filter(Boolean),
      parent: this.dom,
    });
  }

  getLanguageExtension(language: string): any {
    const found = LANGUAGES.find(l => l.value === language);
    return found && found.extension ? found.extension : [];
  }

  updateCodeMirrorLanguage(language: string) {
    if (!this.codeMirror) return;
    const ext = this.getLanguageExtension(language);
    this.codeMirror.dispatch({
      effects: this.languageCompartment.reconfigure(ext)
    });
    this.currentLanguage = language;
  }

  update(node: any) {
    // Remove selectEl logic, only update CodeMirror content and language
    if (this.codeMirror) {
      this.updating = true;
      if (this.currentLanguage !== node.attrs.language) {
        this.updateCodeMirrorLanguage(node.attrs.language);
      }
      if (this.codeMirror.state.doc.toString() !== node.textContent) {
        this.codeMirror.dispatch({
          changes: {
            from: 0,
            to: this.codeMirror.state.doc.length,
            insert: node.textContent,
          },
        });
      }
      this.updating = false;
    }
    return true;
  }

  selectNode() {
    this.dom.classList.add('ProseMirror-selectednode');
  }
  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode');
  }
  destroy() {
    if (this.codeMirror) this.codeMirror.destroy();
  }
} 