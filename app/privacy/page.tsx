import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | 100 DevTools Hub',
  description: 'Privacy Policy for 100 DevTools Hub. Learn how we process data strictly client-side.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: August 2026</p>

      <p className="mb-4">
        At <strong>100 DevTools Hub</strong> (accessible from https://100devtoolshub.com), one of our main priorities is the privacy of our visitors. All developer tools on this website execute entirely within your client-side browser. We do not store, send, or process your input data on any external server.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Cookies and Web Beacons</h2>
      <p className="mb-4">
        Like any other website, 100 DevTools Hub uses cookies to store information including visitors preferences and the pages on the website that the visitor accessed or visited.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Google DoubleClick DART Cookie</h2>
      <p className="mb-4">
        Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Third Party Privacy Policies</h2>
      <p className="mb-4">
        100 DevTools Hub Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.
      </p>

      <div className="mt-8 pt-6 border-t">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Tools
        </Link>
      </div>
    </div>
  );
}