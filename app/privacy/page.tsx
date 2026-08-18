import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy – 100 DevTools Hub',
  description: 'Read the privacy policy of 100 DevTools Hub. Learn how our client-side architecture ensures absolute data privacy and security for all your code processing.',
  alternates: {
    canonical: 'https://100devtoolshub.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 text-gray-300">
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Privacy Policy</h1>
        <p className="text-lg text-gray-400">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Our Commitment to Your Privacy</h2>
        <p className="leading-relaxed">
          At <strong className="text-white">100 DevTools Hub</strong>, we take your data privacy seriously. Because our platform is engineered primarily as a suite of client-side developer utilities, your security is built directly into our technical architecture.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Data Processing & Storage</h2>
        <p className="leading-relaxed">
          <strong className="text-white">We do not store, log, save, or transmit any data</strong> that you input, paste, or generate using our tools (such as JSON objects, passwords, JWT tokens, hashes, or source code). All transformations, parsing, and computations are executed entirely within your browser environment using JavaScript/TypeScript. Once you close or refresh the tab, your data disappears.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Analytics & Advertising</h2>
        <p className="leading-relaxed">
          We may use standard analytics tools (like Google Analytics) and third-party advertising networks (such as Google AdSense) to help maintain and support our free platform. These services may use cookies or similar technologies to collect non-personal usage data, standard log information, and browser details to serve relevant advertisements and analyze traffic patterns.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Changes to This Policy</h2>
        <p className="leading-relaxed">
          We may update this Privacy Policy from time to time to reflect functional improvements or regulatory requirements. Continued use of 100 DevTools Hub constitutes acceptance of these terms.
        </p>
      </section>
    </main>
  );
}