import { tools } from '@/data/tools';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Developer Tools – Free Online Utility Platform',
  description: 'Explore our complete collection of free, client-side developer tools including JSON formatters, base64 encoders, JWT decoders, regex testers, and more.',
  alternates: {
    canonical: 'https://100devtoolshub.com/tools',
  },
};

export default function ToolsIndexPage() {
  // Групуємо інструменти за категоріями
  const categories = Array.from(new Set(tools.map((t) => t.category)));

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto space-y-12">
      {/* Breadcrumbs & Header */}
      <div className="space-y-4">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:underline">Home</Link> &gt;{' '}
          <span className="text-gray-900 font-medium">Tools Hub</span>
        </nav>
        <h1 className="text-4xl font-extrabold tracking-tight">Developer Tools Ecosystem</h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          A comprehensive suite of fast, secure, and privacy-focused utilities running entirely in your browser.
        </p>
      </div>

      {/* Categories & Tool Cards */}
      <div className="space-y-12">
        {categories.map((category) => {
          const categoryTools = tools.filter((t) => t.category === category);
          return (
            <section key={category} className="space-y-4">
              <h2 className="text-2xl font-bold border-b pb-2">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="p-6 border rounded-xl hover:border-blue-500 hover:shadow-md transition-all bg-white flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-blue-600 mb-2">{tool.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{tool.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-4 font-mono uppercase tracking-wider">
                      {tool.category}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}