'use client';

import { useMemo, useState } from 'react';

type GenType =
  | 'paragraphs'
  | 'words'
  | 'sentences'
  | 'lists';

interface GeneratedOutput {
  display: string;
  plain: string;
}

const sentences = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus, nulla gravida orci a odio.',
  'Nullam varius turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.',
  'Integer in mauris eu nibh euismod gravida.',
  'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
  'Mauris ut leo, cras dolor metus, ultrices in, egestas egestas, dapibus id, elit.',
  'Sed convallis tristique sem.',
  'Proin ut ligula vel nunc egestas porttitor.',
  'Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.',
  'Fusce ac turpis quis ligula lacinia aliquet.',
  'Praesent dapibus neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.',
];

const sourceWords = sentences
  .join(' ')
  .match(/[\p{L}\p{M}]+/gu) ?? [];

const clampCount = (value: number) =>
  Math.min(100, Math.max(1, value));

const rotateIndex = (
  index: number,
  offset: number,
  length: number
) => (index + offset) % length;

const generateSentenceSet = (
  count: number,
  startWithLorem: boolean,
  variant: number
) => {
  const result: string[] = [];

  for (let index = 0; index < count; index += 1) {
    if (index === 0 && startWithLorem) {
      result.push(sentences[0]);
      continue;
    }

    const baseOffset = startWithLorem ? 1 : 0;

    const sentenceIndex = rotateIndex(
      index + baseOffset,
      variant * 3,
      sentences.length
    );

    result.push(sentences[sentenceIndex]);
  }

  return result;
};

const generateParagraphs = (
  count: number,
  startWithLorem: boolean,
  variant: number
) => {
  const result: string[] = [];

  for (
    let paragraphIndex = 0;
    paragraphIndex < count;
    paragraphIndex += 1
  ) {
    const paragraphSentences: string[] = [];

    for (
      let sentenceIndex = 0;
      sentenceIndex < 4;
      sentenceIndex += 1
    ) {
      if (
        paragraphIndex === 0 &&
        sentenceIndex === 0 &&
        startWithLorem
      ) {
        paragraphSentences.push(sentences[0]);
        continue;
      }

      const index = rotateIndex(
        paragraphIndex * 4 +
          sentenceIndex +
          (startWithLorem ? 1 : 0),
        variant * 3,
        sentences.length
      );

      paragraphSentences.push(sentences[index]);
    }

    result.push(paragraphSentences.join(' '));
  }

  return result;
};

const generateWords = (
  count: number,
  startWithLorem: boolean,
  variant: number
) => {
  const words: string[] = [];

  if (startWithLorem && count >= 1) {
    words.push('Lorem');
  }

  if (startWithLorem && count >= 2) {
    words.push('ipsum');
  }

  let index = 0;

  while (words.length < count) {
    const sourceIndex = rotateIndex(
      index + (startWithLorem ? 2 : 0),
      variant * 7,
      sourceWords.length
    );

    words.push(sourceWords[sourceIndex].toLowerCase());
    index += 1;
  }

  if (words.length === 0) {
    return '';
  }

  const text = words.join(' ');

  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
};

const generateOutput = (
  type: GenType,
  count: number,
  startWithLorem: boolean,
  includeHtmlTags: boolean,
  variant: number
): GeneratedOutput => {
  if (type === 'paragraphs') {
    const paragraphs = generateParagraphs(
      count,
      startWithLorem,
      variant
    );

    return {
      plain: paragraphs.join('\n\n'),
      display: includeHtmlTags
        ? paragraphs
            .map((paragraph) => `<p>${paragraph}</p>`)
            .join('\n')
        : paragraphs.join('\n\n'),
    };
  }

  if (type === 'sentences') {
    const generatedSentences = generateSentenceSet(
      count,
      startWithLorem,
      variant
    );

    const plain = generatedSentences.join(' ');

    return {
      plain,
      display: includeHtmlTags
        ? `<p>${plain}</p>`
        : plain,
    };
  }

  if (type === 'words') {
    const plain = generateWords(
      count,
      startWithLorem,
      variant
    );

    return {
      plain,
      display: includeHtmlTags
        ? `<p>${plain}</p>`
        : plain,
    };
  }

  const items = generateSentenceSet(
    count,
    startWithLorem,
    variant
  ).map((sentence) =>
    sentence.replace(/[.!?]+$/, '')
  );

  return {
    plain: items.map((item) => `• ${item}`).join('\n'),
    display: includeHtmlTags
      ? `<ul>\n${items
          .map((item) => `  <li>${item}</li>`)
          .join('\n')}\n</ul>`
      : items.map((item) => `• ${item}`).join('\n'),
  };
};

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] =
    useState<GenType>('paragraphs');
  const [startWithLorem, setStartWithLorem] =
    useState(true);
  const [includeHtmlTags, setIncludeHtmlTags] =
    useState(false);
  const [variant, setVariant] = useState(0);
  const [copied, setCopied] = useState(false);

  const output = useMemo(
    () =>
      generateOutput(
        type,
        count,
        startWithLorem,
        includeHtmlTags,
        variant
      ),
    [
      type,
      count,
      startWithLorem,
      includeHtmlTags,
      variant,
    ]
  );

  const stats = useMemo(() => {
    const words =
      output.plain.match(
        /[\p{L}\p{M}\p{N}]+/gu
      )?.length ?? 0;

    return {
      words,
      characters: Array.from(output.plain).length,
    };
  }, [output.plain]);

  const handleCopy = async () => {
    if (!output.display) return;

    try {
      await navigator.clipboard.writeText(
        output.display
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleCountChange = (
    value: string
  ) => {
    const parsed = Number.parseInt(value, 10);

    setCount(
      Number.isFinite(parsed)
        ? clampCount(parsed)
        : 1
    );

    setCopied(false);
  };

  const handleRegenerate = () => {
    setVariant((current) => current + 1);
    setCopied(false);
  };

  return (
    <div className="space-y-6 text-text-primary">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-2">
          <label
            htmlFor="lorem-count"
            className="block text-sm font-medium"
          >
            Count
          </label>

          <input
            id="lorem-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) =>
              handleCountChange(event.target.value)
            }
            className="w-full rounded-xl border border-border bg-surface-900 p-3 font-mono text-sm text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
          />

          <p className="text-xs text-text-muted">
            Minimum 1, maximum 100.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="lorem-type"
            className="block text-sm font-medium"
          >
            Generate By
          </label>

          <select
            id="lorem-type"
            value={type}
            onChange={(event) => {
              setType(event.target.value as GenType);
              setCopied(false);
            }}
            className="w-full rounded-xl border border-border bg-surface-900 p-3 font-mono text-sm text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
          >
            <option value="paragraphs">
              Paragraphs
            </option>

            <option value="sentences">
              Sentences
            </option>

            <option value="words">
              Words
            </option>

            <option value="lists">
              List Items
            </option>
          </select>
        </div>

        <div className="flex flex-col justify-end gap-3 rounded-xl border border-border bg-surface-900 p-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(event) => {
                setStartWithLorem(
                  event.target.checked
                );
                setCopied(false);
              }}
              className="size-4 rounded border-border bg-surface-900 text-brand-blue focus:ring-brand-cyan"
            />

            Start with &quot;Lorem ipsum&quot;
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={includeHtmlTags}
              onChange={(event) => {
                setIncludeHtmlTags(
                  event.target.checked
                );
                setCopied(false);
              }}
              className="size-4 rounded border-border bg-surface-900 text-brand-blue focus:ring-brand-cyan"
            />

            Wrap with HTML tags
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            Generated Text
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span>
              {stats.words.toLocaleString()} Words
            </span>

            <span aria-hidden="true">•</span>

            <span>
              {stats.characters.toLocaleString()}{' '}
              Characters
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleRegenerate}
            className="rounded-lg border border-border bg-surface-800 px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-brand-cyan/50 hover:text-text-primary"
          >
            Regenerate
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
      </div>

      <textarea
        readOnly
        value={output.display}
        aria-label="Generated Lorem Ipsum text"
        spellCheck={false}
        className="h-72 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-success outline-none"
      />

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          The generator creates filler text locally in
          your browser. HTML mode wraps paragraphs and
          word/sentence output in &lt;p&gt; tags, while
          list output uses &lt;ul&gt; and &lt;li&gt;.
        </p>
      </div>
    </div>
  );
}
