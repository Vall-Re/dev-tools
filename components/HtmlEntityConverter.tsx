'use client';

import { useState } from 'react';

type Operation = 'encode' | 'decode' | null;

const sampleHtml = `<div class="container">
  <h1>Hello & Welcome!</h1>
  <p>Price: 100 € & special characters: "quotes", 'single quotes', 🚀</p>
</div>`;

const BASIC_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const encodeHtmlEntities = (
  value: string,
  encodeNonAscii: boolean
) =>
  Array.from(value)
    .map((character) => {
      const basicEntity =
        BASIC_ENTITIES[character];

      if (basicEntity) {
        return basicEntity;
      }

      if (encodeNonAscii) {
        const codePoint =
          character.codePointAt(0);

        if (
          codePoint !== undefined &&
          codePoint > 0x7f
        ) {
          return `&#${codePoint};`;
        }
      }

      return character;
    })
    .join('');

const decodeHtmlEntities = (
  value: string
) => {
  /*
   * A textarea provides browser-native
   * HTML character reference decoding
   * without executing decoded markup.
   */
  const textarea =
    document.createElement('textarea');

  textarea.innerHTML = value;

  return textarea.value;
};

export default function HtmlEntityConverter() {
  const [input, setInput] =
    useState('');

  const [output, setOutput] =
    useState('');

  const [copied, setCopied] =
    useState(false);

  const [
    encodeNonAscii,
    setEncodeNonAscii,
  ] = useState(false);

  const [operation, setOperation] =
    useState<Operation>(null);

  const resetResult = () => {
    setOutput('');
    setCopied(false);
    setOperation(null);
  };

  const handleEncode = () => {
    if (input.length === 0) {
      resetResult();
      return;
    }

    setOutput(
      encodeHtmlEntities(
        input,
        encodeNonAscii
      )
    );

    setCopied(false);
    setOperation('encode');
  };

  const handleDecode = () => {
    if (input.length === 0) {
      resetResult();
      return;
    }

    setOutput(
      decodeHtmlEntities(input)
    );

    setCopied(false);
    setOperation('decode');
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
    setInput(sampleHtml);
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
            htmlFor="html-entity-input"
            className="text-sm font-medium"
          >
            Input Text / HTML Entities
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
          id="html-entity-input"
          value={input}
          onChange={(event) => {
            setInput(
              event.target.value
            );

            resetResult();
          }}
          placeholder="Enter plain text or HTML character references..."
          spellCheck={false}
          className="h-44 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleEncode}
            disabled={
              input.length === 0
            }
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Encode Entities
          </button>

          <button
            type="button"
            onClick={handleDecode}
            disabled={
              input.length === 0
            }
            className="rounded-lg border border-border bg-surface-800 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-brand-cyan/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Decode Entities
          </button>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-xs text-text-secondary">
          <input
            type="checkbox"
            checked={encodeNonAscii}
            onChange={(event) => {
              setEncodeNonAscii(
                event.target.checked
              );

              resetResult();
            }}
            className="size-4 rounded border-border bg-surface-900 text-brand-blue focus:ring-brand-cyan"
          />

          Encode non-ASCII as numeric entities
        </label>
      </div>

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          Encoding always escapes
          &amp;, &lt;, &gt;, double quotes,
          and single quotes. Optional
          non-ASCII encoding uses Unicode
          code points, including characters
          such as emoji.
        </p>

        <p className="mt-2 text-xs leading-5 text-text-muted">
          HTML entity encoding is not an
          HTML sanitizer and does not by
          itself make untrusted HTML safe
          to render.
        </p>
      </div>

      {output && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                {operation === 'encode'
                  ? 'Encoded HTML Entities'
                  : 'Decoded Text'}
              </p>

              <p className="mt-1 font-mono text-xs text-text-muted">
                {Array.from(
                  output
                ).length.toLocaleString()}{' '}
                characters
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={
                  handleUseResult
                }
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
