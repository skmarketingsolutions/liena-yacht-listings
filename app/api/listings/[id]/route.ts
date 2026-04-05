import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { getListingById, updateListing, deleteListing } from '@/lib/db';

interface RouteParams {
  params: { id: string };
}

// GET /api/listings/:id — public
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const listing = getListingById(parseInt(params.id));
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(listing);
}

// PUT /api/listings/:id — admin only
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id);
  const existing = getListingById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (auth.role === 'salesman' && existing.salesman_id !== auth.adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();

    updateListing(id, {
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
  }
}

// DELETE /api/listings/:id — admin only
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id);
  const existing = getListingById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (auth.role === 'salesman' && existing.salesman_id !== auth.adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  deleteListing(id);
  return NextResponse.json({ success: true });
}
