import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import {
  FileText,
  ArrowLeft,
  Download,
  ChevronRight,
  Heart,
  Brain,
  Moon,
  Dumbbell,
  Apple,
  Users,
  ListChecks,
  Cpu,
  Coins,
  TrendingUp,
  Building2,
  Route,
  ShieldAlert,
  Mail,
  Target,
  Zap,
  Globe,
  Lock,
  Database,
  PieChart,
  Award,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';
import PageLayout from '../../components/Layout/PageLayout';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TocItem {
  id: string;
  labelKey: string;
  icon: React.ElementType;
}

interface ModuleCard {
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  color: string;
}

interface TokenDistribution {
  label: string;
  percent: number;
  color: string;
}

interface RoadmapPhase {
  period: string;
  headingKey: string;
  descKey: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const NEU_LIGHT = '#e4dfd5';
const NEU_DARK = '#dcd3c6';
const TEXT_PRIMARY = '#5c5243';
const TEXT_SECONDARY = '#8c7a6b';
const ACCENT = '#7a6b5d';

const TOC_ITEMS: TocItem[] = [
  { id: 'executive-summary', labelKey: 'whitepaper.executiveSummary', icon: FileText },
  { id: 'problem', labelKey: 'whitepaper.problem', icon: Target },
  { id: 'solution', labelKey: 'whitepaper.solution', icon: Zap },
  { id: 'modules', labelKey: 'whitepaper.modules', icon: Cpu },
  { id: 'technology', labelKey: 'whitepaper.technology', icon: Database },
  { id: 'tokenomics', labelKey: 'whitepaper.tokenomics', icon: Coins },
  { id: 'market', labelKey: 'whitepaper.market', icon: TrendingUp },
  { id: 'business-model', labelKey: 'whitepaper.businessModel', icon: Building2 },
  { id: 'roadmap', labelKey: 'whitepaper.roadmap', icon: Route },
  { id: 'team', labelKey: 'whitepaper.team', icon: Users },
  { id: 'financials', labelKey: 'whitepaper.financials', icon: PieChart },
  { id: 'risks', labelKey: 'whitepaper.risks', icon: ShieldAlert },
  { id: 'contact', labelKey: 'whitepaper.contact', icon: Mail },
];

const MODULE_CARDS: ModuleCard[] = [
  { icon: Apple, titleKey: 'health.nutrition.title', descKey: 'whitepaper.modules.p1', color: '#6b8f71' },
  { icon: Dumbbell, titleKey: 'health.movement.title', descKey: 'whitepaper.modules.p2', color: '#c47a5a' },
  { icon: Moon, titleKey: 'health.sleep.title', descKey: 'whitepaper.modules.p3', color: '#5b7fa5' },
  { icon: Brain, titleKey: 'health.psychology.title', descKey: 'whitepaper.modules.p4', color: '#9b6b9e' },
  { icon: Heart, titleKey: 'health.medicine.title', descKey: 'whitepaper.modules.p5', color: '#c45a5a' },
  { icon: Users, titleKey: 'health.relationships.title', descKey: 'whitepaper.modules.p6', color: '#c4a45a' },
  { icon: ListChecks, titleKey: 'health.habits.title', descKey: 'whitepaper.modules.p7', color: '#5aa57a' },
];

const TOKEN_DISTRIBUTION: TokenDistribution[] = [
  { label: 'Community Rewards & Ecosystem', percent: 35, color: '#6b8f71' },
  { label: 'Public Sale', percent: 20, color: '#5b7fa5' },
  { label: 'Team & Advisors', percent: 15, color: '#9b6b9e' },
  { label: 'Development Fund', percent: 15, color: '#c47a5a' },
  { label: 'Liquidity Pool', percent: 10, color: '#c4a45a' },
  { label: 'Reserve Fund', percent: 5, color: '#8c7a6b' },
];

const ROADMAP_PHASES: RoadmapPhase[] = [
  { period: 'Q1-Q2 2026', headingKey: 'whitepaper.roadmap.p1', descKey: '' },
  { period: 'Q3-Q4 2026', headingKey: 'whitepaper.roadmap.p2', descKey: '' },
  { period: 'Q1-Q2 2027', headingKey: 'whitepaper.roadmap.p3', descKey: '' },
  { period: 'Q3-Q4 2027', headingKey: 'whitepaper.roadmap.p4', descKey: '' },
  { period: '2028+', headingKey: 'whitepaper.roadmap.p5', descKey: '' },
];

const FINANCIAL_YEARS = [
  { year: '2026', users: '100K', arr: '$1.2M', subs: '10K' },
  { year: '2027', users: '500K', arr: '$8M', subs: '50K' },
  { year: '2028', users: '2M', arr: '$35M', subs: '200K' },
  { year: '2030', users: '10M+', arr: '$150M+', subs: '1M' },
];

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' as const },
  }),
};

function AnimatedSection({
  children,
  id,
  className,
  style,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Neumorphic helpers                                                 */
/* ------------------------------------------------------------------ */

const neuRaised: React.CSSProperties = {
  background: NEU_LIGHT,
  borderRadius: 16,
  boxShadow: `6px 6px 14px ${NEU_DARK}, -6px -6px 14px #ffffff`,
};

const neuInset: React.CSSProperties = {
  background: NEU_LIGHT,
  borderRadius: 12,
  boxShadow: `inset 4px 4px 8px ${NEU_DARK}, inset -4px -4px 8px #ffffff`,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const WhitePaper: React.FC = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('executive-summary');
  const [tocOpen, setTocOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  /* Scroll progress bar */
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollProgress(Math.min(scrolled, 1));

      // determine active section
      for (let i = TOC_ITEMS.length - 1; i >= 0; i--) {
        const sec = document.getElementById(TOC_ITEMS[i].id);
        if (sec && sec.getBoundingClientRect().top <= 120) {
          setActiveSection(TOC_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setTocOpen(false);
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  /* ---- TOC sidebar (desktop) / drawer (mobile) ---- */
  const TocList = ({ mobile = false }: { mobile?: boolean }) => (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 8 : 4 }}>
      {TOC_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: mobile ? '10px 14px' : '7px 12px',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: mobile ? 15 : 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? TEXT_PRIMARY : TEXT_SECONDARY,
              background: isActive ? NEU_DARK : 'transparent',
              transition: 'all 0.2s',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Icon size={mobile ? 18 : 15} strokeWidth={1.8} />
            {t(item.labelKey)}
          </button>
        );
      })}
    </nav>
  );

  /* ---- Section heading helper ---- */
  const SectionHeading = ({
    icon: Icon,
    title,
    customStyles,
  }: {
    icon: React.ElementType;
    title: string;
    customStyles?: React.CSSProperties;
  }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        marginBottom: 24,
        ...customStyles,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${ACCENT}, ${TEXT_SECONDARY})`,
          color: '#fff',
          flexShrink: 0,
        }}
      >
        <Icon size={22} />
      </div>
      <h2
        style={{
          margin: 0,
          fontSize: 26,
          fontWeight: 800,
          color: TEXT_PRIMARY,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h2>
    </div>
  );

  /* ---------------------------------------------------------------- */
  return (
    <PageLayout>
      {/* ---- Print styles ---- */}
      <style>{`
        @media print {
          header, nav, .no-print { display: none !important; }
          body { background: #fff !important; }
        }
        @media (max-width: 768px) {
          .wp-sidebar { display: none !important; }
        }
      `}</style>

      {/* ---- Scroll progress bar ---- */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: 3,
          width: `${scrollProgress * 100}%`,
          background: `linear-gradient(90deg, ${ACCENT}, ${TEXT_SECONDARY})`,
          zIndex: 9999,
          transition: 'width 0.1s',
        }}
        className="no-print"
      />

      {/* ---- Hero ---- */}
      <section
        style={{
          background: `linear-gradient(160deg, ${NEU_DARK} 0%, ${NEU_LIGHT} 50%, ${NEU_DARK} 100%)`,
          padding: '80px 24px 60px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${NEU_DARK}40, transparent)`,
            top: -120,
            right: -80,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${NEU_DARK}30, transparent)`,
            bottom: -100,
            left: -60,
            pointerEvents: 'none',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 16px',
              borderRadius: 20,
              background: NEU_DARK,
              fontSize: 12,
              fontWeight: 600,
              color: TEXT_SECONDARY,
              marginBottom: 20,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            <Lock size={12} />
            {t('whitepaper.confidential')}
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 900,
              color: TEXT_PRIMARY,
              margin: '0 0 16px',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
            }}
          >
            {t('whitepaper.title')}
          </h1>

          <p
            style={{
              fontSize: 'clamp(14px, 2vw, 17px)',
              color: TEXT_SECONDARY,
              maxWidth: 640,
              margin: '0 auto 12px',
              lineHeight: 1.65,
            }}
          >
            {t('whitepaper.subtitle')}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              fontSize: 13,
              color: TEXT_SECONDARY,
              marginBottom: 32,
            }}
          >
            <span>{t('whitepaper.version', { version: '1.0.0' })}</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>{t('whitepaper.lastUpdated')}</span>
          </div>

          {/* CTA buttons */}
          <div
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
            className="no-print"
          >
            <button
              onClick={handleDownloadPdf}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                borderRadius: 12,
                border: 'none',
                background: `linear-gradient(135deg, ${ACCENT}, ${TEXT_SECONDARY})`,
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: `4px 4px 10px ${NEU_DARK}, -2px -2px 6px #ffffff`,
              }}
            >
              <Download size={18} />
              {t('whitepaper.downloadPdf')}
            </button>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                borderRadius: 12,
                border: 'none',
                background: NEU_LIGHT,
                color: TEXT_PRIMARY,
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                textDecoration: 'none',
                boxShadow: `4px 4px 10px ${NEU_DARK}, -4px -4px 10px #ffffff`,
              }}
            >
              <ArrowLeft size={18} />
              {t('whitepaper.backToHome')}
            </a>
          </div>
        </motion.div>
      </section>

      {/* ---- Key points bar ---- */}
      <div
        style={{
          maxWidth: 1100,
          margin: '-30px auto 0',
          padding: '0 20px',
          position: 'relative',
          zIndex: 2,
        }}
        className="no-print"
      >
        <AnimatedSection>
          <div style={{ ...neuRaised, padding: '24px 28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14,
                fontWeight: 700,
                color: TEXT_PRIMARY,
                fontSize: 15,
              }}
            >
              <Award size={18} color={ACCENT} />
              {t('whitepaper.keyPoints')}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 10,
              }}
            >
              {['item1', 'item2', 'item3', 'item4', 'item5'].map((k) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    fontSize: 13,
                    color: TEXT_SECONDARY,
                    lineHeight: 1.5,
                  }}
                >
                  <CheckCircle2 size={14} color="#6b8f71" style={{ marginTop: 2, flexShrink: 0 }} />
                  {t(`whitepaper.keyPointsList.${k}`)}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* ---- Body with TOC sidebar ---- */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '48px 20px 80px',
          display: 'flex',
          gap: 40,
          position: 'relative',
        }}
      >
        {/* ---- Desktop sticky sidebar ---- */}
        <aside
          className="wp-sidebar no-print"
          style={{
            position: 'sticky',
            top: 80,
            alignSelf: 'flex-start',
            width: 240,
            flexShrink: 0,
          }}
        >
          <div style={{ ...neuRaised, padding: '18px 14px' }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: TEXT_PRIMARY,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <ListChecks size={14} />
              {t('whitepaper.tableOfContents')}
            </div>
            <TocList />
          </div>
        </aside>

        {/* ---- Mobile TOC toggle ---- */}
        <div
          className="no-print"
          style={{
            display: 'none',
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          {/* Shown via media query in CSS if needed */}
        </div>

        {/* ---- Main content ---- */}
        <main style={{ flex: 1, minWidth: 0, maxWidth: 820 }}>
          {/* ===== Executive Summary ===== */}
          <AnimatedSection id="executive-summary" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={FileText} title={t('whitepaper.executiveSummary')} />
            <div style={{ ...neuRaised, padding: '28px 32px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                {t('whitepaper.executiveSummary.heading')}
              </h3>
              {[1, 2, 3].map((n) => (
                <p
                  key={n}
                  style={{
                    margin: '0 0 14px',
                    lineHeight: 1.75,
                    color: TEXT_SECONDARY,
                    fontSize: 15,
                  }}
                >
                  {t(`whitepaper.executiveSummary.p${n}`)}
                </p>
              ))}
            </div>
          </AnimatedSection>

          {/* ===== Problem ===== */}
          <AnimatedSection id="problem" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={Target} title={t('whitepaper.problem')} />
            <div style={{ ...neuRaised, padding: '28px 32px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                {t('whitepaper.problem.heading')}
              </h3>
              {[1, 2, 3, 4].map((n) => (
                <p
                  key={n}
                  style={{
                    margin: '0 0 14px',
                    lineHeight: 1.75,
                    color: TEXT_SECONDARY,
                    fontSize: 15,
                  }}
                >
                  {t(`whitepaper.problem.p${n}`)}
                </p>
              ))}
            </div>
          </AnimatedSection>

          {/* ===== Solution ===== */}
          <AnimatedSection id="solution" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={Zap} title={t('whitepaper.solution')} />
            <div style={{ ...neuRaised, padding: '28px 32px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                {t('whitepaper.solution.heading')}
              </h3>
              {[1, 2, 3, 4, 5].map((n) => (
                <p
                  key={n}
                  style={{
                    margin: '0 0 14px',
                    lineHeight: 1.75,
                    color: TEXT_SECONDARY,
                    fontSize: 15,
                  }}
                >
                  {t(`whitepaper.solution.p${n}`)}
                </p>
              ))}
            </div>
          </AnimatedSection>

          {/* ===== Modules ===== */}
          <AnimatedSection id="modules" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={Cpu} title={t('whitepaper.modules')} />
            <p
              style={{
                margin: '0 0 24px',
                lineHeight: 1.7,
                color: TEXT_SECONDARY,
                fontSize: 15,
              }}
            >
              {t('whitepaper.modules.heading')}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 20,
              }}
            >
              {MODULE_CARDS.map((mod, idx) => {
                const Icon = mod.icon;
                return (
                  <motion.div
                    key={mod.titleKey}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    style={{
                      ...neuRaised,
                      padding: '24px',
                      borderTop: `3px solid ${mod.color}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: `${mod.color}18`,
                          color: mod.color,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: 16,
                          fontWeight: 700,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        {t(mod.titleKey)}
                      </h4>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        lineHeight: 1.65,
                        color: TEXT_SECONDARY,
                        fontSize: 13.5,
                      }}
                    >
                      {t(mod.descKey)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>

          {/* ===== Technology ===== */}
          <AnimatedSection id="technology" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={Database} title={t('whitepaper.technology')} />
            <div style={{ ...neuRaised, padding: '28px 32px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                {t('whitepaper.technology.heading')}
              </h3>
              {[1, 2, 3, 4].map((n) => (
                <p
                  key={n}
                  style={{
                    margin: '0 0 14px',
                    lineHeight: 1.75,
                    color: TEXT_SECONDARY,
                    fontSize: 15,
                  }}
                >
                  {t(`whitepaper.technology.p${n}`)}
                </p>
              ))}

              {/* Tech stack badges */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginTop: 20,
                }}
              >
                {['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Framer Motion', 'EVM Chain'].map(
                  (tech) => (
                    <span
                      key={tech}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        background: NEU_DARK,
                        fontSize: 12,
                        fontWeight: 600,
                        color: TEXT_PRIMARY,
                      }}
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* ===== Tokenomics ===== */}
          <AnimatedSection id="tokenomics" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={Coins} title={t('whitepaper.tokenomics')} />
            <div style={{ ...neuRaised, padding: '28px 32px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                {t('whitepaper.tokenomics.heading')}
              </h3>
              <p style={{ margin: '0 0 20px', lineHeight: 1.75, color: TEXT_SECONDARY, fontSize: 15 }}>
                {t('whitepaper.tokenomics.p1')}
              </p>

              {/* Distribution table */}
              <h4
                style={{
                  margin: '24px 0 14px',
                  fontSize: 16,
                  fontWeight: 700,
                  color: TEXT_PRIMARY,
                }}
              >
                {t('whitepaper.tokenomics.p2').split(':')[0]}
              </h4>
              <div style={neuInset}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 14,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          borderBottom: `2px solid ${NEU_DARK}`,
                          color: TEXT_PRIMARY,
                          fontWeight: 700,
                        }}
                      >
                        Category
                      </th>
                      <th
                        style={{
                          padding: '10px 16px',
                          textAlign: 'right',
                          borderBottom: `2px solid ${NEU_DARK}`,
                          color: TEXT_PRIMARY,
                          fontWeight: 700,
                        }}
                      >
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOKEN_DISTRIBUTION.map((d) => (
                      <tr key={d.label}>
                        <td
                          style={{
                            padding: '10px 16px',
                            borderBottom: `1px solid ${NEU_DARK}80`,
                            color: TEXT_SECONDARY,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 3,
                                background: d.color,
                                flexShrink: 0,
                              }}
                            />
                            {d.label}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '10px 16px',
                            textAlign: 'right',
                            borderBottom: `1px solid ${NEU_DARK}80`,
                            fontWeight: 700,
                            color: TEXT_PRIMARY,
                          }}
                        >
                          {d.percent}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ margin: '16px 0 0', lineHeight: 1.75, color: TEXT_SECONDARY, fontSize: 14 }}>
                {t('whitepaper.tokenomics.p3')}
              </p>
              <p style={{ margin: '12px 0 0', lineHeight: 1.75, color: TEXT_SECONDARY, fontSize: 14 }}>
                {t('whitepaper.tokenomics.p4')}
              </p>
              <p style={{ margin: '12px 0 0', lineHeight: 1.75, color: TEXT_SECONDARY, fontSize: 14 }}>
                {t('whitepaper.tokenomics.p5')}
              </p>
            </div>
          </AnimatedSection>

          {/* ===== Market ===== */}
          <AnimatedSection id="market" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={TrendingUp} title={t('whitepaper.market')} />
            <div style={{ ...neuRaised, padding: '28px 32px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                {t('whitepaper.market.heading')}
              </h3>
              {[1, 2, 3, 4].map((n) => (
                <p
                  key={n}
                  style={{
                    margin: '0 0 14px',
                    lineHeight: 1.75,
                    color: TEXT_SECONDARY,
                    fontSize: 15,
                  }}
                >
                  {t(`whitepaper.market.p${n}`)}
                </p>
              ))}

              {/* Market stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: 14,
                  marginTop: 24,
                }}
              >
                {[
                  { label: '$350B', desc: 'Digital Health 2025' },
                  { label: '$2.4T', desc: 'By 2030' },
                  { label: '27%', desc: 'CAGR' },
                  { label: '$14B', desc: 'Health & Fitness' },
                ].map((stat) => (
                  <div
                    key={stat.desc}
                    style={{
                      ...neuInset,
                      padding: '16px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: TEXT_PRIMARY,
                        marginBottom: 4,
                      }}
                    >
                      {stat.label}
                    </div>
                    <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>{stat.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* ===== Business Model ===== */}
          <AnimatedSection id="business-model" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={Building2} title={t('whitepaper.businessModel')} />
            <div style={{ ...neuRaised, padding: '28px 32px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                {t('whitepaper.businessModel.heading')}
              </h3>
              {[1, 2, 3, 4, 5].map((n) => (
                <p
                  key={n}
                  style={{
                    margin: '0 0 14px',
                    lineHeight: 1.75,
                    color: TEXT_SECONDARY,
                    fontSize: 15,
                  }}
                >
                  {t(`whitepaper.businessModel.p${n}`)}
                </p>
              ))}

              {/* Revenue stream bars */}
              <div style={{ marginTop: 24 }}>
                {[
                  { label: 'Subscriptions', pct: 45, color: '#6b8f71' },
                  { label: 'Marketplace Commission', pct: 25, color: '#5b7fa5' },
                  { label: 'Token Economy', pct: 15, color: '#9b6b9e' },
                  { label: 'Data & Partnerships', pct: 10, color: '#c47a5a' },
                  { label: 'Other', pct: 5, color: '#c4a45a' },
                ].map((r) => (
                  <div key={r.label} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                        fontSize: 13,
                        fontWeight: 600,
                        color: TEXT_PRIMARY,
                      }}
                    >
                      <span>{r.label}</span>
                      <span>{r.pct}%</span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        borderRadius: 4,
                        background: NEU_DARK,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${r.pct}%`,
                          borderRadius: 4,
                          background: r.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* ===== Roadmap ===== */}
          <AnimatedSection id="roadmap" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={Route} title={t('whitepaper.roadmap')} />
            <div style={{ ...neuRaised, padding: '28px 32px' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                {t('whitepaper.roadmap.heading')}
              </h3>

              {/* Timeline */}
              <div style={{ position: 'relative', paddingLeft: 28 }}>
                {/* Vertical line */}
                <div
                  style={{
                    position: 'absolute',
                    left: 8,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: NEU_DARK,
                  }}
                />
                {ROADMAP_PHASES.map((phase, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      marginBottom: idx < ROADMAP_PHASES.length - 1 ? 24 : 0,
                    }}
                  >
                    {/* Dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: -24,
                        top: 4,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: idx === 0 ? ACCENT : NEU_DARK,
                        border: `2px solid ${idx === 0 ? '#fff' : NEU_DARK}`,
                      }}
                    />
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: ACCENT,
                        marginBottom: 4,
                        letterSpacing: '0.03em',
                      }}
                    >
                      {phase.period}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        lineHeight: 1.7,
                        color: TEXT_SECONDARY,
                        fontSize: 14,
                      }}
                    >
                      {t(phase.headingKey)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* ===== Team ===== */}
          <AnimatedSection id="team" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={Users} title={t('whitepaper.team')} />
            <div style={{ ...neuRaised, padding: '28px 32px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                {t('whitepaper.team.heading')}
              </h3>
              {[1, 2, 3].map((n) => (
                <p
                  key={n}
                  style={{
                    margin: '0 0 14px',
                    lineHeight: 1.75,
                    color: TEXT_SECONDARY,
                    fontSize: 15,
                  }}
                >
                  {t(`whitepaper.team.p${n}`)}
                </p>
              ))}
            </div>
          </AnimatedSection>

          {/* ===== Financials ===== */}
          <AnimatedSection id="financials" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={PieChart} title={t('whitepaper.financials')} />
            <div style={{ ...neuRaised, padding: '28px 32px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                {t('whitepaper.financials.heading')}
              </h3>
              {[1, 2, 3, 4].map((n) => (
                <p
                  key={n}
                  style={{
                    margin: '0 0 14px',
                    lineHeight: 1.75,
                    color: TEXT_SECONDARY,
                    fontSize: 15,
                  }}
                >
                  {t(`whitepaper.financials.p${n}`)}
                </p>
              ))}

              {/* Financial table */}
              <div style={{ ...neuInset, marginTop: 24, overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 14,
                    minWidth: 400,
                  }}
                >
                  <thead>
                    <tr>
                      {['Year', 'Users', 'ARR', 'Subscribers'].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: '10px 16px',
                            textAlign: 'left',
                            borderBottom: `2px solid ${NEU_DARK}`,
                            color: TEXT_PRIMARY,
                            fontWeight: 700,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FINANCIAL_YEARS.map((fy) => (
                      <tr key={fy.year}>
                        <td
                          style={{
                            padding: '10px 16px',
                            borderBottom: `1px solid ${NEU_DARK}80`,
                            fontWeight: 700,
                            color: TEXT_PRIMARY,
                          }}
                        >
                          {fy.year}
                        </td>
                        <td
                          style={{
                            padding: '10px 16px',
                            borderBottom: `1px solid ${NEU_DARK}80`,
                            color: TEXT_SECONDARY,
                          }}
                        >
                          {fy.users}
                        </td>
                        <td
                          style={{
                            padding: '10px 16px',
                            borderBottom: `1px solid ${NEU_DARK}80`,
                            fontWeight: 700,
                            color: '#6b8f71',
                          }}
                        >
                          {fy.arr}
                        </td>
                        <td
                          style={{
                            padding: '10px 16px',
                            borderBottom: `1px solid ${NEU_DARK}80`,
                            color: TEXT_SECONDARY,
                          }}
                        >
                          {fy.subs}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedSection>

          {/* ===== Risks ===== */}
          <AnimatedSection id="risks" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={ShieldAlert} title={t('whitepaper.risks')} />
            <div style={{ ...neuRaised, padding: '28px 32px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                {t('whitepaper.risks.heading')}
              </h3>
              {[1, 2, 3, 4].map((n) => (
                <p
                  key={n}
                  style={{
                    margin: '0 0 14px',
                    lineHeight: 1.75,
                    color: TEXT_SECONDARY,
                    fontSize: 15,
                  }}
                >
                  {t(`whitepaper.risks.p${n}`)}
                </p>
              ))}
            </div>
          </AnimatedSection>

          {/* ===== Contact ===== */}
          <AnimatedSection id="contact" className="wp-section" style={{ marginBottom: 56 }}>
            <SectionHeading icon={Mail} title={t('whitepaper.contact')} />
            <div style={{ ...neuRaised, padding: '28px 32px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY }}>
                {t('whitepaper.contact.heading')}
              </h3>
              {[1, 2].map((n) => (
                <p
                  key={n}
                  style={{
                    margin: '0 0 14px',
                    lineHeight: 1.75,
                    color: TEXT_SECONDARY,
                    fontSize: 15,
                  }}
                >
                  {t(`whitepaper.contact.p${n}`)}
                </p>
              ))}

              {/* Contact channels */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 12,
                  marginTop: 20,
                }}
              >
                {[
                  { icon: Mail, label: 'info@ethoslife.com' },
                  { icon: Globe, label: 'partnerships@ethoslife.com' },
                  { icon: Users, label: 'support@ethoslife.com' },
                ].map((ch) => (
                  <div
                    key={ch.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: NEU_DARK,
                      fontSize: 13,
                      color: TEXT_PRIMARY,
                      fontWeight: 500,
                    }}
                  >
                    <ch.icon size={16} color={ACCENT} />
                    {ch.label}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* ===== CTA ===== */}
          <AnimatedSection style={{ marginBottom: 40 }}>
            <div
              style={{
                ...neuRaised,
                padding: '40px 32px',
                textAlign: 'center',
                background: `linear-gradient(160deg, ${NEU_DARK}, ${NEU_LIGHT})`,
              }}
            >
              <Globe size={36} color={ACCENT} style={{ marginBottom: 16 }} />
              <h3
                style={{
                  margin: '0 0 12px',
                  fontSize: 24,
                  fontWeight: 800,
                  color: TEXT_PRIMARY,
                }}
              >
                {t('whitepaper.cta.title')}
              </h3>
              <p
                style={{
                  margin: '0 0 24px',
                  lineHeight: 1.7,
                  color: TEXT_SECONDARY,
                  fontSize: 15,
                  maxWidth: 500,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {t('whitepaper.cta.description')}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <a
                  href="/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 28px',
                    borderRadius: 12,
                    border: 'none',
                    background: `linear-gradient(135deg, ${ACCENT}, ${TEXT_SECONDARY})`,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    boxShadow: `4px 4px 10px ${NEU_DARK}`,
                  }}
                >
                  <ChevronRight size={18} />
                  {t('whitepaper.cta.startFree')}
                </a>
                <a
                  href="/contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 28px',
                    borderRadius: 12,
                    border: 'none',
                    background: NEU_LIGHT,
                    color: TEXT_PRIMARY,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    boxShadow: `4px 4px 10px ${NEU_DARK}, -4px -4px 10px #ffffff`,
                  }}
                >
                  <Mail size={18} />
                  {t('whitepaper.cta.contactUs')}
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* ===== Footer note ===== */}
          <div
            style={{
              textAlign: 'center',
              padding: '24px 0',
              borderTop: `1px solid ${NEU_DARK}`,
              fontSize: 12,
              color: TEXT_SECONDARY,
            }}
          >
            {t('whitepaper.confidential')} &mdash; {t('whitepaper.lastUpdated')} &mdash; &copy; 2026 EthosLife.{' '}
            {t('whitepaper.footer.rights')}
          </div>
        </main>
      </div>
    </PageLayout>
  );
};

export default WhitePaper;
