'use client';

import { useState, useMemo } from 'react';
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

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || tool.category === selectedCategory;

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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
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
            className="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded mb-3">
                {tool.category}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
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