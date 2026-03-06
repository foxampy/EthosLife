import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

// Fetch dashboard data
const fetchDashboard = async () => {
  const response = await api.get('/health/dashboard');
  return response.data;
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState('7d');
  
  const { data, isLoading, error } = useQuery('dashboard', fetchDashboard, {
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-stone"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const dashboard = data?.dashboard || {};
  const healthScore = dashboard.healthScore || 0;
  const goals = dashboard.goals || [];
  const recentMetrics = dashboard.recentMetrics || [];

  // Prepare chart data
  const weightData = recentMetrics
    .filter(m => m.category === 'weight')
    .slice(0, 7)
    .reverse()
    .map(m => ({
      date: new Date(m.recorded_at).toLocaleDateString(),
      weight: parseFloat(m.value)
    }));

  const sleepData = recentMetrics
    .filter(m => m.category === 'sleep')
    .slice(0, 7)
    .reverse()
    .map(m => ({
      date: new Date(m.recorded_at).toLocaleDateString(),
      hours: parseFloat(m.value)
    }));

  const scoreColor = healthScore >= 80 ? '#27ae60' : healthScore >= 60 ? '#f39c12' : '#c0392b';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink mb-2">
          Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-ink-light">Here's your health overview for today</p>
      </div>

      {/* Health Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="neu-card p-6 md:col-span-1">
          <h3 className="text-lg font-semibold text-stone mb-4">Health Score</h3>
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#dcd3c6"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={scoreColor}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(healthScore / 100) * 440} 440`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold" style={{ color: scoreColor }}>
                {healthScore}
              </span>
            </div>
          </div>
          <p className="text-center mt-4 text-ink-light">
            {healthScore >= 80 ? 'Excellent!' : healthScore >= 60 ? 'Good progress' : 'Keep improving'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="neu-card p-6 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickStat 
            title="Today's Steps" 
            value="8,432" 
            target="10,000"
            icon="👟"
          />
          <QuickStat 
            title="Sleep" 
            value="7.5h" 
            target="8h"
            icon="😴"
          />
          <QuickStat 
            title="Calories" 
            value="1,850" 
            target="2,200"
            icon="🔥"
          />
          <QuickStat 
            title="Water" 
            value="1.2L" 
            target="2.5L"
            icon="💧"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Weight Chart */}
        <div className="neu-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone">Weight History</h3>
            <Link to="/health/body" className="text-sm text-stone hover:text-ink">
              View details →
            </Link>
          </div>
          {weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#e4dfd5', 
                    border: '1px solid #8c7a6b',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#5c5243" 
                  strokeWidth={2}
                  dot={{ fill: '#5c5243', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-ink-light">
              No weight data yet. Start tracking!
            </div>
          )}
        </div>

        {/* Sleep Chart */}
        <div className="neu-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone">Sleep Hours</h3>
            <Link to="/health/sleep" className="text-sm text-stone hover:text-ink">
              View details →
            </Link>
          </div>
          {sleepData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 12]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#e4dfd5', 
                    border: '1px solid #8c7a6b',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="hours" fill="#8c7a6b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-ink-light">
              No sleep data yet. Start tracking!
            </div>
          )}
        </div>
      </div>

      {/* Goals Section */}
      <div className="neu-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-stone">Active Goals</h3>
          <Link to="/health/goals" className="text-sm text-stone hover:text-ink">
            Manage goals →
          </Link>
        </div>
        
        {goals.length > 0 ? (
          <div className="space-y-4">
            {goals.slice(0, 3).map(goal => (
              <GoalProgress key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-ink-light">
            <p>No active goals yet.</p>
            <Link to="/health/goals/new" className="text-stone hover:text-ink font-semibold">
              Create your first goal
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction to="/health/nutrition" icon="🥗" label="Log Meal" />
        <QuickAction to="/health/fitness" icon="💪" label="Log Workout" />
        <QuickAction to="/ai-chat" icon="🤖" label="Ask AI" />
        <QuickAction to="/social" icon="👥" label="Community" />
      </div>
    </div>
  );
};

// Quick Stat Component
const QuickStat = ({ title, value, target, icon }) => (
  <div className="text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <p className="text-2xl font-bold text-ink">{value}</p>
    <p className="text-sm text-ink-light">{title}</p>
    <p className="text-xs text-clay mt-1">Goal: {target}</p>
  </div>
);

// Goal Progress Component
const GoalProgress = ({ goal }) => {
  const percentage = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
  
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium text-ink">{goal.title}</span>
        <span className="text-stone">
          {goal.current_value} / {goal.target_value} {goal.unit}
        </span>
      </div>
      <div className="h-3 bg-bone-dark rounded-full overflow-hidden shadow-neu-inset">
        <div 
          className="h-full bg-gradient-to-r from-stone to-ink rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Quick Action Component
const QuickAction = ({ to, icon, label }) => (
  <Link to={to} className="neu-card p-4 text-center hover:shadow-lg transition-shadow">
    <div className="text-3xl mb-2">{icon}</div>
    <span className="text-sm font-semibold text-ink">{label}</span>
  </Link>
);

export default Dashboard;
