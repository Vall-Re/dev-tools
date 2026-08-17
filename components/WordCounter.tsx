'use client';

import { useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const charCount = text.length;
  const charNoSpacesCount = text.replace(/\s/g, '').length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lineCount = text.trim() === '' ? 0 : text.split('\n').length;
  const paragraphCount = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim() !== '').length;
  const byteSize = new Blob([text]).size;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text here to calculate length, word count, and byte size..."
          className="w-full h-40 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center font-mono text-sm">
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="text-2xl font-bold text-blue-600">{charCount}</div>
          <div className="text-xs text-gray-500 mt-1">Characters</div>
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="text-2xl font-bold text-blue-600">{charNoSpacesCount}</div>
          <div className="text-xs text-gray-500 mt-1">Chars (no spaces)</div>
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="text-2xl font-bold text-blue-600">{wordCount}</div>
          <div className="text-xs text-gray-500 mt-1">Words</div>
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="text-2xl font-bold text-blue-600">{lineCount}</div>
          <div className="text-xs text-gray-500 mt-1">Lines</div>
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="text-2xl font-bold text-blue-600">{paragraphCount}</div>
          <div className="text-xs text-gray-500 mt-1">Paragraphs</div>
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="text-2xl font-bold text-blue-600">{byteSize}</div>
          <div className="text-xs text-gray-500 mt-1">Bytes (UTF-8)</div>
        </div>
      </div>
    </div>
  );
}
