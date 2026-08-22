'use client';

import { useState } from 'react';
import SparkMD5 from 'spark-md5';

const sampleText =
  'Hello World! Привіт 🚀';

export default function Md5Generator() {
  const [input, setInput] =
    useState('');

  const [hash, setHash] =
    useState<string | null>(null);

  const [copied, setCopied] =
    useState(false);

  const generateHash = () => {
    /*
     * Empty string is a valid MD5 input,
     * so intentionally do not reject it.
     */
    const result =
      SparkMD5.hash(input);

    setHash(result);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (hash === null) return;

    try {
      await navigator.clipboard.writeText(
        hash
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleLoadSample = () => {
    setInput(sampleText);
    setHash(null);
    setCopied(false);
  };

  const handleClear = () => {
    setInput('');
    setHash(null);
    setCopied(false);
  };

  const inputBytes =
    new TextEncoder().encode(
      input
    ).length;

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="md5-input"
            className="text-sm font-medium"
          >
            Input Text
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
          id="md5-input"
          value={input}
          onChange={(event) => {
            setInput(
              event.target.value
            );

            setHash(null);
            setCopied(false);
          }}
          placeholder="Enter text to generate an MD5 digest..."
          spellCheck={false}
          className="h-40 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />

        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-text-muted">
          <span>
            {Array.from(
              input
            ).length.toLocaleString()}{' '}
            characters
          </span>

          <span aria-hidden="true">
            •
          </span>

          <span>
            {inputBytes.toLocaleString()}{' '}
            UTF-8 bytes
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={generateHash}
        className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Generate MD5 Hash
      </button>

      <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
        <p className="text-sm font-medium text-warning">
          MD5 is not secure for
          cryptographic use
        </p>

        <p className="mt-1 text-xs leading-5 text-text-secondary">
          MD5 is a legacy hash algorithm
          with known collision weaknesses.
          Use it only for compatibility,
          legacy checksums, or comparing
          non-security-sensitive data.
          Do not use MD5 for passwords,
          digital signatures, certificates,
          or security-sensitive integrity
          checks.
        </p>
      </div>

      {hash !== null && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                MD5 Digest
              </p>

              <p className="mt-1 text-xs text-text-muted">
                128-bit digest shown as
                32 lowercase hexadecimal
                characters.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
            >
              {copied
                ? 'Copied!'
                : 'Copy Hash'}
            </button>
          </div>

          <div className="rounded-xl border border-border bg-surface-900 p-4">
            <code className="break-all font-mono text-sm text-success">
              {hash}
            </code>
          </div>
        </section>
      )}
    </div>
  );
}