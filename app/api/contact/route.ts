import { NextRequest, NextResponse } from 'next/server';
import { getListingById, getAdminById, createLead } from '@/lib/db';
import { sendLeadEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, listingId, listingTitle, listingSlug } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Name, email, and phone are required.' }, { status: 400 });
    }

    // Save lead
    createLead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message?.trim() || null,
      listing_id: listingId ? Number(listingId) : null,
      listing_title: listingTitle || null,
    });

    // Route email to the listing's salesman, or fallback to LEAD_EMAIL env var
    let toEmail = process.env.LEAD_EMAIL || 'liena@italiaboats.com';

    if (listingId) {
      const listing = getListingById(Number(listingId));
      if (listing?.salesman_id) {
        const salesman = getAdminById(listing.salesman_id);
        if (salesman?.email) toEmail = salesman.email;
      }
    }

    // Fire-and-forget email — don't fail the request if SMTP isn't configured
    sendLeadEmail({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message?.trim(),
      listingTitle,
      listingSlug,
      toEmail,
    }).catch((err) => console.error('[Contact] Email error:', err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
