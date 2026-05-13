'use client';

import React, { useMemo } from 'react';
import styles from './BubbleMarquee.module.css';

const COLORS: Record<string, string> = {
  gold: '#A88B6A',
  rust: '#B8775A',
  sage: '#8EA38C',
  brown: '#5E4B3B',
  taupe: '#88796E',
};

interface BubbleItem { text: string; }

interface BubbleRowProps {
  items: BubbleItem[];
  direction: 'left' | 'right';
  speed?: number;
  color: keyof typeof COLORS;
}

const BubbleRow: React.FC<BubbleRowProps> = ({ items, direction, speed = 80, color }) => {
  const tint = COLORS[color];
  const repeated = useMemo(() => {
    const out: BubbleItem[] = [];
    for (let i = 0; i < 10; i++) out.push(...items);
    return out;
  }, [items]);
  return (
    <div className={styles.bubbleRowContainer}>
      <div
        className={`${styles.bubbleRow} ${direction === 'right' ? styles.toRight : styles.toLeft}`}
        style={{ ['--scroll-duration' as any]: `${speed}s` }}
      >
        {repeated.map((item, index) => (
          <div
            key={`item-${index}`}
            className={styles.bubble}
            style={{
              borderColor: tint,
              ['--hover-bg' as any]: tint,
              ['--hover-fg' as any]: '#FDFCFA',
            }}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

interface BubbleMarqueeProps {
  categories: {
    color: keyof typeof COLORS;
    items: BubbleItem[];
  }[];
  speed?: number;
}

const BubbleMarquee: React.FC<BubbleMarqueeProps> = ({ categories, speed = 100 }) => {
  return (
    <div className={styles.bubbleMarqueeContainer}>
      {categories.map((row, index) => (
        <BubbleRow
          key={`row-${index}`}
          items={row.items}
          direction={index % 2 === 0 ? 'left' : 'right'}
          speed={speed}
          color={row.color}
        />
      ))}
    </div>
  );
};

export default BubbleMarquee;
