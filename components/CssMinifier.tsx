'use client';

import { useState } from 'react';

export default function CssMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const minifyCss = () => {
    if (!input) return;
    const minified = input
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around symbols
      .replace(/;\}/g, '}') // Remove last semicolon before closing brace
      .trim();
    setOutput(minified);
  };

  const unminifyCss = () => {
    if (!input) return;
    const unminified = input
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/\s*;\s*/g, ';\n  ')
      .replace(/\s*\}\s*/g, '\n}\n\n')
      .replace(/\n  \n/g, '\n')
      .trim();
    setOutput(unminified);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input CSS</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your CSS code here..."
          className="w-full h-40 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={minifyCss}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Minify CSS
        </button>
        <button
          onClick={unminifyCss}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Format / Unminify
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