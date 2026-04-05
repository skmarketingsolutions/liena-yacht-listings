import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAuthFromRequest } from '@/lib/auth';
import { updateAdmin, deleteAdmin, getAdminById } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'broker') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  const existing = getAdminById(id);
  if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  try {
    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) updates.name = body.name || null;
    if (body.email !== undefined) updates.email = body.email || null;
    if (body.phone !== undefined) updates.phone = body.phone || null;
    if (body.role && ['broker', 'salesman'].includes(body.role)) updates.role = body.role;
    if (body.password) updates.password_hash = bcrypt.hashSync(body.password, 10);

    updateAdmin(id, updates as Parameters<typeof updateAdmin>[1]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'broker') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  // Prevent deleting yourself
  if (id === auth.adminId) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  const deleted = deleteAdmin(id);
  if (!deleted) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
