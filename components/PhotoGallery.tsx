'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface Props {
  photos: string[];
  title: string;
}

export default function PhotoGallery({ photos, title }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!photos.length) return null;

  const prev = () => setActive((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setActive((i) => (i + 1) % photos.length);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') setLightbox(false);
  };

  return (
    <>
      {/* Main gallery */}
      <div className="flex flex-col gap-3">
        {/* Hero photo */}
        <div
          className="relative w-full rounded-lg overflow-hidden cursor-zoom-in bg-navy-800 group"
          style={{ paddingBottom: '56.25%' }}
          onClick={() => setLightbox(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setLightbox(true)}
          aria-label="Open photo gallery"
        >
          <Image
            src={photos[active]}
            alt={`${title} — photo ${active + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-cover transition-transform duration-700 group-hover:scale-102"
            priority={active === 0}
          />
          {/* Zoom hint */}
          <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={16} />
          </div>
          {/* Nav arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-gold-500 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-gold-500 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
          {/* Counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-label tracking-wider px-3 py-1 rounded-full">
            {active + 1} / {photos.length}
          </div>
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {photos.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative flex-shrink-0 w-20 h-14 rounded overflow-hidden transition-all ${
                  i === active
                    ? 'ring-2 ring-gold-500 opacity-100'
                    : 'opacity-50 hover:opacity-80'
                }`}
                aria-label={`View photo ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${title} thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
          onKeyDown={handleKey}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-gold-500 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-gold-500 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-5xl mx-auto px-16"
            style={{ paddingBottom: 'min(56.25%, 80vh)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[active]}
              alt={`${title} — photo ${active + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-label tracking-wider">
            {active + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
