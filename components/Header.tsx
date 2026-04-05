'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    { label: 'Listings', href: '/#listings' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#070e1a]/95 backdrop-blur-md border-b border-[#1e3050] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-gradient-to-b from-[#000000aa] to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="leading-tight">
              <span className="font-display text-xl font-semibold tracking-widest text-white block">LIENA Q PEREZ</span>
              <span className="font-label text-[10px] tracking-[4px] text-gold-500 block -mt-0.5">YACHTS</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {nav.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-label text-xs tracking-[2px] uppercase text-gray-300 hover:text-gold-400 transition-colors animated-link"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+17868389911"
              className="flex items-center gap-2 font-label text-xs tracking-wider text-gold-400 hover:text-gold-300 transition-colors"
            >
              <Phone size={14} />
              Contact Liena
            </a>
            <a
              href="/#contact"
              className="font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 px-5 py-2.5 rounded transition-colors font-semibold"
            >
              Speak with Liena
            </a>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#070e1a]/98 backdrop-blur-md border-t border-[#1e3050] px-6 py-6 flex flex-col gap-5">
          {nav.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="font-label text-sm tracking-[2px] uppercase text-gray-200 hover:text-gold-400 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#1e3050] flex flex-col gap-3">
            <a href="tel:+17868389911" className="flex items-center gap-2 text-gold-400 text-sm font-medium">
              <Phone size={15} /> Contact Liena
            </a>
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="text-center font-label text-xs tracking-[2px] uppercase bg-gold-500 text-navy-950 px-5 py-3 rounded font-semibold"
            >
              Speak with Liena
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
