'use client';

import { useState } from 'react';
import {
  applyEdits,
  format,
} from 'jsonc-parser';

type TemporalState =
  | 'expired'
  | 'not-active'
  | 'time-ok'
  | 'no-expiration'
  | 'invalid';

interface NumericDateInfo {
  present: boolean;
  valid: boolean;
  iso?: string;
  seconds?: number;
}

interface TokenStatus {
  state: TemporalState;
  exp: NumericDateInfo;
  iat: NumericDateInfo;
  nbf: NumericDateInfo;
  expirationRelative?: string;
  notBeforeRelative?: string;
}

const sampleJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI1MjQ2MDgwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const formatJsonText = (value: string) => {
  const edits = format(
    value,
    undefined,
    {
      tabSize: 2,
      insertSpaces: true,
      eol: '\n',
    }
  );

  return applyEdits(
    value,
    edits
  ).trim();
};

const decodeBase64Url = (
  value: string,
  segmentName: string
) => {
  if (!value) {
    throw new Error(
      `${segmentName} segment is empty.`
    );
  }

  if (
    !/^[A-Za-z0-9_-]+$/.test(value)
  ) {
    throw new Error(
      `${segmentName} contains invalid Base64URL characters.`
    );
  }

  const remainder =
    value.length % 4;

  if (remainder === 1) {
    throw new Error(
      `${segmentName} has an invalid Base64URL length.`
    );
  }

  const base64 =
    value
      .replace(/-/g, '+')
      .replace(/_/g, '/') +
    '='.repeat(
      (4 - remainder) % 4
    );

  let binary: string;

  try {
    binary = atob(base64);
  } catch {
    throw new Error(
      `${segmentName} is not valid Base64URL data.`
    );
  }

  const bytes =
    Uint8Array.from(
      binary,
      (character) =>
        character.charCodeAt(0)
    );

  try {
    return new TextDecoder(
      'utf-8',
      {
        fatal: true,
      }
    ).decode(bytes);
  } catch {
    throw new Error(
      `${segmentName} does not contain valid UTF-8 text.`
    );
  }
};

const parseJsonObject = (
  value: string,
  segmentName: string
) => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(
      `${segmentName} is not valid JSON.`
    );
  }

  if (
    parsed === null ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed)
  ) {
    throw new Error(
      `${segmentName} must decode to a JSON object.`
    );
  }

  return parsed as Record<
    string,
    unknown
  >;
};

const parseNumericDate = (
  payload: Record<string, unknown>,
  claim: 'exp' | 'iat' | 'nbf'
): NumericDateInfo => {
  if (
    !Object.prototype.hasOwnProperty.call(
      payload,
      claim
    )
  ) {
    return {
      present: false,
      valid: true,
    };
  }

  const value = payload[claim];

  if (
    typeof value !== 'number' ||
    !Number.isFinite(value)
  ) {
    return {
      present: true,
      valid: false,
    };
  }

  const date =
    new Date(value * 1000);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return {
      present: true,
      valid: false,
    };
  }

  try {
    return {
      present: true,
      valid: true,
      seconds: value,
      iso: date.toISOString(),
    };
  } catch {
    return {
      present: true,
      valid: false,
    };
  }
};

const formatDuration = (
  seconds: number
) => {
  const absolute =
    Math.max(
      0,
      Math.floor(
        Math.abs(seconds)
      )
    );

  if (absolute < 60) {
    return '<1m';
  }

  const days = Math.floor(
    absolute / 86400
  );

  const hours = Math.floor(
    (absolute % 86400) / 3600
  );

  const minutes = Math.floor(
    (absolute % 3600) / 60
  );

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }

  if (
    hours > 0 ||
    days > 0
  ) {
    parts.push(`${hours}h`);
  }

  parts.push(`${minutes}m`);

  return parts.join(' ');
};

const getTokenStatus = (
  payload: Record<string, unknown>
): TokenStatus => {
  const exp =
    parseNumericDate(
      payload,
      'exp'
    );

  const iat =
    parseNumericDate(
      payload,
      'iat'
    );

  const nbf =
    parseNumericDate(
      payload,
      'nbf'
    );

  if (
    !exp.valid ||
    !iat.valid ||
    !nbf.valid
  ) {
    return {
      state: 'invalid',
      exp,
      iat,
      nbf,
    };
  }

  const now =
    Date.now() / 1000;

  if (
    exp.present &&
    exp.seconds !== undefined &&
    exp.seconds <= now
  ) {
    return {
      state: 'expired',
      exp,
      iat,
      nbf,
      expirationRelative:
        `${formatDuration(
          now - exp.seconds
        )} ago`,
    };
  }

  if (
    nbf.present &&
    nbf.seconds !== undefined &&
    nbf.seconds > now
  ) {
    return {
      state: 'not-active',
      exp,
      iat,
      nbf,
      notBeforeRelative:
        `in ${formatDuration(
          nbf.seconds - now
        )}`,
    };
  }

  if (exp.present) {
    return {
      state: 'time-ok',
      exp,
      iat,
      nbf,
      expirationRelative:
        exp.seconds !== undefined
          ? `in ${formatDuration(
              exp.seconds - now
            )}`
          : undefined,
    };
  }

  return {
    state: 'no-expiration',
    exp,
    iat,
    nbf,
  };
};

const getStateLabel = (
  state: TemporalState
) => {
  switch (state) {
    case 'expired':
      return 'Expired';

    case 'not-active':
      return 'Not active yet';

    case 'time-ok':
      return 'Within exp / nbf window';

    case 'invalid':
      return 'Invalid time claim';

    default:
      return 'No expiration claim';
  }
};

export default function JwtDecoder() {
  const [token, setToken] =
    useState('');

  const [header, setHeader] =
    useState('');

  const [payload, setPayload] =
    useState('');

  const [error, setError] =
    useState('');

  const [status, setStatus] =
    useState<TokenStatus | null>(
      null
    );

  const [
    copiedHeader,
    setCopiedHeader,
  ] = useState(false);

  const [
    copiedPayload,
    setCopiedPayload,
  ] = useState(false);

  const resetResult = () => {
    setHeader('');
    setPayload('');
    setError('');
    setStatus(null);
    setCopiedHeader(false);
    setCopiedPayload(false);
  };

  const parseToken = (
    value: string
  ) => {
    const trimmed =
      value.trim();

    if (!trimmed) {
      resetResult();
      return;
    }

    setHeader('');
    setPayload('');
    setError('');
    setStatus(null);
    setCopiedHeader(false);
    setCopiedPayload(false);

    const parts =
      trimmed.split('.');

    if (parts.length === 5) {
      setError(
        'This appears to be a 5-part JWE token. Encrypted JWT content cannot be decoded as plain JSON claims without decryption.'
      );

      return;
    }

    if (parts.length !== 3) {
      setError(
        'Invalid compact JWT structure. This decoder expects a 3-part JWS JWT separated by two dots.'
      );

      return;
    }

    try {
      const rawHeader =
        decodeBase64Url(
          parts[0],
          'Header'
        );

      const rawPayload =
        decodeBase64Url(
          parts[1],
          'Payload'
        );

      parseJsonObject(
        rawHeader,
        'Header'
      );

      const payloadObject =
        parseJsonObject(
          rawPayload,
          'Payload'
        );

      setHeader(
        formatJsonText(
          rawHeader
        )
      );

      setPayload(
        formatJsonText(
          rawPayload
        )
      );

      setStatus(
        getTokenStatus(
          payloadObject
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to decode this JWT.'
      );

      setHeader('');
      setPayload('');
      setStatus(null);
    }
  };

  const handleCopy = async (
    value: string,
    target: 'header' | 'payload'
  ) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(
        value
      );

      if (target === 'header') {
        setCopiedHeader(true);

        window.setTimeout(
          () =>
            setCopiedHeader(
              false
            ),
          2000
        );
      } else {
        setCopiedPayload(true);

        window.setTimeout(
          () =>
            setCopiedPayload(
              false
            ),
          2000
        );
      }
    } catch {
      if (target === 'header') {
        setCopiedHeader(false);
      } else {
        setCopiedPayload(false);
      }
    }
  };

  const handleClear = () => {
    setToken('');
    resetResult();
  };

  const handleLoadSample = () => {
    setToken(sampleJwt);
    parseToken(sampleJwt);
  };

  const stateTone =
    status?.state === 'expired' ||
    status?.state === 'invalid'
      ? 'border-danger/30 bg-danger/10'
      : status?.state ===
          'not-active'
        ? 'border-warning/30 bg-warning/10'
        : 'border-success/30 bg-success/10';

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="jwt-input"
            className="text-sm font-medium"
          >
            Encoded JWT Token
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
          id="jwt-input"
          value={token}
          onChange={(event) => {
            const value =
              event.target.value;

            setToken(value);
            parseToken(value);
          }}
          placeholder="Paste a compact 3-part JWT..."
          spellCheck={false}
          className="h-36 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />
      </div>

      <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
        <p className="text-sm font-medium text-warning">
          Signature is not verified
        </p>

        <p className="mt-1 text-xs leading-5 text-text-secondary">
          This tool only decodes the
          Base64URL header and payload and
          interprets selected time claims.
          A decoded JWT must not be treated
          as authentic or trusted until its
          signature and claims are verified
          by the receiving application.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            JWT error
          </p>

          <p className="mt-2 break-words text-sm leading-6 text-text-secondary">
            {error}
          </p>
        </div>
      )}

      {status && (
        <section
          className={`rounded-xl border p-4 ${stateTone}`}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="block text-xs text-text-muted">
                Time-claim status
              </span>

              <strong className="mt-1 block text-sm">
                {getStateLabel(
                  status.state
                )}
              </strong>
            </div>

            <div>
              <span className="block text-xs text-text-muted">
                Issued At (iat)
              </span>

              <strong className="mt-1 block break-all font-mono text-xs">
                {!status.iat.present
                  ? 'Not present'
                  : status.iat.valid
                    ? status.iat.iso
                    : 'Invalid NumericDate'}
              </strong>
            </div>

            <div>
              <span className="block text-xs text-text-muted">
                Not Before (nbf)
              </span>

              <strong className="mt-1 block break-all font-mono text-xs">
                {!status.nbf.present
                  ? 'Not present'
                  : status.nbf.valid
                    ? `${status.nbf.iso}${
                        status.notBeforeRelative
                          ? ` (${status.notBeforeRelative})`
                          : ''
                      }`
                    : 'Invalid NumericDate'}
              </strong>
            </div>

            <div>
              <span className="block text-xs text-text-muted">
                Expires At (exp)
              </span>

              <strong className="mt-1 block break-all font-mono text-xs">
                {!status.exp.present
                  ? 'Not present'
                  : status.exp.valid
                    ? `${status.exp.iso}${
                        status.expirationRelative
                          ? ` (${status.expirationRelative})`
                          : ''
                      }`
                    : 'Invalid NumericDate'}
              </strong>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-text-muted">
            These indicators only compare
            exp and nbf NumericDate claims
            with the current browser time.
            They do not establish token
            validity.
          </p>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {header && (
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  Decoded Header
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  JOSE header fields such
                  as alg, typ, and kid.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    header,
                    'header'
                  )
                }
                className="rounded-lg border border-border bg-surface-800 px-3 py-1.5 text-xs font-medium transition hover:border-brand-cyan/50"
              >
                {copiedHeader
                  ? 'Copied!'
                  : 'Copy Header'}
              </button>
            </div>

            <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-brand-purple">
              {header}
            </pre>
          </section>
        )}

        {payload && (
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  Decoded Payload
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  JWT claims exactly as
                  decoded from the payload
                  JSON.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    payload,
                    'payload'
                  )
                }
                className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
              >
                {copiedPayload
                  ? 'Copied!'
                  : 'Copy Payload'}
              </button>
            </div>

            <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-success">
              {payload}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
}
