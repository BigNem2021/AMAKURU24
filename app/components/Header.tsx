'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/translations';
import { Menu, X, Search, Moon, Sun, ChevronDown } from 'lucide-react';
import { SearchModal } from './SearchModal';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMoreOpen, setIsMoreOpen] = React.useState(false);
  const { language, theme, setTheme } = useAppStore();
  const t = getTranslation(language);

  // Handle keyboard shortcut (Ctrl+K or Cmd+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.news', href: '/category/amakuru' },
    { key: 'nav.politics', href: '/category/politiki' },
    { key: 'nav.health', href: '/category/ubuzima' },
    { key: 'nav.education', href: '/category/uburezi' },
    { key: 'nav.business', href: '/category/ubukungu' },
    { key: 'nav.technology', href: '/category/ikoranabuhanga' },
    { key: 'nav.entertainment', href: '/category/imyidagaduro' },
    { key: 'nav.justice', href: '/category/ubutabera' },
    { key: 'nav.environment', href: '/category/ibidukikije' },
    { key: 'nav.sports', href: '/category/iyobokamana' },
    { key: 'nav.faith', href: '/category/imyemerere' },
  ];

  const visibleItems = navItems.slice(0, 8);
  const moreItems = navItems.slice(8);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1 sm:gap-2 font-semibold text-base sm:text-lg tracking-wider text-neutral-900 dark:text-white flex-shrink-0"
          >
            <img src="/logo.png" alt="Intambwe Media" className="h-10 sm:h-14 w-auto rounded-lg" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {visibleItems.map((item) => {
              const parts = item.key.split('.');
              const label = (t as any)[parts[0]]?.[parts[1]] || item.key;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white hover:text-red-700 dark:hover:text-red-600 transition-colors whitespace-nowrap"
                >
                  <span className="nav-link pb-0.5">
                    {label}
                  </span>
                </Link>
              );
            })}

            {/* More Categories Dropdown */}
            {moreItems.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white hover:text-red-700 dark:hover:text-red-600 transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  <span className="nav-link pb-0.5">{t.nav.more}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMoreOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-40">
                    {moreItems.map((item) => {
                      const parts = item.key.split('.');
                      const label = (t as any)[parts[0]]?.[parts[1]] || item.key;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-xs sm:text-sm text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                          onClick={() => setIsMoreOpen(false)}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search (Ctrl+K)"
              title="Search articles (Ctrl+K)"
              className="p-2 sm:p-2.5 hover:bg-white/10 dark:hover:bg-neutral-800/50 rounded-lg transition-colors"
            >
              <Search className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="p-2 sm:p-2.5 hover:bg-white/10 dark:hover:bg-neutral-800/50 rounded-lg transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 sm:w-5 h-4 sm:h-5" />
              ) : (
                <Moon className="w-4 sm:w-5 h-4 sm:h-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 sm:p-2.5 hover:bg-white/10 dark:hover:bg-neutral-800/50 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 sm:w-6 h-5 sm:h-6" />
              ) : (
                <Menu className="w-5 sm:w-6 h-5 sm:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-3 sm:pb-4 space-y-1 sm:space-y-2 border-t border-neutral-200 dark:border-neutral-800 mt-2">
            {navItems.map((item) => {
              const parts = item.key.split('.');
              const label = (t as any)[parts[0]]?.[parts[1]] || item.key;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 sm:px-4 py-3 rounded-lg text-sm sm:text-base text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}

