export const metadata = {
  title: 'Privacy Policy – 100 DevTools Hub',
  description: 'Read our privacy policy to understand how 100 DevTools Hub protects your data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto space-y-6 text-gray-100">
      <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
      <p className="text-gray-400 leading-relaxed">
        Your privacy is our top priority. 100 DevTools Hub operates entirely on the client side. 
        This means all code processing, parsing, and formatting happen right inside your browser. 
        We do not store, log, or transmit any data you input into our tools to any servers.
      </p>
    </main>
  );
}