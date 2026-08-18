'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';

export default function ToolSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(tools.map((t) => t.category))
    );
    return ['All', ...uniqueCategories];
  }, []);

  // Зчитуємо хеш з URL (наприклад, #formatters -> Formatters) при завантаженні або зміні хешу
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Шукаємо категорію, яка збігається з хешем (ігноруючи регістр)
        const matchedCategory = categories.find(
          (cat) => cat.toLowerCase() === hash.toLowerCase()
        );
        if (matchedCategory) {
          setSelectedCategory(matchedCategory);
        }
      }
    };

    handleHashChange(); // Перевірити при першому завантаженні
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [categories]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || tool.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search 25+ dev tools (e.g. JSON, Base64, UUID, SHA)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="block p-6 bg-gray-900/80 border border-gray-800 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2 py-1 rounded mb-3">
                {tool.category}
              </span>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tools found matching your query.
        </div>
      )}
    </section>
  );
}