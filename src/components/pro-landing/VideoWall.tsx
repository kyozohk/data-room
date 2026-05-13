'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import styles from './VideoWall.module.css';

const ROW_COUNT = 12;
const VIDEO_SOURCES = [
  '/city.mp4',
  '/concert.mp4',
  '/crafting.mp4',
  '/dancer.mp4',
  '/lights.mp4',
  '/paint.mp4',
  '/city.mp4',
  '/concert.mp4',
  '/performance.mp4',
  '/pottery.mp4',
  '/prod.mp4',
  '/producing.mp4',
];

interface BrickProps { videoSrc: string; }
const Brick: React.FC<BrickProps> = ({ videoSrc }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.load();
      ref.current.play().catch(() => { /* autoplay rejection — ignore */ });
    }
  }, [videoSrc]);
  return (
    <div className={styles.brick}>
      <video ref={ref} src={videoSrc} autoPlay muted loop playsInline />
    </div>
  );
};

interface RowProps {
  layout: 'A' | 'B';
  videos: [string, string];
  rowIndex: number;
}
const Row: React.FC<RowProps> = ({ layout, videos, rowIndex }) => {
  const cls = layout === 'A' ? styles.layoutA : styles.layoutB;
  return (
    <div className={`${styles.row} ${cls}`}>
      <div key={`brick-${rowIndex}-0`}><Brick videoSrc={videos[0]} /></div>
      <div key={`brick-${rowIndex}-1`}><Brick videoSrc={videos[1]} /></div>
    </div>
  );
};

interface RowData { id: number; layout: 'A' | 'B'; videos: [string, string]; }

const VideoWall: React.FC = () => {
  const initialRows = useMemo<RowData[]>(() =>
    Array.from({ length: ROW_COUNT }, (_, i) => {
      const a = (i * 2) % VIDEO_SOURCES.length;
      const b = (a + 1) % VIDEO_SOURCES.length;
      return {
        id: i,
        layout: i % 2 === 0 ? 'A' : 'B',
        videos: [VIDEO_SOURCES[a], VIDEO_SOURCES[b]],
      };
    }), []);

  const doubledRows = [...initialRows, ...initialRows];

  useEffect(() => {
    const t = setTimeout(() => {
      const videos = document.querySelectorAll('.videoWall video');
      videos.forEach((v, i) => {
        setTimeout(() => {
          if (v instanceof HTMLVideoElement) v.load();
        }, i * 100);
      });
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`${styles.videoWallContainer} videoWall`}>
      <div className={styles.scrollViewport}>
        <div className={styles.scrollWrapper}>
          {doubledRows.map((row, index) => (
            <Row key={`${row.id}-${index}`} layout={row.layout} videos={row.videos} rowIndex={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoWall;
