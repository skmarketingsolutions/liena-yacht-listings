/**
 * Static fallback listing data.
 *
 * These are the 5 curated listings. getAllListings() merges this data with the
 * Neon database: DB rows take priority for matching slugs (they carry real
 * photos, updated prices, etc.), but every slug here is guaranteed to appear
 * even when the DB seed is incomplete or the database is unreachable.
 *
 * IMPORTANT: slugs must match the DB exactly (see seed route / instrumentation).
 */

import type { Listing } from './db';

const now = new Date().toISOString();

// R2 CDN base — where the large original videos are stored
const R2 = 'https://pub-d1d12a43eab2479bb077f5824229a67c.r2.dev';

function stub(
  id: number,
  slug: string,
  title: string,
  vesselName: string | null,
  year: number,
  make: string,
  model: string,
  length_ft: number,
  price: number,
  location: string,
  description: string,
  specs: Record<string, string>,
  features: Record<string, string[]>,
  photos: string[],
  video_url: string | null,
  seo_title: string,
  seo_description: string,
  seo_keywords: string,
): Listing {
  return {
    id,
    slug,
    title,
    vessel_name: vesselName,
    year,
    make,
    model,
    length_ft,
    price,
    location,
    description,
    specs,
    features,
    photos,
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
// 1. 2019 Azimut Fly 50 "La Paloma"
//    Slug matches DB exactly: 2019-azimut-fly-50-miami
//    Video: R2 CDN (fast)
// ─────────────────────────────────────────────────────────────────────────────
export const STATIC_LISTINGS: Listing[] = [
  stub(
    1,
    '2019-azimut-fly-50-miami',
    '2019 Azimut Fly 50 — La Paloma',
    'La Paloma',
    2019,
    'Azimut',
    'Fly 50',
    50,
    980_000,
    'Miami, Florida',
    `Introducing the stunning 2019 Azimut Fly 50 "La Paloma" — a remarkable flybridge yacht that embodies Italian elegance and performance. With an overall length of 50 feet, this vessel is crafted from durable fiberglass and powered by twin Volvo Penta inboard diesel engines, promising a reliable and exhilarating cruising experience.

The Fly 50 is designed for comfort and style, featuring a spacious layout that enhances your time spent at sea. The flybridge offers an ideal vantage point for enjoying breathtaking views while relaxing with friends and family. Equipped with a SeaKeeper gyroscopic stabilizer, Raymarine electronics suite, and JoyStick docking control, this yacht handles like a dream in Miami's waters.

Three beautifully appointed staterooms accommodate up to 6 guests, while the fully-equipped galley with Miele appliances ensures gourmet meals at anchor. The expansive flybridge with wet bar, grill, and U-shaped seating makes this the ultimate Miami entertainment vessel.`,
    {
      'Length Overall': '50 ft',
      'Beam': '15 ft 3 in',
      'Max Draft': '4 ft 11 in',
      'Hull Material': 'Fiberglass',
      'Hull Class': 'Flybridge',
      'Year': '2019',
      'Fuel Type': 'Diesel',
      'Engine 1': 'Volvo Penta Inboard Diesel',
      'Engine 2': 'Volvo Penta Inboard Diesel',
      'Stabilizer': 'SeaKeeper Gyro',
      'Condition': 'Used',
    },
    {
      'Salon': ['Wood flooring throughout', 'Port & starboard salon sofas', 'Hi-Low table on starboard side', 'Bose sound system', 'Sony 4K 3D BluRay', 'Dometic A/C electronic display', 'Large panoramic windows'],
      'Galley': ['Galley located aft salon port side', 'Large countertop with wood flooring', 'Vitrifrigo undercounter refrigerator', 'Miele Microwave/Oven', 'Miele Induction cooktop', 'Stainless steel sink'],
      'Electronics': ['(2) Twin Raymarine MFD displays', 'Raymarine Autopilot', 'JoyStick docking control', 'Raymarine VHF Radio', 'SeaKeeper display', 'Sea-Fire shutdown system', 'Raymarine Radar', 'Volvo Penta engine display'],
      'Deck & Exterior': ['Hydraulic swim platform', 'Teak deck', 'U-Shape aft deck seating', 'Cockpit table with SS pedestal', 'Isotherm cockpit refrigerator', 'JL Audio speakers', 'Fusion MS-NRX300 stereo', 'Fresh water wash down'],
      'Flybridge': ['Large flybridge — ideal for entertaining', '(2) Sofas on aft flybridge deck', 'U-Shape forward sofa with wood table', 'Wet bar with grill, sink & Vitrifrigo fridge', 'Sunroof', 'JL Audio speakers', '(2) Raymarine MFD displays', 'JoyStick control'],
    },
    [
      '/listings/azimut-fly-50/photo_01.jpeg',
      '/listings/azimut-fly-50/photo_06.jpeg',
      '/listings/azimut-fly-50/photo_07.jpeg',
      '/listings/azimut-fly-50/photo_08.jpeg',
    ],
    `${R2}/sfx%20.mp4`,
    '2019 Azimut Fly 50 Flybridge For Sale in Miami | Liena Q Perez',
    'Pristine 2019 Azimut Fly 50 "La Paloma" for sale in Miami, FL. 50ft flybridge yacht with twin Volvo Penta diesels, SeaKeeper stabilizer, 3 staterooms & flybridge bar. $980,000. Contact Liena Q Perez.',
    '2019 Azimut Fly 50 for sale,Azimut 50 flybridge Miami,used Azimut yacht Florida,flybridge yacht Miami,50 foot yacht for sale,luxury yacht Miami',
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // 2. 2013 Fairline Squadron 65
  //    Slug matches DB exactly: 2013-fairline-squadron-65-miami-beach
  //    Video: R2 CDN (fast)
  // ─────────────────────────────────────────────────────────────────────────
  stub(
    2,
    '2013-fairline-squadron-65-miami-beach',
    '2013 Fairline Squadron 65',
    null,
    2013,
    'Fairline',
    'Squadron 65',
    66,
    1_300_000,
    'Miami Beach, Florida',
    `An extraordinary opportunity to own the iconic 2013 Fairline Squadron 65 — a masterpiece of British yacht-building now available in Miami Beach. Bring all offers on this magnificent 66-foot motor yacht that redefines luxury afloat.

Sumptuous furnishings and hand-worked cabinetry are hallmarks of the Squadron range. Nowhere is it more elegantly expressed than in the long, wide single-level interior — a testament to the 65's ingenious flat floor design that is normally reserved for much larger yachts.

The massive flybridge features three distinct social areas: a forward chaise longue and sun pad, aft-facing sunbeds, and a seating/dining area. Powered by twin Caterpillar C18-1150 diesels at 1,150hp each producing 32 knots, equipped with Seakeeper gyroscopic stabilizer, bow and stern thrusters, and a full garage for your tender.`,
    {
      'Length Overall': '66 ft 11 in',
      'Beam': '17 ft 2 in',
      'Hull Material': 'Fiberglass',
      'Hull Shape': 'Modified Vee',
      'Hull Class': 'Motor Yacht',
      'Year': '2013',
      'Fuel Type': 'Diesel',
      'Engine 1': 'CAT C18-1150 Inboard Diesel',
      'Engine 2': 'CAT C18-1150 Inboard Diesel',
      'Engine Hours': '690 hrs each',
      'Total Power': '2,300 hp',
      'Max Speed': '32 knots',
      'Fuel Capacity': '936 gallons',
      'Fresh Water': '305 gallons',
      'Stabilizer': 'Seakeeper Gyroscopic',
      'Condition': 'Used',
    },
    {
      'Electronics': ['Garmin navigation system', 'Autopilot', 'GPS & chartplotter', 'Radar', 'VHF radio', 'Depth sounder', 'Wi-Fi aboard', 'Flat screen TVs', 'Cockpit speakers'],
      'Interior Equipment': ['Full air conditioning', 'Seakeeper gyroscopic stabilizer', 'Bow thruster', 'Stern thruster', 'Dishwasher', 'Washing machine', 'Fresh water maker', 'Electric bilge pump', 'Microwave oven & full oven', 'Refrigerator', 'Hot water system', 'Generator'],
      'Exterior & Deck': ['Teak cockpit', 'Teak sidedecks', 'Hydraulic hi-lo bathing platform', 'Hydraulic gangway', 'Cockpit table & cushions', 'Davit(s)', 'Fin stabilizers', 'Swimming ladder', 'Underwater lights', 'Walk-around deck', 'Bimini top'],
      'Tender & Toys': ['Full garage for tender', 'Yamaha WaveRunner jet ski', 'Davits for tender launch'],
    },
    [
      '/listings/fairline-squadron-65/photo_02.jpeg',
      '/listings/fairline-squadron-65/photo_07.jpeg',
      '/listings/fairline-squadron-65/photo_08.jpeg',
      '/listings/fairline-squadron-65/photo_09.jpeg',
    ],
    `${R2}/Final%20Fairline.mp4`,
    '2013 Fairline Squadron 65 Motor Yacht For Sale Miami Beach | Liena Q Perez',
    '2013 Fairline Squadron 65 for sale in Miami Beach, FL. 66ft motor yacht with twin CAT 1,150hp engines (690 hrs), Seakeeper, bow & stern thrusters, garage & WaveRunner. $1,300,000. Contact Liena Q Perez.',
    '2013 Fairline Squadron 65 for sale,Fairline Squadron 65 Miami Beach,used motor yacht Florida,66 foot yacht for sale,Fairline yacht Miami,luxury motor yacht Miami Beach',
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // 3. 1999 Mangusta 80
  //    Location: Miami, Florida (correct per PDF)
  //    Video: local /videos/mangusta-80.mp4 (committed to repo)
  // ─────────────────────────────────────────────────────────────────────────
  stub(
    3,
    '1999-mangusta-80-miami',
    '1999 Mangusta 80',
    null,
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
    // photo_01 is a 494×158 header banner — gallery starts at photo_02
    Array.from({ length: 50 }, (_, i) => `/listings/1999-mangusta-80-miami/photo_${String(i + 2).padStart(2, '0')}.jpeg`),
    '/videos/mangusta-80.mp4',
    '1999 Mangusta 80 For Sale Miami | $699,000 | Liena Q Perez',
    '1999 Mangusta 80 for sale in Miami, FL. 80ft Italian express cruiser, twin MTU 2,000hp surface drives, comprehensive refit Oct 2025. Asking $699,000. Call 786-838-9911.',
    '1999 Mangusta 80 for sale,Mangusta 80 Miami,express cruiser Miami,Italian yacht Miami,used yacht for sale Florida',
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // 4. 2026 Nassima Yacht N40 — White
  //    Location: Fort Lauderdale, Florida (correct per PDF)
  //    Video: local /videos/nassima-n40-white.mp4 (committed to repo)
  // ─────────────────────────────────────────────────────────────────────────
  stub(
    4,
    '2026-nassima-n40-white-fort-lauderdale',
    '2026 Nassima Yacht N40 — White',
    null,
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
    // photo_01 is a 494×158 header banner — gallery starts at photo_02
    Array.from({ length: 23 }, (_, i) => `/listings/2026-nassima-n40-white-fort-lauderdale/photo_${String(i + 2).padStart(2, '0')}.jpeg`),
    '/videos/nassima-n40-white.mp4',
    '2026 Nassima Yacht N40 White For Sale Fort Lauderdale | $799,000',
    '2026 Nassima Yacht N40 (White) — new Italian luxury cruiser, 40ft, twin Mercury Verado 400hp, 45 knots, Fort Lauderdale. Asking $799,000. Contact Liena Q Perez — 786-838-9911.',
    '2026 Nassima N40 for sale,Nassima Yacht N40 white,luxury cruiser Fort Lauderdale,new yacht Florida,Italian boat for sale Miami',
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // 5. 2026 Nassima Yacht N40 — Grey
  //    Location: Fort Lauderdale, Florida (correct per PDF)
  //    Video: local /videos/nassima-n40-grey.mp4 (committed to repo)
  // ─────────────────────────────────────────────────────────────────────────
  stub(
    5,
    '2026-nassima-n40-grey-fort-lauderdale',
    '2026 Nassima Yacht N40 — Grey',
    null,
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
    // photo_01 is a 494×158 header banner — gallery starts at photo_02
    Array.from({ length: 23 }, (_, i) => `/listings/2026-nassima-n40-grey-fort-lauderdale/photo_${String(i + 2).padStart(2, '0')}.jpeg`),
    '/videos/nassima-n40-grey.mp4',
    '2026 Nassima Yacht N40 Grey For Sale Fort Lauderdale | $799,000',
    '2026 Nassima Yacht N40 (Grey) — new Italian luxury cruiser, 40ft, twin Mercury Verado 400hp, 45 knots, Fort Lauderdale. Asking $799,000. Contact Liena Q Perez — 786-838-9911.',
    '2026 Nassima N40 grey for sale,Nassima Yacht N40,luxury cruiser Fort Lauderdale,new yacht Florida,Italian boat for sale Miami',
  ),
];
