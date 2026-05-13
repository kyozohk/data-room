'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';

export default function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/docs';
  const [password, setPassword] = useState('');
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, label, role: 'visitor' }),
    });
    setLoading(false);
    if (!res.ok) {
      setError('That password isn\'t right.');
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <div className={styles.cardWrap}>
      <div className={styles.gradientBorder}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Enter the dataroom</h2>
          <p className={styles.formSub}>Restricted access. Tell us who's visiting and enter the access password you were given.</p>
          <form onSubmit={onSubmit} className={styles.form}>
            <label className={styles.label}>
              Your name <span className={styles.optional}>(optional, helps us in the audit log)</span>
              <input
                className={styles.input}
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Jane Doe — Acme Ventures"
                autoComplete="off"
                maxLength={80}
              />
            </label>
            <label className={styles.label}>
              Access password
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="off"
                required
              />
            </label>
            {error && <div className={styles.error}>{error}</div>}
            <button className={styles.button} disabled={loading || !password}>
              {loading ? 'Verifying…' : 'Continue'}
              <span className={styles.arrow}>→</span>
            </button>
          </form>
          <p className={styles.legal}>
            By continuing you agree to keep all materials confidential. Each visit is logged with timestamps, IP, and pages viewed.
          </p>
        </div>
      </div>
    </div>
  );
}
