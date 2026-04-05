import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { getAllLeads, getLeadsByListingIds, getListingsBySalesman } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (auth.role === 'broker') {
    return NextResponse.json(await getAllLeads());
  }

  // Salesman: only leads for their listings
  const myListings = await getListingsBySalesman(auth.adminId);
  const myIds = myListings.map((l) => l.id);
  const leads = await getLeadsByListingIds(myIds);
  return NextResponse.json(leads);
}
