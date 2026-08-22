import type { Metadata } from 'next';
import Link from 'next/link';

const description =
  'Read the 100 DevTools Hub Privacy Policy and learn how tool input, analytics, performance data, advertising technologies, cookies, and third-party services are handled.';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description,

  alternates: {
    canonical: '/privacy',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: '100 DevTools Hub',
    title: 'Privacy Policy | 100 DevTools Hub',
    description,
    url: '/privacy',
  },

  twitter: {
    card: 'summary',
    title: 'Privacy Policy | 100 DevTools Hub',
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
      name: 'Privacy Policy',
      item: 'https://100devtoolshub.com/privacy',
    },
  ],
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema
          ),
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

            <span aria-hidden="true">
              /
            </span>

            <span className="text-text-secondary">
              Privacy Policy
            </span>
          </nav>

          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
              Privacy
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              Privacy Policy
            </h1>

            <p className="mt-5 text-base leading-7 text-text-secondary sm:text-lg">
              This policy explains how
              100 DevTools Hub handles
              information when you use the
              website and its developer
              tools.
            </p>

            <p className="mt-4 text-sm text-text-muted">
              Last updated: August 22,
              2026
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl space-y-12 px-4 py-14 sm:px-6 sm:py-16">
        <section aria-labelledby="overview-heading">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
            Overview
          </p>

          <h2
            id="overview-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Our approach to privacy
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              100 DevTools Hub is designed
              around browser-based
              developer utilities. Where a
              tool supports local
              processing, its working input
              is processed directly in your
              browser rather than being
              intentionally uploaded to a
              100 DevTools Hub application
              server for processing.
            </p>

            <p>
              This browser-based tool
              architecture is separate from
              the operation of the website
              itself. The site also uses
              third-party services for
              hosting, analytics,
              performance measurement, and
              advertising, as described
              below.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="tool-data-heading"
          className="border-y border-border py-12"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-success">
            Tool input
          </p>

          <h2
            id="tool-data-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Data entered into developer
            tools
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              The interactive tools are
              designed to perform their
              transformations,
              calculations, formatting,
              parsing, encoding, decoding,
              hashing, and similar
              operations in the browser
              where applicable.
            </p>

            <p>
              100 DevTools Hub does not
              intentionally send the
              working contents you enter
              into those browser-based
              tools to an application
              server for the purpose of
              performing the tool&apos;s
              operation.
            </p>

            <p>
              You should nevertheless avoid
              entering highly sensitive
              information unless you
              understand the risks involved
              in processing or displaying
              that information in a web
              browser.
            </p>
          </div>
        </section>

        <section aria-labelledby="analytics-heading">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
            Analytics & performance
          </p>

          <h2
            id="analytics-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Site usage and performance
            measurement
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              100 DevTools Hub uses Vercel
              services including Web
              Analytics and Speed Insights
              to understand site usage and
              measure website performance.
            </p>

            <p>
              Depending on the service and
              configuration, technical
              information associated with
              visits may be processed by
              Vercel, such as page and
              performance information,
              device or browser
              characteristics, network
              information, and other
              service-generated data.
            </p>

            <p>
              These services are used for
              understanding website traffic,
              identifying performance
              issues, and improving the
              reliability and usability of
              the site.
            </p>

            <a
              href="https://vercel.com/legal/privacy-notice"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary"
            >
              Read Vercel&apos;s Privacy
              Notice →
            </a>
          </div>
        </section>

        <section
          aria-labelledby="advertising-heading"
          className="border-y border-border py-12"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-warning">
            Advertising
          </p>

          <h2
            id="advertising-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Google AdSense and advertising
            technologies
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              100 DevTools Hub uses Google
              AdSense technology to support
              the website through
              advertising.
            </p>

            <p>
              Google and its advertising
              partners may process
              information such as cookie or
              local-storage identifiers,
              device and browser
              information, approximate
              location, advertising
              interactions, and other data
              used for ad delivery,
              measurement, fraud prevention,
              reporting, and, where
              permitted, personalisation.
            </p>

            <p>
              Depending on your location,
              advertising may be
              personalised,
              non-personalised, or subject
              to other privacy treatments.
              Non-personalised advertising
              can still involve cookies or
              similar technologies for
              purposes such as frequency
              capping and aggregated
              reporting.
            </p>

            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary"
            >
              Read Google&apos;s Privacy
              Policy →
            </a>
          </div>
        </section>

        <section aria-labelledby="cookies-heading">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
            Cookies & consent
          </p>

          <h2
            id="cookies-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Cookies and similar
            technologies
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              Third-party services used by
              the site may use cookies,
              local storage, or similar
              technologies where permitted
              and appropriate for their
              functionality.
            </p>

            <p>
              Where consent or other privacy
              choices are required, the site
              may display a consent
              management interface that
              allows visitors to review and
              manage available options.
            </p>

            <p>
              Browser settings may also
              allow you to block or remove
              cookies and site storage.
              Disabling some technologies
              may affect advertising,
              analytics, or other website
              functionality.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="third-party-heading"
          className="border-y border-border py-12"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
            Third parties
          </p>

          <h2
            id="third-party-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Third-party services
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              Third-party providers process
              information according to
              their own privacy policies,
              contractual terms,
              configurations, and
              applicable legal
              requirements.
            </p>

            <p>
              Their data retention,
              processing locations, and
              available privacy controls
              may differ from those of
              100 DevTools Hub. Visitors
              should review the privacy
              information provided by those
              services when they need more
              detail about provider-specific
              processing.
            </p>
          </div>
        </section>

        <section aria-labelledby="rights-heading">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-success">
            Your choices
          </p>

          <h2
            id="rights-heading"
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
          >
            Privacy choices and rights
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-text-secondary">
            <p>
              Depending on where you live,
              privacy laws may give you
              rights or choices relating to
              personal information,
              advertising technologies,
              cookies, or consent.
            </p>

            <p>
              Some choices can be exercised
              through the consent interface
              presented on the site, through
              your browser settings, or
              through privacy controls
              provided directly by the
              relevant third-party service.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="changes-heading"
          className="rounded-2xl border border-border bg-surface-900/60 p-6 sm:p-8"
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
            Updates
          </p>

          <h2
            id="changes-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-text-primary"
          >
            Changes to this Privacy Policy
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-text-secondary">
            This Privacy Policy may be
            updated when the website,
            services, third-party providers,
            or applicable requirements
            change. When the policy is
            materially revised, the
            &quot;Last updated&quot; date
            above should be updated to
            reflect that revision.
          </p>

          <Link
            href="/about"
            className="mt-6 inline-block text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary"
          >
            Learn more about 100 DevTools
            Hub →
          </Link>
        </section>
      </div>
    </main>
  );
}
