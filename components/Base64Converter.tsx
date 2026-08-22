'use client';

import { useState } from 'react';

type Operation = 'encode' | 'decode' | null;

const sampleText =
  'Hello World! Вітаємо у 100DevToolsHub 🚀';

const encodeUtf8ToBase64 = (
  value: string
) => {
  const bytes =
    new TextEncoder().encode(value);

  const chunks: string[] = [];
  const chunkSize = 0x8000;

  for (
    let offset = 0;
    offset < bytes.length;
    offset += chunkSize
  ) {
    const chunk = bytes.subarray(
      offset,
      offset + chunkSize
    );

    chunks.push(
      String.fromCharCode(...chunk)
    );
  }

  return btoa(chunks.join(''));
};

const normalizeBase64 = (
  value: string
) => {
  /*
   * Standard Base64 may be split across
   * lines, so ASCII whitespace is ignored
   * during decoding.
   */
  const compact = value.replace(
    /[\t\n\f\r ]+/g,
    ''
  );

  if (!compact) {
    throw new Error(
      'Enter a Base64 value to decode.'
    );
  }

  if (
    !/^[A-Za-z0-9+/]*={0,2}$/.test(
      compact
    )
  ) {
    throw new Error(
      'The input contains characters that are not valid in standard Base64.'
    );
  }

  const hasPadding =
    compact.includes('=');

  if (
    hasPadding &&
    compact.length % 4 !== 0
  ) {
    throw new Error(
      'The Base64 padding is invalid.'
    );
  }

  if (hasPadding) {
    return compact;
  }

  const remainder =
    compact.length % 4;

  if (remainder === 1) {
    throw new Error(
      'The Base64 length is invalid.'
    );
  }

  return (
    compact +
    '='.repeat(
      (4 - remainder) % 4
    )
  );
};

const decodeBase64ToUtf8 = (
  value: string
) => {
  const normalized =
    normalizeBase64(value);

  let binary: string;

  try {
    binary = atob(normalized);
  } catch {
    throw new Error(
      'The input is not a valid Base64 payload.'
    );
  }

  const bytes = Uint8Array.from(
    binary,
    (character) =>
      character.charCodeAt(0)
  );

  try {
    return new TextDecoder(
      'utf-8',
      {
        fatal: true,
      }
    ).decode(bytes);
  } catch {
    throw new Error(
      'The Base64 payload is valid, but its decoded bytes are not valid UTF-8 text.'
    );
  }
};

export default function Base64Converter() {
  const [input, setInput] =
    useState('');

  const [output, setOutput] =
    useState('');

  const [error, setError] =
    useState('');

  const [copied, setCopied] =
    useState(false);

  const [operation, setOperation] =
    useState<Operation>(null);

  const resetResult = () => {
    setOutput('');
    setError('');
    setCopied(false);
    setOperation(null);
  };

  const encodeBase64 = () => {
    if (input.length === 0) {
      resetResult();
      return;
    }

    setError('');
    setOutput('');
    setCopied(false);

    try {
      const result =
        encodeUtf8ToBase64(input);

      setOutput(result);
      setOperation('encode');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to encode this text.'
      );

      setOperation(null);
    }
  };

  const decodeBase64 = () => {
    if (!input.trim()) {
      resetResult();
      return;
    }

    setError('');
    setOutput('');
    setCopied(false);

    try {
      const result =
        decodeBase64ToUtf8(input);

      setOutput(result);
      setOperation('decode');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to decode this Base64 value.'
      );

      setOperation(null);
    }
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
  };

  const handleLoadSample = () => {
    setInput(sampleText);
    resetResult();
  };

  const handleUseResult = () => {
    if (!output) return;

    setInput(output);
    resetResult();
  };

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="base64-input"
            className="text-sm font-medium"
          >
            Input Text or Base64
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
              className="font-medium text-text-muted transition-colors hover:text-danger"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          id="base64-input"
          value={input}
          onChange={(event) => {
            setInput(
              event.target.value
            );
            resetResult();
          }}
          placeholder="Enter UTF-8 text or a standard Base64 value..."
          spellCheck={false}
          className="h-40 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={encodeBase64}
          disabled={input.length === 0}
          className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Encode to Base64
        </button>

        <button
          type="button"
          onClick={decodeBase64}
          disabled={!input.trim()}
          className="rounded-lg border border-border bg-surface-800 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-brand-cyan/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Decode from Base64
        </button>
      </div>

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          Text is encoded as UTF-8 before
          Base64 conversion. Decoding expects
          standard Base64 containing valid
          UTF-8 text. ASCII whitespace and
          omitted trailing padding are accepted.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            Base64 error
          </p>

          <p className="mt-2 break-words text-sm leading-6 text-text-secondary">
            {error}
          </p>
        </div>
      )}

      {output && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                {operation === 'encode'
                  ? 'Encoded Base64'
                  : 'Decoded UTF-8 Text'}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {operation === 'encode'
                  ? `${new Blob([input]).size.toLocaleString()} UTF-8 bytes → ${output.length.toLocaleString()} Base64 characters`
                  : `${input.replace(/[\t\n\f\r ]+/g, '').length.toLocaleString()} Base64 characters → ${new Blob([output]).size.toLocaleString()} UTF-8 bytes`}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleUseResult}
                className="rounded-lg border border-border bg-surface-800 px-3 py-1.5 text-xs font-medium transition hover:border-brand-cyan/50"
              >
                Use as Input
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

          <pre className="max-h-96 w-full overflow-auto whitespace-pre-wrap break-all rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-success">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
