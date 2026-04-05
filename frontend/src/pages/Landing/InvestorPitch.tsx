/**
 * InvestorPitch — Professional Investor Pitch Deck Page
 * Slide-based presentation with neumorphic design, full i18n,
 * keyboard/touch navigation, and data visualization.
 *
 * 15 slides: Title, Problem, Solution, Market, Competitive,
 * Business Model, Token, Traction, Roadmap, Use of Funds,
 * Projections, Token Sale, The Ask, Contact, Closing.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowLeft,
  Menu,
  X,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  BarChart3,
  Building2,
  Coins,
  Rocket,
  Map as MapIcon,
  DollarSign,
  Target,
  Users,
  Star,
  Mail,
  Globe,
  FileText,
  Calendar,
  CreditCard,
  Store,
  CheckCircle2,
  XCircle,
  Layers,
  Zap,
  Home,
  Github,
  Heart,
  ArrowRight,
  Shield,
} from 'lucide-react';
import PageLayout from '../../components/Layout/PageLayout';

// ─── Types ───────────────────────────────────────────────────────────────────

type SlideId =
  | 'title'
  | 'problem'
  | 'solution'
  | 'market'
  | 'competitive'
  | 'businessModel'
  | 'token'
  | 'traction'
  | 'roadmap'
  | 'useOfFunds'
  | 'projections'
  | 'tokenSale'
  | 'theAsk'
  | 'contact'
  | 'closing';

interface SlideDef {
  id: SlideId;
  icon: React.ReactNode;
  accentColor: string;
}

interface MarketStat {
  label: string;
  value: string;
}

interface CompetitorRow {
  name: string;
  modules: number;
  ai: boolean;
  social: boolean;
  marketplace: boolean;
  token: boolean;
}

interface BizStream {
  name: string;
  desc: string;
  icon: string;
}

interface FundItem {
  category: string;
  amount: string;
  percent: number;
  desc: string;
}

interface ProjectionRow {
  year: string;
  users: string;
  revenue: string;
  subs: string;
  mrr: string;
}

interface RoadmapPhase {
  quarter: string;
  title: string;
  desc: string;
  status: string;
}

// ─── Slide Definitions ───────────────────────────────────────────────────────

const SLIDES: SlideDef[] = [
  { id: 'title', icon: <FileText className="w-8 h-8" />, accentColor: '#5c5243' },
  { id: 'problem', icon: <AlertTriangle className="w-7 h-7" />, accentColor: '#b45959' },
  { id: 'solution', icon: <Lightbulb className="w-7 h-7" />, accentColor: '#c9a84c' },
  { id: 'market', icon: <TrendingUp className="w-7 h-7" />, accentColor: '#4c8c5a' },
  { id: 'competitive', icon: <Layers className="w-7 h-7" />, accentColor: '#5c7a9e' },
  { id: 'businessModel', icon: <Building2 className="w-7 h-7" />, accentColor: '#8c7a6b' },
  { id: 'token', icon: <Coins className="w-7 h-7" />, accentColor: '#c9a84c' },
  { id: 'traction', icon: <Rocket className="w-7 h-7" />, accentColor: '#d4763a' },
  { id: 'roadmap', icon: <MapIcon className="w-7 h-7" />, accentColor: '#4c8c8c' },
  { id: 'useOfFunds', icon: <DollarSign className="w-7 h-7" />, accentColor: '#4c8c5a' },
  { id: 'projections', icon: <BarChart3 className="w-7 h-7" />, accentColor: '#5c7a9e' },
  { id: 'tokenSale', icon: <Target className="w-7 h-7" />, accentColor: '#c9a84c' },
  { id: 'theAsk', icon: <Zap className="w-7 h-7" />, accentColor: '#d4763a' },
  { id: 'contact', icon: <Mail className="w-7 h-7" />, accentColor: '#5c5243' },
  { id: 'closing', icon: <Heart className="w-7 h-7" />, accentColor: '#b45959' },
];

const SLIDE_INDEX = new Map<SlideId, number>(SLIDES.map((s, i) => [s.id, i]));

// ─── Animation Variants ──────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 700 : -700,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 700 : -700,
    opacity: 0,
    scale: 0.96,
  }),
};

const neuShadow = {
  base: '8px 8px 16px rgba(44,40,34,0.12), -8px -8px 16px rgba(255,255,255,0.65)',
  inset: 'inset 4px 4px 8px rgba(44,40,34,0.10), inset -4px -4px 8px rgba(255,255,255,0.50)',
};

const COLORS = ['#5c5243', '#8c7a6b', '#4c8c5a', '#c9a84c', '#5c7a9e', '#d4763a'];

// ─── Helper: Stream Icon Mapper ──────────────────────────────────────────────

function streamIcon(name: string) {
  switch (name) {
    case 'credit-card':
      return <CreditCard className="w-5 h-5" />;
    case 'store':
      return <Store className="w-5 h-5" />;
    case 'building':
      return <Building2 className="w-5 h-5" />;
    case 'coins':
      return <Coins className="w-5 h-5" />;
    default:
      return <CreditCard className="w-5 h-5" />;
  }
}

// ─── SLIDE RENDERERS ─────────────────────────────────────────────────────────

/* ---- Slide 1: Title ---- */
function SlideTitle({ t }: { t: TFunction }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotateY: 90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#5c5243] via-[#8c7a6b] to-[#c9a84c] flex items-center justify-center text-white mb-10 shadow-2xl"
      >
        <span className="text-5xl font-black tracking-tight">E</span>
      </motion.div>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-4xl md:text-6xl font-black text-[#2d2418] mb-3 tracking-tight"
      >
        {t('investorPitch.slides.title.title')}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="text-lg md:text-xl text-[#5c5243] mb-8 max-w-xl"
      >
        {t('investorPitch.slides.title.subtitle')}
      </motion.p>

      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex flex-col items-center gap-2"
      >
        <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-lg shadow-lg">
          {t('investorPitch.slides.title.round')}
        </span>
        <div className="flex items-center gap-2 text-sm text-[#8c7a6b] mt-2">
          <Calendar className="w-4 h-4" />
          <span>{t('investorPitch.slides.title.confidential')}</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ---- Slide 2: Problem ---- */
function SlideProblem({ t }: { t: TFunction }) {
  const points: string[] = t('investorPitch.slides.problem.points', { returnObjects: true }) as unknown as string[];
  const summary = t('investorPitch.slides.problem.summary');

  return (
    <div className="h-full px-6 md:px-12 py-8 flex flex-col">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#b45959' }}>
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-[#2d2418]">{t('investorPitch.slides.problem.title')}</h2>
      </motion.div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {points.map((pt, i) => (
          <motion.div
            key={i}
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="flex items-start gap-4 rounded-2xl p-4"
            style={{ backgroundColor: '#e4dfd5', boxShadow: neuShadow.inset }}
          >
            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-[#5c5243] text-base md:text-lg leading-relaxed">{pt}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[#b45959]/10 to-[#b45959]/5 border-l-4 border-[#b45959]">
        <p className="text-[#5c5243] text-sm md:text-base font-medium italic">{summary}</p>
      </motion.div>
    </div>
  );
}

/* ---- Slide 3: Solution ---- */
function SlideSolution({ t }: { t: TFunction }) {
  const points: string[] = t('investorPitch.slides.solution.points', { returnObjects: true }) as unknown as string[];
  const summary = t('investorPitch.slides.solution.summary');

  return (
    <div className="h-full px-6 md:px-12 py-8 flex flex-col">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#c9a84c' }}>
          <Lightbulb className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-[#2d2418]">{t('investorPitch.slides.solution.title')}</h2>
      </motion.div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {points.map((pt, i) => (
          <motion.div
            key={i}
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="flex items-start gap-4 rounded-2xl p-4"
            style={{ backgroundColor: '#e4dfd5', boxShadow: neuShadow.inset }}
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-[#5c5243] text-base md:text-lg leading-relaxed">{pt}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[#c9a84c]/10 to-[#c9a84c]/5 border-l-4 border-[#c9a84c]">
        <p className="text-[#5c5243] text-sm md:text-base font-medium italic">{summary}</p>
      </motion.div>
    </div>
  );
}

/* ---- Slide 4: Market ---- */
function SlideMarket({ t }: { t: TFunction }) {
  const stats: MarketStat[] = t('investorPitch.slides.market.stats', { returnObjects: true }) as unknown as MarketStat[];
  const summary = t('investorPitch.slides.market.summary');

  return (
    <div className="h-full px-6 md:px-12 py-8 flex flex-col">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#4c8c5a' }}>
          <TrendingUp className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-[#2d2418]">{t('investorPitch.slides.market.title')}</h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="rounded-2xl p-6 text-center"
            style={{ backgroundColor: '#e4dfd5', boxShadow: neuShadow.base }}
          >
            <p className="text-3xl md:text-4xl font-black mb-1" style={{ color: COLORS[i % COLORS.length] }}>{s.value}</p>
            <p className="text-xs md:text-sm text-[#8c7a6b] font-medium uppercase tracking-wide">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="mt-auto p-5 rounded-2xl bg-gradient-to-r from-[#4c8c5a]/10 to-[#4c8c5a]/5 border-l-4 border-[#4c8c5a]">
        <p className="text-[#5c5243] text-sm md:text-base font-medium italic">{summary}</p>
      </motion.div>
    </div>
  );
}

/* ---- Slide 5: Competitive ---- */
function SlideCompetitive({ t }: { t: TFunction }) {
  const summary = t('investorPitch.slides.competitive.summary');
  const competitors: CompetitorRow[] = t('investorPitch.slides.competitive.competitors', { returnObjects: true }) as unknown as CompetitorRow[];

  return (
    <div className="h-full px-6 md:px-12 py-8 flex flex-col">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#5c7a9e' }}>
          <Layers className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#2d2418]">{t('investorPitch.slides.competitive.title')}</h2>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[#5c5243] text-sm md:text-base mb-6 italic">{summary}</motion.p>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm md:text-base" cellSpacing={0}>
          <thead>
            <tr className="border-b-2 border-[#c9b8a6]">
              <th className="text-left py-3 px-3 text-[#2d2418] font-bold">Platform</th>
              <th className="text-center py-3 px-2 text-[#2d2418] font-bold">Modules</th>
              <th className="text-center py-3 px-2 text-[#2d2418] font-bold">AI</th>
              <th className="text-center py-3 px-2 text-[#2d2418] font-bold">Social</th>
              <th className="text-center py-3 px-2 text-[#2d2418] font-bold">Market</th>
              <th className="text-center py-3 px-2 text-[#2d2418] font-bold">Token</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, i) => {
              const isEthos = c.name === 'EthosLife';
              return (
                <motion.tr
                  key={i}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className={`border-b border-[#c9b8a6]/40 ${isEthos ? 'bg-gradient-to-r from-[#c9a84c]/15 to-[#5c5243]/10 font-bold' : ''}`}
                >
                  <td className="py-3 px-3 text-[#5c5243]">{c.name}</td>
                  <td className="py-3 px-2 text-center text-[#5c5243]">{c.modules}</td>
                  <td className="py-3 px-2 text-center">{c.ai ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /> : <XCircle className="w-5 h-5 text-red-400 mx-auto" />}</td>
                  <td className="py-3 px-2 text-center">{c.social ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /> : <XCircle className="w-5 h-5 text-red-400 mx-auto" />}</td>
                  <td className="py-3 px-2 text-center">{c.marketplace ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /> : <XCircle className="w-5 h-5 text-red-400 mx-auto" />}</td>
                  <td className="py-3 px-2 text-center">{c.token ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" /> : <XCircle className="w-5 h-5 text-red-400 mx-auto" />}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---- Slide 6: Business Model ---- */
function SlideBusinessModel({ t }: { t: TFunction }) {
  const streams: BizStream[] = t('investorPitch.slides.businessModel.streams', { returnObjects: true }) as unknown as BizStream[];

  return (
    <div className="h-full px-6 md:px-12 py-8 flex flex-col">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#8c7a6b' }}>
          <Building2 className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-[#2d2418]">{t('investorPitch.slides.businessModel.title')}</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2">
        {streams.map((s, i) => (
          <motion.div
            key={i}
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#e4dfd5', boxShadow: neuShadow.base }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                {streamIcon(s.icon)}
              </div>
              <h3 className="text-lg font-bold text-[#2d2418]">{s.name}</h3>
            </div>
            <p className="text-[#5c5243] text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---- Slide 7: Token ---- */
function SlideToken({ t }: { t: TFunction }) {
  const totalSupply = t('investorPitch.slides.token.totalSupply');
  const ways: string[] = t('investorPitch.slides.token.earningWays', { returnObjects: true }) as unknown as string[];
  const utility = t('investorPitch.slides.token.utility');

  return (
    <div className="h-full px-6 md:px-12 py-8 flex flex-col">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#c9a84c' }}>
          <Coins className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#2d2418]">{t('investorPitch.slides.token.title')}</h2>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-5">
        <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#5c5243] text-white font-bold text-sm shadow-md">
          {totalSupply}
        </span>
      </motion.div>

      <h3 className="text-sm font-bold text-[#8c7a6b] uppercase tracking-wide mb-3">7 Ways to Earn UNITY</h3>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 mb-4">
        {ways.map((w, i) => (
          <motion.div
            key={i}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            className="flex items-start gap-3 rounded-xl p-3"
            style={{ backgroundColor: '#e4dfd5', boxShadow: neuShadow.inset }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
              {i + 1}
            </div>
            <p className="text-[#5c5243] text-sm md:text-base leading-relaxed">{w}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="p-4 rounded-2xl bg-gradient-to-r from-[#c9a84c]/10 to-[#c9a84c]/5 border-l-4 border-[#c9a84c]">
        <p className="text-[#5c5243] text-xs md:text-sm font-medium">{utility}</p>
      </motion.div>
    </div>
  );
}

/* ---- Slide 8: Traction ---- */
function SlideTraction({ t }: { t: TFunction }) {
  type TractionStat = { label: string; value: string };
  const stats: TractionStat[] = t('investorPitch.slides.traction.stats', { returnObjects: true }) as unknown as TractionStat[];
  const summary = t('investorPitch.slides.traction.summary');

  return (
    <div className="h-full px-6 md:px-12 py-8 flex flex-col">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#d4763a' }}>
          <Rocket className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-[#2d2418]">{t('investorPitch.slides.traction.title')}</h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="rounded-2xl p-5 text-center"
            style={{ backgroundColor: '#e4dfd5', boxShadow: neuShadow.base }}
          >
            <p className="text-2xl md:text-3xl font-black mb-1" style={{ color: COLORS[i % COLORS.length] }}>{s.value}</p>
            <p className="text-xs text-[#8c7a6b] font-medium uppercase tracking-wide">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65 }} className="mt-auto p-5 rounded-2xl bg-gradient-to-r from-[#d4763a]/10 to-[#d4763a]/5 border-l-4 border-[#d4763a]">
        <p className="text-[#5c5243] text-sm md:text-base font-medium italic">{summary}</p>
      </motion.div>
    </div>
  );
}

/* ---- Slide 9: Roadmap ---- */
function SlideRoadmap({ t }: { t: TFunction }) {
  const phases: RoadmapPhase[] = t('investorPitch.slides.roadmap.phases', { returnObjects: true }) as unknown as RoadmapPhase[];

  return (
    <div className="h-full px-6 md:px-12 py-8 flex flex-col">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#4c8c8c' }}>
          <MapIcon className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-[#2d2418]">{t('investorPitch.slides.roadmap.title')}</h2>
      </motion.div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-0">
        {phases.map((p, i) => (
          <motion.div
            key={i}
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="flex gap-4"
          >
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full flex-shrink-0 border-2 ${p.status === 'current' ? 'bg-[#4c8c8c] border-[#4c8c8c] ring-4 ring-[#4c8c8c]/30' : 'bg-[#dcd3c6] border-[#8c7a6b]'}`} />
              {i < phases.length - 1 && <div className="w-0.5 flex-1 bg-[#c9b8a6] mt-1" />}
            </div>

            {/* Card */}
            <div className={`flex-1 rounded-2xl p-4 mb-3 ${p.status === 'current' ? 'bg-gradient-to-r from-[#4c8c8c]/15 to-[#4c8c8c]/5 border border-[#4c8c8c]/30' : ''}`} style={{ backgroundColor: p.status === 'current' ? undefined : '#e4dfd5', boxShadow: p.status === 'current' ? undefined : neuShadow.base }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#4c8c8c]/20 text-[#4c8c8c]">{p.quarter}</span>
                {p.status === 'current' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Current</span>}
              </div>
              <h3 className="text-base font-bold text-[#2d2418] mb-1">{p.title}</h3>
              <p className="text-[#5c5243] text-sm">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---- Slide 10: Use of Funds ---- */
function SlideUseOfFunds({ t }: { t: TFunction }) {
  const items: FundItem[] = t('investorPitch.slides.useOfFunds.items', { returnObjects: true }) as unknown as FundItem[];
  const maxPercent = Math.max(...items.map((it) => it.percent));

  return (
    <div className="h-full px-6 md:px-12 py-8 flex flex-col">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#4c8c5a' }}>
          <DollarSign className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#2d2418]">{t('investorPitch.slides.useOfFunds.title')}</h2>
      </motion.div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {items.map((item, i) => {
          const barWidth = (item.percent / maxPercent) * 100;
          return (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="rounded-2xl p-4"
              style={{ backgroundColor: '#e4dfd5', boxShadow: neuShadow.inset }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-bold text-[#2d2418]">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: COLORS[i % COLORS.length] }}>{item.amount}</span>
                  <span className="text-xs text-[#8c7a6b] font-medium">({item.percent}%)</span>
                </div>
              </div>
              {/* Bar */}
              <div className="w-full h-3 rounded-full bg-[#dcd3c6]" style={{ boxShadow: neuShadow.inset }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
              </div>
              <p className="text-xs text-[#8c7a6b] mt-1.5">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Total bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-4 flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#4c8c5a]/10 to-transparent">
        <span className="text-sm font-bold text-[#2d2418]">Total</span>
        <span className="text-xl font-black text-[#4c8c5a]">$250,000</span>
      </motion.div>
    </div>
  );
}

/* ---- Slide 11: Financial Projections ---- */
function SlideProjections({ t }: { t: TFunction }) {
  const years: ProjectionRow[] = t('investorPitch.slides.projections.years', { returnObjects: true }) as unknown as ProjectionRow[];

  const maxMrr = Math.max(...years.map((y) => parseFloat(y.mrr.replace(/[^\d.]/g, '')) || 0));

  return (
    <div className="h-full px-6 md:px-12 py-8 flex flex-col">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#5c7a9e' }}>
          <BarChart3 className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-[#2d2418]">{t('investorPitch.slides.projections.title')}</h2>
      </motion.div>

      {/* Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm" cellSpacing={0}>
          <thead>
            <tr className="border-b-2 border-[#c9b8a6]">
              <th className="text-left py-3 px-3 text-[#2d2418] font-bold">Year</th>
              <th className="text-center py-3 px-2 text-[#2d2418] font-bold">Users</th>
              <th className="text-center py-3 px-2 text-[#2d2418] font-bold">Revenue</th>
              <th className="text-center py-3 px-2 text-[#2d2418] font-bold">Subscribers</th>
              <th className="text-center py-3 px-2 text-[#2d2418] font-bold">MRR</th>
            </tr>
          </thead>
          <tbody>
            {years.map((y, i) => (
              <motion.tr
                key={i}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className={`border-b border-[#c9b8a6]/40 ${i === years.length - 1 ? 'bg-gradient-to-r from-[#5c7a9e]/10 to-transparent font-bold' : ''}`}
              >
                <td className="py-3 px-3 text-[#5c5243]">{y.year}</td>
                <td className="py-3 px-2 text-center text-[#5c5243]">{y.users}</td>
                <td className="py-3 px-2 text-center text-[#5c5243]">{y.revenue}</td>
                <td className="py-3 px-2 text-center text-[#5c5243]">{y.subs}</td>
                <td className="py-3 px-2 text-center font-semibold" style={{ color: COLORS[i % COLORS.length] }}>{y.mrr}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MRR bar chart */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#8c7a6b] uppercase tracking-wide">MRR Growth</h3>
        {years.map((y, i) => {
          const val = parseFloat(y.mrr.replace(/[^\d.]/g, '')) || 0;
          const pct = maxMrr > 0 ? (val / maxMrr) * 100 : 0;
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-medium text-[#5c5243] w-16 text-right">{y.year}</span>
              <div className="flex-1 h-4 rounded-full bg-[#dcd3c6]" style={{ boxShadow: neuShadow.inset }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
              </div>
              <span className="text-xs font-bold w-16" style={{ color: COLORS[i % COLORS.length] }}>{y.mrr}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Slide 12: Token Sale ---- */
function SlideTokenSale({ t }: { t: TFunction }) {
  const saleData = [
    { label: t('investorPitch.slides.theAsk.raising'), value: '$250,000', icon: <DollarSign className="w-5 h-5" /> },
    { label: t('investorPitch.slides.theAsk.instrument'), value: 'SAFE / Convertible Note', icon: <Shield className="w-5 h-5" /> },
    { label: t('investorPitch.slides.theAsk.valuationCap'), value: '$5M', icon: <Target className="w-5 h-5" /> },
    { label: 'Seed Round', value: '$1.65M at $0.011/UNITY', icon: <Coins className="w-5 h-5" /> },
  ];

  return (
    <div className="h-full px-6 md:px-12 py-8 flex flex-col">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#c9a84c' }}>
          <Target className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-[#2d2418]">{t('investorPitch.slides.tokenSale.title')}</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start overflow-y-auto pr-2">
        {saleData.map((d, i) => (
          <motion.div
            key={i}
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#e4dfd5', boxShadow: neuShadow.base }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                {d.icon}
              </div>
              <span className="text-sm font-medium text-[#8c7a6b] uppercase tracking-wide">{d.label}</span>
            </div>
            <p className="text-xl md:text-2xl font-black text-[#2d2418]">{d.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---- Slide 13: The Ask ---- */
function SlideTheAsk({ t }: { t: TFunction }) {
  const items = [
    { label: 'Raising', value: t('investorPitch.slides.theAsk.raising'), color: '#4c8c5a' },
    { label: 'Instrument', value: t('investorPitch.slides.theAsk.instrument'), color: '#5c7a9e' },
    { label: 'Valuation Cap', value: t('investorPitch.slides.theAsk.valuationCap'), color: '#c9a84c' },
    { label: 'Use of Funds', value: t('investorPitch.slides.theAsk.use'), color: '#d4763a' },
    { label: 'Next Round', value: t('investorPitch.slides.theAsk.nextRound'), color: '#4c8c8c' },
    { label: 'Exit Potential', value: t('investorPitch.slides.theAsk.exitPotential'), color: '#b45959' },
  ];

  return (
    <div className="h-full px-6 md:px-12 py-8 flex flex-col">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#d4763a' }}>
          <Zap className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-[#2d2418]">{t('investorPitch.slides.theAsk.title')}</h2>
      </motion.div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.07 }}
            className="rounded-2xl p-5"
            style={{ backgroundColor: '#e4dfd5', boxShadow: neuShadow.base }}
          >
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-[#8c7a6b]">{item.label}</span>
                <p className="text-[#2d2418] text-base md:text-lg font-bold mt-0.5 leading-relaxed">{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---- Slide 14: Contact ---- */
function SlideContact({ t }: { t: TFunction }) {
  const contacts = [
    { icon: <Globe className="w-5 h-5" />, label: t('investorPitch.slides.contact.website'), href: 'https://ethoslife.com' },
    { icon: <Mail className="w-5 h-5" />, label: t('investorPitch.slides.contact.email'), href: 'mailto:invest@ethoslife.com' },
    { icon: <Github className="w-5 h-5" />, label: t('investorPitch.slides.contact.github'), href: 'https://github.com/foxampy/EthosLife' },
    { icon: <FileText className="w-5 h-5" />, label: t('investorPitch.slides.contact.whitepaper'), href: 'https://ethoslife.com/whitepaper' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white mb-6 shadow-xl"
      >
        <Mail className="w-10 h-10" />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-black text-[#2d2418] mb-2"
      >
        {t('investorPitch.slides.contact.title')}
      </motion.h2>

      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-base text-[#5c5243] mb-8 italic"
      >
        {t('investorPitch.slides.contact.tagline')}
      </motion.p>

      <div className="space-y-3 w-full max-w-md">
        {contacts.map((c, i) => (
          <motion.a
            key={i}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 + i * 0.08 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 rounded-2xl p-4 transition-colors cursor-pointer no-underline"
            style={{ backgroundColor: '#e4dfd5', boxShadow: neuShadow.base }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
              {c.icon}
            </div>
            <span className="text-[#5c5243] text-sm md:text-base font-medium text-left break-all">{c.label}</span>
            <ArrowRight className="w-4 h-4 text-[#8c7a6b] ml-auto flex-shrink-0" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}

/* ---- Slide 15: Closing ---- */
function SlideClosing({ t }: { t: TFunction }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#5c5243] flex items-center justify-center text-white mb-8 shadow-2xl"
      >
        <Heart className="w-12 h-12" />
      </motion.div>

      <motion.h2
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl md:text-5xl font-black text-[#2d2418] mb-4 leading-tight"
      >
        Join the Revolution
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-lg md:text-xl text-[#5c5243] max-w-xl mb-8 leading-relaxed"
      >
        Help us build the future of health — one person, one habit, one community at a time.
      </motion.p>

      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <a
          href="mailto:invest@ethoslife.com"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-lg shadow-xl"
        >
          <Mail className="w-5 h-5" />
          invest@ethoslife.com
        </a>
        <a
          href="https://ethoslife.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#e4dfd5] text-[#5c5243] font-bold text-lg"
          style={{ boxShadow: neuShadow.base }}
        >
          <Globe className="w-5 h-5" />
          ethoslife.com
        </a>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-xs text-[#8c7a6b]"
      >
        EthosLife {String.fromCharCode(169)} 2026 — All rights reserved
      </motion.p>
    </div>
  );
}

// ─── Slide Renderer Dispatch ─────────────────────────────────────────────────

function SlideRenderer({ id, t }: { id: SlideId; t: TFunction }) {
  switch (id) {
    case 'title':
      return <SlideTitle t={t} />;
    case 'problem':
      return <SlideProblem t={t} />;
    case 'solution':
      return <SlideSolution t={t} />;
    case 'market':
      return <SlideMarket t={t} />;
    case 'competitive':
      return <SlideCompetitive t={t} />;
    case 'businessModel':
      return <SlideBusinessModel t={t} />;
    case 'token':
      return <SlideToken t={t} />;
    case 'traction':
      return <SlideTraction t={t} />;
    case 'roadmap':
      return <SlideRoadmap t={t} />;
    case 'useOfFunds':
      return <SlideUseOfFunds t={t} />;
    case 'projections':
      return <SlideProjections t={t} />;
    case 'tokenSale':
      return <SlideTokenSale t={t} />;
    case 'theAsk':
      return <SlideTheAsk t={t} />;
    case 'contact':
      return <SlideContact t={t} />;
    case 'closing':
      return <SlideClosing t={t} />;
    default:
      return <div className="p-12 text-center text-[#5c5243]">Slide not found</div>;
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

const TOTAL_SLIDES = SLIDES.length;

const InvestorPitch: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  // Responsive
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Navigation
  const navigateSlide = useCallback((idx: number) => {
    if (idx < 0 || idx >= TOTAL_SLIDES) return;
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  }, [currentSlide]);

  const goNext = useCallback(() => navigateSlide(currentSlide + 1), [currentSlide, navigateSlide]);
  const goPrev = useCallback(() => navigateSlide(currentSlide - 1), [currentSlide, navigateSlide]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        navigateSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        navigateSlide(TOTAL_SLIDES - 1);
      } else if (e.key === 'Escape') {
        setTocOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, navigateSlide]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const dist = touchStart - touchEnd;
    if (dist > minSwipeDistance) goNext();
    if (dist < -minSwipeDistance) goPrev();
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const slideId = SLIDES[currentSlide].id;

  return (
    <PageLayout>
      <div
        className="min-h-screen bg-gradient-to-br from-[#dcd3c6] via-[#e4dfd5] to-[#f5f0eb] select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
        {/* ── Top Bar ─────────────────────────────────────────────────── */}
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-[#e4dfd5]/90 backdrop-blur-md border-b border-[#c9b8a6]/30 print:hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e4dfd5] text-[#5c5243] font-medium text-sm shadow-[3px_3px_6px_rgba(44,40,34,0.1),-3px_-3px_6px_rgba(255,255,255,0.65)] hover:shadow-[5px_5px_10px_rgba(44,40,34,0.14),-5px_-5px_10px_rgba(255,255,255,0.7)] transition-all"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Home className="w-4 h-4" />
                {t('investorPitch.backToHome')}
              </motion.button>

              {isMobile && (
                <button
                  onClick={() => setTocOpen(!tocOpen)}
                  className="p-2 rounded-xl bg-[#e4dfd5] text-[#5c5243] shadow-[3px_3px_6px_rgba(44,40,34,0.1),-3px_-3px_6px_rgba(255,255,255,0.65)]"
                  aria-label="Toggle table of contents"
                >
                  {tocOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-[#5c5243] tabular-nums">
                {currentSlide + 1} / {TOTAL_SLIDES}
              </span>
              <motion.button
                onClick={handleDownloadPdf}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-sm rounded-xl shadow-lg"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Download className="w-4 h-4" />
                {t('investorPitch.downloadPdf')}
              </motion.button>
            </div>
          </div>
        </header>

        {/* ── Mobile TOC Drawer ───────────────────────────────────────── */}
        <AnimatePresence>
          {isMobile && tocOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-4 right-4 z-40 rounded-2xl bg-[#e4dfd5] p-4"
              style={{ boxShadow: neuShadow.base }}
            >
              <nav className="space-y-1 max-h-72 overflow-y-auto">
                {SLIDES.map((s, idx) => {
                  const isActive = currentSlide === idx;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        navigateSlide(idx);
                        setTocOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-semibold shadow-md'
                          : 'text-[#5c5243] hover:bg-[#d4ccb8]/60'
                      }`}
                    >
                      <span className="w-5 h-5 flex-shrink-0">{s.icon}</span>
                      <span className="truncate">{t(`investorPitch.slides.${s.id}.title`)}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Content ────────────────────────────────────────────── */}
        <div className="flex min-h-screen pt-16">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside className="w-72 flex-shrink-0 pt-4 pb-4 px-4 print:hidden">
              <div className="sticky top-24">
                <div className="rounded-3xl bg-[#e4dfd5] p-5" style={{ boxShadow: neuShadow.base }}>
                  <h3 className="text-sm font-bold text-[#2d2418] mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#5c5243]" />
                    {t('investorPitch.toc')}
                  </h3>
                  <nav className="space-y-0.5">
                    {SLIDES.map((s, idx) => {
                      const isActive = currentSlide === idx;
                      return (
                        <button
                          key={s.id}
                          onClick={() => navigateSlide(idx)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-semibold shadow-md'
                              : 'text-[#5c5243] hover:bg-[#d4ccb8]/60'
                          }`}
                        >
                          <span className="text-xs w-5 text-center tabular-nums opacity-60">{idx + 1}</span>
                          <span className="w-5 h-5 flex-shrink-0">{s.icon}</span>
                          <span className="truncate text-left">{t(`investorPitch.slides.${s.id}.title`)}</span>
                        </button>
                      );
                    })}
                  </nav>

                  <div className="mt-5 pt-4 border-t border-[#c9b8a6]/30">
                    <motion.button
                      onClick={handleDownloadPdf}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white font-bold text-sm rounded-xl shadow-md"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Download className="w-4 h-4" />
                      {t('investorPitch.downloadPdf')}
                    </motion.button>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Slide Viewport */}
          <main className="flex-1 flex items-center justify-center px-4 py-8">
            <div className="relative w-full max-w-4xl">
              {/* Prev button */}
              {currentSlide > 0 && (
                <motion.button
                  onClick={goPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-6 z-20 w-12 h-12 rounded-full bg-[#e4dfd5] text-[#5c5243] flex items-center justify-center shadow-lg transition-all"
                  style={{ boxShadow: neuShadow.base }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={t('investorPitch.prev')}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
              )}

              {/* Next button */}
              {currentSlide < TOTAL_SLIDES - 1 && (
                <motion.button
                  onClick={goNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-6 z-20 w-12 h-12 rounded-full bg-[#e4dfd5] text-[#5c5243] flex items-center justify-center shadow-lg transition-all"
                  style={{ boxShadow: neuShadow.base }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={t('investorPitch.next')}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              )}

              {/* Slide Card */}
              <div
                className="rounded-3xl bg-[#e4dfd5] overflow-hidden"
                style={{
                  minHeight: isMobile ? '60vh' : '72vh',
                  boxShadow: neuShadow.base,
                }}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.25 },
                    }}
                    className="h-full"
                  >
                    <SlideRenderer id={slideId} t={t} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dot Indicators */}
              <div className="flex items-center justify-center gap-2 mt-8 print:hidden" role="tablist" aria-label="Slide navigation">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigateSlide(idx)}
                    role="tab"
                    aria-selected={currentSlide === idx}
                    aria-label={`Slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      currentSlide === idx
                        ? 'w-8 h-3 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b]'
                        : 'w-3 h-3 bg-[#c9b8a6]/50 hover:bg-[#c9b8a6]'
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next text */}
              <div className="flex items-center justify-between mt-3 px-2 text-xs text-[#8c7a6b] print:hidden">
                <span>
                  {currentSlide > 0 && (
                    <>
                      <ChevronLeft className="w-3 h-3 inline mr-1" />
                      {t('investorPitch.prev')}
                    </>
                  )}
                </span>
                <span>
                  {currentSlide < TOTAL_SLIDES - 1 && (
                    <>
                      {t('investorPitch.next')}
                      <ChevronRight className="w-3 h-3 inline ml-1" />
                    </>
                  )}
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PageLayout>
  );
};

export default InvestorPitch;
