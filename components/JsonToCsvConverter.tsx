'use client';

import { useState } from 'react';

export default function JsonToCsvConverter() {
  const [json, setJson] = useState('');
  const [csv, setCsv] = useState('');
  const [error, setError] = useState('');

  const convertToCsv = () => {
    if (!json.trim()) return;
    setError('');

    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setError('Input must be a non-empty JSON array of objects.');
        setCsv('');
        return;
      }

      const headers = Array.from(
        new Set(parsed.flatMap((obj) => Object.keys(obj)))
      );

      const csvRows = [
        headers.join(','),
        ...parsed.map((row) =>
          headers
            .map((field) => {
              const val = row[field] ?? '';
              const escaped = String(val).replace(/"/g, '""');
              return `"${escaped}"`;
            })
            .join(',')
        ),
      ];

      setCsv(csvRows.join('\n'));
    } catch (err: unknown) {
      setError('Invalid JSON format: ' + (err as Error).message);
      setCsv('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input JSON Array</label>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder={`[\n  { "name": "John", "age": 30, "city": "New York" },\n  { "name": "Jane", "age": 25, "city": "London" }\n]`}
          className="w-full h-40 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={convertToCsv}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Convert JSON to CSV
      </button>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono">
          <strong>Error:</strong> {error}
        </div>
      )}

      {csv && (
        <div>
          <label className="block text-sm font-medium mb-2">Converted CSV</label>
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
            {csv}
          </pre>
        </div>
      )}
    </div>
  );
}