/**
 * Pure-JS JSON file database — zero native dependencies.
 * Works on any Node.js version with no build tools required.
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

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

// Kept for backward-compat — identical to Listing since JSON stores parsed values
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

interface DbData {
  meta: { lastId: { admins: number; listings: number; leads: number } };
  admins: Admin[];
  listings: Listing[];
  leads: Lead[];
}

// ── File I/O ──────────────────────────────────────────────────────────────────

function readDb(): DbData {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!fs.existsSync(DB_PATH)) {
    const fresh = buildInitialData();
    fs.writeFileSync(DB_PATH, JSON.stringify(fresh, null, 2), 'utf8');
    return fresh;
  }

  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) as DbData;
  } catch {
    // Corrupted file — re-seed
    const fresh = buildInitialData();
    fs.writeFileSync(DB_PATH, JSON.stringify(fresh, null, 2), 'utf8');
    return fresh;
  }
}

function writeDb(data: DbData): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function nextId(data: DbData, table: keyof DbData['meta']['lastId']): number {
  data.meta.lastId[table] += 1;
  return data.meta.lastId[table];
}

function now(): string {
  return new Date().toISOString();
}

// ── Seed data ─────────────────────────────────────────────────────────────────

function buildInitialData(): DbData {
  const salesHash = bcrypt.hashSync('LienaQ2024!', 10);
  const brokerHash = bcrypt.hashSync('Admin2024!', 10);
  const ts = now();

  const liena: Admin = {
    id: 1,
    username: 'liena',
    password_hash: salesHash,
    email: 'liena@italiaboats.com',
    role: 'salesman',
    name: 'Liena Q Perez',
    phone: '786-838-9911',
    created_at: ts,
  };

  const superAdmin: Admin = {
    id: 2,
    username: 'admin',
    password_hash: brokerHash,
    email: 'liena@italiaboats.com',
    role: 'broker',
    name: 'Admin',
    phone: '786-838-9911',
    created_at: ts,
  };

  const listing1: Listing = {
    id: 1,
    slug: '2019-azimut-fly-50-miami',
    title: '2019 Azimut Fly 50 — La Paloma',
    vessel_name: 'La Paloma',
    year: 2019,
    make: 'Azimut',
    model: 'Fly 50',
    length_ft: 50,
    price: 980000,
    location: 'Miami, Florida',
    description: `Introducing the stunning 2019 Azimut Fly 50 "La Paloma" — a remarkable flybridge yacht that embodies Italian elegance and performance. With an overall length of 50 feet, this vessel is crafted from durable fiberglass and powered by twin Volvo Penta inboard diesel engines, promising a reliable and exhilarating cruising experience.

The Fly 50 is designed for comfort and style, featuring a spacious layout that enhances your time spent at sea. The flybridge offers an ideal vantage point for enjoying breathtaking views while relaxing with friends and family. Equipped with a SeaKeeper gyroscopic stabilizer, Raymarine electronics suite, and JoyStick docking control, this yacht handles like a dream in Miami's waters.

Three beautifully appointed staterooms accommodate up to 6 guests, while the fully-equipped galley with Miele appliances ensures gourmet meals at anchor. The expansive flybridge with wet bar, grill, and U-shaped seating makes this the ultimate Miami entertainment vessel.`,
    specs: {
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
    features: {
      'Salon': [
        'Wood flooring throughout',
        'Port & starboard salon sofas',
        'Hi-Low table on starboard side',
        'Bose sound system',
        'Sony 4K 3D BluRay',
        'Dometic A/C electronic display',
        'Large panoramic windows',
      ],
      'Galley': [
        'Galley located aft salon port side',
        'Large countertop with wood flooring',
        'Vitrifrigo undercounter refrigerator',
        'Miele Microwave/Oven',
        'Miele Induction cooktop',
        'Stainless steel sink',
      ],
      'Electronics': [
        '(2) Twin Raymarine MFD displays',
        'Raymarine Autopilot',
        'JoyStick docking control',
        'Raymarine VHF Radio',
        'SeaKeeper display',
        'Sea-Fire shutdown system',
        'Raymarine Radar',
        'Volvo Penta engine display',
      ],
      'Companionway': [
        'Splendide washer & dryer',
        'Vitrifrigo refrigerator',
      ],
      'Forward VIP Stateroom': [
        'Centerline queen bed',
        'Bose sound system',
        'Samsung TV',
        'Dometic A/C electronic display',
        '(2) Hanging closets',
        'Emergency escape hatch',
        'Marine CO alarm',
        'Reading lights',
      ],
      'Guest Stateroom': [
        '(2) Single beds with mattresses',
        'Carpet flooring',
        'Hanging closet',
        'Dometic A/C display',
        'Marine CO alarm',
        'Reading lights',
      ],
      'Master Stateroom': [
        'Large windows',
        'Samsung TV',
        'Hanging closet',
        'Private head & shower en suite',
        'Reading & overhead lights',
        'Carpet flooring',
      ],
      'Cockpit & Platform': [
        'Hydraulic swim platform',
        'Teak deck',
        'U-Shape aft deck seating',
        'Cockpit table with SS pedestal',
        'Isotherm cockpit refrigerator',
        'Raritan Ice Maker',
        'JL Audio speakers',
        'Fusion MS-NRX300 stereo',
        'Fresh water wash down',
        'Whale bilge pump',
        'Glendinning shore power cable',
        'Crew quarter hatch',
      ],
      'Flybridge': [
        'Large flybridge — ideal for entertaining',
        '(2) Sofas on aft flybridge deck',
        'U-Shape forward sofa with wood table',
        'Wet bar with grill, sink & Vitrifrigo fridge',
        'Sunroof',
        'JL Audio speakers',
        'Fusion radio',
        '(2) Raymarine MFD displays',
        'Raymarine Autopilot',
        'JoyStick control',
        'Searchlight control',
        'SeaKeeper display',
      ],
      'Engine Room': [
        'Twin Volvo Penta diesel engines',
        'Cummins Onan generator',
        'Fresh water maker',
        'Dometic chiller',
        'Fire extinguisher',
      ],
    },
    photos: [
      '/listings/azimut-fly-50/photo_01.jpeg',
      '/listings/azimut-fly-50/photo_06.jpeg',
      '/listings/azimut-fly-50/photo_07.jpeg',
      '/listings/azimut-fly-50/photo_08.jpeg',
      '/listings/azimut-fly-50/photo_09.jpeg',
      '/listings/azimut-fly-50/photo_10.jpeg',
      '/listings/azimut-fly-50/photo_11.jpeg',
      '/listings/azimut-fly-50/photo_12.jpeg',
      '/listings/azimut-fly-50/photo_13.jpeg',
      '/listings/azimut-fly-50/photo_14.jpeg',
      '/listings/azimut-fly-50/photo_15.jpeg',
      '/listings/azimut-fly-50/photo_16.jpeg',
      '/listings/azimut-fly-50/photo_17.jpeg',
      '/listings/azimut-fly-50/photo_18.jpeg',
      '/listings/azimut-fly-50/photo_19.jpeg',
      '/listings/azimut-fly-50/photo_20.jpeg',
      '/listings/azimut-fly-50/photo_21.jpeg',
      '/listings/azimut-fly-50/photo_22.jpeg',
      '/listings/azimut-fly-50/photo_23.jpeg',
      '/listings/azimut-fly-50/photo_24.jpeg',
    ],
    video_url: 'https://pub-d1d12a43eab2479bb077f5824229a67c.r2.dev/sfx%20.mp4',
    featured: true,
    status: 'active',
    salesman_id: 2,
    seo_title: '2019 Azimut Fly 50 Flybridge For Sale in Miami | Liena Q Perez',
    seo_description: 'Pristine 2019 Azimut Fly 50 "La Paloma" for sale in Miami, FL. 50ft flybridge yacht with twin Volvo Penta diesels, SeaKeeper stabilizer, 3 staterooms & flybridge bar. $980,000. Contact Liena Q Perez.',
    seo_keywords: '2019 Azimut Fly 50 for sale,Azimut 50 flybridge Miami,used Azimut yacht Florida,flybridge yacht Miami,50 foot yacht for sale,Azimut Fly 50 price,luxury yacht Miami',
    created_at: ts,
    updated_at: ts,
  };

  const listing2: Listing = {
    id: 2,
    slug: '2013-fairline-squadron-65-miami-beach',
    title: '2013 Fairline Squadron 65',
    vessel_name: null,
    year: 2013,
    make: 'Fairline',
    model: 'Squadron 65',
    length_ft: 66,
    price: 1300000,
    location: 'Miami Beach, Florida',
    description: `An extraordinary opportunity to own the iconic 2013 Fairline Squadron 65 — a masterpiece of British yacht-building now available in Miami Beach. Bring all offers on this magnificent 66-foot motor yacht that redefines luxury afloat.

Sumptuous furnishings and hand-worked cabinetry are hallmarks of the Squadron range. Nowhere is it more elegantly expressed than in the long, wide single-level interior — a testament to the 65's ingenious flat floor design that is normally reserved for much larger yachts. An elegant, beautifully proportioned Squadron awaits you.

The massive flybridge features three distinct social areas: a forward chaise longue and sun pad, aft-facing sunbeds, and a seating/dining area. Powered by twin Caterpillar C18-1150 diesels at 1,150hp each producing 32 knots, equipped with Seakeeper gyroscopic stabilizer, bow and stern thrusters, and a full garage for your tender, this vessel is the complete Miami cruising package.`,
    specs: {
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
      'Dry Weight': '32,890 kg',
      'Stabilizer': 'Seakeeper Gyroscopic',
      'Condition': 'Used',
    },
    features: {
      'Electronics': [
        'Garmin navigation system',
        'Autopilot',
        'GPS & chartplotter',
        'Radar & radar detector',
        'VHF radio',
        'Depth sounder',
        'Wi-Fi aboard',
        'Flat screen TVs',
        'Cockpit speakers',
        'Navigation center',
      ],
      'Interior Equipment': [
        'Full air conditioning',
        'Seakeeper gyroscopic stabilizer',
        'Bow thruster',
        'Stern thruster',
        'Dishwasher',
        'Washing machine',
        'Fresh water maker',
        'Electric bilge pump',
        'Microwave oven & full oven',
        'Refrigerator',
        'Hot water system',
        'Battery charger',
        'Marine heads (electric)',
      ],
      'Exterior & Deck': [
        'Teak cockpit',
        'Teak sidedecks',
        'Hydraulic hi-lo bathing platform',
        'Hydraulic gangway',
        'Cockpit table & cushions',
        'Cockpit shower',
        'Davit(s)',
        'Fin stabilizers',
        'Swimming ladder',
        'Underwater lights',
        'Walk-around deck',
        'Bimini top',
      ],
      'Tender & Toys': [
        'Full garage for tender',
        'Yamaha WaveRunner jet ski',
        'Davits for tender launch',
        'Outboard engine brackets',
      ],
      'Electrical & Safety': [
        'Generator',
        'Inverter',
        'Shore power inlet',
        'Liferaft',
        'Fire suppression system',
        'Solar panel',
      ],
    },
    photos: [
      '/listings/fairline-squadron-65/photo_02.jpeg',
      '/listings/fairline-squadron-65/photo_07.jpeg',
      '/listings/fairline-squadron-65/photo_08.jpeg',
      '/listings/fairline-squadron-65/photo_09.jpeg',
      '/listings/fairline-squadron-65/photo_10.jpeg',
      '/listings/fairline-squadron-65/photo_11.jpeg',
      '/listings/fairline-squadron-65/photo_12.jpeg',
      '/listings/fairline-squadron-65/photo_13.jpeg',
      '/listings/fairline-squadron-65/photo_14.jpeg',
      '/listings/fairline-squadron-65/photo_15.jpeg',
      '/listings/fairline-squadron-65/photo_16.jpeg',
      '/listings/fairline-squadron-65/photo_17.jpeg',
      '/listings/fairline-squadron-65/photo_18.jpeg',
      '/listings/fairline-squadron-65/photo_19.jpeg',
      '/listings/fairline-squadron-65/photo_20.jpeg',
      '/listings/fairline-squadron-65/photo_21.jpeg',
      '/listings/fairline-squadron-65/photo_22.jpeg',
      '/listings/fairline-squadron-65/photo_23.jpeg',
      '/listings/fairline-squadron-65/photo_24.jpeg',
    ],
    video_url: 'https://pub-d1d12a43eab2479bb077f5824229a67c.r2.dev/Final%20Fairline.mp4',
    featured: true,
    status: 'active',
    salesman_id: 2,
    seo_title: '2013 Fairline Squadron 65 Motor Yacht For Sale Miami Beach | Liena Q Perez',
    seo_description: '2013 Fairline Squadron 65 for sale in Miami Beach, FL. 66ft motor yacht with twin CAT 1,150hp engines (690 hrs), Seakeeper, bow & stern thrusters, garage & WaveRunner. $1,300,000. Bring offers. Contact Liena Q Perez.',
    seo_keywords: '2013 Fairline Squadron 65 for sale,Fairline Squadron 65 Miami Beach,used motor yacht Florida,66 foot yacht for sale,Fairline yacht Miami,luxury motor yacht Miami Beach,Fairline Squadron price',
    created_at: ts,
    updated_at: ts,
  };

  return {
    meta: { lastId: { admins: 2, listings: 2, leads: 0 } },
    admins: [liena, superAdmin],
    listings: [listing1, listing2],
    leads: [],
  };
}

// ── Listing helpers ───────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getAllListings(): Listing[] {
  const { listings } = readDb();
  return listings
    .filter((l) => l.status !== 'draft')
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}

export function getAllListingsAdmin(): Listing[] {
  const { listings } = readDb();
  return listings.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getListingsBySalesman(salesmanId: number): Listing[] {
  const { listings } = readDb();
  return listings
    .filter((l) => l.salesman_id === salesmanId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getFeaturedListings(): Listing[] {
  const { listings } = readDb();
  return listings.filter((l) => l.featured && l.status === 'active');
}

export function getListingBySlug(slug: string): Listing | null {
  const { listings } = readDb();
  return listings.find((l) => l.slug === slug) ?? null;
}

export function getListingById(id: number): Listing | null {
  const { listings } = readDb();
  return listings.find((l) => l.id === id) ?? null;
}

export function createListing(
  data: Omit<Listing, 'id' | 'created_at' | 'updated_at'>
): { id: number; slug: string } {
  const db = readDb();

  // Ensure unique slug
  const baseSlug = slugify(data.slug || data.title);
  let slug = baseSlug;
  let attempt = 1;
  while (db.listings.some((l) => l.slug === slug)) {
    slug = `${baseSlug}-${++attempt}`;
  }

  const id = nextId(db, 'listings');
  const ts = now();

  db.listings.push({ ...data, id, slug, created_at: ts, updated_at: ts });
  writeDb(db);
  return { id, slug };
}

export function updateListing(
  id: number,
  data: Partial<Omit<Listing, 'id' | 'created_at'>>
): boolean {
  const db = readDb();
  const idx = db.listings.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  db.listings[idx] = { ...db.listings[idx], ...data, updated_at: now() };
  writeDb(db);
  return true;
}

export function deleteListing(id: number): boolean {
  const db = readDb();
  const before = db.listings.length;
  db.listings = db.listings.filter((l) => l.id !== id);
  if (db.listings.length === before) return false;
  writeDb(db);
  return true;
}

// ── Admin helpers ─────────────────────────────────────────────────────────────

export function getAdminByUsername(username: string): Admin | null {
  const { admins } = readDb();
  return admins.find((a) => a.username === username.toLowerCase()) ?? null;
}

export function getAdminById(id: number): Admin | null {
  const { admins } = readDb();
  return admins.find((a) => a.id === id) ?? null;
}

export function getAllAdmins(): Admin[] {
  const { admins } = readDb();
  // Strip password hashes from list view
  return admins.map(({ password_hash: _, ...rest }) => ({ ...rest, password_hash: '' }));
}

// ── Lead helpers ──────────────────────────────────────────────────────────────

export function createLead(data: Omit<Lead, 'id' | 'created_at'>): Lead {
  const db = readDb();
  const id = nextId(db, 'leads');
  const lead: Lead = { ...data, id, created_at: now() };
  db.leads.push(lead);
  writeDb(db);
  return lead;
}

export function getAllLeads(): Lead[] {
  const { leads } = readDb();
  return leads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getLeadsByListingIds(listingIds: number[]): Lead[] {
  const { leads } = readDb();
  return leads
    .filter((l) => l.listing_id !== null && listingIds.includes(l.listing_id))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function createAdmin(data: Omit<Admin, 'id' | 'created_at'>): Admin {
  const db = readDb();
  if (db.admins.some((a) => a.username === data.username.toLowerCase())) {
    throw new Error('Username already exists');
  }
  const id = nextId(db, 'admins');
  const admin: Admin = { ...data, id, username: data.username.toLowerCase(), created_at: now() };
  db.admins.push(admin);
  writeDb(db);
  return admin;
}

export function updateAdmin(
  id: number,
  data: Partial<Omit<Admin, 'id' | 'created_at'>>
): boolean {
  const db = readDb();
  const idx = db.admins.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  if (data.username) data.username = data.username.toLowerCase();
  db.admins[idx] = { ...db.admins[idx], ...data };
  writeDb(db);
  return true;
}

export function deleteAdmin(id: number): boolean {
  const db = readDb();
  const before = db.admins.length;
  db.admins = db.admins.filter((a) => a.id !== id);
  if (db.admins.length === before) return false;
  writeDb(db);
  return true;
}
