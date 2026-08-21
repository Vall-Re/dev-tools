import Link from 'next/link';
import ToolSearch from '@/components/ToolSearch';
import { tools } from '@/data/tools';

const popularToolSlugs = [
  'json-formatter',
  'base64-encoder-decoder',
  'url-encoder-decoder',
  'jwt-decoder',
  'regex-tester',
  'uuid-generator',
];

const popularTools = popularToolSlugs.flatMap((slug) => {
  const tool = tools.find((item) => item.slug === slug);
  return tool ? [tool] : [];
});

const categories = Array.from(new Set(tools.map((tool) => tool.category))).map(
  (category) => ({
    name: category,
    slug: category.toLowerCase(),
    count: tools.filter((tool) => tool.category === category).length,
  })
);

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-border bg-surface-900 px-3 py-1 text-xs font-medium text-text-secondary">
                {tools.length} developer tools
              </span>

              <span className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-xs font-medium text-brand-cyan">
                Client-side processing
              </span>

              <span className="rounded-full border border-border bg-surface-900 px-3 py-1 text-xs font-medium text-text-secondary">
                No sign-up
              </span>
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Developer tools that work
              <span className="block text-brand-cyan">
                directly in your browser
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              Format, convert, encode, decode, generate, and inspect developer
              data with fast tools designed to keep your workflow simple and
              your input local to your browser.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#search"
                className="rounded-lg bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
              >
                Find a tool
              </Link>

              <Link
                href="/tools"
                className="rounded-lg border border-border bg-surface-900 px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
              >
                Browse all tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="search"
        className="scroll-mt-28 border-b border-border bg-surface-900/30"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
              Tool finder
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Find the right developer tool
            </h2>

            <p className="mt-3 text-text-secondary">
              Search by name or use a category filter to narrow the collection.
            </p>
          </div>

          <ToolSearch />
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
                Popular
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Popular developer tools
              </h2>

              <p className="mt-2 text-text-secondary">
                Quick access to commonly used utilities.
              </p>
            </div>

            <Link
              href="/tools"
              className="text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary"
            >
              View all tools →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group rounded-xl border border-border bg-surface-900/60 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-blue/60 hover:bg-surface-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
              >
                <span className="font-mono text-xs uppercase tracking-wide text-brand-blue">
                  {tool.category}
                </span>

                <h3 className="mt-3 text-lg font-semibold text-text-primary transition-colors group-hover:text-brand-cyan">
                  {tool.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {tool.description}
                </p>

                <span className="mt-5 inline-block text-sm font-medium text-text-muted transition-colors group-hover:text-brand-cyan">
                  Open tool →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-900/30">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
              Explore
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Browse by category
            </h2>

            <p className="mt-2 max-w-2xl text-text-secondary">
              Jump directly to a group of tools based on what you need to do.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/tools#${category.slug}`}
                className="group rounded-xl border border-border bg-surface-950/70 p-5 transition-colors hover:border-brand-purple/60 hover:bg-surface-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
              >
                <h3 className="font-semibold text-text-primary transition-colors group-hover:text-brand-purple">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-text-muted">
                  {category.count}{' '}
                  {category.count === 1 ? 'tool' : 'tools'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-border bg-surface-900/60 p-6 sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-success">
                Privacy-first workflow
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Built for quick, local developer tasks
              </h2>

              <p className="mt-4 leading-7 text-text-secondary">
                100 DevTools Hub is designed around browser-based utilities so
                common formatting, conversion, encoding, decoding, and
                generation tasks can be completed without creating an account
                or sending routine input through a traditional server workflow.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-surface-950/60 p-5">
                <h3 className="font-semibold text-text-primary">
                  Browser-based
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Tools are designed to process their inputs directly in the
                  browser whenever the tool supports it.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface-950/60 p-5">
                <h3 className="font-semibold text-text-primary">
                  Fast to access
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Open a tool and start working without account creation or a
                  multi-step setup process.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface-950/60 p-5">
                <h3 className="font-semibold text-text-primary">
                  Developer focused
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Focused utilities for common web, data, text, encoding, and
                  debugging workflows.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/about"
                className="text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary"
              >
                Learn more about 100 DevTools Hub →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
