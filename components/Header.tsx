'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BinaryParticle {
  id: number;
  value: '0' | '1';
  top: string;
  left: string;
  color: string;
  animationDuration: string;
  animationDelay: string;
}

const PARTICLE_COLORS = [
  'text-brand-cyan',
  'text-brand-blue',
  'text-brand-purple',
  'text-success',
];

const navItems = [
  {
    label: 'Tools',
    href: '/tools',
  },
  {
    label: 'Categories',
    href: '/tools#categories',
  },
  {
    label: 'About',
    href: '/about',
  },
];

export default function Header() {
  const pathname = usePathname();

  const [particles, setParticles] = useState<BinaryParticle[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const generatedParticles: BinaryParticle[] = Array.from(
        { length: 24 },
        (_, index) => ({
          id: index,
          value: Math.random() > 0.5 ? '1' : '0',
          top: `${Math.floor(Math.random() * 84) + 8}%`,
          left: `${Math.floor(Math.random() * 96) + 2}%`,
          color:
            PARTICLE_COLORS[
              Math.floor(Math.random() * PARTICLE_COLORS.length)
            ],
          animationDuration: `${Math.random() * 2 + 1.5}s`,
          animationDelay: `${Math.random() * 2}s`,
        })
      );

      setParticles(generatedParticles);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/tools') {
      return pathname === '/tools' || pathname.startsWith('/tools/');
    }

    if (href === '/about') {
      return pathname === '/about';
    }

    return false;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface-950/90 text-text-primary backdrop-blur-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-50"
      >
        {particles.map((particle) => (
          <span
            key={particle.id}
            className={`absolute select-none font-mono text-xs animate-pulse ${particle.color}`}
            style={{
              top: particle.top,
              left: particle.left,
              animationDuration: particle.animationDuration,
              animationDelay: particle.animationDelay,
            }}
          >
            {particle.value}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="100 DevTools Hub home"
          className="flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan"
        >
          <Image
            src="/logo.webp"
            alt="100 DevTools Hub"
            width={144}
            height={48}
            priority
            className="h-10 w-auto object-contain transition-opacity hover:opacity-90"
          />
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan ${
                  active
                    ? 'bg-surface-800 text-brand-cyan'
                    : 'text-text-secondary hover:bg-surface-900 hover:text-text-primary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#search"
            className="hidden items-center gap-2 rounded-lg border border-border bg-surface-900/80 px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan sm:flex"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>

            <span>Search</span>
          </Link>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-900/80 text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan md:hidden"
          >
            {mobileMenuOpen ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="relative z-10 border-t border-border bg-surface-950/95 px-4 py-4 backdrop-blur-xl md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={closeMobileMenu}
                  className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand-cyan ${
                    active
                      ? 'bg-surface-800 text-brand-cyan'
                      : 'text-text-secondary hover:bg-surface-900 hover:text-text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/#search"
              onClick={closeMobileMenu}
              className="mt-2 flex items-center gap-2 rounded-lg border border-border px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-900 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-brand-cyan"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              Search tools
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
