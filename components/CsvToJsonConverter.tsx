'use client';

import { useState } from 'react';

export default function CsvToJsonConverter() {
  const [csv, setCsv] = useState('');
  const [json, setJson] = useState('');
  const [error, setError] = useState('');

  const convertToJson = () => {
    if (!csv.trim()) return;
    setError('');

    try {
      const lines = csv.trim().split('\n');
      if (lines.length < 2) {
        setError('CSV must contain at least a header row and one data row.');
        setJson('');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
      const result = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });

      setJson(JSON.stringify(result, null, 2));
    } catch (err: unknown) {
      setError('Failed to parse CSV data: ' + (err as Error).message);
      setJson('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input CSV Data</label>
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder="name,age,city&#10;John,30,New York&#10;Jane,25,London"
          className="w-full h-36 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={convertToJson}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Convert CSV to JSON
      </button>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono">
          <strong>Error:</strong> {error}
        </div>
      )}

      {json && (
        <div>
          <label className="block text-sm font-medium mb-2">Converted JSON</label>
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
            {json}
          </pre>
        </div>
      )}
    </div>
  );
}