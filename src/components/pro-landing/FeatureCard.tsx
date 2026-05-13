'use client';

import React, { ReactNode } from 'react';
import Image from 'next/image';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  title?: string;
  description?: string;
  button?: ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title = 'Connect. Explore. Engage.',
  description = 'Connect with visionary creators and forward-thinking communities.',
  button,
}) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.backgroundGradient}>
        <div className={styles.phoneBackgroundGradient} />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.leftContent}>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.cardDescription}>{description}</p>
          {button && <div>{button}</div>}
        </div>

        <div className={styles.rightContent}>
          <div className={styles.phoneContainer}>
            <Image
              src="/iphone.png"
              alt="Phone"
              width={400}
              height={800}
              className={styles.phoneImage}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
