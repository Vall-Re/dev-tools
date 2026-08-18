import Link from 'next/link';

export const metadata = {
  title: 'About Us | 100 DevTools Hub',
  description: 'Learn more about 100 DevTools Hub, a fast, client-side, developer-first tool repository.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">About 100 DevTools Hub</h1>
      
      <p className="mb-4">
        Welcome to <strong>100 DevTools Hub</strong>. This platform was created to provide developers, privacy-conscious engineers, and creators with fast, reliable, and secure daily utilities.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Client-Side First & Privacy-Focused</h2>
      <p className="mb-4">
        Unlike many online conversion tools that send your raw code or sensitive tokens to back-end servers, all utilities on 100 DevTools Hub run 100% locally inside your web browser. Your data never leaves your environment.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Our Mission</h2>
      <p className="mb-4">
        Our mission is to build a modern, zero-latency repository of high-quality tools without intrusive popups or heavy server overhead, making web development friction-free.
      </p>

      <div className="mt-8 pt-6 border-t">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Tools
        </Link>
      </div>
    </div>
  );
}