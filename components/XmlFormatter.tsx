'use client';

import { useState } from 'react';

export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [copied, setCopied] = useState(false);

  const formatXmlString = (xmlDoc: Document, indentSpaces: number): string => {
    const tab = ' '.repeat(indentSpaces);

    const formatNode = (node: Node, level: number): string => {
      let indent = tab.repeat(level);

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        return text ? text : '';
      }

      if (node.nodeType === Node.COMMENT_NODE) {
        return `${indent}<!--${node.textContent}-->\n`;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        let result = `${indent}<${element.tagName}`;

        Array.from(element.attributes).forEach((attr) => {
          result += ` ${attr.name}="${attr.value}"`;
        });

        const childNodes = Array.from(element.childNodes).filter((child) => {
          return (
            child.nodeType !== Node.TEXT_NODE ||
            (child.textContent && child.textContent.trim().length > 0)
          );
        });

        if (childNodes.length === 0) {
          return `${result} />\n`;
        }

        result += '>';

        const isSingleTextChild =
          childNodes.length === 1 && childNodes[0].nodeType === Node.TEXT_NODE;

        if (isSingleTextChild) {
          result += `${childNodes[0].textContent?.trim()}</${element.tagName}>\n`;
        } else {
          result += '\n';
          childNodes.forEach((child) => {
            result += formatNode(child, level + 1);
          });
          result += `${indent}</${element.tagName}>\n`;
        }

        return result;
      }

      return '';
    };

    let result = '';
    xmlDoc.childNodes.forEach((child) => {
      result += formatNode(child, 0);
    });

    return result.trim();
  };

  const handleFormat = () => {
    if (!input.trim()) return;
    setError('');

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');
      const parseError = xmlDoc.getElementsByTagName('parsererror');

      if (parseError.length > 0) {
        setError(parseError[0].textContent || 'Invalid XML structure');
        setOutput('');
        return;
      }

      const formatted = formatXmlString(xmlDoc, indentSize);
      setOutput(formatted);
    } catch (err: unknown) {
      setError('Error processing XML: ' + (err as Error).message);
      setOutput('');
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    setError('');

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');
      const parseError = xmlDoc.getElementsByTagName('parsererror');

      if (parseError.length > 0) {
        setError(parseError[0].textContent || 'Invalid XML structure');
        setOutput('');
        return;
      }

      const minified = input
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();

      setOutput(minified);
    } catch (err: unknown) {
      setError('Error processing XML: ' + (err as Error).message);
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadSample = () => {
    setInput(
      `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book></catalog>`
    );
  };

  return (
    <div className="space-y-6 text-gray-100">
      <div className="space-y-2">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <label className="block text-sm font-medium">Input Raw XML</label>
          <div className="flex gap-2">
            <button
              onClick={handleLoadSample}
              className="text-xs bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-300 px-3 py-1 rounded transition"
            >
              Load Sample
            </button>
            {input && (
              <button
                onClick={() => {
                  setInput('');
                  setOutput('');
                  setError('');
                }}
                className="text-xs text-red-400 hover:underline px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<note><to>User</to><from>Dev</from><heading>Reminder</heading><body>Don't forget!</body></note>"
          className="w-full h-40 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 border-gray-700 text-gray-100"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleFormat}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
          >
            Format XML
          </button>
          <button
            onClick={handleMinify}
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg hover:bg-gray-700 transition font-medium text-sm"
          >
            Minify XML
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-medium text-xs">Indent:</span>
          <button
            onClick={() => setIndentSize(2)}
            className={`px-2.5 py-1 text-xs rounded border transition font-mono ${
              indentSize === 2
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
            }`}
          >
            2 spaces
          </button>
          <button
            onClick={() => setIndentSize(4)}
            className={`px-2.5 py-1 text-xs rounded border transition font-mono ${
              indentSize === 4
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
            }`}
          >
            4 spaces
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 border border-red-800 bg-red-950/30 text-red-400 rounded-lg text-sm font-mono break-all">
          <strong>Error:</strong> {error}
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">Result</label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded transition"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-xs bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded transition"
              >
                Download .XML
              </button>
            </div>
          </div>

          <pre className="w-full p-4 border rounded-lg bg-gray-900 border-gray-700 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all max-h-96">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}