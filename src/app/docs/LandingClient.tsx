'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  FiArrowRight, FiShield, FiSend, FiCheckCircle, FiSearch,
  FiBookOpen, FiCode, FiBriefcase, FiDollarSign, FiFolder,
  FiMessageSquare, FiLayout, FiZap, FiLock, FiShare2, FiSmartphone,
  FiMail, FiMapPin, FiExternalLink, FiStar, FiUser, FiLoader,
} from 'react-icons/fi';
import type { DocCategory, DocMeta } from '@/lib/content';
import styles from './landing.module.css';

const CAT_ICONS: Record<string, any> = {
  technical: FiCode,
  company: FiBriefcase,
  legal: FiShield,
  finance: FiDollarSign,
};

type ChatMsg = { role: 'user' | 'assistant'; content: string };

export default function LandingClient({
  categories, docs,
}: { categories: DocCategory[]; docs: DocMeta[] }) {
  return (
    <main className={styles.page}>
      <Hero docs={docs} categories={categories} />
      <Features />
      <Categories categories={categories} docs={docs} />
      <AssistantSection docs={docs} />
      <RequestSection />
      <LandingFooter />
    </main>
  );
}

/* ============================================================
   Hero — animated orbs, badge, big headline, CTAs, stat row
   ============================================================ */
function Hero({ docs, categories }: { docs: DocMeta[]; categories: DocCategory[] }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBgGrid} />
      <div className={styles.heroOrb1} />
      <div className={styles.heroOrb2} />

      <div className={styles.heroInner}>
        <div className={styles.heroCol}>
          <div className={`${styles.chip} fadeUp`}>
            <FiShield size={14} />
            <span>Confidential — invite only</span>
          </div>

          <h1 className={`${styles.h1} fadeUp`} style={{ animationDelay: '0.05s' }}>
            Everything you need to understand <span className={styles.accent}>Kyozo</span>, in one room.
          </h1>

          <p className={`${styles.heroLede} fadeUp`} style={{ animationDelay: '0.1s' }}>
            Architecture, product, security, and company materials — curated for diligence partners,
            new hires, and select collaborators. Search a doc, browse a category, or just start at the top.
          </p>

          <div className={`${styles.heroCtas} fadeUp`} style={{ animationDelay: '0.15s' }}>
            {docs.length > 0 && (
              <Link href={`/docs/${docs[0].slug}`} className={styles.btnPrimary}>
                Start reading <FiArrowRight size={18} />
              </Link>
            )}
            <a href="#categories" className={styles.btnOutline}>
              Browse by category
            </a>
          </div>

          <div className={`${styles.heroStats} fadeUp`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{docs.length}</span>
              <span className={styles.statLabel}>Documents</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>{categories.length}</span>
              <span className={styles.statLabel}>Categories</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>SOC 2</span>
              <span className={styles.statLabel}>Aligned</span>
            </div>
          </div>
        </div>

        <div className={styles.heroCol}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className={styles.heroVisualWrap}>
      <div className={styles.heroVisualGlow} />
      <div className={styles.heroVisual}>
        <div className={styles.heroVisualHeader}>
          <span className={styles.heroVisualDot} style={{ background: '#E4B362' }} />
          <span className={styles.heroVisualDot} style={{ background: '#C8A678' }} />
          <span className={styles.heroVisualDot} style={{ background: '#A88B6A' }} />
          <span className={styles.heroVisualFilename}>kyozo-tech-overview.md</span>
        </div>
        <div className={styles.heroVisualBody}>
          <div className={styles.docLine} style={{ width: '90%' }} />
          <div className={styles.docLine} style={{ width: '70%' }} />
          <div className={styles.docLine} style={{ width: '40%' }} />
          <div className={styles.docHeading}>Architecture</div>
          <div className={styles.docLine} style={{ width: '85%' }} />
          <div className={styles.docLine} style={{ width: '95%' }} />
          <div className={styles.docLine} style={{ width: '60%' }} />
          <div className={styles.docBox}>
            <div className={styles.docBoxLabel}>OPINION</div>
            <div className={styles.docLine} style={{ width: '88%' }} />
            <div className={styles.docLine} style={{ width: '72%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Features — six feature cards (icons + hover lift)
   ============================================================ */
function Features() {
  const features = [
    { icon: FiBookOpen,  title: 'Curated reading order', body: 'Start at the top of each category or skim the summaries. Every doc is signed, dated, and revision-tracked.' },
    { icon: FiCode,       title: 'Engineering depth',     body: 'Architecture diagrams, API references, and security posture — the same docs the team works from.' },
    { icon: FiShield,     title: 'Audit on every visit',  body: 'Each session is signed, each page view timestamped. You see what you read; we see who reads what.' },
    { icon: FiStar,   title: 'Search assistant',      body: 'Type a phrase, get the right doc. No more digging — the room knows what it contains.' },
    { icon: FiLock,       title: 'Encrypted in transit',  body: 'HTTPS-only, signed cookies, server-side document gating. Nothing leaks to ad networks or trackers.' },
    { icon: FiZap,        title: 'Always-current',        body: 'Synced from the canonical repo — what you read here matches what the team is shipping today.' },
  ];

  return (
    <section id="features" className={styles.features}>
      <div className={styles.featuresInner}>
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>Why this room exists</div>
          <h2 className={styles.h2}>
            Everything you need to evaluate Kyozo, organised the way teams actually read.
          </h2>
          <p className={styles.sectionLede}>
            A dataroom shouldn't be a sharepoint full of PDFs. This one is structured, searchable,
            and tracked — so your time is spent reading, not hunting.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Icon size={20} />
                </div>
                <h4 className={styles.featureTitle}>{f.title}</h4>
                <p className={styles.featureBody}>{f.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Categories — the actual content surfaces (replaces the
   spheres-tech "platforms" callout with real docs)
   ============================================================ */
function Categories({
  categories, docs,
}: { categories: DocCategory[]; docs: DocMeta[] }) {
  return (
    <section id="categories" className={styles.categories}>
      <div className={styles.featuresInner}>
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>The shelves</div>
          <h2 className={styles.h2}>
            Browse by <span className={styles.accent}>category</span>.
          </h2>
          <p className={styles.sectionLede}>
            Pick a shelf and start reading. Sidebar has the same list — these cards are the
            quick-jump for the most-used docs in each area.
          </p>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((cat) => {
            const Icon = CAT_ICONS[cat.id] || FiFolder;
            const items = docs.filter((d) => d.category === cat.id);
            const visible = items.slice(0, 5);
            return (
              <div key={cat.id} className={styles.categoryCard}>
                <div className={styles.categoryHead}>
                  <div className={styles.categoryIcon}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className={styles.categoryTitle}>{cat.label}</div>
                    <div className={styles.categoryCount}>{items.length} document{items.length === 1 ? '' : 's'}</div>
                  </div>
                </div>
                <ul className={styles.categoryList}>
                  {visible.map((d) => (
                    <li key={d.slug}>
                      <Link href={`/docs/${d.slug}`} className={styles.categoryItem}>
                        <span className={styles.categoryItemDot} />
                        <span>{d.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {items.length > visible.length && (
                  <div className={styles.categoryMore}>
                    +{items.length - visible.length} more in sidebar
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Assistant — the spheres-tech "AI chat" widget, ported into
   an on-page search experience over the dataroom docs.
   ============================================================ */
function AssistantSection({ docs }: { docs: DocMeta[] }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: 'Hi — I can help you find anything in the dataroom. Try \"how is auth built?\", \"security review\", or \"who are our competitors?\".' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  function handleSearch(query: string): { reply: string; matches: DocMeta[] } {
    const q = query.toLowerCase();
    const matches = docs.filter((d) => {
      const hay = `${d.title} ${d.description ?? ''} ${d.filename} ${d.category}`.toLowerCase();
      return hay.includes(q);
    }).slice(0, 4);
    if (matches.length === 0) {
      return { reply: `I couldn't find anything for "${query}" in the room. Use the sidebar to browse the four categories, or try a different phrase.`, matches: [] };
    }
    const opener = matches.length === 1
      ? `One match for "${query}":`
      : `${matches.length} matches for "${query}":`;
    return { reply: opener, matches };
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setMessages((m) => [...m, { role: 'user', content: trimmed }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      const { reply, matches } = handleSearch(trimmed);
      const linksLine = matches.length
        ? '\n' + matches.map((d) => `→ [${d.title}](/docs/${d.slug})`).join('\n')
        : '';
      setMessages((m) => [...m, { role: 'assistant', content: reply + linksLine }]);
      setLoading(false);
    }, 450);
  }

  return (
    <section className={styles.assistant}>
      <div className={styles.featuresInner}>
        <div className={styles.assistantGrid}>
          <div className={styles.assistantCopy}>
            <div className={styles.chip}>
              <FiStar size={14} />
              <span>Find anything, fast</span>
            </div>
            <h2 className={styles.h2}>
              Looking for something specific? <span className={styles.accent}>Just ask.</span>
            </h2>
            <p className={styles.sectionLede}>
              Type what you're looking for — a topic, a doc name, a vendor — and the assistant
              points you to the right pages. It's a search box that talks back.
            </p>
            <div className={styles.assistantTipList}>
              <div className={styles.assistantTip}>
                <FiSearch size={20} className={styles.assistantTipIcon} />
                <span>Instant matches across titles, descriptions, and filenames.</span>
              </div>
              <div className={styles.assistantTip}>
                <FiStar size={20} className={styles.assistantTipIcon} />
                <span>Suggests related docs when the first match doesn't quite fit.</span>
              </div>
            </div>
          </div>

          <div className={styles.assistantPanel}>
            <div className={styles.assistantPanelGlow} />
            <div className={styles.assistantCard}>
              <div className={styles.assistantHeader}>
                <div className={styles.assistantAvatarBot}><FiStar size={16} /></div>
                <div>
                  <div className={styles.assistantHeaderTitle}>Dataroom Assistant</div>
                  <div className={styles.assistantHeaderSub}>Always online</div>
                </div>
              </div>

              <div className={styles.assistantBody} ref={scrollRef}>
                {messages.map((m, i) => (
                  <div key={i} className={`${styles.msgRow} ${m.role === 'user' ? styles.msgUser : styles.msgBot}`}>
                    <div className={styles.msgAvatar}>
                      {m.role === 'user' ? <FiUser size={14} /> : <FiStar size={14} />}
                    </div>
                    <div className={styles.msgBubble}>
                      {renderMessage(m.content)}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className={`${styles.msgRow} ${styles.msgBot}`}>
                    <div className={styles.msgAvatar}><FiStar size={14} /></div>
                    <div className={styles.msgBubble}>
                      <FiLoader className={styles.spinning} /> Looking…
                    </div>
                  </div>
                )}
              </div>

              <form className={styles.assistantInput} onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Try “how is auth built?”"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className={styles.assistantInputBox}
                />
                <button type="submit" disabled={loading || !input.trim()} className={styles.assistantSend}>
                  <FiSend size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderMessage(content: string) {
  // Render simple [text](href) markdown links
  const parts = content.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (m) {
          return (
            <a key={i} href={m[2]} style={{ color: 'var(--accent-gold)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              {m[1]}
            </a>
          );
        }
        return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
      })}
    </>
  );
}

/* ============================================================
   Request — the spheres-tech waitlist callout, repurposed as
   a "Request a doc that's not here" CTA.
   ============================================================ */
function RequestSection() {
  const [email, setEmail] = useState('');
  const [request, setRequest] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !request) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setEmail('');
      setRequest('');
    }, 900);
  }

  return (
    <section id="request" className={styles.request}>
      <div className={styles.requestBlur} />
      <div className={styles.requestCard}>
        {!submitted ? (
          <>
            <h2 className={styles.h2}>Need a doc that isn't here?</h2>
            <p className={styles.requestLede}>
              The dataroom is curated, not complete. If you're missing something specific —
              a financial model, a vendor letter, a deeper architecture diagram — drop a note
              and we'll add it or share it directly.
            </p>

            <form onSubmit={onSubmit} className={styles.requestForm}>
              <input
                type="email"
                placeholder="Your email"
                className={styles.requestInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <input
                type="text"
                placeholder="What document are you looking for?"
                className={styles.requestInput}
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                disabled={loading}
                required
              />
              <button type="submit" disabled={loading || !email || !request} className={styles.requestBtn}>
                {loading ? <FiLoader className={styles.spinning} /> : 'Send request'}
              </button>
            </form>

            <div className={styles.requestTrust}>
              <span><FiCheckCircle size={14} /> Replies within 24h</span>
              <span><FiCheckCircle size={14} /> Direct to Ashok</span>
              <span><FiCheckCircle size={14} /> No newsletter, ever</span>
            </div>
          </>
        ) : (
          <div className={`${styles.requestSuccess} fadeUp`}>
            <div className={styles.requestSuccessIcon}>
              <FiCheckCircle size={32} />
            </div>
            <h3 className={styles.requestSuccessTitle}>Got it — we'll be in touch.</h3>
            <p className={styles.requestSuccessSub}>
              Your request is queued. You'll hear back at the email you provided within a business day.
            </p>
            <button className={styles.requestBackBtn} onClick={() => setSubmitted(false)}>
              Send another
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   Footer — confidentiality, links, contact
   ============================================================ */
function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <div className={styles.footerBrand}>
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none" aria-hidden>
                <defs>
                  <linearGradient id="fl" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#A88B6A" />
                    <stop offset="100%" stopColor="#B8775A" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="40" stroke="url(#fl)" strokeWidth="8" />
                <circle cx="50" cy="50" r="14" fill="url(#fl)" />
              </svg>
              <span className={styles.footerBrandName}>Kyozo</span>
            </div>
            <p className={styles.footerBlurb}>
              The internal dataroom for diligence partners, prospective hires, and select
              collaborators. Everything inside is confidential and revocable.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>The room</h4>
            <ul className={styles.footerList}>
              <li><a href="#features">What's inside</a></li>
              <li><a href="#categories">Browse categories</a></li>
              <li><a href="#request">Request a doc</a></li>
              <li><Link href="/admin/login">Admin sign-in</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Legal</h4>
            <ul className={styles.footerList}>
              <li><span>Confidential — invite only</span></li>
              <li><span>Audit logged on every visit</span></li>
              <li><span>Access revocable at any time</span></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Contact</h4>
            <ul className={styles.footerList}>
              <li className={styles.footerContact}>
                <FiMail size={16} />
                <a href="mailto:ashok@kyozo.com">ashok@kyozo.com</a>
              </li>
              <li className={styles.footerContact}>
                <FiExternalLink size={16} />
                <a href="https://www.kyozo.com" target="_blank" rel="noopener noreferrer">kyozo.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} Kyozo. All rights reserved.</span>
          <span>Confidential preview — V1</span>
        </div>
      </div>
    </footer>
  );
}
