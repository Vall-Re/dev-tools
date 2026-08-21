'use client';

import { useEffect, useState } from 'react';

export default function Sha256Generator() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [isUppercase, setIsUppercase] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input) return;

    let cancelled = false;

    const calculateHash = async () => {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        if (!cancelled) {
          setHash(hashHex);
        }
      } catch (error) {
        console.error('Error calculating SHA-256 hash:', error);
      }
    };

    calculateHash();

    return () => {
      cancelled = true;
    };
  }, [input]);

  const handleCopy = async () => {
    if (!hash) return;
    const finalHash = isUppercase ? hash.toUpperCase() : hash;
    await navigator.clipboard.writeText(finalHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const byteLength = new TextEncoder().encode(input).length;
  const displayHash = isUppercase ? hash.toUpperCase() : hash;

  return (
    <div className="space-y-6 text-gray-100">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Input Text</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none text-gray-300">
              <input
                type="checkbox"
                checked={isUppercase}
                onChange={(e) => setIsUppercase(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 bg-gray-900 border-gray-700"
              />
              UPPERCASE Output
            </label>
            {input && (
              <button
                onClick={() => {
                  setInput('');
                  setHash('');
                }}
                className="text-xs text-red-400 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to generate SHA-256 hash automatically..."
          className="w-full h-32 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 border-gray-700 text-gray-100"
        />

        <div className="flex gap-3 text-xs text-gray-400">
          <span>{input.length} Characters</span>
          <span>•</span>
          <span>{byteLength} Bytes (UTF-8)</span>
        </div>
      </div>

      {hash && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">SHA-256 Output</label>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition font-medium"
            >
              {copied ? 'Copied!' : 'Copy Hash'}
            </button>
          </div>
          <div className="p-3 border rounded-lg bg-gray-900 border-gray-700 text-green-400 font-mono text-sm break-all select-all">
            {displayHash}
          </div>
        </div>
      )}
    </div>
  );
}