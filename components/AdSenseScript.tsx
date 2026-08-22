'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function AdSenseScript() {
  const pathname = usePathname();

  if (pathname === '/privacy') {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7938500556034307"
      crossOrigin="anonymous"
    />
  );
}