'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close contact dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contactRef.current && !contactRef.current.contains(e.target as Node)) {
        setContactOpen(false);
      }
    };
    if (contactOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contactOpen]);

  const scrollToContact = () => {
    setOpen(false);
    setContactOpen(false);
    if (pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#contact';
    }
  };

  const navLinks = [
    { label: 'Listings', href: '/#listings' },
    { label: 'About',    href: '/#about' },
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
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-label text-xs tracking-[2px] uppercase text-gray-300 hover:text-gold-400 transition-colors animated-link"
              >
                {label}
              </Link>
            ))}

            {/* Contact dropdown */}
            <div ref={contactRef} className="relative">
              <button
                onClick={() => setContactOpen((v) => !v)}
                className={`font-label text-xs tracking-[2px] uppercase transition-colors animated-link ${
                  contactOpen ? 'text-gold-400' : 'text-gray-300 hover:text-gold-400'
                }`}
              >
                Contact
              </button>

              {contactOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 bg-[#0d1e33] border border-[#1e3050] rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                  {/* small gold top-bar accent */}
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
                  <div className="p-2 flex flex-col gap-1">
                    <a
                      href="tel:+17868389911"
                      onClick={() => setContactOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/5 transition-colors group"
                    >
                      <span className="w-7 h-7 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0 group-hover:bg-gold-500/20 transition-colors">
                        <Phone size={13} className="text-gold-400" />
                      </span>
                      <div>
                        <p className="font-label text-[10px] tracking-[2px] uppercase text-gold-400">Call Liena</p>
                        <p className="text-gray-400 text-[11px] mt-0.5">786-838-9911</p>
                      </div>
                    </a>
                    <button
                      onClick={scrollToContact}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/5 transition-colors group w-full text-left"
                    >
                      <span className="w-7 h-7 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0 group-hover:bg-gold-500/20 transition-colors">
                        <MessageSquare size={13} className="text-gold-400" />
                      </span>
                      <div>
                        <p className="font-label text-[10px] tracking-[2px] uppercase text-gold-400">Send a Message</p>
                        <p className="text-gray-400 text-[11px] mt-0.5">Contact form below</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={scrollToContact}
              className="font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 px-5 py-2.5 rounded transition-colors font-semibold"
            >
              Speak with Liena
            </button>
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
          {navLinks.map(({ label, href }) => (
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
            <p className="font-label text-[9px] tracking-[3px] uppercase text-gray-600">Contact</p>
            <a
              href="tel:+17868389911"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0d1e33] border border-[#1e3050] text-white"
            >
              <span className="w-7 h-7 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
                <Phone size={13} className="text-gold-400" />
              </span>
              <div>
                <p className="font-label text-[10px] tracking-[2px] uppercase text-gold-400">Call Liena</p>
                <p className="text-gray-400 text-xs mt-0.5">786-838-9911</p>
              </div>
            </a>
            <button
              onClick={scrollToContact}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0d1e33] border border-[#1e3050] text-white w-full text-left"
            >
              <span className="w-7 h-7 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
                <MessageSquare size={13} className="text-gold-400" />
              </span>
              <div>
                <p className="font-label text-[10px] tracking-[2px] uppercase text-gold-400">Send a Message</p>
                <p className="text-gray-400 text-xs mt-0.5">Contact form below</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
