'use client';

import { useState } from 'react';

export default function JsMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ original: number; minified: number; savings: number } | null>(null);

  const sampleJs = `// Calculate total price with discount
function calculateTotal(price, discountPercent = 0) {
  /* Validate inputs */
  if (price <= 0) return 0;
  
  const discountAmount = price * (discountPercent / 100);
  const finalPrice = price - discountAmount;
  
  console.log("Calculated final price:", finalPrice);
  return finalPrice;
}

const itemPrice = 150;
const total = calculateTotal(itemPrice, 15);`;

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

  const minifyJs = () => {
    if (!input.trim()) return;

    const minified = input
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/(^|[^:])\/\/.*/g, '$1') // Safe removal of single-line comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*([={};(),+-/*])\s*/g, '$1') // Remove spaces around operators
      .trim();

    setOutput(minified);
    calculateStats(input, minified);
  };

  const formatJs = () => {
    if (!input.trim()) return;

    const formatted = input
      .replace(/\s*;\s*/g, ';\n')
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/\s*\}\s*/g, '\n}\n')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    setOutput(formatted);
    setStats(null);
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
    setStats(null);
  };

  const handleLoadSample = () => {
    setInput(sampleJs);
    setOutput('');
    setStats(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Input JavaScript Code</label>
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
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your JS code here..."
        className="w-full h-44 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      />

      <div className="flex gap-2">
        <button
          onClick={minifyJs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Minify JS
        </button>
        <button
          onClick={formatJs}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
        >
          Basic Format
        </button>
      </div>

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
            <strong className="text-emerald-600 dark:text-emerald-400">{stats.savings}%</strong>
          </div>
        </div>
      )}

      {output && (
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
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all max-h-96">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}