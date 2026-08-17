import Link from 'next/link';
import { tools } from '@/data/tools';

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto space-y-8">
      <header className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Free Online Developer Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Fast, secure, and easy-to-use web tools for developers. All data processing happens right in your browser.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="block p-6 border rounded-xl hover:shadow-md transition bg-white space-y-3"
          >
            <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
              {tool.category}
            </span>
            <h2 className="text-xl font-bold">{tool.name}</h2>
            <p className="text-gray-600 text-sm">{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}