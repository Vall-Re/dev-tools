'use client';

import { useState, useMemo } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        charCount: 0,
        charNoSpacesCount: 0,
        wordCount: 0,
        lineCount: 0,
        paragraphCount: 0,
        byteSize: 0,
        readingTime: 0,
        speakingTime: 0,
        topWords: [],
      };
    }

    const charCount = text.length;
    const charNoSpacesCount = text.replace(/\s/g, '').length;
    const words = trimmed.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
    const wordCount = words.length;
    const lineCount = text.split('\n').length;
    const paragraphCount = text
      .split(/\n\s*\n/)
      .filter((p) => p.trim() !== '').length;
    const byteSize = new TextEncoder().encode(text).length;

    const readingTime = Math.ceil(wordCount / 200);
    const speakingTime = Math.ceil(wordCount / 130);

    const frequencyMap: Record<string, number> = {};
    words.forEach((word) => {
      if (word.length > 2) {
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
      }
    });

    const topWords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / wordCount) * 100).toFixed(1),
      }));

    return {
      charCount,
      charNoSpacesCount,
      wordCount,
      lineCount,
      paragraphCount,
      byteSize,
      readingTime,
      speakingTime,
      topWords,
    };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setText(
      `100DevToolsHub is a high-performance, privacy-focused tool collection for modern web developers. Built with Next.js, React, and Tailwind CSS, all computations run entirely in your browser without sending any data to external servers.`
    );
  };

  return (
    <div className="space-y-6 text-gray-100">
      <div className="space-y-2">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <label className="block text-sm font-medium">Input Text</label>
          <div className="flex gap-2">
            <button
              onClick={handleLoadSample}
              className="text-xs bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-300 px-3 py-1 rounded transition"
            >
              Load Sample
            </button>
            {text && (
              <button
                onClick={handleCopy}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded transition"
              >
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            )}
            {text && (
              <button
                onClick={() => setText('')}
                className="text-xs text-red-400 hover:underline px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text here to calculate length, word count, and density..."
          className="w-full h-44 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 border-gray-700 text-gray-100"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-center font-mono text-sm">
        <div className="p-3 border rounded-lg bg-gray-900 border-gray-700">
          <div className="text-xl font-bold text-blue-400">
            {stats.charCount}
          </div>
          <div className="text-xs text-gray-400 mt-1">Characters</div>
        </div>
        <div className="p-3 border rounded-lg bg-gray-900 border-gray-700">
          <div className="text-xl font-bold text-blue-400">
            {stats.charNoSpacesCount}
          </div>
          <div className="text-xs text-gray-400 mt-1">No Spaces</div>
        </div>
        <div className="p-3 border rounded-lg bg-gray-900 border-gray-700">
          <div className="text-xl font-bold text-blue-400">
            {stats.wordCount}
          </div>
          <div className="text-xs text-gray-400 mt-1">Words</div>
        </div>
        <div className="p-3 border rounded-lg bg-gray-900 border-gray-700">
          <div className="text-xl font-bold text-blue-400">
            {stats.lineCount}
          </div>
          <div className="text-xs text-gray-400 mt-1">Lines</div>
        </div>
        <div className="p-3 border rounded-lg bg-gray-900 border-gray-700">
          <div className="text-xl font-bold text-blue-400">
            {stats.paragraphCount}
          </div>
          <div className="text-xs text-gray-400 mt-1">Paragraphs</div>
        </div>
        <div className="p-3 border rounded-lg bg-gray-900 border-gray-700">
          <div className="text-xl font-bold text-blue-400">
            {stats.byteSize}
          </div>
          <div className="text-xs text-gray-400 mt-1">Bytes (UTF-8)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-gray-900 border-gray-700 space-y-2 text-xs font-mono">
          <div className="font-semibold text-sm text-gray-300 border-b pb-1 border-gray-700">
            Estimated Reading & Speaking Time
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-gray-400">Reading Time:</span>
            <span className="font-bold text-gray-200">
              ~{stats.readingTime} {stats.readingTime === 1 ? 'min' : 'mins'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Speaking Time:</span>
            <span className="font-bold text-gray-200">
              ~{stats.speakingTime} {stats.speakingTime === 1 ? 'min' : 'mins'}
            </span>
          </div>
        </div>

        {stats.topWords.length > 0 && (
          <div className="p-4 border rounded-lg bg-gray-900 border-gray-700 space-y-2 text-xs font-mono">
            <div className="font-semibold text-sm text-gray-300 border-b pb-1 border-gray-700">
              Top Keywords Density
            </div>
            <div className="space-y-1 pt-1">
              {stats.topWords.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-blue-400 font-bold">
                    {item.word}
                  </span>
                  <span className="text-gray-300">
                    {item.count}x ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}