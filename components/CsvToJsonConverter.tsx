'use client';

import {
  useRef,
  useState,
  type ChangeEvent,
} from 'react';

interface ConversionMeta {
  delimiter: string;
  rows: number;
  columns: number;
}

const sampleCsv = `id,name,age,is_active,city
1,"Smith, John",30,true,"New York"
2,"Doe, Jane",25,false,"London"
3,"Brown, Charlie",42,true,"Paris"`;

export default function CsvToJsonConverter() {
  const [csv, setCsv] = useState('');
  const [json, setJson] = useState('');
  const [error, setError] = useState('');
  const [parseTypes, setParseTypes] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [meta, setMeta] = useState<ConversionMeta | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const castValue = (value: string): unknown => {
    if (!parseTypes) {
      return value;
    }

    const trimmed = value.trim();

    if (trimmed === '') {
      return null;
    }

    if (trimmed.toLowerCase() === 'true') {
      return true;
    }

    if (trimmed.toLowerCase() === 'false') {
      return false;
    }

    const numberPattern =
      /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;

    if (numberPattern.test(trimmed)) {
      const numericValue = Number(trimmed);

      if (
        Number.isFinite(numericValue) &&
        (
          !Number.isInteger(numericValue) ||
          Number.isSafeInteger(numericValue)
        )
      ) {
        return numericValue;
      }
    }

    return value;
  };

  const getDelimiterLabel = (delimiter: string) => {
    if (delimiter === ',') return 'Comma (,)';
    if (delimiter === ';') return 'Semicolon (;)';
    if (delimiter === '\t') return 'Tab';
    if (delimiter === '|') return 'Pipe (|)';

    return delimiter || 'Single column';
  };

  const convertToJson = async () => {
    if (!csv.trim()) return;

    setIsProcessing(true);
    setError('');
    setJson('');
    setMeta(null);
    setCopied(false);

    try {
      const { default: Papa } = await import('papaparse');

      const parsed = Papa.parse<string[]>(csv, {
        skipEmptyLines: 'greedy',
      });

      const blockingErrors = parsed.errors.filter(
        (parseError) =>
          parseError.code !== 'UndetectableDelimiter'
      );

      if (blockingErrors.length > 0) {
        const firstError = blockingErrors[0];

        throw new Error(
          firstError.message ||
            `Unable to parse CSV data${
              typeof firstError.row === 'number'
                ? ` near row ${firstError.row + 1}`
                : ''
            }.`
        );
      }

      const rows = parsed.data;

      if (rows.length < 2) {
        throw new Error(
          'CSV must contain a header row and at least one data row.'
        );
      }

      const headers = rows[0].map((header, index) => {
        const withoutBom =
          index === 0
            ? header.replace(/^\uFEFF/, '')
            : header;

        return withoutBom.trim();
      });

      const emptyHeaderIndex = headers.findIndex(
        (header) => header === ''
      );

      if (emptyHeaderIndex !== -1) {
        throw new Error(
          `Header column ${emptyHeaderIndex + 1} is empty. Give every column a unique name before converting.`
        );
      }

      const duplicateHeaders = headers.filter(
        (header, index) =>
          headers.indexOf(header) !== index
      );

      if (duplicateHeaders.length > 0) {
        const uniqueDuplicates = [
          ...new Set(duplicateHeaders),
        ];

        throw new Error(
          `Duplicate header${
            uniqueDuplicates.length > 1 ? 's' : ''
          } found: ${uniqueDuplicates.join(
            ', '
          )}. Header names must be unique.`
        );
      }

      const dataRows = rows.slice(1);

      const invalidRowIndex = dataRows.findIndex(
        (row) => row.length !== headers.length
      );

      if (invalidRowIndex !== -1) {
        const row = dataRows[invalidRowIndex];

        throw new Error(
          `Data row ${invalidRowIndex + 1} contains ${
            row.length
          } column${
            row.length === 1 ? '' : 's'
          }, but the header defines ${
            headers.length
          }.`
        );
      }

      const result = dataRows.map((row) => {
        const record: Record<string, unknown> = {};

        headers.forEach((header, index) => {
          record[header] = castValue(row[index] ?? '');
        });

        return record;
      });

      setJson(JSON.stringify(result, null, 2));

      setMeta({
        delimiter: parsed.meta.delimiter,
        rows: result.length,
        columns: headers.length,
      });
    } catch (err) {
      setJson('');
      setMeta(null);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to parse this CSV data.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const content =
        typeof reader.result === 'string'
          ? reader.result
          : '';

      setCsv(content);
      setJson('');
      setError('');
      setMeta(null);
      setCopied(false);
    };

    reader.onerror = () => {
      setError('Unable to read the selected CSV file.');
      setJson('');
      setMeta(null);
    };

    reader.readAsText(file);
  };

  const handleCopy = async () => {
    if (!json) return;

    try {
      await navigator.clipboard.writeText(json);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!json) return;

    const blob = new Blob([json], {
      type: 'application/json;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'converted.json';

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setCsv('');
    setJson('');
    setError('');
    setMeta(null);
    setCopied(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = () => {
    setCsv(sampleCsv);
    setJson('');
    setError('');
    setMeta(null);
    setCopied(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-5 text-text-primary">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label
          htmlFor="csv-input"
          className="text-sm font-medium text-text-primary"
        >
          Input CSV Data
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
        id="csv-input"
        value={csv}
        onChange={(event) => {
          setCsv(event.target.value);
          setError('');
        }}
        placeholder="Paste CSV, TSV, semicolon-separated, or pipe-separated data here..."
        spellCheck={false}
        className="h-48 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={convertToJson}
            disabled={!csv.trim() || isProcessing}
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isProcessing
              ? 'Converting…'
              : 'Convert CSV to JSON'}
          </button>

          <label className="flex cursor-pointer items-center gap-2 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={parseTypes}
              onChange={(event) =>
                setParseTypes(event.target.checked)
              }
              className="size-4 rounded border-border bg-surface-900 text-brand-blue focus:ring-brand-cyan"
            />

            Auto-parse numbers & booleans
          </label>
        </div>

        <label className="cursor-pointer rounded-lg border border-border bg-surface-800 px-3 py-2 text-xs font-medium text-text-primary transition hover:border-brand-blue/50">
          Upload CSV File

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv,text/plain"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            CSV error
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
              Detected delimiter
            </span>

            <strong className="mt-1 block font-mono text-sm text-text-primary">
              {getDelimiterLabel(meta.delimiter)}
            </strong>
          </div>

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
        </div>
      )}

      {json && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-text-primary">
              Converted JSON
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
              >
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="rounded-lg border border-border bg-surface-800 px-3 py-1.5 text-xs font-medium text-text-primary transition hover:border-brand-blue/50"
              >
                Download .json
              </button>
            </div>
          </div>

          <pre className="max-h-96 w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-success">
            {json}
          </pre>
        </div>
      )}
    </div>
  );
}
