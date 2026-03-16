/**
 * Analytics Unified - Health Analytics Dashboard
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Moon,
  Flame,
  Calendar,
  ChevronDown,
  Download,
  Share2,
} from 'lucide-react';
import { ElCard, ElButton } from '../../components/ElCore';

const timeRanges = ['Week', 'Month', '3 Months', 'Year'];

const metricCards = [
  { id: 'steps', label: 'Avg Steps', value: '8,432', change: '+12%', trend: 'up', icon: Activity, color: 'bg-blue-500' },
  { id: 'heart', label: 'Avg Heart Rate', value: '72', unit: 'bpm', change: '-3%', trend: 'down', icon: Heart, color: 'bg-rose-500' },
  { id: 'sleep', label: 'Avg Sleep', value: '7.2', unit: 'hrs', change: '+5%', trend: 'up', icon: Moon, color: 'bg-indigo-500' },
  { id: 'calories', label: 'Avg Calories', value: '2,140', change: '+8%', trend: 'up', icon: Flame, color: 'bg-orange-500' },
];

const weeklyData = [
  { day: 'Mon', steps: 7500, calories: 2100, sleep: 7 },
  { day: 'Tue', steps: 9200, calories: 2300, sleep: 6.5 },
  { day: 'Wed', steps: 8400, calories: 2150, sleep: 7.5 },
  { day: 'Thu', steps: 10100, calories: 2450, sleep: 8 },
  { day: 'Fri', steps: 6800, calories: 1950, sleep: 6 },
  { day: 'Sat', steps: 11200, calories: 2600, sleep: 8.5 },
  { day: 'Sun', steps: 9500, calories: 2250, sleep: 7.2 },
];

export const AnalyticsUnified: React.FC = () => {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState('Week');
  const [selectedMetric, setSelectedMetric] = useState('steps');

  const maxValue = Math.max(...weeklyData.map((d) => d[selectedMetric as keyof typeof d] as number));

  return (
    <div className="min-h-screen bg-[var(--bone-200)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Health Analytics
            </h1>
            <p className="text-[var(--text-secondary)]">
              Track your progress over time
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="relative">
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className="appearance-none bg-[var(--bone-300)] px-4 py-2 pr-10 rounded-xl shadow-neu text-[var(--text-primary)] cursor-pointer focus:outline-none"
              >
                {timeRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
            </div>
            <ElButton variant="flat" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Export
            </ElButton>
            <ElButton variant="flat" size="sm" leftIcon={<Share2 className="w-4 h-4" />}>
              Share
            </ElButton>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon;
            const isSelected = selectedMetric === metric.id;
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMetric(metric.id)}
                className="cursor-pointer"
              >
                <ElCard
                  className={`${isSelected ? 'ring-2 ring-[var(--neon-cyan)]' : ''}`}
                  hover
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">{metric.label}</p>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold text-[var(--text-primary)]">
                          {metric.value}
                        </span>
                        {metric.unit && (
                          <span className="text-sm text-[var(--text-tertiary)]">{metric.unit}</span>
                        )}
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${metric.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-emerald-500" />
                    )}
                    <span className="text-sm text-emerald-500 font-medium">{metric.change}</span>
                    <span className="text-xs text-[var(--text-tertiary)]">vs last {selectedRange.toLowerCase()}</span>
                  </div>
                </ElCard>
              </motion.div>
            );
          })}
        </div>

        {/* Main Chart */}
        <ElCard variant="glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Weekly {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[var(--neon-cyan)]" />
              <span className="text-sm text-[var(--text-secondary)]">Current</span>
            </div>
          </div>

          {/* Chart Bars */}
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
            {weeklyData.map((data, index) => {
              const value = data[selectedMetric as keyof typeof data] as number;
              const height = (value / maxValue) * 100;
              return (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 5)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="w-full max-w-12 bg-gradient-to-t from-[var(--neon-cyan)] to-[var(--neon-purple)] rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <span className="text-xs text-[var(--text-tertiary)]">{data.day}</span>
                </div>
              );
            })}
          </div>
        </ElCard>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ElCard>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Key Insights
            </h3>
            <div className="space-y-3">
              {[
                { icon: '🎉', title: 'Step Goal Master', desc: 'You hit your step goal 5 days this week!' },
                { icon: '😴', title: 'Sleep Improving', desc: 'Your average sleep increased by 30 mins' },
                { icon: '🔥', title: 'Calorie Consistency', desc: 'Great job maintaining your calorie targets' },
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bone-300)]/50">
                  <span className="text-2xl">{insight.icon}</span>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{insight.title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{insight.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ElCard>

          <ElCard>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Recommendations
            </h3>
            <div className="space-y-3">
              {[
                { icon: '🏃', title: 'Increase Activity', desc: 'Try adding 1,000 more steps on weekdays' },
                { icon: '💧', title: 'Hydration', desc: 'You are 20% below your water goal' },
                { icon: '🧘', title: 'Stress Management', desc: 'Consider meditation for better sleep quality' },
              ].map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bone-300)]/50">
                  <span className="text-2xl">{rec.icon}</span>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{rec.title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ElCard>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsUnified;
