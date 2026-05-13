'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  FiCode, FiBriefcase, FiShield, FiDollarSign, FiFolder, FiSearch, FiLogOut, FiHome,
} from 'react-icons/fi';
import type { DocCategory, DocMeta } from '@/lib/content';
import { Logo } from './Logo';
import styles from './Sidebar.module.css';

const ICONS: Record<string, any> = {
  FiCode, FiBriefcase, FiShield, FiDollarSign, FiFolder,
};

export default function Sidebar({
  categories, docs,
}: { categories: DocCategory[]; docs: DocMeta[] }) {
  const pathname = usePathname();
  const [q, setQ] = useState('');

  const grouped = useMemo(() => {
    const filt = q.trim().toLowerCase();
    return categories.map((c) => {
      const items = docs
        .filter((d) => d.category === c.id)
        .filter((d) => !filt || d.title.toLowerCase().includes(filt) || d.filename.toLowerCase().includes(filt));
      return { cat: c, items };
    }).filter((g) => g.items.length > 0 || !filt);
  }, [categories, docs, q]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Logo size="md" withSubtitle />
      </div>

      <div className={styles.searchWrap}>
        <FiSearch className={styles.searchIcon} />
        <input
          className={styles.search}
          placeholder="Search docs…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <Link
        href="/docs"
        className={`${styles.navHomeItem} ${pathname === '/docs' ? styles.active : ''}`}
      >
        <FiHome /> <span>Overview</span>
      </Link>

      <nav className={styles.nav}>
        {grouped.map(({ cat, items }) => {
          const Icon = ICONS[cat.icon] || FiFolder;
          return (
            <div key={cat.id} className={styles.group}>
              <div className={styles.groupHeader}>
                <Icon /> <span>{cat.label}</span>
                <span className={styles.count}>{items.length}</span>
              </div>
              <ul className={styles.list}>
                {items.map((d) => {
                  const href = `/docs/${d.slug}`;
                  const active = pathname === href;
                  return (
                    <li key={d.slug}>
                      <Link href={href} className={`${styles.item} ${active ? styles.active : ''}`}>
                        <span className={styles.dot} />
                        <span className={styles.itemTitle}>{d.title}</span>
                      </Link>
                    </li>
                  );
                })}
                {items.length === 0 && <li className={styles.empty}>No matches</li>}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button className={styles.logout} onClick={logout}>
          <FiLogOut /> <span>Sign out</span>
        </button>
        <div className={styles.legal}>
          Confidential — © Kyozo
        </div>
      </div>
    </aside>
  );
}
