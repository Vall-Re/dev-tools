'use client';

import { useState, useMemo } from 'react';
import { format } from 'sql-formatter';

type SqlDialect = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'transactsql' | 'plsql';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [dialect, setDialect] = useState<SqlDialect>('sql');
  const [uppercase, setUppercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const formattedSql = useMemo(() => {
    if (!input.trim()) return '';
    try {
      return format(input, {
        language: dialect,
        keywordCase: uppercase ? 'upper' : 'lower',
        tabWidth: 2,
        useTabs: false,
      });
    } catch (err: unknown) {
      return `-- Syntax Error during formatting:\n${(err as Error).message}`;
    }
  }, [input, dialect, uppercase]);

  const handleCopy = async () => {
    if (!formattedSql) return;
    await navigator.clipboard.writeText(formattedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setInput(
      `select u.id, u.name, count(o.id) as total_orders from users u left join orders o on u.id = o.user_id where u.status = 'active' and u.created_at >= '2026-01-01' group by u.id, u.name having count(o.id) > 5 order by total_orders desc limit 10;`
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <label className="block text-sm font-medium">Input SQL Query</label>
          <div className="flex gap-2">
            <button
              onClick={handleLoadSample}
              className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 rounded transition"
            >
              Load Sample
            </button>
            {input && (
              <button
                onClick={() => setInput('')}
                className="text-xs text-red-500 hover:underline px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type unformatted SQL query..."
          className="w-full h-36 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />

        <div className="flex justify-between items-center flex-wrap gap-4 pt-1">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium">Dialect:</label>
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value as SqlDialect)}
              className="p-1.5 text-xs border rounded bg-white dark:bg-gray-800 dark:border-gray-700 font-mono"
            >
              <option value="sql">Standard SQL</option>
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="sqlite">SQLite</option>
              <option value="transactsql">T-SQL (SQL Server)</option>
              <option value="plsql">PL/SQL (Oracle)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            UPPERCASE Keywords
          </label>
        </div>
      </div>

      {formattedSql && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">Formatted SQL</label>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition font-medium"
            >
              {copied ? 'Copied!' : 'Copy Query'}
            </button>
          </div>
          <pre className="w-full p-4 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap select-all dark:border-gray-800 max-h-96">
            {formattedSql}
          </pre>
        </div>
      )}
    </div>
  );
}