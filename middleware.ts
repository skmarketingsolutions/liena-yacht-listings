import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth-edge';

const PROTECTED = ['/admin/dashboard', '/admin/listings', '/admin/leads', '/admin/users'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes (except /admin/login)
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const token = req.cookies.get('ib_auth')?.value;
    if (!token || !(await verifyTokenEdge(token))) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect /admin/login if already authenticated
  if (pathname === '/admin/login') {
    const token = req.cookies.get('ib_auth')?.value;
    if (token && (await verifyTokenEdge(token))) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
