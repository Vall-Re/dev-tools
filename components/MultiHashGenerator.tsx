'use client';

import {
  useEffect,
  useState,
} from 'react';

type HashKey =
  | 'sha1'
  | 'sha256'
  | 'sha384'
  | 'sha512';

interface HashState {
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
}

interface HashDefinition {
  key: HashKey;
  label: string;
  algorithm:
    | 'SHA-1'
    | 'SHA-256'
    | 'SHA-384'
    | 'SHA-512';
  bits: number;
  legacy?: boolean;
}

const EMPTY_HASHES: HashState = {
  sha1: '',
  sha256: '',
  sha384: '',
  sha512: '',
};

const HASH_DEFINITIONS: HashDefinition[] = [
  {
    key: 'sha1',
    label: 'SHA-1',
    algorithm: 'SHA-1',
    bits: 160,
    legacy: true,
  },
  {
    key: 'sha256',
    label: 'SHA-256',
    algorithm: 'SHA-256',
    bits: 256,
  },
  {
    key: 'sha384',
    label: 'SHA-384',
    algorithm: 'SHA-384',
    bits: 384,
  },
  {
    key: 'sha512',
    label: 'SHA-512',
    algorithm: 'SHA-512',
    bits: 512,
  },
];

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

export default function MultiHashGenerator() {
  const [text, setText] =
    useState('');

  const [
    hasInputBeenEdited,
    setHasInputBeenEdited,
  ] = useState(false);

  const [
    isUppercase,
    setIsUppercase,
  ] = useState(false);

  const [
    copiedKey,
    setCopiedKey,
  ] = useState<HashKey | null>(
    null
  );

  const [hashes, setHashes] =
    useState<HashState>(
      EMPTY_HASHES
    );

  const [error, setError] =
    useState('');

  const [isHashing, setIsHashing] =
    useState(false);

  useEffect(() => {
    if (!hasInputBeenEdited) {
      return;
    }

    let cancelled = false;

    const calculateHashes =
      async () => {
        setIsHashing(true);
        setError('');

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
              text
            );

          const results =
            await Promise.all(
              HASH_DEFINITIONS.map(
                async ({
                  key,
                  algorithm,
                }) => {
                  const digest =
                    await crypto.subtle.digest(
                      algorithm,
                      data
                    );

                  return [
                    key,
                    bufferToHex(
                      digest
                    ),
                  ] as const;
                }
              )
            );

          if (cancelled) {
            return;
          }

          const nextHashes: HashState = {
            sha1: '',
            sha256: '',
            sha384: '',
            sha512: '',
          };

          for (const [key, value] of results) {
            nextHashes[key] = value;
          }

          setHashes(nextHashes);
        } catch (err) {
          if (cancelled) {
            return;
          }

          setHashes(
            EMPTY_HASHES
          );

          setError(
            err instanceof Error
              ? err.message
              : 'Unable to generate SHA digests.'
          );
        } finally {
          if (!cancelled) {
            setIsHashing(false);
          }
        }
      };

    void calculateHashes();

    return () => {
      cancelled = true;
    };
  }, [
    text,
    hasInputBeenEdited,
  ]);

  const handleCopy = async (
    key: HashKey,
    value: string
  ) => {
    if (!value) return;

    const finalValue =
      isUppercase
        ? value.toUpperCase()
        : value;

    try {
      await navigator.clipboard.writeText(
        finalValue
      );

      setCopiedKey(key);

      window.setTimeout(() => {
        setCopiedKey((current) =>
          current === key
            ? null
            : current
        );
      }, 2000);
    } catch {
      setCopiedKey(null);
    }
  };

  const handleClear = () => {
    setText('');
    setHashes(EMPTY_HASHES);
    setError('');
    setCopiedKey(null);
    setHasInputBeenEdited(
      false
    );
    setIsHashing(false);
  };

  const handleLoadSample = () => {
    setText(sampleText);
    setHashes(EMPTY_HASHES);
    setError('');
    setCopiedKey(null);
    setHasInputBeenEdited(
      true
    );
  };

  const inputBytes =
    new TextEncoder().encode(
      text
    ).length;

  const hasHashes =
    Object.values(
      hashes
    ).some(Boolean);

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="multi-hash-input"
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

                  setCopiedKey(
                    null
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
              onClick={
                handleClear
              }
              className="text-xs font-medium text-text-muted transition-colors hover:text-danger"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          id="multi-hash-input"
          value={text}
          onChange={(
            event
          ) => {
            setText(
              event.target.value
            );

            setHasInputBeenEdited(
              true
            );

            setCopiedKey(null);
            setError('');
          }}
          placeholder="Type or paste text to generate SHA digests..."
          spellCheck={false}
          className="h-40 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />

        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-text-muted">
          <span>
            {Array.from(
              text
            ).length.toLocaleString()}{' '}
            characters
          </span>

          <span
            aria-hidden="true"
          >
            •
          </span>

          <span>
            {inputBytes.toLocaleString()}{' '}
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

      <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
        <p className="text-sm font-medium text-warning">
          SHA-1 is legacy
        </p>

        <p className="mt-1 text-xs leading-5 text-text-secondary">
          SHA-1 has known
          collision weaknesses and
          should not be used for new
          security-sensitive designs.
          SHA-256, SHA-384, and
          SHA-512 are SHA-2 digest
          algorithms.
        </p>

        <p className="mt-2 text-xs leading-5 text-text-muted">
          These are plain message
          digests. They are not
          password hashing,
          encryption, digital
          signatures, or HMAC.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            Hash error
          </p>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {error}
          </p>
        </div>
      )}

      {hasHashes && (
        <div className="space-y-4">
          {HASH_DEFINITIONS.map(
            ({
              label,
              key,
              bits,
              legacy,
            }) => {
              const value =
                hashes[key];

              const displayValue =
                isUppercase
                  ? value.toUpperCase()
                  : value;

              return (
                <section
                  key={key}
                  className="space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {label}
                      </p>

                      <span className="rounded-full border border-border bg-surface-800 px-2 py-0.5 font-mono text-[10px] text-text-muted">
                        {bits}-bit
                      </span>

                      {legacy && (
                        <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
                          Legacy
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          key,
                          value
                        )
                      }
                      className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
                    >
                      {copiedKey ===
                      key
                        ? 'Copied!'
                        : 'Copy Hash'}
                    </button>
                  </div>

                  <div className="rounded-xl border border-border bg-surface-900 p-4">
                    <code className="break-all font-mono text-sm leading-6 text-success">
                      {
                        displayValue
                      }
                    </code>
                  </div>
                </section>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
