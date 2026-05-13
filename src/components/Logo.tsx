/**
 * Brand lockup for the dataroom. Renders as either:
 *  - the inline SVG "K" mark + "Kyozo" wordmark (default)
 *  - or, if /public/logo.svg has been replaced with the real KyozoVerse wordmark,
 *    drop in a <Image src="/logo.svg" /> instead.
 *
 * To use the official logo: copy `/Development/Kyozo/KyozoVerse/public/logo.svg`
 * into this project's `/public/logo.svg`, then swap this component to render
 * <Image src="/logo.svg" /> at appropriate dimensions.
 */
import * as React from 'react';

type Size = 'sm' | 'md' | 'lg';

export interface LogoProps {
  size?: Size;
  /** Show only the mark (no wordmark). */
  markOnly?: boolean;
  /** Show only the wordmark (no mark). */
  wordmarkOnly?: boolean;
  className?: string;
  /** Stack the wordmark + subtitle as in the sidebar (Kyozo / DATAROOM). */
  withSubtitle?: boolean;
}

const MARK_PX: Record<Size, number> = { sm: 22, md: 28, lg: 40 };
const WORD_PX: Record<Size, number> = { sm: 14, md: 17, lg: 22 };

export function Logo({
  size = 'md',
  markOnly = false,
  wordmarkOnly = false,
  withSubtitle = false,
  className = '',
}: LogoProps) {
  const mark = MARK_PX[size];
  const word = WORD_PX[size];
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}
    >
      {!wordmarkOnly && <LogoMark px={mark} />}
      {!markOnly && (
        <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1 }}>
          <span
            style={{
              fontFamily: 'var(--font-headline, var(--font-family))',
              fontSize: `${word}px`,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-color)',
            }}
          >
            Kyozo
          </span>
          {withSubtitle && (
            <span
              style={{
                fontSize: `${Math.max(9, word - 7)}px`,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                marginTop: '2px',
              }}
            >
              Dataroom
            </span>
          )}
        </span>
      )}
    </span>
  );
}

function LogoMark({ px }: { px: number }) {
  const id = React.useId();
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={`mk-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A88B6A" />
          <stop offset="100%" stopColor="#B8775A" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="14" fill="#FDFCFA" stroke="#D4C5B4" strokeWidth="1" />
      <path
        d="M 22 16 V 48 M 22 32 L 40 16 M 22 32 L 40 48"
        stroke={`url(#mk-${id})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
