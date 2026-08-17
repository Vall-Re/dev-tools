import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | 100 DevTools Hub',
  description: 'Terms of Service for 100 DevTools Hub.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">Last updated: August 2026</p>

      <p className="mb-4">
        By accessing and using <strong>100 DevTools Hub</strong> (https://100devtoolshub.com), you accept and agree to be bound by the terms and provision of this agreement.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Use License</h2>
      <p className="mb-4">
        All utilities provided on this website are completely free to use for personal, educational, and commercial development purposes. All computations and processing take place locally within your browser.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Disclaimer</h2>
      <p className="mb-4">
        The materials and tools on 100 DevTools Hub are provided on an 'as is' basis. We make no warranties, expressed or implied, regarding accuracy, completeness, or uptime guarantees.
      </p>

      <div className="mt-8 pt-6 border-t">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Tools
        </Link>
      </div>
    </div>
  );
}