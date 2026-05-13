import { Suspense } from 'react';
import LoginForm from './LoginForm';
import { Logo } from '@/components/Logo';
import { FiShield, FiLock, FiEye, FiCheckCircle } from 'react-icons/fi';
import styles from './login.module.css';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
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
            <FiShield size={14} />
            <span>Confidential — invite only</span>
          </div>
          <h1 className={styles.heroTitle}>
            The Kyozo <span className={styles.gradientText}>dataroom.</span>
          </h1>
          <p className={styles.heroSub}>
            Architecture, product, security, and company materials — curated for
            diligence partners, prospective hires, and select collaborators.
          </p>
          <ul className={styles.features}>
            <li>
              <span className={styles.featureIcon}><FiLock size={14} /></span>
              <span>Encrypted in transit, signed cookies on every page</span>
            </li>
            <li>
              <span className={styles.featureIcon}><FiEye size={14} /></span>
              <span>Audit trail on every visit — timestamps, IP, sections read</span>
            </li>
            <li>
              <span className={styles.featureIcon}><FiCheckCircle size={14} /></span>
              <span>Access revocable any time — nothing leaks downstream</span>
            </li>
          </ul>
        </div>

        <div className={styles.statRow}>
          <div className={styles.stat}>
            <div className={styles.statNum}>4</div>
            <div className={styles.statLabel}>Categories</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <div className={styles.statNum}>SOC 2</div>
            <div className={styles.statLabel}>Aligned</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <div className={styles.statNum}>V1</div>
            <div className={styles.statLabel}>Preview</div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
