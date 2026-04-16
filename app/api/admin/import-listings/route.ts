/**
 * One-time listing import route.
 * POST /api/admin/import-listings?secret=YOUR_SEED_SECRET
 *
 * Adds the 3 new listings (Mangusta 80, Nassima N40 White, Nassima N40 Grey)
 * if they don't already exist. Safe to call multiple times — idempotent.
 *
 * Video URLs reference Cloudflare R2 bucket. Upload the 3 video files to R2
 * with the exact filenames specified in video_url before calling this endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const R2_BASE = ''; // videos served from /videos/ (committed to git)

const NEW_LISTINGS = [
  {
    slug: '1999-mangusta-80-miami',
    title: '1999 Mangusta 80',
    vessel_name: null,
    year: 1999,
    make: 'Mangusta',
    model: '80',
    length_ft: 80,
    price: 699000,
    location: 'Miami, Florida',
    description: `Refit: Engine, Upholstery, Interior, all hydraulic system — October 2025.

Stunning 1999 Mangusta 80 — a timeless Italian express cruiser combining sleek design with raw, surface-drive performance. With her elegant lines and striking profile, this Mangusta 80 turns heads in every port.

Elegant Accommodations: The interior features classic Italian styling with rich wood finishes and luxurious fabrics. Accommodating up to 8 guests across 4 staterooms — a sumptuous master suite, a VIP stateroom, and two twin cabins, all with en-suite facilities. The spacious salon offers ample seating, a dining area, and a full entertainment system.

Exceptional Performance: Powered by twin MTU engines producing 2,000 hp each via surface drives, this Mangusta 80 delivers a top speed of 40 knots and a cruising speed of 30 knots. The deep-V hull provides a smooth, stable ride even at high speed. Whether cruising the coast or making a run to the Bahamas, this yacht delivers an exhilarating experience.

Outdoor Lifestyle: The aft deck features a large sunpad, dining area, and easy water access via the swim platform. The foredeck offers additional sunpads for sunbathing. The flybridge is equipped with comfortable seating and a second helm station for elevated cruising perspective.

Well-maintained and ready to cruise — this Mangusta 80 has been meticulously serviced throughout her life. With the comprehensive October 2025 refit covering engines, upholstery, interior, and all hydraulic systems, she is fully equipped and ready for her next owner.`,
    specs: {
      'LOA': '80 ft',
      'Beam': '19 ft 5 in',
      'Max Draft': '5 ft 5 in',
      'Hull Material': 'Fiberglass',
      'Drive Type': 'Surface Drive',
      'Fuel Type': 'Diesel',
      'Engine 1': 'MTU — 2,000 hp',
      'Engine 2': 'MTU — 2,000 hp',
      'Engine Hours': '1,760 hrs each',
      'Top Speed': '40 kn',
      'Cruising Speed': '30 kn',
      'Fuel Capacity': '1,587 gal',
      'Water Capacity': '344 gal',
      'Guest Cabins': '4',
      'Crew Cabins': '1',
      'Guest Heads': '4',
      'Crew Heads': '1',
      'Class': 'Express Cruiser',
      'Condition': 'Used — Refit Oct 2025',
    },
    features: {
      'Electronics': [
        'Autopilot',
        'Radar',
        'GPS',
        'Chartplotter',
        'VHF Radio',
        'Depthsounder',
        'Compass',
        'Wi-Fi',
        'Computer',
        'Flat Screen TV',
        'Cockpit Speakers',
      ],
      'Interior': [
        'Air Conditioning throughout',
        'Heating',
        'Hot Water',
        'Fresh Water Maker',
        'Refrigerator',
        'Deep Freezer',
        'Dishwasher',
        'Microwave Oven',
        'Oven',
        'Marine Head',
        'Electric Bilge Pump',
        'Bow Thruster',
      ],
      'Deck & Exterior': [
        'Teak Cockpit',
        'Cockpit Cushions',
        'Hydraulic Gangway',
        'Swimming Ladder',
        'Gyroscopic Stabilizer',
        'Tender',
        'Wind Generator',
        'Bimini Top',
        'Hard Top',
      ],
      'Additional': [
        'Garage (tender storage)',
        'Underwater Lights',
        'Wine Cellar',
      ],
    },
    photos: [] as string[],
    video_url: '/videos/mangusta-80.mp4',
    featured: true,
    status: 'active' as const,
    seo_title: '1999 Mangusta 80 For Sale Miami | $699,000 | Liena Q Perez',
    seo_description:
      '1999 Mangusta 80 for sale in Miami, FL. 80ft Italian express cruiser, twin MTU 2,000hp surface drives, comprehensive refit Oct 2025. Asking $699,000. Call 786-838-9911.',
    seo_keywords:
      '1999 Mangusta 80 for sale, Mangusta 80 Miami, express cruiser Miami, Italian yacht Miami, used yacht for sale Florida',
  },
  {
    slug: '2026-nassima-n40-white-fort-lauderdale',
    title: '2026 Nassima Yacht N40 — White',
    vessel_name: null,
    year: 2026,
    make: 'Nassima Yacht',
    model: 'N40',
    length_ft: 40,
    price: 799000,
    location: 'Miami, Florida',
    description: `The 2026 Nassima Yacht N40 is a stunning example of Italian craftsmanship and modern luxury — a brand-new vessel available in white from stock in Miami.

At 40 feet, this top-of-the-line cruiser is designed to provide the ultimate in comfort and style, with a range of features that truly set it apart. Powered by twin 2023 Mercury Verado V10 outboards producing 400 hp each, the N40 delivers a top speed of 45 knots and a cruising speed of 30 knots — while keeping the motors sleekly hidden beneath the aft sun bed.

Exceptional Design: Every aspect of the N40 has been thoughtfully designed. The spacious cabin offers ample room for guests with memory foam mattresses, a 22" TV, dual fridge, electric stove, and full head with shower — perfect for overnight stays. The automatic handling sofas expand the cockpit configuration, and the automatic aft sun bed opens to access the engines seamlessly.

Performance: With twin 400 hp outboards, the N40 reaches 45 knots maximum and handles open-water conditions with ease on its deep-V hull. A range of 130 nautical miles and a 200-gallon combined fuel capacity make her capable of extended day trips and coastal cruising.

Italian Craftsmanship: Garmin touch home automation (EmpireBUS), Fusion sound system with 4 exterior speakers, 2 interior speakers, subwoofer and amplifier, teak cockpit and sidedecks, bow thruster, anchor winch — every detail considered. Available in Miami for immediate delivery.`,
    specs: {
      'LOA': '39 ft 7 in',
      'Beam': '12 ft 6 in',
      'Dry Weight': '17,000 lb',
      'Hull Material': 'Fiberglass',
      'Hull Shape': 'Deep Vee',
      'Fuel Type': 'Gas / Petrol',
      'Engine 1': '2023 Mercury Verado V10 — 400 hp',
      'Engine 2': '2023 Mercury Verado V10 — 400 hp',
      'Engine Type': 'Outboard',
      'Max Speed': '45 kn',
      'Cruising Speed': '30 kn',
      'Range': '130 nmi',
      'Fuel Capacity': '2 × 100 gal (200 gal total)',
      'Water Capacity': '60 gal',
      'Holding Tank': '20 gal',
      'Guest Cabins': '1',
      'Guest Heads': '2',
      'Seating Capacity': '12',
      'Class': 'Cruiser',
      'Condition': 'New — 2026',
    },
    features: {
      'Navigation & Helm': [
        'Double Garmin 12" touchscreens',
        'Garmin EmpireBUS home automation',
        'Secondary navigation GPS',
        'Compass',
        'VHF Radio',
        'Radar',
        'Depthsounder',
        '4 USB outlets',
        'Ergonomic driving seats',
      ],
      'Interior & Comfort': [
        'Air conditioning (6,000 BTU each unit)',
        'Dual refrigerator',
        'Electric stove with Corian chopping board',
        'Sink',
        'Memory foam mattresses',
        '22" TV',
        'Water heater (16 gal)',
        'Automatic WC',
        'Head with shower',
        'Shower system',
        'Electric panel in cabin',
      ],
      'Audio & Entertainment': [
        'Fusion sound system',
        '4 exterior cockpit speakers',
        '2 interior speakers',
        'Subwoofer',
        'Amplifier',
      ],
      'Deck & Exterior': [
        'Teak cockpit',
        'Teak sidedecks',
        'Cockpit cushions',
        'Cockpit shower (hot/cold)',
        'Cockpit table (automatic)',
        'Automatic handling sofas (enlarged cockpit config)',
        'Automatic aft sun bed (engine access)',
        'Swimming ladder',
        'Hard top with LED lighting',
        'Underwater lights',
        'Walk around',
      ],
      'Anchoring & Docking': [
        'Anchor in stainless steel',
        'Stainless steel chain',
        'Anchor rinsing system',
        'Anchor winch Lewmar 1,000W',
        'Wired windlass control',
        'Bow shower',
        'Bow thruster Lewmar',
        'Lewmar hatch',
      ],
      'Electrical & Mechanical': [
        'Generator',
        'Inverter',
        'Shore power inlet',
        'Battery charger',
        'Electric bilge pump',
        'Manual bilge pump',
        'Electric head',
        'Touch screen controls',
        'Launching trailer included',
      ],
    },
    photos: [] as string[],
    video_url: '/videos/nassima-n40-white.mp4',
    featured: true,
    status: 'active' as const,
    seo_title: '2026 Nassima N40 White — New Cruiser Miami | $799K',
    seo_description:
      'New 2026 Nassima N40 White for sale in Miami. 40ft Italian cruiser, twin Mercury Verado 400hp, 45 knots. $799,000. Contact Liena Q Perez.',
    seo_keywords:
      '2026 Nassima N40 for sale,Nassima N40 White Miami,new boat for sale Miami Florida,new Italian cruiser Miami,40ft cruiser Miami,yacht for sale Miami',
  },
  {
    slug: '2026-nassima-n40-grey-fort-lauderdale',
    title: '2026 Nassima Yacht N40 — Grey',
    vessel_name: null,
    year: 2026,
    make: 'Nassima Yacht',
    model: 'N40',
    length_ft: 40,
    price: 799000,
    location: 'Miami, Florida',
    description: `The 2026 Nassima Yacht N40 in grey is a stunning example of Italian craftsmanship and modern luxury — a brand-new vessel available from stock in Miami.

At 40 feet, this top-of-the-line cruiser is designed to provide the ultimate in comfort and style. Powered by twin 2023 Mercury Verado V10 outboards producing 400 hp each, the N40 delivers a top speed of 45 knots and a cruising speed of 30 knots — all while keeping the motors sleekly hidden beneath the aft sun bed for a clean, uninterrupted silhouette.

The grey colorway gives this N40 a bold, contemporary look that stands apart from the crowd. Every surface, every line, every finish has been considered — this is not a production boat built to a price point. It's an Italian-designed luxury vessel built to a standard.

Exceptional Design: The spacious cabin offers memory foam mattresses, 22" TV, dual fridge, electric stove, and a full head with shower — perfect for overnight stays. The automatic handling sofas expand the cockpit configuration, and the automatic aft sun bed opens seamlessly to access the engines.

Italian Craftsmanship: Garmin touch home automation (EmpireBUS), Fusion sound system with 4 exterior speakers, 2 interior speakers, subwoofer and amplifier, teak cockpit and sidedecks, bow thruster, anchor winch — every detail considered. Available in Miami for immediate delivery.`,
    specs: {
      'LOA': '39 ft 7 in',
      'Beam': '12 ft 6 in',
      'Dry Weight': '17,000 lb',
      'Hull Material': 'Fiberglass',
      'Hull Shape': 'Deep Vee',
      'Fuel Type': 'Gas / Petrol',
      'Engine 1': '2023 Mercury Verado V10 — 400 hp',
      'Engine 2': '2023 Mercury Verado V10 — 400 hp',
      'Engine Type': 'Outboard',
      'Max Speed': '45 kn',
      'Cruising Speed': '30 kn',
      'Range': '130 nmi',
      'Fuel Capacity': '2 × 100 gal (200 gal total)',
      'Water Capacity': '60 gal',
      'Holding Tank': '20 gal',
      'Guest Cabins': '1',
      'Guest Heads': '2',
      'Seating Capacity': '12',
      'Class': 'Cruiser',
      'Condition': 'New — 2026',
      'Hull Color': 'Grey',
    },
    features: {
      'Navigation & Helm': [
        'Double Garmin 12" touchscreens',
        'Garmin EmpireBUS home automation',
        'Secondary navigation GPS',
        'Compass',
        'VHF Radio',
        'Radar',
        'Depthsounder',
        '4 USB outlets',
        'Ergonomic driving seats',
      ],
      'Interior & Comfort': [
        'Air conditioning (6,000 BTU each unit)',
        'Dual refrigerator',
        'Electric stove with Corian chopping board',
        'Sink',
        'Memory foam mattresses',
        '22" TV',
        'Water heater (16 gal)',
        'Automatic WC',
        'Head with shower',
        'Shower system',
        'Electric panel in cabin',
      ],
      'Audio & Entertainment': [
        'Fusion sound system',
        '4 exterior cockpit speakers',
        '2 interior speakers',
        'Subwoofer',
        'Amplifier',
      ],
      'Deck & Exterior': [
        'Teak cockpit',
        'Teak sidedecks',
        'Cockpit cushions',
        'Cockpit shower (hot/cold)',
        'Cockpit table (automatic)',
        'Automatic handling sofas (enlarged cockpit config)',
        'Automatic aft sun bed (engine access)',
        'Swimming ladder',
        'Hard top with LED lighting',
        'Underwater lights',
        'Walk around',
      ],
      'Anchoring & Docking': [
        'Anchor in stainless steel',
        'Stainless steel chain',
        'Anchor rinsing system',
        'Anchor winch Lewmar 1,000W',
        'Wired windlass control',
        'Bow shower',
        'Bow thruster Lewmar',
        'Lewmar hatch',
      ],
      'Electrical & Mechanical': [
        'Generator',
        'Inverter',
        'Shore power inlet',
        'Battery charger',
        'Electric bilge pump',
        'Manual bilge pump',
        'Electric head',
        'Touch screen controls',
        'Launching trailer included',
      ],
    },
    photos: [] as string[],
    video_url: '/videos/nassima-n40-grey.mp4',
    featured: true,
    status: 'active' as const,
    seo_title: '2026 Nassima N40 Grey — New Cruiser Miami | $799K',
    seo_description:
      'New 2026 Nassima N40 Grey for sale in Miami. 40ft Italian cruiser, twin Mercury Verado 400hp, 45 knots. $799,000. Contact Liena Q Perez.',
    seo_keywords:
      '2026 Nassima N40 grey for sale,Nassima N40 Grey Miami,new boat for sale Miami Florida,new Italian cruiser Miami,40ft cruiser Miami,yacht for sale Miami',
  },
];

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get('secret');
    const expected = process.env.SEED_SECRET;

    if (!expected || secret !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const results: string[] = [];

    for (const listing of NEW_LISTINGS) {
      // Check if slug already exists
      const existing = await sql`SELECT id FROM listings WHERE slug = ${listing.slug} LIMIT 1` as { id: number }[];
      if (existing.length > 0) {
        results.push(`SKIP: ${listing.slug} already exists (id=${existing[0].id})`);
        continue;
      }

      const rows = await sql`
        INSERT INTO listings (
          slug, title, vessel_name, year, make, model, length_ft, price, location,
          description, specs, features, photos, video_url, featured, status,
          salesman_id, seo_title, seo_description, seo_keywords
        ) VALUES (
          ${listing.slug},
          ${listing.title},
          ${listing.vessel_name},
          ${listing.year},
          ${listing.make},
          ${listing.model},
          ${listing.length_ft},
          ${listing.price},
          ${listing.location},
          ${listing.description},
          ${JSON.stringify(listing.specs)}::jsonb,
          ${JSON.stringify(listing.features)}::jsonb,
          ${JSON.stringify(listing.photos)}::jsonb,
          ${listing.video_url},
          ${listing.featured},
          ${listing.status},
          ${null},
          ${listing.seo_title},
          ${listing.seo_description},
          ${listing.seo_keywords}
        )
        RETURNING id, slug
      ` as { id: number; slug: string }[];

      results.push(`CREATED: ${rows[0].slug} (id=${rows[0].id})`);
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error('[Import Listings]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
