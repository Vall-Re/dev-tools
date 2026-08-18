'use client';

import { useState } from 'react';

export default function HtmlEntityConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [encodeAll, setEncodeAll] = useState(false);

  const sampleHtml = `<div class="container">
  <h1>Hello & Welcome!</h1>
  <p>Price: 100 € & special character: "quotes" 'single'</p>
</div>`;

  const encodeHtml = () => {
    if (!input) return;
    let encoded = '';
    if (encodeAll) {
      encoded = input.replace(/[\s\S]/g, (char) => {
        const code = char.charCodeAt(0);
        return code > 127 || ['<', '>', '&', '"', "'"].includes(char)
          ? `&#${code};`
          : char;
      });
    } else {
      encoded = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    setOutput(encoded);
  };

  const decodeHtml = () => {
    if (!input) return;
    const textarea = document.createElement('textarea');
    textarea.innerHTML = input;
    setOutput(textarea.value);
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
        <label className="block text-sm font-medium">Input Text / HTML Entities</label>
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
        placeholder="Enter text or HTML entities here..."
        className="w-full h-36 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={encodeHtml}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Encode
          </button>
          <button
            onClick={decodeHtml}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
          >
            Decode
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={encodeAll}
            onChange={(e) => setEncodeAll(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          Encode non-ASCII characters
        </label>
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