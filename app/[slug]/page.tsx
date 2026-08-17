import { tools } from '@/data/tools';
import { notFound } from 'next/navigation';
import JsonFormatter from '@/components/JsonFormatter';

interface Props {
  params: Promise<{
    slug: string;
  }>;
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
        {slug === 'json-formatter' ? (
          <JsonFormatter />
        ) : (
          <p className="text-sm text-gray-500">
            Component for <strong className="font-semibold text-gray-800">{tool.name}</strong> will be loaded here soon.
          </p>
        )}
      </div>
    </main>
  );
}