import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PhotoGallery from '@/components/PhotoGallery';
import ListingVideoPlayer from '@/components/ListingVideoPlayer';
import LeadForm from '@/components/LeadForm';
import { getListingBySlug, getAllListings } from '@/lib/db';
import { MapPin, Ruler, Fuel, Calendar, Phone, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const listings = await getAllListings();
    return listings.map((l) => ({ slug: l.slug }));
  } catch {
    // DB not available at build time — pages will be rendered on demand
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const listing = await getListingBySlug(params.slug);
  if (!listing) return {};

  const title = listing.seo_title || `${listing.title} For Sale | Liena Q Perez`;
  const description =
    listing.seo_description ||
    `${listing.title} for sale in ${listing.location}. ${listing.length_ft}ft ${listing.make} ${listing.model}. Contact Liena Q Perez.`;
  const keywords = listing.seo_keywords || `${listing.year} ${listing.make} ${listing.model} for sale, yacht Miami`;

  return {
    title,
    description,
    keywords: keywords.split(',').map((k) => k.trim()),
    openGraph: {
      title,
      description,
      type: 'article',
      images: listing.photos[0] ? [{ url: listing.photos[0], width: 1200, height: 630, alt: listing.title }] : [],
    },
    twitter: { card: 'summary_large_image', title, description, images: listing.photos[0] ? [listing.photos[0]] : [] },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lienayperez.com'}/listings/${listing.slug}`,
    },
  };
}

export const dynamic = 'force-dynamic'; // always fetch fresh — ensures photos/location are never stale

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

export default async function ListingPage({ params }: PageProps) {
  // getListingBySlug falls back to static data automatically — never throws
  const listing = await getListingBySlug(params.slug);
  if (!listing) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lienayperez.com';

  // JSON-LD structured data
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: listing.title,
      description: listing.description,
      image: listing.photos,
      brand: { '@type': 'Brand', name: listing.make },
      offers: {
        '@type': 'Offer',
        price: listing.price,
        priceCurrency: 'USD',
        availability: listing.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
        seller: {
          '@type': 'Person',
          name: 'Liena Q Perez',
          telephone: '+17868389911',
          email: 'liena@italiaboats.com',
          url: siteUrl,
        },
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
        { '@type': 'ListItem', position: 3, name: listing.title, item: `${siteUrl}/listings/${listing.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Liena Q Perez — Luxury Yacht Sales',
      telephone: '+17868389911',
      email: 'liena@italiaboats.com',
      url: siteUrl,
      address: { '@type': 'PostalAddress', addressLocality: 'Miami', addressRegion: 'FL', addressCountry: 'US' },
    },
  ];

  return (
    <>
      <Header />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="pt-20 bg-[#0b1829] min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
          <Link
            href="/#listings"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gold-400 text-sm transition-colors"
          >
            <ChevronLeft size={16} /> Back to Listings
          </Link>
        </div>

        {/* ── Cinematic Video Player ──────────────────────────── */}
        {listing.video_url && (
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-8">
            <ListingVideoPlayer src={listing.video_url} title={listing.title} />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ── Left: Photos + Details ──────────────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              {/* Gallery */}
              <PhotoGallery photos={listing.photos} title={listing.title} />

              {/* Title + price */}
              <div>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    {listing.status === 'sold' && (
                      <span className="inline-block font-label text-[10px] tracking-[2px] uppercase bg-red-600 text-white px-3 py-1 rounded mb-3">
                        Sold
                      </span>
                    )}
                    <h1 className="font-display text-3xl md:text-4xl font-semibold text-white">
                      {listing.seo_title
                        ? listing.seo_title.split('|')[0].trim()
                        : listing.title}
                    </h1>
                    {listing.vessel_name && (
                      <p className="font-display italic text-gold-400 text-xl mt-1">"{listing.vessel_name}"</p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-gray-400 text-sm">
                      <MapPin size={14} className="text-gold-500/60" />
                      {listing.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl md:text-4xl font-semibold text-white">
                      {formatPrice(listing.price)}
                    </div>
                    <p className="text-gray-500 text-xs mt-1 font-label tracking-wider">USD · Price may change</p>
                  </div>
                </div>

                {/* Quick specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  {[
                    { icon: Calendar, label: 'Year', val: listing.year },
                    { icon: Ruler, label: 'Length', val: `${listing.length_ft} ft` },
                    { icon: Fuel, label: 'Fuel', val: listing.specs['Fuel Type'] || 'Diesel' },
                    { icon: MapPin, label: 'Make', val: listing.make },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="bg-[#0d1e33] border border-[#1e3050] rounded-lg p-4 text-center">
                      <Icon size={16} className="text-gold-500/60 mx-auto mb-2" />
                      <div className="font-label text-[9px] tracking-[2px] uppercase text-gray-500 mb-1">{label}</div>
                      <div className="text-white font-semibold text-sm">{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-white mb-4">About This Vessel</h2>
                <div className="section-divider mb-6" />
                <div className="text-gray-300 leading-relaxed whitespace-pre-line text-[15px]">
                  {listing.description}
                </div>
              </div>

              {/* Specs table */}
              {Object.keys(listing.specs).length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-white mb-4">Specifications</h2>
                  <div className="section-divider mb-6" />
                  <div className="bg-[#0d1e33] border border-[#1e3050] rounded-lg overflow-hidden">
                    {Object.entries(listing.specs).map(([key, val], i) => (
                      <div
                        key={key}
                        className={`flex justify-between items-center px-5 py-3.5 text-sm ${
                          i % 2 === 0 ? 'bg-[#0d1e33]' : 'bg-[#091629]'
                        } border-b border-[#1e3050] last:border-0`}
                      >
                        <span className="text-gray-400 font-label text-[11px] tracking-wider uppercase">{key}</span>
                        <span className="text-white font-medium text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features sections */}
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

            </div>

            {/* ── Right: Sticky Contact ─────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-6">
                {/* Contact card */}
                <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-6">
                  <h2 className="font-display text-xl font-semibold text-white mb-1">
                    Speak with Liena
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Liena will respond within 24 hours to arrange a private showing.
                  </p>
                  <LeadForm
                    listingId={listing.id}
                    listingTitle={listing.title}
                    listingSlug={listing.slug}
                    compact
                  />
                </div>

                {/* Direct call */}
                <a
                  href="tel:+17868389911"
                  className="flex items-center justify-center gap-3 bg-gold-500 hover:bg-gold-400 text-navy-950 py-4 rounded-xl font-semibold font-label text-sm tracking-wider transition-colors shadow-gold hover:shadow-gold-lg"
                >
                  <Phone size={16} />
                  Call Liena Directly
                </a>

                {/* Disclaimer */}
                <p className="text-gray-600 text-xs leading-relaxed">
                  This listing is offered in good faith. Buyers should conduct independent surveys. Subject to prior sale
                  or withdrawal without notice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
