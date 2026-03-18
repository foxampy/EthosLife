/**
 * Health Store - Health Data Management
 * Manages metrics, goals, profile, and health score
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export interface HealthMetric {
  id: string;
  type: 'steps' | 'calories' | 'sleep' | 'weight' | 'water' | 'mood';
  value: number;
  unit: string;
  date: string;
  timestamp: number;
}

export interface HealthGoal {
  id: string;
  type: string;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  completed: boolean;
}

export interface HealthProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  healthGoals: string[];
  medicalConditions?: string[];
}

export interface HealthScore {
  overall: number;
  nutrition: number;
  movement: number;
  sleep: number;
  psychology: number;
  medicine: number;
  relationships: number;
  habits: number;
}

interface HealthStore {
  metrics: HealthMetric[];
  goals: HealthGoal[];
  profile: HealthProfile | null;
  healthScore: HealthScore | null;
  isLoading: boolean;
  lastUpdated: number | null;

  fetchMetrics: (type?: string, days?: number) => Promise<void>;
  addMetric: (metric: Omit<HealthMetric, 'id' | 'timestamp'>) => Promise<void>;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<HealthGoal, 'id' | 'current' | 'completed'>) => Promise<void>;
  updateGoal: (id: string, data: Partial<HealthGoal>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (profile: Partial<HealthProfile>) => Promise<void>;
  fetchHealthScore: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      metrics: [],
      goals: [],
      profile: null,
      healthScore: null,
      isLoading: false,
      lastUpdated: null,

      setLoading: (loading) => set({ isLoading: loading }),

      fetchMetrics: async (type, days = 30) => {
        set({ isLoading: true });
        try {
          const params = new URLSearchParams();
          if (type) params.append('type', type);
          params.append('days', days.toString());

          const response = await api.get(`/health/metrics?${params}`);
          set({ metrics: response.data, lastUpdated: Date.now() });
        } catch (error) {
          console.error('Failed to fetch metrics:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addMetric: async (metric) => {
        try {
          const response = await api.post('/health/metrics', metric);
          set((state) => ({
            metrics: [...state.metrics, response.data],
            lastUpdated: Date.now(),
          }));
        } catch (error) {
          console.error('Failed to add metric:', error);
        }
      },

      fetchGoals: async () => {
        try {
          const response = await api.get('/health/goals');
          set({ goals: response.data });
        } catch (error) {
          console.error('Failed to fetch goals:', error);
        }
      },

      addGoal: async (goal) => {
        try {
          const response = await api.post('/health/goals', goal);
          set((state) => ({
            goals: [...state.goals, response.data],
          }));
        } catch (error) {
          console.error('Failed to add goal:', error);
        }
      },

      updateGoal: async (id, data) => {
        try {
          const response = await api.put(`/health/goals/${id}`, data);
          set((state) => ({
            goals: state.goals.map((g) => (g.id === id ? response.data : g)),
          }));
        } catch (error) {
          console.error('Failed to update goal:', error);
        }
      },

      fetchProfile: async () => {
        try {
          const response = await api.get('/health/profile');
          set({ profile: response.data });
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      },

      updateProfile: async (profile) => {
        try {
          const response = await api.put('/health/profile', profile);
          set({ profile: response.data });
        } catch (error) {
          console.error('Failed to update profile:', error);
        }
      },

      fetchHealthScore: async () => {
        try {
          const response = await api.get('/health/score');
          set({ healthScore: response.data });
        } catch (error) {
          console.error('Failed to fetch health score:', error);
        }
      },
    }),
    {
      name: 'ethoslife-health',
      partialize: (state) => ({
        profile: state.profile,
        goals: state.goals,
      }),
    }
  )
);

export default useHealthStore;
