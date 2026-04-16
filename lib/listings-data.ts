/**
 * Static fallback listing data.
 * These listings are ALWAYS shown — even when the database is unavailable or empty.
 * When Neon Postgres is configured and populated, the DB takes precedence.
 * Adding a new listing here is sufficient to make it appear on the site.
 */

import type { Listing } from './db';

const now = new Date().toISOString();

function stub(
  id: number,
  slug: string,
  title: string,
  year: number,
  make: string,
  model: string,
  length_ft: number,
  price: number,
  location: string,
  description: string,
  specs: Record<string, string>,
  features: Record<string, string[]>,
  video_url: string,
  seo_title: string,
  seo_description: string,
  seo_keywords: string,
): Listing {
  return {
    id,
    slug,
    title,
    vessel_name: null,
    year,
    make,
    model,
    length_ft,
    price,
    location,
    description,
    specs,
    features,
    photos: [],
    video_url,
    featured: true,
    status: 'active',
    salesman_id: null,
    seo_title,
    seo_description,
    seo_keywords,
    created_at: now,
    updated_at: now,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. 2022 Azimut Fly 50
// ─────────────────────────────────────────────────────────────────────────────
const azimutDesc = `Stunning 2022 Azimut Fly 50 — one of the most sought-after flybridge motor yachts on the market today. This flybridge beauty combines Italian design with exceptional performance and comfortable cruising range.

Immaculately maintained and showing like new, this Azimut 50 Fly is ready for immediate delivery in Miami, Florida. Every detail has been carefully attended to by her professional crew and current owner.

Spacious Flybridge: The expansive flybridge offers panoramic 360-degree views, a large sunpad, dining area, and full helm station — perfect for entertaining while underway or at anchor.

Elegant Interiors: The main salon features full-beam width with floor-to-ceiling windows, premium leather seating, and a fully-equipped galley. Three luxurious staterooms accommodate up to 6 guests with 2 crew quarters.

Performance & Range: Twin Volvo IPS drives provide exceptional fuel economy and outstanding handling, with a cruising speed of 27 knots and comfortable range for extended coastal passages.`;

export const STATIC_LISTINGS: Listing[] = [
  stub(
    1,
    '2022-azimut-fly-50-miami',
    '2022 Azimut Fly 50',
    2022,
    'Azimut',
    'Fly 50',
    50,
    1_195_000,
    'Miami, Florida',
    azimutDesc,
    {
      'LOA': '50 ft',
      'Beam': '14 ft 9 in',
      'Draft': '3 ft 11 in',
      'Hull Material': 'Fiberglass',
      'Fuel Type': 'Diesel',
      'Engine 1': 'Volvo IPS 600 — 435 hp',
      'Engine 2': 'Volvo IPS 600 — 435 hp',
      'Top Speed': '32 kn',
      'Cruising Speed': '27 kn',
      'Fuel Capacity': '475 gal',
      'Water Capacity': '132 gal',
      'Guest Cabins': '3',
      'Crew Cabins': '1',
      'Guest Heads': '3',
      'Class': 'Flybridge Motor Yacht',
      'Condition': 'Used — Excellent',
    },
    {
      'Electronics': ['Garmin chartplotter', 'Autopilot', 'Radar', 'VHF Radio', 'AIS', 'Depthsounder'],
      'Interior': ['Air Conditioning throughout', 'Heating', 'Generator', 'Hot Water', 'Fresh Water Maker', 'Refrigerator', 'Dishwasher', 'Microwave', 'Oven', 'Electric Bilge Pump'],
      'Deck & Exterior': ['Teak Cockpit', 'Bow Thruster', 'Stern Thruster', 'Hydraulic Swim Platform', 'Cockpit Cushions', 'Bimini Top', 'Hard Top'],
      'Entertainment': ['Flat Screen TVs', 'Cockpit Speakers', 'Wi-Fi', 'Satellite TV'],
    },
    '/videos/azimut-fly-50.mp4',
    '2022 Azimut Fly 50 For Sale Miami | $1,195,000 | Liena Q Perez',
    '2022 Azimut Fly 50 for sale in Miami, FL. 50ft Italian flybridge motor yacht, twin Volvo IPS 600, 3 staterooms. Asking $1,195,000. Call Liena Q Perez — 786-838-9911.',
    '2022 Azimut Fly 50 for sale,Azimut 50 Fly Miami,flybridge yacht Miami,Italian yacht for sale Florida,luxury motor yacht Miami',
  ),

  // ───────────────────────────────────────────────────────────────────────────
  // 2. 2007 Fairline Squadron 65
  // ───────────────────────────────────────────────────────────────────────────
  stub(
    2,
    '2007-fairline-squadron-65-miami',
    '2007 Fairline Squadron 65',
    2007,
    'Fairline',
    'Squadron 65',
    65,
    499_000,
    'Miami, Florida',
    `Exceptional 2007 Fairline Squadron 65 — a flagship British motor yacht offering unmatched space, range, and offshore capability. This is one of the finest examples of the Squadron 65 on the market today.

Thoroughly refit and maintained to the highest standard, this Fairline Squadron 65 presents beautifully both inside and out. Ready for extended bluewater passages or island cruising in complete comfort.

Volume & Space: The full-beam master stateroom, VIP forward cabin, and two twin guest cabins provide accommodation for up to 8 guests in outstanding comfort. The main salon is vast by any standard — a true home away from home.

Performance: Twin Volvo D12 engines provide excellent range and reliability, with a cruising speed of 22 knots and bluewater range for the Bahamas, Caribbean, and beyond.

Turnkey Condition: New bottom paint, recently serviced engines, updated electronics suite. Survey available. Lying Miami, Florida — available for immediate viewing.`,
    {
      'LOA': '65 ft',
      'Beam': '17 ft 5 in',
      'Draft': '5 ft',
      'Hull Material': 'Fiberglass',
      'Fuel Type': 'Diesel',
      'Engine 1': 'Volvo D12 — 660 hp',
      'Engine 2': 'Volvo D12 — 660 hp',
      'Top Speed': '28 kn',
      'Cruising Speed': '22 kn',
      'Range': '350 nmi',
      'Fuel Capacity': '1,100 gal',
      'Water Capacity': '290 gal',
      'Guest Cabins': '4',
      'Crew Cabins': '1',
      'Guest Heads': '4',
      'Class': 'Motor Yacht',
      'Condition': 'Used — Refit',
    },
    {
      'Electronics': ['Raymarine chartplotter', 'Autopilot', 'Radar', 'VHF Radio', 'AIS', 'Depthsounder', 'Compass', 'Wind instruments'],
      'Interior': ['Air Conditioning throughout', 'Heating', 'Generator (17.5 kW)', 'Hot Water', 'Fresh Water Maker', 'Refrigerator', 'Freezer', 'Dishwasher', 'Microwave', 'Oven', 'Washer/Dryer'],
      'Deck & Exterior': ['Teak Cockpit', 'Bow Thruster', 'Stern Thruster', 'Hydraulic Swim Platform', 'Tender Garage', 'Hydraulic Gangway', 'Hard Top', 'Bimini'],
      'Safety': ['Life raft', 'EPIRB', 'Fire suppression system', 'Man-overboard system'],
    },
    '/videos/fairline-65.mp4',
    '2007 Fairline Squadron 65 For Sale Miami | $499,000 | Liena Q Perez',
    '2007 Fairline Squadron 65 for sale in Miami, FL. 65ft British motor yacht, twin Volvo D12 660hp, 4 staterooms, refit. Asking $499,000. Call Liena Q Perez — 786-838-9911.',
    '2007 Fairline Squadron 65 for sale,Fairline Squadron 65 Miami,motor yacht Miami,used yacht for sale Florida,luxury motor yacht Miami',
  ),

  // ───────────────────────────────────────────────────────────────────────────
  // 3. 1999 Mangusta 80
  // ───────────────────────────────────────────────────────────────────────────
  stub(
    3,
    '1999-mangusta-80-miami',
    '1999 Mangusta 80',
    1999,
    'Mangusta',
    '80',
    80,
    699_000,
    'Miami, Florida',
    `Refit: Engine, Upholstery, Interior, all hydraulic system — October 2025.

Stunning 1999 Mangusta 80 — a timeless Italian express cruiser combining sleek design with raw, surface-drive performance. With her elegant lines and striking profile, this Mangusta 80 turns heads in every port.

Elegant Accommodations: The interior features classic Italian styling with rich wood finishes and luxurious fabrics. Accommodating up to 8 guests across 4 staterooms — a sumptuous master suite, a VIP stateroom, and two twin cabins, all with en-suite facilities. The spacious salon offers ample seating, a dining area, and a full entertainment system.

Exceptional Performance: Powered by twin MTU engines producing 2,000 hp each via surface drives, this Mangusta 80 delivers a top speed of 40 knots and a cruising speed of 30 knots. The deep-V hull provides a smooth, stable ride even at high speed.

Outdoor Lifestyle: The aft deck features a large sunpad, dining area, and easy water access via the swim platform. The foredeck offers additional sunpads. The flybridge is equipped with comfortable seating and a second helm station.

Well-maintained and ready to cruise — comprehensive October 2025 refit covering engines, upholstery, interior, and all hydraulic systems.`,
    {
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
    {
      'Electronics': ['Autopilot', 'Radar', 'GPS', 'Chartplotter', 'VHF Radio', 'Depthsounder', 'Compass', 'Wi-Fi', 'Computer', 'Flat Screen TV', 'Cockpit Speakers'],
      'Interior': ['Air Conditioning throughout', 'Heating', 'Hot Water', 'Fresh Water Maker', 'Refrigerator', 'Deep Freezer', 'Dishwasher', 'Microwave Oven', 'Oven', 'Marine Head', 'Electric Bilge Pump', 'Bow Thruster'],
      'Deck & Exterior': ['Teak Cockpit', 'Cockpit Cushions', 'Hydraulic Gangway', 'Swimming Ladder', 'Gyroscopic Stabilizer', 'Tender', 'Wind Generator', 'Bimini Top', 'Hard Top'],
      'Additional': ['Garage (tender storage)', 'Underwater Lights', 'Wine Cellar'],
    },
    '/videos/mangusta-80.mp4',
    '1999 Mangusta 80 For Sale Miami | $699,000 | Liena Q Perez',
    '1999 Mangusta 80 for sale in Miami, FL. 80ft Italian express cruiser, twin MTU 2,000hp surface drives, comprehensive refit Oct 2025. Asking $699,000. Call 786-838-9911.',
    '1999 Mangusta 80 for sale,Mangusta 80 Miami,express cruiser Miami,Italian yacht Miami,used yacht for sale Florida',
  ),

  // ───────────────────────────────────────────────────────────────────────────
  // 4. 2026 Nassima Yacht N40 — White
  // ───────────────────────────────────────────────────────────────────────────
  stub(
    4,
    '2026-nassima-n40-white-fort-lauderdale',
    '2026 Nassima Yacht N40 — White',
    2026,
    'Nassima Yacht',
    'N40',
    40,
    799_000,
    'Fort Lauderdale, Florida',
    `The 2026 Nassima Yacht N40 is a stunning example of Italian craftsmanship and modern luxury — a brand-new vessel available in white from stock in Fort Lauderdale.

At 40 feet, this top-of-the-line cruiser is designed to provide the ultimate in comfort and style. Powered by twin 2023 Mercury Verado V10 outboards producing 400 hp each, the N40 delivers a top speed of 45 knots and a cruising speed of 30 knots — while keeping the motors sleekly hidden beneath the aft sun bed.

Exceptional Design: The spacious cabin features memory foam mattresses, 22" TV, dual fridge, electric stove, and full head with shower — perfect for overnight stays. The automatic handling sofas expand the cockpit configuration, and the automatic aft sun bed opens to access the engines seamlessly.

Italian Craftsmanship: Garmin touch home automation (EmpireBUS), Fusion sound system with 4 exterior speakers, 2 interior speakers, subwoofer and amplifier, teak cockpit and sidedecks, bow thruster, anchor winch. Available in Fort Lauderdale stock for immediate delivery.`,
    {
      'LOA': '39 ft 7 in',
      'Beam': '12 ft 6 in',
      'Dry Weight': '17,000 lb',
      'Hull Material': 'Fiberglass',
      'Hull Shape': 'Deep Vee',
      'Hull Color': 'White',
      'Fuel Type': 'Gas / Petrol',
      'Engine 1': '2023 Mercury Verado V10 — 400 hp',
      'Engine 2': '2023 Mercury Verado V10 — 400 hp',
      'Engine Type': 'Outboard',
      'Max Speed': '45 kn',
      'Cruising Speed': '30 kn',
      'Range': '130 nmi',
      'Fuel Capacity': '2 × 100 gal',
      'Water Capacity': '60 gal',
      'Guest Cabins': '1',
      'Guest Heads': '2',
      'Seating Capacity': '12',
      'Class': 'Cruiser',
      'Condition': 'New — 2026',
    },
    {
      'Navigation & Helm': ['Double Garmin 12" touchscreens', 'Garmin EmpireBUS home automation', 'Secondary navigation GPS', 'Compass', 'VHF Radio', 'Radar', 'Depthsounder', '4 USB outlets', 'Ergonomic driving seats'],
      'Interior & Comfort': ['Air conditioning (6,000 BTU each unit)', 'Dual refrigerator', 'Electric stove with Corian chopping board', 'Sink', 'Memory foam mattresses', '22" TV', 'Water heater (16 gal)', 'Automatic WC', 'Head with shower', 'Shower system', 'Electric panel in cabin'],
      'Audio & Entertainment': ['Fusion sound system', '4 exterior cockpit speakers', '2 interior speakers', 'Subwoofer', 'Amplifier'],
      'Deck & Exterior': ['Teak cockpit', 'Teak sidedecks', 'Cockpit cushions', 'Cockpit shower (hot/cold)', 'Cockpit table (automatic)', 'Automatic handling sofas', 'Automatic aft sun bed', 'Swimming ladder', 'Hard top with LED lighting', 'Underwater lights', 'Walk around'],
      'Anchoring & Docking': ['Anchor in stainless steel', 'Stainless steel chain', 'Anchor rinsing system', 'Anchor winch Lewmar 1,000W', 'Wired windlass control', 'Bow shower', 'Bow thruster Lewmar', 'Lewmar hatch'],
      'Electrical & Mechanical': ['Generator', 'Inverter', 'Shore power inlet', 'Battery charger', 'Electric bilge pump', 'Manual bilge pump', 'Electric head', 'Touch screen controls', 'Launching trailer included'],
    },
    '/videos/nassima-n40-white.mp4',
    '2026 Nassima Yacht N40 White For Sale Fort Lauderdale | $799,000',
    '2026 Nassima Yacht N40 (White) — new Italian luxury cruiser, 40ft, twin Mercury Verado 400hp, 45 knots, Fort Lauderdale. Asking $799,000. Contact Liena Q Perez — 786-838-9911.',
    '2026 Nassima N40 for sale,Nassima Yacht N40 white,luxury cruiser Fort Lauderdale,new yacht Florida,Italian boat for sale Miami',
  ),

  // ───────────────────────────────────────────────────────────────────────────
  // 5. 2026 Nassima Yacht N40 — Grey
  // ───────────────────────────────────────────────────────────────────────────
  stub(
    5,
    '2026-nassima-n40-grey-fort-lauderdale',
    '2026 Nassima Yacht N40 — Grey',
    2026,
    'Nassima Yacht',
    'N40',
    40,
    799_000,
    'Fort Lauderdale, Florida',
    `The 2026 Nassima Yacht N40 in grey is a stunning example of Italian craftsmanship and modern luxury — a brand-new vessel available from stock in Fort Lauderdale.

At 40 feet, this top-of-the-line cruiser delivers the ultimate in comfort and style. Powered by twin 2023 Mercury Verado V10 outboards producing 400 hp each, the N40 hits a top speed of 45 knots and a cruising speed of 30 knots — while keeping the motors hidden beneath the aft sun bed for a clean, uninterrupted silhouette.

The grey colorway gives this N40 a bold, contemporary look that stands apart. Every surface, every line, every finish has been considered — this is not a production boat built to a price point. It is an Italian-designed luxury vessel built to a standard.

The spacious cabin features memory foam mattresses, 22" TV, dual fridge, electric stove, and a full head with shower. The automatic handling sofas expand the cockpit, and the automatic aft sun bed opens seamlessly to access the engines.

Garmin touch home automation (EmpireBUS), Fusion sound system, teak cockpit and sidedecks, bow thruster, anchor winch. Available in Fort Lauderdale stock for immediate delivery.`,
    {
      'LOA': '39 ft 7 in',
      'Beam': '12 ft 6 in',
      'Dry Weight': '17,000 lb',
      'Hull Material': 'Fiberglass',
      'Hull Shape': 'Deep Vee',
      'Hull Color': 'Grey',
      'Fuel Type': 'Gas / Petrol',
      'Engine 1': '2023 Mercury Verado V10 — 400 hp',
      'Engine 2': '2023 Mercury Verado V10 — 400 hp',
      'Engine Type': 'Outboard',
      'Max Speed': '45 kn',
      'Cruising Speed': '30 kn',
      'Range': '130 nmi',
      'Fuel Capacity': '2 × 100 gal',
      'Water Capacity': '60 gal',
      'Guest Cabins': '1',
      'Guest Heads': '2',
      'Seating Capacity': '12',
      'Class': 'Cruiser',
      'Condition': 'New — 2026',
    },
    {
      'Navigation & Helm': ['Double Garmin 12" touchscreens', 'Garmin EmpireBUS home automation', 'Secondary navigation GPS', 'Compass', 'VHF Radio', 'Radar', 'Depthsounder', '4 USB outlets', 'Ergonomic driving seats'],
      'Interior & Comfort': ['Air conditioning (6,000 BTU each unit)', 'Dual refrigerator', 'Electric stove with Corian chopping board', 'Sink', 'Memory foam mattresses', '22" TV', 'Water heater (16 gal)', 'Automatic WC', 'Head with shower', 'Shower system', 'Electric panel in cabin'],
      'Audio & Entertainment': ['Fusion sound system', '4 exterior cockpit speakers', '2 interior speakers', 'Subwoofer', 'Amplifier'],
      'Deck & Exterior': ['Teak cockpit', 'Teak sidedecks', 'Cockpit cushions', 'Cockpit shower (hot/cold)', 'Cockpit table (automatic)', 'Automatic handling sofas', 'Automatic aft sun bed', 'Swimming ladder', 'Hard top with LED lighting', 'Underwater lights', 'Walk around'],
      'Anchoring & Docking': ['Anchor in stainless steel', 'Stainless steel chain', 'Anchor rinsing system', 'Anchor winch Lewmar 1,000W', 'Wired windlass control', 'Bow shower', 'Bow thruster Lewmar', 'Lewmar hatch'],
      'Electrical & Mechanical': ['Generator', 'Inverter', 'Shore power inlet', 'Battery charger', 'Electric bilge pump', 'Manual bilge pump', 'Electric head', 'Touch screen controls', 'Launching trailer included'],
    },
    '/videos/nassima-n40-grey.mp4',
    '2026 Nassima Yacht N40 Grey For Sale Fort Lauderdale | $799,000',
    '2026 Nassima Yacht N40 (Grey) — new Italian luxury cruiser, 40ft, twin Mercury Verado 400hp, 45 knots, Fort Lauderdale. Asking $799,000. Contact Liena Q Perez — 786-838-9911.',
    '2026 Nassima N40 grey for sale,Nassima Yacht N40,luxury cruiser Fort Lauderdale,new yacht Florida,Italian boat for sale Miami',
  ),
];
