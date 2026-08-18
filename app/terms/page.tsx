import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service – 100 DevTools Hub',
  description: 'Review the terms of service governing the usage of 100 DevTools Hub free online developer tools and website utilities.',
  alternates: {
    canonical: 'https://100devtoolshub.com/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 text-gray-300">
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Terms of Service</h1>
        <p className="text-lg text-gray-400">
          Please read these terms carefully before using 100 DevTools Hub.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">1. Acceptance of Terms</h2>
        <p className="leading-relaxed">
          By accessing and using <strong className="text-white">100 DevTools Hub</strong>, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please refrain from using our website and tools.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">2. Use of Free Utilities</h2>
        <p className="leading-relaxed">
          All tools provided on this platform are free of charge for personal, educational, and commercial use. You agree to use these utilities responsibly and lawfully, without attempting to disrupt service availability, compromise system security, or overload our hosting infrastructure.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">3. Disclaimer of Warranties</h2>
        <p className="leading-relaxed">
          All tools and utilities on 100 DevTools Hub are provided on an <strong className="text-white">&quot;as is&quot;</strong> and <strong className="text-white">&quot;as available&quot;</strong> basis without warranties of any kind, whether express or implied. We do not guarantee that the tools will be completely uninterrupted, error-free, or entirely accurate for every specialized edge case. You are solely responsible for validating outputs before deploying generated code or configurations to production environments.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">4. Limitation of Liability</h2>
        <p className="leading-relaxed">
          In no event shall 100 DevTools Hub, its creators, or maintainers be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our online utilities.
        </p>
      </section>
    </main>
  );
}