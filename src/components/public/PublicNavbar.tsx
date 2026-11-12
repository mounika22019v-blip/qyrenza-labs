import React, { useState } from 'react';
import { Zap, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface PublicNavbarProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onNavigateToDashboard: () => void;
  isAuthenticated: boolean;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  onOpenAuth,
  onNavigateToDashboard,
  isAuthenticated,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Solutions', href: '#solution' },
    { label: 'Features', href: '#features' },
    { label: 'Vision', href: '#vision' },
    { label: 'Founders', href: '#founders' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#060913]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#hero"
          onClick={(e) => handleScroll(e, '#hero')}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="tracking-wider text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300">
            QYRENZA LABS
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="hover:text-cyan-400 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <button
              onClick={onNavigateToDashboard}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
            >
              Access Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:opacity-90 transition-all cursor-pointer"
              >
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#090e1c] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 py-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-cyan-300"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToDashboard();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500 py-2.5 text-xs font-semibold text-white"
              >
                Access Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="rounded-lg border border-slate-700 py-2 text-xs font-medium text-slate-200"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="rounded-lg bg-cyan-500 py-2 text-xs font-semibold text-white"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
