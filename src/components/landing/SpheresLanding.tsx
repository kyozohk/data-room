'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Spheres.module.scss';
import WaitlistDialog from './WaitlistDialog';

const features = [
  {
    icon: '💬',
    title: 'Real-time Communication',
    description:
      'High-performance instant messaging and discussion threads tailored for professional communities.',
  },
  {
    icon: '🧭',
    title: 'Management Dashboard',
    description:
      'Comprehensive SaaS interface at pro.kyozo.com for administrators to manage members and content.',
  },
  {
    icon: '📱',
    title: 'Native Mobile Apps',
    description:
      'Full-featured iOS and Android applications ensuring your community is accessible anywhere, anytime.',
  },
  {
    icon: '🌐',
    title: 'Public Content Portal',
    description:
      'Showcase community highlights to the world through our public-facing portal at www.kyozo.com.',
  },
  {
    icon: '⚡',
    title: 'Automated Workflows',
    description:
      'Streamline member onboarding and management with powerful built-in automation tools.',
  },
  {
    icon: '🔒',
    title: 'Invite-Only Access',
    description:
      'Maintain high-quality interactions with gated entry and verified professional profiles.',
  },
];

const faqs = [
  {
    q: 'What is Spheres Technology?',
    a: 'Spheres Technology is a unified SaaS platform for professional community management and real-time communication, bridging web, iOS, and Android so your members stay connected anywhere.',
  },
  {
    q: 'How does the platform work across web and mobile?',
    a: 'Administrators manage members and content from our pro portal, while members engage through native iOS and Android apps. Public community highlights are showcased through our public portal.',
  },
  {
    q: 'Is Spheres available to everyone?',
    a: 'We are currently in private beta with invite-only access to maintain high-quality interactions. Join our waitlist to be among the first professionals invited.',
  },
  {
    q: 'How do I get early access?',
    a: 'Click "Enter the Dataroom" and share a few details about you and your community. Our team will reach out with next steps as slots open up.',
  },
];

const SpheresLanding: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const openDialog = () => setDialogOpen(true);

  return (
    <section className={styles.wrapper} id="spheres">
      <div className={styles.blobA} />
      <div className={styles.blobB} />
      <div className={styles.blobC} />

      <div className={styles.inner}>
        {/* HERO */}
        <div className={styles.hero}>
          <div>
            <div className={styles.badge}>✦ Spheres Technology · Private Beta</div>
            <h2 className={styles.heroTitle}>
              Next Generation <span className={styles.accent}>Community</span> Ecosystem
            </h2>
            <p className={styles.heroSubtitle}>
              Spheres Technology delivers a unified SaaS platform for professional community
              management and real-time communication. Seamlessly bridge the gap between your
              members on web, iOS, and Android.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.btnPrimary} onClick={openDialog}>
                Enter the Dataroom →
              </button>
              <a
                href="https://www.kyozo.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                Explore Public Communities
              </a>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <strong>99.9%</strong>
                <span>Uptime</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <strong>Enterprise</strong>
                <span>Security</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardInner}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className={styles.node}>●</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className={styles.features} id="spheres-features">
          <div className={styles.sectionHeader}>
            <div className={styles.eyebrow}>Product Overview</div>
            <h3 className={styles.sectionTitle}>
              Everything you need to grow your professional network
            </h3>
            <p className={styles.sectionLead}>
              Spheres Technology provides a robust ecosystem designed for high-engagement
              communities, combining management power with user-centric design.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h4 className={styles.featureTitle}>{f.title}</h4>
                <p className={styles.featureText}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.faq} id="spheres-faq">
          <div className={styles.faqInner}>
            <div>
              <div className={styles.eyebrow}>Frequently Asked</div>
              <h3 className={styles.sectionTitle}>Questions? We&apos;ve got answers.</h3>
              <p className={styles.sectionLead}>
                Learn more about Spheres Technology, our iOS and Android applications, the pro
                management platform, and the public communities portal.
              </p>
            </div>

            <div className={styles.faqList}>
              {faqs.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className={styles.faqItem}>
                    <button
                      className={styles.faqQuestion}
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                    >
                      {item.q}
                      <span className={`${styles.chev} ${open ? styles.chevOpen : ''}`}>⌄</span>
                    </button>
                    {open && <div className={styles.faqAnswer}>{item.a}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* WAITLIST CTA */}
        <div className={styles.waitlist} id="spheres-waitlist">
          <div className={styles.waitlistCard}>
            <div className={styles.eyebrow}>Join the Future</div>
            <h3 className={styles.sectionTitle}>Join the Future of Communities</h3>
            <p className={styles.sectionLead}>
              Our professional platform is currently invite-only. Join our waitlist to be among
              the first to experience the power of Spheres Technology.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
              <button className={styles.btnPrimary} onClick={openDialog}>
                Enter the Dataroom →
              </button>
            </div>
            <div className={styles.waitlistBullets}>
              <span><span className={styles.check}>✓</span> No spam, ever</span>
              <span><span className={styles.check}>✓</span> Priority access</span>
              <span><span className={styles.check}>✓</span> Early bird features</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.siteFooter}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <Image
                src="/spheres-logo.png"
                alt="Spheres Technology"
                width={150}
                height={52}
              />
              <p>
                Empowering professional networks with advanced community management technology
                and seamless communication tools.
              </p>
            </div>

            <div className={styles.footerCol}>
              <h4>Platforms</h4>
              <ul>
                <li><a href="https://www.kyozo.com" target="_blank" rel="noopener noreferrer">Public Communities ↗</a></li>
                <li><a href="https://pro.kyozo.com" target="_blank" rel="noopener noreferrer">Pro Portal ↗</a></li>
                <li><a href="#spheres-waitlist">Join Waitlist</a></li>
              </ul>
            </div>

            <div className={styles.footerCol}>
              <h4>Company</h4>
              <ul>
                <li><a href="#spheres-features">Features</a></li>
                <li><a href="#spheres-waitlist">Beta Access</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>

            <div className={styles.footerCol}>
              <h4>Contact Information</h4>
              <address className={styles.footerAddress}>
                SUITES 2202-03, 22/F TOWER 1,<br />
                THE GATEWAY HARBOUR CITY TSIM<br />
                SHA TSUI<br />
                Hong Kong
              </address>
              <p style={{ marginTop: '1rem' }} className={styles.footerAddress}>
                ✉ hello@spheres.tech
              </p>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span>© {new Date().getFullYear()} Spheres Technology. All rights reserved.</span>
            <span>spheres.tech</span>
          </div>
        </div>
      </div>

      <WaitlistDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
    </section>
  );
};

export default SpheresLanding;
