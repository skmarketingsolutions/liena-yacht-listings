import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { getAllListings, createListing } from '@/lib/db';

// GET /api/listings — public
export async function GET() {
  try {
    return NextResponse.json(getAllListings());
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/listings — admin only
export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();

    const { id, slug } = createListing({
      slug: body.slug || body.title || 'listing',
      title: body.title,
      vessel_name: body.vessel_name || null,
      year: Number(body.year),
      make: body.make,
      model: body.model,
      length_ft: Number(body.length_ft),
      price: Number(body.price),
      location: body.location,
      description: body.description,
      specs: body.specs || {},
      features: body.features || {},
      photos: body.photos || [],
      video_url: body.video_url || null,
      featured: Boolean(body.featured),
      status: body.status || 'active',
      salesman_id: body.salesman_id ? Number(body.salesman_id) : auth.adminId,
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      seo_keywords: body.seo_keywords || null,
    });

    return NextResponse.json({ id, slug }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
