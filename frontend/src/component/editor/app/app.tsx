'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';

import { SharedAutocompleteContext } from '../components/editor/context/SharedAutocompleteContext';
import { SettingsContext } from '../components/editor/context/SettingsContext';
import PlaygroundNodes from '../components/editor/nodes/PlaygroundNodes';
import PlaygroundEditorTheme from '../components/editor/themes/PlaygroundEditorTheme';
import { SharedHistoryContext } from '../components/editor/context/SharedHistoryContext';
import { TableContext } from '../components/editor/plugins/TablePlugin';
import Editor from '../components/editor/editor';
import { $generateNodesFromDOM } from '@lexical/html';

import './globals.css';
import type { LexicalEditor as LexicalEditorState } from 'lexical';
import { $createParagraphNode, $getRoot, type EditorState } from 'lexical';

interface LexicalEditorProps {
  onChange?: (
    editorState: EditorState,
    lexicalEditor: LexicalEditorState,
  ) => void;
  content?: string;
  onAutoGenerate?: () => void;
  isGenerating?: boolean;
}

export default function LexicalEditor({
  onChange,
  content,
  onAutoGenerate,
  isGenerating,
}: LexicalEditorProps): JSX.Element {
  const initialConfig = {
    editorState: content ? prepareInitialState : undefined,
    namespace: 'Playground',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  // Function to convert HTML to Lexical editor state
  function prepareInitialState(editor: any) {
    const root = $getRoot();

    if (content) {
      // Parse HTML into DOM nodes
      const parser = new DOMParser();
      const dom = parser.parseFromString(content, 'text/html');

      // Convert DOM nodes to Lexical nodes
      const nodes = $generateNodesFromDOM(editor, dom);

      // Clear editor and insert nodes
      root.clear();
      nodes.forEach((node) => {
        root.append(node);
      });
    }

    // If no content, add a blank paragraph
    if (root.getFirstChild() === null) {
      const paragraph = $createParagraphNode();
      root.append(paragraph);
    }
  }

  return (
    <SettingsContext>
      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>
              <div className='editor-shell'>
                <Editor
                  onChange={onChange}
                  onAutoGenerate={onAutoGenerate}
                  isGenerating={isGenerating}
                  content={content}
                />
              </div>
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </SettingsContext>
  );
}
