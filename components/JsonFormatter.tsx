'use client';

import { useState, ChangeEvent } from 'react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState<number>(2);
  const [stats, setStats] = useState<{ original: number; formatted: number; savings?: number } | null>(null);

  const sampleJson = JSON.stringify(
    { name: "100DevToolsHub", type: "SEO Platform", features: ["Fast", "Client-Side", "Free"], active: true },
    null,
    2
  );

  const calculateStats = (orig: string, res: string, isMinify: boolean = false) => {
    const originalSize = new Blob([orig]).size;
    const resultSize = new Blob([res]).size;
    const savings = isMinify && originalSize > 0 
      ? Math.max(0, Math.round(((originalSize - resultSize) / originalSize) * 100)) 
      : undefined;

    setStats({
      original: originalSize,
      formatted: resultSize,
      savings,
    });
  };

  const formatJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError('');
      calculateStats(input, formatted, false);
    } catch (err: unknown) {
      setError((err as Error).message);
      setOutput('');
      setStats(null);
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
      calculateStats(input, minified, true);
    } catch (err: unknown) {
      setError((err as Error).message);
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
    a.download = 'formatted.json';
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
    <div className="space-y-4 text-gray-100">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Input JSON</label>
        <div className="flex items-center gap-3 text-xs">
          <label className="text-blue-400 hover:underline cursor-pointer">
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
            className="text-blue-400 hover:underline"
          >
            Load Sample
          </button>
          <span>|</span>
          <button
            onClick={handleClear}
            className="text-gray-400 hover:underline"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your raw JSON here..."
        className="w-full h-48 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 border-gray-700 text-gray-100"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={formatJson}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Format / Beautify
          </button>
          <button
            onClick={minifyJson}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm font-medium"
          >
            Minify
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-300">Indent:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="p-1.5 border rounded-lg bg-gray-900 border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2} className="bg-gray-900 text-gray-100">2 Spaces</option>
            <option value={4} className="bg-gray-900 text-gray-100">4 Spaces</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 border border-red-800 bg-red-950 text-red-300 rounded-lg text-sm font-mono">
          <strong>Invalid JSON Error:</strong> {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-blue-950 border border-blue-800 rounded-lg text-xs font-mono text-blue-200">
          <div>
            <span className="text-gray-400 block">Original Size</span>
            <strong>{stats.original} bytes</strong>
          </div>
          <div>
            <span className="text-gray-400 block">Result Size</span>
            <strong>{stats.formatted} bytes</strong>
          </div>
          {stats.savings !== undefined && (
            <div>
              <span className="text-gray-400 block">Compression</span>
              <strong className="text-emerald-400">{stats.savings}% saved</strong>
            </div>
          )}
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">Result</label>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition font-medium"
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
          <pre className="w-full p-3 border rounded-lg bg-gray-900 border-gray-700 text-green-400 font-mono text-sm overflow-x-auto max-h-96">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}