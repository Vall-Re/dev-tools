'use client';

import { useState } from 'react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');

  const testRegex = () => {
    if (!pattern || !testText) return;
    setError('');
    try {
      const regex = new RegExp(pattern, flags);
      const foundMatches = testText.match(regex);
      setMatches(foundMatches ? Array.from(foundMatches) : []);
    } catch (err: unknown) {
      setError('Invalid Regular Expression: ' + (err as Error).message);
      setMatches([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-2">Regex Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g, i, m"
            className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Test String</label>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Paste string here to test matches..."
          className="w-full h-32 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={testRegex}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Test Regular Expression
      </button>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono">
          <strong>Error:</strong> {error}
        </div>
      )}

      {matches.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Matches Found ({matches.length})</label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {matches.map((match, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm break-all"
              >
                Match {index + 1}: {match}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}