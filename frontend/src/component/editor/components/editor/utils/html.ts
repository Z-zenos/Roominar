import { $generateNodesFromDOM, $generateHtmlFromNodes } from '@lexical/html';
import { $getRoot } from 'lexical';
import type { LexicalEditor } from 'lexical';

export function importHTML(editor: LexicalEditor, html: string): void {
  editor.update(() => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);

    const root = $getRoot();
    root.clear();
    nodes.forEach((node) => root.append(node));
  });
}

export function exportHTML(editor: LexicalEditor): string {
  let html = '';

  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor, null);
  });

  return html;
}
