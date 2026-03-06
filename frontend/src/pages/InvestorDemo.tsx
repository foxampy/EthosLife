import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, Brain, Heart, Moon, Users, 
  Zap, BarChart3, MessageSquare, Trophy, 
  Building2, Stethoscope, Settings, Sparkles,
  ArrowRight, Download, ExternalLink, Play
} from 'lucide-react';

const healthModules = [
  {
    id: 'nutrition2',
    title: 'Nutrition 2.0',
    icon: '🥗',
    description: 'AI-powered meal tracking with photo recognition, recipes, and macro analysis',
    color: 'from-emerald-400 to-green-500',
    features: ['AI Food Recognition', 'Recipe Builder', 'Macro Tracking', 'Water Logger'],
    stats: '350K+ foods'
  },
  {
    id: 'movement2',
    title: 'Movement 2.0',
    icon: '💪',
    description: 'Complete fitness ecosystem with workout logger and recovery tracking',
    color: 'from-orange-400 to-red-500',
    features: ['Activity Rings', 'Exercise Library', 'Recovery Status', 'GPS Tracking'],
    stats: '100+ exercises'
  },
  {
    id: 'sleep2',
    title: 'Sleep 2.0',
    icon: '😴',
    description: 'Smart sleep optimization with phases tracking and chronotype analysis',
    color: 'from-indigo-400 to-purple-500',
    features: ['Sleep Phases', 'Smart Alarm', 'Hygiene Checklist', 'Chronotype Quiz'],
    stats: '89% avg quality'
  },
  {
    id: 'psychology2',
    title: 'Psychology 2.0',
    icon: '🧠',
    description: 'Mental wellness with clinical assessments and CBT tools',
    color: 'from-cyan-400 to-blue-500',
    features: ['PHQ-9/GAD-7 Tests', 'CBT Worksheets', 'Emotion Wheel', 'Meditations'],
    stats: '8 techniques'
  },
  {
    id: 'medicine2',
    title: 'Medicine 2.0',
    icon: '🏥',
    description: 'Digital health records with medication tracking and lab results',
    color: 'from-rose-400 to-pink-500',
    features: ['Medication Tracker', 'Symptom Logger', 'Lab OCR', 'Appointments'],
    stats: '500+ drugs DB'
  },
  {
    id: 'relationships2',
    title: 'Relationships 2.0',
    icon: '💕',
    description: 'Social health tracking with connections and quality time metrics',
    color: 'from-pink-400 to-rose-500',
    features: ['Connection Manager', 'Quality Time', 'Social Score', 'Activities'],
    stats: 'Holistic view'
  },
  {
    id: 'habits2',
    title: 'Habits 2.0',
    icon: '🔥',
    description: 'Behavior change platform with streaks and AI coaching',
    color: 'from-violet-400 to-purple-500',
    features: ['Streak Tracking', 'Heatmap Viz', 'AI Coach', 'Achievements'],
    stats: 'Gamified'
  }
];

const platformFeatures = [
  {
    id: 'dashboard2',
    title: 'Dashboard 2.0',
    icon: <BarChart3 className="w-6 h-6" />,
    description: '12+ smart widgets with health score and daily insights',
    color: 'from-blue-400 to-indigo-500',
    badge: 'Central Hub'
  },
  {
    id: 'ai-chat2',
    title: 'AI Coach 2.0',
    icon: <MessageSquare className="w-6 h-6" />,
    description: 'Health-focused AI assistant with personas and streaming',
    color: 'from-purple-400 to-pink-500',
    badge: 'AI Powered'
  },
  {
    id: 'analytics2',
    title: 'Analytics 2.0',
    icon: <Activity className="w-6 h-6" />,
    description: 'Deep health insights with correlations and predictions',
    color: 'from-green-400 to-emerald-500',
    badge: 'Data Driven'
  },
  {
    id: 'gamification2',
    title: 'Gamification 2.0',
    icon: <Trophy className="w-6 h-6" />,
    description: 'Engagement system with levels, challenges, and rewards',
    color: 'from-amber-400 to-orange-500',
    badge: 'Engaging'
  },
  {
    id: 'specialists2',
    title: 'Specialists 2.0',
    icon: <Stethoscope className="w-6 h-6" />,
    description: 'Healthcare marketplace with 9 specialties and booking',
    color: 'from-teal-400 to-cyan-500',
    badge: 'B2B Revenue'
  },
  {
    id: 'centers2',
    title: 'Centers 2.0',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Wellness directory with services and membership management',
    color: 'from-emerald-400 to-teal-500',
    badge: 'Marketplace'
  }
];

const stats = [
  { label: 'Health Modules', value: '7', suffix: '' },
  { label: 'Platform Features', value: '8', suffix: '' },
  { label: 'Lines of Code', value: '948', suffix: 'KB' },
  { label: 'Dashboard Widgets', value: '12', suffix: '+' },
];

const techStack = [
  'React 18', 'TypeScript', 'Tailwind CSS', 'Node.js', 
  'PostgreSQL', 'Qwen AI', 'Recharts', 'Framer Motion'
];

const InvestorDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone via-stone-800 to-ink text-bone py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-4xl">🌱</span>
            <span className="text-2xl font-bold">EthoLife</span>
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">v2</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
            The Future of
            <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Health Technology
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-center text-bone/80 max-w-3xl mx-auto mb-12">
            Comprehensive health ecosystem with AI-powered insights, 
            gamification, and professional healthcare marketplace
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/dashboard2"
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              <Play className="w-5 h-5" />
              <span>Explore Live Demo</span>
            </Link>
            <a 
              href="/whitepaper"
              className="flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>View Whitepaper</span>
            </a>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tech Stack:</span>
            {techStack.map((tech, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Health Modules */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              <Heart className="w-4 h-4" />
              <span>7 Health Directions</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Comprehensive Health Modules</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Each module offers deep functionality with AI integration, advanced analytics, 
              and professional-grade tracking capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthModules.map((module) => (
              <Link
                key={module.id}
                to={`/health/${module.id}`}
                className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${module.color} opacity-10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{module.icon}</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                      {module.stats}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700">
                    {module.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">{module.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {module.features.map((feature, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                    <span>View Demo</span>
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Platform Features</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Advanced Platform Capabilities</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              AI-powered insights, social features, marketplace, and gamification 
              create a complete health ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature) => (
              <Link
                key={feature.id}
                to={`/${feature.id}`}
                className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}>
                  {feature.icon}
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                  <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full bg-gradient-to-r ${feature.color}`}>
                    {feature.badge}
                  </span>
                </div>
                
                <p className="text-slate-600 text-sm">{feature.description}</p>
                
                <div className="mt-4 flex items-center text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                  <span>Explore</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Highlights */}
      <section className="py-20 px-4 bg-gradient-to-br from-stone to-ink text-bone">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Investment Opportunity</h2>
            <p className="text-lg text-bone/70 max-w-2xl mx-auto">
              Join the health tech revolution with a platform that combines 
              AI, community, and professional healthcare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Market Opportunity</h3>
              <p className="text-bone/70">
                $4.2T global wellness market growing at 9.9% CAGR. 
                Digital health adoption accelerated post-pandemic.
              </p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2">Competitive Advantage</h3>
              <p className="text-bone/70">
                7-module integrated ecosystem vs single-purpose apps. 
                AI insights across all health dimensions.
              </p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Revenue Model</h3>
              <p className="text-bone/70">
                Freemium + Premium subscriptions + B2B marketplace 
                commission + Enterprise licensing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Footer */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Quick Access to All Demos</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/dashboard2" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-2 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Dashboard</span>
            </Link>
            <Link to="/health/nutrition2" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-center">
              <span className="text-2xl block mb-1">🥗</span>
              <span className="text-sm font-medium text-slate-700">Nutrition</span>
            </Link>
            <Link to="/health/movement2" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-center">
              <span className="text-2xl block mb-1">💪</span>
              <span className="text-sm font-medium text-slate-700">Movement</span>
            </Link>
            <Link to="/health/sleep2" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-center">
              <Moon className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
              <span className="text-sm font-medium text-slate-700">Sleep</span>
            </Link>
            <Link to="/ai-chat2" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-center">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <span className="text-sm font-medium text-slate-700">AI Coach</span>
            </Link>
            <Link to="/analytics2" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-center">
              <Activity className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
              <span className="text-sm font-medium text-slate-700">Analytics</span>
            </Link>
            <Link to="/specialists2" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-center">
              <Stethoscope className="w-6 h-6 mx-auto mb-2 text-teal-500" />
              <span className="text-sm font-medium text-slate-700">Specialists</span>
            </Link>
            <Link to="/gamification2" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <span className="text-sm font-medium text-slate-700">Rewards</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🌱</span>
            <span className="text-2xl font-bold text-white">EthoLife</span>
          </div>
          <p className="mb-6">Comprehensive Health Ecosystem with AI</p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <a href="mailto:investors@ethoslife.com" className="hover:text-white transition-colors">
              investors@ethoslife.com
            </a>
            <span>•</span>
            <span>© 2026 EthoLife. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InvestorDemo;
