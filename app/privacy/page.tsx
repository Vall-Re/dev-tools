import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy – 100 DevTools Hub',
  description: 'Read our privacy policy regarding client-side data processing and browser-based developer tools.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto space-y-6 text-gray-300">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link> &gt; <span className="text-gray-100">Privacy Policy</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-100">Privacy Policy</h1>
      <p className="leading-relaxed">
        Your privacy is our highest priority. Because 100 DevTools Hub operates entirely client-side, your input data never leaves your device.
      </p>
      <h2 className="text-xl font-semibold text-gray-100 pt-4">Analytics and Ads</h2>
      <p className="leading-relaxed">
        We may use standard analytics and advertising networks (such as Google AdSense) which may use cookies to serve ads based on prior visits to our website.
      </p>
    </main>
  );
}