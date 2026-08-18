'use client';

import { useState } from 'react';

export default function TextCaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const getWords = (str: string) => {
    return str
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .split(/\s+/)
      .filter(Boolean);
  };

  const transformCase = (type: string) => {
    if (!text) return;

    let result = '';
    const words = getWords(text);

    switch (type) {
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'sentence':
        result = text
          .toLowerCase()
          .replace(/(^\s*|\.\s*)([a-zа-яєіїґ])/g, (m) => m.toUpperCase());
        break;
      case 'title':
        result = text
          .toLowerCase()
          .replace(/(?:^|\s|-)\S/g, (m) => m.toUpperCase());
        break;
      case 'camel':
        result = words
          .map((w, i) =>
            i === 0
              ? w.toLowerCase()
              : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          )
          .join('');
        break;
      case 'pascal':
        result = words
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join('');
        break;
      case 'snake':
        result = words.map((w) => w.toLowerCase()).join('_');
        break;
      case 'kebab':
        result = words.map((w) => w.toLowerCase()).join('-');
        break;
      case 'constant':
        result = words.map((w) => w.toUpperCase()).join('_');
        break;
      case 'toggle':
        result = text
          .split('')
          .map((c) =>
            c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
          )
          .join('');
        break;
      default:
        result = text;
    }

    setText(result);
  };

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text ? text.split('\n').length : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Input Text</label>
          <div className="flex items-center gap-3">
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
                className="text-xs text-red-500 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-40 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />

        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>{charCount} Characters</span>
          <span>•</span>
          <span>{wordCount} Words</span>
          <span>•</span>
          <span>{lineCount} Lines</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Convert To:</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => transformCase('lower')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm transition"
          >
            lowercase
          </button>
          <button
            onClick={() => transformCase('upper')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm transition"
          >
            UPPERCASE
          </button>
          <button
            onClick={() => transformCase('sentence')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm transition"
          >
            Sentence case
          </button>
          <button
            onClick={() => transformCase('title')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm transition"
          >
            Title Case
          </button>
          <button
            onClick={() => transformCase('camel')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm transition font-mono"
          >
            camelCase
          </button>
          <button
            onClick={() => transformCase('pascal')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm transition font-mono"
          >
            PascalCase
          </button>
          <button
            onClick={() => transformCase('snake')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm transition font-mono"
          >
            snake_case
          </button>
          <button
            onClick={() => transformCase('kebab')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm transition font-mono"
          >
            kebab-case
          </button>
          <button
            onClick={() => transformCase('constant')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm transition font-mono"
          >
            CONSTANT_CASE
          </button>
          <button
            onClick={() => transformCase('toggle')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm transition"
          >
            tOGGLE cASE
          </button>
        </div>
      </div>
    </div>
  );
}