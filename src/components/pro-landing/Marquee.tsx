'use client';

import React, { useMemo } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import styles from './Marquee.module.css';

type CategoryType = 'gold' | 'rust' | 'sage' | 'cream';

interface Item { text: string; }

interface RowProps {
  items: Item[];
  direction: 'left' | 'right';
  speed?: number;
  category: CategoryType;
}

const Row: React.FC<RowProps> = ({ items, direction, speed = 80, category }) => {
  const repeated = useMemo(() => {
    const out: Item[] = [];
    for (let i = 0; i < 4; i++) out.push(...items);
    return out;
  }, [items]);
  return (
    <div className={styles.rowContainer}>
      <div
        className={`${styles.row} ${direction === 'right' ? styles.toRight : styles.toLeft}`}
        style={{ ['--scroll-duration' as any]: `${speed}s` }}
      >
        {repeated.map((item, index) => (
          <div key={`item-${index}`} className={`${styles.item} ${styles[category]}`}>
            <FiCheckCircle size={20} />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface MarqueeProps {
  categories: { category: CategoryType; items: Item[] }[];
  speed?: number;
}

const Marquee: React.FC<MarqueeProps> = ({ categories, speed = 80 }) => {
  return (
    <div className={styles.marqueeContainer}>
      {categories.map((row, index) => (
        <Row
          key={`row-${index}`}
          items={row.items}
          direction={index % 2 === 0 ? 'left' : 'right'}
          speed={speed}
          category={row.category}
        />
      ))}
    </div>
  );
};

export default Marquee;
