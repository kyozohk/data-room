'use client';
import React from 'react';
import styles from './FeatureCard.module.scss';
import Image from 'next/image';
import {Button as ButtonUI} from "../ui";

const FeatureCard = () => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.backgroundGradient}>
        <div className={styles.phoneBackgroundGradient}></div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.leftContent}>
          <h2 className={styles.cardTitle}>Connect. Explore. Engage.</h2>
          <p className={styles.cardDescription}>
            Connect with visionary creators and forward-thinking communities.
          </p>
          <div>
          <ButtonUI variant="outline-only" size="medium" href="#">Join the waitlist</ButtonUI>
          </div>
        </div>
        
        <div className={styles.rightContent}>
          <Image src="/iphone.png" alt="Phone" width={400} height={800} className={styles.phoneImage} />
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
