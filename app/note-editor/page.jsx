'use client';
import Editor from '../components/editor';
import MarkdownViewer from '../components/markdownViewer';
import { useState } from 'react';

export default function NoteEditor() {
  const [markdown, setMarkdown] = useState(`# Hello Markdown`);

  return (
    <main className="h-screen flex">
      <div className="w-1/2 p-4 border-r">
        <Editor value={markdown} onChange={setMarkdown} />
      </div>
      <div className="w-1/2 p-4 overflow-auto">
    <MarkdownViewer content={markdown} />
      </div>
    </main>
  );
}
