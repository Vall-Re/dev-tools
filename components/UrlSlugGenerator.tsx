'use client';

import { useMemo, useState } from 'react';

type Separator = '-' | '_';

const UKRAINIAN_MAP: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',

  // Common Russian-specific Cyrillic letters.
  ё: 'yo',
  ъ: '',
  э: 'e',
  ы: 'y',
};

const CONTEXTUAL_UKRAINIAN_MAP: Record<
  string,
  {
    start: string;
    inside: string;
  }
> = {
  є: {
    start: 'ye',
    inside: 'ie',
  },
  ї: {
    start: 'yi',
    inside: 'i',
  },
  й: {
    start: 'y',
    inside: 'i',
  },
  ю: {
    start: 'yu',
    inside: 'iu',
  },
  я: {
    start: 'ya',
    inside: 'ia',
  },
};

const isLetterOrNumber = (character: string) =>
  /[\p{L}\p{N}]/u.test(character);

const preserveSourceCase = (
  source: string,
  transliterated: string
) => {
  if (!transliterated) {
    return '';
  }

  const isUppercase =
    source === source.toUpperCase() &&
    source !== source.toLowerCase();

  if (!isUppercase) {
    return transliterated;
  }

  const characters =
    Array.from(transliterated);

  return (
    characters[0].toUpperCase() +
    characters.slice(1).join('')
  );
};

const transliterateCyrillic = (
  input: string
) => {
  const characters =
    Array.from(input);

  let result = '';
  let wordStarted = false;

  for (
    let index = 0;
    index < characters.length;
    index += 1
  ) {
    const character =
      characters[index];

    const lower =
      character.toLowerCase();

    const next =
      characters[index + 1];

    /*
     * Ukrainian apostrophes are omitted
     * during transliteration but do not
     * start a new word.
     */
    if (
      character === "'" ||
      character === '’' ||
      character === 'ʼ' ||
      character === '`'
    ) {
      continue;
    }

    /*
     * Ukrainian "зг" is represented as
     * "zgh" to distinguish it from "ж".
     */
    if (
      lower === 'з' &&
      next?.toLowerCase() === 'г'
    ) {
      result += preserveSourceCase(
        character,
        'zgh'
      );

      index += 1;
      wordStarted = true;
      continue;
    }

    const contextual =
      CONTEXTUAL_UKRAINIAN_MAP[lower];

    if (contextual) {
      const transliterated =
        wordStarted
          ? contextual.inside
          : contextual.start;

      result += preserveSourceCase(
        character,
        transliterated
      );

      wordStarted = true;
      continue;
    }

    const mapped =
      UKRAINIAN_MAP[lower];

    if (mapped !== undefined) {
      result += preserveSourceCase(
        character,
        mapped
      );

      if (mapped) {
        wordStarted = true;
      }

      continue;
    }

    result += character;

    if (isLetterOrNumber(character)) {
      wordStarted = true;
    } else {
      wordStarted = false;
    }
  }

  return result;
};

const stripLatinDiacritics = (
  input: string
) =>
  input
    .normalize('NFD')
    .replace(
      /(\p{Script=Latin})\p{M}+/gu,
      '$1'
    )
    .normalize('NFC');

const generateSlug = (
  input: string,
  separator: Separator,
  lowercase: boolean
) => {
  if (!input.trim()) {
    return '';
  }

  let text =
    transliterateCyrillic(
      input.trim()
    );

  text =
    stripLatinDiacritics(text);

  if (lowercase) {
    text =
      text.toLocaleLowerCase();
  }

  /*
   * Apostrophes join words rather than
   * creating separators:
   * developer's -> developers
   */
  text = text.replace(
    /['’ʼ`]+/gu,
    ''
  );

  /*
   * Every run of characters that is not
   * a Unicode letter, mark, or number
   * becomes exactly one separator.
   *
   * This also normalizes existing:
   * spaces, -, _, punctuation and emoji.
   */
  let slug = text.replace(
    /[^\p{L}\p{M}\p{N}]+/gu,
    separator
  );

  if (separator === '-') {
    slug = slug.replace(
      /^-+|-+$/g,
      ''
    );
  } else {
    slug = slug.replace(
      /^_+|_+$/g,
      ''
    );
  }

  return slug;
};

const sampleText =
  '10 Best Developer Tools for Next.js in 2026!';

export default function UrlSlugGenerator() {
  const [input, setInput] =
    useState('');

  const [separator, setSeparator] =
    useState<Separator>('-');

  const [lowercase, setLowercase] =
    useState(true);

  const [copied, setCopied] =
    useState(false);

  const slug = useMemo(
    () =>
      generateSlug(
        input,
        separator,
        lowercase
      ),
    [
      input,
      separator,
      lowercase,
    ]
  );

  const handleCopy = async () => {
    if (!slug) return;

    try {
      await navigator.clipboard.writeText(
        slug
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleLoadSample = () => {
    setInput(sampleText);
    setCopied(false);
  };

  const handleClear = () => {
    setInput('');
    setCopied(false);
  };

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="slug-input"
            className="text-sm font-medium"
          >
            Input Title / Text
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

        <input
          id="slug-input"
          type="text"
          value={input}
          onChange={(event) => {
            setInput(
              event.target.value
            );
            setCopied(false);
          }}
          placeholder="e.g. 10 Best Developer Tools for Next.js in 2026!"
          spellCheck={false}
          className="w-full rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface-900 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-text-secondary">
            Separator
          </span>

          <button
            type="button"
            onClick={() => {
              setSeparator('-');
              setCopied(false);
            }}
            aria-pressed={
              separator === '-'
            }
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
              separator === '-'
                ? 'border-brand-blue bg-brand-blue text-white'
                : 'border-border bg-surface-800 text-text-secondary hover:border-brand-cyan/50'
            }`}
          >
            Dash (-)
          </button>

          <button
            type="button"
            onClick={() => {
              setSeparator('_');
              setCopied(false);
            }}
            aria-pressed={
              separator === '_'
            }
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
              separator === '_'
                ? 'border-brand-blue bg-brand-blue text-white'
                : 'border-border bg-surface-800 text-text-secondary hover:border-brand-cyan/50'
            }`}
          >
            Underscore (_)
          </button>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-xs text-text-secondary">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(event) => {
              setLowercase(
                event.target.checked
              );
              setCopied(false);
            }}
            className="size-4 rounded border-border bg-surface-900 text-brand-blue focus:ring-brand-cyan"
          />

          Lowercase only
        </label>
      </div>

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          Ukrainian Cyrillic is
          transliterated to Latin,
          common Latin diacritics are
          normalized, and other Unicode
          letters are preserved. Spaces,
          punctuation, emoji, and existing
          separators are normalized into
          the selected separator.
        </p>
      </div>

      {slug ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium">
              Generated URL Slug
            </p>

            <span className="font-mono text-xs text-text-muted">
              {Array.from(slug).length}{' '}
              characters
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-900 p-4">
            <span className="min-w-0 break-all font-mono text-sm text-success">
              {slug}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
            >
              {copied
                ? 'Copied!'
                : 'Copy'}
            </button>
          </div>

          <div className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs text-text-muted">
            <span className="text-text-secondary">
              Preview URL:
            </span>{' '}
            https://example.com/posts/
            {slug}
          </div>
        </div>
      ) : input ? (
        <div
          role="status"
          className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-text-secondary"
        >
          The input does not contain
          characters that can be used in a
          URL slug.
        </div>
      ) : null}
    </div>
  );
}
