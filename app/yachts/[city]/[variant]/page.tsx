import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactCTA from '@/components/ContactCTA';
import { getAllListings } from '@/lib/db';
import {
  LOCATIONS,
  MODIFIERS,
  BROKER,
  getBaseSlug,
  getLocation,
  getModifier,
} from '@/lib/seo-config';
import { generateVariantContent } from '@/lib/seo-content';
import { Phone, MapPin, ChevronRight, Calendar, Ruler, Anchor } from 'lucide-react';

export const revalidate = 3600;

interface PageProps {
  params: { city: string; variant: string };
}

// ── Resolve listing from variant slug ──────────────────────────────────────
async function resolveVariant(city: string, variant: string) {
  const location = getLocation(city);
  if (!location) return null;

  // Determine which modifier this variant ends with
  const modifier = MODIFIERS.find((m) => variant.endsWith(`-${m.slug}`));
  if (!modifier) return null;

  // Strip modifier suffix to get base slug
  const baseSlug = variant.slice(0, variant.length - modifier.slug.length - 1);

  let listings: Awaited<ReturnType<typeof getAllListings>> = [];
  try {
    listings = await getAllListings();
  } catch {
    return null;
  }

  const listing = listings.find((l) => getBaseSlug(l.slug) === baseSlug) ?? null;
  return listing ? { listing, location, modifier } : null;
}

// ── generateStaticParams — auto-generates all combinations ─────────────────
export async function generateStaticParams() {
  try {
    const listings = await getAllListings();
    const params: { city: string; variant: string }[] = [];
    for (const listing of listings) {
      const baseSlug = getBaseSlug(listing.slug);
      for (const loc of LOCATIONS) {
        for (const mod of MODIFIERS) {
          params.push({ city: loc.slug, variant: `${baseSlug}-${mod.slug}` });
        }
      }
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await resolveVariant(params.city, params.variant);
  if (!resolved) return {};

  const { listing, location, modifier } = resolved;
  const content = generateVariantContent(listing, location, modifier);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lienayperez.com';

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: [
      `${listing.year} ${listing.make} ${listing.model} ${modifier.label.toLowerCase()} ${location.name}`,
      `${listing.make} ${listing.model} ${location.name}`,
      `yacht for sale ${location.name}`,
      `${listing.make} ${location.name}`,
      `luxury yacht ${location.name} Florida`,
    ],
    alternates: {
      canonical: `${siteUrl}/yachts/${location.slug}/${params.variant}`,
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      images: listing.photos[0]
        ? [{ url: listing.photos[0], width: 1200, height: 630, alt: listing.title }]
        : [],
    },
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function VariantPage({ params }: PageProps) {
  const resolved = await resolveVariant(params.city, params.variant);
  if (!resolved) notFound();

  const { listing, location, modifier } = resolved;
  const content = generateVariantContent(listing, location, modifier);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lienayperez.com';

  // JSON-LD: Product + Offer + BreadcrumbList + LocalBusiness
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${listing.year} ${listing.make} ${listing.model}`,
      description: content.metaDescription,
      image: listing.photos.slice(0, 5),
      brand: { '@type': 'Brand', name: listing.make },
      offers: {
        '@type': 'Offer',
        price: listing.price,
        priceCurrency: 'USD',
        availability:
          listing.status === 'active'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/SoldOut',
        seller: {
          '@type': 'Person',
          name: BROKER.name,
          telephone: BROKER.phone,
          email: BROKER.email,
          url: siteUrl,
        },
        areaServed: location.fullName,
      },
      additionalProperty: Object.entries(listing.specs).map(([name, value]) => ({
        '@type': 'PropertyValue',
        name,
        value,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Yachts For Sale', item: `${siteUrl}/yachts` },
        {
          '@type': 'ListItem',
          position: 3,
          name: `Yachts in ${location.name}`,
          item: `${siteUrl}/yachts/${location.slug}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: content.h1,
          item: `${siteUrl}/yachts/${location.slug}/${params.variant}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Liena Q Perez — Luxury Yacht Sales',
      telephone: BROKER.phone,
      email: BROKER.email,
      url: siteUrl,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Miami',
        addressRegion: 'FL',
        addressCountry: 'US',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 25.7617, longitude: -80.1918 },
      areaServed: [
        'Miami, FL', 'Fort Lauderdale, FL', 'West Palm Beach, FL',
        'Naples, FL', 'Boca Raton, FL', 'Palm Beach, FL', 'Key West, FL', 'Florida',
      ],
    },
  ];

  const heroPhoto = listing.photos[0] ?? null;

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
            <Link href={`/yachts/${location.slug}`} className="hover:text-gold-400 transition-colors">
              {location.name}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white truncate max-w-[200px]">{listing.make} {listing.model}</span>
          </nav>
        </div>

        {/* Above-fold hero */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Hero image + headline */}
            <div className="lg:col-span-2">
              {heroPhoto && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 border border-[#1e3050]">
                  <Image
                    src={heroPhoto}
                    alt={`${listing.year} ${listing.make} ${listing.model} for sale ${location.name}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1829]/60 to-transparent" />
                  {/* Price overlay */}
                  <div className="absolute bottom-4 left-4">
                    <div className="font-display text-3xl font-semibold text-white drop-shadow-lg">
                      {formatPrice(listing.price)}
                    </div>
                    <p className="text-gray-300 text-xs font-label tracking-wider">USD Asking Price</p>
                  </div>
                </div>
              )}

              <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">
                <MapPin size={10} className="inline mr-1" />{location.fullName}
              </span>
              <div className="section-divider mt-3 mb-4" />
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-white leading-tight">
                {content.h1}
              </h1>
              {listing.vessel_name && (
                <p className="font-display italic text-gold-400 text-xl mt-2">
                  &ldquo;{listing.vessel_name}&rdquo;
                </p>
              )}

              {/* Quick spec chips */}
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { icon: Calendar, val: listing.year },
                  { icon: Ruler, val: `${listing.length_ft} ft` },
                  { icon: Anchor, val: listing.make },
                  { icon: MapPin, val: listing.location },
                ].map(({ icon: Icon, val }) => (
                  <div
                    key={String(val)}
                    className="flex items-center gap-2 bg-[#0d1e33] border border-[#1e3050] rounded-lg px-4 py-2"
                  >
                    <Icon size={13} className="text-gold-500/60" />
                    <span className="text-white text-sm font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* Inline call CTA */}
              <a
                href={BROKER.phoneHref}
                className="inline-flex items-center gap-2 mt-6 font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Phone size={14} /> Call Liena — {BROKER.phone}
              </a>
            </div>

            {/* Right: Sticky contact */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ContactCTA
                  listingId={listing.id}
                  listingTitle={listing.title}
                  listingSlug={listing.slug}
                  heading="Inquire About This Vessel"
                  subtext={`Contact Liena Q Perez directly for showings in ${location.name}.`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-12">

              {/* Intro */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-white mb-4">Overview</h2>
                <div className="section-divider mb-6" />
                <p className="text-gray-300 leading-relaxed">{content.intro}</p>
              </div>

              {/* Vessel details */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-white mb-4">
                  About the {listing.make} {listing.model}
                </h2>
                <div className="section-divider mb-6" />
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {content.vesselSection}
                </div>
              </div>

              {/* Specs table */}
              {Object.keys(listing.specs).length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-white mb-4">Full Specifications</h2>
                  <div className="section-divider mb-6" />
                  <div className="bg-[#0d1e33] border border-[#1e3050] rounded-lg overflow-hidden">
                    {Object.entries(listing.specs).map(([key, val], i) => (
                      <div
                        key={key}
                        className={`flex justify-between items-center px-5 py-3.5 text-sm border-b border-[#1e3050] last:border-0 ${
                          i % 2 === 0 ? 'bg-[#0d1e33]' : 'bg-[#091629]'
                        }`}
                      >
                        <span className="text-gray-400 font-label text-[11px] tracking-wider uppercase">{key}</span>
                        <span className="text-white font-medium text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {Object.keys(listing.features).length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-white mb-4">Features & Equipment</h2>
                  <div className="section-divider mb-6" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(listing.features).map(([section, items]) => (
                      <div key={section} className="bg-[#0d1e33] border border-[#1e3050] rounded-lg p-5">
                        <h3 className="font-label text-[10px] tracking-[3px] uppercase text-gold-500 mb-4">{section}</h3>
                        <ul className="flex flex-col gap-2">
                          {(items as string[]).map((item) => (
                            <li key={item} className="flex items-start gap-2 text-gray-300 text-sm">
                              <span className="text-gold-500/60 mt-1 shrink-0">·</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modifier section */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-white mb-4">
                  {modifier.slug === 'price' ? 'Pricing & Market Context' :
                   modifier.slug === 'pre-owned' ? 'Why Buy Pre-Owned?' :
                   modifier.slug === 'luxury' ? 'The Luxury Standard' :
                   modifier.slug === 'buy' ? 'The Purchase Process' :
                   'Availability & Showing'}
                </h2>
                <div className="section-divider mb-6" />
                <p className="text-gray-300 leading-relaxed">{content.modifierSection}</p>
              </div>

              {/* Location context */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-white mb-4">
                  The {location.name} Market
                </h2>
                <div className="section-divider mb-6" />
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{content.locationSection}</p>
              </div>

              {/* Broker section */}
              <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-6">
                <h2 className="font-display text-xl font-semibold text-white mb-4">Your Broker</h2>
                <div className="section-divider mb-6" />
                <p className="text-gray-300 leading-relaxed whitespace-pre-line mb-6">{content.brokerSection}</p>
                <p className="text-gray-300 leading-relaxed italic text-sm">{content.closingCTA}</p>
                <a
                  href={BROKER.phoneHref}
                  className="inline-flex items-center gap-2 mt-6 font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Phone size={14} /> Call Liena — {BROKER.phone}
                </a>
              </div>
            </div>

            {/* Right sidebar (non-sticky on mobile, content below) */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Price card */}
              <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-6 text-center">
                <p className="text-gray-500 font-label text-[10px] tracking-[2px] uppercase mb-2">Asking Price</p>
                <div className="font-display text-3xl font-semibold text-white">
                  {formatPrice(listing.price)}
                </div>
                <p className="text-gray-600 text-xs mt-2">USD · Subject to prior sale</p>
              </div>

              {/* View full listing */}
              <Link
                href={`/listings/${listing.slug}`}
                className="flex items-center justify-center gap-2 w-full border border-gold-500/40 hover:border-gold-400 text-gold-400 hover:text-gold-300 py-3 rounded-xl font-label text-xs tracking-[2px] uppercase transition-colors"
              >
                View Full Listing
              </Link>

              {/* More in this city */}
              <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-5">
                <h3 className="font-label text-[10px] tracking-[3px] uppercase text-gold-500 mb-4">
                  More in {location.name}
                </h3>
                <div className="flex flex-col gap-2">
                  {MODIFIERS.filter((m) => m.slug !== modifier.slug).map((mod) => {
                    const baseSlug = getBaseSlug(listing.slug);
                    return (
                      <Link
                        key={mod.slug}
                        href={`/yachts/${location.slug}/${baseSlug}-${mod.slug}`}
                        className="text-gray-400 hover:text-gold-400 text-sm transition-colors flex items-center gap-2"
                      >
                        <ChevronRight size={13} className="text-gold-500/40" />
                        {listing.make} {listing.model} — {mod.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Other cities */}
              <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-5">
                <h3 className="font-label text-[10px] tracking-[3px] uppercase text-gold-500 mb-4">
                  Same Vessel, Other Markets
                </h3>
                <div className="flex flex-col gap-2">
                  {LOCATIONS.filter((l) => l.slug !== location.slug).slice(0, 5).map((loc) => {
                    const baseSlug = getBaseSlug(listing.slug);
                    return (
                      <Link
                        key={loc.slug}
                        href={`/yachts/${loc.slug}/${baseSlug}-${modifier.slug}`}
                        className="text-gray-400 hover:text-gold-400 text-sm transition-colors flex items-center gap-2"
                      >
                        <MapPin size={12} className="text-gold-500/40 shrink-0" />
                        {loc.name}
                      </Link>
                    );
                  })}
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
