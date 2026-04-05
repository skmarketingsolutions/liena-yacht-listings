import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdminByUsername } from '@/lib/db';
import { signToken, COOKIE_OPTIONS } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    const admin = await getAdminByUsername(username.trim().toLowerCase());

    if (!admin) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const token = signToken({
      adminId: admin.id,
      username: admin.username,
      role: admin.role,
      name: admin.name || admin.username,
    });

    const response = NextResponse.json({ success: true, role: admin.role });
    response.cookies.set({ ...COOKIE_OPTIONS, value: token });

    return response;
  } catch (err) {
    console.error('[Auth Login]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
