import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import YachtCard from '@/components/YachtCard';
import { getAllListings } from '@/lib/db';
import { LOCATIONS, MODIFIERS, BROKER, getBaseSlug, getLocation } from '@/lib/seo-config';
import { generateCityHubMeta } from '@/lib/seo-content';
import { Phone, ChevronRight, MapPin } from 'lucide-react';

export const revalidate = 3600;

interface PageProps {
  params: { city: string };
}

export async function generateStaticParams() {
  return LOCATIONS.map((loc) => ({ city: loc.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const location = getLocation(params.city);
  if (!location) return {};
  const meta = generateCityHubMeta(location);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lienayperez.com';
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${siteUrl}/yachts/${location.slug}` },
    openGraph: { title: meta.title, description: meta.description },
  };
}

export default async function CityHubPage({ params }: PageProps) {
  const location = getLocation(params.city);
  if (!location) notFound();

  let listings: Awaited<ReturnType<typeof getAllListings>> = [];
  try {
    listings = await getAllListings();
  } catch {
    /* DB not ready */
  }

  const meta = generateCityHubMeta(location);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lienayperez.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: meta.h1,
    description: meta.description,
    url: `${siteUrl}/yachts/${location.slug}`,
    itemListElement: listings.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/listings/${l.slug}`,
      name: l.title,
    })),
  };

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
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/yachts" className="hover:text-gold-400 transition-colors">Yachts For Sale</Link>
            <ChevronRight size={14} />
            <span className="text-white">{location.name}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-12">
          <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">
            <MapPin size={10} className="inline mr-1" />{location.fullName}
          </span>
          <div className="section-divider mt-3 mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight">
            {meta.h1}
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">
            {location.marketContext.split('.')[0]}. Browse available inventory represented by Liena Q Perez,
            Miami-based luxury yacht sales specialist.
          </p>
          <a
            href={BROKER.phoneHref}
            className="inline-flex items-center gap-2 mt-6 font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Phone size={14} /> Call Liena — {BROKER.phone}
          </a>
        </section>

        {/* Listings */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
          {listings.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No current listings. Call Liena for off-market opportunities.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <YachtCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>

        {/* Variant links per listing */}
        {listings.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
            <h2 className="font-display text-2xl font-semibold text-white mb-2">
              Explore Listings in {location.name}
            </h2>
            <div className="section-divider mb-8" />
            <div className="flex flex-col gap-4">
              {listings.map((listing) => {
                const baseSlug = getBaseSlug(listing.slug);
                return (
                  <div key={listing.id} className="bg-[#0d1e33] border border-[#1e3050] rounded-lg p-5">
                    <p className="text-white font-medium mb-3">{listing.title}</p>
                    <div className="flex flex-wrap gap-2">
                      {MODIFIERS.map((mod) => (
                        <Link
                          key={mod.slug}
                          href={`/yachts/${location.slug}/${baseSlug}-${mod.slug}`}
                          className="font-label text-[10px] tracking-[2px] uppercase border border-[#1e3050] hover:border-gold-500/40 text-gray-500 hover:text-gold-400 px-3 py-1.5 rounded transition-colors"
                        >
                          {mod.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Location context */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
          <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-8">
            <h2 className="font-display text-2xl font-semibold text-white mb-4">
              The {location.name} Yacht Market
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-gray-300 leading-relaxed mb-4">{location.marketContext}</p>
            {location.marinas && (
              <p className="text-gray-400 text-sm leading-relaxed">
                <span className="text-gold-500 font-label tracking-wider uppercase text-[10px]">Key Marinas: </span>
                {location.marinas}.
              </p>
            )}
            {location.boatShow && (
              <p className="text-gray-400 text-sm leading-relaxed mt-2">
                <span className="text-gold-500 font-label tracking-wider uppercase text-[10px]">Boat Show: </span>
                {location.boatShow}.
              </p>
            )}
          </div>
        </section>

        {/* Browse other cities */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
          <h2 className="font-display text-xl font-semibold text-white mb-6">Browse Other Markets</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {LOCATIONS.filter((l) => l.slug !== location.slug).map((loc) => (
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
      </main>

      <Footer />
    </>
  );
}
