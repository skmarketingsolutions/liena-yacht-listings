/**
 * Neon Postgres database layer.
 * All functions are async — await them in route handlers and server pages.
 *
 * Fallback behaviour: when DATABASE_URL is not set OR the DB returns zero
 * rows, the static listings from lib/listings-data.ts are returned instead.
 * This guarantees listings always appear on the live site.
 */

import { neon } from '@neondatabase/serverless';
import { STATIC_LISTINGS } from './listings-data';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Listing {
  id: number;
  slug: string;
  title: string;
  vessel_name: string | null;
  year: number;
  make: string;
  model: string;
  length_ft: number;
  price: number;
  location: string;
  description: string;
  specs: Record<string, string>;
  features: Record<string, string[]>;
  photos: string[];
  video_url: string | null;
  featured: boolean;
  status: 'active' | 'sold' | 'draft';
  salesman_id: number | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: string;
  updated_at: string;
}

// Kept for backward-compat
export type RawListing = Listing;
export function parseListing(r: RawListing): Listing { return r; }

export interface Admin {
  id: number;
  username: string;
  password_hash: string;
  email: string | null;
  role: 'broker' | 'salesman';
  name: string | null;
  phone: string | null;
  created_at: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  listing_id: number | null;
  listing_title: string | null;
  created_at: string;
}

// ── DB client (lazy singleton) ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

// Cast the neon tagged-template function so every `await sql\`...\`` resolves
// to `Row[]` — avoids the `FullQueryResults<boolean>` union branch that TS
// can't call .map() or index [0] on.
type SqlFn = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Row[]>;

let _sql: ReturnType<typeof neon> | null = null;

function getDb(): SqlFn {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql as unknown as SqlFn;
}

// ── Row mappers ───────────────────────────────────────────────────────────────

function toStr(v: unknown): string {
  return v instanceof Date ? v.toISOString() : String(v);
}

function rowToListing(r: Row): Listing {
  return {
    id: Number(r.id),
    slug: r.slug as string,
    title: r.title as string,
    vessel_name: (r.vessel_name as string | null) ?? null,
    year: Number(r.year),
    make: r.make as string,
    model: r.model as string,
    length_ft: Number(r.length_ft),
    price: Number(r.price),
    location: r.location as string,
    description: r.description as string,
    specs: (r.specs ?? {}) as Record<string, string>,
    features: (r.features ?? {}) as Record<string, string[]>,
    photos: (r.photos ?? []) as string[],
    video_url: (r.video_url as string | null) ?? null,
    featured: Boolean(r.featured),
    status: r.status as 'active' | 'sold' | 'draft',
    salesman_id: r.salesman_id != null ? Number(r.salesman_id) : null,
    seo_title: (r.seo_title as string | null) ?? null,
    seo_description: (r.seo_description as string | null) ?? null,
    seo_keywords: (r.seo_keywords as string | null) ?? null,
    created_at: toStr(r.created_at),
    updated_at: toStr(r.updated_at),
  };
}

function rowToAdmin(r: Row): Admin {
  return {
    id: Number(r.id),
    username: r.username as string,
    password_hash: (r.password_hash as string) ?? '',
    email: (r.email as string | null) ?? null,
    role: r.role as 'broker' | 'salesman',
    name: (r.name as string | null) ?? null,
    phone: (r.phone as string | null) ?? null,
    created_at: toStr(r.created_at),
  };
}

function rowToLead(r: Row): Lead {
  return {
    id: Number(r.id),
    name: r.name as string,
    email: r.email as string,
    phone: r.phone as string,
    message: (r.message as string | null) ?? null,
    listing_id: r.listing_id != null ? Number(r.listing_id) : null,
    listing_title: (r.listing_title as string | null) ?? null,
    created_at: toStr(r.created_at),
  };
}

// ── Slug helper ───────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ── Listing queries ───────────────────────────────────────────────────────────

export async function getAllListings(): Promise<Listing[]> {
  let dbListings: Listing[] = [];
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM listings
      WHERE status != 'draft'
      ORDER BY featured DESC, created_at DESC
    `;
    dbListings = rows.map(rowToListing);
  } catch {
    // DB unavailable — return static data only
    return STATIC_LISTINGS;
  }

  // Merge strategy:
  // 1. For every static listing, use the DB version if one exists (DB has photos, real data, etc.)
  // 2. For static slugs with NO matching DB row → include the static version as fallback
  // 3. Append any DB listings not covered by static slugs
  // This guarantees all 5 curated listings always appear even if the DB seed is incomplete.
  const dbBySlug = new Map(dbListings.map((l) => [l.slug, l]));
  const staticSlugs = new Set(STATIC_LISTINGS.map((l) => l.slug));

  const merged: Listing[] = STATIC_LISTINGS.map((s) => dbBySlug.get(s.slug) ?? s);

  for (const db of dbListings) {
    if (!staticSlugs.has(db.slug)) merged.push(db);
  }

  // Featured first, preserve relative order otherwise
  return merged.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
}

export async function getAllListingsAdmin(): Promise<Listing[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM listings
    ORDER BY created_at DESC
  `;
  return rows.map(rowToListing);
}

export async function getListingsBySalesman(salesmanId: number): Promise<Listing[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM listings
    WHERE salesman_id = ${salesmanId}
    ORDER BY created_at DESC
  `;
  return rows.map(rowToListing);
}

export async function getFeaturedListings(): Promise<Listing[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM listings
    WHERE featured = true AND status = 'active'
    ORDER BY created_at DESC
  `;
  return rows.map(rowToListing);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const staticMatch = STATIC_LISTINGS.find((l) => l.slug === slug);
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM listings WHERE slug = ${slug} LIMIT 1
    `;
    if (rows.length > 0) {
      const listing = rowToListing(rows[0]);
      // Supplement stale DB fields from the static source of truth:
      // photos — DB may still have '[]' if instrumentation UPDATE hasn't fired
      if (listing.photos.length === 0 && staticMatch && staticMatch.photos.length > 0) {
        listing.photos = staticMatch.photos;
      }
      // location — always enforce static value (Miami, Florida) over whatever DB has
      if (staticMatch && staticMatch.location !== listing.location) {
        listing.location = staticMatch.location;
      }
      // SEO fields — static is the authoritative source; propagate when DB is stale
      if (staticMatch) {
        if (staticMatch.seo_title) listing.seo_title = staticMatch.seo_title;
        if (staticMatch.seo_description) listing.seo_description = staticMatch.seo_description;
        if (staticMatch.seo_keywords) listing.seo_keywords = staticMatch.seo_keywords;
      }
      return listing;
    }
  } catch {
    // DB unavailable — fall through to static data
  }
  return staticMatch ?? null;
}

export async function getListingById(id: number): Promise<Listing | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM listings WHERE id = ${id} LIMIT 1
  `;
  return rows.length > 0 ? rowToListing(rows[0]) : null;
}

export async function createListing(
  data: Omit<Listing, 'id' | 'created_at' | 'updated_at'>
): Promise<{ id: number; slug: string }> {
  const sql = getDb();

  // Ensure unique slug
  const baseSlug = slugify(data.slug || data.title);
  let slug = baseSlug;
  let attempt = 1;
  while (true) {
    const existing = await sql`SELECT id FROM listings WHERE slug = ${slug} LIMIT 1`;
    if (existing.length === 0) break;
    slug = `${baseSlug}-${++attempt}`;
  }

  const rows = await sql`
    INSERT INTO listings (
      slug, title, vessel_name, year, make, model, length_ft, price, location,
      description, specs, features, photos, video_url, featured, status,
      salesman_id, seo_title, seo_description, seo_keywords
    ) VALUES (
      ${slug},
      ${data.title},
      ${data.vessel_name ?? null},
      ${data.year},
      ${data.make},
      ${data.model},
      ${data.length_ft},
      ${data.price},
      ${data.location},
      ${data.description},
      ${JSON.stringify(data.specs)}::jsonb,
      ${JSON.stringify(data.features)}::jsonb,
      ${JSON.stringify(data.photos)}::jsonb,
      ${data.video_url ?? null},
      ${data.featured},
      ${data.status},
      ${data.salesman_id ?? null},
      ${data.seo_title ?? null},
      ${data.seo_description ?? null},
      ${data.seo_keywords ?? null}
    )
    RETURNING id, slug
  `;

  return { id: Number(rows[0].id), slug: rows[0].slug as string };
}

export async function updateListing(
  id: number,
  data: Partial<Omit<Listing, 'id' | 'created_at'>>
): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`
    UPDATE listings SET
      title           = ${data.title ?? null},
      vessel_name     = ${data.vessel_name ?? null},
      year            = ${data.year ?? null},
      make            = ${data.make ?? null},
      model           = ${data.model ?? null},
      length_ft       = ${data.length_ft ?? null},
      price           = ${data.price ?? null},
      location        = ${data.location ?? null},
      description     = ${data.description ?? null},
      specs           = ${JSON.stringify(data.specs ?? {})}::jsonb,
      features        = ${JSON.stringify(data.features ?? {})}::jsonb,
      photos          = ${JSON.stringify(data.photos ?? [])}::jsonb,
      video_url       = ${data.video_url ?? null},
      featured        = ${data.featured ?? false},
      status          = ${data.status ?? null},
      salesman_id     = ${data.salesman_id ?? null},
      seo_title       = ${data.seo_title ?? null},
      seo_description = ${data.seo_description ?? null},
      seo_keywords    = ${data.seo_keywords ?? null},
      updated_at      = NOW()
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function deleteListing(id: number): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`DELETE FROM listings WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export async function getAdminByUsername(username: string): Promise<Admin | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM admins WHERE username = ${username.toLowerCase()} LIMIT 1
  `;
  return rows.length > 0 ? rowToAdmin(rows[0]) : null;
}

export async function getAdminById(id: number): Promise<Admin | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM admins WHERE id = ${id} LIMIT 1
  `;
  return rows.length > 0 ? rowToAdmin(rows[0]) : null;
}

export async function getAllAdmins(): Promise<Admin[]> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM admins ORDER BY created_at ASC`;
  // Strip password hashes from list view
  return rows.map((r) => ({ ...rowToAdmin(r), password_hash: '' }));
}

export async function createAdmin(data: Omit<Admin, 'id' | 'created_at'>): Promise<Admin> {
  const sql = getDb();
  try {
    const rows = await sql`
      INSERT INTO admins (username, password_hash, email, role, name, phone)
      VALUES (
        ${data.username.toLowerCase()},
        ${data.password_hash},
        ${data.email ?? null},
        ${data.role},
        ${data.name ?? null},
        ${data.phone ?? null}
      )
      RETURNING *
    `;
    return rowToAdmin(rows[0]);
  } catch (err: unknown) {
    // Postgres unique constraint violation
    if ((err as { code?: string }).code === '23505') {
      throw new Error('Username already exists');
    }
    throw err;
  }
}

export async function updateAdmin(
  id: number,
  data: Partial<Omit<Admin, 'id' | 'created_at'>>
): Promise<boolean> {
  // Fetch existing to merge partial updates
  const existing = await getAdminById(id);
  if (!existing) return false;

  const merged = {
    username: data.username ? data.username.toLowerCase() : existing.username,
    password_hash: data.password_hash ?? existing.password_hash,
    email: data.email !== undefined ? data.email : existing.email,
    role: data.role ?? existing.role,
    name: data.name !== undefined ? data.name : existing.name,
    phone: data.phone !== undefined ? data.phone : existing.phone,
  };

  const sql = getDb();
  const rows = await sql`
    UPDATE admins SET
      username      = ${merged.username},
      password_hash = ${merged.password_hash},
      email         = ${merged.email ?? null},
      role          = ${merged.role},
      name          = ${merged.name ?? null},
      phone         = ${merged.phone ?? null}
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function deleteAdmin(id: number): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`DELETE FROM admins WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

// ── Lead queries ──────────────────────────────────────────────────────────────

export async function createLead(data: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO leads (name, email, phone, message, listing_id, listing_title)
    VALUES (
      ${data.name},
      ${data.email},
      ${data.phone},
      ${data.message ?? null},
      ${data.listing_id ?? null},
      ${data.listing_title ?? null}
    )
    RETURNING *
  `;
  return rowToLead(rows[0]);
}

export async function getAllLeads(): Promise<Lead[]> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
  return rows.map(rowToLead);
}

export async function getLeadsByListingIds(listingIds: number[]): Promise<Lead[]> {
  if (listingIds.length === 0) return [];
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM leads
    WHERE listing_id = ANY(${listingIds}::int[])
    ORDER BY created_at DESC
  `;
  return rows.map(rowToLead);
}
