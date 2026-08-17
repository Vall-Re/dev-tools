'use client';

import { useState } from 'react';

export default function JsMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const minifyJs = () => {
    if (!input) return;
    const minified = input
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/\/\/.*/g, '') // Remove single-line comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*([={};(),+-/*])\s*/g, '$1') // Remove spaces around operators
      .trim();
    setOutput(minified);
  };

  const formatJs = () => {
    if (!input) return;
    const formatted = input
      .replace(/\s*;\s*/g, ';\n')
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/\s*\}\s*/g, '\n}\n');
    setOutput(formatted);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input JavaScript Code</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JS code here..."
          className="w-full h-40 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={minifyJs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Minify JS
        </button>
        <button
          onClick={formatJs}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Basic Format
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