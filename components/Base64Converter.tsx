'use client';

import { useState } from 'react';

export default function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const sampleText = 'Hello World! Вітаємо у 100DevToolsHub 🚀';

  // UTF-8 Safe Base64 Encoding
  const encodeBase64 = () => {
    try {
      if (!input.trim()) return;
      const bytes = new TextEncoder().encode(input);
      const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
      setOutput(btoa(binString));
      setError('');
    } catch (err: unknown) {
      setError('Failed to encode: ' + (err as Error).message);
      setOutput('');
    }
  };

  // UTF-8 Safe Base64 Decoding
  const decodeBase64 = () => {
    try {
      if (!input.trim()) return;
      const binString = atob(input.trim());
      const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
      setOutput(new TextDecoder().decode(bytes));
      setError('');
    } catch (err: unknown) {
      setError('Invalid Base64 string format. Ensure the input is a valid Base64 payload.');
      setOutput('');
    }
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
    setError('');
  };

  const handleLoadSample = () => {
    setInput(sampleText);
    setError('');
  };

  return (
    <div className="space-y-4 text-gray-100">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Input Text or Base64</label>
        <div className="flex gap-2 text-xs">
          <button
            onClick={handleLoadSample}
            className="text-blue-400 hover:underline"
          >
            Load Sample
          </button>
          <span>|</span>
          <button
            onClick={handleClear}
            className="text-gray-400 hover:underline"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text or Base64 encoded string here..."
        className="w-full h-32 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 border-gray-700 text-gray-100"
      />

      <div className="flex gap-2">
        <button
          onClick={encodeBase64}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Encode to Base64
        </button>
        <button
          onClick={decodeBase64}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm font-medium"
        >
          Decode from Base64
        </button>
      </div>

      {error && (
        <div className="p-3 border border-red-800 bg-red-950 text-red-300 rounded-lg text-sm font-mono">
          <strong>Error:</strong> {error}
        </div>
      )}

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
          <pre className="w-full p-3 border rounded-lg bg-gray-900 border-gray-700 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all max-h-96">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}