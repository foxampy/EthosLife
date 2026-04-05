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
import PageLayout from '../components/Layout/PageLayout';

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
        <Route path="/" element={<PageLayout><Landing /></PageLayout>} />
        <Route path="/landing" element={<PageLayout><Landing /></PageLayout>} />
        <Route path="/landing2" element={<PageLayout><Landing2 /></PageLayout>} />
        <Route path="/landing3" element={<PageLayout><Landing3 /></PageLayout>} />
        <Route path="/v2" element={<PageLayout><InvestorDemo /></PageLayout>} />
        <Route path="/demo" element={<Navigate to="/v2" replace />} />
        
        {/* Landing Sub-pages */}
        <Route path="/features" element={<PageLayout><Features /></PageLayout>} />
        <Route path="/pricing" element={<PageLayout><Pricing /></PageLayout>} />
        <Route path="/team" element={<PageLayout><Team /></PageLayout>} />
        <Route path="/roadmap" element={<PageLayout><Roadmap /></PageLayout>} />
        <Route path="/faq" element={<PageLayout><FAQ /></PageLayout>} />
        <Route path="/blog" element={<PageLayout><Blog /></PageLayout>} />

        {/* =============== AUTH =============== */}
        <Route path="/login" element={<PageLayout><Login /></PageLayout>} />
        <Route path="/register" element={<PageLayout><Register /></PageLayout>} />

        {/* =============== DASHBOARD =============== */}
        <Route path="/dashboard" element={<PageLayout><Dashboard /></PageLayout>} />
        <Route path="/dashboard-v2" element={<PageLayout><Dashboard2 /></PageLayout>} />
        <Route path="/dashboard-preview" element={<PageLayout><Dashboard2Preview /></PageLayout>} />

        {/* =============== HEALTH MODULES =============== */}
        <Route path="/health" element={<Navigate to="/health/nutrition" replace />} />

        {/* Primary Health Routes */}
        <Route path="/health/nutrition" element={<PageLayout><Nutrition /></PageLayout>} />
        <Route path="/health/movement" element={<PageLayout><Movement /></PageLayout>} />
        <Route path="/health/sleep" element={<PageLayout><Sleep /></PageLayout>} />
        <Route path="/health/psychology" element={<PageLayout><Psychology /></PageLayout>} />
        <Route path="/health/medicine" element={<PageLayout><Medicine /></PageLayout>} />
        <Route path="/health/relationships" element={<PageLayout><Relationships /></PageLayout>} />
        <Route path="/health/habits" element={<PageLayout><Habits /></PageLayout>} />

        {/* =============== LEGACY HEALTH ROUTES (V1) =============== */}
        <Route path="/health/fitness" element={<PageLayout><FitnessV1 /></PageLayout>} />
        <Route path="/health/nutrition/diary" element={<PageLayout><FoodDiaryV1 /></PageLayout>} />
        <Route path="/health/nutrition/meal-plan" element={<PageLayout><MealPlannerV1 /></PageLayout>} />
        <Route path="/health/nutrition/recipes" element={<PageLayout><RecipesV1 /></PageLayout>} />
        <Route path="/health/nutrition/products" element={<PageLayout><ProductsDBV1 /></PageLayout>} />
        <Route path="/health/fitness/exercises" element={<PageLayout><ExerciseLibraryV1 /></PageLayout>} />
        <Route path="/health/fitness/workout" element={<PageLayout><WorkoutLoggerV1 /></PageLayout>} />
        <Route path="/health/sleep/analysis" element={<PageLayout><SleepAnalysisV1 /></PageLayout>} />
        <Route path="/health/mental/mood" element={<PageLayout><MoodTrackerV1 /></PageLayout>} />
        <Route path="/health/medical/medications" element={<PageLayout><MedicationsV1 /></PageLayout>} />

        {/* =============== LEGACY SOCIAL ROUTES =============== */}
        <Route path="/challenges" element={<PageLayout><ChallengesV1 /></PageLayout>} />
        <Route path="/friends" element={<PageLayout><FriendsV1 /></PageLayout>} />
        <Route path="/groups" element={<PageLayout><GroupsV1 /></PageLayout>} />
        <Route path="/messages" element={<PageLayout><MessagesV1 /></PageLayout>} />
        <Route path="/leaders" element={<PageLayout><LeadersV1 /></PageLayout>} />

        {/* =============== AI & FEATURES =============== */}
        <Route path="/social" element={<PageLayout><SocialFeed /></PageLayout>} />
        <Route path="/ai-chat" element={<PageLayout><AIChatUnified /></PageLayout>} />
        <Route path="/ai" element={<PageLayout><AIChatUnified /></PageLayout>} />
        <Route path="/analytics" element={<PageLayout><Analytics /></PageLayout>} />
        <Route path="/gamification" element={<PageLayout><Gamification /></PageLayout>} />
        <Route path="/achievements" element={<PageLayout><Gamification /></PageLayout>} />
        <Route path="/specialists" element={<PageLayout><Specialists /></PageLayout>} />
        <Route path="/centers" element={<PageLayout><Centers /></PageLayout>} />

        {/* =============== USER =============== */}
        <Route path="/profile" element={<PageLayout><Profile /></PageLayout>} />
        <Route path="/settings" element={<PageLayout><Settings /></PageLayout>} />
        <Route path="/tokenomics" element={<PageLayout><TokenomicsV1 /></PageLayout>} />

        {/* =============== DESIGN SYSTEM =============== */}
        <Route path="/design-system" element={<PageLayout><DesignSystemDemo /></PageLayout>} />
        <Route path="/design" element={<PageLayout><DesignSystemDemo /></PageLayout>} />

        {/* =============== 404 =============== */}
        <Route path="*" element={<PageLayout><NotFound404 /></PageLayout>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
