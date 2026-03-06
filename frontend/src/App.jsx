import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import HealthCenter from './pages/Health/HealthCenter';
import Nutrition from './pages/Health/Nutrition';
import Fitness from './pages/Health/Fitness';
import Sleep from './pages/Health/Sleep';
import Mental from './pages/Health/Mental';
import Medical from './pages/Health/Medical';
import Body from './pages/Health/Body';
import Environment from './pages/Health/Environment';
// New v2 Health Modules
import Nutrition2 from './pages/Health/Nutrition2';
import Movement2 from './pages/Health/Movement2';
import Sleep2 from './pages/Health/Sleep2';
import Psychology2 from './pages/Health/Psychology2';
import Medicine2 from './pages/Health/Medicine2';
import Relationships2 from './pages/Health/Relationships2';
import Habits2 from './pages/Health/Habits2';
import SocialFeed from './pages/Social/Feed';
import AIChat from './pages/AI/Chat';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
// New v2 Platform Pages
import Dashboard2 from './pages/Dashboard/Dashboard2';
import AIChat2 from './pages/AI/AIChat2';
import Profile2 from './pages/Profile/Profile2';
import SocialFeed2 from './pages/Social/SocialFeed2';
import Analytics2 from './pages/Analytics/Analytics2';
import Gamification2 from './pages/Gamification/Gamification2';
import Specialists2 from './pages/Specialists/Specialists2';
import Centers2 from './pages/Centers/Centers2';
import Settings2 from './pages/Settings/Settings2';
import InvestorDemo from './pages/InvestorDemo';

// Health V1 Modules - Nutrition
import NutritionV1 from './pages/Health/V1/NutritionV1';
import FoodDiaryV1 from './pages/Health/V1/FoodDiaryV1';
import MealPlannerV1 from './pages/Health/V1/MealPlannerV1';
import RecipesV1 from './pages/Health/V1/RecipesV1';
import ProductsDBV1 from './pages/Health/V1/ProductsDBV1';

// Health V1 Modules - Fitness
import FitnessV1 from './pages/Health/V1/FitnessV1';
import WorkoutLoggerV1 from './pages/Health/V1/WorkoutLoggerV1';
import ExerciseLibraryV1 from './pages/Health/V1/ExerciseLibraryV1';

// Health V1 Modules - Sleep
import SleepV1 from './pages/Health/V1/SleepV1';
import SleepAnalysisV1 from './pages/Health/V1/SleepAnalysisV1';

// Health V1 Modules - Mental Health
import MentalHealthV1 from './pages/Health/V1/MentalHealthV1';
import MoodTrackerV1 from './pages/Health/V1/MoodTrackerV1';

// Health V1 Modules - Medical
import MedicalV1 from './pages/Health/V1/MedicalV1';
import MedicationsV1 from './pages/Health/V1/MedicationsV1';

// Landing V1 Pages
import LandingV1 from './pages/Landing/LandingV1';
import FeaturesV1 from './pages/Landing/FeaturesV1';
import PricingV1 from './pages/Landing/PricingV1';
import TokenomicsV1 from './pages/Landing/TokenomicsV1';
import RoadmapV1 from './pages/Landing/RoadmapV1';

// Dashboard V1 Pages
import DashboardV1 from './pages/Dashboard/DashboardV1';
import OverviewV1 from './pages/Dashboard/OverviewV1';
import WalletV1 from './pages/Dashboard/WalletV1';
import NotificationsV1 from './pages/Dashboard/NotificationsV1';
import ActivityV1 from './pages/Dashboard/ActivityV1';

import SearchV1 from './pages/Dashboard/SearchV1';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import GuestAccessRoute from './components/Auth/GuestAccessRoute';

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-stone mx-auto mb-4"></div>
          <p className="text-stone">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

        {/* Guest Access Routes - Open for Investor Demo - ALL PAGES AVAILABLE WITHOUT REGISTRATION */}
        <Route element={<GuestAccessRoute />}>
          <Route element={<Layout />}>
            {/* Root landing page with Layout (shows header with navigation) */}
            <Route path="/" element={<LandingV1 />} />
            
            {/* Landing V1 Pages - OPEN FOR GUESTS */}
            <Route path="/v1" element={<LandingV1 />} />
            <Route path="/features-v1" element={<FeaturesV1 />} />
            <Route path="/pricing-v1" element={<PricingV1 />} />
            <Route path="/tokenomics-v1" element={<TokenomicsV1 />} />
            <Route path="/roadmap-v1" element={<RoadmapV1 />} />

            {/* Dashboard V1 Pages - OPEN FOR GUESTS */}
            <Route path="/dashboard-v1" element={<DashboardV1 />} />
            <Route path="/overview-v1" element={<OverviewV1 />} />
            <Route path="/wallet-v1" element={<WalletV1 />} />
            <Route path="/notifications-v1" element={<NotificationsV1 />} />
            <Route path="/activity-v1" element={<ActivityV1 />} />
            <Route path="/search-v1" element={<SearchV1 />} />

            {/* All v2 Modules - OPEN FOR GUESTS */}
            <Route path="/dashboard2" element={<Dashboard2 />} />
            <Route path="/health/nutrition2" element={<Nutrition2 />} />
            <Route path="/health/movement2" element={<Movement2 />} />
            <Route path="/health/sleep2" element={<Sleep2 />} />
            <Route path="/health/psychology2" element={<Psychology2 />} />
            <Route path="/health/medicine2" element={<Medicine2 />} />
            <Route path="/health/relationships2" element={<Relationships2 />} />
            <Route path="/health/habits2" element={<Habits2 />} />
            <Route path="/ai-chat2" element={<AIChat2 />} />
            <Route path="/profile2" element={<Profile2 />} />
            <Route path="/social2" element={<SocialFeed2 />} />
            <Route path="/analytics2" element={<Analytics2 />} />
            <Route path="/gamification2" element={<Gamification2 />} />
            <Route path="/specialists2" element={<Specialists2 />} />
            <Route path="/centers2" element={<Centers2 />} />
            <Route path="/settings2" element={<Settings2 />} />

            {/* Health V1 Modules - Full Suite - OPEN FOR GUESTS */}
            <Route path="/health/nutrition-v1" element={<NutritionV1 />} />
            <Route path="/health/nutrition/diary-v1" element={<FoodDiaryV1 />} />
            <Route path="/health/nutrition/meal-plan-v1" element={<MealPlannerV1 />} />
            <Route path="/health/nutrition/recipes-v1" element={<RecipesV1 />} />
            <Route path="/health/nutrition/products-v1" element={<ProductsDBV1 />} />
            <Route path="/health/fitness-v1" element={<FitnessV1 />} />
            <Route path="/health/fitness/workout-v1" element={<WorkoutLoggerV1 />} />
            <Route path="/health/fitness/exercises-v1" element={<ExerciseLibraryV1 />} />
            <Route path="/health/sleep-v1" element={<SleepV1 />} />
            <Route path="/health/sleep/analysis-v1" element={<SleepAnalysisV1 />} />
            <Route path="/health/mental-v1" element={<MentalHealthV1 />} />
            <Route path="/health/mental/mood-v1" element={<MoodTrackerV1 />} />
            <Route path="/health/medical-v1" element={<MedicalV1 />} />
            <Route path="/health/medical/meds-v1" element={<MedicationsV1 />} />

            {/* Health Center & Classic Routes */}
            <Route path="/health" element={<HealthCenter />} />
          </Route>
        </Route>

        {/* Protected routes - Require Login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/health/nutrition" element={<Nutrition />} />
            <Route path="/health/fitness" element={<Fitness />} />
            <Route path="/health/sleep" element={<Sleep />} />
            <Route path="/health/mental" element={<Mental />} />
            <Route path="/health/medical" element={<Medical />} />
            <Route path="/health/body" element={<Body />} />
            <Route path="/health/environment" element={<Environment />} />
            <Route path="/social" element={<SocialFeed />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* V2 Landing Page (Investor Demo as V2 homepage) */}
        <Route path="/v2" element={<InvestorDemo />} />
        
        {/* Redirect old /demo to /v2 */}
        <Route path="/demo" element={<Navigate to="/v2" replace />} />

        {/* Default redirect - Show Landing V1 for guests */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingV1 />} />
        
        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
