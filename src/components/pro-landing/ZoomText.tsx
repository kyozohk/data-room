'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './ZoomText.module.css';

interface ZoomTextProps {
  text: string;
  fontSize?: string;
  fontWeight?: number;
  duration?: string;
  delay?: string;
}

const ZoomText: React.FC<ZoomTextProps> = ({
  text,
  fontSize,
  fontWeight = 700,
  duration = '500ms',
  delay = '0ms',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(t);
    }
  }, [inView]);

  return (
    <div ref={ref} className={styles.container}>
      <h2
        className={`${styles.title} ${isLoaded ? styles.loaded : styles.loading}`}
        style={{
          fontSize,
          fontWeight,
          transition: `transform ${duration} ease-out ${delay}, opacity ${duration} ease-out ${delay}`,
        }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className={styles.word}>
            {word.split('').map((letter, letterIndex) => (
              <span key={`${wordIndex}-${letterIndex}`} className={styles.letter}>{letter}</span>
            ))}
            {wordIndex < words.length - 1 && <span className={styles.space} />}
          </span>
        ))}
      </h2>
    </div>
  );
};

export default ZoomText;
