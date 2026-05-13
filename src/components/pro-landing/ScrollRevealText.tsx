'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './ScrollRevealText.module.css';

interface ScrollRevealTextProps {
  text: string;
  fontSize?: string;
  fontWeight?: number;
  revealSpeed?: number;
}

const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({
  text,
  fontSize,
  fontWeight = 700,
  revealSpeed = 1.0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const words = text.split(' ');
  const totalLetters = words.reduce((acc, word) => acc + word.length, 0) + words.length - 1;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      let visiblePercentage = 0;
      if (elementBottom <= 0) visiblePercentage = 1;
      else if (elementTop >= windowHeight) visiblePercentage = 0;
      else {
        const totalScrollDistance = windowHeight + elementHeight * 0.7;
        const scrolledDistance = windowHeight - elementTop;
        visiblePercentage = Math.min(Math.max(scrolledDistance / totalScrollDistance, 0), 1);
      }
      const scaledProgress = Math.min(visiblePercentage / 0.5, 1);
      const adjustedProgress = Math.pow(scaledProgress, 1 / revealSpeed);
      setScrollProgress(adjustedProgress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [revealSpeed]);

  return (
    <div ref={containerRef} className={styles.scrollRevealContainer}>
      <h2
        className={styles.scrollRevealText}
        style={{ fontSize: fontSize, fontWeight }}
      >
        {words.map((word, wordIndex) => {
          const previousWordsLetterCount = words
            .slice(0, wordIndex)
            .reduce((acc, w) => acc + w.length, 0) + wordIndex;
          return (
            <span key={wordIndex} className={styles.word}>
              {word.split('').map((letter, letterIndex) => {
                const overallLetterIndex = previousWordsLetterCount + letterIndex;
                const letterThreshold = overallLetterIndex / totalLetters;
                const isRevealed = scrollProgress >= letterThreshold;
                const transitionDelay = `${overallLetterIndex * 0.04}s`;
                return (
                  <span
                    key={`${wordIndex}-${letterIndex}`}
                    className={`${styles.letter} ${isRevealed ? styles.revealed : ''}`}
                    style={{ transitionDelay }}
                  >
                    {letter === ' ' ? ' ' : letter}
                  </span>
                );
              })}
              {wordIndex < words.length - 1 && <span className={styles.wordSpace} />}
            </span>
          );
        })}
      </h2>
    </div>
  );
};

export default ScrollRevealText;
