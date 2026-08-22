'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { tools } from '@/data/tools';

const categories = [
  'All',
  ...Array.from(new Set(tools.map((tool) => tool.category))),
];

export default function ToolSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTools = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesSearch =
        !normalizedQuery ||
        tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery) ||
        tool.category.toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        selectedCategory === 'All' ||
        tool.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-surface-950/70 p-4 sm:p-5">
        <label
          htmlFor="tool-search-input"
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          Search developer tools
        </label>

        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>

          <input
            id="tool-search-input"
            type="search"
            placeholder="Try JSON, Base64, UUID, regex..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-xl border border-border bg-surface-900 py-3.5 pl-12 pr-4 text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
          />
        </div>

        <div
          role="group"
          aria-label="Filter tools by category"
          className="mt-4 flex flex-wrap gap-2"
        >
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan ${
                  active
                    ? 'border-brand-blue bg-brand-blue text-white'
                    : 'border-border bg-surface-900 text-text-secondary hover:border-border-strong hover:text-text-primary'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className="text-sm text-text-secondary"
          aria-live="polite"
          aria-atomic="true"
        >
          {filteredTools.length}{' '}
          {filteredTools.length === 1 ? 'tool' : 'tools'} found
        </p>

        {(searchQuery || selectedCategory !== 'All') && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex min-h-48 flex-col justify-between rounded-xl border border-border bg-surface-900/60 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-blue/60 hover:bg-surface-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
            >
              <div>
                <span className="inline-flex rounded-md border border-brand-blue/20 bg-brand-blue/10 px-2 py-1 font-mono text-xs font-medium uppercase tracking-wide text-brand-blue">
                  {tool.category}
                </span>

                <h3 className="mt-4 text-lg font-semibold text-text-primary transition-colors group-hover:text-brand-cyan">
                  {tool.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {tool.description}
                </p>
              </div>

              <span className="mt-5 text-sm font-medium text-text-muted transition-colors group-hover:text-brand-cyan">
                Open tool →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface-950/40 px-6 py-12 text-center">
          <h3 className="font-semibold text-text-primary">
            No matching tools
          </h3>

          <p className="mt-2 text-sm text-text-secondary">
            Try another search term or clear the current filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-lg border border-border bg-surface-900 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-surface-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
