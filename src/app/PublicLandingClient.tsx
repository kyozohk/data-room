'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import {
  Hero,
  BackgroundImages,
  FeatureCard,
  ScrollRevealText,
  SlidingCards,
  SlidingCard,
  VideoWall,
  ParallaxGallery,
  Toolkit,
  Marquee,
  BubbleMarquee,
  BottomText,
} from '@/components/pro-landing';
import styles from './public-landing.module.css';

/**
 * Public landing — direct mirror of
 *   /Development/Kyozo/kyozo-pro-flow/src/app/page.tsx
 *
 * Same components, same order, same copy, same imagery, same animations.
 * The only dataroom-specific element is the "Enter the dataroom" button at
 * the very bottom, replacing the original "Join the Waitlist" CTA.
 */
export default function PublicLandingClient() {
  return (
    <div className={`${styles.container} ${styles.page}`}>
      <Hero text="Discover Your Creative Universe" />

      <BackgroundImages />

      <FeatureCard button={<JoinBtn />} />

      <div className={styles.scrollWrap}>
        <ScrollRevealText text="Where creative minds converge" />
      </div>

      <SlidingCards>
        <SlidingCard
          subtitle="INSIDER ACCESS"
          title="Exclusive access and insights"
          text="Experience the creative world through an insider's lens. Kyozo is an eco-system of creative communities — that gives you exclusive access to updates and insights from the creative luminaries driving cultural evolution."
          accent="gold"
          button={<JoinBtn ghost />}
          content={<VideoWall />}
        />
        <SlidingCard
          subtitle="COMMUNITY ACCESS"
          title="Engage with visionary communities"
          text="Join and interact with diverse communities, from niche artistic circles to industry-leading collectives. Engage with passionate individuals who share your creative interests."
          accent="rust"
          button={<JoinBtn ghost />}
          content={<ParallaxGallery />}
        />
        <SlidingCard
          subtitle="CREATOR TOOLS"
          title="Grow your creative community"
          text="Are you a creative professional, community organizer, or small business owner working within the creative industries? We understand the challenges of nurturing and growing a dedicated audience, so we built KyozoPro, a comprehensive platform that enhances genuine connections and unlocks new opportunities."
          accent="sage"
          button={<JoinBtn ghost />}
          content={
            <Image
              src="/card-3.png"
              alt="Phone"
              width={600}
              height={800}
              style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
            />
          }
        />
      </SlidingCards>

      <Toolkit
        notText="We are not"
        notBubble="Social Media"
        title={'CreativeLab\nYour creative\ntoolkit'}
        description="Explore a dynamic resources hub where creativity meets community. Here you'll find a curated collection of articles, videos and resources designed to inspire, inform and ignite your creative journey. Explore a dynamic resources hub where creativity meets community."
        ctaText="Check out CreativeLab"
        ctaUrl="#"
      />

      <Marquee
        categories={[
          {
            category: 'gold',
            items: [
              { text: 'Rediscovering your creative passion' },
              { text: 'Prompts to Turbocharge Your Creative Process' },
              { text: 'BPM heartrate and running' },
              { text: 'The creative paradox' },
              { text: 'Rediscovering your creative passion' },
            ],
          },
        ]}
      />

      <BubbleMarquee
        categories={[
          {
            color: 'gold',
            items: [
              { text: 'Rock' },
              { text: 'Jazz' },
              { text: 'R&B' },
              { text: 'Trance' },
              { text: 'Techno' },
              { text: 'Hip Hop' },
              { text: 'Classical' },
            ],
          },
          {
            color: 'rust',
            items: [
              { text: 'Expressionism' },
              { text: 'Futurism' },
              { text: 'Classicism' },
              { text: 'Cubism' },
              { text: 'Surrealism' },
              { text: 'Dadaism' },
            ],
          },
          {
            color: 'sage',
            items: [
              { text: 'Wood Burning' },
              { text: 'Candle-making' },
              { text: 'Crochet' },
              { text: 'Jewelry' },
              { text: 'Pottery' },
              { text: 'Weaving' },
            ],
          },
          {
            color: 'brown',
            items: [
              { text: 'Chic' },
              { text: 'Grunge' },
              { text: 'Vintage' },
              { text: 'Boho' },
              { text: 'Preppy' },
              { text: 'Streetwear' },
            ],
          },
          {
            color: 'taupe',
            items: [
              { text: 'Stand-ups' },
              { text: 'Musical' },
              { text: 'Digital' },
              { text: 'Theatre' },
              { text: 'Dance' },
              { text: 'Opera' },
            ],
          },
        ]}
      />

      <BottomText
        text="Join the creative universe"
        fontSize="6rem"
        fontWeight={700}
        cta={
          <Link href="/docs" className={styles.bigEnterBtn}>
            Enter the dataroom <FiArrowRight size={20} />
          </Link>
        }
      />
    </div>
  );
}

function JoinBtn({ ghost = false }: { ghost?: boolean }) {
  return (
    <a href="#" className={ghost ? styles.cardCta : styles.outlineBtn}>
      Join the waitlist
    </a>
  );
}
