/**
 * EthosLife - Unified Router Configuration
 * Single source of truth for all application routes
 * 
 * Architecture:
 * - All routes use ElLayout wrapper (unified design system)
 * - V2 pages are primary (V1 legacy kept for compatibility)
 * - Deep Neumorphism styling throughout
 * - Guest access enabled for all routes
 */

import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ElLayout from '../components/ElLayout/ElLayout';

// Loading Component
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
    <div className="text-center">
      <motion.div
        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold text-2xl shadow-lg animate-pulse"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        E
      </motion.div>
      <p className="text-[#5c5243] font-medium">Loading EthosLife...</p>
    </div>
  </div>
);

// ==================== PAGES (Lazy Loaded) ====================

// Landing Pages (V2 is now main - renamed without V2 suffix)
const Landing = React.lazy(() => import('../pages/Landing/Landing'));
const Landing2 = React.lazy(() => import('../pages/Landing/Landing2'));
const Landing3 = React.lazy(() => import('../pages/Landing/Landing3'));
const Features = React.lazy(() => import('../pages/Landing/Features'));
const Pricing = React.lazy(() => import('../pages/Landing/Pricing'));
const Team = React.lazy(() => import('../pages/Landing/Team'));
const Roadmap = React.lazy(() => import('../pages/Landing/Roadmap'));
const FAQ = React.lazy(() => import('../pages/Landing/FAQ'));
const Blog = React.lazy(() => import('../pages/Landing/Blog'));

// Auth
const Login = React.lazy(() => import('../pages/Auth/Login'));
const Register = React.lazy(() => import('../pages/Auth/Register'));

// Dashboard (V2 is main)
const Dashboard = React.lazy(() => import('../pages/Dashboard/Dashboard'));
const Dashboard2 = React.lazy(() => import('../pages/Dashboard/Dashboard2'));
const Dashboard2Preview = React.lazy(() => import('../pages/Dashboard/Dashboard2Preview'));
const InvestorDemo = React.lazy(() => import('../pages/InvestorDemo'));

// Health Modules (V2 - Primary)
const Nutrition = React.lazy(() => import('../pages/Health/Nutrition2'));
const Movement = React.lazy(() => import('../pages/Health/Movement2'));
const Sleep = React.lazy(() => import('../pages/Health/Sleep2'));
const Psychology = React.lazy(() => import('../pages/Health/Psychology2'));
const Medicine = React.lazy(() => import('../pages/Health/Medicine2'));
const Relationships = React.lazy(() => import('../pages/Health/Relationships2'));
const Habits = React.lazy(() => import('../pages/Health/Habits2'));

// Social
const SocialFeed = React.lazy(() => import('../pages/Social/SocialFeed2'));

// AI & Features
const AIChatUnified = React.lazy(() => import('../pages/AI/AIChatUnified'));
const Analytics = React.lazy(() => import('../pages/Analytics/Analytics2'));
const Gamification = React.lazy(() => import('../pages/Gamification/Gamification2'));
const Specialists = React.lazy(() => import('../pages/Specialists/Specialists2'));
const Centers = React.lazy(() => import('../pages/Centers/Centers2'));

// User
const Profile = React.lazy(() => import('../pages/Profile/Profile2'));
const Settings = React.lazy(() => import('../pages/Settings/Settings2'));

// V1 Legacy (Keep for compatibility - only existing files)
const TokenomicsV1 = React.lazy(() => import('../pages/Landing/TokenomicsV1'));
const FitnessV1 = React.lazy(() => import('../pages/Health/V1/FitnessV1'));
const FoodDiaryV1 = React.lazy(() => import('../pages/Health/V1/FoodDiaryV1'));
const MealPlannerV1 = React.lazy(() => import('../pages/Health/V1/MealPlannerV1'));
const RecipesV1 = React.lazy(() => import('../pages/Health/V1/RecipesV1'));
const ProductsDBV1 = React.lazy(() => import('../pages/Health/V1/ProductsDBV1'));
const ExerciseLibraryV1 = React.lazy(() => import('../pages/Health/V1/ExerciseLibraryV1'));
const WorkoutLoggerV1 = React.lazy(() => import('../pages/Health/V1/WorkoutLoggerV1'));
const SleepAnalysisV1 = React.lazy(() => import('../pages/Health/V1/SleepAnalysisV1'));
const MoodTrackerV1 = React.lazy(() => import('../pages/Health/V1/MoodTrackerV1'));
const MedicationsV1 = React.lazy(() => import('../pages/Health/V1/MedicationsV1'));
const ChallengesV1 = React.lazy(() => import('../pages/Social/V1/ChallengesV1'));
const FriendsV1 = React.lazy(() => import('../pages/Social/V1/FriendsV1'));
const GroupsV1 = React.lazy(() => import('../pages/Social/V1/GroupsV1'));
const MessagesV1 = React.lazy(() => import('../pages/Social/V1/MessagesV1'));
const LeadersV1 = React.lazy(() => import('../pages/Social/V1/LeadersV1'));

// Design & Utilities
const DesignSystemDemo = React.lazy(() => import('../pages/Unified/DesignSystemDemo'));
const NotFound404 = React.lazy(() => import('../pages/NotFound404'));

// ==================== ROUTE CONFIGURATION ====================

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* =============== LANDING PAGES =============== */}
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/landing2" element={<Landing2 />} />
        <Route path="/landing3" element={<Landing3 />} />
        <Route path="/v2" element={<InvestorDemo />} />
        <Route path="/demo" element={<Navigate to="/v2" replace />} />
        
        {/* Landing Sub-pages */}
        <Route path="/features" element={<ElLayout><Features /></ElLayout>} />
        <Route path="/pricing" element={<ElLayout><Pricing /></ElLayout>} />
        <Route path="/team" element={<ElLayout><Team /></ElLayout>} />
        <Route path="/roadmap" element={<ElLayout><Roadmap /></ElLayout>} />
        <Route path="/faq" element={<ElLayout><FAQ /></ElLayout>} />
        <Route path="/blog" element={<ElLayout><Blog /></ElLayout>} />

        {/* =============== AUTH =============== */}
        <Route path="/login" element={<ElLayout showFooter={false}><Login /></ElLayout>} />
        <Route path="/register" element={<ElLayout showFooter={false}><Register /></ElLayout>} />

        {/* =============== DASHBOARD =============== */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-v2" element={<Dashboard2 />} />
        <Route path="/dashboard-preview" element={<Dashboard2Preview />} />

        {/* =============== HEALTH MODULES =============== */}
        <Route path="/health" element={<Navigate to="/health/nutrition" replace />} />
        
        {/* Primary Health Routes */}
        <Route path="/health/nutrition" element={<Nutrition />} />
        <Route path="/health/movement" element={<Movement />} />
        <Route path="/health/sleep" element={<Sleep />} />
        <Route path="/health/psychology" element={<Psychology />} />
        <Route path="/health/medicine" element={<Medicine />} />
        <Route path="/health/relationships" element={<Relationships />} />
        <Route path="/health/habits" element={<Habits />} />

        {/* =============== LEGACY HEALTH ROUTES (V1) =============== */}
        <Route path="/health/fitness" element={<FitnessV1 />} />
        <Route path="/health/nutrition/diary" element={<FoodDiaryV1 />} />
        <Route path="/health/nutrition/meal-plan" element={<MealPlannerV1 />} />
        <Route path="/health/nutrition/recipes" element={<RecipesV1 />} />
        <Route path="/health/nutrition/products" element={<ProductsDBV1 />} />
        <Route path="/health/fitness/exercises" element={<ExerciseLibraryV1 />} />
        <Route path="/health/fitness/workout" element={<WorkoutLoggerV1 />} />
        <Route path="/health/sleep/analysis" element={<SleepAnalysisV1 />} />
        <Route path="/health/mental/mood" element={<MoodTrackerV1 />} />
        <Route path="/health/medical/medications" element={<MedicationsV1 />} />

        {/* =============== LEGACY SOCIAL ROUTES =============== */}
        <Route path="/challenges" element={<ChallengesV1 />} />
        <Route path="/friends" element={<FriendsV1 />} />
        <Route path="/groups" element={<GroupsV1 />} />
        <Route path="/messages" element={<MessagesV1 />} />
        <Route path="/leaders" element={<LeadersV1 />} />

        {/* =============== AI & FEATURES =============== */}
        <Route path="/social" element={<SocialFeed />} />
        <Route path="/ai-chat" element={<AIChatUnified />} />
        <Route path="/ai" element={<AIChatUnified />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/gamification" element={<Gamification />} />
        <Route path="/achievements" element={<Gamification />} />
        <Route path="/specialists" element={<Specialists />} />
        <Route path="/centers" element={<Centers />} />

        {/* =============== USER =============== */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tokenomics" element={<TokenomicsV1 />} />

        {/* =============== DESIGN SYSTEM =============== */}
        <Route path="/design-system" element={<DesignSystemDemo />} />
        <Route path="/design" element={<DesignSystemDemo />} />

        {/* =============== 404 =============== */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
