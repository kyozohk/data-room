import { NextRequest, NextResponse } from 'next/server';
import { AUTH, verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sess = await verifyToken(req.cookies.get(AUTH.COOKIE_NAME)?.value);
  if (!sess) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const body = await req.json().catch(() => ({} as any));
  const type = String(body?.type || '').slice(0, 40);
  if (!type) return NextResponse.json({ error: 'no_type' }, { status: 400 });

  const db = getDb();
  const now = Date.now();

  if (type === 'sections') {
    let parsed: any;
    try { parsed = typeof body.payload === 'string' ? JSON.parse(body.payload) : body.payload; }
    catch { parsed = null; }
    const slug = parsed?.slug;
    const sections: { id: string; title: string; visibleMs: number }[] = parsed?.sections || [];

    if (slug && Array.isArray(sections)) {
      // Find the latest page_view for this visitor + slug
      const pv = db.prepare(`
        SELECT id FROM page_views
         WHERE visitor_id=? AND doc_slug=?
         ORDER BY opened_at DESC LIMIT 1
      `).get(sess.visitorId, slug) as { id: string } | undefined;

      if (pv) {
        const stmt = db.prepare(`
          INSERT INTO section_views (page_view_id, section_id, section_title, visible_ms, created_at)
          VALUES (?, ?, ?, ?, ?)
        `);
        const insert = db.transaction((rows: typeof sections) => {
          for (const r of rows) {
            stmt.run(pv.id, String(r.id).slice(0, 120), String(r.title || '').slice(0, 250), Math.round(r.visibleMs), now);
          }
        });
        insert(sections);
      }
    }
  }

  db.prepare(`
    INSERT INTO events (page_view_id, visitor_id, type, payload, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(null, sess.visitorId, type, body?.payload ? String(body.payload).slice(0, 4000) : null, now);

  return NextResponse.json({ ok: true });
}
