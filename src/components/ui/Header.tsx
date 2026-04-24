'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_LINKS = [
  { href: '/',        label: '홈' },
  { href: '/archive', label: '기억 아카이브' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  // close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300',
        scrolled
          ? 'bg-cream/90 backdrop-blur-md border-b border-beige shadow-card'
          : 'bg-transparent',
      )}
      ref={menuRef}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl text-deep-brown font-semibold tracking-tight hover:text-warm-brown transition-colors"
        >
          베이비펫
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="메인 내비게이션">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm transition-all duration-150',
                  active
                    ? 'bg-beige text-warm-brown font-medium'
                    : 'text-soft-brown hover:text-deep-brown hover:bg-beige/60',
                )}
              >
                {label}
              </Link>
            );
          })}

          <Link
            href="/upload"
            className="ml-3 px-5 py-2 rounded-full bg-warm-brown text-white text-sm font-medium hover:bg-deep-brown transition-colors shadow-sm"
          >
            시작하기
          </Link>
        </nav>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden p-2 rounded-full text-deep-brown hover:bg-beige transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-cream/95 backdrop-blur-md border-t border-beige"
            aria-label="모바일 내비게이션"
          >
            <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'px-4 py-3 rounded-2xl text-sm font-medium transition-colors',
                      active
                        ? 'bg-beige text-warm-brown'
                        : 'text-deep-brown hover:bg-beige/70',
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
              <Link
                href="/upload"
                className="mt-2 px-4 py-3 rounded-2xl bg-warm-brown text-white text-sm font-medium text-center hover:bg-deep-brown transition-colors"
              >
                아기 시절 복원 시작하기 →
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
