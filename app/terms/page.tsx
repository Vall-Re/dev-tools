import type { Metadata } from 'next';
import Link from 'next/link';

const description =
  'Review the Terms of Service for 100 DevTools Hub, including permitted use, tool output responsibility, third-party services, disclaimers, and limitations.';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description,

  alternates: {
    canonical: '/terms',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: '100 DevTools Hub',
    title: 'Terms of Service | 100 DevTools Hub',
    description,
    url: '/terms',
  },

  twitter: {
    card: 'summary',
    title: 'Terms of Service | 100 DevTools Hub',
    description,
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://100devtoolshub.com/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Terms of Service',
      item: 'https://100devtoolshub.com/terms',
    },
  ],
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

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
              Terms of Service
            </span>
          </nav>

          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
              Terms
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              Terms of Service
            </h1>

            <p className="mt-5 text-base leading-7 text-text-secondary sm:text-lg">
              These Terms of Service govern access to and use of
              100 DevTools Hub and its browser-based developer
              utilities.
            </p>

            <p className="mt-4 text-sm text-text-muted">
              Last updated: August 22, 2026
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl space-y-12 px-4 py-14 sm:px-6 sm:py-16">
        <section aria-labelledby="acceptance-heading">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
            01
          </p>

          <h2
            id="acceptance-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Acceptance of these terms
          </h2>

          <p className="mt-5 leading-7 text-text-secondary">
            By accessing or using 100 DevTools Hub, you agree to
            these Terms of Service. If you do not agree with these
            terms, you should not use the website or its tools.
          </p>
        </section>

        <section
          aria-labelledby="service-heading"
          className="border-y border-border py-12"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
            02
          </p>

          <h2
            id="service-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Use of the service
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              100 DevTools Hub provides browser-based utilities for
              common development tasks such as formatting,
              conversion, encoding, decoding, parsing, generation,
              hashing, and debugging.
            </p>

            <p>
              Access to the current collection of tools is provided
              without requiring an account. Features, availability,
              limits, or individual tools may be changed, added, or
              removed over time.
            </p>

            <p>
              You are responsible for ensuring that your use of the
              website and its tools complies with applicable laws,
              regulations, contractual obligations, and third-party
              rights.
            </p>
          </div>
        </section>

        <section aria-labelledby="acceptable-use-heading">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-success">
            03
          </p>

          <h2
            id="acceptable-use-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Acceptable use
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              You may use the tools for lawful personal,
              educational, professional, or commercial workflows.
            </p>

            <p>
              You must not intentionally misuse the service in a way
              that disrupts availability, interferes with other
              visitors, attempts to bypass technical protections, or
              places an unreasonable load on the website or its
              infrastructure.
            </p>

            <p>
              You must not use the service to violate applicable law
              or knowingly infringe the rights of another person or
              organisation.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="input-heading"
          className="border-y border-border py-12"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
            04
          </p>

          <h2
            id="input-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Your input and tool output
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              You remain responsible for the information, text,
              source code, configuration, URLs, tokens, files, or
              other content that you choose to process using the
              tools.
            </p>

            <p>
              You should only process information that you are
              authorised to use and should avoid entering highly
              sensitive information unless you understand the risks
              of handling that information in a web browser.
            </p>

            <p>
              Tool output may require review before use. You are
              responsible for validating generated, converted,
              formatted, decoded, parsed, or otherwise processed
              results before relying on them in production systems,
              security-sensitive workflows, or other important
              environments.
            </p>
          </div>
        </section>

        <section aria-labelledby="accuracy-heading">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
            05
          </p>

          <h2
            id="accuracy-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Accuracy and professional reliance
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              The tools are intended to assist with developer
              workflows, but no utility can guarantee correct results
              for every input, environment, specification, browser,
              library version, or edge case.
            </p>

            <p>
              Outputs should not be treated as a substitute for
              appropriate technical review, testing, security
              assessment, or other professional judgement where those
              are required.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="third-party-heading"
          className="border-y border-border py-12"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-warning">
            06
          </p>

          <h2
            id="third-party-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Third-party services and advertising
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              100 DevTools Hub may rely on third-party providers for
              hosting, analytics, performance measurement,
              advertising, libraries, or related website
              functionality.
            </p>

            <p>
              Third-party services operate under their own terms,
              policies, technical systems, and availability
              conditions. 100 DevTools Hub does not control all
              aspects of those external services.
            </p>

            <p>
              The website may display advertising or interact with
              advertising technologies provided by third parties,
              including Google AdSense.
            </p>

            <Link
              href="/privacy"
              className="inline-block text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary"
            >
              Read the Privacy Policy →
            </Link>
          </div>
        </section>

        <section aria-labelledby="ip-heading">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
            07
          </p>

          <h2
            id="ip-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Intellectual property
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              The 100 DevTools Hub name, branding, website design,
              original written content, and other site materials may
              be protected by intellectual property rights belonging
              to the website operator or applicable licensors.
            </p>

            <p>
              These terms do not transfer ownership of those
              materials to visitors.
            </p>

            <p>
              Rights in content that you provide remain subject to
              the rights you already hold in that content and any
              applicable third-party rights.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="warranty-heading"
          className="border-y border-border py-12"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
            08
          </p>

          <h2
            id="warranty-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Disclaimer of warranties
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              To the extent permitted by applicable law,
              100 DevTools Hub and its tools are provided on an
              &quot;as is&quot; and &quot;as available&quot; basis.
            </p>

            <p>
              We do not guarantee that the website will always be
              available, uninterrupted, free from defects, or suitable
              for every purpose, and we do not guarantee that every
              tool output will be accurate for every possible input
              or use case.
            </p>
          </div>
        </section>

        <section aria-labelledby="liability-heading">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-warning">
            09
          </p>

          <h2
            id="liability-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Limitation of liability
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              To the fullest extent permitted by applicable law,
              100 DevTools Hub and its operators, contributors, or
              maintainers will not be responsible for indirect,
              incidental, special, consequential, or similar losses
              arising from use of, or inability to use, the website
              or its tools.
            </p>

            <p>
              Nothing in these terms is intended to exclude or limit
              liability where doing so would not be permitted by
              applicable law.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="suspension-heading"
          className="border-y border-border py-12"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
            10
          </p>

          <h2
            id="suspension-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Service changes and access
          </h2>

          <p className="mt-5 leading-7 text-text-secondary">
            We may modify, suspend, restrict, or discontinue parts of
            the service when reasonably necessary for maintenance,
            security, abuse prevention, technical changes, legal
            requirements, or continued development of the platform.
          </p>
        </section>

        <section aria-labelledby="updates-heading">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
            11
          </p>

          <h2
            id="updates-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Changes to these terms
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              These Terms of Service may be updated when the website,
              available features, third-party services, or applicable
              requirements change.
            </p>

            <p>
              When a material revision is made, the
              &quot;Last updated&quot; date shown on this page should
              be changed accordingly.
            </p>

            <p>
              Your continued use of the service after updated terms
              become effective indicates your acceptance of the
              revised terms, to the extent permitted by applicable
              law.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface-900/60 p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-success">
            Related information
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-primary">
            Privacy and site information
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-text-secondary">
            For information about browser-based tool processing,
            analytics, advertising technologies, cookies, and
            third-party services, review the Privacy Policy.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/privacy"
              className="text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary"
            >
              Privacy Policy →
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary"
            >
              About 100 DevTools Hub →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
