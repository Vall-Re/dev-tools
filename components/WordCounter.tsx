'use client';

import { useMemo, useState } from 'react';

interface SegmentResult {
  segment: string;
  isWordLike?: boolean;
}

interface SegmenterLike {
  segment(value: string): Iterable<SegmentResult>;
}

interface SegmenterConstructor {
  new (
    locales?: string | string[],
    options?: {
      granularity?: 'grapheme' | 'word';
    }
  ): SegmenterLike;
}

const getSegmenter = (
  granularity: 'grapheme' | 'word'
): SegmenterLike | null => {
  const intl = Intl as typeof Intl & {
    Segmenter?: SegmenterConstructor;
  };

  if (!intl.Segmenter) {
    return null;
  }

  return new intl.Segmenter(undefined, {
    granularity,
  });
};

const countCharacters = (value: string) => {
  const segmenter = getSegmenter('grapheme');

  if (!segmenter) {
    return Array.from(value).length;
  }

  return Array.from(
    segmenter.segment(value)
  ).length;
};

const fallbackWords = (value: string) =>
  value.match(
    /[\p{L}\p{M}\p{N}]+(?:['’ʼ][\p{L}\p{M}\p{N}]+)*/gu
  ) ?? [];

const getWords = (value: string) => {
  const segmenter = getSegmenter('word');

  if (!segmenter) {
    return fallbackWords(value);
  }

  return Array.from(
    segmenter.segment(value)
  )
    .filter(
      (entry) =>
        entry.isWordLike === true
    )
    .map((entry) => entry.segment);
};

const formatDuration = (
  totalSeconds: number
) => {
  if (totalSeconds <= 0) {
    return '0 sec';
  }

  if (totalSeconds < 60) {
    return `~${totalSeconds} sec`;
  }

  const minutes = Math.floor(
    totalSeconds / 60
  );

  const seconds =
    totalSeconds % 60;

  if (seconds === 0) {
    return `~${minutes} ${
      minutes === 1 ? 'min' : 'mins'
    }`;
  }

  return `~${minutes} ${
    minutes === 1 ? 'min' : 'mins'
  } ${seconds} sec`;
};

const sampleText =
  'Developer tools can help format data, inspect text, convert values, and automate repetitive tasks. A good tool should be fast, predictable, and easy to use directly in the browser.';

export default function WordCounter() {
  const [text, setText] =
    useState('');

  const [copied, setCopied] =
    useState(false);

  const stats = useMemo(() => {
    const normalizedNewlines =
      text.replace(/\r\n?/g, '\n');

    const words = getWords(text);

    const normalizedWords =
      words.map((word) =>
        word.toLocaleLowerCase()
      );

    const frequencyMap =
      new Map<string, number>();

    normalizedWords.forEach(
      (word) => {
        frequencyMap.set(
          word,
          (frequencyMap.get(word) ??
            0) + 1
        );
      }
    );

    const topWords =
      Array.from(
        frequencyMap.entries()
      )
        .sort((a, b) => {
          const countDifference =
            b[1] - a[1];

          if (
            countDifference !== 0
          ) {
            return countDifference;
          }

          return a[0].localeCompare(
            b[0]
          );
        })
        .slice(0, 5)
        .map(([word, count]) => ({
          word,
          count,
          percentage:
            words.length > 0
              ? (
                  (count /
                    words.length) *
                  100
                ).toFixed(1)
              : '0.0',
        }));

    const trimmed =
      normalizedNewlines.trim();

    const paragraphs = trimmed
      ? trimmed
          .split(/\n\s*\n+/)
          .filter(
            (paragraph) =>
              paragraph.trim()
                .length > 0
          ).length
      : 0;

    const readingSeconds =
      words.length > 0
        ? Math.ceil(
            (words.length / 200) *
              60
          )
        : 0;

    const speakingSeconds =
      words.length > 0
        ? Math.ceil(
            (words.length / 130) *
              60
          )
        : 0;

    return {
      charCount:
        countCharacters(text),

      charNoSpacesCount:
        countCharacters(
          text.replace(/\s/gu, '')
        ),

      wordCount: words.length,

      lineCount: text
        ? normalizedNewlines.split(
            '\n'
          ).length
        : 0,

      paragraphCount: paragraphs,

      byteSize:
        new TextEncoder().encode(
          text
        ).length,

      readingTime:
        formatDuration(
          readingSeconds
        ),

      speakingTime:
        formatDuration(
          speakingSeconds
        ),

      topWords,
    };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(
        text
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
    setText(sampleText);
    setCopied(false);
  };

  const handleClear = () => {
    setText('');
    setCopied(false);
  };

  const primaryStats = [
    {
      label: 'Characters',
      value: stats.charCount,
    },
    {
      label: 'No Whitespace',
      value:
        stats.charNoSpacesCount,
    },
    {
      label: 'Words',
      value: stats.wordCount,
    },
    {
      label: 'Lines',
      value: stats.lineCount,
    },
    {
      label: 'Paragraphs',
      value:
        stats.paragraphCount,
    },
    {
      label: 'Bytes (UTF-8)',
      value: stats.byteSize,
    },
  ];

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="word-counter-input"
            className="text-sm font-medium"
          >
            Input Text
          </label>

          <div className="flex items-center gap-2 text-xs">
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
              onClick={handleCopy}
              disabled={!text}
              className="font-medium text-success transition-colors hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied
                ? 'Copied!'
                : 'Copy Text'}
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
              disabled={!text}
              className="font-medium text-text-muted transition-colors hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          id="word-counter-input"
          value={text}
          onChange={(event) => {
            setText(
              event.target.value
            );
            setCopied(false);
          }}
          placeholder="Paste or type text here to calculate words, characters, lines, paragraphs, and reading time..."
          className="h-52 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {primaryStats.map(
          (item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border bg-surface-900 p-4 text-center"
            >
              <div className="font-mono text-xl font-semibold text-brand-cyan">
                {item.value.toLocaleString()}
              </div>

              <div className="mt-1 text-xs text-text-muted">
                {item.label}
              </div>
            </div>
          )
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface-900 p-4">
          <h3 className="text-sm font-medium text-text-primary">
            Estimated Reading &
            Speaking Time
          </h3>

          <p className="mt-1 text-xs leading-5 text-text-muted">
            Estimates use approximately
            200 words per minute for
            reading and 130 words per
            minute for speaking.
          </p>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-secondary">
                Reading
              </dt>

              <dd className="font-mono font-medium text-text-primary">
                {stats.readingTime}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-secondary">
                Speaking
              </dt>

              <dd className="font-mono font-medium text-text-primary">
                {stats.speakingTime}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-surface-900 p-4">
          <h3 className="text-sm font-medium text-text-primary">
            Most Frequent Words
          </h3>

          <p className="mt-1 text-xs leading-5 text-text-muted">
            Percentages are based on
            the total detected word
            count.
          </p>

          {stats.topWords.length >
          0 ? (
            <div className="mt-4 space-y-2">
              {stats.topWords.map(
                (item) => (
                  <div
                    key={item.word}
                    className="flex items-center justify-between gap-4 font-mono text-xs"
                  >
                    <span className="min-w-0 truncate font-semibold text-brand-cyan">
                      {item.word}
                    </span>

                    <span className="shrink-0 text-text-secondary">
                      {item.count}× (
                      {item.percentage}
                      %)
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-text-muted">
              Enter text to see word
              frequency.
            </p>
          )}
        </section>
      </div>

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          Character counting uses
          Unicode grapheme segmentation
          when supported by the browser.
          Word segmentation also uses
          the browser&apos;s Unicode-aware
          segmenter when available, with
          a Unicode regex fallback.
        </p>
      </div>
    </div>
  );
}
