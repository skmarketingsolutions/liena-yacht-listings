/**
 * SEO configuration: locations, modifiers, content context.
 * This is the single source of truth for programmatic page generation.
 * Adding a new listing to the DB automatically generates pages for all
 * location × modifier combinations defined here — zero manual work.
 */

export interface LocationConfig {
  slug: string;
  name: string;
  fullName: string;
  marketContext: string;
  waterways: string;
  marinas: string;
  buyerProfile: string;
  boatShow: string | null;
  nearbyMarkets: string;
}

export interface ModifierConfig {
  slug: string;
  label: string;
  intent: 'purchase' | 'research' | 'premium';
  h1Prefix: string;
  valueAngle: string;
}

export const LOCATIONS: LocationConfig[] = [
  {
    slug: 'miami',
    name: 'Miami',
    fullName: 'Miami, Florida',
    marketContext:
      "Miami is the undisputed epicenter of luxury yacht sales in the United States. With year-round warm weather, direct access to the Bahamas, Caribbean, and Florida Keys, and one of the world's most active yacht brokerage markets, Miami attracts serious buyers from across the globe.",
    waterways: 'Biscayne Bay, the Miami River, and the Atlantic Ocean',
    marinas: 'Coconut Grove Marina, Bayside Marina, Miami Beach Marina, and Island Gardens',
    buyerProfile:
      'international buyers, South American investors, and domestic luxury buyers seeking a permanent South Florida base',
    boatShow: 'Miami International Boat Show',
    nearbyMarkets: 'Miami Beach, Coral Gables, Brickell, and Coconut Grove',
  },
  {
    slug: 'fort-lauderdale',
    name: 'Fort Lauderdale',
    fullName: 'Fort Lauderdale, Florida',
    marketContext:
      "Fort Lauderdale is widely known as the Yachting Capital of the World — home to the Fort Lauderdale International Boat Show, the world's largest in-water boat show. With over 300 miles of inland waterways, more than 100 marinas, and a thriving brokerage community, Fort Lauderdale is where serious yacht transactions happen.",
    waterways: 'the New River, Intracoastal Waterway, Port Everglades, and the Atlantic',
    marinas:
      'Bahia Mar Yachting Center, Pier 66 Marina, Las Olas Marina, and Lauderdale Marine Center',
    buyerProfile:
      'experienced yacht owners, charter operators, and professional crew seeking turnkey vessels',
    boatShow: 'Fort Lauderdale International Boat Show',
    nearbyMarkets: 'Pompano Beach, Hollywood, Hallandale Beach, and Dania Beach',
  },
  {
    slug: 'west-palm-beach',
    name: 'West Palm Beach',
    fullName: 'West Palm Beach, Florida',
    marketContext:
      "West Palm Beach and the Palm Beaches represent one of Florida's most affluent waterfront communities. The Intracoastal Waterway runs the length of Palm Beach County, offering pristine cruising grounds and easy access to offshore fishing and the Bahamas. Buyers here typically seek vessels that complement an established waterfront lifestyle.",
    waterways: 'the Intracoastal Waterway, Lake Worth Lagoon, and the Atlantic Ocean',
    marinas: 'Rybovich Marina, Sailfish Marina, Old Port Cove, and Palm Beach Yacht Center',
    buyerProfile:
      'Palm Beach County residents, seasonal snowbirds, and buyers seeking a refined waterfront lifestyle',
    boatShow: 'Palm Beach International Boat Show',
    nearbyMarkets: 'Palm Beach, Lake Worth, Boynton Beach, and Jupiter',
  },
  {
    slug: 'naples',
    name: 'Naples',
    fullName: 'Naples, Florida',
    marketContext:
      "Naples is Florida's Gulf Coast jewel — a community of exceptional wealth and refined taste. The calm, turquoise waters of the Gulf of Mexico provide ideal cruising conditions, and the Naples market skews toward buyers seeking a tranquil alternative to the Atlantic side. Demand for premium vessels is consistently strong year-round.",
    waterways: 'the Gulf of Mexico, Naples Bay, and the Caloosahatchee River',
    marinas: 'Naples City Dock, Port of the Islands Marina, Windstar on Naples Bay, and Compass Rose Marina',
    buyerProfile:
      'Gulf Coast residents, retirees, and buyers seeking premium vessels for gulf cruising and fishing',
    boatShow: null,
    nearbyMarkets: 'Marco Island, Bonita Springs, Estero, and Cape Coral',
  },
  {
    slug: 'boca-raton',
    name: 'Boca Raton',
    fullName: 'Boca Raton, Florida',
    marketContext:
      "Boca Raton sits at the heart of South Florida's Gold Coast — one of the wealthiest zip codes in the nation and home to a sophisticated waterfront community. Easy ICW access, proximity to both Miami and Fort Lauderdale brokerage hubs, and a discerning buyer base make Boca Raton an excellent market for premium yacht acquisition.",
    waterways: 'the Intracoastal Waterway, Lake Boca Raton, and the Atlantic Ocean',
    marinas:
      'Royal Palm Yacht & Country Club, Boca Raton Resort Marina, and Sugar Sand Marina',
    buyerProfile:
      'Gold Coast residents, corporate buyers, and private collectors with established South Florida ties',
    boatShow: null,
    nearbyMarkets: 'Delray Beach, Deerfield Beach, Boynton Beach, and Pompano Beach',
  },
  {
    slug: 'palm-beach',
    name: 'Palm Beach',
    fullName: 'Palm Beach, Florida',
    marketContext:
      "Palm Beach is synonymous with old-money luxury and impeccable taste. The island community's strict aesthetic standards and wealthy buyer base create one of the most exclusive yacht markets in the world. Vessels moored in Palm Beach waters must meet the highest standards — making quality pre-owned inventory especially coveted.",
    waterways: 'Lake Worth Lagoon, the Intracoastal Waterway, and the Atlantic Ocean',
    marinas: 'Palm Beach Yacht Center, Sailfish Marina, and the Palm Beach Town Docks',
    buyerProfile:
      'ultra-high-net-worth individuals, estate managers, and discerning collectors representing Palm Beach estates',
    boatShow: 'Palm Beach International Boat Show',
    nearbyMarkets: 'West Palm Beach, Palm Beach Shores, Lake Worth, and Manalapan',
  },
  {
    slug: 'key-west',
    name: 'Key West',
    fullName: 'Key West, Florida',
    marketContext:
      "Key West is the gateway to the Florida Keys and one of the most unique boating destinations in the world. The surrounding waters — the Gulf of Mexico to the north, the Atlantic to the south — offer world-class fishing, diving, and island-hopping. Buyers seeking vessels for Keys cruising, live-aboard, or charter operations find Key West a natural fit.",
    waterways: 'the Florida Straits, the Gulf of Mexico, and the Florida Bay',
    marinas:
      'Garrison Bight Marina, Key West Bight Marina, Conch Harbor Marina, and A&B Marina',
    buyerProfile:
      'charter operators, live-aboard enthusiasts, and buyers seeking an adventurous Keys and Caribbean-capable vessel',
    boatShow: null,
    nearbyMarkets: 'Marathon, Islamorada, Big Pine Key, and the Florida Keys',
  },
  {
    slug: 'florida',
    name: 'Florida',
    fullName: 'Florida',
    marketContext:
      "Florida is the top yacht market in the United States — home to the most registered boats per capita, the most active brokerage community, and the highest volume of yacht transactions nationwide. With 1,350 miles of coastline, year-round warm weather, and direct access to the Bahamas and Caribbean, Florida is the ultimate state for yacht ownership.",
    waterways:
      'the Atlantic Ocean, the Gulf of Mexico, the Intracoastal Waterway, and hundreds of protected bays and inlets',
    marinas:
      'over 900 marinas and yacht facilities statewide, from Miami to Jacksonville and Pensacola',
    buyerProfile:
      'buyers statewide and relocating owners seeking a permanent Florida-based vessel',
    boatShow: 'Miami International Boat Show and Fort Lauderdale International Boat Show',
    nearbyMarkets: 'Miami, Fort Lauderdale, Palm Beach, Tampa, Jacksonville, and Sarasota',
  },
  {
    slug: 'south-florida',
    name: 'South Florida',
    fullName: 'South Florida',
    marketContext:
      "South Florida — comprising Miami-Dade, Broward, and Palm Beach counties — is the most active yacht market in the Western Hemisphere. The concentration of wealth, the favorable tax environment, and the unmatched boating lifestyle make South Florida the destination of choice for serious yacht buyers. Inventory moves quickly in this market.",
    waterways:
      'Biscayne Bay, the Intracoastal Waterway, the New River, and the Atlantic coastline',
    marinas:
      'hundreds of premier marinas across Miami-Dade, Broward, and Palm Beach counties',
    buyerProfile:
      'domestic and international buyers relocating to or already established in South Florida',
    boatShow: 'Miami International Boat Show and Fort Lauderdale International Boat Show',
    nearbyMarkets: 'Miami, Fort Lauderdale, Boca Raton, West Palm Beach, and the Florida Keys',
  },
  {
    slug: 'southeast-florida',
    name: 'Southeast Florida',
    fullName: 'Southeast Florida',
    marketContext:
      "Southeast Florida's Gold Coast stretches from Miami Beach north through Fort Lauderdale and Boca Raton to Palm Beach — a continuous waterfront community of extraordinary wealth and boating activity. This corridor is home to more yacht brokers, shipyards, and refit facilities than anywhere else in the Americas, making it the ideal location for a seamless yacht purchase.",
    waterways:
      'the Atlantic Ocean, the Intracoastal Waterway, and the interconnected bays and waterways of the Gold Coast',
    marinas:
      "the Gold Coast's network of over 200 marinas from Miami Beach to Palm Beach",
    buyerProfile:
      'established Gold Coast residents, relocating luxury buyers, and international investors with Florida property',
    boatShow: 'Miami International Boat Show and Fort Lauderdale International Boat Show',
    nearbyMarkets:
      'Miami, Miami Beach, Fort Lauderdale, Pompano Beach, Boca Raton, Delray Beach, and Palm Beach',
  },
];

export const MODIFIERS: ModifierConfig[] = [
  {
    slug: 'for-sale',
    label: 'For Sale',
    intent: 'purchase',
    h1Prefix: 'for Sale in',
    valueAngle:
      'This vessel is actively listed and available for immediate showing. Contact Liena Q Perez to schedule a private walkthrough — serious buyers receive priority response within hours.',
  },
  {
    slug: 'pre-owned',
    label: 'Pre-Owned',
    intent: 'purchase',
    h1Prefix: 'Pre-Owned —',
    valueAngle:
      "Pre-owned doesn't mean second-best — it means exceptional value. This vessel has been professionally maintained, is fully surveyed, and represents a significant discount versus comparable new builds. Buying pre-owned in today's market means acquiring more yacht for your investment.",
  },
  {
    slug: 'price',
    label: 'Price & Value',
    intent: 'research',
    h1Prefix: '— Asking Price in',
    valueAngle:
      'Understanding market value is critical before any yacht purchase. The asking price for this vessel reflects current comparable sales, the vessel condition, equipment included, and South Florida market dynamics. Liena Q Perez can provide a full market analysis and guide you through the negotiation process.',
  },
  {
    slug: 'luxury',
    label: 'Luxury',
    intent: 'premium',
    h1Prefix: '— Luxury',
    valueAngle:
      "True luxury isn't just about price — it's about the quality of materials, the attention to detail in the fit and finish, the performance underway, and the lifestyle the vessel enables. This is not a commodity yacht. It's a curated expression of the best the European yacht-building tradition has to offer.",
  },
  {
    slug: 'buy',
    label: 'Buy',
    intent: 'purchase',
    h1Prefix: 'Buy a',
    valueAngle:
      "Ready to buy? The process starts with a conversation. Liena Q Perez walks every buyer through sea trial coordination, independent survey, title search, and closing — handling every detail so you can focus on what matters: taking ownership of the right vessel.",
  },
];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lienayperez.com';

export const BROKER = {
  name: 'Liena Q Perez',
  phone: '786-838-9911',
  phoneHref: 'tel:+17868389911',
  email: 'liena@italiaboats.com',
  title: 'Luxury Yacht Sales Specialist',
  location: 'Miami, Florida',
};

/** Strips known location suffixes/prefixes from a slug to get a base slug for variant URLs. */
export function getBaseSlug(slug: string): string {
  const cities = LOCATIONS.map((l) => l.slug);
  let base = slug;
  for (const city of cities) {
    base = base.replace(new RegExp(`-${city}$`), '');
    base = base.replace(new RegExp(`^${city}-`), '');
  }
  return base;
}

/** Given a city slug, return the LocationConfig (or null). */
export function getLocation(slug: string): LocationConfig | null {
  return LOCATIONS.find((l) => l.slug === slug) ?? null;
}

/** Given a modifier slug, return the ModifierConfig (or null). */
export function getModifier(slug: string): ModifierConfig | null {
  return MODIFIERS.find((m) => m.slug === slug) ?? null;
}
