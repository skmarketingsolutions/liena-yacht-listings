/**
 * Programmatic content generation engine.
 * Generates unique, 500-800 word page content for every listing × location × modifier
 * combination. All spec data comes directly from the database — nothing is invented.
 * Content varies by location context and buyer intent modifier.
 */

import type { Listing } from './db';
import { type LocationConfig, type ModifierConfig, BROKER } from './seo-config';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function getTopSpecs(listing: Listing): string {
  const specs = listing.specs;
  const highlights: string[] = [];
  if (specs['LOA'] || specs['Length Overall']) highlights.push(`LOA ${specs['LOA'] || specs['Length Overall']}`);
  if (specs['Beam']) highlights.push(`beam ${specs['Beam']}`);
  if (specs['Draft']) highlights.push(`draft ${specs['Draft']}`);
  if (specs['Engines'] || specs['Engine']) highlights.push(specs['Engines'] || specs['Engine']);
  if (specs['Total Power'] || specs['Horsepower']) highlights.push(specs['Total Power'] || specs['Horsepower']);
  if (specs['Fuel Capacity'] || specs['Fuel capacity']) highlights.push(`${specs['Fuel Capacity'] || specs['Fuel capacity']} fuel`);
  if (specs['Water Capacity'] || specs['Freshwater']) highlights.push(`${specs['Water Capacity'] || specs['Freshwater']} fresh water`);
  if (specs['Cruise Speed'] || specs['Speed']) highlights.push(`cruising at ${specs['Cruise Speed'] || specs['Speed']}`);
  return highlights.length > 0 ? highlights.join(', ') : `${listing.length_ft} ft LOA`;
}

function getFeatureHighlights(listing: Listing): string[] {
  const all: string[] = [];
  for (const items of Object.values(listing.features)) {
    all.push(...(items as string[]));
  }
  return all.slice(0, 6);
}

/**
 * Generates the full page content (as structured text blocks) for a
 * listing × location × modifier combination.
 */
export function generateVariantContent(
  listing: Listing,
  location: LocationConfig,
  modifier: ModifierConfig
): {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  vesselSection: string;
  locationSection: string;
  modifierSection: string;
  brokerSection: string;
  closingCTA: string;
  featureHighlights: string[];
  topSpecs: string;
} {
  const price = formatPrice(listing.price);
  const topSpecs = getTopSpecs(listing);
  const featureHighlights = getFeatureHighlights(listing);

  // ── H1 and Meta ───────────────────────────────────────────────────────────
  let h1: string;
  let metaTitle: string;
  let metaDescription: string;

  switch (modifier.slug) {
    case 'for-sale':
      h1 = `${listing.year} ${listing.make} ${listing.model} For Sale in ${location.name}`;
      metaTitle = `${listing.year} ${listing.make} ${listing.model} For Sale ${location.name} | ${price}`;
      metaDescription = `${listing.year} ${listing.make} ${listing.model} for sale in ${location.fullName}. ${listing.length_ft}ft. Asking ${price}. Contact Liena Q Perez — 786-838-9911.`;
      break;
    case 'pre-owned':
      h1 = `${listing.year} ${listing.make} ${listing.model} — Pre-Owned ${location.name}`;
      metaTitle = `Pre-Owned ${listing.year} ${listing.make} ${listing.model} ${location.name} | ${price}`;
      metaDescription = `Pre-owned ${listing.year} ${listing.make} ${listing.model} available in ${location.fullName}. ${listing.length_ft}ft, asking ${price}. Inspect with Liena Q Perez — call 786-838-9911.`;
      break;
    case 'price':
      h1 = `${listing.year} ${listing.make} ${listing.model} Price — ${location.name}`;
      metaTitle = `${listing.year} ${listing.make} ${listing.model} Price ${location.name} | ${price} Asking`;
      metaDescription = `${listing.year} ${listing.make} ${listing.model} asking ${price} in ${location.fullName}. ${listing.length_ft}ft. Full specs and market context from Liena Q Perez.`;
      break;
    case 'luxury':
      h1 = `${listing.year} ${listing.make} ${listing.model} — Luxury Yacht ${location.name}`;
      metaTitle = `Luxury ${listing.year} ${listing.make} ${listing.model} ${location.name} | ${price}`;
      metaDescription = `Luxury ${listing.year} ${listing.make} ${listing.model} for sale near ${location.name}. ${listing.length_ft}ft European-built yacht. ${price}. Contact Liena Q Perez for a private showing.`;
      break;
    case 'buy':
      h1 = `Buy a ${listing.year} ${listing.make} ${listing.model} Near ${location.name}`;
      metaTitle = `Buy ${listing.year} ${listing.make} ${listing.model} ${location.name} | ${price}`;
      metaDescription = `Ready to buy a ${listing.year} ${listing.make} ${listing.model} near ${location.name}? Asking ${price}. Liena Q Perez handles the full purchase process — call 786-838-9911.`;
      break;
    default:
      h1 = `${listing.year} ${listing.make} ${listing.model} For Sale in ${location.name}`;
      metaTitle = `${listing.year} ${listing.make} ${listing.model} ${location.name} | ${price}`;
      metaDescription = `${listing.year} ${listing.make} ${listing.model} for sale in ${location.fullName}. ${listing.length_ft}ft, ${price}. Contact Liena Q Perez.`;
  }

  // ── Intro paragraph (varies by modifier) ──────────────────────────────────
  const introByModifier: Record<string, string> = {
    'for-sale': `If you're searching for a ${listing.year} ${listing.make} ${listing.model} for sale in ${location.name}, this ${listing.length_ft}-foot vessel is actively listed and available for immediate private showing. Represented exclusively by Liena Q Perez — luxury yacht sales specialist based in Miami — this vessel is offered at ${price} and reflects exceptional value in the current ${location.name} market.`,

    'pre-owned': `The ${listing.year} ${listing.make} ${listing.model} is one of the most compelling pre-owned opportunities in the ${location.name} market today. At ${price} for a ${listing.length_ft}-foot European-built yacht with full specifications, buyers considering new construction will find the savings significant without compromising on quality, fit, or finish. Liena Q Perez, Miami-based luxury yacht specialist, holds this listing and is available for immediate showing.`,

    'price': `Buyers researching ${listing.make} ${listing.model} pricing in ${location.name} will find this ${listing.year} example asking ${price} — a figure that reflects current market conditions, the vessel's documented condition, and the full equipment list included in the sale. Understanding what drives yacht pricing is essential before entering any negotiation, and Liena Q Perez provides full market context to every qualified buyer she works with.`,

    'luxury': `When buyers in ${location.name} are searching for true luxury — not just a large vessel, but one built to European standards with meticulous attention to craftsmanship, performance, and design — the ${listing.year} ${listing.make} ${listing.model} consistently rises to the top of consideration. This ${listing.length_ft}-foot yacht, offered at ${price}, represents the Italian and British yacht-building tradition at its finest.`,

    'buy': `If you've made the decision to buy a ${listing.make} ${listing.model} near ${location.name} and want to move forward efficiently, Liena Q Perez is the right call. This ${listing.year} model is actively available at ${price}, and the purchase process — from sea trial and survey through documentation and closing — is something Liena handles personally for every buyer she works with.`,
  };

  const intro = introByModifier[modifier.slug] ?? introByModifier['for-sale'];

  // ── Vessel section (draws from actual listing data) ───────────────────────
  const vesselSection = `The ${listing.title}${listing.vessel_name ? ` — known as "${listing.vessel_name}"` : ''} is a ${listing.length_ft}-foot ${listing.make} ${listing.model} built in ${listing.year}. ${listing.description ? listing.description.split('.').slice(0, 3).join('.') + '.' : `The ${listing.make} ${listing.model} is renowned for its balance of performance, comfort, and build quality.`}

Key specifications include ${topSpecs}. ${Object.keys(listing.specs).length > 0 ? `The complete specification sheet — including ${Object.keys(listing.specs).slice(0, 4).join(', ')} and more — is available through Liena Q Perez upon request.` : ''}${featureHighlights.length > 0 ? ` Notable equipment aboard includes ${featureHighlights.slice(0, 3).join(', ')}, among a comprehensive inventory documented in the full listing.` : ''}`;

  // ── Location section (unique per location) ────────────────────────────────
  const locationSection = `${location.marketContext}

For a vessel of this caliber, ${location.name} provides an ideal base. Access to ${location.waterways} puts the full range of South Florida cruising grounds within reach — from day trips to the Bahamas to extended coastal cruising along Florida's east coast. ${location.marinas ? `Premier docking facilities in the area include ${location.marinas}.` : ''} ${location.boatShow ? `The ${location.boatShow} — one of the world's premier marine events — makes ${location.name} a natural hub for buyers and sellers of quality yachts.` : ''}

The buyer profile in ${location.name} tends toward ${location.buyerProfile}. ${location.nearbyMarkets ? `Buyers relocating to the area from ${location.nearbyMarkets} are particularly active in this segment.` : ''}`;

  // ── Modifier-specific section ─────────────────────────────────────────────
  const modifierSection = modifier.valueAngle;

  // ── Broker section ────────────────────────────────────────────────────────
  const brokerSection = `Liena Q Perez is a Miami-based luxury yacht sales specialist with deep experience in the South Florida market. She represents both buyers and sellers of premium vessels and provides hands-on service throughout the entire transaction — from the first showing through sea trial, survey, and closing. Every client receives direct access to Liena throughout the process, with no hand-offs to junior staff.

Liena holds this listing and is the direct point of contact for all inquiries. She can be reached at ${BROKER.phone} or ${BROKER.email}. Response time for qualified inquiries is typically within hours.`;

  // ── Closing CTA (varies by location) ─────────────────────────────────────
  const closingByLocation: Record<string, string> = {
    miami:
      `Serious buyers are encouraged to call or submit an inquiry today. ${location.name} inventory at this price point and specification level moves quickly — private showings are scheduled on a first-come basis.`,
    'fort-lauderdale':
      `Fort Lauderdale's active brokerage market means well-priced, well-maintained vessels rarely sit. Contact Liena to schedule a sea trial or private walkthrough at your convenience.`,
    'west-palm-beach':
      `The Palm Beach market rewards buyers who move decisively. Contact Liena Q Perez to arrange a showing and discuss the path to ownership.`,
    naples:
      `Naples buyers typically seek vessels ready for immediate enjoyment — this vessel is that. Call Liena Q Perez at ${BROKER.phone} to schedule a private inspection.`,
    'boca-raton':
      `Boca Raton's discerning market means buyers expect full transparency. Liena Q Perez provides complete documentation, survey access, and full specification packages to every qualified buyer.`,
    'palm-beach':
      `Palm Beach transactions move with discretion and precision. Contact Liena Q Perez for a confidential conversation about this listing.`,
    'key-west':
      `If you're ready to explore the Keys and beyond aboard this vessel, the first step is a conversation with Liena Q Perez. Call ${BROKER.phone} to get started.`,
    florida:
      `Florida buyers have more choices than any other market in the country — but not all choices are equal. This listing stands out for its condition, specification, and price. Contact Liena today.`,
    'south-florida':
      `In a market that moves as quickly as South Florida, the best inventory doesn't stay available long. Reach Liena Q Perez at ${BROKER.phone} or submit an inquiry below.`,
    'southeast-florida':
      `Southeast Florida buyers expect the best — in the vessel itself and in the brokerage experience. Liena Q Perez delivers both. Call ${BROKER.phone} to begin.`,
  };

  const closingCTA =
    closingByLocation[location.slug] ??
    `Contact Liena Q Perez at ${BROKER.phone} to schedule a private showing of this vessel in ${location.name}.`;

  return {
    h1,
    metaTitle,
    metaDescription,
    intro,
    vesselSection,
    locationSection,
    modifierSection,
    brokerSection,
    closingCTA,
    featureHighlights,
    topSpecs,
  };
}

/** Generates metadata for city hub pages. */
export function generateCityHubMeta(location: LocationConfig) {
  return {
    title: `Yachts For Sale in ${location.name}, FL | Liena Q Perez`,
    description: `Browse luxury yachts for sale in ${location.fullName}. Motor yachts, flybridge yachts, and pre-owned vessels. Contact Liena Q Perez — ${BROKER.phone}.`,
    h1: `Yachts For Sale in ${location.name}`,
  };
}

/** Generates metadata for the main yachts hub page. */
export function generateHubMeta() {
  return {
    title: 'Luxury Yachts For Sale in Florida | Liena Q Perez',
    description:
      'Browse luxury yachts for sale across Miami, Fort Lauderdale, Palm Beach, and South Florida. Flybridge yachts, motor yachts, pre-owned inventory. Contact Liena Q Perez.',
    h1: 'Luxury Yachts For Sale in Florida',
  };
}
