'use client';

import { useState, useEffect, useCallback } from 'react';

type HashState = {
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
};

export default function MultiHashGenerator() {
  const [text, setText] = useState('');
  const [isUppercase, setIsUppercase] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hashes, setHashes] = useState<HashState>({
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: '',
  });

  const calculateHashes = useCallback(async (inputText: string) => {
    if (!inputText) {
      setHashes({ sha1: '', sha256: '', sha384: '', sha512: '' });
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(inputText);

    const hashAlgo = async (algorithm: string) => {
      const buffer = await crypto.subtle.digest(algorithm, data);
      const array = Array.from(new Uint8Array(buffer));
      return array.map((b) => b.toString(16).padStart(2, '0')).join('');
    };

    try {
      const [sha1, sha256, sha384, sha512] = await Promise.all([
        hashAlgo('SHA-1'),
        hashAlgo('SHA-256'),
        hashAlgo('SHA-384'),
        hashAlgo('SHA-512'),
      ]);

      setHashes({ sha1, sha256, sha384, sha512 });
    } catch (error) {
      console.error('Error generating hashes:', error);
    }
  }, []);

  useEffect(() => {
    calculateHashes(text);
  }, [text, calculateHashes]);

  const handleCopy = async (hashValue: string, key: string) => {
    if (!hashValue) return;
    const finalValue = isUppercase ? hashValue.toUpperCase() : hashValue;
    await navigator.clipboard.writeText(finalValue);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const hashList = [
    { label: 'SHA-1', value: hashes.sha1, key: 'sha1' },
    { label: 'SHA-256', value: hashes.sha256, key: 'sha256' },
    { label: 'SHA-384', value: hashes.sha384, key: 'sha384' },
    { label: 'SHA-512', value: hashes.sha512, key: 'sha512' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Input Text</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isUppercase}
                onChange={(e) => setIsUppercase(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              UPPERCASE Output
            </label>
            {text && (
              <button
                onClick={() => setText('')}
                className="text-xs text-red-500 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste string to generate hashes in real time..."
          className="w-full h-32 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      {hashes.sha1 && (
        <div className="space-y-4">
          {hashList.map(({ label, value, key }) => {
            const displayValue = isUppercase ? value.toUpperCase() : value;
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                  <button
                    onClick={() => handleCopy(value, key)}
                    className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition font-medium"
                  >
                    {copiedKey === key ? 'Copied!' : 'Copy Hash'}
                  </button>
                </div>
                <div className="p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm break-all select-all dark:border-gray-800">
                  {displayValue}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}