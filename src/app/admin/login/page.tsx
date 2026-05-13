import { Suspense } from 'react';
import AdminLoginForm from './AdminLoginForm';
import { Logo } from '@/components/Logo';
import { FiBarChart2, FiClock, FiTrendingUp } from 'react-icons/fi';
import styles from '../../login/login.module.css';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <div className={styles.shell}>
      <div className={styles.left}>
        <div className={styles.bgGrid} />
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.glow3} />

        <div className={styles.topRow}>
          <Logo size="md" withSubtitle />
        </div>

        <div className={styles.heroBlock}>
          <div className={styles.chip}>
            <FiBarChart2 size={14} />
            <span>Analytics — admins only</span>
          </div>
          <h1 className={styles.heroTitle}>
            See who read <span className={styles.gradientText}>what.</span>
          </h1>
          <p className={styles.heroSub}>
            Per-visitor breakdown, time-on-page, section dwell, and the heatmap
            of which materials people actually open.
          </p>
          <ul className={styles.features}>
            <li>
              <span className={styles.featureIcon}><FiClock size={14} /></span>
              <span>Active time per visitor and per doc — idle excluded</span>
            </li>
            <li>
              <span className={styles.featureIcon}><FiTrendingUp size={14} /></span>
              <span>Hot-section view — which paragraphs got read carefully</span>
            </li>
            <li>
              <span className={styles.featureIcon}><FiBarChart2 size={14} /></span>
              <span>Page-level scroll depth and visit recency</span>
            </li>
          </ul>
        </div>

        <div className={styles.statRow}>
          <div className={styles.stat}>
            <div className={styles.statNum}>Live</div>
            <div className={styles.statLabel}>Tracking</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <div className={styles.statNum}>SQLite</div>
            <div className={styles.statLabel}>Local store</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <div className={styles.statNum}>No 3P</div>
            <div className={styles.statLabel}>Trackers</div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <Suspense fallback={null}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
