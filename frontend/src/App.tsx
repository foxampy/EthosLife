import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard2 from './pages/Dashboard/Dashboard2';

// Social V1 Pages
import SocialFeedV1 from './pages/Social/V1/SocialFeedV1';
import PostDetailV1 from './pages/Social/V1/PostDetailV1';
import FriendsV1 from './pages/Social/V1/FriendsV1';
import MessagesV1 from './pages/Social/V1/MessagesV1';
import GroupsV1 from './pages/Social/V1/GroupsV1';
import GroupDetailV1 from './pages/Social/V1/GroupDetailV1';
import ChallengesV1 from './pages/Social/V1/ChallengesV1';
import LeadersV1 from './pages/Social/V1/LeadersV1';

// Specialists Pages
import Specialists2 from './pages/Specialists/Specialists2';

// Centers Pages
import Centers2 from './pages/Centers/Centers2';

// Profile Pages
import Profile2 from './pages/Profile/Profile2';

// Health Modules V2
import Nutrition2 from './pages/Health/Nutrition2';
import Movement2 from './pages/Health/Movement2';
import Sleep2 from './pages/Health/Sleep2';
import Psychology2 from './pages/Health/Psychology2';
import Habits2 from './pages/Health/Habits2';
import Medicine2 from './pages/Health/Medicine2';
import Relationships2 from './pages/Health/Relationships2';

// Other Pages
import AIChat2 from './pages/AI/AIChat2';
import Analytics2 from './pages/Analytics/Analytics2';
import Gamification2 from './pages/Gamification/Gamification2';
import Settings2 from './pages/Settings/Settings2';
import InvestorDemo from './pages/InvestorDemo';

// Web3 Pages
import { WalletDashboard, StakingPage, TokenSalePage } from './pages/Web3';

// Landing Pages
import LandingV1 from './pages/Landing/LandingV1';
import FeaturesV1 from './pages/Landing/FeaturesV1';
import PricingV1 from './pages/Landing/PricingV1';
import TokenomicsV1 from './pages/Landing/TokenomicsV1';
import RoadmapV1 from './pages/Landing/RoadmapV1';

// Payments Pages
import CheckoutV1 from './pages/Payments/V1/CheckoutV1';
import PaymentSuccessV1 from './pages/Payments/V1/PaymentSuccessV1';
import PaymentFailedV1 from './pages/Payments/V1/PaymentFailedV1';

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
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<LandingV1 />} />
        <Route path="/dashboard" element={<Dashboard2 />} />
        <Route path="/dashboard-v2" element={<Dashboard2 />} />

        {/* Landing Pages */}
        <Route path="/landing" element={<LandingV1 />} />
        <Route path="/features" element={<FeaturesV1 />} />
        <Route path="/pricing" element={<PricingV1 />} />
        <Route path="/tokenomics" element={<TokenomicsV1 />} />
        <Route path="/roadmap" element={<RoadmapV1 />} />

        {/* Health Modules V2 */}
        <Route path="/health/nutrition" element={<Nutrition2 />} />
        <Route path="/health/movement" element={<Movement2 />} />
        <Route path="/health/sleep" element={<Sleep2 />} />
        <Route path="/health/psychology" element={<Psychology2 />} />
        <Route path="/health/habits" element={<Habits2 />} />
        <Route path="/health/medicine" element={<Medicine2 />} />
        <Route path="/health/relationships" element={<Relationships2 />} />

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

        {/* Specialists Routes */}
        <Route path="/specialists" element={<Specialists2 />} />
        <Route path="/specialists/:id" element={<Specialists2 />} />

        {/* Centers Routes */}
        <Route path="/centers" element={<Centers2 />} />
        <Route path="/centers/:id" element={<Centers2 />} />

        {/* Profile Routes */}
        <Route path="/profile" element={<Profile2 />} />
        <Route path="/profile/edit" element={<Profile2 />} />
        <Route path="/profile/settings" element={<Profile2 />} />

        {/* Payments Routes */}
        <Route path="/payments" element={<CheckoutV1 />} />
        <Route path="/payments/checkout" element={<CheckoutV1 />} />
        <Route path="/payments/success" element={<PaymentSuccessV1 />} />
        <Route path="/payments/failed" element={<PaymentFailedV1 />} />

        {/* Other Routes */}
        <Route path="/ai-chat" element={<AIChat2 />} />
        <Route path="/analytics" element={<Analytics2 />} />
        <Route path="/gamification" element={<Gamification2 />} />
        <Route path="/settings" element={<Settings2 />} />
        <Route path="/investor-demo" element={<InvestorDemo />} />

        {/* Web3 Routes */}
        <Route path="/wallet" element={<WalletDashboard />} />
        <Route path="/stake" element={<StakingPage />} />
        <Route path="/token-sale" element={<TokenSalePage />} />
      </Routes>
    </Router>
  );
}

export default App;
