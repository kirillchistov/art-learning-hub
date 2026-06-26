import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload } from './types';

export const SESSION_COOKIE = 'alh-session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be at least 32 characters');
  }
  return new TextEncoder().encode(secret);
}

export function parseAuthUsers(): Map<string, string> {
  const raw = process.env.AUTH_USERS ?? '';
  const users = new Map<string, string>();

  for (const entry of raw.split(',')) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(':');
    if (colon === -1) continue;
    const login = trimmed.slice(0, colon).trim();
    const password = trimmed.slice(colon + 1);
    if (login && password) users.set(login, password);
  }

  return users;
}

export function verifyCredentials(
  username: string,
  password: string,
): boolean {
  const users = parseAuthUsers();
  const expected = users.get(username);
  return expected !== undefined && expected === password;
}

export async function createSessionToken(username: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(exp)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.username !== 'string') return null;
    return {
      username: payload.username,
      exp: typeof payload.exp === 'number' ? payload.exp : 0,
    };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}
