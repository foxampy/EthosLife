import React from 'react';
import { Link } from 'react-router-dom';

// NEW v2 Health Modules (Full Featured)
const healthModulesV2 = [
  {
    id: 'nutrition2',
    title: 'Nutrition 2.0',
    icon: '🥗',
    description: 'Advanced meal tracking with AI photo recognition, recipes, and macro analysis',
    color: '#10b981',
    badge: 'NEW'
  },
  {
    id: 'movement2',
    title: 'Movement 2.0',
    icon: '💪',
    description: 'Complete workout logger with exercise library, recovery tracking, and progress analytics',
    color: '#f97316',
    badge: 'NEW'
  },
  {
    id: 'sleep2',
    title: 'Sleep 2.0',
    icon: '😴',
    description: 'Smart sleep tracking with phases, hygiene checklist, and chronotype analysis',
    color: '#6366f1',
    badge: 'NEW'
  },
  {
    id: 'psychology2',
    title: 'Psychology 2.0',
    icon: '🧠',
    description: 'Mental wellness with CBT tools, PHQ-9/GAD-7 assessments, and emotion tracking',
    color: '#06b6d4',
    badge: 'NEW'
  },
  {
    id: 'medicine2',
    title: 'Medicine 2.0',
    icon: '🏥',
    description: 'Comprehensive health records with medication tracking, symptoms, and lab results',
    color: '#f43f5e',
    badge: 'NEW'
  },
  {
    id: 'relationships2',
    title: 'Relationships 2.0',
    icon: '💕',
    description: 'Social health tracking with connections, quality time, and communication tools',
    color: '#ec4899',
    badge: 'NEW'
  },
  {
    id: 'habits2',
    title: 'Habits 2.0',
    icon: '🔥',
    description: 'Advanced habit tracker with streaks, analytics, and AI coaching',
    color: '#8b5cf6',
    badge: 'NEW'
  }
];

// Classic Health Modules
const healthDirections = [
  {
    id: 'nutrition',
    title: 'Nutrition (Classic)',
    icon: '🥗',
    description: 'Track meals, calories, and macros',
    color: '#27ae60'
  },
  {
    id: 'fitness',
    title: 'Fitness (Classic)',
    icon: '💪',
    description: 'Workouts, steps, and activity',
    color: '#e74c3c'
  },
  {
    id: 'sleep',
    title: 'Sleep (Classic)',
    icon: '😴',
    description: 'Sleep quality and schedule',
    color: '#9b59b6'
  },
  {
    id: 'mental',
    title: 'Mental Health (Classic)',
    icon: '🧠',
    description: 'Mood, stress, and mindfulness',
    color: '#3498db'
  },
  {
    id: 'medical',
    title: 'Medical (Classic)',
    icon: '🏥',
    description: 'Records, medications, visits',
    color: '#e67e22'
  },
  {
    id: 'body',
    title: 'Body',
    icon: '📏',
    description: 'Weight, measurements, BMI',
    color: '#1abc9c'
  },
  {
    id: 'environment',
    title: 'Environment',
    icon: '🌍',
    description: 'Air quality, sun exposure',
    color: '#f39c12'
  }
];

const HealthCenter = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink mb-2">Health Center</h1>
        <p className="text-ink-light">
          Manage all aspects of your health in one place
        </p>
      </div>

      {/* Quick Add */}
      <div className="neu-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-stone mb-4">Quick Add</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/health/medicine2" className="neu-card p-4 text-center hover:bg-rose-50 transition-colors">
            <div className="text-2xl mb-2">💊</div>
            <span className="text-sm font-medium text-ink">Medicine</span>
          </Link>
          <QuickAddButton icon="⚖️" label="Weight" />
          <QuickAddButton icon="😴" label="Sleep" />
          <QuickAddButton icon="💧" label="Water" />
        </div>
      </div>

      {/* NEW v2 Health Modules Grid */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-ink mb-2">✨ New Health Modules 2.0</h2>
        <p className="text-ink-light text-sm mb-4">
          Fully redesigned with advanced features, AI integration, and comprehensive tracking
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {healthModulesV2.map((direction) => (
          <Link
            key={direction.id}
            to={`/health/${direction.id}`}
            className="neu-card p-6 hover:shadow-lg transition-all group relative overflow-hidden"
          >
            {/* NEW Badge */}
            <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              {direction.badge}
            </span>
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${direction.color}20` }}
              >
                {direction.icon}
              </div>
              <span 
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: `${direction.color}20`, color: direction.color }}
              >
                Open →
              </span>
            </div>
            <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-stone transition-colors">
              {direction.title}
            </h3>
            <p className="text-ink-light text-sm">
              {direction.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Classic Health Directions Grid */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-stone mb-2">Classic Modules</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
        {healthDirections.map((direction) => (
          <Link
            key={direction.id}
            to={`/health/${direction.id}`}
            className="neu-card p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${direction.color}20` }}
              >
                {direction.icon}
              </div>
              <span 
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: `${direction.color}20`, color: direction.color }}
              >
                View →
              </span>
            </div>
            <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-stone transition-colors">
              {direction.title}
            </h3>
            <p className="text-ink-light text-sm">
              {direction.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Platform v2 Features */}
      <div className="mb-4 mt-12">
        <h2 className="text-xl font-bold text-ink mb-2">✨ Platform Features 2.0</h2>
        <p className="text-ink-light text-sm mb-4">
          Enhanced platform features with advanced analytics, gamification, and social capabilities
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link to="/dashboard2" className="neu-card p-6 hover:shadow-lg transition-all group bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl mb-4">📊</div>
          <h3 className="text-lg font-bold text-ink mb-2">Dashboard 2.0</h3>
          <p className="text-ink-light text-sm">Advanced widgets with health score, daily checklist, and insights</p>
        </Link>
        
        <Link to="/ai-chat2" className="neu-card p-6 hover:shadow-lg transition-all group bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl mb-4">🤖</div>
          <h3 className="text-lg font-bold text-ink mb-2">AI Coach 2.0</h3>
          <p className="text-ink-light text-sm">Advanced AI chat with personas, health context, and streaming</p>
        </Link>
        
        <Link to="/analytics2" className="neu-card p-6 hover:shadow-lg transition-all group bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-3xl mb-4">📈</div>
          <h3 className="text-lg font-bold text-ink mb-2">Analytics 2.0</h3>
          <p className="text-ink-light text-sm">Deep health analytics with trends, correlations, and reports</p>
        </Link>
        
        <Link to="/gamification2" className="neu-card p-6 hover:shadow-lg transition-all group bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mb-4">🎮</div>
          <h3 className="text-lg font-bold text-ink mb-2">Gamification 2.0</h3>
          <p className="text-ink-light text-sm">Levels, achievements, challenges, and rewards system</p>
        </Link>
        
        <Link to="/social2" className="neu-card p-6 hover:shadow-lg transition-all group bg-gradient-to-br from-pink-50 to-rose-50">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-3xl mb-4">👥</div>
          <h3 className="text-lg font-bold text-ink mb-2">Social Feed 2.0</h3>
          <p className="text-ink-light text-sm">Community features with posts, stories, and challenges</p>
        </Link>
        
        <Link to="/specialists2" className="neu-card p-6 hover:shadow-lg transition-all group bg-gradient-to-br from-cyan-50 to-teal-50">
          <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center text-3xl mb-4">👨‍⚕️</div>
          <h3 className="text-lg font-bold text-ink mb-2">Specialists 2.0</h3>
          <p className="text-ink-light text-sm">Healthcare professionals marketplace with booking</p>
        </Link>
        
        <Link to="/centers2" className="neu-card p-6 hover:shadow-lg transition-all group bg-gradient-to-br from-emerald-50 to-green-50">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl mb-4">🏢</div>
          <h3 className="text-lg font-bold text-ink mb-2">Centers 2.0</h3>
          <p className="text-ink-light text-sm">Wellness centers directory with services and reviews</p>
        </Link>
        
        <Link to="/profile2" className="neu-card p-6 hover:shadow-lg transition-all group bg-gradient-to-br from-violet-50 to-purple-50">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-3xl mb-4">👤</div>
          <h3 className="text-lg font-bold text-ink mb-2">Profile 2.0</h3>
          <p className="text-ink-light text-sm">Comprehensive profile with health data, goals, and integrations</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="neu-card p-6 mt-8">
        <h2 className="text-lg font-semibold text-stone mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <ActivityItem 
            icon="⚖️" 
            text="Weight recorded: 75.5 kg" 
            time="2 hours ago" 
          />
          <ActivityItem 
            icon="🍎" 
            text="Logged lunch: Grilled chicken salad" 
            time="4 hours ago" 
          />
          <ActivityItem 
            icon="🏃" 
            text="Completed workout: 30 min cardio" 
            time="Yesterday" 
          />
        </div>
      </div>
    </div>
  );
};

const QuickAddButton = ({ icon, label }) => (
  <button className="neu-card p-4 text-center hover:bg-sand transition-colors">
    <div className="text-2xl mb-2">{icon}</div>
    <span className="text-sm font-medium text-ink">{label}</span>
  </button>
);

const ActivityItem = ({ icon, text, time }) => (
  <div className="flex items-center justify-between p-3 bg-sand rounded-xl">
    <div className="flex items-center space-x-3">
      <span className="text-xl">{icon}</span>
      <span className="text-ink">{text}</span>
    </div>
    <span className="text-sm text-ink-light">{time}</span>
  </div>
);

export default HealthCenter;
