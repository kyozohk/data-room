import { NextRequest, NextResponse } from 'next/server';
import { AUTH, checkPassword, createToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { password, label, role } = body || {};
  const wantedRole: 'visitor' | 'admin' = role === 'admin' ? 'admin' : 'visitor';

  if (typeof password !== 'string' || !checkPassword(password, wantedRole)) {
    const expected = wantedRole === 'admin' ? process.env.ADMIN_PASSWORD : process.env.DATAROOM_PASSWORD;
    console.warn(
      `[auth] ${wantedRole} login failed.` +
      ` env_loaded=${Boolean(expected)}` +
      ` expected_len=${expected?.length ?? 0}` +
      ` got_len=${typeof password === 'string' ? password.length : 0}`
    );
    return NextResponse.json({ error: 'invalid_password' }, { status: 401 });
  }

  const { token, visitorId, expiresAt } = await createToken(wantedRole);

  // Record visitor in DB (visitor sessions only)
  if (wantedRole === 'visitor') {
    const db = getDb();
    const now = Date.now();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const ua = req.headers.get('user-agent') || '';
    const referrer = req.headers.get('referer') || '';
    const cleanLabel = (typeof label === 'string' && label.trim()) ? label.trim().slice(0, 80) : null;

    db.prepare(`
      INSERT INTO visitors (id, label, first_seen, last_seen, visit_count)
      VALUES (?, ?, ?, ?, 1)
      ON CONFLICT(id) DO UPDATE SET last_seen=excluded.last_seen, visit_count=visit_count+1
    `).run(visitorId, cleanLabel, now, now);

    db.prepare(`
      INSERT INTO sessions (id, visitor_id, started_at, last_active_at, ip, user_agent, referrer)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(visitorId, visitorId, now, now, ip, ua, referrer);
  }

  const res = NextResponse.json({ ok: true });
  const cookieName = wantedRole === 'admin' ? AUTH.ADMIN_COOKIE_NAME : AUTH.COOKIE_NAME;
  res.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiresAt),
  });
  return res;
}
