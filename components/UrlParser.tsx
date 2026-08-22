'use client';

import {
  useMemo,
  useState,
} from 'react';

interface QueryParam {
  key: string;
  value: string;
}

interface PathSegment {
  raw: string;
  decoded: string;
}

interface ParsedUrl {
  href: string;
  origin: string;
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  effectivePort: string;
  pathname: string;
  pathSegments: PathSegment[];
  search: string;
  hash: string;
  queryParams: QueryParam[];
  assumedScheme: boolean;
}

interface ComponentRow {
  label: string;
  displayValue: string;
  copyValue?: string;
}

const sampleUrl =
  'https://demo-user:demo-pass@api.example.com:8080/v1/users/profile?id=42&role=admin&active=true#settings';

const SCHEME_PATTERN =
  /^[A-Za-z][A-Za-z0-9+.-]*:/;

const HOST_PORT_PATTERN =
  /^[A-Za-z0-9._~-]+:\d+(?:[/?#]|$)/;

const IPV6_PORT_PATTERN =
  /^\[[0-9A-Fa-f:.]+\]:\d+(?:[/?#]|$)/;

const getDefaultPort = (
  protocol: string
) => {
  switch (protocol) {
    case 'http:':
      return '80';

    case 'https:':
      return '443';

    case 'ftp:':
      return '21';

    default:
      return '';
  }
};

const safeDecodeComponent = (
  value: string
) => {
  try {
    return decodeURIComponent(
      value
    );
  } catch {
    return value;
  }
};

const normalizeUrlInput = (
  value: string
) => {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(
      'Enter a URL to parse.'
    );
  }

  if (
    trimmed.startsWith('/') &&
    !trimmed.startsWith('//')
  ) {
    throw new Error(
      'Relative paths require a base URL. Enter an absolute URL instead.'
    );
  }

  if (
    trimmed.startsWith('?') ||
    trimmed.startsWith('#')
  ) {
    throw new Error(
      'A query string or fragment alone is not an absolute URL.'
    );
  }

  if (
    trimmed.startsWith('//')
  ) {
    return {
      value: `https:${trimmed}`,
      assumedScheme: true,
    };
  }

  /*
   * Host:port is common during local
   * development and would otherwise look
   * similar to a URI scheme.
   */
  if (
    HOST_PORT_PATTERN.test(
      trimmed
    ) ||
    IPV6_PORT_PATTERN.test(
      trimmed
    )
  ) {
    return {
      value: `https://${trimmed}`,
      assumedScheme: true,
    };
  }

  if (
    SCHEME_PATTERN.test(trimmed)
  ) {
    return {
      value: trimmed,
      assumedScheme: false,
    };
  }

  return {
    value: `https://${trimmed}`,
    assumedScheme: true,
  };
};

export default function UrlParser() {
  const [
    inputUrl,
    setInputUrl,
  ] = useState('');

  const [
    copiedKey,
    setCopiedKey,
  ] = useState<string | null>(
    null
  );

  const [
    copyError,
    setCopyError,
  ] = useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const {
    parsed,
    error,
  } = useMemo(() => {
    if (!inputUrl.trim()) {
      return {
        parsed: null,
        error: '',
      };
    }

    try {
      const normalized =
        normalizeUrlInput(
          inputUrl
        );

      const url = new URL(
        normalized.value
      );

      const queryParams:
        QueryParam[] = [];

      url.searchParams.forEach(
        (value, key) => {
          queryParams.push({
            key,
            value,
          });
        }
      );

      const pathSegments =
        url.pathname
          .split('/')
          .filter(Boolean)
          .map((segment) => ({
            raw: segment,
            decoded:
              safeDecodeComponent(
                segment
              ),
          }));

      const defaultPort =
        getDefaultPort(
          url.protocol
        );

      const parsedData: ParsedUrl =
        {
          href: url.href,
          origin: url.origin,
          protocol:
            url.protocol,
          username:
            safeDecodeComponent(
              url.username
            ),
          password:
            safeDecodeComponent(
              url.password
            ),
          hostname:
            url.hostname,
          port: url.port,
          effectivePort:
            url.port ||
            defaultPort,
          pathname:
            url.pathname,
          pathSegments,
          search: url.search,
          hash: url.hash,
          queryParams,
          assumedScheme:
            normalized.assumedScheme,
        };

      return {
        parsed: parsedData,
        error: '',
      };
    } catch (err) {
      return {
        parsed: null,
        error:
          err instanceof Error
            ? err.message
            : 'Unable to parse this URL.',
      };
    }
  }, [inputUrl]);

  const handleCopy = async (
    text: string,
    key: string
  ) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(
        text
      );

      setCopiedKey(key);
      setCopyError('');

      window.setTimeout(() => {
        setCopiedKey(
          (current) =>
            current === key
              ? null
              : current
        );
      }, 1500);
    } catch {
      setCopiedKey(null);
      setCopyError(
        'Unable to copy to the clipboard.'
      );
    }
  };

  const handleLoadSample = () => {
    setInputUrl(sampleUrl);
    setCopiedKey(null);
    setCopyError('');
    setShowPassword(false);
  };

  const handleClear = () => {
    setInputUrl('');
    setCopiedKey(null);
    setCopyError('');
    setShowPassword(false);
  };

  const componentRows =
    useMemo<ComponentRow[]>(
      () => {
        if (!parsed) {
          return [];
        }

        const originDisplay =
          parsed.origin === 'null'
            ? '(no tuple origin)'
            : parsed.origin;

        const portDisplay =
          parsed.port
            ? parsed.port
            : parsed.effectivePort
              ? `${parsed.effectivePort} (default)`
              : '(none)';

        return [
          {
            label:
              'Normalized URL',
            displayValue:
              parsed.href,
            copyValue:
              parsed.href,
          },
          {
            label: 'Origin',
            displayValue:
              originDisplay,
            copyValue:
              parsed.origin ===
              'null'
                ? undefined
                : parsed.origin,
          },
          {
            label: 'Protocol',
            displayValue:
              parsed.protocol,
            copyValue:
              parsed.protocol,
          },
          {
            label: 'Hostname',
            displayValue:
              parsed.hostname ||
              '(none)',
            copyValue:
              parsed.hostname ||
              undefined,
          },
          {
            label:
              'Port (effective)',
            displayValue:
              portDisplay,
            copyValue:
              parsed.effectivePort ||
              undefined,
          },
          {
            label: 'Pathname',
            displayValue:
              parsed.pathname ||
              '/',
            copyValue:
              parsed.pathname ||
              '/',
          },
          {
            label:
              'Search Query',
            displayValue:
              parsed.search ||
              '(none)',
            copyValue:
              parsed.search ||
              undefined,
          },
          {
            label:
              'Hash / Fragment',
            displayValue:
              parsed.hash ||
              '(none)',
            copyValue:
              parsed.hash ||
              undefined,
          },
          {
            label: 'Username',
            displayValue:
              parsed.username ||
              '(none)',
            copyValue:
              parsed.username ||
              undefined,
          },
        ];
      },
      [parsed]
    );

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="url-parser-input"
            className="text-sm font-medium"
          >
            Enter URL
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

        <input
          id="url-parser-input"
          type="text"
          value={inputUrl}
          onChange={(event) => {
            setInputUrl(
              event.target.value
            );

            setCopiedKey(null);
            setCopyError('');
            setShowPassword(false);
          }}
          placeholder="https://example.com:8080/path?user=123#section"
          spellCheck={false}
          className="w-full rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />
      </div>

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          URLs are parsed with the
          browser&apos;s native URL API.
          If no scheme is supplied, this
          tool assumes{' '}
          <code className="font-mono text-brand-cyan">
            https://
          </code>
          .
        </p>

        <p className="mt-2 text-xs leading-5 text-text-muted">
          Parsing can normalize URL
          serialization, such as hostname
          casing, percent-encoding, or
          default ports. Parsing does not
          verify that the destination
          exists, is reachable, or is safe
          to visit.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            URL parse error
          </p>

          <p className="mt-2 break-words text-sm leading-6 text-text-secondary">
            {error}
          </p>
        </div>
      )}

      {copyError && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-text-secondary"
        >
          {copyError}
        </div>
      )}

      {parsed && (
        <div className="space-y-6">
          {parsed.assumedScheme && (
            <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
              <p className="text-xs leading-5 text-text-secondary">
                No explicit scheme was
                detected, so the URL was
                parsed as HTTPS.
              </p>
            </div>
          )}

          <section className="space-y-3">
            <div>
              <p className="text-sm font-medium">
                URL Components
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Values below come from the
                normalized URL
                representation.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {componentRows.map(
                ({
                  label,
                  displayValue,
                  copyValue,
                }) => (
                  <div
                    key={label}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-surface-900 p-3"
                  >
                    <div className="min-w-0">
                      <span className="block text-xs text-text-muted">
                        {label}
                      </span>

                      <span className="mt-1 block break-all font-mono text-sm text-text-secondary">
                        {
                          displayValue
                        }
                      </span>
                    </div>

                    {copyValue && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            copyValue,
                            label
                          )
                        }
                        className="shrink-0 text-xs font-medium text-brand-cyan transition-colors hover:text-text-primary"
                      >
                        {copiedKey ===
                        label
                          ? 'Copied!'
                          : 'Copy'}
                      </button>
                    )}
                  </div>
                )
              )}

              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-surface-900 p-3">
                <div className="min-w-0">
                  <span className="block text-xs text-text-muted">
                    Password
                  </span>

                  <span className="mt-1 block break-all font-mono text-sm text-text-secondary">
                    {!parsed.password
                      ? '(none)'
                      : showPassword
                        ? parsed.password
                        : '••••••••'}
                  </span>
                </div>

                {parsed.password && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="shrink-0 text-xs font-medium text-warning transition-colors hover:text-text-primary"
                  >
                    {showPassword
                      ? 'Hide'
                      : 'Show'}
                  </button>
                )}
              </div>
            </div>

            {(parsed.username ||
              parsed.password) && (
              <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
                <p className="text-xs leading-5 text-text-secondary">
                  This URL contains
                  credentials. Userinfo in
                  URLs can be exposed in
                  logs, history, screenshots,
                  or copied text. Avoid
                  placing real secrets in
                  URLs.
                </p>
              </div>
            )}
          </section>

          {parsed.pathSegments.length >
            0 && (
            <section className="space-y-3">
              <div>
                <p className="text-sm font-medium">
                  Path Segments
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Raw segments preserve
                  percent-encoding; decoded
                  values are shown
                  separately.
                </p>
              </div>

              <div className="space-y-2">
                {parsed.pathSegments.map(
                  (
                    segment,
                    index
                  ) => (
                    <div
                      key={`${segment.raw}-${index}`}
                      className="grid gap-2 rounded-xl border border-border bg-surface-900 p-3 sm:grid-cols-[auto_1fr_1fr]"
                    >
                      <span className="font-mono text-xs text-text-muted">
                        #
                        {index + 1}
                      </span>

                      <div>
                        <span className="block text-[10px] uppercase tracking-wide text-text-muted">
                          Raw
                        </span>

                        <code className="mt-1 block break-all text-xs text-brand-cyan">
                          /
                          {
                            segment.raw
                          }
                        </code>
                      </div>

                      <div>
                        <span className="block text-[10px] uppercase tracking-wide text-text-muted">
                          Decoded
                        </span>

                        <code className="mt-1 block break-all text-xs text-text-secondary">
                          /
                          {
                            segment.decoded
                          }
                        </code>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {parsed.queryParams.length >
            0 && (
            <section className="space-y-3">
              <div>
                <p className="text-sm font-medium">
                  Query Parameters
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  {
                    parsed.queryParams
                      .length
                  }{' '}
                  parameter
                  {parsed.queryParams
                    .length === 1
                    ? ''
                    : 's'}
                  . Values are decoded by
                  URLSearchParams.
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
                        Key
                      </th>

                      <th
                        scope="col"
                        className="p-3 font-medium"
                      >
                        Value
                      </th>

                      <th
                        scope="col"
                        className="p-3 text-right font-medium"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border font-mono">
                    {parsed.queryParams.map(
                      (
                        param,
                        index
                      ) => {
                        const copyKey =
                          `param-${index}`;

                        return (
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

                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(
                                    param.value,
                                    copyKey
                                  )
                                }
                                disabled={
                                  !param.value
                                }
                                className="text-xs text-text-muted transition-colors hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {copiedKey ===
                                copyKey
                                  ? 'Copied!'
                                  : 'Copy Value'}
                              </button>
                            </td>
                          </tr>
                        );
                      }
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
