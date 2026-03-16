# EthosLife - Module Interconnections Guide
## Complete System Architecture & Relationships

This document describes how all modules, pages, and functions interconnect in the EthosLife platform.

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ETHOSLIFE PLATFORM                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   LANDING   │◄──►│    AUTH     │◄──►│  DASHBOARD  │◄──►│   HEALTH    │  │
│  │    PAGES    │    │   (Login)   │    │   (Home)    │    │   MODULES   │  │
│  └─────────────┘    └─────────────┘    └──────┬──────┘    └──────┬──────┘  │
│         ▲                                       │                  │        │
│         │                                       ▼                  ▼        │
│         │                              ┌─────────────┐    ┌─────────────┐  │
│         │                              │  ANALYTICS  │◄──►│    SOCIAL   │  │
│         │                              │   & AI      │    │             │  │
│         │                              └─────────────┘    └─────────────┘  │
│         │                                                                      │
│         └───────────────────────────────────────────────────────────────────┘
│                                                                              │
│  LEGEND: ───► Direct navigation    ─ ─ ► Contextual link    ◄──► Bidirectional │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Navigation Flow Map

### 1. Entry Points

| Entry Point | Flow | Destination |
|-------------|------|-------------|
| `/` | Landing Page | `/features`, `/pricing`, `/login` |
| `/login` | Authentication | `/dashboard` (success) or `/register` |
| `/register` | Sign Up | `/dashboard` (success) or `/login` |

### 2. Main Navigation Structure

```
Dashboard (/
    ├── Health/
    │   ├── Nutrition
    │   ├── Movement
    │   ├── Sleep
    │   ├── Psychology
    │   ├── Medicine
    │   ├── Relationships
    │   └── Habits
    ├── Social/
    │   ├── Feed
    │   ├── Messages
    │   ├── Groups
    │   └── Challenges
    ├── AI Chat
    ├── Analytics
    ├── Gamification
    ├── Specialists
    ├── Centers
    ├── Wallet
    ├── Profile
    └── Settings
```

---

## 🧩 Module Interconnections

### 2.1 Health Modules Integration

#### Cross-Module Data Flow

```
Nutrition ◄──► Movement
     │          │
     ▼          ▼
    Sleep ◄──► Psychology
     │          │
     ▼          ▼
  Medicine ◄──► Relationships
     │
     ▼
   Habits
```

#### Specific Connections

| Source Module | Target Module | Data Shared | Use Case |
|---------------|---------------|-------------|----------|
| Nutrition | Sleep | Meal timing, caffeine intake | "Late meals affect your sleep quality" |
| Nutrition | Movement | Calorie intake, macros | "Adjust pre-workout nutrition" |
| Movement | Sleep | Exercise intensity, timing | "Evening workouts may delay sleep" |
| Movement | Medicine | Heart rate, recovery | "Check medication timing with exercise" |
| Sleep | Psychology | Sleep quality, duration | "Poor sleep increases stress levels" |
| Psychology | Habits | Mood, stress triggers | "Build habits around stress management" |
| Medicine | Nutrition | Supplements, interactions | "Vitamin D absorption with meals" |
| Relationships | Psychology | Social interactions | "Quality time improves mental health" |

### 2.2 Dashboard Integration

The Dashboard aggregates data from ALL modules:

```typescript
interface DashboardData {
  // Nutrition
  calories: { consumed: number; target: number };
  macros: { protein: number; carbs: number; fats: number };
  
  // Movement
  steps: number;
  activeMinutes: number;
  workouts: WorkoutSummary[];
  
  // Sleep
  sleepDuration: number;
  sleepQuality: number;
  
  // Psychology
  moodTrend: MoodEntry[];
  stressLevel: number;
  
  // Medicine
  medications: MedicationReminder[];
  adherence: number;
  
  // Relationships
  socialActivity: SocialMetric[];
  
  // Habits
  streaks: StreakData[];
  
  // Gamification
  level: number;
  xp: number;
  tokens: number;
}
```

### 2.3 AI Coach Connections

AI Coach has access to all modules for personalized recommendations:

```
User Query → AI Engine → Data Analysis → Cross-Module Insights → Response
    │              │              │                  │              │
    ▼              ▼              ▼                  ▼              ▼
"How do I     Analyze     Check Sleep      "Based on your    Personalized
improve my    all 7       + Nutrition      sleep data and    nutrition and
sleep?"       modules     + Movement       meal timing..."   sleep plan
```

### 2.4 Social Module Connections

| Feature | Connected Modules | Description |
|---------|-------------------|-------------|
| Feed Posts | Health, Gamification | Share achievements, progress |
| Challenges | Health, Gamification | Group health challenges |
| Groups | Health, Specialists | Support groups by condition |
| Messages | Health, AI | Share data with doctors |

---

## 🎮 Gamification Interconnections

### XP Sources by Module

| Module | Action | XP Reward |
|--------|--------|-----------|
| Nutrition | Log meal | 10 XP |
| Nutrition | Meet calorie goal | 25 XP |
| Movement | Complete workout | 50 XP |
| Movement | Reach step goal | 20 XP |
| Sleep | Log 8 hours | 15 XP |
| Psychology | Meditation session | 15 XP |
| Medicine | Take medication on time | 20 XP |
| Habits | Daily check-in | 10 XP |
| Social | Post to feed | 5 XP |

### Badge Dependencies

```
Health Starter (Complete profile)
    ↓
Nutrition Novice (Log 7 days)
    ↓
Fitness Enthusiast (10 workouts)
    ↓
Sleep Master (30 days 8hrs)
    ↓
Wellness Warrior (All modules 30 days)
    ↓
EthosLife Champion (6 months streak)
```

---

## 💰 Wallet & Token Connections

### Token Earning Sources

| Source Module | Action | Token Reward |
|---------------|--------|--------------|
| All Health Modules | Daily goals | 1-10 UNITY |
| Gamification | Level up | 50-500 UNITY |
| Social | Refer friend | 100 UNITY |
| Challenges | Win challenge | 200-1000 UNITY |

### Token Spending

| Target Module | Feature | Token Cost |
|---------------|---------|------------|
| AI Coach | Premium analysis | 10 UNITY |
| Specialists | Consultation discount | 50 UNITY |
| Gamification | Boost power-ups | 25 UNITY |
| Shop | Premium items | 100-1000 UNITY |

---

## 🔐 Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │────►│    Login    │────►│  Dashboard  │
│    Page     │     │             │     │   (Auth)    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │   Register  │
                    │  (New User) │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │    Email    │
                    │ Verification│
                    └─────────────┘
```

### Protected vs Public Routes

| Route Type | Examples | Access |
|------------|----------|--------|
| Public | `/`, `/login`, `/register`, `/features` | Anyone |
| Protected | `/dashboard`, `/health/*`, `/social` | Authenticated only |
| Semi-Public | `/profile/:username` | View public, edit own only |

---

## 📱 Page-to-Page Navigation

### Quick Actions Matrix

| From Page | Quick Links To | Context |
|-----------|----------------|---------|
| Dashboard | Health modules, AI Chat, Add Entry | Based on incomplete goals |
| Nutrition | Food diary, Meal plan, Recipes | Today's meals |
| Movement | Start workout, Exercise library | Scheduled workout |
| Sleep | Sleep sounds, Smart alarm | Bedtime approaching |
| AI Chat | Relevant module pages | Context-aware suggestions |

### Contextual Navigation

```typescript
// Example: From Dashboard to specific health module
if (dailyGoals.nutrition < 50%) {
  quickAction = {
    label: "Log your lunch",
    target: "/health/nutrition",
    priority: "high"
  };
}
```

---

## 🔄 Data Synchronization

### Real-time Updates

| Feature | Update Frequency | Source |
|---------|------------------|--------|
| Steps | Every 15 min | Wearable API |
| Heart Rate | Real-time | Watch/Tracker |
| Notifications | Real-time | WebSocket |
| Chat Messages | Real-time | WebSocket |
| Leaderboard | Every 5 min | Database poll |

### Batch Sync

| Feature | Sync Frequency | Trigger |
|---------|----------------|---------|
| Sleep data | Morning | User opens app |
| Meal history | Hourly | Background sync |
| Medication log | Daily | Nighttime batch |
| Analytics | Weekly | Sunday night |

---

## 🎯 User Journey Maps

### Journey 1: New User Onboarding

```
1. Landing Page
   └──► Click "Get Started"
       └──► Register
           └──► Verify Email
               └──► Complete Profile (health goals)
                   └──► Dashboard (tutorial)
                       └──► Explore first module
                           └──► Set first goal
                               └──► Daily check-in reminder set
```

### Journey 2: Daily Active User

```
1. Morning: Dashboard check
   ├──► Log weight (Habits)
   ├──► Review AI suggestions
   └──► Check daily goals
       
2. Day: Health tracking
   ├──► Log breakfast (Nutrition)
   ├──► Track workout (Movement)
   └──► Update mood (Psychology)
       
3. Evening: Social & Review
   ├──► Post achievement (Social)
   ├──► Check leaderboard (Gamification)
   └──► Plan tomorrow
```

### Journey 3: Specialist Consultation

```
1. User feels unwell
   └──► Open Medicine module
       └──► Log symptoms
           └──► AI suggests specialist
               └──► Book appointment
                   └──► Video consultation
                       └──► Follow-up plan
                           └──► Track recovery
```

---

## 🏗️ Technical Implementation

### State Management Flow

```
User Action → Local State → API Call → Server → Database
    │              │           │          │         │
    │              │           │          │         ▼
    │              │           │          │    Update records
    │              │           │          │         │
    │              │           │          ▼         │
    │              │           │    Broadcast change│
    │              │           │         │          │
    │              │           ▼         ▼          │
    │              │      Other clients notified    │
    │              │           │                    │
    │              ▼           ▼                    │
    │         Update UI    Real-time update         │
    │              │           │                    │
    └──────────────┴───────────┴────────────────────┘
```

### Event System

| Event | Source | Listeners | Action |
|-------|--------|-----------|--------|
| `goal.completed` | Any module | Dashboard, Gamification | Update progress, award XP |
| `achievement.unlocked` | Gamification | Social, Profile | Show badge, share option |
| `streak.broken` | Habits | AI, Notifications | Send encouragement |
| `health.alert` | AI/Medicine | Notifications, Email | Alert user/doctor |

---

## 📊 Analytics Integration

### Tracked Events

| Category | Events | Destination |
|----------|--------|-------------|
| Navigation | Page views, clicks | Google Analytics |
| Health | Data entries, goals | Internal Analytics |
| Engagement | Session duration, retention | Mixpanel |
| Business | Conversions, purchases | Stripe Dashboard |

### Cross-Module Analytics

```sql
-- Example: User engagement across modules
SELECT 
  user_id,
  COUNT(DISTINCT module) as modules_used,
  SUM(xp_earned) as total_xp,
  AVG(session_duration) as avg_session
FROM user_activity
WHERE date >= NOW() - INTERVAL '30 days'
GROUP BY user_id;
```

---

## 🔍 SEO & Deep Linking

### Public Pages (Indexed)

- `/` - Landing page
- `/features` - Feature showcase
- `/pricing` - Pricing plans
- `/blog` - Blog articles
- `/whitepaper` - Documentation

### App Pages (Auth Required, No Index)

- `/dashboard/*`
- `/health/*`
- `/social/*`
- `/profile/*`

### Deep Links

```
ethoslife://health/nutrition
ethoslife://social/profile/username
ethoslife://wallet/send?to=address&amount=100
```

---

## 🚀 Future Interconnections

### Planned Integrations

| External Service | Module | Data Type |
|------------------|--------|-----------|
| Apple Health | All Health | Biometric data |
| Google Fit | All Health | Activity data |
| Epic MyChart | Medicine | Medical records |
| 23andMe | Health | Genetic data |
| Insurance APIs | Wallet | Reward redemption |
| Pharmacy APIs | Medicine | Prescription refills |

### AI Evolution

| Phase | Capability | Modules Connected |
|-------|------------|-------------------|
| V1 | Reactive chat | All (read-only) |
| V2 | Proactive suggestions | All (read-write) |
| V3 | Predictive health | All + External data |
| V4 | Autonomous coaching | All + IoT devices |

---

## 📝 Implementation Checklist

### Navigation
- [ ] Implement AppRoutes.tsx
- [ ] Add route guards (auth check)
- [ ] Add breadcrumbs
- [ ] Add back button handling
- [ ] Deep linking support

### Module Integration
- [ ] Dashboard data aggregation
- [ ] Cross-module event system
- [ ] AI data access layer
- [ ] Gamification XP tracking
- [ ] Wallet transaction hooks

### Data Flow
- [ ] Real-time sync (WebSocket)
- [ ] Offline support (PWA)
- [ ] Data validation layer
- [ ] Error handling strategy
- [ ] Analytics tracking

---

**Last Updated:** March 2026  
**Version:** 3.0
