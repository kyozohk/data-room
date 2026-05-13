'use client';

import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  text?: string;
  subtitle?: string;
  cta?: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({
  text = 'Welcome to the Kyozo Dataroom',
  subtitle,
  cta,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const words = text.split(' ');

  useEffect(() => { setIsLoaded(true); }, []);

  return (
    <div className={styles.heroContainer}>
      <div className={`${styles.gradient} ${styles.topLeft}`} />
      <div className={`${styles.gradient} ${styles.topRight}`} />

      <div className={styles.topAnimationContainer}>
        <svg width="100%" height="100%" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className={styles.animatedSvg}>
            <circle cx="440" cy="440" r="120" stroke="#A88B6A" strokeOpacity="1.0" strokeWidth="40" />
            <circle cx="440" cy="440" r="220" stroke="#A88B6A" strokeOpacity="0.7" strokeWidth="40" />
          </g>
        </svg>
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className={styles.word}>
              {word.split('').map((letter, letterIndex) => (
                <span
                  key={`${wordIndex}-${letterIndex}`}
                  className={`${styles.letter} ${isLoaded ? styles.loaded : ''}`}
                  style={{ transitionDelay: `${(wordIndex * word.length + letterIndex) * 0.05}s` }}
                >
                  {letter === ' ' ? ' ' : letter}
                </span>
              ))}
              {wordIndex < words.length - 1 && <span className={styles.wordSpace} />}
            </span>
          ))}
        </h1>
        {subtitle && (
          <p className={`${styles.heroSubtitle} ${isLoaded ? styles.loaded : ''}`}>
            {subtitle}
          </p>
        )}
        {cta && (
          <div className={`${styles.heroCta} ${isLoaded ? styles.loaded : ''}`}>
            {cta}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
