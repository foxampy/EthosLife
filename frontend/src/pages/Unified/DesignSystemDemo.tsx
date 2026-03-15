/**
 * DesignSystemDemo - Showcase of ElCore, ElGadgets, and ElLayout
 * EthosLife Design System
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ElButton,
  ElCard,
  ElCardHeader,
  ElCardContent,
  ElCardFooter,
  ElInput,
  ElTextArea,
} from '../../components/ElCore';
import {
  GadgetHoloDisplay,
  GadgetStatusPanel,
  GadgetDataTicker,
  GadgetRadarScope,
} from '../../components/ElGadgets';
import { ElLayout } from '../../components/ElLayout';
import {
  Zap,
  Heart,
  Activity,
  Brain,
  Moon,
  Flame,
  Droplets,
  User,
  Search,
  Mail,
  Lock,
  Bell,
  Settings,
} from 'lucide-react';

const DesignSystemDemo: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('buttons');
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  // Sample data for gadgets
  const tickerItems = [
    { id: '1', label: 'Steps', value: '8,432', unit: '', change: 12, trend: 'up' as const, icon: '👟' },
    { id: '2', label: 'Calories', value: '2,340', unit: 'kcal', change: 5, trend: 'up' as const, icon: '🔥' },
    { id: '3', label: 'Sleep', value: '7.5', unit: 'hrs', change: -3, trend: 'down' as const, icon: '😴' },
    { id: '4', label: 'Water', value: '1.8', unit: 'L', change: 0, trend: 'neutral' as const, icon: '💧' },
    { id: '5', label: 'Heart Rate', value: '68', unit: 'bpm', change: -2, trend: 'down' as const, icon: '❤️' },
  ];

  const statusItems = [
    { id: '1', label: 'Nutrition', value: 'good' as const, message: 'On track', icon: '🥗' },
    { id: '2', label: 'Exercise', value: 'active' as const, message: 'Workout completed', icon: '💪' },
    { id: '3', label: 'Sleep', value: 'warning' as const, message: 'Below target', icon: '😴' },
    { id: '4', label: 'Hydration', value: 'error' as const, message: 'Need more water', icon: '💧' },
    { id: '5', label: 'Mental', value: 'neutral' as const, message: 'Check in today', icon: '🧠' },
  ];

  const radarPoints = [
    { id: '1', angle: 45, distance: 80, label: 'Nutrition', value: 85 },
    { id: '2', angle: 90, distance: 60, label: 'Fitness', value: 70 },
    { id: '3', angle: 135, distance: 90, label: 'Sleep', value: 90 },
    { id: '4', angle: 225, distance: 40, label: 'Stress', value: 45 },
    { id: '5', angle: 315, distance: 75, label: 'Social', value: 80 },
  ];

  const tabs = [
    { id: 'buttons', label: 'Buttons', icon: Zap },
    { id: 'cards', label: 'Cards', icon: Heart },
    { id: 'inputs', label: 'Inputs', icon: Search },
    { id: 'gadgets', label: 'Gadgets', icon: Activity },
  ];

  return (
    <ElLayout>
      <div className="py-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
          >
            Design System <span className="text-gradient-cyan">3.0</span>
          </motion.h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Tactile Retrofuturism - A comprehensive component library for EthosLife
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <ElButton
              key={tab.id}
              variant={activeTab === tab.id ? 'gradient' : 'flat'}
              size="md"
              leftIcon={<tab.icon className="w-4 h-4" />}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </ElButton>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Buttons Section */}
          {activeTab === 'buttons' && (
            <div className="space-y-8">
              {/* Button Variants */}
              <ElCard>
                <ElCardHeader title="Button Variants" subtitle="Different visual styles for various use cases" />
                <ElCardContent>
                  <div className="flex flex-wrap gap-4">
                    <ElButton variant="elevated">Elevated</ElButton>
                    <ElButton variant="flat">Flat</ElButton>
                    <ElButton variant="inset">Inset</ElButton>
                    <ElButton variant="gradient">Gradient</ElButton>
                    <ElButton variant="outline">Outline</ElButton>
                    <ElButton variant="neon" color="cyan">Neon Cyan</ElButton>
                    <ElButton variant="neon" color="pink">Neon Pink</ElButton>
                    <ElButton variant="neon" color="amber">Neon Amber</ElButton>
                  </div>
                </ElCardContent>
              </ElCard>

              {/* Button Sizes */}
              <ElCard>
                <ElCardHeader title="Button Sizes" subtitle="From extra small to extra large" />
                <ElCardContent>
                  <div className="flex flex-wrap items-center gap-4">
                    <ElButton size="xs">Extra Small</ElButton>
                    <ElButton size="sm">Small</ElButton>
                    <ElButton size="md">Medium</ElButton>
                    <ElButton size="lg">Large</ElButton>
                    <ElButton size="xl">Extra Large</ElButton>
                  </div>
                </ElCardContent>
              </ElCard>

              {/* Button States */}
              <ElCard>
                <ElCardHeader title="Button States" subtitle="Loading, disabled, and active states" />
                <ElCardContent>
                  <div className="flex flex-wrap gap-4">
                    <ElButton isLoading>Loading</ElButton>
                    <ElButton isDisabled>Disabled</ElButton>
                    <ElButton isActive>Active</ElButton>
                    <ElButton leftIcon={<Heart className="w-4 h-4" />}>With Icon</ElButton>
                    <ElButton rightIcon={<Zap className="w-4 h-4" />}>Right Icon</ElButton>
                    <ElButton fullWidth>Full Width</ElButton>
                  </div>
                </ElCardContent>
              </ElCard>
            </div>
          )}

          {/* Cards Section */}
          {activeTab === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Card */}
              <ElCard variant="elevated" hover>
                <ElCardHeader title="Elevated Card" subtitle="Default neumorphic style" icon={<Heart className="w-5 h-5" />} />
                <ElCardContent>
                  <p className="text-[var(--text-secondary)]">
                    This is the standard card with elevated shadow effect. Hover to see the lift animation.
                  </p>
                </ElCardContent>
                <ElCardFooter>
                  <ElButton size="sm" variant="flat">Learn More</ElButton>
                </ElCardFooter>
              </ElCard>

              {/* Inset Card */}
              <ElCard variant="inset">
                <ElCardHeader title="Inset Card" subtitle="Pressed appearance" icon={<Brain className="w-5 h-5" />} />
                <ElCardContent>
                  <p className="text-[var(--text-secondary)]">
                    Inset cards appear pressed into the surface. Perfect for input containers.
                  </p>
                </ElCardContent>
              </ElCard>

              {/* Hologram Card */}
              <ElCard variant="hologram" color="cyan">
                <ElCardHeader title="Hologram Card" subtitle="Sci-fi display" icon={<Activity className="w-5 h-5" />} />
                <ElCardContent>
                  <p className="text-[var(--text-secondary)]">
                    Holographic cards with scanline effects for futuristic interfaces.
                  </p>
                </ElCardContent>
              </ElCard>

              {/* Glass Card */}
              <ElCard variant="glass">
                <ElCardHeader title="Glass Card" subtitle="Translucent effect" icon={<Droplets className="w-5 h-5" />} />
                <ElCardContent>
                  <p className="text-[var(--text-secondary)]">
                    Glassmorphism cards with backdrop blur for modern aesthetics.
                  </p>
                </ElCardContent>
              </ElCard>

              {/* Neon Card */}
              <ElCard variant="neon" glowColor="pink">
                <ElCardHeader title="Neon Card" subtitle="Glowing border" icon={<Flame className="w-5 h-5" />} />
                <ElCardContent>
                  <p className="text-[var(--text-secondary)]">
                    Neon cards with glowing borders for high-priority content.
                  </p>
                </ElCardContent>
              </ElCard>

              {/* Clickable Card */}
              <ElCard variant="elevated" clickable hover>
                <ElCardHeader title="Clickable Card" subtitle="Interactive element" icon={<Moon className="w-5 h-5" />} />
                <ElCardContent>
                  <p className="text-[var(--text-secondary)]">
                    Clickable cards with tactile feedback. Click to see the press effect.
                  </p>
                </ElCardContent>
              </ElCard>
            </div>
          )}

          {/* Inputs Section */}
          {activeTab === 'inputs' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <ElCard>
                <ElCardHeader title="Text Inputs" subtitle="Various input styles and states" />
                <ElCardContent className="space-y-4">
                  <ElInput
                    label="Default Input"
                    placeholder="Enter text here..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <ElInput
                    label="With Icon"
                    placeholder="Search..."
                    leftIcon={<Search className="w-5 h-5" />}
                  />
                  <ElInput
                    label="Neon Variant"
                    variant="neon"
                    placeholder="Sci-fi input..."
                  />
                  <ElInput
                    label="With Error"
                    placeholder="Invalid input"
                    error="This field is required"
                  />
                  <ElInput
                    label="With Helper"
                    placeholder="Type something"
                    helperText="This is a helpful message"
                  />
                  <ElInput
                    label="Disabled"
                    placeholder="Cannot edit"
                    disabled
                  />
                </ElCardContent>
              </ElCard>

              <ElCard>
                <ElCardHeader title="Textarea" subtitle="Multi-line text input" />
                <ElCardContent>
                  <ElTextArea
                    label="Description"
                    placeholder="Enter your message here..."
                    rows={4}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                  />
                </ElCardContent>
              </ElCard>
            </div>
          )}

          {/* Gadgets Section */}
          {activeTab === 'gadgets' && (
            <div className="space-y-8">
              {/* Data Ticker */}
              <GadgetDataTicker
                title="Live Metrics"
                items={tickerItems}
                speed="normal"
              />

              {/* Gadgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Hologram Display */}
                <GadgetHoloDisplay
                  title="System Status"
                  color="cyan"
                  animated
                  scanlines
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-secondary)]">CPU Usage</span>
                      <span className="font-mono text-[var(--neon-cyan)]">42%</span>
                    </div>
                    <div className="h-2 bg-[var(--bone-300)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[var(--neon-cyan)]"
                        initial={{ width: 0 }}
                        animate={{ width: '42%' }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-secondary)]">Memory</span>
                      <span className="font-mono text-[var(--neon-cyan)]">68%</span>
                    </div>
                    <div className="h-2 bg-[var(--bone-300)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[var(--neon-cyan)]"
                        initial={{ width: 0 }}
                        animate={{ width: '68%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </GadgetHoloDisplay>

                {/* Status Panel */}
                <GadgetStatusPanel
                  title="Health Modules"
                  items={statusItems}
                  layout="vertical"
                  size="md"
                />

                {/* Radar Scope */}
                <GadgetRadarScope
                  title="Activity Zones"
                  points={radarPoints}
                  size="md"
                  color="green"
                  showGrid
                  showSweep
                />

                {/* Another Hologram */}
                <GadgetHoloDisplay
                  title="AI Insights"
                  color="pink"
                  glitchEffect
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--neon-pink)]">▸</span>
                      <span className="text-[var(--text-secondary)]">
                        Sleep quality improved 15% this week
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--neon-pink)]">▸</span>
                      <span className="text-[var(--text-secondary)]">
                        Consider increasing water intake
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--neon-pink)]">▸</span>
                      <span className="text-[var(--text-secondary)]">
                        Morning workouts show best results
                      </span>
                    </div>
                  </div>
                </GadgetHoloDisplay>

                {/* Compact Status Panel */}
                <GadgetStatusPanel
                  title="Quick Status"
                  items={statusItems.slice(0, 3)}
                  layout="horizontal"
                  size="sm"
                />

                {/* Large Radar */}
                <GadgetRadarScope
                  title="Wellness Map"
                  points={radarPoints}
                  size="lg"
                  color="amber"
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: 'Tactile Feedback', desc: 'Physical button feel with haptic shadows' },
            { icon: Heart, title: 'Retrofuturism', desc: 'Sci-fi aesthetics meet modern UX' },
            { icon: Brain, title: 'AI-Powered', desc: 'Smart components that adapt to users' },
            { icon: Activity, title: 'Performance', desc: 'Optimized for 60fps animations' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--stone-600)] to-[var(--stone-500)] flex items-center justify-center text-white shadow-lg">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </ElLayout>
  );
};

export default DesignSystemDemo;
