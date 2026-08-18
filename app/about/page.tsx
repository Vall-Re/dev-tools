export const metadata = {
  title: 'About Us – 100 DevTools Hub',
  description: 'Learn more about 100 DevTools Hub, our mission, and our privacy-focused developer utilities.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto space-y-6 text-gray-100">
      <h1 className="text-4xl font-extrabold tracking-tight">About Us</h1>
      <p className="text-gray-400 leading-relaxed">
        Welcome to 100 DevTools Hub, your ultimate destination for fast, secure, and modern developer utilities. 
        All our tools run entirely client-side in your browser, guaranteeing that your data remains private and secure.
      </p>
    </main>
  );
}