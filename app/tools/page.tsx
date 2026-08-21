import type { Metadata } from 'next';
import Link from 'next/link';
import { tools } from '@/data/tools';

export const metadata: Metadata = {
  title: 'Developer Tools',
  description:
    'Browse free online developer tools for formatting, encoding, converting, generating, hashing, debugging, and everyday development tasks.',
  alternates: {
    canonical: '/tools',
  },
};

const categories = Array.from(
  new Set(tools.map((tool) => tool.category))
).map((category) => ({
  name: category,
  slug: category.toLowerCase(),
  tools: tools.filter((tool) => tool.category === category),
}));

export default function ToolsIndexPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-sm text-text-muted"
          >
            <Link
              href="/"
              className="transition-colors hover:text-brand-cyan"
            >
              Home
            </Link>

            <span aria-hidden="true">/</span>

            <span className="text-text-secondary">Tools</span>
          </nav>

          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
              Developer toolkit
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              All developer tools
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              Browse {tools.length} browser-based utilities for formatting,
              encoding, converting, generating, hashing, debugging, and common
              development workflows.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-surface-900 px-3 py-1.5 text-xs font-medium text-text-secondary">
                {tools.length} tools
              </span>

              <span className="rounded-full border border-border bg-surface-900 px-3 py-1.5 text-xs font-medium text-text-secondary">
                {categories.length} categories
              </span>

              <span className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1.5 text-xs font-medium text-brand-cyan">
                No sign-up
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="scroll-mt-28 border-b border-border bg-surface-900/30"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          <p className="mb-4 text-sm font-medium text-text-primary">
            Jump to a category
          </p>

          <nav
            aria-label="Tool categories"
            className="flex flex-wrap gap-2"
          >
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`#${category.slug}`}
                className="rounded-full border border-border bg-surface-950 px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-brand-blue/50 hover:text-brand-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
              >
                {category.name}
                <span className="ml-2 text-text-muted">
                  {category.tools.length}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="space-y-16">
          {categories.map((category) => (
            <section
              key={category.slug}
              id={category.slug}
              className="scroll-mt-28"
            >
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                    {category.name}
                  </h2>

                  <p className="mt-2 text-sm text-text-secondary">
                    {category.tools.length}{' '}
                    {category.tools.length === 1 ? 'tool' : 'tools'} in this
                    category
                  </p>
                </div>

                <a
                  href="#categories"
                  className="text-sm font-medium text-text-muted transition-colors hover:text-brand-cyan"
                >
                  Back to categories ↑
                </a>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group flex min-h-52 flex-col justify-between rounded-xl border border-border bg-surface-900/60 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-blue/60 hover:bg-surface-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
                  >
                    <div>
                      <span className="inline-flex rounded-md border border-brand-blue/20 bg-brand-blue/10 px-2 py-1 font-mono text-xs font-medium uppercase tracking-wide text-brand-blue">
                        {category.name}
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
            </section>
          ))}
        </div>
      </div>

      <section className="border-t border-border bg-surface-900/30">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
          <div className="rounded-2xl border border-border bg-surface-950/60 p-6 sm:p-8">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
                Growing toolkit
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-primary">
                More developer tools are coming
              </h2>

              <p className="mt-3 leading-7 text-text-secondary">
                The collection is being expanded around practical developer
                workflows while keeping each tool focused, fast, and easy to
                use.
              </p>

              <Link
                href="/"
                className="mt-6 inline-block text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary"
              >
                Search the current toolkit →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
