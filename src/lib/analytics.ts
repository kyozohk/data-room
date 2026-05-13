import { getDb } from './db';

export interface VisitorRow {
  id: string;
  label: string | null;
  first_seen: number;
  last_seen: number;
  visit_count: number;
  total_dwell_ms: number;
  total_active_ms: number;
  page_views: number;
}

export interface PageStatRow {
  path: string;
  doc_slug: string | null;
  title: string | null;
  views: number;
  unique_visitors: number;
  total_dwell_ms: number;
  total_active_ms: number;
  avg_active_ms: number;
  avg_max_scroll: number;
}

export interface SectionStatRow {
  doc_slug: string;
  section_id: string;
  section_title: string | null;
  total_visible_ms: number;
  appearances: number;
}

export interface RecentVisitRow {
  visitor_id: string;
  visitor_label: string | null;
  path: string;
  title: string | null;
  opened_at: number;
  dwell_ms: number;
  active_ms: number;
  max_scroll_pct: number;
}

export function getOverviewStats() {
  const db = getDb();

  const totals = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM visitors) AS visitors,
      (SELECT COUNT(*) FROM sessions) AS sessions,
      (SELECT COUNT(*) FROM page_views) AS pageviews,
      (SELECT COALESCE(SUM(active_ms), 0) FROM page_views) AS total_active_ms
  `).get() as { visitors: number; sessions: number; pageviews: number; total_active_ms: number };

  const visitors = db.prepare(`
    SELECT v.id, v.label, v.first_seen, v.last_seen, v.visit_count,
           COALESCE(SUM(pv.dwell_ms), 0) AS total_dwell_ms,
           COALESCE(SUM(pv.active_ms), 0) AS total_active_ms,
           COUNT(pv.id) AS page_views
      FROM visitors v
      LEFT JOIN page_views pv ON pv.visitor_id = v.id
     GROUP BY v.id
     ORDER BY v.last_seen DESC
     LIMIT 100
  `).all() as VisitorRow[];

  const pageStats = db.prepare(`
    SELECT pv.path, pv.doc_slug,
           MAX(pv.title) AS title,
           COUNT(*) AS views,
           COUNT(DISTINCT pv.visitor_id) AS unique_visitors,
           COALESCE(SUM(pv.dwell_ms), 0) AS total_dwell_ms,
           COALESCE(SUM(pv.active_ms), 0) AS total_active_ms,
           COALESCE(AVG(pv.active_ms), 0) AS avg_active_ms,
           COALESCE(AVG(pv.max_scroll_pct), 0) AS avg_max_scroll
      FROM page_views pv
     GROUP BY pv.path
     ORDER BY total_active_ms DESC
     LIMIT 50
  `).all() as PageStatRow[];

  const sectionStats = db.prepare(`
    SELECT pv.doc_slug AS doc_slug,
           sv.section_id,
           MAX(sv.section_title) AS section_title,
           SUM(sv.visible_ms) AS total_visible_ms,
           COUNT(*) AS appearances
      FROM section_views sv
      JOIN page_views pv ON pv.id = sv.page_view_id
     WHERE pv.doc_slug IS NOT NULL
     GROUP BY pv.doc_slug, sv.section_id
     HAVING total_visible_ms > 1000
     ORDER BY total_visible_ms DESC
     LIMIT 30
  `).all() as SectionStatRow[];

  const recent = db.prepare(`
    SELECT pv.visitor_id, v.label AS visitor_label,
           pv.path, pv.title, pv.opened_at, pv.dwell_ms, pv.active_ms, pv.max_scroll_pct
      FROM page_views pv
      JOIN visitors v ON v.id = pv.visitor_id
     ORDER BY pv.opened_at DESC
     LIMIT 30
  `).all() as RecentVisitRow[];

  return { totals, visitors, pageStats, sectionStats, recent };
}
