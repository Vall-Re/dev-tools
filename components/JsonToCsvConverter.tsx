'use client';

import { useState } from 'react';

export default function JsonToCsvConverter() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convertToCsv = () => {
    if (!jsonInput.trim()) return;
    setError('');

    try {
      const parsed = JSON.parse(jsonInput);
      const dataArray = Array.isArray(parsed) ? parsed : [parsed];

      if (dataArray.length === 0) {
        setError('JSON array is empty.');
        setCsvOutput('');
        return;
      }

      // Збираємо всі унікальні ключі (заголовки)
      const headers = Array.from(
        new Set(
          dataArray.flatMap((obj: Record<string, unknown>) =>
            typeof obj === 'object' && obj !== null ? Object.keys(obj) : []
          )
        )
      );

      if (headers.length === 0) {
        setError('No valid objects found in JSON.');
        setCsvOutput('');
        return;
      }

      const escapeCsvValue = (val: unknown): string => {
        if (val === null || val === undefined) return '""';
        if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const csvRows = [
        headers.join(','),
        ...dataArray.map((row: Record<string, unknown>) =>
          headers
            .map((header) =>
              typeof row === 'object' && row !== null
                ? escapeCsvValue(row[header])
                : '""'
            )
            .join(',')
        ),
      ];

      setCsvOutput(csvRows.join('\n'));
    } catch (err: unknown) {
      setError('Invalid JSON format: ' + (err as Error).message);
      setCsvOutput('');
    }
  };

  const handleCopy = async () => {
    if (!csvOutput) return;
    await navigator.clipboard.writeText(csvOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input JSON</label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
          className="w-full h-40 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      <button
        onClick={convertToCsv}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
      >
        Convert to CSV
      </button>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm font-mono break-all">
          <strong>Error:</strong> {error}
        </div>
      )}

      {csvOutput && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">CSV Output</label>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded transition"
            >
              {copied ? 'Copied!' : 'Copy CSV'}
            </button>
          </div>
          <pre className="w-full p-4 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all max-h-96">
            {csvOutput}
          </pre>
        </div>
      )}
    </div>
  );
}