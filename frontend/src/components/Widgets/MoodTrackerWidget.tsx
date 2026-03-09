import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, ChevronRight, Calendar, TrendingUp } from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuSlider } from '../Neumorphism/NeuSlider';

export interface MoodEntry {
  date: string;
  mood: number; // 1-5
  note?: string;
}

export interface MoodTrackerWidgetProps {
  todayMood?: number;
  weekData: MoodEntry[];
  stressLevel: number;
  onMoodSelect?: (mood: number) => void;
  onJournalClick?: () => void;
  className?: string;
}

const moodConfig = {
  1: { emoji: '😢', label: 'Rough', color: '#ef4444' },
  2: { emoji: '😕', label: 'Low', color: '#f97316' },
  3: { emoji: '😐', label: 'Okay', color: '#eab308' },
  4: { emoji: '🙂', label: 'Good', color: '#84cc16' },
  5: { emoji: '😄', label: 'Great', color: '#22c55e' },
};

export const MoodTrackerWidget: React.FC<MoodTrackerWidgetProps> = ({
  todayMood,
  weekData,
  stressLevel,
  onMoodSelect,
  onJournalClick,
  className,
}) => {
  const [selectedMood, setSelectedMood] = useState(todayMood || 3);
  const [currentStress, setCurrentStress] = useState(stressLevel);

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    onMoodSelect?.(mood);
  };

  const averageMood = weekData.length
    ? weekData.reduce((acc, entry) => acc + entry.mood, 0) / weekData.length
    : 0;

  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="Mood Tracker"
        icon={<Brain className="w-5 h-5" />}
        action={
          <NeuButton
            variant="flat"
            size="sm"
            onClick={onJournalClick}
            rightIcon={<ChevronRight className="w-3 h-3" />}
          >
            Journal
          </NeuButton>
        }
      />

      {/* Today's mood selection */}
      <div className="mb-5">
        <p className="text-xs text-[#5c5243] mb-3">How are you feeling today?</p>
        <div className="flex items-center justify-center gap-2">
          {(Object.keys(moodConfig) as unknown as number[]).map((mood) => (
            <motion.button
              key={mood}
              onClick={() => handleMoodSelect(mood)}
              className={`
                w-12 h-12 rounded-xl text-2xl flex items-center justify-center
                transition-all duration-200
                ${selectedMood === mood
                  ? 'bg-[#5c5243] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3)] scale-110'
                  : 'bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(44,40,34,0.18),-6px_-6px_12px_rgba(255,255,255,0.7)]'
                }
              `}
              whileHover={{ scale: selectedMood === mood ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Select mood: ${moodConfig[mood as keyof typeof moodConfig].label}`}
            >
              {moodConfig[mood as keyof typeof moodConfig].emoji}
            </motion.button>
          ))}
        </div>

        {/* Selected mood label */}
        <motion.div
          className="text-center mt-2"
          key={selectedMood}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span
            className="text-sm font-semibold"
            style={{ color: moodConfig[selectedMood as keyof typeof moodConfig].color }}
          >
            {moodConfig[selectedMood as keyof typeof moodConfig].label}
          </span>
        </motion.div>
      </div>

      {/* Weekly chart */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#5c5243]">This week</span>
          <div className="flex items-center gap-1 text-xs text-[#5c5243]">
            <TrendingUp className="w-3 h-3" />
            <span>Avg: {averageMood.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-end justify-between h-20 gap-1">
          {weekData.map((entry, index) => (
            <motion.div
              key={entry.date}
              className="flex-1 flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <motion.div
                className="w-full rounded-t-lg relative group cursor-pointer"
                style={{
                  height: `${entry.mood * 16}px`,
                  backgroundColor: moodConfig[entry.mood as keyof typeof moodConfig].color,
                  boxShadow: `inset 1px 1px 2px rgba(255,255,255,0.3)`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${entry.mood * 16}px` }}
                transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[#2d2418] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {moodConfig[entry.mood as keyof typeof moodConfig].emoji} {entry.date}
                </div>
              </motion.div>
              <span className="text-[10px] text-[#8c7a6b]">{entry.date.slice(0, 3)}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stress level slider */}
      <div className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-[#2d2418]">Stress Level</span>
        </div>
        <NeuSlider
          value={currentStress}
          onChange={setCurrentStress}
          min={1}
          max={5}
          step={1}
          size="md"
          showValue
          valueFormatter={(v) => {
            const labels = ['Low', 'Moderate', 'High', 'Very High', 'Extreme'];
            return labels[v - 1];
          }}
        />
      </div>
    </NeuCard>
  );
};
