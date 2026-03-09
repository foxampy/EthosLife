import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useVersion } from './contexts/VersionContext';
import Layout from './components/Layout/Layout';

// V1 Pages
import DashboardV1 from './pages/Dashboard/DashboardV1';
import NutritionV1 from './pages/Health/V1/NutritionV1';
import FitnessV1 from './pages/Health/V1/FitnessV1';
import SleepV1 from './pages/Health/V1/SleepV1';
import MentalHealthV1 from './pages/Health/V1/MentalHealthV1';

// V2 Pages
import Dashboard2 from './pages/Dashboard/Dashboard2';
import Nutrition2 from './pages/Health/Nutrition2';
import Movement2 from './pages/Health/Movement2';
import Sleep2 from './pages/Health/Sleep2';
import Psychology2 from './pages/Health/Psychology2';
import Habits2 from './pages/Health/Habits2';
import Medicine2 from './pages/Health/Medicine2';
import Relationships2 from './pages/Health/Relationships2';
import AIChat2 from './pages/AI/AIChat2';
import Analytics2 from './pages/Analytics/Analytics2';
import Gamification2 from './pages/Gamification/Gamification2';
import Settings2 from './pages/Settings/Settings2';
import InvestorDemo from './pages/InvestorDemo';

// Social V1 Pages
import SocialFeedV1 from './pages/Social/V1/SocialFeedV1';
import PostDetailV1 from './pages/Social/V1/PostDetailV1';
import FriendsV1 from './pages/Social/V1/FriendsV1';
import MessagesV1 from './pages/Social/V1/MessagesV1';
import GroupsV1 from './pages/Social/V1/GroupsV1';
import GroupDetailV1 from './pages/Social/V1/GroupDetailV1';
import ChallengesV1 from './pages/Social/V1/ChallengesV1';
import LeadersV1 from './pages/Social/V1/LeadersV1';

// Specialists & Centers (V2 only)
import Specialists2 from './pages/Specialists/Specialists2';
import Centers2 from './pages/Centers/Centers2';

// Profile (V2)
import Profile2 from './pages/Profile/Profile2';

// Web3 Pages
import { WalletDashboard, StakingPage, TokenSalePage } from './pages/Web3';

// Landing Pages
import LandingV1 from './pages/Landing/LandingV1';
import FeaturesV1 from './pages/Landing/FeaturesV1';
import PricingV1 from './pages/Landing/PricingV1';
import TokenomicsV1 from './pages/Landing/TokenomicsV1';
import RoadmapV1 from './pages/Landing/RoadmapV1';
import TeamV1 from './pages/Landing/TeamV1';
import FAQV1 from './pages/Landing/FAQV1';

// Payments Pages
import CheckoutV1 from './pages/Payments/V1/CheckoutV1';
import PaymentSuccessV1 from './pages/Payments/V1/PaymentSuccessV1';
import PaymentFailedV1 from './pages/Payments/V1/PaymentFailedV1';

// Version-aware page components
const Dashboard = () => {
  const { isV2 } = useVersion();
  return isV2 ? <Dashboard2 /> : <DashboardV1 />;
};

const Nutrition = () => {
  const { isV2 } = useVersion();
  return isV2 ? <Nutrition2 /> : <NutritionV1 />;
};

const Fitness = () => {
  const { isV2 } = useVersion();
  return isV2 ? <Movement2 /> : <FitnessV1 />;
};

const Sleep = () => {
  const { isV2 } = useVersion();
  return isV2 ? <Sleep2 /> : <SleepV1 />;
};

const Mental = () => {
  const { isV2 } = useVersion();
  return isV2 ? <Psychology2 /> : <MentalHealthV1 />;
};

function AppContent() {
  return (
    <Layout>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<LandingV1 />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-v2" element={<Dashboard2 />} />
        <Route path="/dashboard-v1" element={<DashboardV1 />} />

        {/* Landing Pages */}
        <Route path="/landing" element={<LandingV1 />} />
        <Route path="/features" element={<FeaturesV1 />} />
        <Route path="/pricing" element={<PricingV1 />} />
        <Route path="/tokenomics" element={<TokenomicsV1 />} />
        <Route path="/roadmap" element={<RoadmapV1 />} />
        <Route path="/team" element={<TeamV1 />} />
        <Route path="/faq" element={<FAQV1 />} />

        {/* Health Modules - Version Aware */}
        <Route path="/health/nutrition" element={<Nutrition />} />
        <Route path="/health/nutrition-v2" element={<Nutrition2 />} />
        <Route path="/health/nutrition-v1" element={<NutritionV1 />} />
        
        <Route path="/health/movement" element={<Fitness />} />
        <Route path="/health/movement-v2" element={<Movement2 />} />
        <Route path="/health/fitness" element={<Fitness />} />
        <Route path="/health/fitness-v1" element={<FitnessV1 />} />
        
        <Route path="/health/sleep" element={<Sleep />} />
        <Route path="/health/sleep-v2" element={<Sleep2 />} />
        <Route path="/health/sleep-v1" element={<SleepV1 />} />
        
        <Route path="/health/psychology" element={<Mental />} />
        <Route path="/health/psychology-v2" element={<Psychology2 />} />
        <Route path="/health/mental" element={<Mental />} />
        <Route path="/health/mental-v1" element={<MentalHealthV1 />} />
        
        <Route path="/health/habits" element={<Habits2 />} />
        <Route path="/health/habits-v2" element={<Habits2 />} />
        <Route path="/health/medicine" element={<Medicine2 />} />
        <Route path="/health/medicine-v2" element={<Medicine2 />} />
        <Route path="/health/relationships" element={<Relationships2 />} />
        <Route path="/health/relationships-v2" element={<Relationships2 />} />

        {/* Social V1 Routes (8 pages) */}
        <Route path="/social" element={<SocialFeedV1 />} />
        <Route path="/social/feed" element={<SocialFeedV1 />} />
        <Route path="/social/post/:id" element={<PostDetailV1 />} />
        <Route path="/social/friends" element={<FriendsV1 />} />
        <Route path="/social/messages" element={<MessagesV1 />} />
        <Route path="/social/messages/:userId" element={<MessagesV1 />} />
        <Route path="/social/groups" element={<GroupsV1 />} />
        <Route path="/social/groups/:id" element={<GroupDetailV1 />} />
        <Route path="/social/challenges" element={<ChallengesV1 />} />
        <Route path="/social/leaders" element={<LeadersV1 />} />

        {/* Specialists Routes (V2 only) */}
        <Route path="/specialists" element={<Specialists2 />} />
        <Route path="/specialists/:id" element={<Specialists2 />} />

        {/* Centers Routes (V2 only) */}
        <Route path="/centers" element={<Centers2 />} />
        <Route path="/centers/:id" element={<Centers2 />} />

        {/* Profile Routes (V2 only) */}
        <Route path="/profile" element={<Profile2 />} />
        <Route path="/profile/edit" element={<Profile2 />} />
        <Route path="/profile/settings" element={<Profile2 />} />

        {/* Payments Routes */}
        <Route path="/payments" element={<CheckoutV1 />} />
        <Route path="/payments/checkout" element={<CheckoutV1 />} />
        <Route path="/payments/success" element={<PaymentSuccessV1 />} />
        <Route path="/payments/failed" element={<PaymentFailedV1 />} />

        {/* Other Routes (V2 only) */}
        <Route path="/ai-chat" element={<AIChat2 />} />
        <Route path="/analytics" element={<Analytics2 />} />
        <Route path="/gamification" element={<Gamification2 />} />
        <Route path="/settings" element={<Settings2 />} />
        <Route path="/investor-demo" element={<InvestorDemo />} />

        {/* Web3 Routes (V2 only) */}
        <Route path="/wallet" element={<WalletDashboard />} />
        <Route path="/stake" element={<StakingPage />} />
        <Route path="/token-sale" element={<TokenSalePage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#e4dfd5',
            color: '#2d2418',
            borderRadius: '16px',
            boxShadow: '8px 8px 16px rgba(44,40,34,0.15), -8px -8px 16px rgba(255,255,255,0.6)',
          },
          success: {
            iconTheme: {
              primary: '#5c5243',
              secondary: '#e4dfd5',
            },
          },
          error: {
            iconTheme: {
              primary: '#c41e3a',
              secondary: '#e4dfd5',
            },
          },
        }}
      />
      <AppContent />
    </Router>
  );
}

export default App;
