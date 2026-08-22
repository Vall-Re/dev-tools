'use client';

import {
  useMemo,
  useState,
} from 'react';

import { format } from 'sql-formatter';

type SqlDialect =
  | 'sql'
  | 'mysql'
  | 'postgresql'
  | 'sqlite'
  | 'transactsql'
  | 'plsql';

interface DialectOption {
  value: SqlDialect;
  label: string;
}

interface FormatResult {
  sql: string;
  error: string;
}

const DIALECTS: DialectOption[] = [
  {
    value: 'sql',
    label: 'Basic SQL',
  },
  {
    value: 'mysql',
    label: 'MySQL',
  },
  {
    value: 'postgresql',
    label: 'PostgreSQL',
  },
  {
    value: 'sqlite',
    label: 'SQLite',
  },
  {
    value: 'transactsql',
    label: 'SQL Server (T-SQL)',
  },
  {
    value: 'plsql',
    label: 'Oracle PL/SQL',
  },
];

const sampleSql = `select
u.id,
u.name,
count(o.id) as total_orders
from users u
left join orders o on u.id = o.user_id
where u.status = 'active'
and u.created_at >= '2026-01-01'
group by u.id, u.name
having count(o.id) > 5
order by total_orders desc
limit 10;`;

export default function SqlFormatter() {
  const [input, setInput] =
    useState('');

  const [dialect, setDialect] =
    useState<SqlDialect>('sql');

  const [
    uppercaseKeywords,
    setUppercaseKeywords,
  ] = useState(true);

  const [indent, setIndent] =
    useState<2 | 4>(2);

  const [copied, setCopied] =
    useState(false);

  const result =
    useMemo<FormatResult>(() => {
      if (!input.trim()) {
        return {
          sql: '',
          error: '',
        };
      }

      try {
        return {
          sql: format(input, {
            language: dialect,
            keywordCase:
              uppercaseKeywords
                ? 'upper'
                : 'lower',
            tabWidth: indent,
            useTabs: false,
          }),
          error: '',
        };
      } catch (err) {
        return {
          sql: '',
          error:
            err instanceof Error
              ? err.message
              : 'Unable to format this SQL.',
        };
      }
    }, [
      input,
      dialect,
      uppercaseKeywords,
      indent,
    ]);

  const updateInput = (
    value: string
  ) => {
    setInput(value);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result.sql) return;

    try {
      await navigator.clipboard.writeText(
        result.sql
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
    setInput(sampleSql);
    setDialect('sql');
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
            htmlFor="sql-input"
            className="text-sm font-medium"
          >
            Input SQL
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
          id="sql-input"
          value={input}
          onChange={(event) =>
            updateInput(
              event.target.value
            )
          }
          placeholder="Paste or type SQL to format..."
          spellCheck={false}
          className="h-44 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />

        <p className="font-mono text-xs text-text-muted">
          {input.length.toLocaleString()}{' '}
          characters
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-1.5">
          <label
            htmlFor="sql-dialect"
            className="block text-xs font-medium text-text-secondary"
          >
            SQL dialect
          </label>

          <select
            id="sql-dialect"
            value={dialect}
            onChange={(event) => {
              setDialect(
                event.target
                  .value as SqlDialect
              );

              setCopied(false);
            }}
            className="w-full rounded-lg border border-border bg-surface-900 px-3 py-2 text-sm text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
          >
            {DIALECTS.map(
              ({
                value,
                label,
              }) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="sql-indent"
            className="block text-xs font-medium text-text-secondary"
          >
            Indentation
          </label>

          <select
            id="sql-indent"
            value={indent}
            onChange={(event) => {
              setIndent(
                Number(
                  event.target.value
                ) as 2 | 4
              );

              setCopied(false);
            }}
            className="w-full rounded-lg border border-border bg-surface-900 px-3 py-2 text-sm text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
          >
            <option value={2}>
              2 spaces
            </option>

            <option value={4}>
              4 spaces
            </option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex cursor-pointer select-none items-center gap-2 rounded-lg border border-border bg-surface-900 px-3 py-2.5 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={
                uppercaseKeywords
              }
              onChange={(event) => {
                setUppercaseKeywords(
                  event.target
                    .checked
                );

                setCopied(false);
              }}
              className="size-4 rounded border-border bg-surface-900 text-brand-blue focus:ring-brand-cyan"
            />

            Uppercase SQL keywords
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          Formatting is dialect-aware.
          Choose the database dialect that
          best matches the query for more
          accurate keyword and syntax
          handling.
        </p>

        <p className="mt-2 text-xs leading-5 text-text-muted">
          Basic SQL is a common subset,
          not automatic dialect detection.
          This tool formats SQL but does
          not connect to a database or
          verify tables, columns, types,
          permissions, or query semantics.
        </p>
      </div>

      {result.error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            Formatting error
          </p>

          <p className="mt-2 break-words font-mono text-sm leading-6 text-text-secondary">
            {result.error}
          </p>

          <p className="mt-2 text-xs leading-5 text-text-muted">
            The selected formatter dialect
            could not parse this input.
            This does not necessarily mean
            that the query is invalid for
            every SQL database or engine.
          </p>
        </div>
      )}

      {result.sql && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                Formatted SQL
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {
                  DIALECTS.find(
                    (item) =>
                      item.value ===
                      dialect
                  )?.label
                }{' '}
                formatting
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
            >
              {copied
                ? 'Copied!'
                : 'Copy Query'}
            </button>
          </div>

          <pre className="max-h-[32rem] w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-success">
            {result.sql}
          </pre>
        </section>
      )}
    </div>
  );
}
