'use client';

import { useState } from 'react';

export default function CsvToJsonConverter() {
  const [csv, setCsv] = useState('');
  const [json, setJson] = useState('');
  const [error, setError] = useState('');
  const [parseTypes, setParseTypes] = useState(true);
  const [copied, setCopied] = useState(false);

  const sampleCsv = `id,name,age,is_active,city
1,"Smith, John",30,true,"New York"
2,"Doe, Jane",25,false,"London"
3,"Brown, Charlie",42,true,"Paris"`;

  // Parser handling quotes and escaped commas properly
  const parseCsvLine = (text: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"' && (i === 0 || text[i - 1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    return result;
  };

  const castValue = (val: string) => {
    if (!parseTypes) return val;
    if (val === '') return null;
    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;
    if (!isNaN(Number(val)) && val.trim() !== '') return Number(val);
    return val;
  };

  const convertToJson = () => {
    if (!csv.trim()) return;
    setError('');

    try {
      const lines = csv.trim().split(/\r?\n/).filter((line) => line.trim() !== '');
      if (lines.length < 2) {
        setError('CSV must contain at least a header row and one data row.');
        setJson('');
        return;
      }

      const headers = parseCsvLine(lines[0]);
      const result = lines.slice(1).map((line) => {
        const values = parseCsvLine(line);
        const obj: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] !== undefined ? castValue(values[index]) : '';
        });
        return obj;
      });

      setJson(JSON.stringify(result, null, 2));
    } catch (err: unknown) {
      setError('Failed to parse CSV data: ' + (err as Error).message);
      setJson('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsv(content);
    };
    reader.readAsText(file);
  };

  const handleCopy = async () => {
    if (!json) return;
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!json) return;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setCsv('');
    setJson('');
    setError('');
  };

  const handleLoadSample = () => {
    setCsv(sampleCsv);
    setJson('');
    setError('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Input CSV Data</label>
        <div className="flex gap-2 text-xs">
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
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        placeholder="Paste your CSV data here..."
        className="w-full h-40 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={convertToJson}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Convert CSV to JSON
          </button>

          <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={parseTypes}
              onChange={(e) => setParseTypes(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            Auto-parse numbers & booleans
          </label>
        </div>

        <div>
          <label className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs font-medium cursor-pointer transition border dark:border-gray-600">
            Upload CSV File
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono dark:bg-red-950 dark:border-red-800 dark:text-red-300">
          <strong>Error:</strong> {error}
        </div>
      )}

      {json && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">Converted JSON</label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition font-medium"
              >
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-800 transition font-medium dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Download .json
              </button>
            </div>
          </div>
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap max-h-96">
            {json}
          </pre>
        </div>
      )}
    </div>
  );
}