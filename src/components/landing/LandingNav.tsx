'use client';

import Image from 'next/image';

const LandingNav = () => {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <Image src="/logo.svg" alt="Kyozo" width={24} height={24} />
      <span
        style={{
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
          fontWeight: 600,
          fontSize: '1rem',
          color: '#2d2d4e',
          letterSpacing: '-0.01em',
        }}
      >
        Kyozo
      </span>
    </nav>
  );
};

export default LandingNav;
