'use client';

import { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface ListingVideoPlayerProps {
  src: string;
  title: string;
}

export default function ListingVideoPlayer({ src, title }: ListingVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function openFullscreen() {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-black group" style={{ aspectRatio: '16/9' }}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="metadata"
        onEnded={() => setPlaying(false)}
        title={title}
      />

      {/* Overlay controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Center play button */}
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Play video"
        >
          <div className="w-20 h-20 rounded-full bg-gold-500/90 hover:bg-gold-400 flex items-center justify-center transition-all duration-200 shadow-[0_0_40px_rgba(201,168,76,0.4)] hover:scale-105">
            <Play size={32} className="text-navy-950 ml-1" fill="currentColor" />
          </div>
        </button>
      )}

      {/* Bottom controls bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center text-white hover:text-gold-400 transition-colors"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>

        <button
          onClick={toggleMute}
          className="w-8 h-8 flex items-center justify-center text-white hover:text-gold-400 transition-colors"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <div className="flex-1" />

        <button
          onClick={openFullscreen}
          className="w-8 h-8 flex items-center justify-center text-white hover:text-gold-400 transition-colors"
          aria-label="Fullscreen"
        >
          <Maximize size={16} />
        </button>
      </div>
    </div>
  );
}
