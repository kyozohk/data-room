'use client';

import React, { useMemo } from 'react';
import styles from './BubbleMarquee.module.scss';

// Bubble row colours — KyozoVerse warm palette. Each category gets a
// muted earth-tone border that sits comfortably on the #FDFCFA cream.
const bubbleRowColors = {
  music:        '#A88B6A', // gold (the brand primary accent)
  artMovements: '#88796E', // taupe (headline tone)
  crafts:       '#B8775A', // rust
  fashion:      '#C19A6B', // softer gold
  performance:  '#8EA38C', // sage
  techno:       '#A88B6A',
  futurism:     '#88796E',
  classicism:   '#A89380', // light taupe
  jewelry:      '#C9A668', // wheat
  vintage:      '#B8775A',
  minimal:      '#8EA38C',
};

interface BubbleItem {
  text: string;
  color?: string;
  spaceBefore?: 'none' | 'small' | 'medium';
  spaceAfter?: 'none' | 'small' | 'medium';
}

interface BubbleRowProps {
  items: BubbleItem[];
  direction: 'left' | 'right';
  speed?: number;
  category: keyof typeof bubbleRowColors;
}

const BubbleRow: React.FC<BubbleRowProps> = ({ 
  items, 
  direction, 
  speed = 10, 
  category 
}) => {
  const rowColor = bubbleRowColors[category];
  
  // Use items directly since we now have multiple items per row
  const enhancedItems = useMemo(() => {
    // No need for special handling since we have multiple items per row
    return items;
  }, [items]);
  
  // Create enough duplicates to fill the screen width
  const repeatedItems = useMemo(() => {
    // Create enough sets of items to ensure the row is never empty
    const repeated = [];
    for (let i = 0; i < 10; i++) {
      repeated.push(...enhancedItems);
    }
    return repeated;
  }, [enhancedItems]);
  
  return (
    <div className={styles.bubbleRowContainer}>
      <div 
        className={`${styles.bubbleRow} ${direction === 'right' ? styles.toRight : styles.toLeft}`}
        style={{ 
          '--scroll-duration': `${speed}s`,
        } as React.CSSProperties}
      >
        {repeatedItems.map((item, index) => {
          // No additional spacing needed since bubbles now touch each other
          const spacingStyle: React.CSSProperties = {};
          
          return (
            <div 
              key={`item-${index}`} 
              className={styles.bubble}
              style={{ 
                borderColor: rowColor,
                '--hover-bg': rowColor,
                ...spacingStyle
              } as React.CSSProperties}
            >
              {item.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface BubbleMarqueeProps {
  categories: {
    category: keyof typeof bubbleRowColors;
    items: BubbleItem[];
  }[];
}

const BubbleMarquee: React.FC<BubbleMarqueeProps> = ({ categories }) => {
  return (
    <div className={styles.bubbleMarqueeContainer}>
      {categories.map((row, index) => (
        <BubbleRow 
          key={`row-${index}`}
          items={row.items}
          direction={index % 2 === 0 ? 'left' : 'right'}
          speed={100} // Moderate speed for smooth animation
          category={row.category}
        />
      ))}
    </div>
  );
};

export default BubbleMarquee;
