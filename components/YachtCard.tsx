'use client';

import Link from 'next/link';
import { MapPin, Ruler, Fuel, Star, Play } from 'lucide-react';
import type { Listing } from '@/lib/db';

interface Props {
  listing: Listing;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

export default function YachtCard({ listing }: Props) {
  return (
    <article className="bg-[#0d1e33] border border-[#1e3050] rounded-lg overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500 hover:border-gold-500/40 hover:-translate-y-1 flex flex-col">
      {/* Video / Media */}
      <div className="relative h-60 md:h-72 overflow-hidden bg-navy-700 group">
        {listing.video_url ? (
          <video
            src={listing.video_url}
            // Show first photo as poster frame while video buffers;
            // falls back gracefully to the dark gradient if no photos
            poster={listing.photos[0] || undefined}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : listing.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.photos[0]}
            alt={listing.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center">
            <Play size={40} className="text-gold-500/30" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1e33] via-transparent to-transparent opacity-80" />

        {/* Badges */}
        {listing.featured && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-gold-500 text-navy-950 px-3 py-1 rounded text-[10px] font-semibold font-label tracking-wider uppercase">
            <Star size={10} /> Featured
          </div>
        )}
        {listing.status === 'sold' && (
          <div className="absolute top-4 right-4 bg-red-600/90 text-white px-3 py-1 rounded text-[10px] font-label tracking-wider uppercase">
            Sold
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <span className="font-display text-2xl font-semibold text-white drop-shadow-lg">
            {formatPrice(listing.price)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-display text-xl font-semibold text-white mb-1 line-clamp-2">
          {listing.title}
        </h2>
        {listing.vessel_name && (
          <p className="font-display italic text-gold-500/70 text-sm mb-3">"{listing.vessel_name}"</p>
        )}

        {/* Specs pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1.5 text-gray-400 text-xs bg-navy-500/30 px-2.5 py-1 rounded">
            <Ruler size={11} className="text-gold-500/60" />
            {listing.length_ft} ft
          </span>
          <span className="flex items-center gap-1.5 text-gray-400 text-xs bg-navy-500/30 px-2.5 py-1 rounded">
            <Fuel size={11} className="text-gold-500/60" />
            {listing.specs['Fuel Type'] || 'Diesel'}
          </span>
          <span className="flex items-center gap-1.5 text-gray-400 text-xs bg-navy-500/30 px-2.5 py-1 rounded">
            {listing.year}
          </span>
          <span className="text-gray-400 text-xs bg-navy-500/30 px-2.5 py-1 rounded">
            {listing.specs['Hull Class'] || listing.make}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-5">
          <MapPin size={12} className="text-gold-500/50" />
          {listing.location}
        </div>

        {/* View Details button — always visible */}
        <div className="mt-auto pt-4 border-t border-[#1e3050]">
          <Link
            href={`/listings/${listing.slug}`}
            className="block w-full text-center font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-5 py-3 rounded transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
