import type { Metadata } from 'next';
import Link from 'next/link';

const description =
  'Learn about 100 DevTools Hub, a collection of fast, browser-based developer utilities for formatting, encoding, converting, generating, hashing, and debugging.';

export const metadata: Metadata = {
  title: 'About Us',
  description,

  alternates: {
    canonical: '/about',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: '100 DevTools Hub',
    title: 'About Us | 100 DevTools Hub',
    description,
    url: '/about',
  },

  twitter: {
    card: 'summary',
    title: 'About Us | 100 DevTools Hub',
    description,
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
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

            <span className="text-text-secondary">
              About
            </span>
          </nav>

          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
              About the project
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              About 100 DevTools Hub
            </h1>

            <p className="mt-5 text-base leading-7 text-text-secondary sm:text-lg">
              A growing collection of practical developer tools
              designed to make common formatting, conversion,
              encoding, generation, hashing, and debugging tasks
              faster and easier to access.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl space-y-12 px-4 py-14 sm:px-6 sm:py-16">
        <section aria-labelledby="mission-heading">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
            Mission
          </p>

          <h2
            id="mission-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Practical tools without unnecessary setup
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              100 DevTools Hub is built around a simple idea:
              common developer tasks should not require installing
              another application, creating an account, or navigating
              through an unnecessarily complex workflow.
            </p>

            <p>
              The site brings frequently used utilities into one
              consistent interface so developers can quickly format
              JSON, work with encoded data, inspect URLs and tokens,
              generate identifiers and hashes, convert data formats,
              and handle other everyday development tasks.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="principles-heading"
          className="border-y border-border py-12"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
            Principles
          </p>

          <h2
            id="principles-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            How the toolkit is designed
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-border bg-surface-900/60 p-5">
              <h3 className="font-semibold text-text-primary">
                Browser-based processing
              </h3>

              <p className="mt-3 text-sm leading-6 text-text-secondary">
                Tool working data is designed to be processed
                directly in the browser whenever the tool supports
                it, reducing the need to send routine input to an
                application server.
              </p>
            </article>

            <article className="rounded-xl border border-border bg-surface-900/60 p-5">
              <h3 className="font-semibold text-text-primary">
                Fast access
              </h3>

              <p className="mt-3 text-sm leading-6 text-text-secondary">
                Tools can be opened and used without creating an
                account or completing a multi-step setup process.
              </p>
            </article>

            <article className="rounded-xl border border-border bg-surface-900/60 p-5">
              <h3 className="font-semibold text-text-primary">
                Focused functionality
              </h3>

              <p className="mt-3 text-sm leading-6 text-text-secondary">
                Each utility is intended to solve a specific
                development task rather than becoming an overloaded
                application with unrelated features.
              </p>
            </article>
          </div>
        </section>

        <section aria-labelledby="privacy-heading">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-success">
            Privacy
          </p>

          <h2
            id="privacy-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            A privacy-conscious approach
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              The interactive tools are designed so that their
              working input can be handled locally in the browser
              where applicable. This is different from claiming that
              the entire website operates without any external
              services.
            </p>

            <p>
              Like many websites, 100 DevTools Hub may use
              site-level services for analytics, performance
              measurement, advertising, and related functionality.
              Details about those services and data handling are
              explained in the Privacy Policy.
            </p>

            <Link
              href="/privacy"
              className="inline-block text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary"
            >
              Read the Privacy Policy →
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="development-heading"
          className="rounded-2xl border border-border bg-surface-900/60 p-6 sm:p-8"
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
            Development
          </p>

          <h2
            id="development-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-text-primary"
          >
            Built around real developer workflows
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-text-secondary">
            The collection is continuously refined around practical
            tasks developers encounter while working with web
            applications, APIs, structured data, text, URLs,
            encoding, and debugging.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
            >
              Browse all tools
            </Link>

            <Link
              href="/"
              className="rounded-lg border border-border bg-surface-950 px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
            >
              Search tools
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
