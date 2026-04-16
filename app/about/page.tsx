import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import { Phone, Mail, MapPin, Award, Shield, Users, Star, Anchor } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Liena Q Perez | Miami Luxury Yacht Broker',
  description:
    'Meet Liena Q Perez — Miami\'s trusted luxury yacht sales specialist with 15 years of experience in South Florida\'s marine market. Flybridge yachts, motor yachts, and superyachts.',
  alternates: {
    canonical: 'https://www.lienayperez.com/about',
  },
  openGraph: {
    title: 'About Liena Q Perez | Miami Luxury Yacht Broker',
    description: 'Miami\'s trusted luxury yacht sales specialist. 15 years of experience. Every listing personally inspected and curated.',
    images: [{ url: '/images/liena-headshot.jpeg', width: 940, height: 1253, alt: 'Liena Q Perez — Miami Yacht Broker' }],
  },
};

const stats = [
  { value: '15+', label: 'Years in the Industry' },
  { value: '$50M+', label: 'In Sales Closed' },
  { value: '100%', label: 'Client Focused' },
  { value: 'Miami', label: 'Based & Licensed' },
];

const pillars = [
  {
    icon: Award,
    title: 'Deep Market Expertise',
    body:
      'Fifteen years in South Florida\'s luxury marine market means Liena knows exactly where value lives — and where it doesn\'t. Every listing is assessed with an experienced eye before it ever reaches a buyer.',
  },
  {
    icon: Shield,
    title: 'Every Vessel Personally Vetted',
    body:
      'No listing goes live without Liena personally stepping aboard. Survey coordination, sea trials, mechanical history — every detail is scrutinised so her buyers never face surprises at closing.',
  },
  {
    icon: Users,
    title: 'White-Glove from Inquiry to Keys',
    body:
      'From the first conversation to the moment the dock lines are cast off, Liena manages the entire transaction. Financing introductions, documentation, registration, captain referrals — it\'s all handled.',
  },
  {
    icon: Anchor,
    title: 'Miami & South Florida Specialist',
    body:
      'Operating from Miami and serving Fort Lauderdale, Miami Beach, the Florida Keys, the Bahamas, and the wider Caribbean, Liena\'s local network runs deep — giving buyers access to inventory before it ever hits the open market.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      {/* JSON-LD — Person schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Liena Q Perez',
            jobTitle: 'Luxury Yacht Broker',
            description:
              'Miami luxury yacht sales specialist with 15+ years of experience in South Florida\'s marine market.',
            telephone: '+17868389911',
            email: 'liena@italiaboats.com',
            url: 'https://www.lienayperez.com/about',
            image: 'https://www.lienayperez.com/images/liena-headshot.jpeg',
            worksFor: {
              '@type': 'Organization',
              name: 'Italia Boats',
              url: 'https://www.lienayperez.com',
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Miami',
              addressRegion: 'FL',
              addressCountry: 'US',
            },
            areaServed: [
              'Miami, Florida',
              'Miami Beach, Florida',
              'Fort Lauderdale, Florida',
              'South Florida',
              'Caribbean',
            ],
          }),
        }}
      />

      <main className="bg-[#0b1829] min-h-screen pt-20">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gold-500/4 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-900/10 blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Photo */}
              <div className="flex justify-center lg:justify-start order-1 lg:order-none">
                <div className="relative">
                  {/* Gold frame accent */}
                  <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-br from-gold-500/40 via-transparent to-gold-500/20" />
                  <div className="relative w-[340px] sm:w-[400px] rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/liena-headshot.jpeg"
                      alt="Liena Q Perez — Miami Luxury Yacht Broker"
                      className="w-full h-auto object-cover object-top"
                      loading="eager"
                    />
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -right-4 bg-[#0d1e33] border border-[#1e3050] rounded-xl px-5 py-3 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-gold-500 fill-gold-500" />
                      <span className="font-display text-white text-sm font-semibold">15+ Years</span>
                    </div>
                    <p className="font-label text-[9px] tracking-[2px] uppercase text-gray-500 mt-0.5">South Florida Expert</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">About</span>
                <div className="section-divider mt-3" />
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white mt-4 leading-tight">
                  Liena Q<br />
                  <span className="italic text-gold-400">Perez</span>
                </h1>
                <p className="font-label text-xs tracking-[3px] uppercase text-gray-500 mt-3">
                  Luxury Yacht Broker · Miami, Florida
                </p>

                <div className="mt-8 space-y-5 text-gray-300 text-[15px] leading-relaxed">
                  <p>
                    Liena Q Perez has spent fifteen years doing one thing exceptionally well — connecting discerning
                    buyers with the right yacht. Not the closest yacht. Not the easiest yacht to close. The
                    <em className="text-white not-italic font-medium"> right</em> one.
                  </p>
                  <p>
                    Based in Miami and operating across South Florida, Fort Lauderdale, the Keys, and the Caribbean,
                    Liena has built her reputation on an uncompromising personal standard. Every listing is personally
                    inspected before it reaches any buyer. Every showing is private and unhurried. Every transaction is
                    handled with the same care regardless of the price point.
                  </p>
                  <p>
                    Her specialty is the segment where design, performance, and lifestyle converge — Italian flybridge
                    yachts, bluewater motor yachts, and express cruisers for buyers who know exactly what they want and
                    expect an advisor who does too.
                  </p>
                  <p>
                    If you&apos;re searching for a yacht or considering selling, Liena&apos;s process is simple: one
                    conversation, no pressure, and complete honesty. The rest follows naturally.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                  <a
                    href="tel:+17868389911"
                    className="inline-flex items-center justify-center gap-2.5 font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-7 py-3.5 rounded transition-colors shadow-gold"
                  >
                    <Phone size={13} /> 786-838-9911
                  </a>
                  <a
                    href="mailto:liena@italiaboats.com"
                    className="inline-flex items-center justify-center gap-2.5 font-label text-xs tracking-[2px] uppercase text-gray-300 border border-[#1e3050] hover:border-gold-500/40 hover:text-gold-400 px-7 py-3.5 rounded transition-colors"
                  >
                    <Mail size={13} /> liena@italiaboats.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar ─────────────────────────────────────────── */}
        <section className="border-y border-[#1e3050] bg-[#081422]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="font-display text-3xl md:text-4xl font-semibold gold-text">{value}</div>
                  <div className="font-label text-[9px] tracking-[2px] uppercase text-gray-500 mt-2">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Four pillars ──────────────────────────────────────── */}
        <section className="py-24 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">The Standard</span>
              <div className="section-divider mt-3 mx-auto" />
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mt-4">
                How Liena Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-8 hover:border-gold-500/30 transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-5">
                    <Icon size={18} className="text-gold-500" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-3">{title}</h3>
                  <p className="text-gray-400 text-[14px] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Market section ───────────────────────────────────── */}
        <section className="py-16 px-6 lg:px-10 bg-[#081422]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">Coverage</span>
                <div className="section-divider mt-3" />
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mt-4 leading-snug">
                  South Florida&apos;s<br />
                  <span className="italic text-gold-400">Premier Market</span>
                </h2>
                <p className="text-gray-400 mt-5 leading-relaxed text-[15px]">
                  Miami and Fort Lauderdale are two of the world&apos;s most active luxury yacht markets. Together they
                  represent a unique convergence of international buyers, world-class marinas, and year-round boating
                  weather — and Liena is at the centre of it.
                </p>
                <p className="text-gray-400 mt-4 leading-relaxed text-[15px]">
                  Her network spans brokers, captains, surveyors, and private sellers across the full South Florida
                  coastline, giving buyers access to vessels that never reach the public market.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { location: 'Miami', note: 'Primary base' },
                  { location: 'Fort Lauderdale', note: 'Active inventory' },
                  { location: 'Miami Beach', note: 'Private sales' },
                  { location: 'Florida Keys', note: 'Charter & buyer placements' },
                  { location: 'The Bahamas', note: 'Regional reach' },
                  { location: 'Caribbean', note: 'International clients' },
                ].map(({ location, note }) => (
                  <div
                    key={location}
                    className="bg-[#0d1e33] border border-[#1e3050] rounded-lg px-4 py-4 hover:border-gold-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={11} className="text-gold-500/60 shrink-0" />
                      <span className="text-white text-sm font-medium">{location}</span>
                    </div>
                    <p className="text-gray-600 text-xs font-label tracking-wide">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── View listings CTA ─────────────────────────────────── */}
        <section className="py-16 px-6 lg:px-10 border-y border-[#1e3050]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-semibold text-white">
              Ready to Find Your <span className="italic text-gold-400">Next Yacht?</span>
            </h2>
            <p className="text-gray-400 mt-4 mb-8">
              Browse the current inventory — every vessel personally selected and inspected by Liena.
            </p>
            <Link
              href="/#listings"
              className="inline-flex items-center gap-2 font-label text-xs tracking-[3px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-8 py-4 rounded transition-colors shadow-gold"
            >
              View Current Listings
            </Link>
          </div>
        </section>

        {/* ── Contact form ──────────────────────────────────────── */}
        <section id="contact" className="py-24 px-6 lg:px-10 bg-[#081422]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-label text-[10px] tracking-[4px] uppercase text-gold-500">Get In Touch</span>
              <div className="section-divider mt-3 mx-auto" />
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mt-4">
                Speak with <span className="italic text-gold-400">Liena</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-lg mx-auto">
                Fill out the form and Liena will be in touch within 24 hours to discuss what you&apos;re looking for.
              </p>
            </div>

            <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-8">
              <LeadForm />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <span className="text-gray-600 text-sm">Prefer to call?</span>
              <a href="tel:+17868389911" className="flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors">
                <Phone size={15} /> 786-838-9911
              </a>
              <span className="text-gray-600 hidden sm:block">·</span>
              <a href="mailto:liena@italiaboats.com" className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors">
                <Mail size={15} /> liena@italiaboats.com
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
