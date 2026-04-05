/**
 * Edge Runtime-compatible JWT verification using `jose`.
 * Used exclusively by middleware.ts (which runs on the Edge Runtime).
 * API routes continue to use lib/auth.ts + jsonwebtoken (Node.js runtime).
 */

import { jwtVerify } from 'jose';
import type { JwtPayload } from './auth';

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'italia-boats-secret-change-in-production';
  return new TextEncoder().encode(secret);
}

export async function verifyTokenEdge(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}
