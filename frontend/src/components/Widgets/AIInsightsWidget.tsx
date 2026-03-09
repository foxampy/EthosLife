import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, AlertTriangle, TrendingUp, ChevronRight, RefreshCw } from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuOrb } from '../Neumorphism/NeuOrb';

export type InsightType = 'tip' | 'warning' | 'achievement' | 'pattern';

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  timestamp: string;
  actionable?: boolean;
  actionText?: string;
}

export interface AIInsightsWidgetProps {
  insights: AIInsight[];
  className?: string;
  onRefresh?: () => void;
  onActionClick?: (insightId: string) => void;
}

const insightConfig = {
  tip: {
    icon: Lightbulb,
    gradient: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  warning: {
    icon: AlertTriangle,
    gradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  achievement: {
    icon: TrendingUp,
    gradient: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  pattern: {
    icon: Sparkles,
    gradient: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
};

const InsightCard: React.FC<{
  insight: AIInsight;
  index: number;
  onActionClick?: (id: string) => void;
}> = ({ insight, index, onActionClick }) => {
  const config = insightConfig[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      className={`p-4 rounded-2xl bg-gradient-to-r ${config.gradient} border ${config.borderColor}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#2d2418] text-sm">{insight.title}</p>
          <p className="text-xs text-[#5c5243] mt-1 leading-relaxed">{insight.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-[#8c7a6b]">{insight.timestamp}</span>
            {insight.actionable && (
              <button
                onClick={() => onActionClick?.(insight.id)}
                className="text-xs font-semibold text-[#5c5243] hover:text-[#2d2418] flex items-center gap-0.5 transition-colors"
              >
                {insight.actionText} <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = ({
  insights,
  className,
  onRefresh,
  onActionClick,
}) => {
  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="AI Insights"
        subtitle="Personalized for you"
        icon={<NeuOrb size="sm" variant="pulse" animate pulseColor="#8b5cf6">
          <Sparkles className="w-4 h-4 text-purple-500" />
        </NeuOrb>}
        action={
          onRefresh && (
            <NeuButton variant="flat" size="sm" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4" />
            </NeuButton>
          )
        }
      />

      <div className="space-y-3">
        {insights.slice(0, 3).map((insight, index) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            index={index}
            onActionClick={onActionClick}
          />
        ))}
      </div>

      {/* AI summary */}
      <motion.div
        className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <NeuOrb size="sm" variant="elevated" color="#ffffff20">
            <Sparkles className="w-4 h-4 text-white" />
          </NeuOrb>
          <div>
            <p className="font-semibold text-sm">AI Health Summary</p>
            <p className="text-xs opacity-80">You&apos;re in the top 15% of users this week!</p>
          </div>
        </div>
      </motion.div>
    </NeuCard>
  );
};
