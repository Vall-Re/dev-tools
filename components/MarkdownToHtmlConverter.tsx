'use client';

import { useState } from 'react';

export default function MarkdownToHtmlConverter() {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');

  const parseMarkdown = (text: string) => {
    let parsed = text;

    parsed = parsed.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    parsed = parsed.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    parsed = parsed.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/__(.*?)__/g, '<strong>$1</strong>');

    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    parsed = parsed.replace(/_(.*?)_/g, '<em>$1</em>');

    parsed = parsed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    parsed = parsed.replace(/`(.*?)`/g, '<code>$1</code>');

    parsed = parsed.replace(/^\s*\n\*/gm, '<ul>\n*');
    parsed = parsed.replace(/^(\* .*)\n\s*$/gm, '$1\n</ul>');
    parsed = parsed.replace(/^\* (.*$)/gim, '  <li>$1</li>');

    parsed = parsed.replace(/\n\n/g, '<br /><br />');

    return parsed.trim();
  };

  const handleConvert = () => {
    if (!markdown.trim()) return;
    setHtml(parseMarkdown(markdown));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input Markdown</label>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="# Hello World&#10;&#10;This is **bold** and *italic* text with a [link](https://example.com)."
          className="w-full h-40 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleConvert}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Convert to HTML
      </button>

      {html && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">HTML Code Output</label>
            <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
              {html}
            </pre>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rendered Preview</label>
            <div
              className="p-4 border rounded-lg bg-white prose max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      )}
    </div>
  );
}