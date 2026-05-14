'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getCategoryColors, type CategoryKey } from '@/lib/theme-colors';

interface BubbleItem {
  text: string;
}

interface BubbleCategory {
  category: string;
  items: BubbleItem[];
}

interface BubbleRowProps {
  items: BubbleItem[];
  direction: 'left' | 'right';
  speed?: number;
  category: string;
}

function BubblePill({ text, bg, border }: { text: string; bg: string; border: string }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem 3.5rem',
        borderRadius: '9999px',
        border: `1px solid ${border}`,
        backgroundColor: hovered ? bg : 'transparent',
        color: '#444444',
        fontSize: '1.1rem',
        fontWeight: 300,
        whiteSpace: 'nowrap' as const,
        cursor: 'default',
        transition: 'background-color 0.25s ease',
        flexShrink: 0,
      }}
    >
      {text}
    </div>
  );
}

const BubbleRow: React.FC<BubbleRowProps> = ({ 
  items, 
  direction, 
  speed = 80, 
  category 
}) => {
  const repeatedItems = useMemo(() => {
    const repeated: BubbleItem[] = [];
    for (let i = 0; i < 4; i++) {
      repeated.push(...items);
    }
    return repeated;
  }, [items]);
  
  const colors = getCategoryColors(category as CategoryKey);
  
  return (
    <div className="relative w-full overflow-hidden h-20 mb-px p-0">
      <div 
        className={cn(
          'absolute flex items-center whitespace-nowrap will-change-transform',
          direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'
        )}
        style={{ '--scroll-duration': `${speed}s` } as React.CSSProperties}
      >
        {repeatedItems.map((item, index) => (
          <BubblePill
            key={`item-${index}`}
            text={item.text}
            bg={colors.bg}
            border={colors.border}
          />
        ))}
      </div>
    </div>
  );
};

interface BubbleMarqueeProps {
  categories: BubbleCategory[];
}

const BubbleMarquee: React.FC<BubbleMarqueeProps> = ({ categories }) => {
  return (
    <div className="w-full block overflow-hidden pt-32">
      {categories.map((row, index) => (
        <BubbleRow 
          key={`row-${index}`}
          items={row.items}
          direction={index % 2 === 0 ? 'left' : 'right'}
          speed={100}
          category={row.category}
        />
      ))}
    </div>
  );
};

export default BubbleMarquee;
