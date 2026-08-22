'use client';

import { useState } from 'react';

type Delimiter = ',' | ';' | '\t';

interface ConversionMeta {
  rows: number;
  columns: number;
  delimiter: Delimiter;
}

const sampleJson = `[
  {
    "id": 1,
    "name": "Smith, John",
    "active": true,
    "city": "New York"
  },
  {
    "id": 2,
    "name": "Doe, Jane",
    "active": false,
    "city": "London"
  }
]`;

export default function JsonToCsvConverter() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [delimiter, setDelimiter] = useState<Delimiter>(',');
  const [escapeFormulae, setEscapeFormulae] = useState(true);
  const [meta, setMeta] = useState<ConversionMeta | null>(null);

  const getDelimiterLabel = (value: Delimiter) => {
    if (value === ',') return 'Comma (,)';
    if (value === ';') return 'Semicolon (;)';

    return 'Tab';
  };

  const normalizeValue = (
    value: unknown
  ): string | number | boolean => {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return value;
    }

    return String(value);
  };

  const convertToCsv = async () => {
    if (!jsonInput.trim()) return;

    setIsProcessing(true);
    setError('');
    setCsvOutput('');
    setMeta(null);
    setCopied(false);

    try {
      const parsed: unknown = JSON.parse(jsonInput);

      const rows = Array.isArray(parsed)
        ? parsed
        : [parsed];

      if (rows.length === 0) {
        throw new Error('The JSON array is empty.');
      }

      const invalidRowIndex = rows.findIndex(
        (row) =>
          row === null ||
          typeof row !== 'object' ||
          Array.isArray(row)
      );

      if (invalidRowIndex !== -1) {
        throw new Error(
          `Row ${invalidRowIndex + 1} is not a JSON object. The top-level input must be an object or an array of objects.`
        );
      }

      const objectRows = rows as Record<string, unknown>[];

      const headers = Array.from(
        new Set(
          objectRows.flatMap((row) => Object.keys(row))
        )
      );

      if (headers.length === 0) {
        throw new Error(
          'No object properties were found to use as CSV columns.'
        );
      }

      const normalizedRows = objectRows.map((row) => {
        const normalized: Record<
          string,
          string | number | boolean
        > = {};

        headers.forEach((header) => {
          normalized[header] = normalizeValue(row[header]);
        });

        return normalized;
      });

      const { default: Papa } = await import('papaparse');

      const csv = Papa.unparse(normalizedRows, {
        columns: headers,
        delimiter,
        newline: '\r\n',
        escapeFormulae,
      });

      setCsvOutput(csv);

      setMeta({
        rows: normalizedRows.length,
        columns: headers.length,
        delimiter,
      });
    } catch (err) {
      setCsvOutput('');
      setMeta(null);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to convert this JSON data.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!csvOutput) return;

    try {
      await navigator.clipboard.writeText(csvOutput);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!csvOutput) return;

    const blob = new Blob(
      [`\uFEFF${csvOutput}`],
      {
        type: 'text/csv;charset=utf-8',
      }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'converted.csv';

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setJsonInput('');
    setCsvOutput('');
    setError('');
    setCopied(false);
    setMeta(null);
  };

  const handleLoadSample = () => {
    setJsonInput(sampleJson);
    setCsvOutput('');
    setError('');
    setCopied(false);
    setMeta(null);
  };

  return (
    <div className="space-y-5 text-text-primary">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label
          htmlFor="json-csv-input"
          className="text-sm font-medium text-text-primary"
        >
          Input JSON
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
        id="json-csv-input"
        value={jsonInput}
        onChange={(event) => {
          setJsonInput(event.target.value);
          setError('');
        }}
        placeholder='[{"name":"John","age":30},{"name":"Jane","age":25}]'
        spellCheck={false}
        className="h-52 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <button
            type="button"
            onClick={convertToCsv}
            disabled={!jsonInput.trim() || isProcessing}
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isProcessing
              ? 'Converting…'
              : 'Convert JSON to CSV'}
          </button>

          <div className="space-y-1">
            <label
              htmlFor="csv-delimiter"
              className="block text-xs text-text-muted"
            >
              Delimiter
            </label>

            <select
              id="csv-delimiter"
              value={delimiter}
              onChange={(event) =>
                setDelimiter(
                  event.target.value as Delimiter
                )
              }
              className="rounded-lg border border-border bg-surface-900 px-3 py-2 text-sm text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value={'\t'}>Tab</option>
            </select>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-2 text-xs text-text-secondary">
          <input
            type="checkbox"
            checked={escapeFormulae}
            onChange={(event) =>
              setEscapeFormulae(event.target.checked)
            }
            className="mt-0.5 size-4 rounded border-border bg-surface-900 text-brand-blue focus:ring-brand-cyan"
          />

          <span>
            Escape spreadsheet formulas
            <span className="mt-0.5 block max-w-xs text-text-muted">
              Helps prevent values beginning with formula
              characters from being executed by spreadsheet
              applications.
            </span>
          </span>
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            JSON error
          </p>

          <p className="mt-2 break-words text-sm leading-6 text-text-secondary">
            {error}
          </p>
        </div>
      )}

      {meta && (
        <div className="grid gap-3 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-4 sm:grid-cols-3">
          <div>
            <span className="block text-xs text-text-muted">
              Data rows
            </span>

            <strong className="mt-1 block font-mono text-sm text-text-primary">
              {meta.rows}
            </strong>
          </div>

          <div>
            <span className="block text-xs text-text-muted">
              Columns
            </span>

            <strong className="mt-1 block font-mono text-sm text-text-primary">
              {meta.columns}
            </strong>
          </div>

          <div>
            <span className="block text-xs text-text-muted">
              Delimiter
            </span>

            <strong className="mt-1 block font-mono text-sm text-text-primary">
              {getDelimiterLabel(meta.delimiter)}
            </strong>
          </div>
        </div>
      )}

      {csvOutput && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-text-primary">
              CSV Output
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
              >
                {copied ? 'Copied!' : 'Copy CSV'}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="rounded-lg border border-border bg-surface-800 px-3 py-1.5 text-xs font-medium text-text-primary transition hover:border-brand-blue/50"
              >
                Download .csv
              </button>
            </div>
          </div>

          <pre className="max-h-96 w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-success">
            {csvOutput}
          </pre>
        </div>
      )}
    </div>
  );
}
