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
    <main className="min-h-screen py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 text-gray-300 bg-gray-950">
      <div className="space-y-3 p-6 border border-gray-800 rounded-xl bg-gray-900 shadow-sm">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">About 100 DevTools Hub</h1>
        <p className="text-lg text-gray-400">
          Empowering developers worldwide with fast, secure, and privacy-focused online utilities.
        </p>
      </div>

      <section className="p-6 border border-gray-800 rounded-xl bg-gray-900 space-y-4 shadow-sm">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Our Mission</h2>
        <p className="leading-relaxed text-gray-300">
          At <strong className="text-white">100 DevTools Hub</strong>, our goal is to build the ultimate, go-to ecosystem for everyday programming tasks. Whether you are debugging JSON payloads, formatting SQL queries, encoding Base64 strings, or analyzing JWT tokens, our platform provides instant, reliable solutions without the clutter of ads or slow server roundtrips.
        </p>
      </section>

      <section className="p-6 border border-gray-800 rounded-xl bg-gray-900 space-y-4 shadow-sm">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Why Choose Our Developer Tools?</h2>
        <div className="space-y-4 text-gray-300">
          <div className="space-y-1">
            <h3 className="font-semibold text-white">100% Client-Side Processing</h3>
            <p className="text-sm text-gray-400">
              All data formatting and generation happen locally inside your browser using modern web technologies. Your sensitive data never leaves your machine.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-white">Lightning Fast & Minimalist</h3>
            <p className="text-sm text-gray-400">
              Built with Next.js App Router and Tailwind CSS for a cyber-minimalist, distraction-free interface.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-white">Zero Installation Required</h3>
            <p className="text-sm text-gray-400">
              Access a rich collection of developer utilities instantly from any device, anywhere, without installing heavy software or extensions.
            </p>
          </div>
        </div>
      </section>

      <section className="p-6 border border-gray-800 rounded-xl bg-gray-900 space-y-4 shadow-sm">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-2">Built by Developers, for Developers</h2>
        <p className="leading-relaxed text-gray-300">
          We understand the pain points of modern software engineering. Switching between multiple obscure websites to perform basic tasks wastes valuable development time. 100 DevTools Hub aggregates essential utilities into a single, highly optimized platform to streamline your workflow and boost productivity.
        </p>
      </section>
    </main>
  );
}