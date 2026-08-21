'use client';

import { useEffect, useState } from 'react';

const DEFAULT_UUID_COUNT = 5;

const createUuids = (quantity: number): string[] =>
  Array.from({ length: quantity }, () => crypto.randomUUID());

export default function UuidGenerator() {
  const [count, setCount] = useState<number>(DEFAULT_UUID_COUNT);
  const [uuids, setUuids] = useState<string[]>([]);
  const [useUppercase, setUseUppercase] = useState<boolean>(false);
  const [removeHyphens, setRemoveHyphens] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setUuids(createUuids(DEFAULT_UUID_COUNT));
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  const generateUuids = () => {
    setUuids(createUuids(count));
  };

  const formatUuid = (uuid: string): string => {
    let result = uuid;
    if (removeHyphens) {
      result = result.replace(/-/g, '');
    }
    if (useUppercase) {
      result = result.toUpperCase();
    }
    return result;
  };

  const formattedUuids = uuids.map(formatUuid);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAllToClipboard = async () => {
    if (formattedUuids.length === 0) return;
    await navigator.clipboard.writeText(formattedUuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const downloadFile = (format: 'txt' | 'json') => {
    if (formattedUuids.length === 0) return;

    let content = '';
    let mimeType = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(formattedUuids, null, 2);
      mimeType = 'application/json';
    } else {
      content = formattedUuids.join('\n');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) =>
                setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))
              }
              className="w-24 p-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>

          <button
            onClick={generateUuids}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Generate New
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useUppercase}
              onChange={(e) => setUseUppercase(e.target.checked)}
              className="rounded border-gray-700 text-blue-600 focus:ring-blue-500 bg-gray-900"
            />
            <span className="text-gray-300">Uppercase</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeHyphens}
              onChange={(e) => setRemoveHyphens(e.target.checked)}
              className="rounded border-gray-700 text-blue-600 focus:ring-blue-500 bg-gray-900"
            />
            <span className="text-gray-300">No Hyphens</span>
          </label>
        </div>
      </div>

      {formattedUuids.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-sm font-medium">
              Generated UUIDs ({formattedUuids.length})
            </label>
            <div className="flex gap-2">
              <button
                onClick={copyAllToClipboard}
                className="px-3 py-1 text-xs bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded transition"
              >
                {copiedAll ? 'Copied All!' : 'Copy All'}
              </button>
              <button
                onClick={() => downloadFile('txt')}
                className="px-3 py-1 text-xs bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded transition"
              >
                .TXT
              </button>
              <button
                onClick={() => downloadFile('json')}
                className="px-3 py-1 text-xs bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded transition"
              >
                .JSON
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {formattedUuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-900 border-gray-700 text-green-400 font-mono text-sm hover:border-gray-600 transition"
              >
                <span className="break-all">{uuid}</span>
                <button
                  onClick={() => copyToClipboard(uuid, index)}
                  className="ml-4 shrink-0 px-3 py-1 text-xs bg-gray-800 text-gray-200 hover:bg-gray-700 rounded border border-gray-700 transition"
                >
                  {copiedIndex === index ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}