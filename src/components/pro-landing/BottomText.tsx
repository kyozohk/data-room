'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Image from 'next/image';
import ZoomText from './ZoomText';
import styles from './BottomText.module.css';

interface BottomTextProps {
  text?: string;
  fontSize?: string;
  fontWeight?: number;
  cta?: ReactNode;
  copyright?: string;
}

const BottomText: React.FC<BottomTextProps> = ({
  text = 'Join the creative universe',
  fontSize,
  fontWeight = 700,
  cta,
  copyright = `Copyright © ${new Date().getFullYear()} Kyozo. All rights reserved.`,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { setIsLoaded(true); }, []);

  return (
    <div className={styles.container}>
      <div className={styles.shapesContainer}>
        <div className={styles.leftShape}>
          <Image
            src="/bottom-left.png"
            alt=""
            width={200}
            height={200}
            className={isLoaded ? styles.imageLoaded : styles.imageLoading}
            style={{ objectFit: 'contain', objectPosition: 'left bottom' }}
          />
        </div>
        <div className={styles.rightShape}>
          <Image
            src="/bottom-right.png"
            alt=""
            width={200}
            height={200}
            className={isLoaded ? styles.imageLoaded : styles.imageLoading}
            style={{ objectFit: 'contain', objectPosition: 'right bottom' }}
          />
        </div>
      </div>

      <div className={styles.mainText}>
        <ZoomText text={text} fontSize={fontSize} fontWeight={fontWeight} duration="500ms" delay="300ms" />
      </div>

      {cta && (
        <div className={`${styles.buttonContainer} ${isLoaded ? styles.loaded : styles.loading}`}>
          {cta}
        </div>
      )}

      <div className={`${styles.copyright} ${isLoaded ? styles.loaded : styles.loading}`}>
        {copyright}
      </div>
    </div>
  );
};

export default BottomText;
