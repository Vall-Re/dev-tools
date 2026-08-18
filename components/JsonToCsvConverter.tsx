'use client';

import { useState, ChangeEvent } from 'react';

export default function JsonToCsvConverter() {
  const [json, setJson] = useState('');
  const [csv, setCsv] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const sampleJson = JSON.stringify(
    [
      { id: 1, name: "John Doe", role: "Developer", city: "New York", active: true },
      { id: 2, name: "Jane Smith", role: "Designer", city: "London", active: false },
      { id: 3, name: "Alex Johnson", role: "Product Owner", city: "Berlin", active: true }
    ],
    null,
    2
  );

  const convertToCsv = () => {
    if (!json.trim()) {
      setCsv('');
      setError('');
      return;
    }

    try {
      let parsed = JSON.parse(json);

      if (!Array.isArray(parsed)) {
        if (typeof parsed === 'object' && parsed !== null) {
          parsed = [parsed];
        } else {
          setError('Input must be a JSON array of objects or a single JSON object.');
          setCsv('');
          return;
        }
      }

      if (parsed.length === 0) {
        setError('JSON array is empty.');
        setCsv('');
        return;
      }

      const headers = Array.from(
        new Set(
          parsed.flatMap((obj) => (typeof obj === 'object' && obj !== null ? Object.keys(obj) : []))
        )
      );

      if (headers.length === 0) {
        setError('No valid key-value pairs found in objects.');
        setCsv('');
        return;
      }

      const csvRows = [
        headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
        ...parsed.map((row) =>
          headers
            .map((field) => {
              const val = row && typeof row === 'object' ? row[field] : '';
              let formattedVal = '';

              if (val === null || val === undefined) {
                formattedVal = '';
              } else if (typeof val === 'object') {
                formattedVal = JSON.stringify(val);
              } else {
                formattedVal = String(val);
              }

              const escaped = formattedVal.replace(/"/g, '""');
              return `"${escaped}"`;
            })
            .join(',')
        ),
      ];

      setCsv(csvRows.join('\n'));
      setError('');
    } catch (err: unknown) {
      setError('Invalid JSON format: ' + (err as Error).message);
      setCsv('');
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJson(content);
      setError('');
      setCsv('');
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!csv) return;
    await navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setJson('');
    setCsv('');
    setError('');
  };

  const handleLoadSample = () => {
    setJson(sampleJson);
    setCsv('');
    setError('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Input JSON Array</label>
        <div className="flex items-center gap-3 text-xs">
          <label className="text-blue-600 hover:underline cursor-pointer dark:text-blue-400">
            Upload File
            <input 
              type="file" 
              accept=".json,application/json" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
          <span>|</span>
          <button
            onClick={handleLoadSample}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Load Sample
          </button>
          <span>|</span>
          <button
            onClick={handleClear}
            className="text-gray-500 hover:underline dark:text-gray-400"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        placeholder={`[\n  { "name": "John", "age": 30, "city": "New York" },\n  { "name": "Jane", "age": 25, "city": "London" }\n]`}
        className="w-full h-44 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      />

      <div className="flex gap-2">
        <button
          onClick={convertToCsv}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Convert JSON to CSV
        </button>
      </div>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono dark:bg-red-950 dark:border-red-800 dark:text-red-300">
          <strong>Error:</strong> {error}
        </div>
      )}

      {csv && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">Converted CSV Result</label>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-800 transition font-medium dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Download .csv
              </button>
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition font-medium"
              >
                {copied ? 'Copied!' : 'Copy CSV'}
              </button>
            </div>
          </div>
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all max-h-96">
            {csv}
          </pre>
        </div>
      )}
    </div>
  );
}