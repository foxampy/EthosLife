/**
 * ElLayout - Unified Layout Component
 * EthosLife Design System
 * 
 * Wraps content with unified header, footer, and background
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ElHeader } from './ElHeader';
import { BottomNav } from './BottomNav';
import { Heart, Github, Twitter, MessageCircle, Mail } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// TYPES
// ============================================
export interface ElLayoutProps {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
  showHeader?: boolean;
  fullWidth?: boolean;
  isAppPage?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const ElLayout: React.FC<ElLayoutProps> = ({
  children,
  className,
  showFooter = true,
  showHeader = true,
  fullWidth = false,
  isAppPage = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bone-300)] via-[var(--bone-200)] to-[var(--bone-300)]">
      {/* Header — compact on app pages (no burger, just logo) */}
      {showHeader && <ElHeader hideMenu={isAppPage} />}

      {/* Main Content */}
      <main
        className={cn(
          'transition-all duration-300',
          showHeader && 'pt-14',
          isAppPage && 'pb-20',
          !fullWidth && 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer only on landing pages */}
      {showFooter && !isAppPage && <ElFooter />}

      {/* Bottom Navigation on app pages */}
      {isAppPage && <BottomNav />}
    </div>
  );
};

// ============================================
// FOOTER COMPONENT
// ============================================

const ElFooter: React.FC = () => {
  const { t } = useTranslation();

  const footerLinks = {
    product: [
      { label: 'nav.features', href: '/features' },
      { label: 'nav.pricing', href: '/pricing' },
      { label: 'nav.tokenomics', href: '/tokenomics' },
      { label: 'nav.roadmap', href: '/roadmap' },
    ],
    company: [
      { label: 'nav.team', href: '/team' },
      { label: 'nav.blog', href: '/blog' },
      { label: 'nav.faq', href: '/faq' },
      { label: 'nav.whitepaper', href: '/whitepaper' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
    social: [
      { icon: Twitter, href: 'https://twitter.com/ethoslife', label: 'Twitter' },
      { icon: MessageCircle, href: 'https://t.me/ethoslife', label: 'Telegram' },
      { icon: Github, href: 'https://github.com/ethoslife', label: 'GitHub' },
      { icon: Mail, href: 'mailto:hello@ethoslife.io', label: 'Email' },
    ],
  };

  return (
    <footer className="mt-20 border-t border-[var(--bone-400)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--stone-600)] to-[var(--stone-500)] flex items-center justify-center text-white font-bold shadow-lg">
                🌱
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">EthosLife</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {t('app.description')}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {footerLinks.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    'bg-[var(--bone-200)]',
                    'shadow-[4px_4px_8px_rgba(44,40,34,0.08),-4px_-4px_8px_rgba(255,255,255,0.6)]',
                    'text-[var(--text-secondary)]',
                    'hover:text-[var(--neon-cyan)] hover:shadow-[0_0_15px_rgba(0,217,255,0.3)]',
                    'transition-all duration-300'
                  )}
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">{t('app.name')}</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Stay Updated</h4>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Get the latest health tips and updates
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className={cn(
                  'flex-1 px-4 py-2 rounded-xl text-sm',
                  'bg-[var(--bone-200)]',
                  'shadow-[inset_3px_3px_6px_rgba(44,40,34,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/30'
                )}
              />
              <button
                type="submit"
                className={cn(
                  'px-4 py-2 rounded-xl',
                  'bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)] text-white',
                  'shadow-lg hover:shadow-xl transition-all'
                )}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--bone-400)]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-tertiary)] flex items-center gap-1">
            © 2026 EthosLife. Made with <Heart className="w-4 h-4 text-red-500 inline" /> for better health.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-[var(--text-tertiary)]">
              Version 2.0.0
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse" />
              <span className="text-sm text-[var(--text-tertiary)]">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ElLayout;
