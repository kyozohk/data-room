'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiClock, FiBookOpen } from 'react-icons/fi';
import styles from './doc.module.css';

interface Props {
  slug: string;
  title: string;
  description?: string;
  category: string;
  updated: string;
  toc: { id: string; text: string; depth: number }[];
  html: string;
  rawHtml?: string;
}

export default function DocBody(props: Props) {
  const { slug, title, description, category, updated, toc, html, rawHtml } = props;
  const bodyRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionTimers = useRef<Record<string, { lastVisibleAt?: number; visibleMs: number; title: string }>>({});

  // Section-visibility analytics + active TOC highlighting
  useEffect(() => {
    if (rawHtml) return; // HTML iframe handles its own
    const root = bodyRef.current;
    if (!root) return;

    const headings = Array.from(root.querySelectorAll<HTMLElement>('[data-section]'));
    if (headings.length === 0) return;

    headings.forEach((h) => {
      sectionTimers.current[h.id] = { visibleMs: 0, title: h.textContent || '' };
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          const t = sectionTimers.current[id];
          if (!t) continue;
          if (entry.isIntersecting) {
            t.lastVisibleAt = now;
            setActiveId(id);
          } else if (t.lastVisibleAt) {
            t.visibleMs += now - t.lastVisibleAt;
            t.lastVisibleAt = undefined;
          }
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));

    // Flush dwell stats when leaving the page
    const flush = () => {
      const now = Date.now();
      const sections = Object.entries(sectionTimers.current).map(([id, t]) => {
        let visibleMs = t.visibleMs;
        if (t.lastVisibleAt) visibleMs += now - t.lastVisibleAt;
        return { id, title: t.title, visibleMs };
      }).filter((s) => s.visibleMs > 250);

      if (sections.length === 0) return;
      const data = JSON.stringify({ slug, sections });
      // navigator.sendBeacon for unload; fallback to fetch
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track/event', new Blob([JSON.stringify({ type: 'sections', payload: data })], { type: 'application/json' }));
      } else {
        fetch('/api/track/event', { method: 'POST', body: JSON.stringify({ type: 'sections', payload: data }), keepalive: true, headers: { 'Content-Type': 'application/json' } });
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    });
    window.addEventListener('beforeunload', flush);

    return () => {
      observer.disconnect();
      flush();
      document.removeEventListener('visibilitychange', flush);
      window.removeEventListener('beforeunload', flush);
    };
  }, [slug, html, rawHtml]);

  const tocItems = useMemo(() => toc.filter((t) => t.depth >= 2 && t.depth <= 3), [toc]);

  // Rough word-count → reading time for the markdown render
  const readingMins = useMemo(() => {
    if (rawHtml) return null;
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const words = text.split(' ').filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  }, [html, rawHtml]);

  return (
    <div className={styles.layout}>
      <div className={`${styles.main} fadeUp`}>
        <Link href="/docs" className={styles.backLink}>
          <FiArrowLeft size={14} /> All documents
        </Link>

        <div className={styles.crumbs}>
          <span className={styles.crumbChip}>{category}</span>
        </div>

        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.desc}>{description}</p>}

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <FiClock size={12} /> Updated {updated}
          </span>
          {readingMins && (
            <span className={styles.metaItem}>
              <FiBookOpen size={12} /> {readingMins} min read
            </span>
          )}
        </div>

        {rawHtml ? (
          <div className={styles.iframeWrap}>
            <iframe
              className={styles.iframe}
              srcDoc={rawHtml}
              sandbox="allow-same-origin allow-popups"
              title={title}
            />
            <div className={styles.iframeNote}>
              Original HTML rendering — opens in an isolated frame.
            </div>
          </div>
        ) : (
          <div
            ref={bodyRef}
            className={styles.prose}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>

      {tocItems.length > 0 && !rawHtml && (
        <aside className={styles.toc}>
          <div className={styles.tocLabel}>On this page</div>
          <ul className={styles.tocList}>
            {tocItems.map((t) => (
              <li
                key={t.id}
                className={`${styles.tocItem} ${activeId === t.id ? styles.tocActive : ''} ${t.depth === 3 ? styles.tocSub : ''}`}
              >
                <a href={`#${t.id}`}>{t.text}</a>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
