/**
 * Unified Home Page - Landing page with widget system showcase
 * Demonstrates the Android-style widget management system
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LayoutGrid,
  Sparkles,
  ArrowRight,
  Check,
  Globe,
  Zap,
  Shield,
  Plus,
} from 'lucide-react';
import { ElCard, ElButton } from '../../components/ElCore';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: LayoutGrid,
    title: 'Widget System',
    description: 'Customize your dashboard with drag-and-drop widgets. Add, remove, and arrange exactly how you want.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Sparkles,
    title: 'AI Health Assistant',
    description: 'Personalized insights and recommendations powered by advanced AI.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Globe,
    title: '25 Languages',
    description: 'Full internationalization support with RTL language compatibility.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Zap,
    title: 'Retrofuturism Design',
    description: 'Unique neumorphic interface with holographic effects and tactile feedback.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your health data is encrypted and protected. You control who sees what.',
    color: 'from-red-500 to-rose-500',
  },
];

const widgetPreview = [
  { id: 1, type: 'health', title: 'Health Score', value: '87', color: 'bg-emerald-100' },
  { id: 2, type: 'steps', title: 'Steps Today', value: '7,234', color: 'bg-blue-100' },
  { id: 3, type: 'water', title: 'Water', value: '5/8', color: 'bg-cyan-100' },
  { id: 4, type: 'sleep', title: 'Sleep', value: '7h 30m', color: 'bg-indigo-100' },
];

export const UnifiedHomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bone-200)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bone-200)]/80 backdrop-blur-lg border-b border-[var(--bone-400)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center">
                <span className="text-xl font-bold text-white">E</span>
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">EthosLife</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Sign In
              </button>
              <ElButton variant="gradient" size="sm" onClick={() => navigate('/auth')}>
                Get Started
              </ElButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Now with Widget System</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6">
                Your Health,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)]">
                  Your Way
                </span>
              </h1>
              <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-lg">
                The first health OS with Android-style widget management. 
                Drag, drop, and customize your perfect health dashboard.
              </p>
              <div className="flex flex-wrap gap-4">
                <ElButton
                  variant="gradient"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => navigate('/auth')}
                >
                  Start Free Trial
                </ElButton>
                <ElButton
                  variant="flat"
                  size="lg"
                  onClick={() => navigate('/dashboard-v2')}
                >
                  View Demo
                </ElButton>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-500" /> 14-day free
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-500" /> No credit card
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-500" /> Cancel anytime
                </span>
              </div>
            </motion.div>

            {/* Right: Widget Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <ElCard variant="glass" className="relative overflow-hidden">
                {/* Dashboard Header Mock */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--bone-400)]/30">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Good morning!</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Monday, Jan 15</p>
                  </div>
                  <ElButton variant="gradient" size="sm">
                    <Plus className="w-4 h-4" />
                  </ElButton>
                </div>

                {/* Widget Grid Mock */}
                <div className="grid grid-cols-2 gap-3">
                  {widgetPreview.map((widget, index) => (
                    <motion.div
                      key={widget.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`p-4 rounded-2xl ${widget.color} ${
                        widget.type === 'health' ? 'col-span-2' : ''
                      }`}
                    >
                      <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
                        {widget.title}
                      </p>
                      <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                        {widget.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Floating "Edit Mode" Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-2 -right-2 bg-[var(--neon-cyan)] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
                >
                  ✨ Edit Mode
                </motion.div>
              </ElCard>

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--neon-cyan)]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[var(--neon-purple)]/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bone-300)]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
              Built for Modern Health Management
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Everything you need to track, understand, and improve your health
              in one beautifully designed platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ElCard className="h-full" hover>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {feature.description}
                    </p>
                  </ElCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Widget Showcase Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
                Drag, Drop, Done.
              </h2>
              <p className="text-lg text-[var(--text-secondary)] mb-6">
                Our new widget system puts you in control. Add health trackers, 
                quick actions, AI insights, and more. Arrange them however works best for you.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Add widgets from our library of 20+ health trackers',
                  'Resize widgets: small, medium, or large',
                  'Long-press to enter edit mode and rearrange',
                  'Quick actions for instant health logging',
                  'AI-powered insights widget',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ul>
              <ElButton
                variant="gradient"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => navigate('/dashboard-v2')}
              >
                Try Widget System
              </ElButton>
            </div>

            {/* Interactive Widget Demo */}
            <ElCard variant="glass" className="relative">
              <div className="absolute top-3 right-3 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
                  <LayoutGrid className="w-4 h-4" />
                  <span>Your Dashboard</span>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] text-xs">
                    Edit Mode
                  </span>
                </div>
                
                {/* Demo Widgets */}
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 relative"
                  >
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                      ×
                    </div>
                    <div className="absolute top-2 left-2 p-1 rounded bg-emerald-200/50">
                      <LayoutGrid className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="pl-8">
                      <p className="text-xs text-emerald-600 uppercase">Health Score</p>
                      <p className="text-3xl font-bold text-emerald-700">87</p>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 relative"
                    >
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                        ×
                      </div>
                      <p className="text-xs text-blue-600 uppercase">Steps</p>
                      <p className="text-xl font-bold text-blue-700">7,234</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-2xl bg-cyan-50 border-2 border-cyan-200 relative"
                    >
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs">
                        ×
                      </div>
                      <p className="text-xs text-cyan-600 uppercase">Water</p>
                      <p className="text-xl font-bold text-cyan-700">5/8</p>
                    </motion.div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--bone-400)]/30">
                  <p className="text-xs text-center text-[var(--text-tertiary)]">
                    Long-press any widget to rearrange
                  </p>
                </div>
              </div>
            </ElCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <ElCard variant="glass" className="py-16 px-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-[var(--neon-purple)]/5" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                Ready to Transform Your Health?
              </h2>
              <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
                Join thousands of users who have already discovered the power of 
                personalized health tracking with our new widget system.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <ElButton
                  variant="gradient"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => navigate('/auth')}
                >
                  Get Started Free
                </ElButton>
                <ElButton
                  variant="flat"
                  size="lg"
                  onClick={() => navigate('/litepaper')}
                >
                  Read Litepaper
                </ElButton>
              </div>
            </div>
          </ElCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[var(--bone-400)]/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center">
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)]">EthosLife</span>
          </div>
          <p className="text-sm text-[var(--text-tertiary)]">
            © 2024 EthosLife. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Privacy
            </button>
            <button className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Terms
            </button>
            <button className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedHomePage;
