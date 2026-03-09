# 📖 EthosLife Content Accessibility Policy

**Version:** 1.0
**Date:** March 9, 2026
**Goal:** Maximum accessibility for guests, seamless sync for authenticated users

---

# 🎯 Accessibility Strategy

## Core Principle

> **"Try before you sign, sync everywhere"**

All content and features are accessible to non-authenticated users in **demo/read-only mode**. Authenticated users get **full functionality with data persistence and sync**.

---

# 📊 Content Accessibility Matrix

## Public Pages (No Auth Required)

| Page | Access Level | Guest Features | Auth Features |
|------|-------------|----------------|---------------|
| **/** (Landing) | Full | Everything | Everything + personalized CTA |
| **/features** | Full | Everything | Everything + user stats |
| **/pricing** | Full | Everything | Everything + current plan |
| **/team** | Full | Everything | Everything |
| **/faq** | Full | Everything | Everything + ask question |
| **/blog** | Full | Read all articles | Read + save + comment |
| **/whitepaper** | Full | Read/download | Read + download + annotate |

## Health Modules (Demo Mode for Guests)

| Module | Guest Access | Auth Access |
|--------|-------------|-------------|
| **/dashboard** | Demo data, 3 widgets | Full dashboard, all widgets, real data |
| **/health/nutrition** | View UI, sample logs, AI tips | Full logging, history, personal AI |
| **/health/movement** | View UI, exercise library | Log workouts, track progress |
| **/health/sleep** | View UI, sleep calculator | Track sleep, smart alarm |
| **/health/psychology** | View UI, mood checker | PHQ-9/GAD-7, CBT tools, journal |
| **/health/habits** | View UI, 3 sample habits | Unlimited habits, streaks |
| **/health/medicine** | View UI, medication list | Personal meds, lab results |
| **/health/relationships** | View UI, assessment | Track connections, activities |

## AI Features

| Feature | Guest Access | Auth Access |
|---------|-------------|-------------|
| **AI Chat** | 5 messages/day, generic responses | Unlimited, personalized with health context |
| **AI Insights** | Sample insights | Personal insights based on data |
| **AI Recommendations** | Generic tips | Personalized action plans |

## Marketplace

| Feature | Guest Access | Auth Access |
|---------|-------------|-------------|
| **/specialists** | Browse all, view profiles | Book, message, reviews |
| **/centers** | Browse all, view services | Book, membership purchase |
| **Specialist Profile** | Full view | Contact, book, review |

## Social Features

| Feature | Guest Access | Auth Access |
|---------|-------------|-------------|
| **/social/feed** | Read posts, view comments | Post, like, comment, share |
| **/social/friends** | View public profiles | Add friends, message |
| **/social/groups** | View public groups | Join, participate |

## User Profile

| Feature | Guest Access | Auth Access |
|---------|-------------|-------------|
| **/profile** | N/A (redirect to login) | Full profile, edit, achievements |
| **/settings** | N/A | All settings, preferences |
| **/subscriptions** | View plans | Manage subscription, billing |

## Web3 Features

| Feature | Guest Access | Auth Access |
|---------|-------------|-------------|
| **/wallet** | View token info, price | Connect wallet, view balance |
| **/stake** | View staking info | Stake tokens, claim rewards |
| **/token-sale** | View SAFT info | Invest, track allocation |

---

# 🔧 Implementation Strategy

## Component: AccessControl

```typescript
// frontend/src/components/AccessControl/AccessControl.tsx

import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface AccessControlProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
  demoMode?: boolean;
}

export const AccessControl: React.FC<AccessControlProps> = ({
  children,
  requireAuth = false,
  fallback,
  demoMode = true
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Show demo mode with upgrade prompt
    if (demoMode) {
      return (
        <DemoModeWrapper>
          {children}
          <UpgradePrompt />
        </DemoModeWrapper>
      );
    }
    
    // Redirect to login
    navigate('/login', { state: { from: location.pathname } });
    return null;
  }

  return <>{children}</>;
};

// Demo Mode Wrapper Component
const DemoModeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative">
      {/* Demo Banner */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-300 px-4 py-2 text-center">
        <p className="text-sm text-amber-800 font-medium">
          👋 Демо режим • <button className="underline font-bold" onClick={() => navigate('/register')}>Войти</button> для сохранения данных
        </p>
      </div>
      
      {/* Content with overlay for restricted features */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

// Upgrade Prompt Component
const UpgradePrompt: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 max-w-sm bg-white rounded-2xl shadow-2xl border-2 border-amber-300 p-6 z-50"
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">🎁</div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">
            Создайте аккаунт бесплатно!
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Сохраняйте прогресс, получайте AI-рекомендации и достигайте целей быстрее
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/register')}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2 px-4 rounded-xl hover:shadow-lg transition-all"
            >
              Начать бесплатно
            </button>
            <button
              onClick={() => {/* Close prompt */}}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
```

## Hook: useAccessibility

```typescript
// frontend/src/hooks/useAccessibility.ts

import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';

export const useAccessibility = (featureName: string) => {
  const { isAuthenticated, user } = useAuthStore();
  const [demoData, setDemoData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      if (isAuthenticated) {
        // Fetch real user data from API
        try {
          const response = await fetch(`/api/${featureName}`);
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        // Load demo data from localStorage or mock
        const demo = localStorage.getItem(`demo_${featureName}`);
        if (demo) {
          setDemoData(JSON.parse(demo));
        } else {
          // Load sample demo data
          setDemoData(getDemoDataForFeature(featureName));
        }
      }
      
      setLoading(false);
    };

    loadData();
  }, [featureName, isAuthenticated]);

  return {
    isAuthenticated,
    loading,
    data: isAuthenticated ? userData : demoData,
    isDemo: !isAuthenticated,
    syncToCloud: async (newData: any) => {
      if (isAuthenticated) {
        // Save to backend
        await fetch(`/api/${featureName}`, {
          method: 'POST',
          body: JSON.stringify(newData)
        });
      } else {
        // Save to localStorage
        localStorage.setItem(`demo_${featureName}`, JSON.stringify(newData));
      }
    },
    migrateToAuth: async () => {
      // Called when user registers/logs in
      // Migrate demo data to real user data
      if (demoData) {
        await fetch(`/api/${featureName}/migrate`, {
          method: 'POST',
          body: JSON.stringify({ demoData })
        });
        localStorage.removeItem(`demo_${featureName}`);
      }
    }
  };
};

// Demo data generator
const getDemoDataForFeature = (feature: string) => {
  const demoDataMap: Record<string, any> = {
    nutrition: {
      meals: [
        { id: 1, name: 'Овсянка с ягодами', calories: 350, protein: 12, carbs: 55, fat: 8, time: '08:30' },
        { id: 2, name: 'Салат с курицей', calories: 450, protein: 35, carbs: 25, fat: 18, time: '13:00' },
      ],
      dailyGoal: 2000,
      macros: { protein: 150, carbs: 200, fat: 65 }
    },
    movement: {
      workouts: [
        { id: 1, type: 'Бег', duration: 30, calories: 320, date: '2026-03-08' },
        { id: 2, type: 'Силовая', duration: 45, calories: 280, date: '2026-03-07' },
      ],
      weeklyGoal: 150, // minutes
      activityRings: { move: 450, exercise: 35, stand: 10 }
    },
    sleep: {
      lastNight: {
        duration: 7.5,
        quality: 82,
        deep: 1.8,
        rem: 2.1,
        light: 3.6,
        awake: 0.3
      },
      weekAverage: 7.2,
      goal: 8
    },
    // ... more features
  };

  return demoDataMap[feature] || {};
};
```

## Protected Route Component

```typescript
// frontend/src/components/Routes/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowDemo?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  allowDemo = true
}) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (requireAuth && !isAuthenticated) {
    if (allowDemo) {
      // Render with demo mode
      return React.cloneElement(children as React.ReactElement, {
        demoMode: true
      });
    }
    
    // Redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

## Data Migration on Auth

```typescript
// frontend/src/utils/dataMigration.ts

import { demoDataStore } from '../store/demoDataStore';

export const migrateDemoData = async (userId: string) => {
  const demoData = demoDataStore.getState().data;
  
  if (!demoData || Object.keys(demoData).length === 0) {
    return { success: true, migrated: 0 };
  }

  try {
    const response = await fetch('/api/users/migrate-demo-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        userId,
        demoData
      })
    });

    if (!response.ok) {
      throw new Error('Migration failed');
    }

    const result = await response.json();
    
    // Clear demo data from localStorage
    localStorage.removeItem('demoData');
    
    return {
      success: true,
      migrated: result.migratedCount
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Call this after successful login/registration
export const handlePostAuthMigration = async () => {
  const hasDemoData = localStorage.getItem('demoData') !== null;
  
  if (hasDemoData) {
    // Show migration dialog
    const shouldMigrate = window.confirm(
      'У вас есть данные из демо-режима. Хотите перенести их в аккаунт?'
    );
    
    if (shouldMigrate) {
      const result = await migrateDemoData(/* userId */);
      
      if (result.success) {
        toast.success(`✅ Перенесено ${result.migrated} записей!`);
      } else {
        toast.error('❌ Не удалось перенести данные');
      }
    }
  }
};
```

---

# 🎨 UI/UX for Guest vs Auth Users

## Visual Indicators

### Guest Mode Indicators
```tsx
// Demo data badge
<div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
  <span>👋</span>
  <span>Демо данные</span>
</div>

// Blurred restricted content
<div className="relative">
  <div className="blur-sm select-none pointer-events-none">
    {restrictedContent}
  </div>
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-2xl shadow-xl">
      <p className="font-medium text-gray-900 mb-2">
        🔒 Доступно после регистрации
      </p>
      <button className="text-amber-600 font-bold hover:underline">
        Создать аккаунт бесплатно →
      </button>
    </div>
  </div>
</div>
```

## Call-to-Action Placement

### Top Banner (Sticky)
```tsx
{!isAuthenticated && (
  <div className="sticky top-16 z-40 bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-300 px-4 py-3">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <p className="text-sm text-amber-900 font-medium">
        👋 Вы в демо-режиме • Данные не сохраняются
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/login')}
          className="text-sm font-medium text-amber-900 hover:underline"
        >
          Войти
        </button>
        <button
          onClick={() => navigate('/register')}
          className="bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-amber-600 transition-all shadow-md"
        >
          Начать бесплатно
        </button>
      </div>
    </div>
  </div>
)}
```

### Bottom Floating CTA
```tsx
{!isAuthenticated && showFloatingCTA && (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border-2 border-amber-300 p-5 z-50"
  >
    <div className="flex items-start gap-3">
      <div className="text-3xl">🎁</div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 mb-1">
          Сохраните свой прогресс!
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Создайте аккаунт и данные сохранятся навсегда
        </p>
        <button
          onClick={() => navigate('/register')}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2.5 px-4 rounded-xl hover:shadow-lg transition-all"
        >
          Начать бесплатно
        </button>
      </div>
      <button
        onClick={() => setShowFloatingCTA(false)}
        className="text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>
  </motion.div>
)}
```

---

# 📱 Mobile App Considerations

## Guest Mode in Mobile

### Onboarding Flow
```
1. App Launch
   ↓
2. Value Prop Screens (3 slides)
   ↓
3. "Try as Guest" or "Sign Up" choice
   ↓
4. If Guest → Limited app with demo data
   ↓
5. After 3 sessions → Prompt to sign up
```

### Local Storage Strategy
```typescript
// AsyncStorage keys
const STORAGE_KEYS = {
  DEMO_NUTRITION: '@ethos:demo:nutrition',
  DEMO_MOVEMENT: '@ethos:demo:movement',
  DEMO_SLEEP: '@ethos:demo:sleep',
  DEMO_USER: '@ethos:demo:user',
  MIGRATION_PENDING: '@ethos:migration:pending'
};

// Auto-migrate on auth
const migrateOnAuth = async (userId: string) => {
  const demoKeys = Object.values(STORAGE_KEYS).filter(
    key => key.startsWith('@ethos:demo:')
  );
  
  for (const key of demoKeys) {
    const data = await AsyncStorage.getItem(key);
    if (data) {
      await API.migrate(userId, JSON.parse(data));
      await AsyncStorage.removeItem(key);
    }
  }
};
```

---

# 📊 Analytics & Tracking

## Guest Behavior Tracking

```typescript
// Track guest interactions
const trackGuestBehavior = (event: string, data: any) => {
  analytics.track(event, {
    userId: `guest_${sessionId}`,
    isGuest: true,
    ...data
  });
};

// Key events to track
const GUEST_EVENTS = {
  DEMO_STARTED: 'demo_started',
  DEMO_FEATURE_VIEWED: 'demo_feature_viewed',
  DEMO_ACTION_ATTEMPTED: 'demo_action_attempted',
  UPGRADE_CTA_CLICKED: 'upgrade_cta_clicked',
  UPGRADE_CTA_DISMISSED: 'upgrade_cta_dismissed',
  LOGIN_INITIATED: 'login_initiated',
  REGISTRATION_INITIATED: 'registration_initiated'
};
```

## Conversion Funnel

```
Guest → Demo User → Registered → Activated → Paying
  ↓        ↓           ↓            ↓           ↓
100%    60%        25%         15%        5%

Track:
- Time in demo mode
- Features explored
- Upgrade CTA interactions
- Drop-off points
```

---

# 🔒 Security Considerations

## Guest Data Isolation

```typescript
// Never allow guests to:
- Access other users' data
- Modify database records
- Make API calls that change state
- Access premium features without limits

// Always:
- Validate auth status on backend
- Rate limit guest API calls
- Sanitize all guest input
- Use separate demo endpoints
```

## API Rate Limiting

```javascript
// Backend rate limiting for guests
const guestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: {
    authenticated: 1000,
    guest: 100
  },
  keyGenerator: (req) => {
    return req.user?.id || `guest_${req.ip}`;
  }
});
```

---

# ✅ Implementation Checklist

## Frontend
- [ ] Create AccessControl component
- [ ] Create useAccessibility hook
- [ ] Create ProtectedRoute component
- [ ] Create DemoModeWrapper component
- [ ] Create UpgradePrompt component
- [ ] Add demo data to all health modules
- [ ] Add visual indicators for guest mode
- [ ] Add sticky top banner for guests
- [ ] Add floating bottom CTA for guests
- [ ] Implement data migration on auth

## Backend
- [ ] Create demo data endpoints
- [ ] Add auth validation middleware
- [ ] Implement rate limiting for guests
- [ ] Create migration endpoint
- [ ] Add guest session tracking
- [ ] Secure all authenticated routes

## Analytics
- [ ] Track guest behavior events
- [ ] Set up conversion funnel
- [ ] A/B test upgrade prompts
- [ ] Monitor guest → auth conversion rate

## Content
- [ ] Write demo data for all modules
- [ ] Create sample AI responses
- [ ] Write upgrade prompt copy
- [ ] Create onboarding emails for new users

---

**Status:** Ready for implementation
**Priority:** Critical (Week 1)
**Owner:** Frontend Team
