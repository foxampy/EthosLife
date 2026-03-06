# Dashboard v2 Component

A comprehensive, premium health dashboard with 12+ interactive widgets, real-time data visualization, and a beautiful neumorphic design system.

## Features

### Layout
- **Sticky Header** - Date, time, notifications, and user profile
- **3-Column Grid** - Responsive layout (1 col mobile, 2 col tablet, 3 col desktop)
- **Left Sidebar** - Health score + Daily checklist
- **Center Column** - Main widgets grid
- **Right Sidebar** - AI insights + Upcoming events

### Widgets Implemented

#### 1. Health Score Widget (Hero)
- Circular overall health score (0-100) with animated progress ring
- Breakdown by 7 modules (mini bars)
- Trend indicator (up/down vs last week)
- Expandable view with detailed breakdown

#### 2. Daily Checklist Widget
- Morning routine checkboxes
- Medication reminders
- Water intake quick add
- Sleep log reminder
- Mood check-in prompt
- Progress bar for completion

#### 3. Activity Rings Widget (Apple Watch style)
- Move/Exercise/Stand rings with progress animation
- Steps counter with goal
- Calories burned
- Active minutes
- Expandable view

#### 4. Nutrition Quick View
- Calories consumed/remaining (circular progress)
- Macro bars (protein/carbs/fats)
- Last meal logged display
- "+ Log Meal" button

#### 5. Sleep Summary Widget
- Last night sleep score (circular progress)
- Bed time / Wake time
- Sleep duration
- Quality indicator with color coding
- Sleep debt warning (if any)

#### 6. Mood Tracker Widget
- Today's mood emoji selector (1-5)
- 7-day mood sparkline chart
- Stress level indicator

#### 7. Habits Streak Widget
- Top 3 habits with streaks
- "Don't break the chain" visualization
- Today's completion status
- Quick check buttons

#### 8. Upcoming Events Widget
- Medication schedule (next doses)
- Doctor appointments
- Workout plans
- Social commitments
- Completion checkboxes

#### 9. AI Insights Feed
- Personalized health tips
- Pattern discoveries
- Goal progress updates
- "Did you know?" facts
- Actionable recommendations

#### 10. Social Activity Widget
- Recent friend activities
- Group challenges progress
- Community highlights

#### 11. Body Metrics Widget
- Weight trend sparkline
- BMI indicator with category
- Measurements tracking
- Goal progress

#### 12. Gamification/Achievements Widget
- Recent badges earned with rarity indicators
- Progress to next level with XP bar
- Daily/weekly challenges
- Leaderboard position

#### 13. Water Tracker (Bonus)
- Quick add buttons (250ml, 500ml, 750ml)
- Visual progress bar
- Current intake display

## Data Structure

```typescript
interface DashboardState {
  healthScore: {
    overall: number;
    breakdown: Record<string, number>;
    trend: 'up' | 'down' | 'stable';
  };
  todayProgress: {
    checklist: ChecklistItem[];
    completionRate: number;
  };
  widgets: {
    activity: ActivityData;
    nutrition: NutritionSummary;
    sleep: SleepSummary;
    mood: MoodData;
    habits: HabitStreak[];
    events: UpcomingEvent[];
  };
  aiInsights: AIInsight[];
  social: {
    activities: SocialActivity[];
    challenges: Challenge[];
    unreadMessages: number;
  };
  bodyMetrics: BodyMetrics;
  gamification: GamificationData;
}
```

## Design System

### Colors
- **Bone** (`#e4dfd5`) - Primary background
- **Bone Dark** (`#c2b8a9`) - Secondary background
- **Ink** (`#2d2418`) - Primary text
- **Ink Light** (`#4a3e32`) - Secondary text
- **Sand** (`#dcd3c6`) - Page background
- **Clay** (`#8c7a6b`) - Tertiary text
- **Stone** (`#5c5243`) - Accent color

### Shadows (Neumorphic)
- **Outer Shadow**: `8px 8px 16px #a8a093, -8px -8px 16px #ffffff`
- **Inner Shadow**: `inset 4px 4px 8px #a8a093, inset -4px -4px 8px #ffffff`
- **Deep Bay**: `inset 12px 12px 24px #b8ae9f, inset -12px -12px 24px #e8decf`

## Interactions

- **Checklist Items** - Click to toggle completion
- **Water Tracker** - Click amounts to add water
- **Mood Selector** - Click emoji to set mood
- **Expandable Widgets** - Click expand icon for more details
- **Real-time Updates** - Simulated live data updates every 5 seconds

## Usage

```tsx
import Dashboard2 from './pages/Dashboard/Dashboard2';

function App() {
  return <Dashboard2 />;
}
```

## File Structure

```
frontend/src/
├── pages/
│   └── Dashboard/
│       ├── Dashboard2.tsx      # Main component
│       ├── Dashboard2.css      # Component styles
│       └── index.ts            # Exports
├── types/
│   └── dashboard.ts            # TypeScript interfaces
├── utils/
│   └── dashboard.ts            # Mock data & utilities
├── App.tsx
├── main.tsx
└── index.css
```

## Dependencies

- React 18
- Lucide React (icons)
- Tailwind CSS (styling)
- Vite (build tool)

## Running Locally

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at `http://localhost:3000`
