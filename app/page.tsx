import Link from 'next/link';
import { tools } from '@/data/tools';

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Free Online Developer Tools
      </h1>
      <p className="text-gray-600 mb-8">
        A collection of fast, browser-based tools for modern developers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="p-6 border rounded-lg hover:border-blue-500 transition-colors bg-white shadow-sm hover:shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
            <p className="text-sm text-gray-600">{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}