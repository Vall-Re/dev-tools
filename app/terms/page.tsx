import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service – 100 DevTools Hub',
  description: 'Terms and conditions for using 100 DevTools Hub developer utilities.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto space-y-6 text-gray-300">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link> &gt; <span className="text-gray-100">Terms of Service</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-100">Terms of Service</h1>
      <p className="leading-relaxed">
        By accessing 100 DevTools Hub, you agree to use our free online developer utilities responsibly. The tools are provided "as is" without warranty of any kind.
      </p>
    </main>
  );
}