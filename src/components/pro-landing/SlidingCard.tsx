'use client';

import React, { ReactNode } from 'react';
import styles from './SlidingCard.module.css';

interface SlidingCardProps {
  title: string;
  subtitle: string;
  text: string;
  button?: ReactNode;
  content?: ReactNode;
  background?: string;
  accent?: 'gold' | 'rust' | 'sage' | 'cream';
}

const ACCENT_BG: Record<NonNullable<SlidingCardProps['accent']>, string> = {
  gold: 'linear-gradient(135deg, #C9A668 0%, #A88B6A 100%)',
  rust: 'linear-gradient(135deg, #C8836E 0%, #B8775A 100%)',
  sage: 'linear-gradient(135deg, #A7BCA1 0%, #8EA38C 100%)',
  cream: 'linear-gradient(135deg, #F5EFE3 0%, #E5DFD1 100%)',
};

const SlidingCard: React.FC<SlidingCardProps> = ({
  title, subtitle, text, button, content, background, accent = 'gold',
}) => {
  return (
    <div
      className={styles.card}
      style={{ background: background ?? ACCENT_BG[accent] }}
    >
      <div className={styles.cardInner}>
        <div className={styles.left}>
          <span className={styles.subtitle}>{subtitle}</span>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.text}>{text}</p>
          {button && <div className={styles.button}>{button}</div>}
        </div>
        {content && <div className={styles.right}>{content}</div>}
      </div>
    </div>
  );
};

export default SlidingCard;
