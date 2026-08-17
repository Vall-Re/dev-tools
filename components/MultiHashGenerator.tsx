'use client';

import { useState } from 'react';

export default function MultiHashGenerator() {
  const [text, setText] = useState('');
  const [sha1Hash, setSha1Hash] = useState('');
  const [sha512Hash, setSha512Hash] = useState('');

  const generateHashes = async () => {
    if (!text) {
      setSha1Hash('');
      setSha512Hash('');
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const hash1Buffer = await crypto.subtle.digest('SHA-1', data);
    const hash1Array = Array.from(new Uint8Array(hash1Buffer));
    setSha1Hash(hash1Array.map((b) => b.toString(16).padStart(2, '0')).join(''));

    const hash512Buffer = await crypto.subtle.digest('SHA-512', data);
    const hash512Array = Array.from(new Uint8Array(hash512Buffer));
    setSha512Hash(hash512Array.map((b) => b.toString(16).padStart(2, '0')).join(''));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter string to generate SHA-1 and SHA-512 hashes..."
          className="w-full h-32 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={generateHashes}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Generate Hashes
      </button>

      {sha1Hash && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">SHA-1 Hash</label>
            <div className="p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm break-all">
              {sha1Hash}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SHA-512 Hash</label>
            <div className="p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm break-all">
              {sha512Hash}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}