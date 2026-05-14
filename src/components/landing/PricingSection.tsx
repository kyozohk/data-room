'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { pricingData } from '../../data/pricingData';
import PricingCard from './PricingCard';
import styles from './PricingSection.module.scss';
import {Button as ButtonUI} from "../ui";

// Dynamically import PriceCircles with SSR disabled to avoid hydration issues
const PriceCircles = dynamic(() => import('./PriceCircles'), {
  ssr: false,
  loading: () => <div className={styles.container} />,
});

const PricingSection = () => {
  return (
    <section className={styles.pricingSection}>
      {/* Background with animated circles */}
      <div className={styles.background}>
        <PriceCircles />
      </div>
      
      {/* Content overlay */}
      <div className={styles.content}>
        {/* Pricing cards */}
        <div className={styles.pricingGrid}>
          {pricingData.map((data) => (
            <div key={data.title} className={styles.pricingCardWrapper}>
              <PricingCard 
                {...data} 
                features={data.features}
              />
            </div>
          ))}
        </div>
        <ButtonUI variant="outline-only" href="#">Enter the Dataroom</ButtonUI>
      </div>
    </section>
  );
};

export default PricingSection;
