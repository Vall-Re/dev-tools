'use client';

import { useState, useMemo } from 'react';

type MatchDetail = {
  text: string;
  index: number;
  groups: string[];
};

const COMMON_PRESETS = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'gi' },
  { label: 'URL', pattern: 'https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(/\\S*)?', flags: 'gi' },
  { label: 'IPv4', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b', flags: 'g' },
  { label: 'Digits', pattern: '\\d+', flags: 'g' },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('gi');
  const [testText, setTestText] = useState('');

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, '') : prev + flag
    );
  };

  const { matches, error, matchDetails } = useMemo(() => {
    if (!pattern || !testText) {
      return { matches: [], error: '', matchDetails: [] };
    }

    try {
      const activeFlags = flags.includes('g') ? flags : flags + 'g';
      const regex = new RegExp(pattern, activeFlags);

      const matchesArray: MatchDetail[] = [];
      let match: RegExpExecArray | null;

      while ((match = regex.exec(testText)) !== null) {
        matchesArray.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1),
        });

        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }

      return {
        matches: matchesArray.map((m) => m.text),
        error: '',
        matchDetails: matchesArray,
      };
    } catch (err: unknown) {
      return {
        matches: [],
        error: (err as Error).message,
        matchDetails: [],
      };
    }
  }, [pattern, flags, testText]);

  const renderHighlightedText = () => {
    if (!testText) return null;
    if (!pattern || error || matchDetails.length === 0) return testText;

    const parts = [];
    let lastIndex = 0;

    matchDetails.forEach((m, idx) => {
      if (m.index > lastIndex) {
        parts.push(testText.slice(lastIndex, m.index));
      }
      parts.push(
        <mark
          key={idx}
          className="bg-yellow-300 text-gray-900 font-semibold rounded px-0.5"
        >
          {m.text}
        </mark>
      );
      lastIndex = m.index + m.text.length;
    });

    if (lastIndex < testText.length) {
      parts.push(testText.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <label className="block text-sm font-medium">Presets</label>
          <div className="flex gap-2 flex-wrap">
            {COMMON_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setPattern(preset.pattern);
                  setFlags(preset.flags);
                }}
                className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 rounded transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3">
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="flex items-center gap-1 border p-1 rounded-lg dark:border-gray-700 justify-around bg-gray-50 dark:bg-gray-800">
            {['g', 'i', 'm', 's'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFlag(f)}
                className={`px-2.5 py-1 text-xs font-mono rounded font-bold transition ${
                  flags.includes(f)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Test Text</label>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Paste string here to test matches..."
          className="w-full h-32 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono">
          <strong>RegEx Error:</strong> {error}
        </div>
      )}

      {testText && !error && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Interactive Highlighting</label>
            <div className="p-3 border rounded-lg bg-gray-900 text-gray-200 font-mono text-sm whitespace-pre-wrap break-all min-h-[5rem] overflow-y-auto">
              {renderHighlightedText()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Matches Found ({matches.length})
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {matchDetails.map((match, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm break-all space-y-1 dark:border-gray-800"
                >
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Match #{index + 1}</span>
                    <span>Index: {match.index}</span>
                  </div>
                  <div>{match.text}</div>
                  {match.groups.length > 0 && (
                    <div className="text-xs text-blue-400 pt-1 border-t border-gray-800">
                      Groups: {match.groups.map((g, gi) => `$${gi + 1}: ${g}`).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}