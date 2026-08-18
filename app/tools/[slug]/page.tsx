import { tools } from '@/data/tools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

import JsonFormatter from '@/components/JsonFormatter';
import Base64Converter from '@/components/Base64Converter';
import UrlConverter from '@/components/UrlConverter';
import HtmlEntityConverter from '@/components/HtmlEntityConverter';
import UuidGenerator from '@/components/UuidGenerator';
import CssMinifier from '@/components/CssMinifier';
import Md5Generator from '@/components/Md5Generator';
import JsMinifier from '@/components/JsMinifier';
import JwtDecoder from '@/components/JwtDecoder';
import Sha256Generator from '@/components/Sha256Generator';
import RegexTester from '@/components/RegexTester';
import SqlFormatter from '@/components/SqlFormatter';
import CsvToJsonConverter from '@/components/CsvToJsonConverter';
import JsonToCsvConverter from '@/components/JsonToCsvConverter';
import MarkdownToHtmlConverter from '@/components/MarkdownToHtmlConverter';
import UrlParser from '@/components/UrlParser';
import ColorCodeConverter from '@/components/ColorCodeConverter';
import TextCaseConverter from '@/components/TextCaseConverter';
import HtmlFormatter from '@/components/HtmlFormatter';
import XmlFormatter from '@/components/XmlFormatter';
import UrlSlugGenerator from '@/components/UrlSlugGenerator';
import LoremIpsumGenerator from '@/components/LoremIpsumGenerator';
import WordCounter from '@/components/WordCounter';
import MultiHashGenerator from '@/components/MultiHashGenerator';
import JsonMinifier from '@/components/JsonMinifier';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: `${tool.name} Online – Free Developer Tool`,
    description: `${tool.description} Fast, secure, and runs entirely in your browser with no data saved.`,
    alternates: {
      canonical: `https://100devtoolshub.com/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.name} Online – 100 DevTools Hub`,
      description: tool.description,
      url: `https://100devtoolshub.com/tools/${tool.slug}`,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const relatedTools = tool.relatedSlugs
    ? tools.filter((t) => tool.relatedSlugs?.includes(t.slug))
    : [];

  const faqSchema = tool.faqs && tool.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'All',
    applicationCategory: 'DeveloperApplication',
    browser: 'Requires JavaScript. Runs client-side.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: tool.description,
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto space-y-12 text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div>
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link> &gt;{' '}
          <Link href="/tools" className="hover:text-blue-400 transition-colors">Tools</Link> &gt;{' '}
          <span className="text-gray-200 font-medium">{tool.name}</span>
        </nav>
        <h1 className="text-3xl font-bold mb-2 text-gray-100">{tool.name}</h1>
        <p className="text-gray-400 text-lg">{tool.description}</p>
      </div>

      <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/60 shadow-sm">
        {slug === 'json-formatter' && <JsonFormatter />}
        {slug === 'base64-encoder-decoder' && <Base64Converter />}
        {slug === 'url-encoder-decoder' && <UrlConverter />}
        {slug === 'html-entity-encoder-decoder' && <HtmlEntityConverter />}
        {slug === 'uuid-generator' && <UuidGenerator />}
        {slug === 'css-minifier' && <CssMinifier />}
        {slug === 'md5-hash-generator' && <Md5Generator />}
        {slug === 'js-minifier' && <JsMinifier />}
        {slug === 'jwt-decoder' && <JwtDecoder />}
        {slug === 'sha256-hash-generator' && <Sha256Generator />}
        {slug === 'regex-tester' && <RegexTester />}
        {slug === 'sql-formatter' && <SqlFormatter />}
        {slug === 'csv-to-json-converter' && <CsvToJsonConverter />}
        {slug === 'json-to-csv-converter' && <JsonToCsvConverter />}
        {slug === 'markdown-to-html-converter' && <MarkdownToHtmlConverter />}
        {slug === 'url-parser' && <UrlParser />}
        {slug === 'color-code-converter' && <ColorCodeConverter />}
        {slug === 'text-case-converter' && <TextCaseConverter />}
        {slug === 'html-formatter' && <HtmlFormatter />}
        {slug === 'xml-formatter' && <XmlFormatter />}
        {slug === 'url-slug-generator' && <UrlSlugGenerator />}
        {slug === 'lorem-ipsum-generator' && <LoremIpsumGenerator />}
        {slug === 'word-counter' && <WordCounter />}
        {slug === 'multi-hash-generator' && <MultiHashGenerator />}
        {slug === 'json-minifier' && <JsonMinifier />}
      </div>

      {tool.howToUse && tool.howToUse.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-gray-800">
          <h2 className="text-2xl font-semibold text-gray-100">How to Use {tool.name}</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            {tool.howToUse.map((step, idx) => (
              <li key={idx} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </section>
      )}

      {tool.features && tool.features.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-gray-800">
          <h2 className="text-2xl font-semibold text-gray-100">Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {tool.features.map((feat, idx) => (
              <li key={idx} className="leading-relaxed">{feat}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4 pt-6 border-t border-gray-800">
        <h2 className="text-2xl font-semibold text-gray-100">About {tool.name}</h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">{tool.aboutText}</p>
      </section>

      {tool.useCases && tool.useCases.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-gray-800">
          <h2 className="text-2xl font-semibold text-gray-100">Common Use Cases</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {tool.useCases.map((useCase, idx) => (
              <li key={idx} className="leading-relaxed">{useCase}</li>
            ))}
          </ul>
        </section>
      )}

      {tool.faqs && tool.faqs.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-gray-800">
          <h2 className="text-2xl font-semibold text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, index) => (
              <div key={index} className="p-4 border border-gray-800 rounded-lg bg-gray-900/60">
                <h3 className="font-semibold text-lg mb-1 text-gray-200">{faq.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {relatedTools.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-gray-800">
          <h2 className="text-2xl font-semibold text-gray-100">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedTools.map((relTool) => (
              <Link
                key={relTool.slug}
                href={`/tools/${relTool.slug}`}
                className="p-4 border border-gray-800 rounded-lg hover:border-blue-500 transition-colors bg-gray-900/60 shadow-sm block group"
              >
                <h3 className="font-semibold text-blue-400 group-hover:text-blue-300 mb-1">{relTool.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{relTool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}