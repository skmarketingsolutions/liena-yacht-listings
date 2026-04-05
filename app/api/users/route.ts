import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAuthFromRequest } from '@/lib/auth';
import { getAllAdmins, createAdmin } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'broker') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const admins = await getAllAdmins();
  return NextResponse.json(admins);
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'broker') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const { username, password, name, email, phone, role } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }
    if (!['broker', 'salesman'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const admin = await createAdmin({
      username,
      password_hash,
      name: name || null,
      email: email || null,
      phone: phone || null,
      role,
    });

    return NextResponse.json({ id: admin.id, username: admin.username }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    if (message === 'Username already exists') {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
