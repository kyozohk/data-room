import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './BackgroundImages.module.scss';

const BackgroundImages = () => {
  const leftImageRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation for left image
    if (leftImageRef.current) {
      leftImageRef.current.classList.add(styles.animateLeft);
    }
    
    // Animation for right image
    if (rightImageRef.current) {
      rightImageRef.current.classList.add(styles.animateRight);
    }
  }, []);

  return (
    <div className={styles.backgroundContainer}>
      <div className={`${styles.gradient} ${styles.bottomRight}`}></div>
      <div ref={leftImageRef} className={styles.leftImage}>
        <Image 
          src="/left-top.png" 
          alt="Decorative background element" 
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      <div ref={rightImageRef} className={styles.rightImage}>
        <Image 
          src="/right-top.png" 
          alt="Decorative background element" 
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      <div className={styles.middleTriangle}>
        <Image 
          src="/middle-triangle.png" 
          alt="Triangle icon" 
          width={340} 
          height={340} 
          style={{ objectFit: 'contain' }} 
          priority
        />
      </div>
      <div className={styles.middleCircle}>
        <Image 
          src="/middle-circle.png" 
          alt="Circle icon" 
          width={200} 
          height={200} 
          style={{ objectFit: 'contain' }} 
          priority
        />
      </div>
      <div className={styles.toolkitCircleComponent}>
        <div className={styles.circleComponentRing4}></div>
        <div className={styles.circleComponentRing3}></div>
        <div className={styles.circleComponentRing2}></div>
        <div className={styles.circleComponentRing1}></div>
      </div>    
      <div className={styles.toolkitBackgroundSvg}></div>
    </div>
  );
};

export default BackgroundImages;
