import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import YachtCard from '@/components/YachtCard';
import { getAllListings } from '@/lib/db';
import { LOCATIONS, BROKER } from '@/lib/seo-config';
import { generateHubMeta } from '@/lib/seo-content';
import { Phone, ChevronRight, MapPin } from 'lucide-react';

export const revalidate = 3600; // ISR — regenerate every hour

const hub = generateHubMeta();

export const metadata: Metadata = {
  title: hub.title,
  description: hub.description,
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lienayperez.com'}/yachts`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Luxury Yachts For Sale in Florida',
  description: hub.description,
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lienayperez.com'}/yachts`,
};

export default async function YachtsHubPage() {
  let listings: Awaited<ReturnType<typeof getAllListings>> = [];
  try {
    listings = await getAllListings();
  } catch {
    /* DB not ready */
  }

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
            <span className="text-white">Yachts For Sale</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-12">
          <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">Full Inventory</span>
          <div className="section-divider mt-3 mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight">
            {hub.h1}
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">
            Browse the current inventory of luxury motor yachts, flybridge yachts, and premium pre-owned vessels
            available through Liena Q Perez — Miami&apos;s luxury yacht sales specialist. Every listing is personally
            inspected and represented.
          </p>
          <a
            href={BROKER.phoneHref}
            className="inline-flex items-center gap-2 mt-6 font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Phone size={14} /> Call Liena — {BROKER.phone}
          </a>
        </section>

        {/* Listings grid */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
          {listings.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No listings available. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <YachtCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>

        {/* Browse by location */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
          <h2 className="font-display text-2xl font-semibold text-white mb-2">Browse by Location</h2>
          <div className="section-divider mb-8" />
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
        </section>

        {/* About Liena CTA */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
          <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-8 md:p-12 text-center">
            <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">Your Broker</span>
            <div className="section-divider mt-3 mb-4 mx-auto" />
            <h2 className="font-display text-3xl font-semibold text-white">Liena Q Perez</h2>
            <p className="text-gold-400 font-label text-xs tracking-[2px] uppercase mt-1 mb-4">Luxury Yacht Sales Specialist · Miami, Florida</p>
            <p className="text-gray-400 max-w-xl mx-auto leading-relaxed text-sm">
              With over 15 years in South Florida&apos;s luxury marine market, Liena provides personal, white-glove
              service from first inquiry to closing. Every listing personally inspected. Every buyer personally served.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <a
                href={BROKER.phoneHref}
                className="inline-flex items-center justify-center gap-2 font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Phone size={14} /> {BROKER.phone}
              </a>
              <Link
                href="/broker/liena-q-perez"
                className="inline-flex items-center justify-center gap-2 font-label text-xs tracking-[2px] uppercase border border-[#1e3050] hover:border-gold-500/40 text-gray-400 hover:text-gold-400 px-6 py-3 rounded-lg transition-colors"
              >
                View Broker Profile
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
