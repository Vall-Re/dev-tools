import { tools } from '@/data/tools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
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
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = tools.find((t) => t.slug === params.slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: `${tool.name} - Free Online Tool`,
    description: tool.description,
    alternates: {
      canonical: `https://100devtoolshub.com/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.name} - Free Online Tool`,
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

export default function ToolPage({ params }: Props) {
  const tool = tools.find((t) => t.slug === params.slug);

  if (!tool) {
    notFound();
  }

  const jsonLd = tool.faqs && tool.faqs.length > 0 ? {
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

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto space-y-12">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div>
        <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
        <p className="text-gray-600">{tool.description}</p>
      </div>

      <div className="p-6 border rounded-lg bg-white shadow-sm">
        {params.slug === 'json-formatter' && <JsonFormatter />}
        {params.slug === 'base64-encoder-decoder' && <Base64Converter />}
        {params.slug === 'url-encoder-decoder' && <UrlConverter />}
        {params.slug === 'html-entity-encoder-decoder' && <HtmlEntityConverter />}
        {params.slug === 'uuid-generator' && <UuidGenerator />}
        {params.slug === 'css-minifier' && <CssMinifier />}
        {params.slug === 'md5-hash-generator' && <Md5Generator />}
        {params.slug === 'js-minifier' && <JsMinifier />}
        {params.slug === 'jwt-decoder' && <JwtDecoder />}
        {params.slug === 'sha256-hash-generator' && <Sha256Generator />}
        {params.slug === 'regex-tester' && <RegexTester />}
        {params.slug === 'sql-formatter' && <SqlFormatter />}
        {params.slug === 'csv-to-json-converter' && <CsvToJsonConverter />}
        {params.slug === 'json-to-csv-converter' && <JsonToCsvConverter />}
        {params.slug === 'markdown-to-html-converter' && <MarkdownToHtmlConverter />}
        {params.slug === 'url-parser' && <UrlParser />}
        {params.slug === 'color-code-converter' && <ColorCodeConverter />}
        {params.slug === 'text-case-converter' && <TextCaseConverter />}
        {params.slug === 'html-formatter' && <HtmlFormatter />}
        {params.slug === 'xml-formatter' && <XmlFormatter />}
        {params.slug === 'url-slug-generator' && <UrlSlugGenerator />}
        {params.slug === 'lorem-ipsum-generator' && <LoremIpsumGenerator />}
        {params.slug === 'word-counter' && <WordCounter />}
        {params.slug === 'multi-hash-generator' && <MultiHashGenerator />}
        {params.slug === 'json-minifier' && <JsonMinifier />}
      </div>

      <section className="space-y-4 pt-6 border-t">
        <h2 className="text-2xl font-semibold">About {tool.name}</h2>
        <p className="text-gray-700 leading-relaxed">{tool.aboutText}</p>
      </section>

      {tool.faqs && tool.faqs.length > 0 && (
        <section className="space-y-6 pt-6 border-t">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold text-lg mb-1">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}