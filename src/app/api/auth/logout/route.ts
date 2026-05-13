import { NextResponse } from 'next/server';
import { AUTH } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH.COOKIE_NAME, '', { path: '/', expires: new Date(0) });
  res.cookies.set(AUTH.ADMIN_COOKIE_NAME, '', { path: '/', expires: new Date(0) });
  return res;
}
