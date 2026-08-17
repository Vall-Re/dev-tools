'use client';

import { useState } from 'react';

export default function HtmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const formatHtml = () => {
    if (!input.trim()) return;

    let formatted = '';
    let indent = 0;
    const tab = '  ';

    const tokens = input
      .replace(/>\s*</g, '><')
      .replace(/</g, '\n<')
      .split('\n')
      .filter((line) => line.trim().length > 0);

    tokens.forEach((token) => {
      if (token.startsWith('</')) {
        indent = Math.max(0, indent - 1);
        formatted += tab.repeat(indent) + token + '\n';
      } else if (token.startsWith('<') && !token.startsWith('<?') && !token.startsWith('<!') && !token.endsWith('/>')) {
        formatted += tab.repeat(indent) + token + '\n';
        const isSelfClosing = /<(img|input|br|hr|meta|link|col|base|area|embed|source|track|wbr)/i.test(token);
        if (!isSelfClosing) {
          indent += 1;
        }
      } else {
        formatted += tab.repeat(indent) + token + '\n';
      }
    });

    setOutput(formatted.trim());
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input Raw HTML</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<div><h1>Title</h1><p>Paragraph text</p></div>"
          className="w-full h-36 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={formatHtml}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Format HTML
      </button>

      {output && (
        <div>
          <label className="block text-sm font-medium mb-2">Formatted HTML</label>
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}