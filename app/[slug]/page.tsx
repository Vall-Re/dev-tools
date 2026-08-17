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
    title: `${tool.name} - Free Online Tool`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - Free Online Tool`,
      description: tool.description,
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

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
        <p className="text-gray-600">{tool.description}</p>
      </div>

      <div className="p-6 border rounded-lg bg-white shadow-sm">
        {slug === 'json-formatter' && <JsonFormatter />}
        {slug === 'base64-encoder-decoder' && <Base64Converter />}
        {slug === 'url-encoder-decoder' && <UrlConverter />}
        {slug === 'html-entity-encoder-decoder' && <HtmlEntityConverter/>}
        {slug === 'uuid-generator' && <UuidGenerator/>}
        {slug === 'css-minifier' && <CssMinifier/>}
        {slug === 'md5-hash-generator' && <Md5Generator/>}
        {slug === 'js-minifier' && <JsMinifier/>}
        {slug === 'jwt-decoder' && <JwtDecoder />}
        {slug === 'sha256-hash-generator' && <Sha256Generator/>}
        {slug === 'regex-tester' && <RegexTester/>}
        {slug === 'sql-formatter' && <SqlFormatter/>}
        {slug === 'csv-to-json-converter' && <CsvToJsonConverter/>}
        {slug === 'json-to-csv-converter' && <JsonToCsvConverter />}
        {slug === 'markdown-to-html-converter' && <MarkdownToHtmlConverter />}
        {slug === 'url-parser' && <UrlParser />}
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