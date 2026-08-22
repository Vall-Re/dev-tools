'use client';

import { useState } from 'react';

interface Stats {
  original: number;
  minified: number;
  savings: number;
}

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

export default function JsMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateStats = (original: string, minified: string) => {
    const originalSize = new Blob([original]).size;
    const minifiedSize = new Blob([minified]).size;

    const savings =
      originalSize > 0
        ? Math.max(
            0,
            Math.round(
              ((originalSize - minifiedSize) / originalSize) * 100
            )
          )
        : 0;

    setStats({
      original: originalSize,
      minified: minifiedSize,
      savings,
    });
  };

  const processJavaScript = async (
    mode: 'minify' | 'format'
  ) => {
    if (!input.trim()) return;

    setIsProcessing(true);
    setError('');
    setCopied(false);

    try {
      const { minify } = await import('terser');

      const beautify = mode === 'format';

      const options = {
        compress: false,
        mangle: false,
        format: {
          beautify,
          comments: beautify,
        },
      };

      let result;

      try {
        result = await minify(input, {
          ...options,
          module: false,
        });
      } catch {
        result = await minify(input, {
          ...options,
          module: true,
        });
      }

      if (!result.code) {
        throw new Error('No JavaScript output was generated.');
      }

      setOutput(result.code);

      if (mode === 'minify') {
        calculateStats(input, result.code);
      } else {
        setStats(null);
      }
    } catch (err) {
      setOutput('');
      setStats(null);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to process this JavaScript code.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setStats(null);
    setError('');
    setCopied(false);
  };

  const handleLoadSample = () => {
    setInput(sampleJs);
    setOutput('');
    setStats(null);
    setError('');
    setCopied(false);
  };

  return (
    <div className="space-y-5 text-text-primary">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label
          htmlFor="javascript-input"
          className="text-sm font-medium text-text-primary"
        >
          Input JavaScript Code
        </label>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleLoadSample}
            className="font-medium text-brand-cyan transition-colors hover:text-text-primary"
          >
            Load Sample
          </button>

          <span
            aria-hidden="true"
            className="text-text-muted"
          >
            /
          </span>

          <button
            type="button"
            onClick={handleClear}
            className="font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        id="javascript-input"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setError('');
        }}
        placeholder="Paste your JavaScript code here..."
        spellCheck={false}
        className="h-52 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => processJavaScript('minify')}
          disabled={!input.trim() || isProcessing}
          className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isProcessing ? 'Processing…' : 'Minify JS'}
        </button>

        <button
          type="button"
          onClick={() => processJavaScript('format')}
          disabled={!input.trim() || isProcessing}
          className="rounded-lg border border-border bg-surface-800 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-brand-blue/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Format JS
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            JavaScript error
          </p>

          <p className="mt-2 break-words text-sm leading-6 text-text-secondary">
            {error}
          </p>
        </div>
      )}

      {stats && (
        <div className="grid gap-3 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-4 sm:grid-cols-3">
          <div>
            <span className="block text-xs text-text-muted">
              Original size
            </span>
            <strong className="mt-1 block font-mono text-sm text-text-primary">
              {stats.original} bytes
            </strong>
          </div>

          <div>
            <span className="block text-xs text-text-muted">
              Minified size
            </span>
            <strong className="mt-1 block font-mono text-sm text-text-primary">
              {stats.minified} bytes
            </strong>
          </div>

          <div>
            <span className="block text-xs text-text-muted">
              Savings
            </span>
            <strong className="mt-1 block font-mono text-sm text-success">
              {stats.savings}%
            </strong>
          </div>
        </div>
      )}

      {output && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-text-primary">
              Result
            </p>

            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
            >
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </div>

          <pre className="max-h-96 w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-success">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
