import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { tools } from '@/data/tools';

import JsonFormatter from '@/components/JsonFormatter';
import Base64Converter from '@/components/Base64Converter';
import UrlConverter from '@/components/UrlConverter';
import HtmlEntityConverter from '@/components/HtmlEntityConverter';
import UuidGenerator from '@/components/UuidGenerator';
import CssMinifier from '@/components/CssMinifier';
import Md5Generator from '@/components/Md5Generator';
import JsMinifier from '@/components/JsMinifier';
import JwtDecoder from '@/components/JwtDecoder';
import Sha256Generator from '@/components/Sha256Generator';
import RegexTester from '@/components/RegexTester';
import SqlFormatter from '@/components/SqlFormatter';
import CsvToJsonConverter from '@/components/CsvToJsonConverter';
import JsonToCsvConverter from '@/components/JsonToCsvConverter';
import MarkdownToHtmlConverter from '@/components/MarkdownToHtmlConverter';
import UrlParser from '@/components/UrlParser';
import ColorCodeConverter from '@/components/ColorCodeConverter';
import TextCaseConverter from '@/components/TextCaseConverter';
import HtmlFormatter from '@/components/HtmlFormatter';
import XmlFormatter from '@/components/XmlFormatter';
import UrlSlugGenerator from '@/components/UrlSlugGenerator';
import LoremIpsumGenerator from '@/components/LoremIpsumGenerator';
import WordCounter from '@/components/WordCounter';
import MultiHashGenerator from '@/components/MultiHashGenerator';
import JsonMinifier from '@/components/JsonMinifier';

interface Props {
  params: Promise<{ slug: string }>;
}

const serializeJsonLd = (
  value: unknown
) =>
  JSON.stringify(value).replace(
    /</g,
    '\\u003c'
  );

const toolComponents = {
  'json-formatter': JsonFormatter,
  'base64-encoder-decoder': Base64Converter,
  'url-encoder-decoder': UrlConverter,
  'html-entity-encoder-decoder': HtmlEntityConverter,
  'uuid-generator': UuidGenerator,
  'css-minifier': CssMinifier,
  'md5-hash-generator': Md5Generator,
  'js-minifier': JsMinifier,
  'jwt-decoder': JwtDecoder,
  'sha256-hash-generator': Sha256Generator,
  'regex-tester': RegexTester,
  'sql-formatter': SqlFormatter,
  'csv-to-json-converter': CsvToJsonConverter,
  'json-to-csv-converter': JsonToCsvConverter,
  'markdown-to-html-converter': MarkdownToHtmlConverter,
  'url-parser': UrlParser,
  'color-code-converter': ColorCodeConverter,
  'text-case-converter': TextCaseConverter,
  'html-formatter': HtmlFormatter,
  'xml-formatter': XmlFormatter,
  'url-slug-generator': UrlSlugGenerator,
  'lorem-ipsum-generator': LoremIpsumGenerator,
  'word-counter': WordCounter,
  'multi-hash-generator': MultiHashGenerator,
  'json-minifier': JsonMinifier,
} as const;

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  const description = `${tool.description} Use this free developer tool directly in your browser with no sign-up required.`;

  return {
    title: `${tool.name} Online`,
    description,

    alternates: {
      canonical: `/tools/${tool.slug}`,
    },

    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: '100 DevTools Hub',
      title: `${tool.name} Online`,
      description,
      url: `/tools/${tool.slug}`,
    },

    twitter: {
      card: 'summary',
      title: `${tool.name} Online`,
      description,
    },
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;

  const tool = tools.find((item) => item.slug === slug);

  if (!tool) {
    notFound();
  }

  const ToolComponent =
    toolComponents[slug as keyof typeof toolComponents];

  if (!ToolComponent) {
    notFound();
  }

  const explicitRelatedTools = tool.relatedSlugs
    ? tools.filter(
        (item) =>
          item.slug !== tool.slug &&
          tool.relatedSlugs?.includes(item.slug)
      )
    : [];

  const fallbackRelatedTools = tools.filter(
    (item) =>
      item.slug !== tool.slug &&
      item.category === tool.category &&
      !explicitRelatedTools.some(
        (relatedTool) => relatedTool.slug === item.slug
      )
  );

  const relatedTools = [
    ...explicitRelatedTools,
    ...fallbackRelatedTools,
  ].slice(0, 6);

  const canonicalUrl = `https://100devtoolshub.com/tools/${tool.slug}`;

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: canonicalUrl,
    description: tool.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
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
        name: 'Tools',
        item: 'https://100devtoolshub.com/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: canonicalUrl,
      },
    ],
  };

  const categorySlug = tool.category.toLowerCase();

  return (
    <main className="min-h-screen">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(appSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              breadcrumbSchema
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(appSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-6"
          >
            <ol className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-brand-cyan"
                >
                  Home
                </Link>
              </li>

              <li aria-hidden="true">/</li>

              <li>
                <Link
                  href="/tools"
                  className="transition-colors hover:text-brand-cyan"
                >
                  Tools
                </Link>
              </li>

              <li aria-hidden="true">/</li>

              <li
                aria-current="page"
                className="text-text-secondary"
              >
                {tool.name}
              </li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <Link
              href={`/tools#${categorySlug}`}
              className="inline-flex rounded-md border border-brand-blue/20 bg-brand-blue/10 px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wide text-brand-blue transition-colors hover:border-brand-blue/50 hover:text-brand-cyan"
            >
              {tool.category}
            </Link>

            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              {tool.name}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-text-secondary sm:text-lg">
              {tool.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-surface-900 px-3 py-1.5 text-xs font-medium text-text-secondary">
                Free tool
              </span>

              <span className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1.5 text-xs font-medium text-brand-cyan">
                Browser-based
              </span>

              <span className="rounded-full border border-border bg-surface-900 px-3 py-1.5 text-xs font-medium text-text-secondary">
                No sign-up
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="tool-workspace-title"
        className="border-b border-border bg-surface-900/30"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-950">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
                  Tool workspace
                </p>

                <h2
                  id="tool-workspace-title"
                  className="mt-1 text-lg font-semibold text-text-primary"
                >
                  Use {tool.name}
                </h2>
              </div>

              <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                Runs in your browser
              </span>
            </div>

            <div className="border-b border-border bg-surface-900/50 px-5 py-4 sm:px-6">
              <div className="flex gap-3">
                <div
                  aria-hidden="true"
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-cyan"
                />

                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Privacy-first processing
                  </p>

                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    This tool is designed to process its working input in your
                    browser. For details about site-level analytics, advertising,
                    and data handling, see the{' '}
                    <Link
                      href="/privacy"
                      className="font-medium text-brand-cyan hover:text-text-primary"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 lg:p-8">
              <ToolComponent />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:gap-14">
        <div className="space-y-14">
          {tool.howToUse && tool.howToUse.length > 0 && (
            <section aria-labelledby="how-to-use-heading">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
                Quick start
              </p>

              <h2
                id="how-to-use-heading"
                className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
              >
                How to use {tool.name}
              </h2>

              <ol className="mt-6 space-y-4">
                {tool.howToUse.map((step, index) => (
                  <li
                    key={`${index}-${step}`}
                    className="flex gap-4 rounded-xl border border-border bg-surface-900/50 p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-blue/30 bg-brand-blue/10 font-mono text-sm font-semibold text-brand-blue">
                      {index + 1}
                    </span>

                    <p className="pt-1 text-sm leading-6 text-text-secondary">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section aria-labelledby="about-tool-heading">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
              Overview
            </p>

            <h2
              id="about-tool-heading"
              className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
            >
              About {tool.name}
            </h2>

            <p className="mt-5 whitespace-pre-line leading-7 text-text-secondary">
              {tool.aboutText}
            </p>
          </section>

          {tool.faqs.length > 0 && (
            <section aria-labelledby="faq-heading">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-cyan">
                FAQ
              </p>

              <h2
                id="faq-heading"
                className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
              >
                Frequently asked questions
              </h2>

              <dl className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-900/50">
                {tool.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="p-5 sm:p-6"
                  >
                    <dt className="font-semibold text-text-primary">
                      {faq.question}
                    </dt>

                    <dd className="mt-2 text-sm leading-6 text-text-secondary">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {tool.features && tool.features.length > 0 && (
            <section className="rounded-xl border border-border bg-surface-900/50 p-5">
              <h2 className="font-semibold text-text-primary">
                Key features
              </h2>

              <ul className="mt-4 space-y-3">
                {tool.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm leading-6 text-text-secondary"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan"
                    />

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tool.useCases && tool.useCases.length > 0 && (
            <section className="rounded-xl border border-border bg-surface-900/50 p-5">
              <h2 className="font-semibold text-text-primary">
                Common use cases
              </h2>

              <ul className="mt-4 space-y-3">
                {tool.useCases.map((useCase) => (
                  <li
                    key={useCase}
                    className="flex gap-3 text-sm leading-6 text-text-secondary"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-purple"
                    />

                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-brand-cyan">
              Explore more
            </p>

            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Browse more utilities for developer workflows, data, formatting,
              encoding, conversion, and debugging.
            </p>

            <Link
              href="/tools"
              className="mt-4 inline-block text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary"
            >
              View all developer tools →
            </Link>
          </section>
        </aside>
      </div>

      {relatedTools.length > 0 && (
        <section className="border-t border-border bg-surface-900/30">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-purple">
                  Keep exploring
                </p>

                <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                  Related developer tools
                </h2>
              </div>

              <Link
                href={`/tools#${categorySlug}`}
                className="text-sm font-medium text-brand-cyan transition-colors hover:text-text-primary"
              >
                More {tool.category.toLowerCase()} →
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={`/tools/${relatedTool.slug}`}
                  className="group rounded-xl border border-border bg-surface-950/70 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-blue/60 hover:bg-surface-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
                >
                  <span className="font-mono text-xs uppercase tracking-wide text-brand-blue">
                    {relatedTool.category}
                  </span>

                  <h3 className="mt-3 text-lg font-semibold text-text-primary transition-colors group-hover:text-brand-cyan">
                    {relatedTool.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {relatedTool.description}
                  </p>

                  <span className="mt-5 inline-block text-sm font-medium text-text-muted transition-colors group-hover:text-brand-cyan">
                    Open tool →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
