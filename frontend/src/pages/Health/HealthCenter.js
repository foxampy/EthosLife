import React from 'react';
import { Link } from 'react-router-dom';

const healthDirections = [
  {
    id: 'nutrition',
    title: 'Nutrition',
    icon: '🥗',
    description: 'Track meals, calories, and macros',
    color: '#27ae60'
  },
  {
    id: 'fitness',
    title: 'Fitness',
    icon: '💪',
    description: 'Workouts, steps, and activity',
    color: '#e74c3c'
  },
  {
    id: 'sleep',
    title: 'Sleep',
    icon: '😴',
    description: 'Sleep quality and schedule',
    color: '#9b59b6'
  },
  {
    id: 'mental',
    title: 'Mental Health',
    icon: '🧠',
    description: 'Mood, stress, and mindfulness',
    color: '#3498db'
  },
  {
    id: 'medical',
    title: 'Medical',
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
          <QuickAddButton icon="⚖️" label="Weight" />
          <QuickAddButton icon="😴" label="Sleep" />
          <QuickAddButton icon="💧" label="Water" />
          <QuickAddButton icon="🩺" label="Blood Pressure" />
        </div>
      </div>

      {/* Health Directions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
