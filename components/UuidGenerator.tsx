'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

const DEFAULT_UUID_COUNT = 5;
const MAX_UUID_COUNT = 100;

const bytesToUuidV4 = (
  bytes: Uint8Array
) => {
  const hex = Array.from(
    bytes,
    (byte) =>
      byte
        .toString(16)
        .padStart(2, '0')
  );

  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join(''),
  ].join('-');
};

const createUuid = () => {
  if (!globalThis.crypto) {
    throw new Error(
      'The Web Crypto API is not available in this browser context.'
    );
  }

  if (
    typeof globalThis.crypto
      .randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID();
  }

  const bytes =
    new Uint8Array(16);

  globalThis.crypto.getRandomValues(
    bytes
  );

  /*
   * RFC 4122 / UUID v4:
   *
   * version = 4
   * variant = 10xx
   */
  bytes[6] =
    (bytes[6] & 0x0f) | 0x40;

  bytes[8] =
    (bytes[8] & 0x3f) | 0x80;

  return bytesToUuidV4(bytes);
};

const createUuids = (
  quantity: number
) =>
  Array.from(
    { length: quantity },
    createUuid
  );

export default function UuidGenerator() {
  const [count, setCount] =
    useState(DEFAULT_UUID_COUNT);

  const [uuids, setUuids] =
    useState<string[]>([]);

  const [
    useUppercase,
    setUseUppercase,
  ] = useState(false);

  const [
    removeHyphens,
    setRemoveHyphens,
  ] = useState(false);

  const [
    copiedIndex,
    setCopiedIndex,
  ] = useState<number | null>(
    null
  );

  const [
    copiedAll,
    setCopiedAll,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const generateUuids = (
    quantity: number
  ) => {
    try {
      const nextUuids =
        createUuids(quantity);

      setUuids(nextUuids);
      setError('');
      setCopiedIndex(null);
      setCopiedAll(false);
    } catch (err) {
      setUuids([]);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to generate UUIDs.'
      );
    }
  };

  useEffect(() => {
    /*
     * Generate after hydration so random
     * values are never part of the
     * server-rendered output.
     */
    const frameId =
      requestAnimationFrame(() => {
        generateUuids(
          DEFAULT_UUID_COUNT
        );
      });

    return () => {
      cancelAnimationFrame(
        frameId
      );
    };
  }, []);

  const formattedUuids =
    useMemo(
      () =>
        uuids.map((uuid) => {
          let result = uuid;

          if (removeHyphens) {
            result =
              result.replace(
                /-/g,
                ''
              );
          }

          if (useUppercase) {
            result =
              result.toUpperCase();
          }

          return result;
        }),
      [
        uuids,
        removeHyphens,
        useUppercase,
      ]
    );

  const handleGenerate = () => {
    generateUuids(count);
  };

  const handleCountChange = (
    value: string
  ) => {
    const parsed =
      Number.parseInt(
        value,
        10
      );

    if (
      Number.isNaN(parsed)
    ) {
      setCount(1);
      return;
    }

    setCount(
      Math.min(
        MAX_UUID_COUNT,
        Math.max(1, parsed)
      )
    );
  };

  const copyToClipboard =
    async (
      text: string,
      index: number
    ) => {
      try {
        await navigator.clipboard.writeText(
          text
        );

        setCopiedIndex(index);
        setCopiedAll(false);

        window.setTimeout(
          () => {
            setCopiedIndex(
              (current) =>
                current === index
                  ? null
                  : current
            );
          },
          1500
        );
      } catch {
        setCopiedIndex(null);
        setError(
          'Unable to copy to the clipboard.'
        );
      }
    };

  const copyAllToClipboard =
    async () => {
      if (
        formattedUuids.length === 0
      ) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          formattedUuids.join(
            '\n'
          )
        );

        setCopiedAll(true);
        setCopiedIndex(null);

        window.setTimeout(
          () => {
            setCopiedAll(false);
          },
          1500
        );
      } catch {
        setCopiedAll(false);

        setError(
          'Unable to copy to the clipboard.'
        );
      }
    };

  const downloadFile = (
    format: 'txt' | 'json'
  ) => {
    if (
      formattedUuids.length === 0
    ) {
      return;
    }

    const content =
      format === 'json'
        ? JSON.stringify(
            formattedUuids,
            null,
            2
          )
        : formattedUuids.join(
            '\n'
          );

    const mimeType =
      format === 'json'
        ? 'application/json;charset=utf-8'
        : 'text/plain;charset=utf-8';

    const blob = new Blob(
      [content],
      {
        type: mimeType,
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement('a');

    anchor.href = url;
    anchor.download =
      `uuids.${format}`;

    document.body.appendChild(
      anchor
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-text-primary">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="uuid-count"
              className="block text-xs font-medium text-text-secondary"
            >
              Quantity
            </label>

            <input
              id="uuid-count"
              type="number"
              min={1}
              max={
                MAX_UUID_COUNT
              }
              step={1}
              value={count}
              onChange={(event) =>
                handleCountChange(
                  event.target.value
                )
              }
              className="w-24 rounded-lg border border-border bg-surface-900 px-3 py-2 font-mono text-sm text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
            />
          </div>

          <button
            type="button"
            onClick={
              handleGenerate
            }
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Generate New
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface-900 p-3">
          <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={
                useUppercase
              }
              onChange={(
                event
              ) => {
                setUseUppercase(
                  event.target
                    .checked
                );

                setCopiedIndex(
                  null
                );
                setCopiedAll(
                  false
                );
              }}
              className="size-4 rounded border-border bg-surface-900 text-brand-blue focus:ring-brand-cyan"
            />

            Uppercase
          </label>

          <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={
                removeHyphens
              }
              onChange={(
                event
              ) => {
                setRemoveHyphens(
                  event.target
                    .checked
                );

                setCopiedIndex(
                  null
                );
                setCopiedAll(
                  false
                );
              }}
              className="size-4 rounded border-border bg-surface-900 text-brand-blue focus:ring-brand-cyan"
            />

            Remove hyphens
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          UUIDs are generated locally
          using the browser&apos;s
          cryptographically secure random
          number generator. The canonical
          output is UUID version 4.
        </p>

        <p className="mt-2 text-xs leading-5 text-text-muted">
          Uppercase and hyphen removal
          change only the displayed and
          copied representation. A
          hyphenless value is no longer in
          canonical UUID string format.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            UUID error
          </p>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {error}
          </p>
        </div>
      )}

      {formattedUuids.length >
        0 && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                Generated UUIDs
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {
                  formattedUuids.length
                }{' '}
                UUID
                {formattedUuids.length ===
                1
                  ? ''
                  : 's'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={
                  copyAllToClipboard
                }
                className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
              >
                {copiedAll
                  ? 'Copied All!'
                  : 'Copy All'}
              </button>

              <button
                type="button"
                onClick={() =>
                  downloadFile(
                    'txt'
                  )
                }
                className="rounded-lg border border-border bg-surface-800 px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-brand-cyan/50 hover:text-text-primary"
              >
                Download TXT
              </button>

              <button
                type="button"
                onClick={() =>
                  downloadFile(
                    'json'
                  )
                }
                className="rounded-lg border border-border bg-surface-800 px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-brand-cyan/50 hover:text-text-primary"
              >
                Download JSON
              </button>
            </div>
          </div>

          <div className="max-h-[30rem] space-y-2 overflow-y-auto pr-1">
            {formattedUuids.map(
              (uuid, index) => (
                <div
                  key={
                    uuids[index]
                  }
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-900 p-3 transition hover:border-border-strong"
                >
                  <code className="break-all font-mono text-sm text-success">
                    {uuid}
                  </code>

                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        uuid,
                        index
                      )
                    }
                    className="shrink-0 rounded-lg border border-border bg-surface-800 px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-brand-cyan/50 hover:text-text-primary"
                  >
                    {copiedIndex ===
                    index
                      ? 'Copied!'
                      : 'Copy'}
                  </button>
                </div>
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}
