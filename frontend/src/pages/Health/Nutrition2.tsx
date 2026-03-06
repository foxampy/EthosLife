import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Droplets,
  Flame,
  TrendingUp,
  Plus,
  Search,
  Camera,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Target,
  AlertCircle,
  Check,
  X,
  Barcode,
  ChevronDown,
  MoreHorizontal,
  Apple,
  Coffee,
  Moon,
  Cookie,
  Zap,
  Award,
  Activity,
  ArrowRight,
  Filter,
  Heart,
  Timer,
  ChefHat,
} from 'lucide-react';

// ==================== Types ====================

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  time: string;
  image?: string;
}

interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: FoodItem[];
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  fiber: number;
  sugar: number;
}

interface ConsumedData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  fiber: number;
  sugar: number;
}

interface Recipe {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  isFavorite: boolean;
}

// ==================== Mock Data ====================

const WEEKLY_DATA = [
  { day: 'Mon', calories: 1850, goal: 2200 },
  { day: 'Tue', calories: 2100, goal: 2200 },
  { day: 'Wed', calories: 1950, goal: 2200 },
  { day: 'Thu', calories: 2300, goal: 2200 },
  { day: 'Fri', calories: 2050, goal: 2200 },
  { day: 'Sat', calories: 2400, goal: 2200 },
  { day: 'Sun', calories: 1820, goal: 2200 },
];

const WEIGHT_TREND = [
  { date: 'Jan 1', weight: 78.5 },
  { date: 'Jan 8', weight: 78.1 },
  { date: 'Jan 15', weight: 77.8 },
  { date: 'Jan 22', weight: 77.4 },
  { date: 'Jan 29', weight: 77.0 },
  { date: 'Feb 5', weight: 76.8 },
  { date: 'Feb 12', weight: 76.5 },
];

const RECENT_FOODS = [
  { id: '1', name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
  { id: '2', name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0 },
  { id: '3', name: 'Avocado (1/2)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, sugar: 0.7 },
  { id: '4', name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 6, fat: 0, fiber: 0, sugar: 5 },
  { id: '5', name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2 },
];

const RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Protein Power Bowl',
    calories: 485,
    protein: 35,
    carbs: 42,
    fat: 18,
    time: '25 min',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    category: 'lunch',
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Overnight Oats',
    calories: 320,
    protein: 12,
    carbs: 48,
    fat: 8,
    time: '5 min',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400',
    category: 'breakfast',
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Grilled Salmon',
    calories: 412,
    protein: 38,
    carbs: 12,
    fat: 22,
    time: '35 min',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    category: 'dinner',
    isFavorite: true,
  },
  {
    id: '4',
    name: 'Energy Bites',
    calories: 156,
    protein: 4,
    carbs: 18,
    fat: 8,
    time: '15 min',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    category: 'snack',
    isFavorite: false,
  },
  {
    id: '5',
    name: 'Veggie Omelette',
    calories: 280,
    protein: 18,
    carbs: 4,
    fat: 20,
    time: '10 min',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1482049016gy-31b6c26e1b8a?w=400',
    category: 'breakfast',
    isFavorite: false,
  },
  {
    id: '6',
    name: 'Quinoa Buddha Bowl',
    calories: 425,
    protein: 15,
    carbs: 52,
    fat: 16,
    time: '30 min',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    category: 'lunch',
    isFavorite: true,
  },
];

const AI_INSIGHTS = [
  {
    id: '1',
    type: 'warning',
    title: 'Low on Protein',
    message: 'You need 45g more protein to hit your daily goal. Consider adding Greek yogurt or a protein shake.',
    icon: AlertCircle,
    color: 'amber',
  },
  {
    id: '2',
    type: 'tip',
    title: 'Meal Timing',
    message: 'Your energy dips at 3 PM. Try having a healthy snack at 2:30 PM to maintain stable blood sugar.',
    icon: Clock,
    color: 'blue',
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Fiber Champion',
    message: "You've exceeded your fiber goal! Great job supporting your gut health and digestion.",
    icon: Award,
    color: 'emerald',
  },
  {
    id: '4',
    type: 'suggestion',
    title: 'Hydration Boost',
    message: 'Drink 500ml more water in the next 2 hours to reach your hydration goal.',
    icon: Droplets,
    color: 'cyan',
  },
];

// ==================== Components ====================

const CircularProgress: React.FC<{
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label: string;
  sublabel?: string;
}> = ({ value, max, size = 200, strokeWidth = 12, color = '#10b981', label, sublabel }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(value / max, 1);
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-200 dark:text-slate-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
        {sublabel && <span className="text-xs text-slate-400 dark:text-slate-500">{sublabel}</span>}
      </div>
    </div>
  );
};

const MacroBar: React.FC<{
  label: string;
  value: number;
  max: number;
  color: string;
  unit: string;
  icon: React.ElementType;
}> = ({ label, value, max, color, unit, icon: Icon }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${color}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        </div>
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {value}g <span className="text-slate-400">/ {max}g</span>
        </span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

const WaterTracker: React.FC<{
  current: number;
  goal: number;
  onAdd: (amount: number) => void;
}> = ({ current, goal, onAdd }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const glasses = Math.floor(current / 250);
  const goalGlasses = Math.floor(goal / 250);

  return (
    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5" />
          <span className="font-semibold">Water Intake</span>
        </div>
        <span className="text-2xl font-bold">{glasses}/{goalGlasses}</span>
      </div>

      <div className="relative h-24 bg-white/20 rounded-xl overflow-hidden mb-4">
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-300 to-cyan-200"
          initial={{ height: 0 }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PC9zdmc+')] opacity-50" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold drop-shadow-lg">{current}ml</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onAdd(250)}
          className="flex-1 bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          +250ml
        </button>
        <button
          onClick={() => onAdd(500)}
          className="flex-1 bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          +500ml
        </button>
      </div>
    </div>
  );
};

const QuickStatCard: React.FC<{
  label: string;
  value: number;
  unit: string;
  max?: number;
  icon: React.ElementType;
  color: string;
}> = ({ label, value, unit, max, icon: Icon, color }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      {max && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {Math.round((value / max) * 100)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-slate-900 dark:text-white">
      {value}
      <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">{unit}</span>
    </div>
    <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
  </div>
);

const MealSection: React.FC<{
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: FoodItem[];
  onAddFood: (type: string) => void;
  onRemoveItem: (id: string) => void;
}> = ({ type, items, onAddFood, onRemoveItem }) => {
  const icons = {
    breakfast: Coffee,
    lunch: Sun,
    dinner: Moon,
    snack: Cookie,
  };
  const colors = {
    breakfast: 'bg-amber-500',
    lunch: 'bg-orange-500',
    dinner: 'bg-indigo-500',
    snack: 'bg-pink-500',
  };
  const labels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snacks',
  };

  const Icon = icons[type];
  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${colors[type]}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{labels[type]}</h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {items.length} items • {totalCalories} cal
            </span>
          </div>
        </div>
        <button
          onClick={() => onAddFood(type)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center"
          >
            <p className="text-slate-400 dark:text-slate-500">No items yet</p>
            <button
              onClick={() => onAddFood(type)}
              className="mt-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline"
            >
              + Add Food
            </button>
          </motion.div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
                className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">{item.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{item.time}</span>
                      <span>•</span>
                      <span>P: {item.protein}g</span>
                      <span>C: {item.carbs}g</span>
                      <span>F: {item.fat}g</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900 dark:text-white">{item.calories} cal</span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Sun icon component for lunch
const Sun: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="5" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const FoodEntryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  mealType: string;
  onAdd: (food: FoodItem) => void;
}> = ({ isOpen, onClose, mealType, onAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quickAdd, setQuickAdd] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const filteredFoods = RECENT_FOODS.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (selectedFood) {
      onAdd({
        ...selectedFood,
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } else if (quickAdd.name && quickAdd.calories) {
      onAdd({
        id: Date.now().toString(),
        name: quickAdd.name,
        calories: parseInt(quickAdd.calories) || 0,
        protein: parseInt(quickAdd.protein) || 0,
        carbs: parseInt(quickAdd.carbs) || 0,
        fat: parseInt(quickAdd.fat) || 0,
        fiber: 0,
        sugar: 0,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
    onClose();
    setSearchQuery('');
    setSelectedFood(null);
    setQuickAdd({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
              Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <Barcode className="w-4 h-4" />
                Scan Barcode
              </button>
              <button className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <Camera className="w-4 h-4" />
                AI Photo
              </button>
            </div>

            {/* Recent Foods */}
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Recent Foods</h4>
              <div className="space-y-2">
                {filteredFoods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between ${
                      selectedFood?.id === food.id
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{food.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                      </div>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{food.calories} cal</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Add */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Quick Add</h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Food name"
                  value={quickAdd.name}
                  onChange={(e) => setQuickAdd({ ...quickAdd, name: e.target.value })}
                  className="col-span-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Calories"
                  value={quickAdd.calories}
                  onChange={(e) => setQuickAdd({ ...quickAdd, calories: e.target.value })}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={quickAdd.protein}
                  onChange={(e) => setQuickAdd({ ...quickAdd, protein: e.target.value })}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={quickAdd.carbs}
                  onChange={(e) => setQuickAdd({ ...quickAdd, carbs: e.target.value })}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Fat (g)"
                  value={quickAdd.fat}
                  onChange={(e) => setQuickAdd({ ...quickAdd, fat: e.target.value })}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!selectedFood && !quickAdd.name}
              className="flex-1 py-3 bg-emerald-600 rounded-xl font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Food
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow min-w-[260px]"
  >
    <div className="relative h-32 bg-slate-200 dark:bg-slate-700">
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://placehold.co/400x200/e2e8f0/64748b?text=${encodeURIComponent(recipe.name)}`;
        }}
      />
      <button className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-slate-800/90 rounded-lg backdrop-blur-sm">
        <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
      </button>
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-emerald-600 text-white text-xs font-medium rounded-lg">
        {recipe.difficulty}
      </div>
    </div>
    <div className="p-4">
      <h4 className="font-semibold text-slate-900 dark:text-white mb-1 truncate">{recipe.name}</h4>
      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {recipe.time}
        </span>
        <span className="flex items-center gap-1">
          <Flame className="w-3 h-3" />
          {recipe.calories} cal
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg font-medium">
          P: {recipe.protein}g
        </span>
        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg font-medium">
          C: {recipe.carbs}g
        </span>
        <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg font-medium">
          F: {recipe.fat}g
        </span>
      </div>
    </div>
  </motion.div>
);

// ==================== Main Component ====================

export default function Nutrition2() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<string>('');
  const [recipeFilter, setRecipeFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('all');

  const [goals, setGoals] = useState<NutritionGoals>({
    calories: 2200,
    protein: 150,
    carbs: 275,
    fat: 73,
    water: 3000,
    fiber: 30,
    sugar: 50,
  });

  const [consumed, setConsumed] = useState<ConsumedData>({
    calories: 1450,
    protein: 85,
    carbs: 162,
    fat: 48,
    water: 1750,
    fiber: 22,
    sugar: 32,
  });

  const [meals, setMeals] = useState<Meal[]>([
    {
      type: 'breakfast',
      items: [
        {
          id: 'b1',
          name: 'Oatmeal with Berries',
          calories: 320,
          protein: 12,
          carbs: 54,
          fat: 6,
          fiber: 8,
          sugar: 12,
          time: '08:30',
        },
        {
          id: 'b2',
          name: 'Greek Yogurt',
          calories: 100,
          protein: 10,
          carbs: 6,
          fat: 0,
          fiber: 0,
          sugar: 5,
          time: '08:35',
        },
      ],
    },
    {
      type: 'lunch',
      items: [
        {
          id: 'l1',
          name: 'Grilled Chicken Salad',
          calories: 450,
          protein: 42,
          carbs: 18,
          fat: 22,
          fiber: 6,
          sugar: 8,
          time: '13:00',
        },
        {
          id: 'l2',
          name: 'Whole Grain Bread',
          calories: 120,
          protein: 5,
          carbs: 22,
          fat: 2,
          fiber: 4,
          sugar: 2,
          time: '13:05',
        },
      ],
    },
    {
      type: 'dinner',
      items: [
        {
          id: 'd1',
          name: 'Salmon Fillet',
          calories: 280,
          protein: 35,
          carbs: 0,
          fat: 14,
          fiber: 0,
          sugar: 0,
          time: '19:30',
        },
        {
          id: 'd2',
          name: 'Quinoa (1 cup)',
          calories: 222,
          protein: 8,
          carbs: 39,
          fat: 3.6,
          fiber: 5,
          sugar: 0,
          time: '19:35',
        },
      ],
    },
    {
      type: 'snack',
      items: [
        {
          id: 's1',
          name: 'Apple',
          calories: 95,
          protein: 0.5,
          carbs: 25,
          fat: 0.3,
          fiber: 4,
          sugar: 19,
          time: '15:30',
        },
        {
          id: 's2',
          name: 'Almonds (28g)',
          calories: 164,
          protein: 6,
          carbs: 6,
          fat: 14,
          fiber: 3.5,
          sugar: 1.2,
          time: '16:00',
        },
      ],
    },
  ]);

  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleAddWater = (amount: number) => {
    setConsumed((prev) => ({ ...prev, water: Math.min(prev.water + amount, goals.water * 1.5) }));
  };

  const handleAddFood = (mealType: string) => {
    setActiveMealType(mealType);
    setIsModalOpen(true);
  };

  const handleFoodAdd = (food: FoodItem) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.type === activeMealType
          ? { ...meal, items: [...meal.items, food] }
          : meal
      )
    );
    setConsumed((prev) => ({
      ...prev,
      calories: prev.calories + food.calories,
      protein: prev.protein + food.protein,
      carbs: prev.carbs + food.carbs,
      fat: prev.fat + food.fat,
      fiber: prev.fiber + food.fiber,
      sugar: prev.sugar + food.sugar,
    }));
  };

  const handleRemoveFood = (itemId: string) => {
    const meal = meals.find((m) => m.items.some((i) => i.id === itemId));
    if (!meal) return;

    const item = meal.items.find((i) => i.id === itemId);
    if (!item) return;

    setMeals((prev) =>
      prev.map((m) =>
        m.type === meal.type
          ? { ...m, items: m.items.filter((i) => i.id !== itemId) }
          : m
      )
    );

    setConsumed((prev) => ({
      ...prev,
      calories: Math.max(0, prev.calories - item.calories),
      protein: Math.max(0, prev.protein - item.protein),
      carbs: Math.max(0, prev.carbs - item.carbs),
      fat: Math.max(0, prev.fat - item.fat),
      fiber: Math.max(0, prev.fiber - item.fiber),
      sugar: Math.max(0, prev.sugar - item.sugar),
    }));
  };

  const macroData = [
    { name: 'Protein', value: consumed.protein, color: '#10b981' },
    { name: 'Carbs', value: consumed.carbs, color: '#f59e0b' },
    { name: 'Fat', value: consumed.fat, color: '#f43f5e' },
  ];

  const filteredRecipes = recipeFilter === 'all'
    ? RECIPES
    : RECIPES.filter((r) => r.category === recipeFilter);

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <Utensils className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Nutrition</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDateChange(-1)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300 min-w-[120px] text-center">
                {formatDate(currentDate)}
              </span>
            </div>
            <button
              onClick={() => handleDateChange(1)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-900 dark:text-white">John Doe</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Premium Plan</div>
            </div>
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Date Navigation */}
          <div className="hidden lg:block lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Week View</h3>
              <div className="space-y-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const isToday = day === 'Wed';
                  const isSelected = day === 'Wed';
                  return (
                    <button
                      key={day}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-medium ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {day}
                        </span>
                        {isToday && (
                          <span className="text-xs px-2 py-0.5 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      <span className={`text-sm ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {1950 - i * 100}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Goals */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Goals</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Calories</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{goals.calories}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Protein</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{goals.protein}g</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Carbs</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{goals.carbs}g</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Fat</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{goals.fat}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Daily Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Calories Progress */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Calories
                  </h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {consumed.calories} / {goals.calories}
                  </span>
                </div>
                <div className="flex justify-center">
                  <CircularProgress
                    value={consumed.calories}
                    max={goals.calories}
                    size={180}
                    color="#f97316"
                    label="kcal"
                    sublabel={`${Math.round((consumed.calories / goals.calories) * 100)}%`}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Burned</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">420</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Remaining</div>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {goals.calories - consumed.calories}
                    </div>
                  </div>
                </div>
              </div>

              {/* Macros & Water */}
              <div className="space-y-4">
                <WaterTracker
                  current={consumed.water}
                  goal={goals.water}
                  onAdd={handleAddWater}
                />

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-4">Macronutrients</h4>
                  <div className="space-y-4">
                    <MacroBar
                      label="Protein"
                      value={consumed.protein}
                      max={goals.protein}
                      color="bg-emerald-500"
                      unit="g"
                      icon={Zap}
                    />
                    <MacroBar
                      label="Carbohydrates"
                      value={consumed.carbs}
                      max={goals.carbs}
                      color="bg-amber-500"
                      unit="g"
                      icon={Activity}
                    />
                    <MacroBar
                      label="Fat"
                      value={consumed.fat}
                      max={goals.fat}
                      color="bg-rose-500"
                      unit="g"
                      icon={Target}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <QuickStatCard
                label="Calories"
                value={consumed.calories}
                unit="kcal"
                max={goals.calories}
                icon={Flame}
                color="bg-orange-500"
              />
              <QuickStatCard
                label="Protein"
                value={consumed.protein}
                unit="g"
                max={goals.protein}
                icon={Zap}
                color="bg-emerald-500"
              />
              <QuickStatCard
                label="Carbs"
                value={consumed.carbs}
                unit="g"
                max={goals.carbs}
                icon={Activity}
                color="bg-amber-500"
              />
              <QuickStatCard
                label="Fat"
                value={consumed.fat}
                unit="g"
                max={goals.fat}
                icon={Target}
                color="bg-rose-500"
              />
              <QuickStatCard
                label="Fiber"
                value={consumed.fiber}
                unit="g"
                max={goals.fiber}
                icon={Apple}
                color="bg-lime-500"
              />
              <QuickStatCard
                label="Sugar"
                value={consumed.sugar}
                unit="g"
                max={goals.sugar}
                icon={Sparkles}
                color="bg-pink-500"
              />
            </div>

            {/* Meal Timeline */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Today's Meals</h2>
              {meals.map((meal) => (
                <MealSection
                  key={meal.type}
                  type={meal.type}
                  items={meal.items}
                  onAddFood={handleAddFood}
                  onRemoveItem={handleRemoveFood}
                />
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weekly Calories Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Weekly Calories
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={WEEKLY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Bar dataKey="calories" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="goal" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Macro Distribution */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Macro Distribution</h3>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={180}>
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-3">
                    {macroData.map((macro) => (
                      <div key={macro.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{macro.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{macro.value}g</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Weight Trend */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Weight Trend
              </h3>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={WEIGHT_TREND}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#weightGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recipes Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-amber-500" />
                  Featured Recipes
                </h3>
                <div className="flex items-center gap-1">
                  {(['all', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setRecipeFilter(filter)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                        recipeFilter === filter
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Daily Summary */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Daily Summary
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-emerald-100">Calories</span>
                    <span>{Math.round((consumed.calories / goals.calories) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(consumed.calories / goals.calories) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-emerald-100">Protein</span>
                    <span>{Math.round((consumed.protein / goals.protein) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(consumed.protein / goals.protein) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-emerald-100">Water</span>
                    <span>{Math.round((consumed.water / goals.water) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(consumed.water / goals.water) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100">Streak</span>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-300" />
                    <span className="font-bold">12 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI Insights
              </h3>
              <div className="space-y-3">
                {AI_INSIGHTS.map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-xl border-l-4 ${
                      insight.color === 'amber'
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
                        : insight.color === 'blue'
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                        : insight.color === 'emerald'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500'
                        : 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          insight.color === 'amber'
                            ? 'bg-amber-100 dark:bg-amber-800'
                            : insight.color === 'blue'
                            ? 'bg-blue-100 dark:bg-blue-800'
                            : insight.color === 'emerald'
                            ? 'bg-emerald-100 dark:bg-emerald-800'
                            : 'bg-cyan-100 dark:bg-cyan-800'
                        }`}
                      >
                        <insight.icon
                          className={`w-4 h-4 ${
                            insight.color === 'amber'
                              ? 'text-amber-600 dark:text-amber-400'
                              : insight.color === 'blue'
                              ? 'text-blue-600 dark:text-blue-400'
                              : insight.color === 'emerald'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-cyan-600 dark:text-cyan-400'
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white text-sm">{insight.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {insight.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Food Scan</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Barcode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Scan Barcode</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <ChefHat className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Meal Plan</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Entry Modal */}
      <FoodEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mealType={activeMealType}
        onAdd={handleFoodAdd}
      />
    </div>
  );
}
