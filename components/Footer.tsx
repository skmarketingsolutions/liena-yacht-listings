import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#040c17] border-t border-[#1e3050]">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <div className="leading-tight">
                <span className="font-display text-2xl font-semibold tracking-widest text-white block">LIENA Q PEREZ</span>
                <span className="font-label text-[10px] tracking-[4px] text-gold-500 block mt-0.5">LUXURY YACHT SALES · MIAMI</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your personal luxury yacht sales specialist in Miami & Miami Beach. Every listing personally curated. White-glove service from first inquiry to closing.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-[#1e3050] flex items-center justify-center text-gray-400 hover:border-gold-500 hover:text-gold-400 transition-colors">
                <Instagram size={15} />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-[#1e3050] flex items-center justify-center text-gray-400 hover:border-gold-500 hover:text-gold-400 transition-colors">
                <Facebook size={15} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-label text-[10px] tracking-[3px] uppercase text-gold-500 mb-5">Navigation</h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'All Listings', href: '/yachts' },
                { label: 'Yachts in Miami', href: '/yachts/miami' },
                { label: 'Yachts in Fort Lauderdale', href: '/yachts/fort-lauderdale' },
                { label: 'Yachts in South Florida', href: '/yachts/south-florida' },
                { label: 'Broker Profile', href: '/broker/liena-q-perez' },
                { label: 'About', href: '/#about' },
                { label: 'Contact', href: '/#contact' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-gold-400 text-sm transition-colors animated-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-label text-[10px] tracking-[3px] uppercase text-gold-500 mb-5">Contact Me</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a href="tel:+17868389911" className="flex items-start gap-3 text-gray-400 hover:text-gold-400 transition-colors group">
                  <Phone size={15} className="mt-0.5 shrink-0 text-gold-500/60 group-hover:text-gold-400 transition-colors" />
                  <span className="text-sm">786-838-9911</span>
                </a>
              </li>
              <li>
                <a href="mailto:liena@italiaboats.com" className="flex items-start gap-3 text-gray-400 hover:text-gold-400 transition-colors group">
                  <Mail size={15} className="mt-0.5 shrink-0 text-gold-500/60 group-hover:text-gold-400 transition-colors" />
                  <span className="text-sm">liena@italiaboats.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-gold-500/60" />
                  <span className="text-sm">Miami, Florida<br />United States</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1e3050] px-6 lg:px-10 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Liena Q Perez. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Listings subject to prior sale, price change, or withdrawal without notice.
          </p>
        </div>
      </div>
    </footer>
  );
}
