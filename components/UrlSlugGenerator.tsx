'use client';

import { useState } from 'react';

export default function UrlSlugGenerator() {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');

  const generateSlug = () => {
    if (!input.trim()) return;

    const generated = input
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setSlug(generated);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input Title / Text</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 10 Best Developer Tools for Next.js in 2026!"
          className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={generateSlug}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Generate Slug
      </button>

      {slug && (
        <div>
          <label className="block text-sm font-medium mb-2">Generated URL Slug</label>
          <div className="p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm break-all flex justify-between items-center">
            <span>{slug}</span>
            <button
              onClick={() => navigator.clipboard.writeText(slug)}
              className="ml-4 text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700 transition"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}