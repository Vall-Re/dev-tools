'use client';

import { useMemo, useState } from 'react';

type CaseType =
  | 'lower'
  | 'upper'
  | 'sentence'
  | 'title'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant'
  | 'toggle';

const WORD_PATTERN =
  /[\p{L}\p{M}\p{N}]+(?:['’][\p{L}\p{M}\p{N}]+)*/gu;

const capitalizeWord = (word: string) => {
  const characters = Array.from(word);

  if (characters.length === 0) {
    return '';
  }

  const [first, ...rest] = characters;

  return first.toUpperCase() + rest.join('').toLowerCase();
};

const getIdentifierWords = (text: string) => {
  const separated = text
    .trim()
    .replace(
      /([\p{Ll}\p{N}])(\p{Lu})/gu,
      '$1 $2'
    )
    .replace(
      /(\p{Lu})(\p{Lu}\p{Ll})/gu,
      '$1 $2'
    );

  return (
    separated.match(
      /[\p{L}\p{M}\p{N}]+/gu
    ) ?? []
  );
};

const toSentenceCase = (text: string) => {
  const lower = text.toLowerCase();

  return lower.replace(
    /(^|[.!?…]["'’”)\]]*\s+|\r?\n+)(\p{L})/gu,
    (
      _match,
      prefix: string,
      letter: string
    ) => `${prefix}${letter.toUpperCase()}`
  );
};

const toTitleCase = (text: string) =>
  text
    .toLowerCase()
    .replace(
      WORD_PATTERN,
      (word) => capitalizeWord(word)
    );

const toggleCase = (text: string) =>
  Array.from(text)
    .map((character) => {
      const lower = character.toLowerCase();
      const upper = character.toUpperCase();

      if (
        character === upper &&
        character !== lower
      ) {
        return lower;
      }

      if (
        character === lower &&
        character !== upper
      ) {
        return upper;
      }

      return character;
    })
    .join('');

const transformText = (
  text: string,
  type: CaseType
) => {
  if (!text) return '';

  if (type === 'lower') {
    return text.toLowerCase();
  }

  if (type === 'upper') {
    return text.toUpperCase();
  }

  if (type === 'sentence') {
    return toSentenceCase(text);
  }

  if (type === 'title') {
    return toTitleCase(text);
  }

  if (type === 'toggle') {
    return toggleCase(text);
  }

  const words = getIdentifierWords(text);

  if (type === 'camel') {
    return words
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : capitalizeWord(word)
      )
      .join('');
  }

  if (type === 'pascal') {
    return words
      .map(capitalizeWord)
      .join('');
  }

  if (type === 'snake') {
    return words
      .map((word) => word.toLowerCase())
      .join('_');
  }

  if (type === 'kebab') {
    return words
      .map((word) => word.toLowerCase())
      .join('-');
  }

  return words
    .map((word) => word.toUpperCase())
    .join('_');
};

const caseOptions: {
  type: CaseType;
  label: string;
  mono?: boolean;
}[] = [
  {
    type: 'lower',
    label: 'lowercase',
  },
  {
    type: 'upper',
    label: 'UPPERCASE',
  },
  {
    type: 'sentence',
    label: 'Sentence case',
  },
  {
    type: 'title',
    label: 'Title Case',
  },
  {
    type: 'camel',
    label: 'camelCase',
    mono: true,
  },
  {
    type: 'pascal',
    label: 'PascalCase',
    mono: true,
  },
  {
    type: 'snake',
    label: 'snake_case',
    mono: true,
  },
  {
    type: 'kebab',
    label: 'kebab-case',
    mono: true,
  },
  {
    type: 'constant',
    label: 'CONSTANT_CASE',
    mono: true,
  },
  {
    type: 'toggle',
    label: 'tOGGLE cASE',
  },
];

export default function TextCaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] =
    useState(false);

  const stats = useMemo(() => {
    const characters = Array.from(text).length;

    const words =
      text.match(WORD_PATTERN)?.length ?? 0;

    const lines = text
      ? text.split(/\r\n|\r|\n/).length
      : 0;

    return {
      characters,
      words,
      lines,
    };
  }, [text]);

  const handleTransform = (
    type: CaseType
  ) => {
    if (!text) return;

    setText(
      transformText(text, type)
    );

    setCopied(false);
  };

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

  const handleClear = () => {
    setText('');
    setCopied(false);
  };

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="case-input"
            className="text-sm font-medium text-text-primary"
          >
            Input Text
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied
                ? 'Copied!'
                : 'Copy Text'}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!text}
              className="rounded-lg border border-border bg-surface-800 px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-danger/40 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          id="case-input"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setCopied(false);
          }}
          placeholder="Type or paste your text here..."
          className="h-48 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted">
          <span>
            {stats.characters}{' '}
            {stats.characters === 1
              ? 'Character'
              : 'Characters'}
          </span>

          <span aria-hidden="true">•</span>

          <span>
            {stats.words}{' '}
            {stats.words === 1
              ? 'Word'
              : 'Words'}
          </span>

          <span aria-hidden="true">•</span>

          <span>
            {stats.lines}{' '}
            {stats.lines === 1
              ? 'Line'
              : 'Lines'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-text-primary">
            Convert To
          </p>

          <p className="mt-1 text-xs leading-5 text-text-muted">
            Identifier formats such as
            camelCase, snake_case, and
            kebab-case normalize spaces and
            punctuation into word boundaries.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {caseOptions.map(
            ({ type, label, mono }) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  handleTransform(type)
                }
                disabled={!text}
                className={`rounded-lg border border-border bg-surface-900 px-3 py-2 text-sm text-text-secondary transition hover:border-brand-cyan/50 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 ${
                  mono ? 'font-mono' : ''
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
