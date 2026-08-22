'use client';

import { useState } from 'react';

type Operation = 'format' | 'minify' | null;

const XML_NAMESPACE =
  'http://www.w3.org/XML/1998/namespace';

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<?catalog version="1"?>
<catalog xmlns:meta="https://example.com/meta">
  <!-- Catalog comment -->
  <book id="bk101" meta:status="active">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <description><![CDATA[Text with <tags> & symbols]]></description>
    <empty />
  </book>
</catalog>`;

const getXmlDeclaration = (input: string) => {
  const match = input.match(
    /^\uFEFF?\s*(<\?xml[\s\S]*?\?>)/i
  );

  return match?.[1] ?? '';
};

const getParseError = (
  document: Document
): string | null => {
  const root = document.documentElement;

  if (
    root?.localName === 'parsererror'
  ) {
    return (
      root.textContent?.trim() ||
      'Invalid XML structure.'
    );
  }

  const possibleError =
    document.getElementsByTagName(
      'parsererror'
    )[0];

  if (
    possibleError &&
    possibleError.namespaceURI?.includes(
      'parsererror'
    )
  ) {
    return (
      possibleError.textContent?.trim() ||
      'Invalid XML structure.'
    );
  }

  return null;
};

const getPreserveWhitespace = (
  element: Element,
  inherited: boolean
) => {
  const explicit =
    element.getAttributeNS(
      XML_NAMESPACE,
      'space'
    ) ??
    element.getAttribute('xml:space');

  if (explicit === 'preserve') {
    return true;
  }

  if (explicit === 'default') {
    return false;
  }

  return inherited;
};

const escapeAttribute = (
  value: string
) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/\r/g, '&#xD;')
    .replace(/\n/g, '&#xA;')
    .replace(/\t/g, '&#x9;');

const serializeStartTag = (
  element: Element
) => {
  const attributes = Array.from(
    element.attributes
  )
    .map(
      (attribute) =>
        ` ${attribute.name}="${escapeAttribute(
          attribute.value
        )}"`
    )
    .join('');

  return `<${element.tagName}${attributes}>`;
};

const formatXmlDocument = (
  document: Document,
  input: string,
  indentSize: number
) => {
  const declaration =
    getXmlDeclaration(input);

  const serializer =
    new XMLSerializer();

  const indentUnit =
    ' '.repeat(indentSize);

  const formatNode = (
    node: Node,
    level: number,
    inheritedPreserve = false
  ): string => {
    const indent =
      indentUnit.repeat(level);

    if (
      node.nodeType ===
      Node.DOCUMENT_TYPE_NODE
    ) {
      return (
        indent +
        serializer.serializeToString(
          node
        )
      );
    }

    if (
      node.nodeType ===
      Node.PROCESSING_INSTRUCTION_NODE
    ) {
      const instruction =
        node as ProcessingInstruction;

      if (
        instruction.target.toLowerCase() ===
        'xml'
      ) {
        return '';
      }

      return `${indent}<?${instruction.target}${
        instruction.data
          ? ` ${instruction.data}`
          : ''
      }?>`;
    }

    if (
      node.nodeType ===
      Node.COMMENT_NODE
    ) {
      return `${indent}<!--${
        node.nodeValue ?? ''
      }-->`;
    }

    if (
      node.nodeType ===
      Node.CDATA_SECTION_NODE
    ) {
      return `${indent}<![CDATA[${
        node.nodeValue ?? ''
      }]]>`;
    }

    if (
      node.nodeType ===
      Node.TEXT_NODE
    ) {
      return (
        indent +
        serializer.serializeToString(
          node
        )
      );
    }

    if (
      node.nodeType !==
      Node.ELEMENT_NODE
    ) {
      return '';
    }

    const element = node as Element;

    const preserve =
      getPreserveWhitespace(
        element,
        inheritedPreserve
      );

    const children = Array.from(
      element.childNodes
    );

    const hasStructuralChild =
      children.some(
        (child) =>
          child.nodeType ===
            Node.ELEMENT_NODE ||
          child.nodeType ===
            Node.COMMENT_NODE ||
          child.nodeType ===
            Node.PROCESSING_INSTRUCTION_NODE
      );

    const hasNonWhitespaceText =
      children.some(
        (child) =>
          child.nodeType ===
            Node.TEXT_NODE &&
          /\S/.test(
            child.nodeValue ?? ''
          )
      );

    const hasAnyText =
      children.some(
        (child) =>
          child.nodeType ===
          Node.TEXT_NODE
      );

    const hasCdata = children.some(
      (child) =>
        child.nodeType ===
        Node.CDATA_SECTION_NODE
    );

    const mustPreserveContent =
      preserve ||
      hasNonWhitespaceText ||
      hasCdata ||
      (!hasStructuralChild &&
        hasAnyText);

    /*
     * Mixed content and whitespace-sensitive
     * elements are serialized without inserting
     * formatting whitespace.
     */
    if (mustPreserveContent) {
      return (
        indent +
        serializer.serializeToString(
          element
        )
      );
    }

    const structuralChildren =
      children.filter(
        (child) =>
          !(
            child.nodeType ===
              Node.TEXT_NODE &&
            !/\S/.test(
              child.nodeValue ?? ''
            )
          )
      );

    if (
      structuralChildren.length === 0
    ) {
      const startTag =
        serializeStartTag(element);

      return (
        indent +
        startTag.replace(/>$/, '/>')
      );
    }

    const startTag =
      serializeStartTag(element);

    const formattedChildren =
      structuralChildren
        .map((child) =>
          formatNode(
            child,
            level + 1,
            preserve
          )
        )
        .filter(Boolean)
        .join('\n');

    return `${indent}${startTag}\n${formattedChildren}\n${indent}</${element.tagName}>`;
  };

  const parts: string[] = [];

  if (declaration) {
    parts.push(declaration);
  }

  Array.from(document.childNodes)
    .map((node) =>
      formatNode(node, 0)
    )
    .filter(Boolean)
    .forEach((value) =>
      parts.push(value)
    );

  return parts.join('\n');
};

const minifyXmlDocument = (
  document: Document,
  input: string
) => {
  const declaration =
    getXmlDeclaration(input);

  const cloned =
    document.cloneNode(
      true
    ) as Document;

  const removeFormattingWhitespace = (
    node: Node,
    inheritedPreserve = false
  ) => {
    if (
      node.nodeType !==
      Node.ELEMENT_NODE
    ) {
      return;
    }

    const element = node as Element;

    const preserve =
      getPreserveWhitespace(
        element,
        inheritedPreserve
      );

    const children = Array.from(
      element.childNodes
    );

    const hasStructuralChild =
      children.some(
        (child) =>
          child.nodeType ===
            Node.ELEMENT_NODE ||
          child.nodeType ===
            Node.COMMENT_NODE ||
          child.nodeType ===
            Node.PROCESSING_INSTRUCTION_NODE
      );

    const hasNonWhitespaceText =
      children.some(
        (child) =>
          child.nodeType ===
            Node.TEXT_NODE &&
          /\S/.test(
            child.nodeValue ?? ''
          )
      );

    const hasCdata = children.some(
      (child) =>
        child.nodeType ===
        Node.CDATA_SECTION_NODE
    );

    if (
      !preserve &&
      hasStructuralChild &&
      !hasNonWhitespaceText &&
      !hasCdata
    ) {
      children.forEach(
        (child) => {
          if (
            child.nodeType ===
              Node.TEXT_NODE &&
            !/\S/.test(
              child.nodeValue ?? ''
            )
          ) {
            element.removeChild(
              child
            );
          }
        }
      );
    }

    Array.from(
      element.children
    ).forEach((child) =>
      removeFormattingWhitespace(
        child,
        preserve
      )
    );
  };

  if (cloned.documentElement) {
    removeFormattingWhitespace(
      cloned.documentElement
    );
  }

  const serializer =
    new XMLSerializer();

  const body = Array.from(
    cloned.childNodes
  )
    .filter((node) => {
      if (
        node.nodeType !==
        Node.PROCESSING_INSTRUCTION_NODE
      ) {
        return true;
      }

      return (
        (
          node as ProcessingInstruction
        ).target.toLowerCase() !==
        'xml'
      );
    })
    .map((node) =>
      serializer.serializeToString(
        node
      )
    )
    .join('');

  return declaration
    ? `${declaration}${body}`
    : body;
};

export default function XmlFormatter() {
  const [input, setInput] =
    useState('');
  const [output, setOutput] =
    useState('');
  const [error, setError] =
    useState('');
  const [indentSize, setIndentSize] =
    useState<2 | 4>(2);
  const [copied, setCopied] =
    useState(false);
  const [operation, setOperation] =
    useState<Operation>(null);

  const resetResult = () => {
    setOutput('');
    setError('');
    setCopied(false);
    setOperation(null);
  };

  const parseXml = () => {
    const parser =
      new DOMParser();

    const document =
      parser.parseFromString(
        input,
        'application/xml'
      );

    const parseError =
      getParseError(document);

    if (parseError) {
      throw new Error(parseError);
    }

    return document;
  };

  const handleFormat = () => {
    if (!input.trim()) return;

    setError('');
    setOutput('');
    setCopied(false);

    try {
      const document = parseXml();

      setOutput(
        formatXmlDocument(
          document,
          input,
          indentSize
        )
      );

      setOperation('format');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to format this XML.'
      );

      setOperation(null);
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;

    setError('');
    setOutput('');
    setCopied(false);

    try {
      const document = parseXml();

      setOutput(
        minifyXmlDocument(
          document,
          input
        )
      );

      setOperation('minify');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to minify this XML.'
      );

      setOperation(null);
    }
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(
        output
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob(
      [output],
      {
        type: 'application/xml;charset=utf-8',
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement('a');

    anchor.href = url;
    anchor.download =
      operation === 'minify'
        ? 'minified.xml'
        : 'formatted.xml';

    document.body.appendChild(
      anchor
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const handleLoadSample = () => {
    setInput(sampleXml);
    resetResult();
  };

  const handleClear = () => {
    setInput('');
    resetResult();
  };

  const inputBytes =
    new Blob([input]).size;

  const outputBytes =
    new Blob([output]).size;

  const savedBytes =
    operation === 'minify'
      ? Math.max(
          0,
          inputBytes -
            outputBytes
        )
      : 0;

  const savedPercent =
    operation === 'minify' &&
    inputBytes > 0
      ? Math.max(
          0,
          Math.round(
            ((inputBytes -
              outputBytes) /
              inputBytes) *
              100
          )
        )
      : 0;

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="xml-input"
            className="text-sm font-medium"
          >
            Input XML
          </label>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={
                handleLoadSample
              }
              className="font-medium text-brand-cyan transition-colors hover:text-text-primary"
            >
              Load Sample
            </button>

            <span
              aria-hidden="true"
              className="text-text-muted"
            >
              /
            </span>

            <button
              type="button"
              onClick={handleClear}
              className="font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          id="xml-input"
          value={input}
          onChange={(event) => {
            setInput(
              event.target.value
            );
            resetResult();
          }}
          placeholder='<?xml version="1.0"?><note><to>User</to><body>Reminder</body></note>'
          spellCheck={false}
          className="h-52 w-full resize-y rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
        />

        <p className="text-xs text-text-muted">
          {inputBytes.toLocaleString()}{' '}
          bytes input
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleFormat}
            disabled={!input.trim()}
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Format XML
          </button>

          <button
            type="button"
            onClick={handleMinify}
            disabled={!input.trim()}
            className="rounded-lg border border-border bg-surface-800 px-4 py-2 text-sm font-medium text-text-primary transition hover:border-brand-cyan/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Minify XML
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">
            Indent
          </span>

          {[2, 4].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                setIndentSize(
                  size as 2 | 4
                )
              }
              aria-pressed={
                indentSize === size
              }
              className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
                indentSize === size
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : 'border-border bg-surface-900 text-text-secondary hover:border-brand-cyan/50'
              }`}
            >
              {size} spaces
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-4">
        <p className="text-xs leading-5 text-text-secondary">
          Formatting preserves
          mixed-content text, CDATA,
          processing instructions, comments,
          namespaces, and XML whitespace
          marked with xml:space=&quot;preserve&quot;.
          Minification removes formatting
          whitespace conservatively rather
          than collapsing text content.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            XML error
          </p>

          <p className="mt-2 break-words text-sm leading-6 text-text-secondary">
            {error}
          </p>
        </div>
      )}

      {output && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                {operation ===
                'minify'
                  ? 'Minified XML'
                  : 'Formatted XML'}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {outputBytes.toLocaleString()}{' '}
                bytes output
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
              >
                {copied
                  ? 'Copied!'
                  : 'Copy'}
              </button>

              <button
                type="button"
                onClick={
                  handleDownload
                }
                className="rounded-lg border border-border bg-surface-800 px-3 py-1.5 text-xs font-medium transition hover:border-brand-cyan/50"
              >
                Download .xml
              </button>
            </div>
          </div>

          {operation ===
            'minify' && (
            <div className="grid gap-3 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-4 sm:grid-cols-3">
              <div>
                <span className="block text-xs text-text-muted">
                  Input
                </span>

                <strong className="mt-1 block font-mono text-sm">
                  {inputBytes.toLocaleString()}{' '}
                  bytes
                </strong>
              </div>

              <div>
                <span className="block text-xs text-text-muted">
                  Output
                </span>

                <strong className="mt-1 block font-mono text-sm">
                  {outputBytes.toLocaleString()}{' '}
                  bytes
                </strong>
              </div>

              <div>
                <span className="block text-xs text-text-muted">
                  Saved
                </span>

                <strong className="mt-1 block font-mono text-sm">
                  {savedBytes.toLocaleString()}{' '}
                  bytes ({savedPercent}%)
                </strong>
              </div>
            </div>
          )}

          <pre className="max-h-[32rem] w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-surface-900 p-4 font-mono text-sm leading-6 text-success">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
