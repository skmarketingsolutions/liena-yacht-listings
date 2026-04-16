import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoHero from '@/components/VideoHero';
import YachtCard from '@/components/YachtCard';
import LeadForm from '@/components/LeadForm';
import { getAllListings } from '@/lib/db';
import { SITE_URL, BROKER, LOCATIONS } from '@/lib/seo-config';
import { Phone, Mail, Shield, Award, Users, MapPin } from 'lucide-react';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Liena Q Perez — Luxury Yacht Sales',
  alternateName: 'Italia Boats',
  description:
    'Miami luxury yacht sales specialist. Flybridge yachts, motor yachts, and superyachts for sale in Miami, Fort Lauderdale, and South Florida.',
  url: SITE_URL,
  telephone: BROKER.phone,
  email: BROKER.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Miami',
    addressRegion: 'FL',
    postalCode: '33132',
    addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 25.7617, longitude: -80.1918 },
  priceRange: '$$$',
  areaServed: LOCATIONS.map((l) => l.fullName),
  sameAs: [],
};

export const metadata: Metadata = {
  title: 'Luxury Yacht Sales Miami & Miami Beach',
  description:
    "Liena Q Perez — Miami's luxury yacht sales specialist. Browse exclusive flybridge yachts and motor yachts for sale in Miami & Miami Beach. Contact Liena for a private showing.",
};

export const dynamic = 'force-dynamic'; // always fresh from DB

export default async function HomePage() {
  // getAllListings() falls back to static data if DB is unavailable
  const listings = await getAllListings();

  const videoUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || '';

  return (
    <>
      <Header />

      {/* Org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <VideoHero videoUrl={videoUrl} />

      {/* ── Featured Listings ─────────────────────────────────── */}
      <section id="listings" className="py-24 px-6 lg:px-10 bg-[#0b1829]">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="mb-14">
            <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">Current Inventory</span>
            <div className="section-divider mt-3" />
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mt-4">
              Featured <span className="italic text-gold-400">Listings</span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl">
              Handpicked luxury yachts available now in Miami and Miami Beach. Each vessel personally inspected and curated by our brokers.
            </p>
          </div>

          {/* Cards grid */}
          {listings.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No listings available at this time. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <YachtCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Browse by Location ──────────────────────────────── */}
      <section className="py-12 px-6 lg:px-10 bg-[#081422]">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl font-semibold text-white mb-2">Browse by Market</h2>
          <div className="section-divider mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {LOCATIONS.slice(0, 10).map((loc) => (
              <Link
                key={loc.slug}
                href={`/yachts/${loc.slug}`}
                className="flex items-center gap-2 bg-[#0d1e33] border border-[#1e3050] hover:border-gold-500/40 rounded-lg px-4 py-3 text-gray-400 hover:text-gold-400 text-sm transition-colors"
              >
                <MapPin size={13} className="text-gold-500/60 shrink-0" />
                {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Liena ──────────────────────────────────── */}
      <section id="about" className="py-24 px-6 lg:px-10 bg-[#081422]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">About Liena Q Perez</span>
              <div className="section-divider mt-3" />
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mt-4 leading-tight">
                Your Personal<br />
                <span className="italic text-gold-400">Yacht Specialist</span>
              </h2>
              <p className="text-gray-400 mt-6 leading-relaxed">
                With deep expertise in Miami&apos;s luxury marine market, Liena Q Perez brings a personal, hands-on
                approach to yacht sales. Every listing is personally inspected and curated — from 40-foot flybridge
                yachts to 70-foot motor yachts.
              </p>
              <p className="text-gray-400 mt-4 leading-relaxed">
                Based in Miami and serving clients across South Florida, the Caribbean, and internationally. Every buyer
                receives white-glove service from first inquiry to closing. Liena handles it all.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a
                  href="tel:+17868389911"
                  className="inline-flex items-center gap-2 font-label text-xs tracking-[2px] uppercase text-gold-400 border border-gold-500/50 hover:border-gold-400 px-6 py-3 rounded transition-colors"
                >
                  <Phone size={14} /> 786-838-9911
                </a>
                <a
                  href="mailto:liena@italiaboats.com"
                  className="inline-flex items-center gap-2 font-label text-xs tracking-[2px] uppercase text-gray-400 border border-[#1e3050] hover:border-gold-500/40 px-6 py-3 rounded transition-colors"
                >
                  <Mail size={14} /> liena@italiaboats.com
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Award,
                  title: '15+ Years',
                  desc: 'Decades of experience in South Florida\'s luxury yacht market.',
                },
                {
                  icon: Shield,
                  title: 'Vetted Listings',
                  desc: 'Every vessel is personally inspected before listing. No surprises.',
                },
                {
                  icon: Users,
                  title: 'Full Service',
                  desc: 'Survey coordination, financing, documentation — we handle it all.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-[#0d1e33] border border-[#1e3050] rounded-lg p-6 text-center hover:border-gold-500/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-4">
                    <Icon size={20} className="text-gold-500" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Lead Capture Form ─────────────────────────────────── */}
      <section id="contact" className="py-24 px-6 lg:px-10 bg-[#0b1829]">
        <div className="max-w-3xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">Get In Touch</span>
            <div className="section-divider mt-3 mx-auto" />
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mt-4">
              Speak with <span className="italic text-gold-400">Liena</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-lg mx-auto">
              Fill out the form below and Liena will contact you within 24 hours to discuss your requirements and
              arrange a private showing.
            </p>
          </div>

          <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-8">
            <LeadForm />
          </div>

          {/* Direct contact */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <span className="text-gray-600 text-sm">Prefer to call?</span>
            <a
              href="tel:+17868389911"
              className="flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors"
            >
              <Phone size={15} />
              786-838-9911
            </a>
            <span className="text-gray-600 hidden sm:block">·</span>
            <a
              href="mailto:liena@italiaboats.com"
              className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
            >
              <Mail size={15} />
              liena@italiaboats.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
