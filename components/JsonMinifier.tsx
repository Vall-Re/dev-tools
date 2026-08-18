'use client';

import { useState, ChangeEvent } from 'react';

export default function JsonMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState<number>(2);
  const [stats, setStats] = useState<{ original: number; minified: number; savings: number } | null>(null);

  const sampleJson = JSON.stringify(
    {
      name: "100DevToolsHub",
      version: "1.0.0",
      description: "Fast and secure client-side developer tools",
      features: ["Client-Side Only", "No Server Lag", "Dark Mode Support"],
      openSource: true
    },
    null,
    2
  );

  const calculateStats = (orig: string, min: string) => {
    const originalSize = new Blob([orig]).size;
    const minifiedSize = new Blob([min]).size;
    const savings = originalSize > 0 
      ? Math.max(0, Math.round(((originalSize - minifiedSize) / originalSize) * 100)) 
      : 0;

    setStats({
      original: originalSize,
      minified: minifiedSize,
      savings,
    });
  };

  const minifyJson = () => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      setStats(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      calculateStats(input, minified);
    } catch (err: unknown) {
      setError((err as Error).message || 'Invalid JSON syntax');
      setOutput('');
      setStats(null);
    }
  };

  const formatJson = () => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      setStats(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setStats(null);
    } catch (err: unknown) {
      setError((err as Error).message || 'Invalid JSON syntax');
      setOutput('');
      setStats(null);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      setError('');
      setOutput('');
      setStats(null);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setStats(null);
  };

  const handleLoadSample = () => {
    setInput(sampleJson);
    setError('');
    setOutput('');
    setStats(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Input JSON</label>
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
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{\n  "name": "John",\n  "age": 30\n}'
        className="w-full h-44 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={minifyJson}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Minify JSON
          </button>
          <button
            onClick={formatJson}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
          >
            Format / Beautify
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-600 dark:text-gray-300">Format Indent:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="p-1.5 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono dark:bg-red-950 dark:border-red-800 dark:text-red-300">
          <strong>Invalid JSON Error:</strong> {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-3 gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs font-mono dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200">
          <div>
            <span className="text-gray-500 dark:text-gray-400 block">Original Size</span>
            <strong>{stats.original} bytes</strong>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400 block">Minified Size</span>
            <strong>{stats.minified} bytes</strong>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400 block">Savings</span>
            <strong className="text-emerald-600 dark:text-emerald-400">{stats.savings}% saved</strong>
          </div>
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">Result</label>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-800 transition font-medium dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Download .json
              </button>
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition font-medium"
              >
                {copied ? 'Copied!' : 'Copy Result'}
              </button>
            </div>
          </div>
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all max-h-96">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}