import ToolSearch from '@/components/ToolSearch';

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto space-y-8 text-gray-100 bg-gray-950">
      <header className="text-center space-y-4 py-8 p-6 border border-gray-800 rounded-2xl bg-gray-900 shadow-sm">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Free Online Developer Tools
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Fast, secure, and easy-to-use web tools for developers. All data processing happens right in your browser.
        </p>
      </header>

      <ToolSearch />
    </main>
  );
}