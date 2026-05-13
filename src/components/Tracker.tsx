'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const IDLE_AFTER_MS = 30_000; // user is "idle" if no input for 30s

export default function Tracker() {
  const pathname = usePathname();
  const stateRef = useRef<{
    pageViewId: string | null;
    enteredAt: number;
    activeMs: number;
    lastActiveAt: number;
    maxScrollPct: number;
    flushed: boolean;
  }>({
    pageViewId: null,
    enteredAt: Date.now(),
    activeMs: 0,
    lastActiveAt: Date.now(),
    maxScrollPct: 0,
    flushed: false,
  });

  useEffect(() => {
    const s = stateRef.current;
    s.pageViewId = null;
    s.enteredAt = Date.now();
    s.activeMs = 0;
    s.lastActiveAt = Date.now();
    s.maxScrollPct = 0;
    s.flushed = false;

    const title = typeof document !== 'undefined' ? document.title : '';

    // Open the page view
    fetch('/api/track/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'open', path: pathname, title, referrer: document.referrer }),
    })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.pageViewId) s.pageViewId = d.pageViewId; })
      .catch(() => {});

    // Active-time tracking
    const bumpActive = () => {
      const now = Date.now();
      if (now - s.lastActiveAt < IDLE_AFTER_MS) {
        s.activeMs += now - s.lastActiveAt;
      }
      s.lastActiveAt = now;
    };
    const onActivity = () => { bumpActive(); };
    ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach((evt) =>
      window.addEventListener(evt, onActivity, { passive: true })
    );

    // Scroll depth
    const onScroll = () => {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, Math.round((window.scrollY / total) * 100)));
      if (pct > s.maxScrollPct) s.maxScrollPct = pct;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Heartbeat update every 20s
    const heartbeat = setInterval(() => {
      if (s.flushed || !s.pageViewId) return;
      bumpActive();
      const dwellMs = Date.now() - s.enteredAt;
      fetch('/api/track/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'heartbeat',
          pageViewId: s.pageViewId,
          dwellMs,
          activeMs: s.activeMs,
          maxScrollPct: s.maxScrollPct,
        }),
      }).catch(() => {});
    }, 20_000);

    const flush = () => {
      if (s.flushed || !s.pageViewId) return;
      s.flushed = true;
      bumpActive();
      const dwellMs = Date.now() - s.enteredAt;
      const body = JSON.stringify({
        action: 'close',
        pageViewId: s.pageViewId,
        dwellMs,
        activeMs: s.activeMs,
        maxScrollPct: s.maxScrollPct,
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track/pageview', new Blob([body], { type: 'application/json' }));
      } else {
        fetch('/api/track/pageview', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } });
      }
    };
    const onVis = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('beforeunload', flush);
    window.addEventListener('pagehide', flush);

    return () => {
      flush();
      clearInterval(heartbeat);
      ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach((evt) =>
        window.removeEventListener(evt, onActivity)
      );
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('beforeunload', flush);
      window.removeEventListener('pagehide', flush);
    };
  }, [pathname]);

  return null;
}
