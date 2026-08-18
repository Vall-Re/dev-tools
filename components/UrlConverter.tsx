'use client';

import { useState, useMemo } from 'react';

type Mode = 'encodeComponent' | 'encodeURI' | 'decode';

export default function UrlConverter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('encodeComponent');
  const [copied, setCopied] = useState(false);

  const { output, error, queryParams } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: '', queryParams: [] };
    }

    try {
      let result = '';
      if (mode === 'encodeComponent') {
        result = encodeURIComponent(input);
      } else if (mode === 'encodeURI') {
        result = encodeURI(input);
      } else {
        result = decodeURIComponent(input);
      }

      const params: { key: string; value: string }[] = [];
      const textToParse = mode === 'decode' ? result : input;

      try {
        const urlObj = new URL(
          textToParse.startsWith('http') ? textToParse : `https://dummy.com/${textToParse.startsWith('?') ? '' : '?'}${textToParse}`
        );
        urlObj.searchParams.forEach((val, key) => {
          params.push({ key, value: val });
        });
      } catch {
        // Якщо це не валідний URL з параметрами, просто ігноруємо парсинг params
      }

      return { output: result, error: '', queryParams: params };
    } catch (err: unknown) {
      return {
        output: '',
        error:
          mode === 'decode'
            ? 'Invalid URL encoding format.'
            : 'Failed to encode: ' + (err as Error).message,
        queryParams: [],
      };
    }
  }, [input, mode]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <label className="block text-sm font-medium">Input URL or Text</label>
          {input && (
            <button
              onClick={() => setInput('')}
              className="text-xs text-red-500 hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste full URL or text (e.g. https://example.com/search?q=hello world)..."
          className="w-full h-32 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500">Mode:</span>
          <button
            type="button"
            onClick={() => setMode('encodeComponent')}
            className={`px-3 py-1.5 text-xs rounded-lg transition font-medium ${
              mode === 'encodeComponent'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Encode Component
          </button>
          <button
            type="button"
            onClick={() => setMode('encodeURI')}
            className={`px-3 py-1.5 text-xs rounded-lg transition font-medium ${
              mode === 'encodeURI'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Encode Full URL
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-3 py-1.5 text-xs rounded-lg transition font-medium ${
              mode === 'decode'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono">
          <strong>Error:</strong> {error}
        </div>
      )}

      {output && (
        <div className="space-y-4">
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
            <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all select-all dark:border-gray-800">
              {output}
            </pre>
          </div>

          {queryParams.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Detected Query Parameters ({queryParams.length})
              </label>
              <div className="border rounded-lg overflow-hidden dark:border-gray-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-800 text-gray-600 dark:text-gray-400">
                    <tr>
                      <th className="p-2.5">Parameter</th>
                      <th className="p-2.5">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-800">
                    {queryParams.map((param, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-2.5 font-bold text-blue-600 dark:text-blue-400">{param.key}</td>
                        <td className="p-2.5 text-gray-800 dark:text-gray-200 break-all">{param.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}