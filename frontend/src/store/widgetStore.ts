/**
 * Widget Store - Zustand
 * Manages user widget configuration
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface WidgetInstance {
  id: string;
  widgetType: string;
  position: number;
  size: WidgetSize;
  settings: Record<string, any>;
  isVisible: boolean;
}

export interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'health' | 'social' | 'gamification' | 'utility' | 'gadgets';
  defaultSize: WidgetSize;
  allowedSizes: WidgetSize[];
  component: string;
  hasSettings: boolean;
}

interface WidgetStore {
  // User's active widgets
  widgets: WidgetInstance[];
  
  // Edit mode
  isEditMode: boolean;
  
  // Actions
  addWidget: (widgetType: string, size?: WidgetSize) => void;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, newPosition: number) => void;
  updateWidgetSize: (id: string, size: WidgetSize) => void;
  updateWidgetSettings: (id: string, settings: Record<string, any>) => void;
  toggleWidgetVisibility: (id: string) => void;
  toggleEditMode: () => void;
  reorderWidgets: (newOrder: WidgetInstance[]) => void;
  resetToDefaults: () => void;
}

// Default widgets for new users
const defaultWidgets: WidgetInstance[] = [
  { id: '1', widgetType: 'healthScore', position: 0, size: 'small', settings: {}, isVisible: true },
  { id: '2', widgetType: 'activityRings', position: 1, size: 'small', settings: {}, isVisible: true },
  { id: '3', widgetType: 'steps', position: 2, size: 'medium', settings: {}, isVisible: true },
  { id: '4', widgetType: 'water', position: 3, size: 'medium', settings: {}, isVisible: true },
  { id: '5', widgetType: 'quickActions', position: 4, size: 'full', settings: {}, isVisible: true },
];

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set, get) => ({
      widgets: defaultWidgets,
      isEditMode: false,

      addWidget: (widgetType, size = 'medium') => {
        const newWidget: WidgetInstance = {
          id: Date.now().toString(),
          widgetType,
          position: get().widgets.length,
          size,
          settings: {},
          isVisible: true,
        };
        set((state) => ({
          widgets: [...state.widgets, newWidget],
        }));
      },

      removeWidget: (id) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        }));
      },

      updateWidgetPosition: (id, newPosition) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, position: newPosition } : w
          ),
        }));
      },

      updateWidgetSize: (id, size) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, size } : w
          ),
        }));
      },

      updateWidgetSettings: (id, settings) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, settings: { ...w.settings, ...settings } } : w
          ),
        }));
      },

      toggleWidgetVisibility: (id) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, isVisible: !w.isVisible } : w
          ),
        }));
      },

      toggleEditMode: () => {
        set((state) => ({ isEditMode: !state.isEditMode }));
      },

      reorderWidgets: (newOrder) => {
        set({ widgets: newOrder });
      },

      resetToDefaults: () => {
        set({ widgets: defaultWidgets });
      },
    }),
    {
      name: 'ethoslife-widgets',
    }
  )
);

// Available widget definitions
export const widgetDefinitions: WidgetDefinition[] = [
  {
    id: 'healthScore',
    name: 'Health Score',
    description: 'Overall wellness score based on all modules',
    icon: 'heart',
    category: 'health',
    defaultSize: 'small',
    allowedSizes: ['small', 'medium'],
    component: 'HealthScoreWidget',
    hasSettings: false,
  },
  {
    id: 'activityRings',
    name: 'Activity Rings',
    description: 'Move, Exercise, and Stand rings',
    icon: 'activity',
    category: 'health',
    defaultSize: 'small',
    allowedSizes: ['small', 'medium', 'large'],
    component: 'ActivityRingsWidget',
    hasSettings: false,
  },
  {
    id: 'steps',
    name: 'Steps Counter',
    description: 'Daily step count and goal',
    icon: 'footprints',
    category: 'health',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium'],
    component: 'StepsWidget',
    hasSettings: true,
  },
  {
    id: 'water',
    name: 'Water Tracker',
    description: 'Hydration monitoring with quick add',
    icon: 'droplets',
    category: 'health',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium'],
    component: 'WaterWidget',
    hasSettings: true,
  },
  {
    id: 'sleep',
    name: 'Sleep Tracker',
    description: 'Sleep duration and quality',
    icon: 'moon',
    category: 'health',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium', 'large'],
    component: 'SleepWidget',
    hasSettings: true,
  },
  {
    id: 'mood',
    name: 'Mood Tracker',
    description: 'Daily mood and trends',
    icon: 'smile',
    category: 'health',
    defaultSize: 'small',
    allowedSizes: ['small', 'medium'],
    component: 'MoodWidget',
    hasSettings: false,
  },
  {
    id: 'weight',
    name: 'Weight Chart',
    description: 'Weight tracking over time',
    icon: 'scale',
    category: 'health',
    defaultSize: 'large',
    allowedSizes: ['medium', 'large', 'full'],
    component: 'WeightWidget',
    hasSettings: true,
  },
  {
    id: 'calories',
    name: 'Calorie Budget',
    description: 'Consumed vs target calories',
    icon: 'flame',
    category: 'health',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium', 'large'],
    component: 'CaloriesWidget',
    hasSettings: true,
  },
  {
    id: 'macros',
    name: 'Macro Rings',
    description: 'Protein, carbs, and fats tracking',
    icon: 'pieChart',
    category: 'health',
    defaultSize: 'medium',
    allowedSizes: ['medium', 'large'],
    component: 'MacrosWidget',
    hasSettings: true,
  },
  {
    id: 'heartRate',
    name: 'Heart Rate',
    description: 'Current and resting heart rate',
    icon: 'heartPulse',
    category: 'health',
    defaultSize: 'small',
    allowedSizes: ['small', 'medium'],
    component: 'HeartRateWidget',
    hasSettings: false,
  },
  {
    id: 'socialFeed',
    name: 'Activity Feed',
    description: 'Recent posts from friends',
    icon: 'rss',
    category: 'social',
    defaultSize: 'large',
    allowedSizes: ['medium', 'large', 'full'],
    component: 'SocialFeedWidget',
    hasSettings: true,
  },
  {
    id: 'friendsOnline',
    name: 'Friends Online',
    description: 'See who is currently active',
    icon: 'users',
    category: 'social',
    defaultSize: 'small',
    allowedSizes: ['small', 'medium'],
    component: 'FriendsOnlineWidget',
    hasSettings: false,
  },
  {
    id: 'challengeProgress',
    name: 'Challenge Progress',
    description: 'Active challenges status',
    icon: 'trophy',
    category: 'social',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium', 'large'],
    component: 'ChallengeProgressWidget',
    hasSettings: true,
  },
  {
    id: 'levelProgress',
    name: 'Level Progress',
    description: 'Current level and XP to next',
    icon: 'zap',
    category: 'gamification',
    defaultSize: 'small',
    allowedSizes: ['small', 'medium'],
    component: 'LevelProgressWidget',
    hasSettings: false,
  },
  {
    id: 'dailyStreak',
    name: 'Daily Streak',
    description: 'Current day streak counter',
    icon: 'flame',
    category: 'gamification',
    defaultSize: 'small',
    allowedSizes: ['small'],
    component: 'DailyStreakWidget',
    hasSettings: false,
  },
  {
    id: 'recentBadges',
    name: 'Recent Badges',
    description: 'Latest earned achievements',
    icon: 'award',
    category: 'gamification',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium'],
    component: 'RecentBadgesWidget',
    hasSettings: false,
  },
  {
    id: 'quickActions',
    name: 'Quick Actions',
    description: 'Fast access to common actions',
    icon: 'bolt',
    category: 'utility',
    defaultSize: 'full',
    allowedSizes: ['medium', 'large', 'full'],
    component: 'QuickActionsWidget',
    hasSettings: true,
  },
  {
    id: 'upcomingEvents',
    name: 'Upcoming',
    description: 'Reminders and scheduled events',
    icon: 'calendar',
    category: 'utility',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium', 'large'],
    component: 'UpcomingEventsWidget',
    hasSettings: true,
  },
  {
    id: 'aiInsights',
    name: 'AI Insights',
    description: 'Personalized recommendations',
    icon: 'sparkles',
    category: 'utility',
    defaultSize: 'large',
    allowedSizes: ['medium', 'large', 'full'],
    component: 'AIInsightsWidget',
    hasSettings: true,
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Local weather and air quality',
    icon: 'sun',
    category: 'utility',
    defaultSize: 'small',
    allowedSizes: ['small'],
    component: 'WeatherWidget',
    hasSettings: true,
  },
  {
    id: 'holoDisplay',
    name: 'Holo Display',
    description: 'Retrofuturistic data display',
    icon: 'monitor',
    category: 'gadgets',
    defaultSize: 'large',
    allowedSizes: ['medium', 'large'],
    component: 'HoloDisplayWidget',
    hasSettings: true,
  },
  {
    id: 'statusPanel',
    name: 'Status Panel',
    description: 'LED-style status indicators',
    icon: 'panelTop',
    category: 'gadgets',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium', 'large'],
    component: 'StatusPanelWidget',
    hasSettings: true,
  },
  {
    id: 'dataTicker',
    name: 'Data Ticker',
    description: 'Scrolling metrics display',
    icon: 'scroll',
    category: 'gadgets',
    defaultSize: 'full',
    allowedSizes: ['medium', 'large', 'full'],
    component: 'DataTickerWidget',
    hasSettings: true,
  },
  {
    id: 'radarScope',
    name: 'Radar Scope',
    description: 'Activity radar visualization',
    icon: 'radar',
    category: 'gadgets',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium', 'large'],
    component: 'RadarScopeWidget',
    hasSettings: false,
  },
];
