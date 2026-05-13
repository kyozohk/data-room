import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, 'analytics.db');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  initSchema(db);
  _db = db;
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
      id TEXT PRIMARY KEY,
      label TEXT,
      first_seen INTEGER NOT NULL,
      last_seen INTEGER NOT NULL,
      visit_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      visitor_id TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      last_active_at INTEGER NOT NULL,
      ended_at INTEGER,
      ip TEXT,
      user_agent TEXT,
      referrer TEXT,
      FOREIGN KEY (visitor_id) REFERENCES visitors(id)
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_visitor ON sessions(visitor_id);

    CREATE TABLE IF NOT EXISTS page_views (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      path TEXT NOT NULL,
      title TEXT,
      doc_slug TEXT,
      doc_section TEXT,
      opened_at INTEGER NOT NULL,
      closed_at INTEGER,
      dwell_ms INTEGER NOT NULL DEFAULT 0,
      active_ms INTEGER NOT NULL DEFAULT 0,
      max_scroll_pct INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );
    CREATE INDEX IF NOT EXISTS idx_pv_session ON page_views(session_id);
    CREATE INDEX IF NOT EXISTS idx_pv_visitor ON page_views(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_pv_path ON page_views(path);

    CREATE TABLE IF NOT EXISTS section_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_view_id TEXT NOT NULL,
      section_id TEXT NOT NULL,
      section_title TEXT,
      visible_ms INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (page_view_id) REFERENCES page_views(id)
    );
    CREATE INDEX IF NOT EXISTS idx_sv_page ON section_views(page_view_id);

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_view_id TEXT,
      visitor_id TEXT,
      type TEXT NOT NULL,
      payload TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_ev_visitor ON events(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_ev_type ON events(type);
  `);
}
