/**
 * POST /api/admin/seed?secret=SEED_SECRET
 *
 * Creates Postgres tables (if they don't exist) and inserts seed data
 * (admins + listings) only when each table is empty.
 * Call this once after setting DATABASE_URL in Vercel.
 */

import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────────────────
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

  try {
    // ── Create tables ─────────────────────────────────────────────────────────
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id            SERIAL       PRIMARY KEY,
        username      VARCHAR(50)  UNIQUE NOT NULL,
        password_hash TEXT         NOT NULL,
        email         VARCHAR(255),
        role          VARCHAR(20)  NOT NULL DEFAULT 'salesman',
        name          VARCHAR(255),
        phone         VARCHAR(50),
        created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS listings (
        id              SERIAL        PRIMARY KEY,
        slug            VARCHAR(255)  UNIQUE NOT NULL,
        title           VARCHAR(500)  NOT NULL,
        vessel_name     VARCHAR(255),
        year            INTEGER       NOT NULL,
        make            VARCHAR(255)  NOT NULL,
        model           VARCHAR(255)  NOT NULL,
        length_ft       NUMERIC(10,2) NOT NULL,
        price           NUMERIC(15,2) NOT NULL,
        location        VARCHAR(255)  NOT NULL,
        description     TEXT          NOT NULL,
        specs           JSONB         NOT NULL DEFAULT '{}',
        features        JSONB         NOT NULL DEFAULT '{}',
        photos          JSONB         NOT NULL DEFAULT '[]',
        video_url       TEXT,
        featured        BOOLEAN       NOT NULL DEFAULT false,
        status          VARCHAR(20)   NOT NULL DEFAULT 'active',
        salesman_id     INTEGER,
        seo_title       VARCHAR(500),
        seo_description TEXT,
        seo_keywords    TEXT,
        created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id            SERIAL       PRIMARY KEY,
        name          VARCHAR(255) NOT NULL,
        email         VARCHAR(255) NOT NULL,
        phone         VARCHAR(50)  NOT NULL,
        message       TEXT,
        listing_id    INTEGER,
        listing_title VARCHAR(500),
        created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `;

    // ── Seed admins (only if empty) ───────────────────────────────────────────
    const [{ n: adminCount }] = await sql`SELECT COUNT(*)::int AS n FROM admins`;
    let adminsSeeded = 0;

    if (Number(adminCount) === 0) {
      // Hashes from live db.json — liena: LienaQ2024!  admin: Admin2024!
      const lienaHash = '$2a$10$18n.mrKd/9DmjmJ3kgA5c.PksVa/wOrBKDyYaTIFjaO7sSNX2C3jW';
      const adminHash = '$2a$10$YHttYogNjvAk9wlO4b.BQukQXD/lebRiNJe0E9RNOrHrDWjWv5dLy';
      const ts = '2026-04-04T20:27:46.752Z';

      await sql`
        INSERT INTO admins (id, username, password_hash, email, role, name, phone, created_at)
        VALUES (1, 'liena', ${lienaHash}, 'liena@italiaboats.com', 'salesman', 'Liena Q Perez', '786-838-9911', ${ts})
      `;
      await sql`
        INSERT INTO admins (id, username, password_hash, email, role, name, phone, created_at)
        VALUES (2, 'admin', ${adminHash}, 'liena@italiaboats.com', 'broker', 'Admin', '786-838-9911', ${ts})
      `;
      await sql`SELECT setval('admins_id_seq', 2, true)`;
      adminsSeeded = 2;
    }

    // ── Seed listings (only if empty) ─────────────────────────────────────────
    const [{ n: listingCount }] = await sql`SELECT COUNT(*)::int AS n FROM listings`;
    let listingsSeeded = 0;

    if (Number(listingCount) === 0) {
      const ts = '2026-04-04T20:27:46.752Z';

      // ── Azimut Fly 50 ────────────────────────────────────────────────────────
      const azDesc = `Introducing the stunning 2019 Azimut Fly 50 "La Paloma" — a remarkable flybridge yacht that embodies Italian elegance and performance. With an overall length of 50 feet, this vessel is crafted from durable fiberglass and powered by twin Volvo Penta inboard diesel engines, promising a reliable and exhilarating cruising experience.

The Fly 50 is designed for comfort and style, featuring a spacious layout that enhances your time spent at sea. The flybridge offers an ideal vantage point for enjoying breathtaking views while relaxing with friends and family. Equipped with a SeaKeeper gyroscopic stabilizer, Raymarine electronics suite, and JoyStick docking control, this yacht handles like a dream in Miami's waters.

Three beautifully appointed staterooms accommodate up to 6 guests, while the fully-equipped galley with Miele appliances ensures gourmet meals at anchor. The expansive flybridge with wet bar, grill, and U-shaped seating makes this the ultimate Miami entertainment vessel.`;

      const azSpecs = JSON.stringify({
        'Length Overall':'50 ft','Beam':'15 ft 3 in','Max Draft':'4 ft 11 in',
        'Hull Material':'Fiberglass','Hull Class':'Flybridge','Year':'2019',
        'Fuel Type':'Diesel','Engine 1':'Volvo Penta Inboard Diesel',
        'Engine 2':'Volvo Penta Inboard Diesel','Stabilizer':'SeaKeeper Gyro','Condition':'Used',
      });
      const azFeatures = JSON.stringify({
        'Salon':['Wood flooring throughout','Port & starboard salon sofas','Hi-Low table on starboard side','Bose sound system','Sony 4K 3D BluRay','Dometic A/C electronic display','Large panoramic windows'],
        'Galley':['Galley located aft salon port side','Large countertop with wood flooring','Vitrifrigo undercounter refrigerator','Miele Microwave/Oven','Miele Induction cooktop','Stainless steel sink'],
        'Electronics':['(2) Twin Raymarine MFD displays','Raymarine Autopilot','JoyStick docking control','Raymarine VHF Radio','SeaKeeper display','Sea-Fire shutdown system','Raymarine Radar','Volvo Penta engine display'],
        'Companionway':['Splendide washer & dryer','Vitrifrigo refrigerator'],
        'Forward VIP Stateroom':['Centerline queen bed','Bose sound system','Samsung TV','Dometic A/C electronic display','(2) Hanging closets','Emergency escape hatch','Marine CO alarm','Reading lights'],
        'Guest Stateroom':['(2) Single beds with mattresses','Carpet flooring','Hanging closet','Dometic A/C display','Marine CO alarm','Reading lights'],
        'Master Stateroom':['Large windows','Samsung TV','Hanging closet','Private head & shower en suite','Reading & overhead lights','Carpet flooring'],
        'Cockpit & Platform':['Hydraulic swim platform','Teak deck','U-Shape aft deck seating','Cockpit table with SS pedestal','Isotherm cockpit refrigerator','Raritan Ice Maker','JL Audio speakers','Fusion MS-NRX300 stereo','Fresh water wash down','Whale bilge pump','Glendinning shore power cable','Crew quarter hatch'],
        'Flybridge':['Large flybridge — ideal for entertaining','(2) Sofas on aft flybridge deck','U-Shape forward sofa with wood table','Wet bar with grill, sink & Vitrifrigo fridge','Sunroof','JL Audio speakers','Fusion radio','(2) Raymarine MFD displays','Raymarine Autopilot','JoyStick control','Searchlight control','SeaKeeper display'],
        'Engine Room':['Twin Volvo Penta diesel engines','Cummins Onan generator','Fresh water maker','Dometic chiller','Fire extinguisher'],
      });
      const azPhotos = JSON.stringify([
        '/listings/azimut-fly-50/photo_01.jpeg','/listings/azimut-fly-50/photo_06.jpeg',
        '/listings/azimut-fly-50/photo_07.jpeg','/listings/azimut-fly-50/photo_08.jpeg',
        '/listings/azimut-fly-50/photo_09.jpeg','/listings/azimut-fly-50/photo_10.jpeg',
        '/listings/azimut-fly-50/photo_11.jpeg','/listings/azimut-fly-50/photo_12.jpeg',
        '/listings/azimut-fly-50/photo_13.jpeg','/listings/azimut-fly-50/photo_14.jpeg',
        '/listings/azimut-fly-50/photo_15.jpeg','/listings/azimut-fly-50/photo_16.jpeg',
        '/listings/azimut-fly-50/photo_17.jpeg','/listings/azimut-fly-50/photo_18.jpeg',
        '/listings/azimut-fly-50/photo_19.jpeg','/listings/azimut-fly-50/photo_20.jpeg',
        '/listings/azimut-fly-50/photo_21.jpeg','/listings/azimut-fly-50/photo_22.jpeg',
        '/listings/azimut-fly-50/photo_23.jpeg','/listings/azimut-fly-50/photo_24.jpeg',
      ]);

      await sql`
        INSERT INTO listings (id, slug, title, vessel_name, year, make, model, length_ft, price,
          location, description, specs, features, photos, video_url, featured, status,
          salesman_id, seo_title, seo_description, seo_keywords, created_at, updated_at)
        VALUES (
          1, '2019-azimut-fly-50-miami', '2019 Azimut Fly 50 — La Paloma', 'La Paloma',
          2019, 'Azimut', 'Fly 50', 50, 980000, 'Miami, Florida',
          ${azDesc},
          ${azSpecs}::jsonb, ${azFeatures}::jsonb, ${azPhotos}::jsonb,
          'https://pub-d1d12a43eab2479bb077f5824229a67c.r2.dev/sfx%20.mp4',
          true, 'active', 1,
          '2019 Azimut Fly 50 Flybridge — Miami | $980K',
          '2019 Azimut Fly 50 flybridge for sale in Miami, FL. 50ft, twin Volvo Penta diesels, SeaKeeper, 3 staterooms & flybridge bar. $980,000. Call Liena.',
          '2019 Azimut Fly 50 for sale,flybridge yacht Miami,Azimut flybridge Miami,used Azimut yacht Florida,50ft yacht Miami,luxury yacht for sale Miami',
          ${ts}, ${ts}
        )
      `;

      // ── Fairline Squadron 65 ─────────────────────────────────────────────────
      const flDesc = `An extraordinary opportunity to own the iconic 2013 Fairline Squadron 65 — a masterpiece of British yacht-building now available in Miami Beach. Bring all offers on this magnificent 66-foot motor yacht that redefines luxury afloat.

Sumptuous furnishings and hand-worked cabinetry are hallmarks of the Squadron range. Nowhere is it more elegantly expressed than in the long, wide single-level interior — a testament to the 65's ingenious flat floor design that is normally reserved for much larger yachts. An elegant, beautifully proportioned Squadron awaits you.

The massive flybridge features three distinct social areas: a forward chaise longue and sun pad, aft-facing sunbeds, and a seating/dining area. Powered by twin Caterpillar C18-1150 diesels at 1,150hp each producing 32 knots, equipped with Seakeeper gyroscopic stabilizer, bow and stern thrusters, and a full garage for your tender, this vessel is the complete Miami cruising package.`;

      const flSpecs = JSON.stringify({
        'Length Overall':'66 ft 11 in','Beam':'17 ft 2 in','Hull Material':'Fiberglass',
        'Hull Shape':'Modified Vee','Hull Class':'Motor Yacht','Year':'2013',
        'Fuel Type':'Diesel','Engine 1':'CAT C18-1150 Inboard Diesel',
        'Engine 2':'CAT C18-1150 Inboard Diesel','Engine Hours':'690 hrs each',
        'Total Power':'2,300 hp','Max Speed':'32 knots','Fuel Capacity':'936 gallons',
        'Fresh Water':'305 gallons','Dry Weight':'32,890 kg',
        'Stabilizer':'Seakeeper Gyroscopic','Condition':'Used',
      });
      const flFeatures = JSON.stringify({
        'Electronics':['Garmin navigation system','Autopilot','GPS & chartplotter','Radar & radar detector','VHF radio','Depth sounder','Wi-Fi aboard','Flat screen TVs','Cockpit speakers','Navigation center'],
        'Interior Equipment':['Full air conditioning','Seakeeper gyroscopic stabilizer','Bow thruster','Stern thruster','Dishwasher','Washing machine','Fresh water maker','Electric bilge pump','Microwave oven & full oven','Refrigerator','Hot water system','Battery charger','Marine heads (electric)'],
        'Exterior & Deck':['Teak cockpit','Teak sidedecks','Hydraulic hi-lo bathing platform','Hydraulic gangway','Cockpit table & cushions','Cockpit shower','Davit(s)','Fin stabilizers','Swimming ladder','Underwater lights','Walk-around deck','Bimini top'],
        'Tender & Toys':['Full garage for tender','Yamaha WaveRunner jet ski','Davits for tender launch','Outboard engine brackets'],
        'Electrical & Safety':['Generator','Inverter','Shore power inlet','Liferaft','Fire suppression system','Solar panel'],
      });
      const flPhotos = JSON.stringify([
        '/listings/fairline-squadron-65/photo_02.jpeg','/listings/fairline-squadron-65/photo_07.jpeg',
        '/listings/fairline-squadron-65/photo_08.jpeg','/listings/fairline-squadron-65/photo_09.jpeg',
        '/listings/fairline-squadron-65/photo_10.jpeg','/listings/fairline-squadron-65/photo_11.jpeg',
        '/listings/fairline-squadron-65/photo_12.jpeg','/listings/fairline-squadron-65/photo_13.jpeg',
        '/listings/fairline-squadron-65/photo_14.jpeg','/listings/fairline-squadron-65/photo_15.jpeg',
        '/listings/fairline-squadron-65/photo_16.jpeg','/listings/fairline-squadron-65/photo_17.jpeg',
        '/listings/fairline-squadron-65/photo_18.jpeg','/listings/fairline-squadron-65/photo_19.jpeg',
        '/listings/fairline-squadron-65/photo_20.jpeg','/listings/fairline-squadron-65/photo_21.jpeg',
        '/listings/fairline-squadron-65/photo_22.jpeg','/listings/fairline-squadron-65/photo_23.jpeg',
        '/listings/fairline-squadron-65/photo_24.jpeg',
      ]);

      await sql`
        INSERT INTO listings (id, slug, title, vessel_name, year, make, model, length_ft, price,
          location, description, specs, features, photos, video_url, featured, status,
          salesman_id, seo_title, seo_description, seo_keywords, created_at, updated_at)
        VALUES (
          2, '2013-fairline-squadron-65-miami-beach', '2013 Fairline Squadron 65', NULL,
          2013, 'Fairline', 'Squadron 65', 66, 1300000, 'Miami, Florida',
          ${flDesc},
          ${flSpecs}::jsonb, ${flFeatures}::jsonb, ${flPhotos}::jsonb,
          'https://pub-d1d12a43eab2479bb077f5824229a67c.r2.dev/Final%20Fairline.mp4',
          true, 'active', 1,
          '2013 Fairline Squadron 65 Motor Yacht — Miami',
          '2013 Fairline Squadron 65 for sale in Miami. 66ft motor yacht, twin CAT 1,150hp, Seakeeper, garage & jet ski. $1,300,000. Call Liena Q Perez.',
          '2013 Fairline Squadron 65 for sale,motor yacht Miami Florida,Fairline Squadron 65 Miami,used motor yacht Miami,66ft motor yacht for sale,luxury motor yacht Miami',
          ${ts}, ${ts}
        )
      `;

      await sql`SELECT setval('listings_id_seq', 2, true)`;
      listingsSeeded = 2;
    }

    // ── Always: insert new listings if they don't exist yet ──────────────────
    const newListingsAdded: string[] = [];

    // Pre-build photo arrays for the 3 new listings
    const mgPhotosArr = Array.from({ length: 50 }, (_, i) => `/listings/1999-mangusta-80-miami/photo_${String(i + 2).padStart(2, '0')}.jpeg`);
    const nwPhotosArr = Array.from({ length: 23 }, (_, i) => `/listings/2026-nassima-n40-white-fort-lauderdale/photo_${String(i + 2).padStart(2, '0')}.jpeg`);
    const ngPhotosArr = Array.from({ length: 23 }, (_, i) => `/listings/2026-nassima-n40-grey-fort-lauderdale/photo_${String(i + 2).padStart(2, '0')}.jpeg`);

    // ── 1999 Mangusta 80 ─────────────────────────────────────────────────────
    const [{ n: mgCount }] = await sql`SELECT COUNT(*)::int AS n FROM listings WHERE slug = '1999-mangusta-80-miami'`;
    if (Number(mgCount) === 0) {
      const mgDesc = `Refit: Engine, Upholstery, Interior, all hydraulic system — October 2025.

Stunning 1999 Mangusta 80 — a timeless Italian express cruiser combining sleek design with raw, surface-drive performance. With her elegant lines and striking profile, this Mangusta 80 turns heads in every port.

Elegant Accommodations: The interior features classic Italian styling with rich wood finishes and luxurious fabrics. Accommodating up to 8 guests across 4 staterooms — a sumptuous master suite, a VIP stateroom, and two twin cabins, all with en-suite facilities. The spacious salon offers ample seating, a dining area, and a full entertainment system.

Exceptional Performance: Powered by twin MTU engines producing 2,000 hp each via surface drives, this Mangusta 80 delivers a top speed of 40 knots and a cruising speed of 30 knots. The deep-V hull provides a smooth, stable ride even at high speed.

Outdoor Lifestyle: The aft deck features a large sunpad, dining area, and easy water access via the swim platform. The foredeck offers additional sunpads. The flybridge is equipped with comfortable seating and a second helm station.

Well-maintained and ready to cruise — comprehensive October 2025 refit covering engines, upholstery, interior, and all hydraulic systems.`;

      const mgSpecs = JSON.stringify({
        'LOA': '80 ft', 'Beam': '19 ft 5 in', 'Max Draft': '5 ft 5 in',
        'Hull Material': 'Fiberglass', 'Drive Type': 'Surface Drive', 'Fuel Type': 'Diesel',
        'Engine 1': 'MTU — 2,000 hp', 'Engine 2': 'MTU — 2,000 hp',
        'Engine Hours': '1,760 hrs each', 'Top Speed': '40 kn', 'Cruising Speed': '30 kn',
        'Fuel Capacity': '1,587 gal', 'Water Capacity': '344 gal',
        'Guest Cabins': '4', 'Crew Cabins': '1', 'Guest Heads': '4', 'Crew Heads': '1',
        'Class': 'Express Cruiser', 'Condition': 'Used — Refit Oct 2025',
      });
      const mgFeatures = JSON.stringify({
        'Electronics': ['Autopilot', 'Radar', 'GPS', 'Chartplotter', 'VHF Radio', 'Depthsounder', 'Compass', 'Wi-Fi', 'Computer', 'Flat Screen TV', 'Cockpit Speakers'],
        'Interior': ['Air Conditioning throughout', 'Heating', 'Hot Water', 'Fresh Water Maker', 'Refrigerator', 'Deep Freezer', 'Dishwasher', 'Microwave Oven', 'Oven', 'Marine Head', 'Electric Bilge Pump', 'Bow Thruster'],
        'Deck & Exterior': ['Teak Cockpit', 'Cockpit Cushions', 'Hydraulic Gangway', 'Swimming Ladder', 'Gyroscopic Stabilizer', 'Tender', 'Wind Generator', 'Bimini Top', 'Hard Top'],
        'Additional': ['Garage (tender storage)', 'Underwater Lights', 'Wine Cellar'],
      });

      await sql`
        INSERT INTO listings (slug, title, vessel_name, year, make, model, length_ft, price,
          location, description, specs, features, photos, video_url, featured, status,
          salesman_id, seo_title, seo_description, seo_keywords)
        VALUES (
          '1999-mangusta-80-miami', '1999 Mangusta 80', ${null},
          1999, 'Mangusta', '80', 80, 699000, 'Miami, Florida',
          ${mgDesc},
          ${mgSpecs}::jsonb, ${mgFeatures}::jsonb, ${JSON.stringify(mgPhotosArr)}::jsonb,
          ${'/videos/mangusta-80.mp4'},
          true, 'active', ${null},
          '1999 Mangusta 80 Express Cruiser Miami | $699K',
          '1999 Mangusta 80 for sale in Miami. 80ft Italian express cruiser, twin MTU 2,000hp, surface drives, full refit Oct 2025. $699,000. Call Liena.',
          'Mangusta 80 for sale,Mangusta 80 Miami,express cruiser Miami Florida,Italian express cruiser for sale,80ft yacht Miami,used yacht for sale Miami'
        )
      `;
      newListingsAdded.push('1999 Mangusta 80');
    }

    // ── 2026 Nassima N40 White ───────────────────────────────────────────────
    const [{ n: nwCount }] = await sql`SELECT COUNT(*)::int AS n FROM listings WHERE slug = '2026-nassima-n40-white-fort-lauderdale'`;
    if (Number(nwCount) === 0) {
      const nwDesc = `The 2026 Nassima Yacht N40 is a stunning example of Italian craftsmanship and modern luxury — a brand-new vessel available in white from stock in Miami.

At 40 feet, this top-of-the-line cruiser is designed to provide the ultimate in comfort and style. Powered by twin 2023 Mercury Verado V10 outboards producing 400 hp each, the N40 delivers a top speed of 45 knots and a cruising speed of 30 knots — while keeping the motors sleekly hidden beneath the aft sun bed.

Exceptional Design: The spacious cabin features memory foam mattresses, 22" TV, dual fridge, electric stove, and full head with shower — perfect for overnight stays. The automatic handling sofas expand the cockpit configuration, and the automatic aft sun bed opens to access the engines seamlessly.

Italian Craftsmanship: Garmin touch home automation (EmpireBUS), Fusion sound system with 4 exterior speakers, 2 interior speakers, subwoofer and amplifier, teak cockpit and sidedecks, bow thruster, anchor winch — every detail considered. Available in Miami for immediate delivery.`;

      const nwSpecs = JSON.stringify({
        'LOA': '39 ft 7 in', 'Beam': '12 ft 6 in', 'Dry Weight': '17,000 lb',
        'Hull Material': 'Fiberglass', 'Hull Shape': 'Deep Vee', 'Fuel Type': 'Gas / Petrol',
        'Engine 1': '2023 Mercury Verado V10 — 400 hp', 'Engine 2': '2023 Mercury Verado V10 — 400 hp',
        'Engine Type': 'Outboard', 'Max Speed': '45 kn', 'Cruising Speed': '30 kn',
        'Range': '130 nmi', 'Fuel Capacity': '2 × 100 gal', 'Water Capacity': '60 gal',
        'Guest Cabins': '1', 'Guest Heads': '2', 'Seating Capacity': '12',
        'Class': 'Cruiser', 'Condition': 'New — 2026',
      });
      const nwFeatures = JSON.stringify({
        'Navigation & Helm': ['Double Garmin 12" touchscreens', 'Garmin EmpireBUS home automation', 'Secondary navigation GPS', 'Compass', 'VHF Radio', 'Radar', 'Depthsounder', '4 USB outlets', 'Ergonomic driving seats'],
        'Interior & Comfort': ['Air conditioning (6,000 BTU each unit)', 'Dual refrigerator', 'Electric stove with Corian chopping board', 'Sink', 'Memory foam mattresses', '22" TV', 'Water heater (16 gal)', 'Automatic WC', 'Head with shower', 'Shower system', 'Electric panel in cabin'],
        'Audio & Entertainment': ['Fusion sound system', '4 exterior cockpit speakers', '2 interior speakers', 'Subwoofer', 'Amplifier'],
        'Deck & Exterior': ['Teak cockpit', 'Teak sidedecks', 'Cockpit cushions', 'Cockpit shower (hot/cold)', 'Cockpit table (automatic)', 'Automatic handling sofas', 'Automatic aft sun bed', 'Swimming ladder', 'Hard top with LED lighting', 'Underwater lights', 'Walk around'],
        'Anchoring & Docking': ['Anchor in stainless steel', 'Stainless steel chain', 'Anchor rinsing system', 'Anchor winch Lewmar 1,000W', 'Wired windlass control', 'Bow shower', 'Bow thruster Lewmar', 'Lewmar hatch'],
        'Electrical & Mechanical': ['Generator', 'Inverter', 'Shore power inlet', 'Battery charger', 'Electric bilge pump', 'Manual bilge pump', 'Electric head', 'Touch screen controls', 'Launching trailer included'],
      });

      await sql`
        INSERT INTO listings (slug, title, vessel_name, year, make, model, length_ft, price,
          location, description, specs, features, photos, video_url, featured, status,
          salesman_id, seo_title, seo_description, seo_keywords)
        VALUES (
          '2026-nassima-n40-white-fort-lauderdale', '2026 Nassima Yacht N40 — White', ${null},
          2026, 'Nassima Yacht', 'N40', 40, 799000, 'Miami, Florida',
          ${nwDesc},
          ${nwSpecs}::jsonb, ${nwFeatures}::jsonb, ${JSON.stringify(nwPhotosArr)}::jsonb,
          ${'/videos/nassima-n40-white.mp4'},
          true, 'active', ${null},
          '2026 Nassima N40 White — New Cruiser Miami | $799K',
          'New 2026 Nassima N40 White for sale in Miami. 40ft Italian cruiser, twin Mercury Verado 400hp, 45 knots. $799,000. Contact Liena Q Perez.',
          '2026 Nassima N40 for sale,Nassima N40 White Miami,new boat for sale Miami Florida,new Italian cruiser Miami,40ft cruiser Miami,yacht for sale Miami'
        )
      `;
      newListingsAdded.push('2026 Nassima N40 White');
    }

    // ── 2026 Nassima N40 Grey ────────────────────────────────────────────────
    const [{ n: ngCount }] = await sql`SELECT COUNT(*)::int AS n FROM listings WHERE slug = '2026-nassima-n40-grey-fort-lauderdale'`;
    if (Number(ngCount) === 0) {
      const ngDesc = `The 2026 Nassima Yacht N40 in grey is a stunning example of Italian craftsmanship and modern luxury — a brand-new vessel available from stock in Miami.

At 40 feet, this top-of-the-line cruiser delivers the ultimate in comfort and style. Powered by twin 2023 Mercury Verado V10 outboards producing 400 hp each, the N40 hits a top speed of 45 knots and a cruising speed of 30 knots — while keeping the motors hidden beneath the aft sun bed for a clean, uninterrupted silhouette.

The grey colorway gives this N40 a bold, contemporary look that stands apart from the crowd. Every surface, every line, every finish has been considered — this is not a production boat built to a price point. It is an Italian-designed luxury vessel built to a standard.

The spacious cabin features memory foam mattresses, 22" TV, dual fridge, electric stove, and a full head with shower. The automatic handling sofas expand the cockpit, and the automatic aft sun bed opens seamlessly to access the engines.

Garmin touch home automation (EmpireBUS), Fusion sound system, teak cockpit and sidedecks, bow thruster, and anchor winch. Available in Miami for immediate delivery.`;

      const ngSpecs = JSON.stringify({
        'LOA': '39 ft 7 in', 'Beam': '12 ft 6 in', 'Dry Weight': '17,000 lb',
        'Hull Material': 'Fiberglass', 'Hull Shape': 'Deep Vee', 'Hull Color': 'Grey',
        'Fuel Type': 'Gas / Petrol',
        'Engine 1': '2023 Mercury Verado V10 — 400 hp', 'Engine 2': '2023 Mercury Verado V10 — 400 hp',
        'Engine Type': 'Outboard', 'Max Speed': '45 kn', 'Cruising Speed': '30 kn',
        'Range': '130 nmi', 'Fuel Capacity': '2 × 100 gal', 'Water Capacity': '60 gal',
        'Guest Cabins': '1', 'Guest Heads': '2', 'Seating Capacity': '12',
        'Class': 'Cruiser', 'Condition': 'New — 2026',
      });
      const ngFeatures = JSON.stringify({
        'Navigation & Helm': ['Double Garmin 12" touchscreens', 'Garmin EmpireBUS home automation', 'Secondary navigation GPS', 'Compass', 'VHF Radio', 'Radar', 'Depthsounder', '4 USB outlets', 'Ergonomic driving seats'],
        'Interior & Comfort': ['Air conditioning (6,000 BTU each unit)', 'Dual refrigerator', 'Electric stove with Corian chopping board', 'Sink', 'Memory foam mattresses', '22" TV', 'Water heater (16 gal)', 'Automatic WC', 'Head with shower', 'Shower system', 'Electric panel in cabin'],
        'Audio & Entertainment': ['Fusion sound system', '4 exterior cockpit speakers', '2 interior speakers', 'Subwoofer', 'Amplifier'],
        'Deck & Exterior': ['Teak cockpit', 'Teak sidedecks', 'Cockpit cushions', 'Cockpit shower (hot/cold)', 'Cockpit table (automatic)', 'Automatic handling sofas', 'Automatic aft sun bed', 'Swimming ladder', 'Hard top with LED lighting', 'Underwater lights', 'Walk around'],
        'Anchoring & Docking': ['Anchor in stainless steel', 'Stainless steel chain', 'Anchor rinsing system', 'Anchor winch Lewmar 1,000W', 'Wired windlass control', 'Bow shower', 'Bow thruster Lewmar', 'Lewmar hatch'],
        'Electrical & Mechanical': ['Generator', 'Inverter', 'Shore power inlet', 'Battery charger', 'Electric bilge pump', 'Manual bilge pump', 'Electric head', 'Touch screen controls', 'Launching trailer included'],
      });

      await sql`
        INSERT INTO listings (slug, title, vessel_name, year, make, model, length_ft, price,
          location, description, specs, features, photos, video_url, featured, status,
          salesman_id, seo_title, seo_description, seo_keywords)
        VALUES (
          '2026-nassima-n40-grey-fort-lauderdale', '2026 Nassima Yacht N40 — Grey', ${null},
          2026, 'Nassima Yacht', 'N40', 40, 799000, 'Miami, Florida',
          ${ngDesc},
          ${ngSpecs}::jsonb, ${ngFeatures}::jsonb, ${JSON.stringify(ngPhotosArr)}::jsonb,
          ${'/videos/nassima-n40-grey.mp4'},
          true, 'active', ${null},
          '2026 Nassima N40 Grey — New Cruiser Miami | $799K',
          'New 2026 Nassima N40 Grey for sale in Miami. 40ft Italian cruiser, twin Mercury Verado 400hp, 45 knots. $799,000. Contact Liena Q Perez.',
          '2026 Nassima N40 grey for sale,Nassima N40 Grey Miami,new boat for sale Miami Florida,new Italian cruiser Miami,40ft cruiser Miami,yacht for sale Miami'
        )
      `;
      newListingsAdded.push('2026 Nassima N40 Grey');
    }

    // ── Data corrections: fix stale location / video_url ────────────────────
    // All listings: location is Miami, Florida
    await sql`
      UPDATE listings
      SET location = 'Miami, Florida', updated_at = NOW()
      WHERE location != 'Miami, Florida'
    `;
    await sql`
      UPDATE listings
      SET video_url = '/videos/mangusta-80.mp4', updated_at = NOW()
      WHERE slug = '1999-mangusta-80-miami'
        AND (video_url IS NULL OR video_url NOT LIKE '%mangusta%')
    `;
    await sql`
      UPDATE listings
      SET video_url = '/videos/nassima-n40-white.mp4', updated_at = NOW()
      WHERE slug = '2026-nassima-n40-white-fort-lauderdale'
        AND (video_url IS NULL OR video_url NOT LIKE '%nassima-n40-white%')
    `;
    await sql`
      UPDATE listings
      SET video_url = '/videos/nassima-n40-grey.mp4', updated_at = NOW()
      WHERE slug = '2026-nassima-n40-grey-fort-lauderdale'
        AND (video_url IS NULL OR video_url NOT LIKE '%nassima-n40-grey%')
    `;
    const mgPhotos = JSON.stringify(
      Array.from({ length: 50 }, (_, i) => `/listings/1999-mangusta-80-miami/photo_${String(i + 2).padStart(2, '0')}.jpeg`)
    );
    const nwPhotos = JSON.stringify(
      Array.from({ length: 23 }, (_, i) => `/listings/2026-nassima-n40-white-fort-lauderdale/photo_${String(i + 2).padStart(2, '0')}.jpeg`)
    );
    const ngPhotos = JSON.stringify(
      Array.from({ length: 23 }, (_, i) => `/listings/2026-nassima-n40-grey-fort-lauderdale/photo_${String(i + 2).padStart(2, '0')}.jpeg`)
    );
    await sql`
      UPDATE listings SET photos = ${mgPhotos}::jsonb, updated_at = NOW()
      WHERE slug = '1999-mangusta-80-miami'
        AND (photos = '[]'::jsonb OR jsonb_array_length(photos) = 0)
    `;
    await sql`
      UPDATE listings SET photos = ${nwPhotos}::jsonb, updated_at = NOW()
      WHERE slug = '2026-nassima-n40-white-fort-lauderdale'
        AND (photos = '[]'::jsonb OR jsonb_array_length(photos) = 0)
    `;
    await sql`
      UPDATE listings SET photos = ${ngPhotos}::jsonb, updated_at = NOW()
      WHERE slug = '2026-nassima-n40-grey-fort-lauderdale'
        AND (photos = '[]'::jsonb OR jsonb_array_length(photos) = 0)
    `;

    return NextResponse.json({
      success: true,
      message: 'Database ready',
      adminsSeeded,
      listingsSeeded,
      newListingsAdded,
    });
  } catch (err) {
    console.error('[Seed]', err);
    return NextResponse.json(
      { error: 'Seed failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
