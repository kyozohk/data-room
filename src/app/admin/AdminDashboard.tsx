'use client';

import { useState } from 'react';
import { FiUsers, FiEye, FiClock, FiTrendingUp, FiLogOut, FiRefreshCw } from 'react-icons/fi';
import styles from './admin.module.css';

interface Stats {
  totals: { visitors: number; sessions: number; pageviews: number; total_active_ms: number };
  visitors: any[];
  pageStats: any[];
  sectionStats: any[];
  recent: any[];
}

function fmtDuration(ms: number) {
  if (!ms || ms < 1000) return '<1s';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}
function fmtRelative(ts: number) {
  if (!ts) return '—';
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default function AdminDashboard({ stats }: { stats: Stats }) {
  const [tab, setTab] = useState<'overview' | 'visitors' | 'pages' | 'sections' | 'recent'>('overview');

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headLeft}>
          <span className={styles.badge}><span className={styles.badgeDot} />Admin</span>
          <h1 className={styles.title}>Dataroom Analytics</h1>
        </div>
        <div className={styles.headRight}>
          <button className={styles.iconBtn} onClick={() => location.reload()} title="Refresh">
            <FiRefreshCw /> Refresh
          </button>
          <button className={styles.iconBtn} onClick={logout}>
            <FiLogOut /> Sign out
          </button>
        </div>
      </header>

      <div className={styles.kpis}>
        <Kpi icon={<FiUsers />} label="Unique visitors" value={stats.totals.visitors} accent="purple" />
        <Kpi icon={<FiEye />} label="Page views" value={stats.totals.pageviews} accent="pink" />
        <Kpi icon={<FiTrendingUp />} label="Sessions" value={stats.totals.sessions} accent="blue" />
        <Kpi icon={<FiClock />} label="Total active time" value={fmtDuration(stats.totals.total_active_ms)} accent="purple" />
      </div>

      <nav className={styles.tabs}>
        <Tab id="overview" cur={tab} on={setTab}>Overview</Tab>
        <Tab id="visitors" cur={tab} on={setTab}>Visitors ({stats.visitors.length})</Tab>
        <Tab id="pages" cur={tab} on={setTab}>Pages ({stats.pageStats.length})</Tab>
        <Tab id="sections" cur={tab} on={setTab}>Hot sections</Tab>
        <Tab id="recent" cur={tab} on={setTab}>Recent activity</Tab>
      </nav>

      {tab === 'overview' && (
        <div className={styles.split}>
          <Section title="Most-viewed pages">
            {stats.pageStats.slice(0, 8).length === 0 && <Empty />}
            <div className={styles.bars}>
              {stats.pageStats.slice(0, 8).map((p: any) => {
                const max = stats.pageStats[0]?.total_active_ms || 1;
                const pct = Math.round((p.total_active_ms / max) * 100);
                return (
                  <div key={p.path} className={styles.bar}>
                    <div className={styles.barLabel}>
                      <span className={styles.barTitle}>{p.title || p.path}</span>
                      <span className={styles.barMeta}>{p.views} views · {fmtDuration(p.total_active_ms)}</span>
                    </div>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section title="Top visitors by time">
            {stats.visitors.length === 0 && <Empty />}
            <ul className={styles.list}>
              {stats.visitors.slice(0, 8).map((v: any) => (
                <li key={v.id} className={styles.row}>
                  <div>
                    <div className={styles.rowTitle}>{v.label || `Anonymous ${v.id.slice(0, 6)}`}</div>
                    <div className={styles.rowSub}>{v.page_views} pages · last seen {fmtRelative(v.last_seen)}</div>
                  </div>
                  <div className={styles.rowVal}>{fmtDuration(v.total_active_ms)}</div>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}

      {tab === 'visitors' && (
        <Section title="All visitors">
          {stats.visitors.length === 0 && <Empty />}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Pages viewed</th>
                <th>Active time</th>
                <th>Visits</th>
                <th>First seen</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody>
              {stats.visitors.map((v: any) => (
                <tr key={v.id}>
                  <td>
                    <div className={styles.rowTitle}>{v.label || `Anon ${v.id.slice(0, 6)}`}</div>
                    <div className={styles.idMono}>{v.id}</div>
                  </td>
                  <td>{v.page_views}</td>
                  <td>{fmtDuration(v.total_active_ms)}</td>
                  <td>{v.visit_count}</td>
                  <td>{fmtRelative(v.first_seen)}</td>
                  <td>{fmtRelative(v.last_seen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {tab === 'pages' && (
        <Section title="Pages">
          {stats.pageStats.length === 0 && <Empty />}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Page</th>
                <th>Views</th>
                <th>Unique</th>
                <th>Active time</th>
                <th>Avg active / view</th>
                <th>Avg scroll</th>
              </tr>
            </thead>
            <tbody>
              {stats.pageStats.map((p: any) => (
                <tr key={p.path}>
                  <td>
                    <div className={styles.rowTitle}>{p.title || p.path}</div>
                    <div className={styles.idMono}>{p.path}</div>
                  </td>
                  <td>{p.views}</td>
                  <td>{p.unique_visitors}</td>
                  <td>{fmtDuration(p.total_active_ms)}</td>
                  <td>{fmtDuration(p.avg_active_ms)}</td>
                  <td>{Math.round(p.avg_max_scroll)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {tab === 'sections' && (
        <Section title="Hottest sections (where visitors lingered)">
          {stats.sectionStats.length === 0 && <Empty hint="Section dwell data appears once visitors read docs that have headings (h2/h3)." />}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Doc</th>
                <th>Section</th>
                <th>Total visible</th>
                <th>Times shown</th>
              </tr>
            </thead>
            <tbody>
              {stats.sectionStats.map((s: any, i: number) => (
                <tr key={i}>
                  <td className={styles.idMono}>{s.doc_slug}</td>
                  <td>{s.section_title || s.section_id}</td>
                  <td>{fmtDuration(s.total_visible_ms)}</td>
                  <td>{s.appearances}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {tab === 'recent' && (
        <Section title="Recent activity">
          {stats.recent.length === 0 && <Empty />}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>When</th>
                <th>Visitor</th>
                <th>Page</th>
                <th>Active</th>
                <th>Scroll</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((r: any, i: number) => (
                <tr key={i}>
                  <td>{fmtRelative(r.opened_at)}</td>
                  <td>{r.visitor_label || `Anon ${r.visitor_id.slice(0, 6)}`}</td>
                  <td>
                    <div className={styles.rowTitle}>{r.title || r.path}</div>
                    <div className={styles.idMono}>{r.path}</div>
                  </td>
                  <td>{fmtDuration(r.active_ms)}</td>
                  <td>{r.max_scroll_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}
    </div>
  );
}

function Kpi({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent: 'purple' | 'pink' | 'blue' }) {
  return (
    <div className="gradientBorder">
      <div className={`card ${styles.kpi} ${styles[`accent_${accent}`]}`}>
        <div className={styles.kpiIcon}>{icon}</div>
        <div>
          <div className={styles.kpiValue}>{value}</div>
          <div className={styles.kpiLabel}>{label}</div>
        </div>
      </div>
    </div>
  );
}

function Tab({ id, cur, on, children }: any) {
  return (
    <button
      className={`${styles.tab} ${cur === id ? styles.tabActive : ''}`}
      onClick={() => on(id)}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="gradientBorder">
      <div className={`card ${styles.section}`}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {children}
      </div>
    </div>
  );
}
function Empty({ hint }: { hint?: string }) {
  return <div className={styles.empty}>{hint || 'No data yet — visit a doc as a visitor to populate this.'}</div>;
}
