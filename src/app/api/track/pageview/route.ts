import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { AUTH, verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';

function getSession(req: NextRequest) {
  const tok = req.cookies.get(AUTH.COOKIE_NAME)?.value;
  return verifyToken(tok);
}

export async function POST(req: NextRequest) {
  const sess = await getSession(req);
  if (!sess) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const body = await req.json().catch(() => ({} as any));
  const { action } = body || {};
  const db = getDb();
  const now = Date.now();

  // Touch session/visitor liveness
  db.prepare('UPDATE visitors SET last_seen=? WHERE id=?').run(now, sess.visitorId);
  db.prepare('UPDATE sessions SET last_active_at=? WHERE id=?').run(now, sess.visitorId);

  if (action === 'open') {
    const id = randomBytes(8).toString('hex');
    const path = String(body.path || '/');
    const title = body.title ? String(body.title).slice(0, 250) : null;
    const slugMatch = path.match(/^\/docs\/(.+)/);
    const docSlug = slugMatch ? slugMatch[1] : null;

    db.prepare(`
      INSERT INTO page_views (id, session_id, visitor_id, path, title, doc_slug, opened_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, sess.visitorId, sess.visitorId, path, title, docSlug, now);

    return NextResponse.json({ pageViewId: id });
  }

  if (action === 'heartbeat' || action === 'close') {
    const pvId = String(body.pageViewId || '');
    if (!pvId) return NextResponse.json({ ok: false }, { status: 400 });

    const dwellMs = Number(body.dwellMs) || 0;
    const activeMs = Number(body.activeMs) || 0;
    const maxScrollPct = Math.min(100, Math.max(0, Number(body.maxScrollPct) || 0));

    if (action === 'close') {
      db.prepare(`
        UPDATE page_views
           SET dwell_ms=?, active_ms=?, max_scroll_pct=?, closed_at=?
         WHERE id=? AND visitor_id=?
      `).run(dwellMs, activeMs, maxScrollPct, now, pvId, sess.visitorId);
    } else {
      db.prepare(`
        UPDATE page_views
           SET dwell_ms=?, active_ms=?, max_scroll_pct=MAX(max_scroll_pct, ?)
         WHERE id=? AND visitor_id=?
      `).run(dwellMs, activeMs, maxScrollPct, pvId, sess.visitorId);
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
}
