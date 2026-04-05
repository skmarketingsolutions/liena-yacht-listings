'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface VideoHeroProps {
  videoUrl?: string;
}

export default function VideoHero({ videoUrl }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background: video or gradient */}
      {videoUrl ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setLoaded(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#020810] via-[#0b1829] to-[#091222]">
          {/* Animated particles / orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-900/20 blur-3xl animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-navy-800/30 blur-3xl" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(#c9a84c22 1px, transparent 1px), linear-gradient(90deg, #c9a84c22 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00000055] via-[#00000033] to-[#0b182999]" />

      {/* Content */}
      <div
        className={`relative z-10 text-center px-6 max-w-5xl mx-auto transition-all duration-1000 pt-28 pb-24 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold leading-tight text-white mb-6">
          Luxury Yachts,{' '}
          <span className="italic text-gold-400">Personally</span>
          <br />
          Curated
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Miami&apos;s luxury yacht sales specialist. I personally curate every listing including flybridge yachts,
          motor yachts, and superyachts for the most discerning buyers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/#listings"
            className="inline-flex items-center justify-center gap-2 font-label text-xs tracking-[3px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 px-8 py-4 rounded transition-all font-semibold shadow-gold hover:shadow-gold-lg"
          >
            View Listings
          </a>
          <a
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 font-label text-xs tracking-[3px] uppercase border border-gold-500/50 hover:border-gold-400 text-gold-400 hover:text-gold-300 px-8 py-4 rounded transition-all"
          >
            {videoUrl ? <Play size={13} /> : null}
            Speak with Liena
          </a>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-16 pt-10 border-t border-white/10">
          {[
            { num: 'Miami', label: 'Based & Licensed' },
            { num: '10+', label: 'Years Experience' },
            { num: '100%', label: 'Client Focused' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-semibold gold-text">{num}</div>
              <div className="font-label text-[9px] tracking-[2px] uppercase text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
