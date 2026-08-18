import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us – 100 DevTools Hub',
  description: 'Learn more about 100 DevTools Hub, our privacy-first philosophy, and our mission to provide fast, secure developer utilities.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto space-y-6 text-gray-300">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link> &gt; <span className="text-gray-100">About Us</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-100">About 100 DevTools Hub</h1>
      <p className="leading-relaxed">
        100 DevTools Hub is a professional, client-side developer utilities platform designed for maximum speed, security, and privacy. 
      </p>
      <h2 className="text-xl font-semibold text-gray-100 pt-4">Our Privacy Philosophy</h2>
      <p className="leading-relaxed">
        All data processing happens right in your browser using modern web technologies. We do not store, log, or transmit your sensitive code, JSON, tokens, or text data to any server. Your work stays strictly yours.
      </p>
    </main>
  );
}