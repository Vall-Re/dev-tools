'use client';

import { useState } from 'react';

export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatXml = () => {
    if (!input.trim()) return;
    setError('');

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');
      const parseError = xmlDoc.getElementsByTagName('parsererror');

      if (parseError.length > 0) {
        setError('Invalid XML structure: ' + parseError[0].textContent);
        setOutput('');
        return;
      }

      let formatted = '';
      let indent = 0;
      const tab = '  ';

      const nodes = input
        .replace(/>\s*</g, '><')
        .replace(/</g, '\n<')
        .split('\n')
        .filter((line) => line.trim().length > 0);

      nodes.forEach((node) => {
        if (node.startsWith('</')) {
          indent = Math.max(0, indent - 1);
          formatted += tab.repeat(indent) + node + '\n';
        } else if (node.startsWith('<') && !node.startsWith('<?') && !node.startsWith('<!') && !node.endsWith('/>')) {
          formatted += tab.repeat(indent) + node + '\n';
          if (!node.includes('</')) {
            indent += 1;
          }
        } else {
          formatted += tab.repeat(indent) + node + '\n';
        }
      });

      setOutput(formatted.trim());
    } catch (err: unknown) {
      setError('Error processing XML: ' + (err as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input Raw XML</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<note><to>User</to><from>Dev</from><heading>Reminder</heading><body>Don't forget!</body></note>"
          className="w-full h-36 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={formatXml}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Format XML
      </button>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono">
          <strong>Error:</strong> {error}
        </div>
      )}

      {output && (
        <div>
          <label className="block text-sm font-medium mb-2">Formatted XML</label>
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}