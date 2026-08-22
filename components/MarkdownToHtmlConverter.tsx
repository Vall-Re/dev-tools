'use client';

import { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface ConversionResult {
  html: string;
  error: string;
}

const sampleMarkdown = `# Markdown Preview

This is **bold**, *italic*, and ~~strikethrough~~ text.

Visit [Example](https://example.com).

## List

- First item
- Second item
- Third item

## Task list

- [x] Parse Markdown
- [ ] Review HTML output

## Table

| Tool | Status |
| --- | --- |
| Markdown | Ready |
| HTML | Generated |

## Code

\`\`\`javascript
const message = "Hello, World!";
console.log(message);
\`\`\`

> Blockquote example`;

export default function MarkdownToHtmlConverter() {
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);

  const conversion = useMemo<ConversionResult>(() => {
    if (!markdown.trim()) {
      return {
        html: '',
        error: '',
      };
    }

    try {
      const normalizedMarkdown = markdown.replace(
        /^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,
        ''
      );

      const parsed = marked.parse(normalizedMarkdown, {
        breaks: true,
        gfm: true,
        async: false,
      }) as string;

      const sanitized = DOMPurify.sanitize(parsed, {
        USE_PROFILES: {
          html: true,
        },
        SANITIZE_NAMED_PROPS: true,
        FORBID_TAGS: ['style'],
        FORBID_ATTR: ['style'],
      });

      return {
        html: sanitized,
        error: '',
      };
    } catch (error) {
      return {
        html: '',
        error:
          error instanceof Error
            ? error.message
            : 'Unable to convert this Markdown.',
      };
    }
  }, [markdown]);

  const handleCopy = async () => {
    if (!conversion.html) return;

    try {
      await navigator.clipboard.writeText(conversion.html);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleLoadSample = () => {
    setMarkdown(sampleMarkdown);
    setCopied(false);
  };

  const handleClear = () => {
    setMarkdown('');
    setCopied(false);
  };

  return (
    <div className="space-y-6 text-text-primary">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label
          htmlFor="markdown-input"
          className="text-sm font-medium text-text-primary"
        >
          Input Markdown
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
        id="markdown-input"
        value={markdown}
        onChange={(event) => {
          setMarkdown(event.target.value);
          setCopied(false);
        }}
        placeholder={'# Hello World\n\nType Markdown here...'}
        spellCheck={false}
        className="h-52 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
      />

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          Markdown is converted to HTML and sanitized before
          it is displayed or copied. Potentially unsafe HTML
          such as scripts and event handlers is removed.
        </p>
      </div>

      {conversion.error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            Markdown error
          </p>

          <p className="mt-2 break-words text-sm leading-6 text-text-secondary">
            {conversion.error}
          </p>
        </div>
      )}

      {conversion.html && (
        <div className="space-y-6">
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Sanitized HTML Output
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  This is the HTML used by the preview below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
              >
                {copied ? 'Copied!' : 'Copy HTML'}
              </button>
            </div>

            <textarea
              readOnly
              value={conversion.html}
              aria-label="Converted HTML output"
              spellCheck={false}
              className="h-48 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-success outline-none"
            />
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Rendered Live Preview
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Preview generated from the sanitized HTML output.
              </p>
            </div>

            <div
              className="min-h-32 overflow-auto rounded-xl border border-border bg-surface-900 p-5 text-text-primary [&_a]:text-brand-cyan [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-brand-purple [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-surface-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:my-3 [&_pre]:my-4 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface-950 [&_pre]:p-4 [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:bg-surface-800 [&_th]:p-2 [&_ul]:list-disc"
              dangerouslySetInnerHTML={{
                __html: conversion.html,
              }}
            />
          </section>
        </div>
      )}
    </div>
  );
}
