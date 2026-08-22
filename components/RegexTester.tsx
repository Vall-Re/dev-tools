'use client';

import {
  useMemo,
  useState,
} from 'react';

interface MatchDetail {
  text: string;
  index: number;
  groups: Array<string | undefined>;
  namedGroups: Record<
    string,
    string | undefined
  >;
}

interface Preset {
  label: string;
  pattern: string;
  flags: string;
}

const COMMON_PRESETS: Preset[] = [
  {
    label: 'Email-like',
    pattern:
      '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}',
    flags: 'gi',
  },
  {
    label: 'HTTP URL',
    pattern:
      'https?://[^\\s<>"\']+',
    flags: 'gi',
  },
  {
    label: 'IPv4',
    pattern:
      '\\b(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\b',
    flags: 'g',
  },
  {
    label: 'Digits',
    pattern: '\\d+',
    flags: 'g',
  },
];

const FLAG_OPTIONS = [
  {
    flag: 'g',
    label: 'Global',
  },
  {
    flag: 'i',
    label: 'Ignore case',
  },
  {
    flag: 'm',
    label: 'Multiline',
  },
  {
    flag: 's',
    label: 'Dot all',
  },
  {
    flag: 'u',
    label: 'Unicode',
  },
] as const;

const sampleText = `Contact alice@example.com or admin@test.dev.

Visit https://example.com/docs.

Server addresses:
192.168.1.10
255.255.255.255
999.999.999.999`;

const advanceStringIndex = (
  value: string,
  index: number,
  unicode: boolean
) => {
  if (!unicode) {
    return index + 1;
  }

  if (index + 1 >= value.length) {
    return index + 1;
  }

  const first =
    value.charCodeAt(index);

  if (
    first < 0xd800 ||
    first > 0xdbff
  ) {
    return index + 1;
  }

  const second =
    value.charCodeAt(
      index + 1
    );

  if (
    second < 0xdc00 ||
    second > 0xdfff
  ) {
    return index + 1;
  }

  return index + 2;
};

export default function RegexTester() {
  const [pattern, setPattern] =
    useState('');

  const [flags, setFlags] =
    useState('gi');

  const [testText, setTestText] =
    useState('');

  const toggleFlag = (
    flag: string
  ) => {
    setFlags((current) =>
      current.includes(flag)
        ? current.replace(
            flag,
            ''
          )
        : `${current}${flag}`
    );
  };

  const {
    error,
    matchDetails,
  } = useMemo(() => {
    if (!pattern) {
      return {
        error: '',
        matchDetails:
          [] as MatchDetail[],
      };
    }

    let regex: RegExp;

    try {
      regex = new RegExp(
        pattern,
        flags
      );
    } catch (err) {
      return {
        error:
          err instanceof Error
            ? err.message
            : 'Invalid regular expression.',
        matchDetails:
          [] as MatchDetail[],
      };
    }

    if (testText.length === 0) {
      return {
        error: '',
        matchDetails:
          [] as MatchDetail[],
      };
    }

    const results: MatchDetail[] =
      [];

    try {
      if (!regex.global) {
        const match =
          regex.exec(testText);

        if (match) {
          results.push({
            text: match[0],
            index: match.index,
            groups:
              match.slice(1),
            namedGroups: {
              ...(match.groups ??
                {}),
            },
          });
        }

        return {
          error: '',
          matchDetails:
            results,
        };
      }

      let match:
        | RegExpExecArray
        | null;

      while (
        (match =
          regex.exec(
            testText
          )) !== null
      ) {
        results.push({
          text: match[0],
          index: match.index,
          groups:
            match.slice(1),
          namedGroups: {
            ...(match.groups ??
              {}),
          },
        });

        /*
         * Global expressions that
         * produce an empty match do
         * not consume input. Advance
         * manually to avoid an
         * infinite loop.
         */
        if (
          match[0].length === 0
        ) {
          regex.lastIndex =
            advanceStringIndex(
              testText,
              regex.lastIndex,
              regex.unicode
            );
        }
      }

      return {
        error: '',
        matchDetails:
          results,
      };
    } catch (err) {
      return {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to evaluate this regular expression.',
        matchDetails:
          [] as MatchDetail[],
      };
    }
  }, [
    pattern,
    flags,
    testText,
  ]);

  const highlightedText =
    useMemo(() => {
      if (
        !testText ||
        !pattern ||
        error ||
        matchDetails.length === 0
      ) {
        return testText;
      }

      const parts:
        React.ReactNode[] = [];

      let cursor = 0;

      matchDetails.forEach(
        (match, index) => {
          if (
            match.index >
            cursor
          ) {
            parts.push(
              testText.slice(
                cursor,
                match.index
              )
            );
          }

          if (
            match.text.length ===
            0
          ) {
            parts.push(
              <span
                key={`zero-${match.index}-${index}`}
                title={`Zero-length match at index ${match.index}`}
                className="mx-0.5 inline-block h-4 border-l-2 border-warning align-middle"
                aria-label={`Zero-length match at index ${match.index}`}
              />
            );

            cursor =
              match.index;

            return;
          }

          parts.push(
            <mark
              key={`match-${match.index}-${index}`}
              className="rounded bg-warning/80 px-0.5 font-semibold text-surface-950"
            >
              {match.text}
            </mark>
          );

          cursor =
            match.index +
            match.text.length;
        }
      );

      if (
        cursor <
        testText.length
      ) {
        parts.push(
          testText.slice(cursor)
        );
      }

      return parts;
    }, [
      testText,
      pattern,
      error,
      matchDetails,
    ]);

  const handleLoadSample =
    () => {
      setPattern(
        '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}'
      );
      setFlags('gi');
      setTestText(
        sampleText
      );
    };

  const handleClear = () => {
    setPattern('');
    setFlags('gi');
    setTestText('');
  };

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">
            Presets
          </p>

          <div className="flex flex-wrap gap-2">
            {COMMON_PRESETS.map(
              (preset) => (
                <button
                  key={
                    preset.label
                  }
                  type="button"
                  onClick={() => {
                    setPattern(
                      preset.pattern
                    );
                    setFlags(
                      preset.flags
                    );
                  }}
                  className="rounded-lg border border-border bg-surface-900 px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-brand-cyan/50 hover:text-text-primary"
                >
                  {preset.label}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
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
            onClick={handleClear}
            className="font-medium text-text-muted transition-colors hover:text-danger"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="regex-pattern"
          className="text-sm font-medium"
        >
          Regular Expression
        </label>

        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="flex items-center rounded-xl border border-border bg-surface-900 font-mono focus-within:border-brand-cyan focus-within:ring-2 focus-within:ring-brand-cyan/20">
            <span className="pl-4 text-text-muted">
              /
            </span>

            <input
              id="regex-pattern"
              type="text"
              value={pattern}
              onChange={(
                event
              ) =>
                setPattern(
                  event.target
                    .value
                )
              }
              placeholder="e.g. \d+"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent px-2 py-3 font-mono text-sm text-text-primary outline-none"
            />

            <span className="pr-4 text-text-muted">
              /{flags}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-surface-900 p-1">
            {FLAG_OPTIONS.map(
              ({
                flag,
                label,
              }) => {
                const active =
                  flags.includes(
                    flag
                  );

                return (
                  <button
                    key={flag}
                    type="button"
                    title={label}
                    aria-label={`${label} flag`}
                    aria-pressed={
                      active
                    }
                    onClick={() =>
                      toggleFlag(
                        flag
                      )
                    }
                    className={`rounded-lg px-3 py-2 font-mono text-xs font-semibold transition ${
                      active
                        ? 'bg-brand-blue text-white'
                        : 'text-text-muted hover:bg-surface-800 hover:text-text-primary'
                    }`}
                  >
                    {flag}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <p className="text-xs leading-5 text-text-muted">
          Flags use native JavaScript
          RegExp behavior. Without the
          global (
          <code className="font-mono">
            g
          </code>
          ) flag, only the first match is
          returned.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="regex-test-text"
          className="text-sm font-medium"
        >
          Test Text
        </label>

        <textarea
          id="regex-test-text"
          value={testText}
          onChange={(
            event
          ) =>
            setTestText(
              event.target.value
            )
          }
          placeholder="Paste text to test the expression against..."
          spellCheck={false}
          className="h-40 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />
      </div>

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          This tester uses the browser&apos;s
          native JavaScript RegExp engine.
          Presets are practical examples,
          not full validators for every
          possible email address or URL.
        </p>

        <p className="mt-2 text-xs leading-5 text-text-muted">
          Some pathological regular
          expressions can require significant
          processing time on long input.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            RegExp error
          </p>

          <p className="mt-2 break-words font-mono text-sm leading-6 text-text-secondary">
            {error}
          </p>
        </div>
      )}

      {testText.length > 0 &&
        !error && (
          <div className="space-y-6">
            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium">
                  Match Highlighting
                </p>

                <span className="font-mono text-xs text-text-muted">
                  {
                    matchDetails.length
                  }{' '}
                  {matchDetails.length ===
                  1
                    ? 'match'
                    : 'matches'}
                </span>
              </div>

              <div className="min-h-24 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary">
                {highlightedText}
              </div>
            </section>

            <section className="space-y-3">
              <p className="text-sm font-medium">
                Match Details
              </p>

              {matchDetails.length ===
              0 ? (
                <div className="rounded-xl border border-border bg-surface-900 p-4 text-sm text-text-muted">
                  No matches found.
                </div>
              ) : (
                <div className="max-h-80 space-y-3 overflow-y-auto">
                  {matchDetails.map(
                    (
                      match,
                      index
                    ) => {
                      const namedEntries =
                        Object.entries(
                          match.namedGroups
                        );

                      return (
                        <article
                          key={`${match.index}-${index}`}
                          className="space-y-3 rounded-xl border border-border bg-surface-900 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-medium text-text-secondary">
                              Match #
                              {index +
                                1}
                            </span>

                            <span className="font-mono text-xs text-text-muted">
                              index{' '}
                              {
                                match.index
                              }
                            </span>
                          </div>

                          <code className="block break-all font-mono text-sm text-success">
                            {match.text ||
                              '(zero-length match)'}
                          </code>

                          {match.groups
                            .length >
                            0 && (
                            <div className="border-t border-border pt-3">
                              <p className="mb-2 text-xs text-text-muted">
                                Capture
                                groups
                              </p>

                              <div className="space-y-1 font-mono text-xs text-brand-cyan">
                                {match.groups.map(
                                  (
                                    group,
                                    groupIndex
                                  ) => (
                                    <div
                                      key={
                                        groupIndex
                                      }
                                      className="break-all"
                                    >
                                      $
                                      {groupIndex +
                                        1}
                                      :{' '}
                                      {group ===
                                      undefined
                                        ? '(unmatched)'
                                        : group}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {namedEntries.length >
                            0 && (
                            <div className="border-t border-border pt-3">
                              <p className="mb-2 text-xs text-text-muted">
                                Named
                                groups
                              </p>

                              <div className="space-y-1 font-mono text-xs text-brand-purple">
                                {namedEntries.map(
                                  ([
                                    name,
                                    value,
                                  ]) => (
                                    <div
                                      key={
                                        name
                                      }
                                      className="break-all"
                                    >
                                      {name}
                                      :{' '}
                                      {value ===
                                      undefined
                                        ? '(unmatched)'
                                        : value}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    }
                  )}
                </div>
              )}
            </section>
          </div>
        )}
    </div>
  );
}
