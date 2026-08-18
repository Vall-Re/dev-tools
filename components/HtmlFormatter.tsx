'use client';

import { useState } from 'react';

export default function HtmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState<number>(2);

  const sampleHtml = `<div className="container"><h1>Hello World</h1><p>This is a paragraph with <a href="#">a link</a> inside.</p><ul><li>Item 1</li><li>Item 2</li></ul></div>`;

  const formatHtml = () => {
    if (!input.trim()) return;

    let formatted = '';
    let indent = 0;
    const tab = ' '.repeat(indentSize);

    const tokens = input
      .replace(/>\s*</g, '><')
      .replace(/</g, '\n<')
      .split('\n')
      .filter((line) => line.trim().length > 0);

    tokens.forEach((token) => {
      if (token.startsWith('</')) {
        indent = Math.max(0, indent - 1);
        formatted += tab.repeat(indent) + token + '\n';
      } else if (
        token.startsWith('<') &&
        !token.startsWith('<?') &&
        !token.startsWith('<!') &&
        !token.endsWith('/>')
      ) {
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

  const minifyHtml = () => {
    if (!input.trim()) return;
    const minified = input
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();
    setOutput(minified);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleLoadSample = () => {
    setInput(sampleHtml);
    setOutput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Input Raw HTML</label>
        <div className="flex gap-2 text-xs">
          <button
            onClick={handleLoadSample}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Load Sample
          </button>
          <span>|</span>
          <button
            onClick={handleClear}
            className="text-gray-500 hover:underline dark:text-gray-400"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="<div><h1>Title</h1><p>Paragraph text</p></div>"
        className="w-full h-36 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={formatHtml}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Format HTML
          </button>
          <button
            onClick={minifyHtml}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
          >
            Minify HTML
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="text-gray-700 dark:text-gray-300">Indent Spaces:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="p-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
          </select>
        </div>
      </div>

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">Result</label>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition font-medium"
            >
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </div>
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all max-h-96">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}