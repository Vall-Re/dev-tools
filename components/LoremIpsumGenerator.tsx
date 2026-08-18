'use client';

import { useState, useEffect, useCallback } from 'react';

type GenType = 'paragraphs' | 'words' | 'sentences' | 'lists';

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<GenType>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [includeHtmlTags, setIncludeHtmlTags] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const sampleParagraphs = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.',
    'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris ut leo. Cras dolor metus, ultrices in, egestas egestas, dapibus id, elit. Integer vel magna.',
    'Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet.'
  ];

  const generateLorem = useCallback(() => {
    if (count <= 0) {
      setOutput('');
      return;
    }

    let result = '';

    if (type === 'paragraphs') {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        let p = sampleParagraphs[i % sampleParagraphs.length];
        if (i === 0 && !startWithLorem) {
          p = p.replace(/^Lorem ipsum dolor sit amet, /, 'Consectetur ');
        }
        if (includeHtmlTags) {
          p = `<p>${p}</p>`;
        }
        paragraphs.push(p);
      }
      result = paragraphs.join('\n\n');
    } else if (type === 'words') {
      const allWords = sampleParagraphs.join(' ').replace(/[.,]/g, '').split(/\s+/);
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(allWords[i % allWords.length]);
      }
      if (startWithLorem && words.length >= 2) {
        words[0] = 'lorem';
        words[1] = 'ipsum';
      }
      let text = words.join(' ');
      text = text.charAt(0).toUpperCase() + text.slice(1) + '.';
      result = includeHtmlTags ? `<p>${text}</p>` : text;
    } else if (type === 'sentences') {
      const allSentences = sampleParagraphs.join(' ').split(/(?<=\.)\s+/);
      const sentences = [];
      for (let i = 0; i < count; i++) {
        sentences.push(allSentences[i % allSentences.length]);
      }
      let text = sentences.join(' ');
      if (!startWithLorem && text.startsWith('Lorem ipsum dolor sit amet, ')) {
        text = text.replace('Lorem ipsum dolor sit amet, ', 'Consectetur ');
      }
      result = includeHtmlTags ? `<p>${text}</p>` : text;
    } else if (type === 'lists') {
      const allSentences = sampleParagraphs.join(' ').split(/(?<=\.)\s+/);
      const items = [];
      for (let i = 0; i < count; i++) {
        let item = allSentences[i % allSentences.length].replace(/\.$/, '');
        items.push(includeHtmlTags ? `  <li>${item}</li>` : `• ${item}`);
      }
      result = includeHtmlTags ? `<ul>\n${items.join('\n')}\n</ul>` : items.join('\n');
    }

    setOutput(result);
  }, [count, type, startWithLorem, includeHtmlTags]);

  useEffect(() => {
    generateLorem();
  }, [generateLorem]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStats = () => {
    if (!output) return { words: 0, chars: 0 };
    const plainText = output.replace(/<[^>]*>/g, '');
    const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
    const chars = plainText.length;
    return { words, chars };
  };

  const stats = getStats();

  return (
    <div className="space-y-4 text-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Count</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 border-gray-700 text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Generate By</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as GenType)}
            className="w-full p-3 border rounded-lg bg-gray-900 border-gray-700 text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
            <option value="lists">List Items</option>
          </select>
        </div>

        <div className="flex flex-col justify-end space-y-2 py-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-gray-300">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 bg-gray-900 border-gray-700"
            />
            Start with "Lorem ipsum"
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-gray-300">
            <input
              type="checkbox"
              checked={includeHtmlTags}
              onChange={(e) => setIncludeHtmlTags(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 bg-gray-900 border-gray-700"
            />
            Wrap with HTML tags
          </label>
        </div>

        <div className="flex items-end">
          <button
            onClick={generateLorem}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
          >
            Regenerate
          </button>
        </div>
      </div>

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="font-medium text-sm text-gray-100">Generated Text</span>
              <span>•</span>
              <span>{stats.words} Words</span>
              <span>•</span>
              <span>{stats.chars} Characters</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition font-medium"
            >
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-56 p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-y-auto focus:outline-none border-gray-700"
          />
        </div>
      )}
    </div>
  );
}