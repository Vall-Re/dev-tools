'use client';

import { useState } from 'react';

export default function HtmlEntityConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encodeHtml = () => {
    if (!input) return;
    const encoded = input.replace(/[\u00A0-\u9999<>&"]/g, (i) => `&#${i.charCodeAt(0)};`);
    setOutput(encoded);
  };

  const decodeHtml = () => {
    if (!input) return;
    const doc = new DOMParser().parseFromString(input, 'text/html');
    setOutput(doc.body.textContent || '');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input HTML or Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text or HTML entities here..."
          className="w-full h-32 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={encodeHtml}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Encode
        </button>
        <button
          onClick={decodeHtml}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Decode
        </button>
      </div>

      {output && (
        <div>
          <label className="block text-sm font-medium mb-2">Result</label>
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}