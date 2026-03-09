import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Droplets,
  Flame,
  Plus,
  Search,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Target,
  X,
  Barcode,
  Apple,
  Coffee,
  Moon,
  Cookie,
  Zap,
  ChefHat,
  Heart,
  ArrowRight,
  Scan,
  GlassWater,
  ChevronDown,
  TrendingUp,
  Award,
  RotateCcw,
  Check,
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
  time?: string;
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
  ingredients: string[];
}

// ==================== Theme Constants ====================

const COLORS = {
  bone: '#e4dfd5',
  stone: '#5c5243',
  ink: '#2d2418',
  shadowLight: 'rgba(255,255,255,0.6)',
  shadowDark: 'rgba(44,40,34,0.15)',
  protein: '#10b981',
  carbs: '#f59e0b',
  fat: '#f43f5e',
  water: '#06b6d4',
};

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

const RECENT_FOODS = [
  { id: '1', name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
  { id: '2', name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0 },
  { id: '3', name: 'Avocado (1/2)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, sugar: 0.7 },
  { id: '4', name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 6, fat: 0, fiber: 0, sugar: 5 },
  { id: '5', name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2 },
  { id: '6', name: 'Salmon Fillet', calories: 280, protein: 35, carbs: 0, fat: 14, fiber: 0, sugar: 0 },
  { id: '7', name: 'Sweet Potato', calories: 112, protein: 2, carbs: 26, fat: 0.1, fiber: 3.9, sugar: 5 },
  { id: '8', name: 'Eggs (2 large)', calories: 140, protein: 12, carbs: 1, fat: 10, fiber: 0, sugar: 0.6 },
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
    ingredients: ['Quinoa', 'Chicken', 'Avocado', 'Spinach', 'Cherry Tomatoes'],
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
    ingredients: ['Oats', 'Almond Milk', 'Chia Seeds', 'Berries', 'Honey'],
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
    ingredients: ['Salmon', 'Asparagus', 'Lemon', 'Garlic', 'Olive Oil'],
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
    ingredients: ['Dates', 'Oats', 'Peanut Butter', 'Dark Chocolate', 'Chia Seeds'],
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
    image: 'https://images.unsplash.com/photo-1482049016831-31b6c26e1b8a?w=400',
    category: 'breakfast',
    isFavorite: false,
    ingredients: ['Eggs', 'Spinach', 'Bell Peppers', 'Feta Cheese', 'Mushrooms'],
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
    ingredients: ['Quinoa', 'Chickpeas', 'Kale', 'Tahini', 'Roasted Vegetables'],
  },
];

const AI_INSIGHTS = [
  {
    id: '1',
    type: 'warning',
    title: 'Low on Protein',
    message: 'You need 45g more protein to hit your daily goal. Consider adding Greek yogurt or a protein shake.',
    icon: Target,
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
];

// ==================== Neumorphic Styles ====================

const neuStyles = {
  card: `rounded-3xl bg-[#e4dfd5] p-6 shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.6)]`,
  cardInset: `rounded-3xl bg-[#e4dfd5] p-6 shadow-[inset_8px_8px_16px_rgba(44,40,34,0.1),inset_-8px_-8px_16px_rgba(255,255,255,0.5)]`,
  button: `rounded-2xl bg-[#e4dfd5] px-6 py-3 shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-200 font-medium text-[#2d2418]`,
  buttonPrimary: `rounded-2xl bg-[#5c5243] px-6 py-3 shadow-[6px_6px_12px_rgba(44,40,34,0.2),-6px_-6px_12px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)] transition-all duration-200 font-medium text-[#e4dfd5]`,
  input: `w-full rounded-xl bg-[#e4dfd5] px-4 py-3 shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] border-none outline-none focus:shadow-[inset_6px_6px_12px_rgba(44,40,34,0.15),inset_-6px_-6px_12px_rgba(255,255,255,0.6)] transition-all text-[#2d2418] placeholder-[#5c5243]/50`,
  iconButton: `w-10 h-10 rounded-xl bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.12),-4px_-4px_8px_rgba(255,255,255,0.6)] active:shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)] flex items-center justify-center transition-all text-[#5c5243] hover:text-[#2d2418]`,
};

// ==================== Components ====================

// Circular Progress Ring for Calories
const CalorieRing: React.FC<{
  value: number;
  max: number;
  size?: number;
}> = ({ value, max, size = 220 }) => {
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(value / max, 1);
  const strokeDashoffset = circumference - percentage * circumference;
  const remaining = max - value;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#dcd3c6"
          strokeWidth="16"
        />
        {/* Progress ring with gradient */}
        <defs>
          <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#calorieGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-4xl font-bold text-[#2d2418]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {value}
        </motion.span>
        <span className="text-sm text-[#5c5243] mt-1">/ {max} kcal</span>
        <span className="text-xs text-[#5c5243]/70 mt-2">{remaining} remaining</span>
      </div>
    </div>
  );
};

// Macro Ring Component
const MacroRing: React.FC<{
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ElementType;
  size?: number;
}> = ({ label, value, max, color, icon: Icon, size = 100 }) => {
  const radius = (size - 12) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(value / max, 1);
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#dcd3c6"
            strokeWidth="8"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm font-semibold text-[#2d2418]">{value}g</span>
        <span className="text-xs text-[#5c5243] block">/ {max}g {label}</span>
      </div>
    </div>
  );
};

// 3D Water Glass Component
const WaterGlass3D: React.FC<{
  current: number;
  goal: number;
  onAdd: (amount: number) => void;
}> = ({ current, goal, onAdd }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const glasses = Math.floor(current / 250);
  const goalGlasses = Math.floor(goal / 250);

  return (
    <div className={`${neuStyles.card} flex flex-col items-center`}>
      <div className="flex items-center gap-2 mb-4">
        <GlassWater className="w-5 h-5 text-cyan-600" />
        <span className="font-semibold text-[#2d2418]">Hydration</span>
      </div>
      
      {/* 3D Glass */}
      <div className="relative w-24 h-36 mb-4">
        {/* Glass body */}
        <div 
          className="absolute inset-0 rounded-b-3xl rounded-t-lg overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
            boxShadow: 'inset 4px 4px 8px rgba(255,255,255,0.5), inset -4px -4px 8px rgba(44,40,34,0.1), 4px 4px 12px rgba(44,40,34,0.15)',
            border: '2px solid rgba(255,255,255,0.3)',
          }}
        >
          {/* Water level */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-cyan-300"
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Bubbles */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{ left: `${20 + i * 15}%` }}
                  animate={{
                    y: [-20, -100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />
              ))}
            </div>
            {/* Wave effect */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 via-cyan-200 to-cyan-400 opacity-60" />
          </motion.div>
        </div>
        {/* Glass reflection */}
        <div className="absolute top-2 left-2 w-2 h-24 bg-gradient-to-b from-white/60 to-transparent rounded-full" />
      </div>

      <div className="text-center mb-4">
        <span className="text-2xl font-bold text-[#2d2418]">{glasses}</span>
        <span className="text-[#5c5243]"> / {goalGlasses} glasses</span>
        <p className="text-xs text-[#5c5243]/70 mt-1">{current}ml / {goal}ml</p>
      </div>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAdd(250)}
          className={neuStyles.button}
        >
          <Plus className="w-4 h-4 inline mr-1" />
          +250ml
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAdd(500)}
          className={neuStyles.button}
        >
          +500ml
        </motion.button>
      </div>
    </div>
  );
};

// Meal Timeline Component
const MealTimeline: React.FC<{
  meals: Meal[];
  onAddFood: (type: string) => void;
  onRemoveItem: (mealType: string, itemId: string) => void;
}> = ({ meals, onAddFood, onRemoveItem }) => {
  const mealConfig = {
    breakfast: { icon: Coffee, color: '#f59e0b', label: 'Breakfast', time: '7:00 - 9:00' },
    lunch: { icon: Sun, color: '#f97316', label: 'Lunch', time: '12:00 - 14:00' },
    dinner: { icon: Moon, color: '#6366f1', label: 'Dinner', time: '18:00 - 20:00' },
    snack: { icon: Cookie, color: '#ec4899', label: 'Snacks', time: 'All day' },
  };

  return (
    <div className="space-y-4">
      {meals.map((meal, index) => {
        const config = mealConfig[meal.type];
        const Icon = config.icon;
        const totalCalories = meal.items.reduce((sum, item) => sum + item.calories, 0);
        const totalProtein = meal.items.reduce((sum, item) => sum + item.protein, 0);

        return (
          <motion.div
            key={meal.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={neuStyles.card}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.color}20, ${config.color}10)`,
                    boxShadow: `4px 4px 8px rgba(44,40,34,0.1), -4px -4px_8px rgba(255,255,255,0.5)` 
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: config.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2d2418]">{config.label}</h3>
                  <span className="text-xs text-[#5c5243]">{config.time}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#2d2418]">{totalCalories}</span>
                <span className="text-xs text-[#5c5243] block">{totalProtein}g protein</span>
              </div>
            </div>

            {/* Food Items */}
            <AnimatePresence mode="popLayout">
              {meal.items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6 text-[#5c5243]/60"
                >
                  <p className="text-sm">No items yet</p>
                </motion.div>
              ) : (
                <div className="space-y-2 mb-4">
                  {meal.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`${neuStyles.cardInset} py-3 px-4 flex items-center justify-between group`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e4dfd5] shadow-[2px_2px_4px_rgba(44,40,34,0.1),-2px_-2px_4px_rgba(255,255,255,0.5)] flex items-center justify-center">
                          <Apple className="w-5 h-5 text-[#5c5243]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#2d2418] text-sm">{item.name}</p>
                          <p className="text-xs text-[#5c5243]">{item.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-[#2d2418]">{item.calories} cal</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onRemoveItem(meal.type, item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-100 transition-all"
                        >
                          <X className="w-4 h-4 text-rose-500" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAddFood(meal.type)}
              className={`w-full ${neuStyles.button} flex items-center justify-center gap-2 text-sm`}
            >
              <Plus className="w-4 h-4" />
              Add Food
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
};

// Sun icon component
const Sun: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="5" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

// Food Entry Modal
const FoodEntryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  mealType: string;
  onAdd: (food: FoodItem) => void;
}> = ({ isOpen, onClose, mealType, onAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quickAdd, setQuickAdd] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [activeTab, setActiveTab] = useState<'search' | 'quick' | 'scan'>('search');

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
        className="fixed inset-0 bg-[#2d2418]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`${neuStyles.card} w-full max-w-lg max-h-[80vh] overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#2d2418]">
              Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </h3>
            <button onClick={onClose} className={neuStyles.iconButton}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
            {[
              { id: 'search', icon: Search, label: 'Search' },
              { id: 'quick', icon: Zap, label: 'Quick' },
              { id: 'scan', icon: Scan, label: 'AI Scan' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#5c5243] text-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.2)]'
                    : 'text-[#5c5243] hover:text-[#2d2418]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto max-h-[50vh] space-y-4">
            {activeTab === 'search' && (
              <>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5c5243]" />
                  <input
                    type="text"
                    placeholder="Search foods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${neuStyles.input} pl-12`}
                  />
                </div>

                <div className="space-y-2">
                  {filteredFoods.map((food) => (
                    <motion.button
                      key={food.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedFood(selectedFood?.id === food.id ? null : food)}
                      className={`w-full p-4 rounded-2xl text-left transition-all ${
                        selectedFood?.id === food.id
                          ? 'bg-[#5c5243] text-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)]'
                          : neuStyles.cardInset
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{food.name}</div>
                          <div className={`text-xs mt-1 ${selectedFood?.id === food.id ? 'text-[#e4dfd5]/70' : 'text-[#5c5243]'}`}>
                            P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                          </div>
                        </div>
                        <span className="font-bold text-lg">{food.calories}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'quick' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Food name"
                  value={quickAdd.name}
                  onChange={(e) => setQuickAdd({ ...quickAdd, name: e.target.value })}
                  className={neuStyles.input}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Calories"
                    value={quickAdd.calories}
                    onChange={(e) => setQuickAdd({ ...quickAdd, calories: e.target.value })}
                    className={neuStyles.input}
                  />
                  <input
                    type="number"
                    placeholder="Protein (g)"
                    value={quickAdd.protein}
                    onChange={(e) => setQuickAdd({ ...quickAdd, protein: e.target.value })}
                    className={neuStyles.input}
                  />
                  <input
                    type="number"
                    placeholder="Carbs (g)"
                    value={quickAdd.carbs}
                    onChange={(e) => setQuickAdd({ ...quickAdd, carbs: e.target.value })}
                    className={neuStyles.input}
                  />
                  <input
                    type="number"
                    placeholder="Fat (g)"
                    value={quickAdd.fat}
                    onChange={(e) => setQuickAdd({ ...quickAdd, fat: e.target.value })}
                    className={neuStyles.input}
                  />
                </div>
              </div>
            )}

            {activeTab === 'scan' && (
              <div className="text-center py-8">
                <div className={`${neuStyles.cardInset} w-48 h-48 mx-auto mb-6 flex items-center justify-center`}>
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-[#5c5243] mx-auto mb-4" />
                    <p className="text-sm text-[#5c5243]">AI Food Scanner</p>
                  </div>
                </div>
                <p className="text-sm text-[#5c5243] mb-4">Point camera at your food to analyze</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={neuStyles.buttonPrimary}
                >
                  <Camera className="w-5 h-5 inline mr-2" />
                  Open Camera
                </motion.button>
              </div>
            )}
          </div>

          {activeTab !== 'scan' && (
            <div className="flex gap-3 mt-6 pt-4 border-t border-[#5c5243]/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`flex-1 ${neuStyles.button}`}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={!selectedFood && !quickAdd.name}
                className={`flex-1 ${neuStyles.buttonPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Add Food
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Recipe Card with Flip Animation
const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-64 h-80 perspective-1000">
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div 
          className={`absolute inset-0 ${neuStyles.card} p-0 overflow-hidden`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative h-40">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/400x200/e4dfd5/5c5243?text=${encodeURIComponent(recipe.name)}`;
              }}
            />
            <button 
              className="absolute top-3 right-3 p-2 rounded-xl bg-[#e4dfd5] shadow-[2px_2px_4px_rgba(44,40,34,0.15),-2px_-2px_4px_rgba(255,255,255,0.6)]"
            >
              <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-[#5c5243]'}`} />
            </button>
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#5c5243] text-[#e4dfd5] text-xs font-medium">
              {recipe.difficulty}
            </div>
          </div>
          <div className="p-4">
            <h4 className="font-semibold text-[#2d2418] mb-2 truncate">{recipe.name}</h4>
            <div className="flex items-center gap-3 text-xs text-[#5c5243] mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {recipe.time}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {recipe.calories} cal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium">
                P: {recipe.protein}g
              </span>
              <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-medium">
                C: {recipe.carbs}g
              </span>
              <span className="px-2 py-1 rounded-lg bg-rose-100 text-rose-700 text-xs font-medium">
                F: {recipe.fat}g
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsFlipped(true)}
              className={`w-full mt-4 ${neuStyles.button} text-sm`}
            >
              View Recipe
            </motion.button>
          </div>
        </div>

        {/* Back */}
        <div 
          className={`absolute inset-0 ${neuStyles.card} overflow-hidden`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="p-4 h-full flex flex-col">
            <h4 className="font-semibold text-[#2d2418] mb-3">{recipe.name}</h4>
            <div className="flex-1 overflow-y-auto">
              <p className="text-xs text-[#5c5243] font-medium mb-2">Ingredients:</p>
              <ul className="space-y-1 mb-4">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="text-xs text-[#5c5243]/80 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#5c5243]" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsFlipped(false)}
                className={`flex-1 ${neuStyles.button} text-sm`}
              >
                <RotateCcw className="w-4 h-4 inline mr-1" />
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className={`flex-1 ${neuStyles.buttonPrimary} text-sm`}
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Add
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Weekly Chart Component
const WeeklyChart: React.FC = () => {
  const maxCalories = Math.max(...WEEKLY_DATA.map(d => d.calories));
  
  return (
    <div className={neuStyles.card}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[#2d2418] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#5c5243]" />
          Weekly Progress
        </h3>
      </div>
      <div className="flex items-end justify-between gap-2 h-40">
        {WEEKLY_DATA.map((day, idx) => {
          const height = (day.calories / maxCalories) * 100;
          const isGoalMet = day.calories >= day.goal;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className={`w-full rounded-t-xl relative group ${
                  isGoalMet 
                    ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' 
                    : 'bg-gradient-to-t from-[#5c5243] to-[#5c5243]/70'
                }`}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2d2418] text-[#e4dfd5] text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                  {day.calories} cal
                </div>
              </motion.div>
              <span className="text-xs text-[#5c5243] mt-2">{day.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Quick Add Buttons Component
const QuickAdd: React.FC<{ onAdd: (food: FoodItem) => void }> = ({ onAdd }) => {
  const quickFoods = RECENT_FOODS.slice(0, 4);

  return (
    <div className={neuStyles.card}>
      <h3 className="font-semibold text-[#2d2418] mb-4">Quick Add</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickFoods.map((food) => (
          <motion.button
            key={food.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAdd({
              ...food,
              id: Date.now().toString(),
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            })}
            className={`${neuStyles.cardInset} p-3 text-left hover:shadow-[inset_6px_6px_12px_rgba(44,40,34,0.15)] transition-all`}
          >
            <p className="font-medium text-[#2d2418] text-sm truncate">{food.name}</p>
            <p className="text-xs text-[#5c5243]">{food.calories} cal</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ==================== Main Component ====================

export default function Nutrition2() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<string>('');
  const [recipeFilter, setRecipeFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('all');
  const [showScanner, setShowScanner] = useState(false);

  const [goals] = useState<NutritionGoals>({
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
        { id: 'b1', name: 'Oatmeal with Berries', calories: 320, protein: 12, carbs: 54, fat: 6, fiber: 8, sugar: 12, time: '08:30' },
        { id: 'b2', name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 6, fat: 0, fiber: 0, sugar: 5, time: '08:35' },
      ],
    },
    {
      type: 'lunch',
      items: [
        { id: 'l1', name: 'Grilled Chicken Salad', calories: 450, protein: 42, carbs: 18, fat: 22, fiber: 6, sugar: 8, time: '13:00' },
      ],
    },
    {
      type: 'dinner',
      items: [
        { id: 'd1', name: 'Salmon Fillet', calories: 280, protein: 35, carbs: 0, fat: 14, fiber: 0, sugar: 0, time: '19:30' },
      ],
    },
    {
      type: 'snack',
      items: [
        { id: 's1', name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4, sugar: 19, time: '15:30' },
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

  const handleQuickAdd = (food: FoodItem) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.type === 'snack'
          ? { ...meal, items: [...meal.items, { ...food, id: Date.now().toString() }] }
          : meal
      )
    );
    setConsumed((prev) => ({
      ...prev,
      calories: prev.calories + food.calories,
      protein: prev.protein + food.protein,
      carbs: prev.carbs + food.carbs,
      fat: prev.fat + food.fat,
    }));
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

  const handleRemoveFood = (mealType: string, itemId: string) => {
    const meal = meals.find((m) => m.type === mealType);
    if (!meal) return;

    const item = meal.items.find((i) => i.id === itemId);
    if (!item) return;

    setMeals((prev) =>
      prev.map((m) =>
        m.type === mealType
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
    <div className="min-h-screen bg-[#e4dfd5]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#e4dfd5]/90 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${neuStyles.card} p-0`}>
              <Utensils className="w-6 h-6 text-[#5c5243]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2d2418]">Nutrition</h1>
              <p className="text-sm text-[#5c5243]">Fuel your body right</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDateChange(-1)}
              className={neuStyles.iconButton}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <div className={`${neuStyles.card} py-2 px-4`}>
              <span className="font-medium text-[#2d2418] min-w-[120px] text-center block">
                {formatDate(currentDate)}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDateChange(1)}
              className={neuStyles.iconButton}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowScanner(true)}
              className={`${neuStyles.button} flex items-center gap-2`}
            >
              <Scan className="w-4 h-4" />
              <span className="hidden sm:inline">AI Scan</span>
            </motion.button>
            <div className={`w-10 h-10 rounded-full ${neuStyles.card} p-0 flex items-center justify-center text-[#5c5243] font-semibold`}>
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Daily Summary */}
          <div className="lg:col-span-3 space-y-6">
            {/* Calorie Ring Card */}
            <div className={neuStyles.card}>
              <h3 className="font-semibold text-[#2d2418] mb-4 text-center">Daily Calories</h3>
              <div className="flex justify-center">
                <CalorieRing value={consumed.calories} max={goals.calories} />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className={`${neuStyles.cardInset} text-center py-3`}>
                  <p className="text-xs text-[#5c5243]">Burned</p>
                  <p className="text-lg font-bold text-[#2d2418]">420</p>
                </div>
                <div className={`${neuStyles.cardInset} text-center py-3`}>
                  <p className="text-xs text-[#5c5243]">Net</p>
                  <p className="text-lg font-bold text-[#2d2418]">{consumed.calories - 420}</p>
                </div>
              </div>
            </div>

            {/* Macro Rings */}
            <div className={neuStyles.card}>
              <h3 className="font-semibold text-[#2d2418] mb-4">Macros</h3>
              <div className="flex justify-around">
                <MacroRing
                  label="Protein"
                  value={consumed.protein}
                  max={goals.protein}
                  color={COLORS.protein}
                  icon={Zap}
                />
                <MacroRing
                  label="Carbs"
                  value={consumed.carbs}
                  max={goals.carbs}
                  color={COLORS.carbs}
                  icon={Apple}
                />
                <MacroRing
                  label="Fat"
                  value={consumed.fat}
                  max={goals.fat}
                  color={COLORS.fat}
                  icon={Target}
                />
              </div>
            </div>

            {/* Water Tracker */}
            <WaterGlass3D current={consumed.water} goal={goals.water} onAdd={handleAddWater} />

            {/* Weekly Chart */}
            <WeeklyChart />

            {/* Quick Add */}
            <QuickAdd onAdd={handleQuickAdd} />
          </div>

          {/* Center Column - Meal Timeline */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#2d2418]">Today's Meals</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${neuStyles.button} flex items-center gap-2`}
              >
                <Barcode className="w-4 h-4" />
                Scan Barcode
              </motion.button>
            </div>
            <MealTimeline meals={meals} onAddFood={handleAddFood} onRemoveItem={handleRemoveFood} />
          </div>

          {/* Right Column - Recipes & Insights */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI Insights */}
            <div className={neuStyles.card}>
              <h3 className="font-semibold text-[#2d2418] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                AI Insights
              </h3>
              <div className="space-y-3">
                {AI_INSIGHTS.map((insight, idx) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`${neuStyles.cardInset} p-3`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <insight.icon className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#2d2418] text-sm">{insight.title}</h4>
                        <p className="text-xs text-[#5c5243] mt-1">{insight.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recipe Filter */}
            <div className={neuStyles.card}>
              <h3 className="font-semibold text-[#2d2418] mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#5c5243]" />
                Featured Recipes
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {(['all', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRecipeFilter(filter)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                      recipeFilter === filter
                        ? 'bg-[#5c5243] text-[#e4dfd5]'
                        : 'bg-[#e4dfd5] text-[#5c5243] shadow-[2px_2px_4px_rgba(44,40,34,0.1),-2px_-2px_4px_rgba(255,255,255,0.5)]'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {filteredRecipes.slice(0, 3).map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    whileHover={{ scale: 1.02 }}
                    className={`${neuStyles.cardInset} p-3 flex gap-3`}
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#2d2418] text-sm truncate">{recipe.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#5c5243] mt-1">
                        <Clock className="w-3 h-3" />
                        {recipe.time}
                        <Flame className="w-3 h-3 ml-1" />
                        {recipe.calories}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-2 text-xs text-[#5c5243] flex items-center gap-1 hover:text-[#2d2418]"
                      >
                        View Recipe <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Streak Card */}
            <div className={`${neuStyles.card} bg-gradient-to-br from-amber-100 to-orange-100`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#5c5243]">Current Streak</p>
                  <p className="text-3xl font-bold text-[#2d2418]">12 Days</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] flex items-center justify-center">
                  <Flame className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              <p className="text-xs text-[#5c5243] mt-3">Keep logging to maintain your streak!</p>
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
