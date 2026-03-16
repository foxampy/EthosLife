/**
 * AI Insights Widget - Рекомендации ИИ на основе данных
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { WidgetSize } from '../../../store/widgetStore';

interface AIInsightsWidgetProps {
  settings: Record<string, any>;
  size: WidgetSize;
}

const insights = [
  {
    id: 1,
    type: 'nutrition',
    icon: '🥗',
    title: 'Hydration Boost',
    description: 'Your activity level suggests increasing water intake by 500ml today.',
    priority: 'high',
  },
  {
    id: 2,
    type: 'sleep',
    icon: '😴',
    title: 'Earlier Bedtime',
    description: 'Consider sleeping 30 mins earlier to optimize recovery.',
    priority: 'medium',
  },
  {
    id: 3,
    type: 'activity',
    icon: '🏃',
    title: 'Active Recovery',
    description: 'Light yoga session recommended to balance yesterday\'s intensity.',
    priority: 'low',
  },
];

export const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = ({
  settings,
  size,
}) => {
  const maxInsights = settings.maxInsights || 3;
  const showNutrition = settings.showNutrition !== false;
  const showSleep = settings.showSleep !== false;
  const showActivity = settings.showActivity !== false;

  const filteredInsights = insights.filter((i) => {
    if (i.type === 'nutrition' && !showNutrition) return false;
    if (i.type === 'sleep' && !showSleep) return false;
    if (i.type === 'activity' && !showActivity) return false;
    return true;
  }).slice(0, maxInsights);

  const priorityColors = {
    high: 'border-red-400 bg-red-50',
    medium: 'border-amber-400 bg-amber-50',
    low: 'border-blue-400 bg-blue-50',
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            AI Insights
          </span>
        </div>
        <motion.button
          whileHover={{ x: 3 }}
          className="text-xs text-purple-500 flex items-center gap-0.5"
        >
          View all <ChevronRight className="w-3 h-3" />
        </motion.button>
      </div>

      {/* Insights List */}
      <div className="flex-1 space-y-2">
        {filteredInsights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-xl border-l-4 ${priorityColors[insight.priority]} cursor-pointer hover:brightness-95 transition-all`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{insight.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {insight.title}
                </p>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {insight.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Model indicator */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--bone-400)]/30">
        <div className="flex -space-x-1">
          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[8px] text-white font-bold">
            AI
          </span>
        </div>
        <span className="text-xs text-[var(--text-tertiary)]">
          Powered by HealthLLM v2
        </span>
      </div>
    </div>
  );
};

export default AIInsightsWidget;
