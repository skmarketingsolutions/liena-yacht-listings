/**
 * Next.js instrumentation hook — runs once on every server startup / deployment.
 * Automatically inserts new listings into the DB if they don't already exist.
 * Zero manual steps required when new listings are added this way.
 */

export async function register() {
  // Only run in Node.js runtime (not Edge), and only when DB is configured
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (!process.env.DATABASE_URL) return;

  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);

    // Ensure tables exist first (safe — IF NOT EXISTS)
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

    type Row = Record<string, unknown>;

    // ── 1999 Mangusta 80 ──────────────────────────────────────────────────────
    const mgCheck = await sql`SELECT id FROM listings WHERE slug = '1999-mangusta-80-miami' LIMIT 1` as Row[];
    if (mgCheck.length === 0) {
      const mgDesc = `Refit: Engine, Upholstery, Interior, all hydraulic system — October 2025.

Stunning 1999 Mangusta 80 — a timeless Italian express cruiser combining sleek design with raw, surface-drive performance. With her elegant lines and striking profile, this Mangusta 80 turns heads in every port.

Elegant Accommodations: The interior features classic Italian styling with rich wood finishes and luxurious fabrics. Accommodating up to 8 guests across 4 staterooms — a sumptuous master suite, a VIP stateroom, and two twin cabins, all with en-suite facilities. The spacious salon offers ample seating, a dining area, and a full entertainment system.

Exceptional Performance: Powered by twin MTU engines producing 2,000 hp each via surface drives, this Mangusta 80 delivers a top speed of 40 knots and a cruising speed of 30 knots. The deep-V hull provides a smooth, stable ride even at high speed.

Outdoor Lifestyle: The aft deck features a large sunpad, dining area, and easy water access via the swim platform. The foredeck offers additional sunpads. The flybridge is equipped with comfortable seating and a second helm station.

Well-maintained and ready to cruise — comprehensive October 2025 refit covering engines, upholstery, interior, and all hydraulic systems.`;

      await sql`
        INSERT INTO listings (slug, title, vessel_name, year, make, model, length_ft, price,
          location, description, specs, features, photos, video_url, featured, status,
          salesman_id, seo_title, seo_description, seo_keywords)
        VALUES (
          '1999-mangusta-80-miami', '1999 Mangusta 80', ${null},
          1999, 'Mangusta', '80', 80, 699000, 'Miami, Florida', ${mgDesc},
          ${JSON.stringify({
            'LOA': '80 ft', 'Beam': '19 ft 5 in', 'Max Draft': '5 ft 5 in',
            'Hull Material': 'Fiberglass', 'Drive Type': 'Surface Drive', 'Fuel Type': 'Diesel',
            'Engine 1': 'MTU — 2,000 hp', 'Engine 2': 'MTU — 2,000 hp',
            'Engine Hours': '1,760 hrs each', 'Top Speed': '40 kn', 'Cruising Speed': '30 kn',
            'Fuel Capacity': '1,587 gal', 'Water Capacity': '344 gal',
            'Guest Cabins': '4', 'Crew Cabins': '1', 'Guest Heads': '4', 'Crew Heads': '1',
            'Class': 'Express Cruiser', 'Condition': 'Used — Refit Oct 2025',
          })}::jsonb,
          ${JSON.stringify({
            'Electronics': ['Autopilot', 'Radar', 'GPS', 'Chartplotter', 'VHF Radio', 'Depthsounder', 'Compass', 'Wi-Fi', 'Computer', 'Flat Screen TV', 'Cockpit Speakers'],
            'Interior': ['Air Conditioning throughout', 'Heating', 'Hot Water', 'Fresh Water Maker', 'Refrigerator', 'Deep Freezer', 'Dishwasher', 'Microwave Oven', 'Oven', 'Marine Head', 'Electric Bilge Pump', 'Bow Thruster'],
            'Deck & Exterior': ['Teak Cockpit', 'Cockpit Cushions', 'Hydraulic Gangway', 'Swimming Ladder', 'Gyroscopic Stabilizer', 'Tender', 'Wind Generator', 'Bimini Top', 'Hard Top'],
            'Additional': ['Garage (tender storage)', 'Underwater Lights', 'Wine Cellar'],
          })}::jsonb,
          '[]'::jsonb,
          '/videos/mangusta-80.mp4',
          true, 'active', ${null},
          '1999 Mangusta 80 For Sale Miami | $699,000 | Liena Q Perez',
          '1999 Mangusta 80 for sale in Miami, FL. 80ft Italian express cruiser, twin MTU 2,000hp surface drives, comprehensive refit Oct 2025. Asking $699,000. Call 786-838-9911.',
          '1999 Mangusta 80 for sale,Mangusta 80 Miami,express cruiser Miami,Italian yacht Miami,used yacht for sale Florida'
        )
      `;
      console.log('[instrumentation] Inserted: 1999 Mangusta 80');
    }

    // ── 2026 Nassima N40 White ────────────────────────────────────────────────
    const nwCheck = await sql`SELECT id FROM listings WHERE slug = '2026-nassima-n40-white-fort-lauderdale' LIMIT 1` as Row[];
    if (nwCheck.length === 0) {
      const nwDesc = `The 2026 Nassima Yacht N40 is a stunning example of Italian craftsmanship and modern luxury — a brand-new vessel available in white from stock in Fort Lauderdale.

At 40 feet, this top-of-the-line cruiser is designed to provide the ultimate in comfort and style. Powered by twin 2023 Mercury Verado V10 outboards producing 400 hp each, the N40 delivers a top speed of 45 knots and a cruising speed of 30 knots — while keeping the motors sleekly hidden beneath the aft sun bed.

Exceptional Design: The spacious cabin features memory foam mattresses, 22" TV, dual fridge, electric stove, and full head with shower — perfect for overnight stays. The automatic handling sofas expand the cockpit configuration, and the automatic aft sun bed opens to access the engines seamlessly.

Italian Craftsmanship: Garmin touch home automation (EmpireBUS), Fusion sound system with 4 exterior speakers, 2 interior speakers, subwoofer and amplifier, teak cockpit and sidedecks, bow thruster, anchor winch. Available in Fort Lauderdale stock for immediate delivery.`;

      const nassFeatures = JSON.stringify({
        'Navigation & Helm': ['Double Garmin 12" touchscreens', 'Garmin EmpireBUS home automation', 'Secondary navigation GPS', 'Compass', 'VHF Radio', 'Radar', 'Depthsounder', '4 USB outlets', 'Ergonomic driving seats'],
        'Interior & Comfort': ['Air conditioning (6,000 BTU each unit)', 'Dual refrigerator', 'Electric stove with Corian chopping board', 'Sink', 'Memory foam mattresses', '22" TV', 'Water heater (16 gal)', 'Automatic WC', 'Head with shower', 'Shower system', 'Electric panel in cabin'],
        'Audio & Entertainment': ['Fusion sound system', '4 exterior cockpit speakers', '2 interior speakers', 'Subwoofer', 'Amplifier'],
        'Deck & Exterior': ['Teak cockpit', 'Teak sidedecks', 'Cockpit cushions', 'Cockpit shower (hot/cold)', 'Cockpit table (automatic)', 'Automatic handling sofas', 'Automatic aft sun bed', 'Swimming ladder', 'Hard top with LED lighting', 'Underwater lights', 'Walk around'],
        'Anchoring & Docking': ['Anchor in stainless steel', 'Stainless steel chain', 'Anchor rinsing system', 'Anchor winch Lewmar 1,000W', 'Wired windlass control', 'Bow shower', 'Bow thruster Lewmar', 'Lewmar hatch'],
        'Electrical & Mechanical': ['Generator', 'Inverter', 'Shore power inlet', 'Battery charger', 'Electric bilge pump', 'Manual bilge pump', 'Electric head', 'Touch screen controls', 'Launching trailer included'],
      });
      const nassSpecs = JSON.stringify({
        'LOA': '39 ft 7 in', 'Beam': '12 ft 6 in', 'Dry Weight': '17,000 lb',
        'Hull Material': 'Fiberglass', 'Hull Shape': 'Deep Vee', 'Fuel Type': 'Gas / Petrol',
        'Engine 1': '2023 Mercury Verado V10 — 400 hp', 'Engine 2': '2023 Mercury Verado V10 — 400 hp',
        'Engine Type': 'Outboard', 'Max Speed': '45 kn', 'Cruising Speed': '30 kn',
        'Range': '130 nmi', 'Fuel Capacity': '2 × 100 gal', 'Water Capacity': '60 gal',
        'Guest Cabins': '1', 'Guest Heads': '2', 'Seating Capacity': '12',
        'Class': 'Cruiser', 'Condition': 'New — 2026',
      });

      await sql`
        INSERT INTO listings (slug, title, vessel_name, year, make, model, length_ft, price,
          location, description, specs, features, photos, video_url, featured, status,
          salesman_id, seo_title, seo_description, seo_keywords)
        VALUES (
          '2026-nassima-n40-white-fort-lauderdale', '2026 Nassima Yacht N40 — White', ${null},
          2026, 'Nassima Yacht', 'N40', 40, 799000, 'Fort Lauderdale, Florida', ${nwDesc},
          ${nassSpecs}::jsonb, ${nassFeatures}::jsonb, '[]'::jsonb,
          '/videos/nassima-n40-white.mp4',
          true, 'active', ${null},
          '2026 Nassima Yacht N40 White For Sale Fort Lauderdale | $799,000',
          '2026 Nassima Yacht N40 (White) — new Italian luxury cruiser, 40ft, twin Mercury Verado 400hp, 45 knots, Fort Lauderdale. Asking $799,000. Contact Liena Q Perez — 786-838-9911.',
          '2026 Nassima N40 for sale,Nassima Yacht N40 white,luxury cruiser Fort Lauderdale,new yacht Florida,Italian boat for sale Miami'
        )
      `;
      console.log('[instrumentation] Inserted: 2026 Nassima N40 White');
    }

    // ── 2026 Nassima N40 Grey ─────────────────────────────────────────────────
    const ngCheck = await sql`SELECT id FROM listings WHERE slug = '2026-nassima-n40-grey-fort-lauderdale' LIMIT 1` as Row[];
    if (ngCheck.length === 0) {
      const ngDesc = `The 2026 Nassima Yacht N40 in grey is a stunning example of Italian craftsmanship and modern luxury — a brand-new vessel available from stock in Fort Lauderdale.

At 40 feet, this top-of-the-line cruiser delivers the ultimate in comfort and style. Powered by twin 2023 Mercury Verado V10 outboards producing 400 hp each, the N40 hits a top speed of 45 knots and a cruising speed of 30 knots — while keeping the motors hidden beneath the aft sun bed for a clean, uninterrupted silhouette.

The grey colorway gives this N40 a bold, contemporary look that stands apart. Every surface, every line, every finish has been considered — this is not a production boat built to a price point. It is an Italian-designed luxury vessel built to a standard.

The spacious cabin features memory foam mattresses, 22" TV, dual fridge, electric stove, and a full head with shower. The automatic handling sofas expand the cockpit, and the automatic aft sun bed opens seamlessly to access the engines.

Garmin touch home automation (EmpireBUS), Fusion sound system, teak cockpit and sidedecks, bow thruster, anchor winch. Available in Fort Lauderdale stock for immediate delivery.`;

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
          2026, 'Nassima Yacht', 'N40', 40, 799000, 'Fort Lauderdale, Florida', ${ngDesc},
          ${ngSpecs}::jsonb, ${ngFeatures}::jsonb, '[]'::jsonb,
          '/videos/nassima-n40-grey.mp4',
          true, 'active', ${null},
          '2026 Nassima Yacht N40 Grey For Sale Fort Lauderdale | $799,000',
          '2026 Nassima Yacht N40 (Grey) — new Italian luxury cruiser, 40ft, twin Mercury Verado 400hp, 45 knots, Fort Lauderdale. Asking $799,000. Contact Liena Q Perez — 786-838-9911.',
          '2026 Nassima N40 grey for sale,Nassima Yacht N40,luxury cruiser Fort Lauderdale,new yacht Florida,Italian boat for sale Miami'
        )
      `;
      console.log('[instrumentation] Inserted: 2026 Nassima N40 Grey');
    }

    // ── Data corrections: fix any wrong location / video_url in DB ────────────
    // Runs on every startup — safe because queries are idempotent (WHERE guards).

    // All listings: location is Miami, Florida regardless of PDF origin
    await sql`
      UPDATE listings
      SET location = 'Miami, Florida', updated_at = NOW()
      WHERE location != 'Miami, Florida'
    `;

    // Ensure correct video URLs for the 3 new listings
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

    // Set photos arrays for the 3 new listings (extracted from PDFs)
    // photo_01 is the 494×158 header banner — real gallery starts at photo_02
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
      UPDATE listings
      SET photos = ${mgPhotos}::jsonb, updated_at = NOW()
      WHERE slug = '1999-mangusta-80-miami'
        AND (photos = '[]'::jsonb OR jsonb_array_length(photos) = 0)
    `;
    await sql`
      UPDATE listings
      SET photos = ${nwPhotos}::jsonb, updated_at = NOW()
      WHERE slug = '2026-nassima-n40-white-fort-lauderdale'
        AND (photos = '[]'::jsonb OR jsonb_array_length(photos) = 0)
    `;
    await sql`
      UPDATE listings
      SET photos = ${ngPhotos}::jsonb, updated_at = NOW()
      WHERE slug = '2026-nassima-n40-grey-fort-lauderdale'
        AND (photos = '[]'::jsonb OR jsonb_array_length(photos) = 0)
    `;

    console.log('[instrumentation] Data corrections applied');

  } catch (err) {
    // Never crash the server — just log
    console.error('[instrumentation] Auto-seed error:', err);
  }
}
