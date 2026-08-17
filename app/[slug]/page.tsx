import { tools } from '@/data/tools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import JsonFormatter from '@/components/JsonFormatter';
import Base64Converter from '@/components/Base64Converter';
import UrlConverter from '@/components/UrlConverter';

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
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
      <p className="text-gray-600 mb-8">{tool.description}</p>
      
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        {slug === 'json-formatter' && <JsonFormatter />}
        {slug === 'base64-encoder-decoder' && <Base64Converter />}
        {slug === 'url-encoder-decoder' && <UrlConverter />}
      </div>
    </main>
  );
}