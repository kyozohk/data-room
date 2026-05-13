'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../../login/login.module.css';

export default function AdminLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/admin';
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, role: 'admin' }),
    });
    setLoading(false);
    if (!res.ok) { setError('Wrong admin password.'); return; }
    router.replace(next);
    router.refresh();
  }

  return (
    <div className={styles.cardWrap}>
      <div className={styles.gradientBorder}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Admin sign-in</h2>
          <p className={styles.formSub}>Enter the admin password to access analytics.</p>
          <form onSubmit={onSubmit} className={styles.form}>
            <label className={styles.label}>
              Admin password
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </label>
            {error && <div className={styles.error}>{error}</div>}
            <button className={styles.button} disabled={loading || !password}>
              {loading ? 'Verifying…' : 'Continue'}
              <span className={styles.arrow}>→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
