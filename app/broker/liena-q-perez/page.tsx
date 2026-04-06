import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import YachtCard from '@/components/YachtCard';
import { getAllListings } from '@/lib/db';
import { BROKER, LOCATIONS, SITE_URL } from '@/lib/seo-config';
import { Phone, Mail, MapPin, ChevronRight, Award, Shield, Users, Star } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Liena Q Perez — Luxury Yacht Sales Specialist Miami | Italia Boats',
  description:
    'Liena Q Perez is a Miami-based luxury yacht sales specialist with 15+ years in the South Florida market. Flybridge yachts, motor yachts, superyachts. Call 786-838-9911.',
  keywords: [
    'Liena Q Perez',
    'Liena Q Perez yacht broker',
    'Liena Q Perez Miami',
    'luxury yacht broker Miami',
    'yacht sales specialist Miami',
    'Italia Boats Miami',
    'flybridge yacht broker South Florida',
  ],
  alternates: {
    canonical: `${SITE_URL}/broker/liena-q-perez`,
  },
  openGraph: {
    title: 'Liena Q Perez — Luxury Yacht Sales Specialist Miami',
    description:
      'Miami-based luxury yacht sales specialist. 15+ years in South Florida. Flybridge yachts, motor yachts, and superyachts. Personal service from inquiry to closing.',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: BROKER.name,
    jobTitle: BROKER.title,
    telephone: BROKER.phone,
    email: BROKER.email,
    url: `${SITE_URL}/broker/liena-q-perez`,
    worksFor: {
      '@type': 'Organization',
      name: 'Italia Boats',
      url: SITE_URL,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Miami',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    areaServed: [
      'Miami, FL', 'Fort Lauderdale, FL', 'West Palm Beach, FL',
      'Boca Raton, FL', 'Naples, FL', 'Palm Beach, FL', 'Key West, FL',
    ],
    knowsAbout: [
      'Luxury Yacht Sales', 'Flybridge Yachts', 'Motor Yachts',
      'Yacht Brokerage', 'South Florida Marine Market', 'Yacht Financing',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Liena Q Perez — Luxury Yacht Sales',
    telephone: BROKER.phone,
    email: BROKER.email,
    url: SITE_URL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Miami',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 25.7617, longitude: -80.1918 },
    priceRange: '$$$',
    areaServed: LOCATIONS.map((l) => l.fullName),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Liena Q Perez', item: `${SITE_URL}/broker/liena-q-perez` },
    ],
  },
];

export default async function BrokerPage() {
  let listings: Awaited<ReturnType<typeof getAllListings>> = [];
  try {
    listings = await getAllListings();
  } catch { /* DB not ready */ }

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="pt-20 bg-[#0b1829] min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Liena Q Perez</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">Luxury Yacht Sales Specialist</span>
              <div className="section-divider mt-3 mb-4" />
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight">
                Liena Q Perez
              </h1>
              <p className="text-gold-400 font-label text-xs tracking-[3px] uppercase mt-2 mb-6">
                Miami, Florida · Italia Boats
              </p>

              <p className="text-gray-300 leading-relaxed mb-4">
                Liena Q Perez is one of South Florida&apos;s most respected luxury yacht sales specialists, with over
                15 years of direct experience representing buyers and sellers of premium motor yachts, flybridge
                yachts, and superyachts in the Miami, Fort Lauderdale, and Palm Beach markets.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                Operating through Italia Boats, Liena specializes in European-built yachts — Azimut, Fairline,
                Sunseeker, Ferretti, and similar marques — and brings deep manufacturer knowledge, survey experience,
                and an established network of captains, surveyors, and financing contacts to every transaction.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Unlike larger brokerages where listings are passed between junior agents, Liena personally handles
                every inquiry, every showing, every sea trial, and every closing. Buyers and sellers work directly
                with Liena throughout the entire process.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={BROKER.phoneHref}
                  className="inline-flex items-center justify-center gap-2 font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Phone size={14} /> {BROKER.phone}
                </a>
                <a
                  href={`mailto:${BROKER.email}`}
                  className="inline-flex items-center justify-center gap-2 font-label text-xs tracking-[2px] uppercase border border-[#1e3050] hover:border-gold-500/40 text-gray-400 hover:text-gold-400 px-6 py-3 rounded-lg transition-colors"
                >
                  <Mail size={14} /> {BROKER.email}
                </a>
              </div>
            </div>

            {/* Stats / credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Award,
                  title: '15+ Years',
                  desc: 'Decade-plus of experience in South Florida\'s luxury yacht market, from Biscayne Bay to Palm Beach.',
                },
                {
                  icon: Shield,
                  title: 'Every Vessel Vetted',
                  desc: 'Every listing is personally inspected and documented before representation. No surprises at survey.',
                },
                {
                  icon: Users,
                  title: 'Full-Service',
                  desc: 'Survey coordination, financing introductions, title search, documentation, and closing — all handled personally.',
                },
                {
                  icon: Star,
                  title: 'European Specialist',
                  desc: 'Deep expertise in Azimut, Fairline, Sunseeker, Ferretti, and other European luxury marques.',
                },
                {
                  icon: MapPin,
                  title: 'Miami-Based',
                  desc: 'Available for showings across South Florida — Miami, Fort Lauderdale, Boca Raton, Palm Beach, Naples.',
                },
                {
                  icon: Phone,
                  title: 'Direct Access',
                  desc: 'Every client has Liena\'s direct line. No hold queues, no assistants, no delays.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-5 hover:border-gold-500/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-gold-500" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialization */}
        <section className="bg-[#081422] py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">Specialization</span>
            <div className="section-divider mt-3 mb-4" />
            <h2 className="font-display text-3xl font-semibold text-white mb-8">
              What Liena Specializes In
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Flybridge Yachts',
                  desc: 'Flybridge yachts represent the pinnacle of motor yacht versatility — a full-beam main salon, generous cockpit, and elevated bridge for outstanding visibility and entertaining. Liena has sold more flybridge yachts in Miami than any other vessel type and knows these boats intimately.',
                  link: '/yachts/miami',
                  linkLabel: 'View Miami Listings',
                },
                {
                  title: 'Motor Yachts',
                  desc: 'From express cruisers to full-displacement long-range vessels, Liena covers the full spectrum of motor yachts. Her European manufacturer relationships provide access to pre-sale inventory and off-market opportunities not listed publicly.',
                  link: '/yachts/fort-lauderdale',
                  linkLabel: 'View Fort Lauderdale Listings',
                },
                {
                  title: 'Pre-Owned Inventory',
                  desc: "The pre-owned market requires expertise — distinguishing vessels with deferred maintenance from genuinely well-maintained inventory is a skill developed through hundreds of surveys and sea trials. Liena's vetting process is comprehensive.",
                  link: '/yachts/south-florida',
                  linkLabel: 'View South Florida Listings',
                },
              ].map(({ title, desc, link, linkLabel }) => (
                <div key={title} className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-6">
                  <h3 className="font-display text-xl font-semibold text-white mb-3">{title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm mb-4">{desc}</p>
                  <Link
                    href={link}
                    className="text-gold-400 hover:text-gold-300 font-label text-[10px] tracking-[2px] uppercase flex items-center gap-1 transition-colors"
                  >
                    {linkLabel} <ChevronRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service areas */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">Service Area</span>
          <div className="section-divider mt-3 mb-4" />
          <h2 className="font-display text-3xl font-semibold text-white mb-6">Markets Covered</h2>
          <p className="text-gray-400 max-w-2xl mb-8 leading-relaxed">
            Liena Q Perez shows vessels and works with buyers and sellers across all major South Florida and
            Florida yacht markets. Showings can be arranged with 24–48 hours notice at any of the following locations.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {LOCATIONS.map((loc) => (
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
        </section>

        {/* Current listings */}
        {listings.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
            <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">Current Inventory</span>
            <div className="section-divider mt-3 mb-4" />
            <h2 className="font-display text-3xl font-semibold text-white mb-8">Active Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <YachtCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
          <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">Get In Touch</span>
                <div className="section-divider mt-3 mb-4" />
                <h2 className="font-display text-3xl font-semibold text-white mb-4">
                  Ready to Find Your Yacht?
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Whether you&apos;re buying your first luxury yacht or adding to an existing fleet, Liena Q Perez
                  provides the market expertise, personal attention, and professional execution to make the process
                  seamless. Start with a conversation.
                </p>
                <ul className="flex flex-col gap-4">
                  <li>
                    <a href={BROKER.phoneHref} className="flex items-center gap-3 text-gray-300 hover:text-gold-400 transition-colors group">
                      <Phone size={16} className="text-gold-500/60 group-hover:text-gold-400 transition-colors" />
                      <span className="font-medium">{BROKER.phone}</span>
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${BROKER.email}`} className="flex items-center gap-3 text-gray-300 hover:text-gold-400 transition-colors group">
                      <Mail size={16} className="text-gold-500/60 group-hover:text-gold-400 transition-colors" />
                      <span>{BROKER.email}</span>
                    </a>
                  </li>
                  <li>
                    <div className="flex items-center gap-3 text-gray-400">
                      <MapPin size={16} className="text-gold-500/60" />
                      <span>Miami, Florida · Available statewide</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-6">
                  All inquiries are handled personally by Liena Q Perez. Response within 24 hours guaranteed.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={BROKER.phoneHref}
                    className="flex items-center justify-center gap-2 w-full bg-gold-500 hover:bg-gold-400 text-navy-950 py-4 rounded-xl font-semibold font-label text-sm tracking-wider transition-colors"
                  >
                    <Phone size={16} /> Call Liena Now
                  </a>
                  <Link
                    href="/#contact"
                    className="flex items-center justify-center gap-2 w-full border border-[#1e3050] hover:border-gold-500/40 text-gray-400 hover:text-gold-400 py-4 rounded-xl font-label text-xs tracking-[2px] uppercase transition-colors"
                  >
                    Send a Message
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
