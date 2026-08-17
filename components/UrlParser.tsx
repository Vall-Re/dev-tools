'use client';

import { useState } from 'react';

interface ParsedUrl {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  queryParams: Array<{ key: string; value: string }>;
}

export default function UrlParser() {
  const [inputUrl, setInputUrl] = useState('');
  const [parsed, setParsed] = useState<ParsedUrl | null>(null);
  const [error, setError] = useState('');

  const parseUrl = () => {
    if (!inputUrl.trim()) return;
    setError('');

    try {
      const url = new URL(inputUrl.trim());
      const queryParams: Array<{ key: string; value: string }> = [];

      url.searchParams.forEach((value, key) => {
        queryParams.push({ key, value });
      });

      setParsed({
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || '(default)',
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        queryParams,
      });
    } catch {
      setError('Invalid URL format. Make sure to include protocol (e.g. https://).');
      setParsed(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Enter URL</label>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://example.com:8080/path/to/page?user=123&sort=asc#section"
          className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={parseUrl}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Parse URL
      </button>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono">
          <strong>Error:</strong> {error}
        </div>
      )}

      {parsed && (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-gray-50 space-y-2 text-sm font-mono">
            <div><strong>Protocol:</strong> {parsed.protocol}</div>
            <div><strong>Hostname:</strong> {parsed.hostname}</div>
            <div><strong>Port:</strong> {parsed.port}</div>
            <div><strong>Pathname:</strong> {parsed.pathname}</div>
            <div><strong>Search Query:</strong> {parsed.search || '(none)'}</div>
            <div><strong>Hash / Fragment:</strong> {parsed.hash || '(none)'}</div>
          </div>

          {parsed.queryParams.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Query Parameters</label>
              <table className="w-full text-left border-collapse border border-gray-200 font-mono text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-200">Key</th>
                    <th className="p-2 border border-gray-200">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.queryParams.map((param, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-200 font-semibold">{param.key}</td>
                      <td className="p-2 border border-gray-200 break-all">{param.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}