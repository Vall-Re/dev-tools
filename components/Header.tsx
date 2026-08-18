'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [binaryString, setBinaryString] = useState('101010110100101');

  useEffect(() => {
    const interval = setInterval(() => {
      const randomBinary = Array.from({ length: 16 }, () =>
        Math.random() > 0.5 ? '1' : '0'
      ).join('');
      setBinaryString(randomBinary);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-36 h-12 flex items-center">
              <Image
                src="/public/logo.png"
                alt="100DevToolsHub Logo"
                fill
                className="object-contain object-left group-hover:opacity-90 transition"
                priority
              />
            </div>
          </Link>

          <div className="hidden lg:block font-mono text-xs text-emerald-500/70 tracking-widest bg-gray-900/60 px-2.5 py-1 rounded border border-gray-800 animate-pulse">
            {binaryString}
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="/#formatters" className="hover:text-blue-400 transition-colors">
            Formatters
          </Link>
          <Link href="/#encoders" className="hover:text-blue-400 transition-colors">
            Encoders
          </Link>
          <Link href="/#generators" className="hover:text-blue-400 transition-colors">
            Generators
          </Link>
          <Link href="/#converters" className="hover:text-blue-400 transition-colors">
            Converters
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Online
          </span>
        </div>

      </div>
    </header>
  );
}