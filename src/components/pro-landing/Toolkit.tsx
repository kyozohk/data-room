'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import styles from './Toolkit.module.css';

interface ToolkitProps {
  /** Top "We are not" / negation line */
  notText?: string;
  /** Inner pill text — "Social Media" / "a sharepoint" */
  notBubble?: string;
  /** Big left-column title (use \n for line breaks) */
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
}

const Toolkit: React.FC<ToolkitProps> = ({
  notText = 'We are not',
  notBubble = 'a sharepoint',
  title = 'Dataroom\nYour knowledge\nshelf',
  description = `Architecture, product strategy, security posture, and company materials — assembled in the order teams actually read them. Every page is signed, dated, and audit-logged. Open the room, browse a shelf, or search for what you need.`,
  ctaText = 'Enter the dataroom',
  ctaUrl = '/login',
}) => {
  return (
    <>
      <section className={styles.socialMediaSection}>
        <div className={styles.socialMediaTitle}>{notText}</div>
        <div className={styles.socialMediaBubble}>
          <span className={styles.socialMediaText}>{notBubble}</span>
        </div>
      </section>

      <section className={styles.creativeLabSection}>
        <div className={styles.gridContainer}>
          <div className={styles.leftColumn}>
            <h2 className={styles.creativeLabTitle}>
              {title.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < title.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
          </div>
          <div className={styles.rightColumn}>
            <p className={styles.description}>{description}</p>
            <Link href={ctaUrl} className={styles.ctaLink}>
              {ctaText}
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Toolkit;
