'use client';

import { useState, useMemo } from 'react';

interface ParsedUrl {
  origin: string;
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  pathSegments: string[];
  search: string;
  hash: string;
  queryParams: Array<{ key: string; value: string }>;
}

export default function UrlParser() {
  const [inputUrl, setInputUrl] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { parsed, error } = useMemo(() => {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      return { parsed: null, error: '' };
    }

    let urlToParse = trimmed;
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
      urlToParse = `https://${trimmed}`;
    }

    try {
      const url = new URL(urlToParse);
      const queryParams: Array<{ key: string; value: string }> = [];

      url.searchParams.forEach((value, key) => {
        queryParams.push({ key, value });
      });

      const pathSegments = url.pathname.split('/').filter(Boolean);

      const parsedData: ParsedUrl = {
        origin: url.origin,
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port || '(default)',
        pathname: url.pathname,
        pathSegments,
        search: url.search,
        hash: url.hash,
        queryParams,
      };

      return { parsed: parsedData, error: '' };
    } catch {
      return {
        parsed: null,
        error: 'Invalid URL structure. Please check syntax.',
      };
    }
  }, [inputUrl]);

  const handleCopy = async (text: string, label: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleLoadSample = () => {
    setInputUrl(
      'https://admin:secret@api.example.com:8080/v1/users/profile?id=42&role=admin&active=true#settings'
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <label className="block text-sm font-medium">Enter URL</label>
          <div className="flex gap-2">
            <button
              onClick={handleLoadSample}
              className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 rounded transition"
            >
              Load Sample
            </button>
            {inputUrl && (
              <button
                onClick={() => setInputUrl('')}
                className="text-xs text-red-500 hover:underline px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="e.g. https://example.com:8080/path?user=123#section"
          className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono">
          <strong>Error:</strong> {error}
        </div>
      )}

      {parsed && (
        <div className="space-y-6">
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 space-y-3">
            <h3 className="text-sm font-semibold border-b pb-2 dark:border-gray-700">
              URL Components
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-mono">
              {[
                { label: 'Origin', val: parsed.origin },
                { label: 'Protocol', val: parsed.protocol },
                { label: 'Hostname', val: parsed.hostname },
                { label: 'Port', val: parsed.port },
                { label: 'Pathname', val: parsed.pathname },
                { label: 'Search Query', val: parsed.search || '(none)' },
                { label: 'Hash / Fragment', val: parsed.hash || '(none)' },
                { label: 'Username', val: parsed.username || '(none)' },
                { label: 'Password', val: parsed.password || '(none)' },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  className="flex justify-between items-center p-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-700 gap-2"
                >
                  <div className="truncate">
                    <span className="text-gray-500 text-xs block">{label}</span>
                    <span className="text-gray-800 dark:text-gray-200">{val}</span>
                  </div>
                  {val && val !== '(none)' && (
                    <button
                      onClick={() => handleCopy(val, label)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                    >
                      {copiedKey === label ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {parsed.pathSegments.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Path Segments ({parsed.pathSegments.length})</label>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {parsed.pathSegments.map((segment, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-md"
                  >
                    /{segment}
                  </span>
                ))}
              </div>
            </div>
          )}

          {parsed.queryParams.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Query Parameters ({parsed.queryParams.length})
              </label>
              <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    <tr>
                      <th className="p-2.5">Key</th>
                      <th className="p-2.5">Value</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {parsed.queryParams.map((param, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-2.5 font-bold text-blue-600 dark:text-blue-400">
                          {param.key}
                        </td>
                        <td className="p-2.5 text-gray-800 dark:text-gray-200 break-all">
                          {param.value}
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() =>
                              handleCopy(`${param.key}=${param.value}`, `param-${index}`)
                            }
                            className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                          >
                            {copiedKey === `param-${index}` ? 'Copied!' : 'Copy'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}