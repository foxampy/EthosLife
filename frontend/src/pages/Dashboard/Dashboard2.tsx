import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Clock,
  ChevronRight,
  Menu,
  User,
  Check,
  Calendar,
  Target,
} from 'lucide-react';

// Design System Components
import {
  NeuButton,
  NeuCard,
  NeuOrb,
} from '../../components/Neumorphism';

// Widgets
import {
  HealthScoreWidget,
  DailyRingsWidget,
  HabitHeatmapWidget,
  WaterTrackerWidget,
  StepsCounterWidget,
  SleepPhasesWidget,
  MoodTrackerWidget,
  ActivityWidget,
  NutritionWidget,
  BodyMetricsWidget,
  GamificationWidget,
  SocialWidget,
  AIInsightsWidget,
  QuickActionsWidget,
} from '../../components/Widgets';

import type {
  DashboardState,
  ChecklistItem,
  MoodEntry,
  AIInsight,
} from '../../types/dashboard';

import {
  getMockDashboardState,
  getTodayFormatted,
  calculateRingProgress,
} from '../../utils/dashboard';

// ============================================================================
// DASHBOARD 2.0 - Health Operating System
// Style: Retrofuturism + Neumorphism (Soft UI)
// ============================================================================

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// Daily Checklist Component
const DailyChecklist: React.FC<{
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}> = ({ items, onToggle }) => {
  const completionRate = Math.round((items.filter(i => i.completed).length / items.length) * 100);

  return (
    <NeuCard hover>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#dcd3c6] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)] flex items-center justify-center">
            <Check className="w-5 h-5 text-[#5c5243]" />
          </div>
          <div>
            <h3 className="font-bold text-[#2d2418] text-sm">Daily Checklist</h3>
            <p className="text-xs text-[#5c5243]">{completionRate}% complete</p>
          </div>
        </div>
        <NeuButton variant="flat" size="sm">Edit</NeuButton>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-[#dcd3c6] rounded-full overflow-hidden shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)] mb-4">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#5c5243] to-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              item.completed
                ? 'bg-green-50 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]'
                : 'bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <motion.div
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                item.completed
                  ? 'bg-green-500 shadow-lg'
                  : 'bg-[#dcd3c6] shadow-[inset_1px_1px_2px_rgba(44,40,34,0.1)]'
              }`}
              animate={item.completed ? { scale: [1, 1.2, 1] } : {}}
            >
              {item.completed && <Check className="w-4 h-4 text-white" />}
            </motion.div>
            <div className="flex-1 text-left">
              <p className={`text-sm font-medium ${item.completed ? 'line-through text-[#5c5243]' : 'text-[#2d2418]'}`}>
                {item.title}
              </p>
              {item.time && <p className="text-[10px] text-[#8c7a6b]">{item.time}</p>}
            </div>
            <span className="text-lg">
              {item.type === 'morning' ? '☀️' :
               item.type === 'medication' ? '💊' :
               item.type === 'water' ? '💧' :
               item.type === 'sleep' ? '😴' : '🧠'}
            </span>
          </motion.button>
        ))}
      </div>
    </NeuCard>
  );
};

// Upcoming Events Component
const UpcomingEvents: React.FC<{
  events: DashboardState['widgets']['events'];
}> = ({ events }) => {
  return (
    <NeuCard hover>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#dcd3c6] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)] flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#5c5243]" />
          </div>
          <h3 className="font-bold text-[#2d2418] text-sm">Upcoming</h3>
        </div>
        <NeuButton variant="flat" size="sm" rightIcon={<ChevronRight className="w-3 h-3" />}>
          Full Schedule
        </NeuButton>
      </div>

      <div className="space-y-2">
        {events.slice(0, 4).map((event, index) => (
          <motion.div
            key={event.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)] hover:shadow-[inset_3px_3px_6px_rgba(44,40,34,0.08)] transition-shadow cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              event.type === 'medication' ? 'bg-red-100' :
              event.type === 'appointment' ? 'bg-blue-100' :
              event.type === 'workout' ? 'bg-green-100' : 'bg-purple-100'
            }`}>
              {event.type === 'medication' ? '💊' : event.type === 'appointment' ? '🏥' : event.type === 'workout' ? '💪' : '🎉'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#2d2418] truncate">{event.title}</p>
              <p className="text-[10px] text-[#5c5243]">{event.time}</p>
              {event.description && (
                <p className="text-[10px] text-[#8c7a6b] truncate">{event.description}</p>
              )}
            </div>
            <motion.button
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                event.completed
                  ? 'bg-green-500'
                  : 'bg-[#dcd3c6] hover:bg-[#c8c2b6]'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <Check className={`w-4 h-4 ${event.completed ? 'text-white' : 'text-[#5c5243]'}`} />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </NeuCard>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function Dashboard2() {
  const [data, setData] = useState<DashboardState>(getMockDashboardState());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checklist, setChecklist] = useState(data.todayProgress.checklist);
  const [selectedMood, setSelectedMood] = useState(data.widgets.mood.todayMood);
  const [waterAmount, setWaterAmount] = useState(data.widgets.nutrition.waterIntake);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        widgets: {
          ...prev.widgets,
          activity: {
            ...prev.widgets.activity,
            steps: {
              ...prev.widgets.activity.steps,
              current: prev.widgets.activity.steps.current + Math.floor(Math.random() * 3),
            },
          },
        },
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Toggle checklist item
  const toggleChecklistItem = useCallback((id: string) => {
    setChecklist(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      const completed = updated.filter(i => i.completed).length;
      setData(d => ({
        ...d,
        todayProgress: { ...d.todayProgress, completionRate: Math.round((completed / updated.length) * 100) },
      }));
      return updated;
    });
  }, []);

  // Add water
  const addWater = useCallback((amount: number) => {
    setWaterAmount(prev => {
      const newAmount = Math.max(0, Math.min(prev + amount, data.widgets.nutrition.waterGoal * 1.5));
      setData(d => ({
        ...d,
        widgets: { ...d.widgets, nutrition: { ...d.widgets.nutrition, waterIntake: newAmount } },
      }));
      return newAmount;
    });
  }, [data.widgets.nutrition.waterGoal]);

  // Handle mood selection
  const handleMoodSelect = useCallback((mood: number) => {
    setSelectedMood(mood);
    setData(prev => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        mood: { ...prev.widgets.mood, todayMood: mood },
      },
    }));
  }, []);

  return (
    <div className="min-h-screen bg-[#e4dfd5] font-sans text-[#2d2418]">
      {/* Sticky Header */}
      <motion.header
        className="sticky top-0 z-50 bg-[#e4dfd5]/80 backdrop-blur-lg border-b border-[#dcd3c6]/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <NeuButton
                variant="elevated"
                size="sm"
                className="!p-2.5 lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </NeuButton>
              <div>
                <h1 className="text-lg font-bold text-[#2d2418] uppercase tracking-wider">Dashboard</h1>
                <p className="text-xs text-[#5c5243]">{getTodayFormatted()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Time display */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]">
                <Clock className="w-4 h-4 text-[#5c5243]" />
                <span className="text-sm font-semibold">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <NeuButton variant="elevated" size="sm" className="!p-2.5">
                  <Bell className="w-5 h-5" />
                </NeuButton>
                {data.social.unreadMessages > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    {data.social.unreadMessages}
                  </motion.span>
                )}
              </div>

              {/* User avatar */}
              <NeuOrb size="md" variant="elevated" onClick={() => {}}>
                <User className="w-5 h-5 text-[#5c5243]" />
              </NeuOrb>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* LEFT SIDEBAR */}
          <motion.div className="lg:col-span-3 space-y-6" variants={itemVariants}>
            <HealthScoreWidget
              score={data.healthScore.overall}
              lastWeekScore={data.healthScore.lastWeekScore}
              trend={data.healthScore.trend}
              breakdown={data.healthScore.breakdown}
            />

            <DailyChecklist
              items={checklist}
              onToggle={toggleChecklistItem}
            />

            <HabitHeatmapWidget
              habits={data.widgets.habits.map(h => ({
                ...h,
                history: Array.from({ length: 49 }, (_, i) => ({
                  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  completed: Math.random() > 0.3,
                  intensity: Math.floor(Math.random() * 5),
                })).reverse(),
              }))}
            />
          </motion.div>

          {/* CENTER COLUMN */}
          <motion.div className="lg:col-span-6 space-y-6" variants={itemVariants}>
            {/* Activity Rings */}
            <DailyRingsWidget
              move={{
                current: data.widgets.activity.move.current,
                goal: data.widgets.activity.move.goal,
                color: data.widgets.activity.move.color,
                icon: 'flame',
                label: 'Move',
                unit: 'kcal',
              }}
              exercise={{
                current: data.widgets.activity.exercise.current,
                goal: data.widgets.activity.exercise.goal,
                color: data.widgets.activity.exercise.color,
                icon: 'activity',
                label: 'Exercise',
                unit: 'min',
              }}
              stand={{
                current: data.widgets.activity.stand.current,
                goal: data.widgets.activity.stand.goal,
                color: data.widgets.activity.stand.color,
                icon: 'sun',
                label: 'Stand',
                unit: 'hrs',
              }}
            />

            {/* Steps Counter */}
            <StepsCounterWidget
              steps={data.widgets.activity.steps.current}
              goal={data.widgets.activity.steps.goal}
              calories={data.widgets.activity.calories}
              distance={data.widgets.activity.distance}
              activeMinutes={data.widgets.activity.activeMinutes}
              trend="up"
              trendValue={12}
            />

            {/* Activity & Nutrition Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActivityWidget
                calories={data.widgets.activity.calories}
                caloriesGoal={600}
                activeMinutes={data.widgets.activity.activeMinutes}
                activeMinutesGoal={60}
                workoutsThisWeek={4}
                weeklyGoal={5}
                currentStreak={7}
                lastWorkout={{
                  type: 'Morning Run',
                  duration: 45,
                  calories: 320,
                  date: 'Yesterday',
                }}
              />

              <NutritionWidget
                caloriesConsumed={data.widgets.nutrition.caloriesConsumed}
                caloriesGoal={data.widgets.nutrition.caloriesGoal}
                macros={data.widgets.nutrition}
                lastMeal={data.widgets.nutrition.lastMeal}
                waterIntake={waterAmount}
                waterGoal={data.widgets.nutrition.waterGoal}
              />
            </div>

            {/* Sleep & Mood Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SleepPhasesWidget
                duration={data.widgets.sleep.duration}
                score={data.widgets.sleep.score}
                quality={data.widgets.sleep.quality}
                bedTime={data.widgets.sleep.bedTime}
                wakeTime={data.widgets.sleep.wakeTime}
                sleepDebt={data.widgets.sleep.sleepDebt}
                phases={[
                  { phase: 'deep', duration: 120, startTime: '23:00' },
                  { phase: 'light', duration: 240, startTime: '01:00' },
                  { phase: 'rem', duration: 90, startTime: '05:00' },
                  { phase: 'awake', duration: 10, startTime: '06:30' },
                ]}
              />

              <MoodTrackerWidget
                todayMood={selectedMood}
                weekData={data.widgets.mood.weekData}
                stressLevel={data.widgets.mood.stressLevel}
                onMoodSelect={handleMoodSelect}
              />
            </div>

            {/* Body Metrics */}
            <BodyMetricsWidget
              weight={data.bodyMetrics.weight}
              bmi={data.bodyMetrics.bmi}
              goalProgress={data.bodyMetrics.goalProgress}
              daysToGoal={45}
            />
          </motion.div>

          {/* RIGHT SIDEBAR */}
          <motion.div className="lg:col-span-3 space-y-6" variants={itemVariants}>
            {/* Water Tracker */}
            <WaterTrackerWidget
              current={waterAmount}
              goal={data.widgets.nutrition.waterGoal}
              onAddWater={addWater}
            />

            {/* Gamification */}
            <GamificationWidget
              level={data.gamification.level}
              xp={data.gamification.xp}
              xpToNext={data.gamification.xpToNext}
              leaderboardPosition={data.gamification.leaderboardPosition}
              recentBadges={data.gamification.recentBadges}
              dailyChallenges={[
                { id: '1', title: 'Walk 10k steps', progress: 7500, total: 10000, reward: 100 },
                { id: '2', title: 'Drink 8 glasses', progress: 6, total: 8, reward: 50 },
                { id: '3', title: 'Sleep 8 hours', progress: 1, total: 1, reward: 75 },
              ]}
            />

            {/* Social */}
            <SocialWidget
              activities={data.social.activities}
              challenges={data.social.challenges}
              onlineFriends={12}
              unreadMessages={data.social.unreadMessages}
            />

            {/* AI Insights */}
            <AIInsightsWidget
              insights={data.aiInsights}
              onRefresh={() => console.log('Refreshing insights...')}
            />

            {/* Upcoming Events */}
            <UpcomingEvents events={data.widgets.events} />

            {/* Quick Actions */}
            <QuickActionsWidget
              onLogMeal={() => console.log('Log meal')}
              onLogWorkout={() => console.log('Log workout')}
              onLogSleep={() => console.log('Log sleep')}
              onLogVitals={() => console.log('Log vitals')}
              onLogMedication={() => console.log('Log medication')}
              onLogWater={() => addWater(250)}
            />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
