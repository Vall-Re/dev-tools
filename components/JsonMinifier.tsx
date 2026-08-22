'use client';

import {
  useRef,
  useState,
  type ChangeEvent,
} from 'react';

type Operation = 'minify' | 'format' | null;

interface Stats {
  original: number;
  result: number;
  saved: number;
  savings: number;
}

interface JsonValidationError {
  line: number;
  column: number;
}

const sampleJson = `{
  "name": "100DevToolsHub",
  "version": "1.0.0",
  "description": "Fast, privacy-focused developer tools",
  "features": [
    "Client-side processing",
    "Developer utilities",
    "Dark interface"
  ],
  "openSource": true,
  "largeId": 9007199254740993
}`;

const normalizeInput = (value: string) =>
  value.replace(/^\uFEFF/, '');

const getByteSize = (value: string) =>
  new Blob([value]).size;

const validateJson = async (
  value: string
): Promise<JsonValidationError | null> => {
  const { visit } = await import('jsonc-parser');

  let firstError: JsonValidationError | null = null;

  visit(
    value,
    {
      onError: (
        _error,
        _offset,
        _length,
        startLine,
        startCharacter
      ) => {
        if (!firstError) {
          firstError = {
            line: startLine + 1,
            column: startCharacter + 1,
          };
        }
      },
    },
    {
      disallowComments: true,
      allowTrailingComma: false,
      allowEmptyContent: false,
    }
  );

  return firstError;
};

const minifyJsonText = async (
  value: string
) => {
  const { createScanner } =
    await import('jsonc-parser');

  /*
   * jsonc-parser exposes SyntaxKind as an
   * ambient const enum, which cannot be
   * referenced directly with isolatedModules.
   * SyntaxKind.EOF = 17.
   */
  const EOF_TOKEN = 17;

  const scanner = createScanner(
    value,
    true
  );

  let result = '';

  while (true) {
    const token = scanner.scan();

    if (token === EOF_TOKEN) {
      break;
    }

    const offset =
      scanner.getTokenOffset();

    const length =
      scanner.getTokenLength();

    result += value.slice(
      offset,
      offset + length
    );
  }

  return result;
};

const formatJsonText = async (
  value: string,
  indent: number
) => {
  const {
    applyEdits,
    format,
  } = await import('jsonc-parser');

  const edits = format(
    value,
    undefined,
    {
      tabSize: indent,
      insertSpaces: true,
      eol: '\n',
    }
  );

  return applyEdits(value, edits).trim();
};

export default function JsonMinifier() {
  const [input, setInput] =
    useState('');

  const [output, setOutput] =
    useState('');

  const [error, setError] =
    useState('');

  const [copied, setCopied] =
    useState(false);

  const [indent, setIndent] =
    useState<2 | 4>(2);

  const [stats, setStats] =
    useState<Stats | null>(null);

  const [operation, setOperation] =
    useState<Operation>(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const resetResult = () => {
    setOutput('');
    setError('');
    setCopied(false);
    setStats(null);
    setOperation(null);
  };

  const processInput = async (
    nextOperation: Exclude<
      Operation,
      null
    >
  ) => {
    if (!input.trim()) {
      resetResult();
      return;
    }

    setIsProcessing(true);
    setError('');
    setOutput('');
    setCopied(false);
    setStats(null);
    setOperation(null);

    try {
      const normalized =
        normalizeInput(input);

      const validationError =
        await validateJson(
          normalized
        );

      if (validationError) {
        throw new Error(
          `Invalid JSON near line ${validationError.line}, column ${validationError.column}.`
        );
      }

      const result =
        nextOperation === 'minify'
          ? await minifyJsonText(
              normalized
            )
          : await formatJsonText(
              normalized,
              indent
            );

      setOutput(result);
      setOperation(nextOperation);

      const originalSize =
        getByteSize(input);

      const resultSize =
        getByteSize(result);

      const saved = Math.max(
        0,
        originalSize - resultSize
      );

      const savings =
        originalSize > 0
          ? Math.max(
              0,
              Math.round(
                (saved /
                  originalSize) *
                  100
              )
            )
          : 0;

      setStats({
        original: originalSize,
        result: resultSize,
        saved,
        savings,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to process this JSON.'
      );

      setOutput('');
      setStats(null);
      setOperation(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = () => {
      const content =
        typeof reader.result ===
        'string'
          ? reader.result
          : '';

      setInput(content);
      resetResult();
    };

    reader.onerror = () => {
      setError(
        'Unable to read the selected JSON file.'
      );

      setOutput('');
      setStats(null);
      setOperation(null);
    };

    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob(
      [output],
      {
        type: 'application/json;charset=utf-8',
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement('a');

    anchor.href = url;

    anchor.download =
      operation === 'format'
        ? 'formatted.json'
        : 'minified.json';

    document.body.appendChild(
      anchor
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(
        output
      );

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
    resetResult();

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = () => {
    setInput(sampleJson);
    resetResult();

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="json-minifier-input"
            className="text-sm font-medium"
          >
            Input JSON
          </label>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <label className="cursor-pointer font-medium text-brand-cyan transition-colors hover:text-text-primary">
              Upload File

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={
                  handleFileUpload
                }
                className="hidden"
              />
            </label>

            <span
              aria-hidden="true"
              className="text-text-muted"
            >
              /
            </span>

            <button
              type="button"
              onClick={
                handleLoadSample
              }
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
              className="font-medium text-text-muted transition-colors hover:text-danger"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          id="json-minifier-input"
          value={input}
          onChange={(event) => {
            setInput(
              event.target.value
            );

            resetResult();
          }}
          placeholder={'{\n  "name": "John",\n  "age": 30\n}'}
          spellCheck={false}
          className="h-52 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />

        <p className="text-xs text-text-muted">
          {getByteSize(
            input
          ).toLocaleString()}{' '}
          bytes input
        </p>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              processInput('minify')
            }
            disabled={
              !input.trim() ||
              isProcessing
            }
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isProcessing
              ? 'Processing…'
              : 'Minify JSON'}
          </button>

          <button
            type="button"
            onClick={() =>
              processInput('format')
            }
            disabled={
              !input.trim() ||
              isProcessing
            }
            className="rounded-lg border border-border bg-surface-800 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-brand-cyan/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Format / Beautify
          </button>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="json-indent"
            className="block text-xs text-text-muted"
          >
            Format indentation
          </label>

          <select
            id="json-indent"
            value={indent}
            onChange={(event) =>
              setIndent(
                Number(
                  event.target.value
                ) as 2 | 4
              )
            }
            className="rounded-lg border border-border bg-surface-900 px-3 py-2 text-sm text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
          >
            <option value={2}>
              2 spaces
            </option>

            <option value={4}>
              4 spaces
            </option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          The tool validates strict JSON
          and changes formatting
          whitespace without converting
          JSON numbers into JavaScript
          numbers. Large integer literals,
          duplicate keys, escape sequences,
          and numeric notation are preserved.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            Invalid JSON
          </p>

          <p className="mt-2 break-words font-mono text-sm leading-6 text-text-secondary">
            {error}
          </p>
        </div>
      )}

      {stats && output && (
        <div className="grid gap-3 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-4 sm:grid-cols-4">
          <div>
            <span className="block text-xs text-text-muted">
              Input
            </span>

            <strong className="mt-1 block font-mono text-sm">
              {stats.original.toLocaleString()}{' '}
              bytes
            </strong>
          </div>

          <div>
            <span className="block text-xs text-text-muted">
              Output
            </span>

            <strong className="mt-1 block font-mono text-sm">
              {stats.result.toLocaleString()}{' '}
              bytes
            </strong>
          </div>

          <div>
            <span className="block text-xs text-text-muted">
              Saved
            </span>

            <strong className="mt-1 block font-mono text-sm">
              {stats.saved.toLocaleString()}{' '}
              bytes
            </strong>
          </div>

          <div>
            <span className="block text-xs text-text-muted">
              Reduction
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
            <div>
              <p className="text-sm font-medium">
                {operation === 'format'
                  ? 'Formatted JSON'
                  : 'Minified JSON'}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                JSON literals are preserved
                rather than reserialized.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={
                  handleDownload
                }
                className="rounded-lg border border-border bg-surface-800 px-3 py-1.5 text-xs font-medium transition hover:border-brand-cyan/50"
              >
                Download .json
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
              >
                {copied
                  ? 'Copied!'
                  : 'Copy Result'}
              </button>
            </div>
          </div>

          <pre className="max-h-[32rem] w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-success">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
