import { MetadataRoute } from 'next';
import { getAllListings } from '@/lib/db';
import { LOCATIONS, MODIFIERS, getBaseSlug } from '@/lib/seo-config';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lienayperez.com';

function url(path: string, priority: number, changeFreq: MetadataRoute.Sitemap[number]['changeFrequency']): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let listings: Awaited<ReturnType<typeof getAllListings>> = [];
  try {
    listings = await getAllListings();
  } catch {
    // DB unavailable — return static pages only
  }

  const staticPages: MetadataRoute.Sitemap = [
    url('/', 1.0, 'daily'),
    url('/yachts', 0.9, 'daily'),
    url('/broker/liena-q-perez', 0.8, 'monthly'),
  ];

  // City hub pages
  const cityHubs: MetadataRoute.Sitemap = LOCATIONS.map((loc) =>
    url(`/yachts/${loc.slug}`, 0.85, 'daily')
  );

  // Canonical listing pages
  const listingPages: MetadataRoute.Sitemap = listings.map((l) =>
    url(`/listings/${l.slug}`, 0.9, 'weekly')
  );

  // Programmatic variant pages: listing × location × modifier
  const variantPages: MetadataRoute.Sitemap = [];
  for (const listing of listings) {
    const baseSlug = getBaseSlug(listing.slug);
    for (const loc of LOCATIONS) {
      for (const mod of MODIFIERS) {
        variantPages.push(
          url(`/yachts/${loc.slug}/${baseSlug}-${mod.slug}`, 0.75, 'weekly')
        );
      }
    }
  }

  return [...staticPages, ...cityHubs, ...listingPages, ...variantPages];
}
