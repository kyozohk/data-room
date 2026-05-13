'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button as ButtonUI } from '../ui';
import styles from './FixedFooter.module.scss';
import WaitlistDialog from './WaitlistDialog';

interface FixedFooterProps {
  className?: string;
}

/**
 * Fixed bottom CTA pill — KyozoVerse brand:
 *  - cream pill on cream page
 *  - inline "Kyozo" wordmark in brown
 *  - beige "Join the waitlist" button (KyozoVerse primary)
 */
const FixedFooter: React.FC<FixedFooterProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  useEffect(() => {
    const handler = () => setIsDialogOpen(true);
    window.addEventListener('open-waitlist', handler);
    return () => window.removeEventListener('open-waitlist', handler);
  }, []);

  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <footer className={`${styles.fixedFooter} ${className}`}>
      <div className={styles.container}>
        <div className={styles.logoButtonContainer}>
          <KyozoWordmark />
          <ButtonUI
            variant="icon"
            onClick={openDialog}
            className={styles.joinButton}
            size="small"
          >
            Join the waitlist
          </ButtonUI>
        </div>
      </div>

      <WaitlistDialog isOpen={isDialogOpen} onClose={closeDialog} />
    </footer>
  );
};

/* Inline Kyozo wordmark — warm taupe glyph + brown text, matches the
   muted-foreground / foreground tokens in KyozoVerse. */
function KyozoWordmark() {
  return (
    <span className={styles.brand} aria-label="Kyozo">
      <svg
        className={styles.brandMark}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="16" cy="16" r="4.5" fill="currentColor" />
      </svg>
      <span className={styles.brandText}>Kyozo</span>
    </span>
  );
}

export default FixedFooter;
