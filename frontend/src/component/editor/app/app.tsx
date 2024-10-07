'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';

import { SharedAutocompleteContext } from '../components/editor/context/SharedAutocompleteContext';
import {
  SettingsContext,
  useSettings,
} from '../components/editor/context/SettingsContext';
import { getPrepopulatedRichText } from '../components/editor/utils/getPrepopulatedRichText';
import PlaygroundNodes from '../components/editor/nodes/PlaygroundNodes';
import PlaygroundEditorTheme from '../components/editor/themes/PlaygroundEditorTheme';
import { SharedHistoryContext } from '../components/editor/context/SharedHistoryContext';
import { TableContext } from '../components/editor/plugins/TablePlugin';
import Editor from '../components/editor/editor';

import './globals.css';

export default function LexicalEditor(): JSX.Element {
  const {
    settings: { emptyEditor },
  } = useSettings();

  const initialConfig = {
    editorState: emptyEditor ? undefined : getPrepopulatedRichText,
    namespace: 'Playground',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <SettingsContext>
      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>
              <div className='editor-shell'>
                <Editor />
              </div>
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </SettingsContext>
  );
}
