'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface BinaryParticle {
  id: number;
  value: string;
  top: string;
  left: string;
  color: string;
  animationDuration: string;
  animationDelay: string;
}

export default function Header() {
  const [particles, setParticles] = useState<BinaryParticle[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const colors = [
      'text-blue-400', 
      'text-cyan-400', 
      'text-pink-500', 
      'text-purple-400', 
      'text-indigo-400'
    ];
    
    const generated: BinaryParticle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      value: Math.random() > 0.5 ? '1' : '0',
      top: `${Math.floor(Math.random() * 85) + 5}%`,
      left: `${Math.floor(Math.random() * 95) + 2}%`,
      color: colors[Math.floor(Math.random() * colors.length)],
      animationDuration: `${Math.random() * 2 + 1.5}s`,
      animationDelay: `${Math.random() * 2}s`,
    }));

    setParticles(generated);
  }, []);

  const handleCategoryClick = (category: string) => {
    if (pathname === '/') {
      // Якщо ми вже на головній — просто міняємо хеш і викликаємо подію
      window.location.hash = category;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      // Якщо ми на іншій сторінці (наприклад, усередині інструменту) — перенаправляємо на головну з хешем
      router.push(`/#${category}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/85 border-b border-gray-800/80 text-gray-100 overflow-hidden relative">
      
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
        {particles.map((p) => (
          <span
            key={p.id}
            className={`absolute font-mono text-xs select-none animate-pulse ${p.color}`}
            style={{
              top: p.top,
              left: p.left,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
            }}
          >
            {p.value}
          </span>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4 relative z-10">
        
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-36 h-12 flex items-center">
              <Image
                src="/logo.webp"
                alt="100DevToolsHub Logo"
                fill
                className="object-contain object-left group-hover:opacity-90 transition"
                priority
              />
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <button onClick={() => handleCategoryClick('formatters')} className="hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer">
            Formatters
          </button>
          <button onClick={() => handleCategoryClick('encoders')} className="hover:text-cyan-400 transition-colors bg-transparent border-none cursor-pointer">
            Encoders
          </button>
          <button onClick={() => handleCategoryClick('generators')} className="hover:text-pink-500 transition-colors bg-transparent border-none cursor-pointer">
            Generators
          </button>
          <button onClick={() => handleCategoryClick('utilities')} className="hover:text-purple-400 transition-colors bg-transparent border-none cursor-pointer">
            Utilities
          </button>
          <button onClick={() => handleCategoryClick('converters')} className="hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer">
            Converters
          </button>
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