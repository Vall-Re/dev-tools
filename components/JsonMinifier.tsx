'use client';

import { useState } from 'react';

export default function JsonMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const minifyJson = () => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input JSON</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{\n  "name": "John",\n  "age": 30\n}'
          className="w-full h-40 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={minifyJson}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Minify JSON
      </button>

      {error && (
        <div className="p-3 border rounded-lg bg-red-50 text-red-600 font-mono text-sm">
          {error}
        </div>
      )}

      {output && (
        <div>
          <label className="block text-sm font-medium mb-2">Minified JSON Output</label>
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}