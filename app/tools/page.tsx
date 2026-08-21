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
  // Нормалізуємо категорії до нижнього регістру та прибираємо дублікати безпечно
  const categories = Array.from(new Set(tools.map((t) => t.category.toLowerCase())));

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto space-y-12 text-gray-100">
      {/* Breadcrumbs & Header */}
      <div className="space-y-4">
        <nav className="text-sm text-gray-400">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link> &gt;{' '}
          <span className="text-gray-200 font-medium">Tools Hub</span>
        </nav>
        <h1 className="text-4xl font-extrabold tracking-tight">Developer Tools Ecosystem</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          A comprehensive suite of fast, secure, and privacy-focused utilities running entirely in your browser.
        </p>
      </div>

      {/* Categories & Tool Cards */}
      <div id="categories" className="scroll-mt-28 space-y-12">
        {categories.map((category) => {
          const categoryTools = tools.filter((t) => t.category.toLowerCase() === category);
          // Робимо першу літеру великою для красивого заголовка секції
          const formattedCategoryName = category.charAt(0).toUpperCase() + category.slice(1);

          return (
            <section key={category} id={category} className="space-y-4">
              <h2 className="text-2xl font-bold border-b border-gray-800 pb-2 capitalize">{formattedCategoryName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="p-6 border border-gray-800 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all bg-gray-900/60 flex flex-col justify-between group"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors mb-2">{tool.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{tool.description}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-4 font-mono uppercase tracking-wider">
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