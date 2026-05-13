'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './BackgroundImages.module.css';

const BackgroundImages: React.FC = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (leftRef.current) leftRef.current.classList.add(styles.animateLeft);
    if (rightRef.current) rightRef.current.classList.add(styles.animateRight);
  }, []);

  return (
    <div className={styles.backgroundContainer} aria-hidden>
      <div className={`${styles.gradient} ${styles.bottomRight}`} />

      <div ref={leftRef} className={styles.leftImage}>
        <Image
          src="/left-top.png"
          alt=""
          fill
          sizes="20vw"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      <div ref={rightRef} className={styles.rightImage}>
        <Image
          src="/right-top.png"
          alt=""
          fill
          sizes="20vw"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      <div className={styles.middleTriangle}>
        <Image
          src="/middle-triangle.png"
          alt=""
          width={340}
          height={340}
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      <div className={styles.middleCircle}>
        <Image
          src="/middle-circle.png"
          alt=""
          width={200}
          height={200}
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      <div className={styles.toolkitCircleComponent}>
        <div className={styles.circleComponentRing4} />
        <div className={styles.circleComponentRing3} />
        <div className={styles.circleComponentRing2} />
        <div className={styles.circleComponentRing1} />
      </div>
    </div>
  );
};

export default BackgroundImages;
