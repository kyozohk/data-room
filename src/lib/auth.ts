const SECRET = () => process.env.AUTH_SECRET || 'dev-secret-change-me';
const COOKIE_NAME = 'kyozo_dr_session';
const ADMIN_COOKIE_NAME = 'kyozo_dr_admin';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

const enc = new TextEncoder();

function toHex(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let hex = '';
  for (let i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, '0');
  return hex;
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return toHex(sig);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export interface SessionToken {
  visitorId: string;
  issuedAt: number;
  expiresAt: number;
  role: 'visitor' | 'admin';
}

export async function createToken(role: 'visitor' | 'admin'): Promise<{ token: string; visitorId: string; expiresAt: number }> {
  const rand = new Uint8Array(8);
  crypto.getRandomValues(rand);
  const visitorId = toHex(rand);
  const issuedAt = Date.now();
  const expiresAt = issuedAt + SESSION_TTL_MS;
  const payload = `${visitorId}.${issuedAt}.${expiresAt}.${role}`;
  const sig = await sign(payload);
  return { token: `${payload}.${sig}`, visitorId, expiresAt };
}

export async function verifyToken(token: string | undefined | null): Promise<SessionToken | null> {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 5) return null;
  const [visitorId, issuedAtStr, expiresAtStr, role, sig] = parts;
  const payload = `${visitorId}.${issuedAtStr}.${expiresAtStr}.${role}`;
  const expected = await sign(payload);
  if (!safeEqual(sig, expected)) return null;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  if (role !== 'visitor' && role !== 'admin') return null;
  return {
    visitorId,
    issuedAt: Number(issuedAtStr),
    expiresAt,
    role: role as 'visitor' | 'admin',
  };
}

export const AUTH = {
  COOKIE_NAME,
  ADMIN_COOKIE_NAME,
  SESSION_TTL_MS,
};

export function checkPassword(input: string, kind: 'visitor' | 'admin'): boolean {
  const expected = kind === 'admin'
    ? process.env.ADMIN_PASSWORD
    : process.env.DATAROOM_PASSWORD;
  if (!expected || !input) return false;
  if (input.length !== expected.length) return false;
  return safeEqual(input, expected);
}
