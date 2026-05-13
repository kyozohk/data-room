'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './ParallaxGallery.module.css';

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return { mousePosition, isHovering, setIsHovering };
}

interface ImageData { src: string; alt: string; }
interface Transform { x: number; y: number; rotate: number; }

const IMAGES: ImageData[] = [
  { src: '/Parallax1.jpg', alt: 'DJ at a concert with hands up' },
  { src: '/Parallax2.jpg', alt: 'Singer on stage with smoke' },
  { src: '/Parallax3.jpg', alt: 'Breakdancer performing a handstand' },
  { src: '/Parallax4.jpg', alt: 'Audience enjoying a concert' },
  { src: '/Parallax5.jpg', alt: 'Abstract red light streaks' },
];

const TARGET_TRANSFORMS: Transform[] = [
  { x: -12, y: -15, rotate: -8 },
  { x:  12, y: -12, rotate:  5 },
  { x:   0, y:   0, rotate:  0 },
  { x: -15, y:  15, rotate: -5 },
  { x:  15, y:  15, rotate:  8 },
];

const ParallaxImage: React.FC<{ image: ImageData; targetTransform: Transform; progress: number }> = ({
  image, targetTransform, progress,
}) => {
  const translateX = targetTransform.x * progress * 1.5;
  const translateY = targetTransform.y * progress * 1.5;
  const rotate = targetTransform.rotate * progress * 0.8;
  return (
    <div
      className={styles.parallaxImage}
      style={{
        transform: `translate(calc(-50% + ${translateX}vw), calc(-50% + ${translateY}vh)) rotate(${rotate}deg)`,
      }}
    >
      <div className={styles.parallaxImageContainer}>
        <img
          src={image.src}
          alt={image.alt}
          className={styles.parallaxImageImg}
          draggable={false}
        />
      </div>
    </div>
  );
};

const ParallaxGallery: React.FC = () => {
  const { mousePosition, isHovering, setIsHovering } = useMousePosition();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      let progress = 0;
      if (elementTop < windowHeight && elementTop + elementHeight > 0) {
        const visibleBottom = Math.min(elementHeight, windowHeight - elementTop);
        const visibleHeight = Math.max(0, visibleBottom);
        progress = Math.min(visibleHeight / (windowHeight * 0.8), 1);
      }
      setScrollProgress(progress);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.parallaxGallery}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={styles.parallaxGalleryBackground}>
        <div className={styles.parallaxGalleryViewport}>
          <div className={styles.parallaxGalleryRelative}>
            {IMAGES.map((image, index) => {
              const baseProgress = scrollProgress;
              const mouseInfluence = isHovering
                ? Math.min(Math.abs(mousePosition.x * 0.1) + Math.abs(mousePosition.y * 0.1), 0.2)
                : 0;
              const finalProgress = Math.min(baseProgress + mouseInfluence, 1);
              return (
                <ParallaxImage
                  key={image.src}
                  image={image}
                  targetTransform={TARGET_TRANSFORMS[index]}
                  progress={finalProgress}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxGallery;
