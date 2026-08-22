'use client';

import {
  useEffect,
  useState,
} from 'react';

const sampleText =
  'Hello World! Привіт 🚀';

const bufferToHex = (
  buffer: ArrayBuffer
) =>
  Array.from(
    new Uint8Array(buffer),
    (byte) =>
      byte
        .toString(16)
        .padStart(2, '0')
  ).join('');

export default function Sha256Generator() {
  const [input, setInput] =
    useState('');

  const [hash, setHash] =
    useState<string | null>(null);

  const [
    hasInputBeenEdited,
    setHasInputBeenEdited,
  ] = useState(false);

  const [
    isUppercase,
    setIsUppercase,
  ] = useState(false);

  const [copied, setCopied] =
    useState(false);

  const [error, setError] =
    useState('');

  const [isHashing, setIsHashing] =
    useState(false);

  useEffect(() => {
    if (!hasInputBeenEdited) {
      return;
    }

    let cancelled = false;

    const calculateHash =
      async () => {
        setIsHashing(true);
        setError('');
        setCopied(false);

        try {
          if (
            !globalThis.crypto
              ?.subtle
          ) {
            throw new Error(
              'Web Crypto API is not available in this browser context.'
            );
          }

          const data =
            new TextEncoder().encode(
              input
            );

          const digest =
            await crypto.subtle.digest(
              'SHA-256',
              data
            );

          if (cancelled) {
            return;
          }

          setHash(
            bufferToHex(digest)
          );
        } catch (err) {
          if (cancelled) {
            return;
          }

          setHash(null);

          setError(
            err instanceof Error
              ? err.message
              : 'Unable to generate the SHA-256 digest.'
          );
        } finally {
          if (!cancelled) {
            setIsHashing(false);
          }
        }
      };

    void calculateHash();

    return () => {
      cancelled = true;
    };
  }, [
    input,
    hasInputBeenEdited,
  ]);

  const handleCopy = async () => {
    if (hash === null) return;

    const value =
      isUppercase
        ? hash.toUpperCase()
        : hash;

    try {
      await navigator.clipboard.writeText(
        value
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
    setHash(null);
    setError('');
    setCopied(false);
    setIsHashing(false);
    setHasInputBeenEdited(
      false
    );
  };

  const handleLoadSample = () => {
    setInput(sampleText);
    setHash(null);
    setError('');
    setCopied(false);
    setHasInputBeenEdited(
      true
    );
  };

  const byteLength =
    new TextEncoder().encode(
      input
    ).length;

  const codePointCount =
    Array.from(input).length;

  const displayHash =
    hash === null
      ? ''
      : isUppercase
        ? hash.toUpperCase()
        : hash;

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="sha256-input"
            className="text-sm font-medium"
          >
            Input Text
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-text-secondary">
              <input
                type="checkbox"
                checked={
                  isUppercase
                }
                onChange={(
                  event
                ) => {
                  setIsUppercase(
                    event.target
                      .checked
                  );

                  setCopied(
                    false
                  );
                }}
                className="size-4 rounded border-border bg-surface-900 text-brand-blue focus:ring-brand-cyan"
              />

              Uppercase hex
            </label>

            <span
              aria-hidden="true"
              className="text-xs text-text-muted"
            >
              /
            </span>

            <button
              type="button"
              onClick={
                handleLoadSample
              }
              className="text-xs font-medium text-brand-cyan transition-colors hover:text-text-primary"
            >
              Load Sample
            </button>

            <span
              aria-hidden="true"
              className="text-xs text-text-muted"
            >
              /
            </span>

            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium text-text-muted transition-colors hover:text-danger"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          id="sha256-input"
          value={input}
          onChange={(
            event
          ) => {
            setInput(
              event.target.value
            );

            setHasInputBeenEdited(
              true
            );

            setCopied(false);
            setError('');
          }}
          placeholder="Type or paste text to generate a SHA-256 digest..."
          spellCheck={false}
          className="h-40 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />

        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-text-muted">
          <span>
            {codePointCount.toLocaleString()}{' '}
            Unicode code points
          </span>

          <span aria-hidden="true">
            •
          </span>

          <span>
            {byteLength.toLocaleString()}{' '}
            UTF-8 bytes
          </span>

          {isHashing && (
            <>
              <span
                aria-hidden="true"
              >
                •
              </span>

              <span className="text-brand-cyan">
                Calculating…
              </span>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-sm font-medium text-text-primary">
          SHA-256 message digest
        </p>

        <p className="mt-1 text-xs leading-5 text-text-secondary">
          Input text is encoded as UTF-8
          and hashed locally with the
          browser Web Crypto API.
        </p>

        <p className="mt-2 text-xs leading-5 text-text-muted">
          This produces a plain SHA-256
          digest. It is not encryption,
          HMAC, a digital signature, or a
          password hashing scheme.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            SHA-256 error
          </p>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {error}
          </p>
        </div>
      )}

      {hash !== null && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                SHA-256 Digest
              </p>

              <p className="mt-1 text-xs text-text-muted">
                256-bit digest shown as
                64 hexadecimal characters.
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
            <code className="break-all font-mono text-sm leading-6 text-success">
              {displayHash}
            </code>
          </div>
        </section>
      )}
    </div>
  );
}
