'use client';

import {
  useMemo,
  useState,
} from 'react';

type Mode =
  | 'encodeComponent'
  | 'decodeComponent'
  | 'encodeUri'
  | 'decodeUri';

interface QueryParam {
  key: string;
  value: string;
}

interface ConversionResult {
  output: string;
  error: string;
  queryParams: QueryParam[];
}

interface ModeOption {
  value: Mode;
  label: string;
  shortDescription: string;
}

const MODE_OPTIONS: ModeOption[] = [
  {
    value: 'encodeComponent',
    label: 'Encode Component',
    shortDescription:
      'Encode a query value, path segment, or other URL component.',
  },
  {
    value: 'decodeComponent',
    label: 'Decode Component',
    shortDescription:
      'Decode percent-encoded component text.',
  },
  {
    value: 'encodeUri',
    label: 'Encode Full URL',
    shortDescription:
      'Encode unsafe characters while preserving URL structure.',
  },
  {
    value: 'decodeUri',
    label: 'Decode Full URL',
    shortDescription:
      'Decode a URL while preserving encoded reserved delimiters.',
  },
];

const sampleUrl =
  'https://example.com/search?q=hello world&lang=uk#results';

const getQueryParams = (
  value: string
): QueryParam[] => {
  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  const collect = (
    params: URLSearchParams
  ) => {
    const result: QueryParam[] = [];

    params.forEach(
      (paramValue, key) => {
        result.push({
          key,
          value: paramValue,
        });
      }
    );

    return result;
  };

  /*
   * Full absolute URL.
   */
  try {
    const url = new URL(trimmed);

    if (url.search) {
      return collect(
        url.searchParams
      );
    }
  } catch {
    // Continue with query-string checks.
  }

  /*
   * Standalone query string:
   * ?q=test&lang=en
   */
  if (
    trimmed.startsWith('?')
  ) {
    return collect(
      new URLSearchParams(
        trimmed.slice(1)
      )
    );
  }

  /*
   * Query-like input:
   * q=test&lang=en
   *
   * Require "=" so ordinary text is
   * not presented as a query parameter.
   */
  if (
    trimmed.includes('=') &&
    !trimmed.includes('\n') &&
    !trimmed.includes('\r')
  ) {
    return collect(
      new URLSearchParams(
        trimmed
      )
    );
  }

  return [];
};

const convertValue = (
  input: string,
  mode: Mode
) => {
  switch (mode) {
    case 'encodeComponent':
      return encodeURIComponent(
        input
      );

    case 'decodeComponent':
      return decodeURIComponent(
        input
      );

    case 'encodeUri':
      return encodeURI(input);

    case 'decodeUri':
      return decodeURI(input);
  }
};

const getErrorMessage = (
  mode: Mode
) => {
  switch (mode) {
    case 'decodeComponent':
      return 'The input contains malformed or invalid percent-encoded component data.';

    case 'decodeUri':
      return 'The input contains malformed or invalid percent-encoded URL data.';

    case 'encodeComponent':
      return 'The input could not be encoded as a URL component. Check for malformed Unicode data.';

    case 'encodeUri':
      return 'The input could not be encoded as a URL. Check for malformed Unicode data.';
  }
};

export default function UrlConverter() {
  const [input, setInput] =
    useState('');

  const [mode, setMode] =
    useState<Mode>(
      'encodeComponent'
    );

  const [copied, setCopied] =
    useState(false);

  const {
    output,
    error,
    queryParams,
  } = useMemo<ConversionResult>(() => {
    if (input.length === 0) {
      return {
        output: '',
        error: '',
        queryParams: [],
      };
    }

    try {
      const result =
        convertValue(
          input,
          mode
        );

      const sourceForParams =
        mode ===
          'decodeComponent' ||
        mode === 'decodeUri'
          ? result
          : input;

      return {
        output: result,
        error: '',
        queryParams:
          getQueryParams(
            sourceForParams
          ),
      };
    } catch {
      return {
        output: '',
        error:
          getErrorMessage(
            mode
          ),
        queryParams: [],
      };
    }
  }, [input, mode]);

  const currentMode =
    MODE_OPTIONS.find(
      (item) =>
        item.value === mode
    );

  const handleCopy =
    async () => {
      if (!output) return;

      try {
        await navigator.clipboard.writeText(
          output
        );

        setCopied(true);

        window.setTimeout(
          () => {
            setCopied(false);
          },
          2000
        );
      } catch {
        setCopied(false);
      }
    };

  const handleUseResult = () => {
    if (!output) return;

    setInput(output);
    setCopied(false);
  };

  const handleClear = () => {
    setInput('');
    setCopied(false);
  };

  const handleLoadSample =
    () => {
      setInput(sampleUrl);
      setMode('encodeUri');
      setCopied(false);
    };

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="url-converter-input"
            className="text-sm font-medium"
          >
            Input URL or Text
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
              onClick={handleClear}
              className="font-medium text-text-muted transition-colors hover:text-danger"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          id="url-converter-input"
          value={input}
          onChange={(event) => {
            setInput(
              event.target.value
            );

            setCopied(false);
          }}
          placeholder="Enter a full URL, URL component, or percent-encoded text..."
          spellCheck={false}
          className="h-40 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-text-secondary">
          Operation
        </p>

        <div className="flex flex-wrap gap-2">
          {MODE_OPTIONS.map(
            (option) => {
              const active =
                mode ===
                option.value;

              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  aria-pressed={
                    active
                  }
                  onClick={() => {
                    setMode(
                      option.value
                    );

                    setCopied(
                      false
                    );
                  }}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    active
                      ? 'border-brand-blue bg-brand-blue text-white'
                      : 'border-border bg-surface-900 text-text-secondary hover:border-brand-cyan/50 hover:text-text-primary'
                  }`}
                >
                  {
                    option.label
                  }
                </button>
              );
            }
          )}
        </div>

        {currentMode && (
          <p className="text-xs leading-5 text-text-muted">
            {
              currentMode.shortDescription
            }
          </p>
        )}
      </div>

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          Component mode applies
          JavaScript&apos;s{' '}
          <code className="font-mono text-brand-cyan">
            encodeURIComponent
          </code>{' '}
          or{' '}
          <code className="font-mono text-brand-cyan">
            decodeURIComponent
          </code>
          .
        </p>

        <p className="mt-2 text-xs leading-5 text-text-secondary">
          Full URL mode uses{' '}
          <code className="font-mono text-brand-cyan">
            encodeURI
          </code>{' '}
          or{' '}
          <code className="font-mono text-brand-cyan">
            decodeURI
          </code>{' '}
          so URL delimiters such as{' '}
          <code className="font-mono">
            :
          </code>
          ,{' '}
          <code className="font-mono">
            /
          </code>
          ,{' '}
          <code className="font-mono">
            ?
          </code>{' '}
          and{' '}
          <code className="font-mono">
            #
          </code>{' '}
          are treated differently from
          component data.
        </p>

        <p className="mt-2 text-xs leading-5 text-text-muted">
          Percent-encoding is not URL
          validation and does not make an
          untrusted URL safe to visit.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            URL encoding error
          </p>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {error}
          </p>
        </div>
      )}

      {output && (
        <div className="space-y-6">
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  Result
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  {
                    currentMode?.label
                  }
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
                  onClick={
                    handleCopy
                  }
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
          </section>

          {queryParams.length >
            0 && (
            <section className="space-y-3">
              <div>
                <p className="text-sm font-medium">
                  Detected Query
                  Parameters
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  {
                    queryParams.length
                  }{' '}
                  parameter
                  {queryParams.length ===
                  1
                    ? ''
                    : 's'}
                  , including repeated
                  keys.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border bg-surface-900">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-surface-800 text-text-muted">
                    <tr>
                      <th
                        scope="col"
                        className="p-3 font-medium"
                      >
                        Parameter
                      </th>

                      <th
                        scope="col"
                        className="p-3 font-medium"
                      >
                        Value
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border font-mono">
                    {queryParams.map(
                      (
                        param,
                        index
                      ) => (
                        <tr
                          key={`${param.key}-${index}`}
                        >
                          <td className="p-3 break-all text-brand-cyan">
                            {
                              param.key
                            }
                          </td>

                          <td className="p-3 break-all text-text-secondary">
                            {param.value ||
                              '(empty)'}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
