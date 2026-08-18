'use client';

import { useState, useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function MarkdownToHtmlConverter() {
  const [markdown, setMarkdown] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Налаштування збереження рядків та безпечної генерації
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  const rawHtml = useMemo(() => {
    if (!markdown.trim()) return '';
    const parsed = marked.parse(markdown) as string;
    // Санітизація коду від XSS вразливостей
    return typeof window !== 'undefined' ? DOMPurify.sanitize(parsed) : parsed;
  }, [markdown]);

  const handleCopy = async () => {
    if (!rawHtml) return;
    await navigator.clipboard.writeText(rawHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setMarkdown(
      `# Header 1\n## Header 2\n\nThis is **bold** text and *italic* text with a [Link](https://example.com).\n\n- List Item 1\n- List Item 2\n\n\`\`\`javascript\nconsole.log("Hello, World!");\n\`\`\`\n\n> Blockquote sample`
    );
  };

  return (
    <div className="space-y-6 text-gray-100">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Input Markdown</label>
        <div className="space-x-2">
          <button
            onClick={handleLoadSample}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded transition"
          >
            Load Sample
          </button>
          <button
            onClick={() => setMarkdown('')}
            className="text-xs bg-red-950 text-red-300 border border-red-800 hover:bg-red-900 px-3 py-1 rounded transition"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="# Hello World&#10;&#10;Type Markdown here..."
        className="w-full h-48 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 border-gray-700 text-gray-100"
      />

      {rawHtml && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">HTML Output Code</label>
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition font-medium"
              >
                {copied ? 'Copied!' : 'Copy HTML'}
              </button>
            </div>
            <textarea
              readOnly
              value={rawHtml}
              className="w-full h-40 p-3 border rounded-lg bg-gray-900 border-gray-700 text-green-400 font-mono text-sm overflow-y-auto focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rendered Live Preview</label>
            <div
              className="p-4 border rounded-lg bg-gray-900 border-gray-700 text-gray-100 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: rawHtml }}
            />
          </div>
        </div>
      )}
    </div>
  );
}