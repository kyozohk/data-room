'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button as ButtonUI } from '../ui';
import styles from './FixedFooter.module.scss';
import WaitlistDialog from './WaitlistDialog';

// NOTE: Authentication / login flow is intentionally disabled for the
// public waitlist landing experience. The floating footer now opens a
// Join the Waitlist dialog that captures user details.
//
// import LoginDialog from '../auth/LoginDialog';
// import { useAuth } from '../../hooks/useAuth';
// import { signOutUser } from '../../lib/auth';
// import { useRouter } from 'next/navigation';

interface FixedFooterProps {
  className?: string;
}

const FixedFooter: React.FC<FixedFooterProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- Auth flow (disabled) ---------------------------------------------
  // const { user } = useAuth();
  // const router = useRouter();
  // const [isLoggingOut, setIsLoggingOut] = useState(false);
  //
  // useEffect(() => {
  //   if (user && pathname === '/') {
  //     router.push('/dashboard');
  //   }
  // }, [user, router, pathname]);
  //
  // const handleLogout = async () => {
  //   setIsLoggingOut(true);
  //   try { await signOutUser(); } finally { setIsLoggingOut(false); }
  // };
  // ----------------------------------------------------------------------

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  // Global trigger so any component (e.g. BottomText, SpheresLanding) can
  // open the waitlist dialog by dispatching window.dispatchEvent(new Event('open-waitlist')).
  useEffect(() => {
    const handler = () => setIsDialogOpen(true);
    window.addEventListener('open-waitlist', handler);
    return () => window.removeEventListener('open-waitlist', handler);
  }, []);

  // Don't render footer on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className={`${styles.fixedFooter} ${className}`}>
      <div className={styles.container}>
        <div className={styles.logoButtonContainer}>
          <Image
            src="/spheres-logo.png"
            alt="Spheres Technology Logo"
            width={110}
            height={32}
            className={styles.buttonLogo}
          />
          <ButtonUI
            variant="icon"
            onClick={openDialog}
            className={styles.joinButton}
            size="small"
          >
            Join the Waitlist
          </ButtonUI>
        </div>
      </div>

      <WaitlistDialog isOpen={isDialogOpen} onClose={closeDialog} />
    </footer>
  );
};

export default FixedFooter;
