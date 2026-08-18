'use client';

import { useState, useMemo } from 'react';

const CYRILLIC_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye', ж: 'zh',
  з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
  о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
  ч: 'ch', ш: 'sh', щ: 'shch', ь: '', ю: 'yu', я: 'ya',
  ё: 'yo', ъ: '', э: 'e', ы: 'y',
};

function transliterate(str: string): string {
  return str
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC_MAP[char] ?? char)
    .join('');
}

export default function UrlSlugGenerator() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [lowercase, setLowercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => {
    if (!input.trim()) return '';

    let text = transliterate(input.trim());

    if (lowercase) {
      text = text.toLowerCase();
    }

    text = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const allowedCharsRegex = lowercase ? /[^a-z0-9 -_]/g : /[^a-zA-Z0-9 -_]/g;
    text = text.replace(allowedCharsRegex, '');

    const sepEscaped = separator === '-' ? '\\-' : '_';
    const multiSepRegex = new RegExp(`[\\s${sepEscaped}]+`, 'g');
    const trimSepRegex = new RegExp(`^${sepEscaped}+|${sepEscaped}+$`, 'g');

    return text
      .replace(multiSepRegex, separator)
      .replace(trimSepRegex, '');
  }, [input, separator, lowercase]);

  const handleCopy = async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLoadSample = () => {
    setInput('10 Best Developer Tools for Next.js in 2026!');
  };

  return (
    <div className="space-y-6 text-gray-100">
      <div className="space-y-2">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <label className="block text-sm font-medium">Input Title / Text</label>
          <div className="flex gap-2">
            <button
              onClick={handleLoadSample}
              className="text-xs bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-200 px-3 py-1 rounded transition"
            >
              Load Sample
            </button>
            {input && (
              <button
                onClick={() => setInput('')}
                className="text-xs text-red-400 hover:underline px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 10 Best Developer Tools for Next.js in 2026!"
          className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 border-gray-700 text-gray-100"
        />
      </div>

      <div className="flex flex-wrap gap-4 p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-300 font-medium">Separator:</span>
          <button
            onClick={() => setSeparator('-')}
            className={`px-2.5 py-1 text-xs rounded border transition font-mono ${
              separator === '-'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
            }`}
          >
            Dash (-)
          </button>
          <button
            onClick={() => setSeparator('_')}
            className={`px-2.5 py-1 text-xs rounded border transition font-mono ${
              separator === '_'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
            }`}
          >
            Underscore (_)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded border-gray-700 text-blue-600 focus:ring-blue-500 bg-gray-900"
            />
            <span className="text-gray-300">Lowercase only</span>
          </label>
        </div>
      </div>

      {slug && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">Generated URL Slug</label>
            <span className="text-xs text-gray-400 font-mono">{slug.length} characters</span>
          </div>

          <div className="p-3 border rounded-lg bg-gray-900 border-gray-700 text-green-400 font-mono text-sm break-all flex justify-between items-center gap-3">
            <span>{slug}</span>
            <button
              onClick={handleCopy}
              className="shrink-0 text-xs bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-700 transition border border-gray-700"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="text-xs text-gray-400 font-mono truncate">
            <span className="text-gray-500">Preview URL:</span> https://example.com/posts/{slug}
          </div>
        </div>
      )}
    </div>
  );
}