'use client';

import { useState } from 'react';

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'words'>('paragraphs');
  const [output, setOutput] = useState('');

  const sampleParagraphs = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.',
    'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris ut leo. Cras dolor metus, ultrices in, egestas egestas, dapibus id, elit. Integer vel magna.',
    'Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet.'
  ];

  const generateLorem = () => {
    if (count <= 0) return;

    if (type === 'paragraphs') {
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(sampleParagraphs[i % sampleParagraphs.length]);
      }
      setOutput(result.join('\n\n'));
    } else {
      const allWords = sampleParagraphs.join(' ').split(' ');
      const resultWords = [];
      for (let i = 0; i < count; i++) {
        resultWords.push(allWords[i % allWords.length]);
      }
      setOutput(resultWords.join(' '));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Count</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Generate By</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'paragraphs' | 'words')}
            className="w-full p-3 border rounded-lg bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={generateLorem}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
          >
            Generate Placeholder Text
          </button>
        </div>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Generated Text</label>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
            >
              Copy Text
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-48 p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-y-auto"
          />
        </div>
      )}
    </div>
  );
}
