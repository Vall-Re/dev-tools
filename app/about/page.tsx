import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us – 100 DevTools Hub | Free Developer Utilities',
  description: 'Discover 100 DevTools Hub, a comprehensive platform of fast, secure, and client-side web tools designed for developers, programmers, and engineers.',
  alternates: {
    canonical: 'https://100devtoolshub.com/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 text-gray-300">
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">About 100 DevTools Hub</h1>
        <p className="text-lg text-gray-400">
          Empowering developers worldwide with fast, secure, and privacy-focused online utilities.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Our Mission</h2>
        <p className="leading-relaxed">
          At <strong className="text-white">100 DevTools Hub</strong>, our goal is to build the ultimate, go-to ecosystem for everyday programming tasks. Whether you are debugging JSON payloads, formatting SQL queries, encoding Base64 strings, or analyzing JWT tokens, our platform provides instant, reliable solutions without the clutter of ads or slow server roundtrips.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Why Choose Our Developer Tools?</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300 pl-2">
          <li><strong className="text-white">100% Client-Side Processing:</strong> All data formatting and generation happen locally inside your browser using modern web technologies. Your sensitive data never leaves your machine.</li>
          <li><strong className="text-white">Lightning Fast & Minimalist:</strong> Built with Next.js App Router and Tailwind CSS for a cyber-minimalist, distraction-free interface.</li>
          <li><strong className="text-white">Zero Installation Required:</strong> Access a rich collection of developer utilities instantly from any device, anywhere, without installing heavy software or extensions.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Built by Developers, for Developers</h2>
        <p className="leading-relaxed">
          We understand the pain points of modern software engineering. Switching between multiple obscure websites to perform basic tasks wastes valuable development time. 100 DevTools Hub aggregates essential utilities into a single, highly optimized platform to streamline your workflow and boost productivity.
        </p>
      </section>
    </main>
  );
}