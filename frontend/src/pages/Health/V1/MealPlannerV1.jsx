import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

/**
 * MealPlannerV1 - Планировщик питания
 * /health/nutrition/meal-plan-v1
 * 
 * Функционал:
 * - Weekly view (Mon-Sun)
 * - Drag-drop meals
 * - Shopping list generator
 * - Macro goals
 * - Recipe suggestions
 */

// ============================================
// MOCK DATA
// ============================================

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const generateWeeklyPlan = () => {
  const meals = {
    breakfast: [
      { id: 1, name: 'Овсянка с ягодами', calories: 450, protein: 15, carbs: 65, fat: 12, icon: '🥣' },
      { id: 2, name: 'Омлет с овощами', calories: 380, protein: 22, carbs: 12, fat: 28, icon: '🍳' },
      { id: 3, name: 'Смузи боул', calories: 420, protein: 18, carbs: 58, fat: 14, icon: '🥤' },
      { id: 4, name: 'Творог с фруктами', calories: 350, protein: 25, carbs: 35, fat: 10, icon: '🥛' },
      { id: 5, name: 'Авокадо тост', calories: 400, protein: 12, carbs: 42, fat: 22, icon: '🥑' },
      { id: 6, name: 'Панкейки с мёдом', calories: 520, protein: 14, carbs: 78, fat: 18, icon: '🥞' },
      { id: 7, name: 'Гранола с йогуртом', calories: 480, protein: 16, carbs: 62, fat: 20, icon: '🥣' },
    ],
    lunch: [
      { id: 8, name: 'Курица с рисом', calories: 620, protein: 45, carbs: 58, fat: 18, icon: '🍗' },
      { id: 9, name: 'Паста с лососем', calories: 680, protein: 38, carbs: 65, fat: 28, icon: '🍝' },
      { id: 10, name: 'Боул с киноа', calories: 550, protein: 22, carbs: 72, fat: 20, icon: '🥗' },
      { id: 11, name: 'Стейк с овощами', calories: 720, protein: 52, carbs: 35, fat: 42, icon: '🥩' },
      { id: 12, name: 'Суп с фрикадельками', calories: 480, protein: 28, carbs: 45, fat: 18, icon: '🍲' },
      { id: 13, name: 'Салат с тунцом', calories: 420, protein: 35, carbs: 28, fat: 18, icon: '🥗' },
      { id: 14, name: 'Бургер в лаваше', calories: 580, protein: 32, carbs: 55, fat: 25, icon: '🌯' },
    ],
    dinner: [
      { id: 15, name: 'Лосось с брокколи', calories: 450, protein: 42, carbs: 18, fat: 24, icon: '🐟' },
      { id: 16, name: 'Индейка с салатом', calories: 380, protein: 38, carbs: 15, fat: 18, icon: '🦃' },
      { id: 17, name: 'Творожная запеканка', calories: 420, protein: 28, carbs: 42, fat: 15, icon: '🧀' },
      { id: 18, name: 'Креветки с овощами', calories: 350, protein: 32, carbs: 22, fat: 14, icon: '🍤' },
      { id: 19, name: 'Курица гриль', calories: 400, protein: 45, carbs: 12, fat: 18, icon: '🍗' },
      { id: 20, name: 'Овощное рагу', calories: 320, protein: 12, carbs: 45, fat: 12, icon: '🥘' },
      { id: 21, name: 'Яйца пашот', calories: 380, protein: 22, carbs: 18, fat: 24, icon: '🥚' },
    ],
    snacks: [
      { id: 22, name: 'Греческий йогурт', calories: 120, protein: 15, carbs: 8, fat: 2, icon: '🥛' },
      { id: 23, name: 'Орехи микс', calories: 180, protein: 6, carbs: 8, fat: 16, icon: '🥜' },
      { id: 24, name: 'Фрукты', calories: 95, protein: 1, carbs: 25, fat: 0, icon: '🍎' },
      { id: 25, name: 'Протеиновый батончик', calories: 200, protein: 20, carbs: 18, fat: 6, icon: '🍫' },
      { id: 26, name: 'Хумус с овощами', calories: 150, protein: 6, carbs: 15, fat: 8, icon: '🥕' },
      { id: 27, name: 'Смузи', calories: 180, protein: 8, carbs: 32, fat: 4, icon: '🥤' },
      { id: 28, name: 'Тост с арахисовой пастой', calories: 220, protein: 8, carbs: 22, fat: 12, icon: '🍞' },
    ],
  };

  return DAYS_OF_WEEK.map((day, index) => ({
    day,
    breakfast: meals.breakfast[index],
    lunch: meals.lunch[index],
    dinner: meals.dinner[index],
    snacks: meals.snacks[index],
    totalCalories: 
      meals.breakfast[index].calories +
      meals.lunch[index].calories +
      meals.dinner[index].calories +
      meals.snacks[index].calories,
  }));
};

const generateShoppingList = () => ({
  proteins: [
    { id: 1, name: 'Куриная грудка', amount: '1.5 кг', checked: false },
    { id: 2, name: 'Лосось филе', amount: '800 г', checked: false },
    { id: 3, name: 'Яйца', amount: '30 шт', checked: true },
    { id: 4, name: 'Творог 5%', amount: '1 кг', checked: false },
    { id: 5, name: 'Греческий йогурт', amount: '500 г', checked: false },
    { id: 6, name: 'Индейка', amount: '600 г', checked: false },
  ],
  carbs: [
    { id: 7, name: 'Овсянка', amount: '500 г', checked: false },
    { id: 8, name: 'Рис бурый', amount: '1 кг', checked: false },
    { id: 9, name: 'Паста цельнозерновая', amount: '500 г', checked: true },
    { id: 10, name: 'Киноа', amount: '400 г', checked: false },
    { id: 11, name: 'Хлеб цельнозерновой', amount: '1 буханка', checked: false },
  ],
  fats: [
    { id: 12, name: 'Оливковое масло', amount: '500 мл', checked: false },
    { id: 13, name: 'Авокадо', amount: '4 шт', checked: false },
    { id: 14, name: 'Орехи микс', amount: '300 г', checked: false },
    { id: 15, name: 'Арахисовая паста', amount: '400 г', checked: true },
  ],
  vegetables: [
    { id: 16, name: 'Брокколи', amount: '500 г', checked: false },
    { id: 17, name: 'Шпинат', amount: '300 г', checked: false },
    { id: 18, name: 'Помидоры', amount: '1 кг', checked: false },
    { id: 19, name: 'Огурцы', amount: '500 г', checked: false },
    { id: 20, name: 'Перец болгарский', amount: '4 шт', checked: false },
  ],
  fruits: [
    { id: 21, name: 'Яблоки', amount: '1 кг', checked: false },
    { id: 22, name: 'Бананы', amount: '6 шт', checked: true },
    { id: 23, name: 'Ягоды микс', amount: '500 г', checked: false },
    { id: 24, name: 'Цитрусовые', amount: '4 шт', checked: false },
  ],
});

const generateMacroGoals = () => ({
  daily: {
    calories: { target: 2200, current: 0 },
    protein: { target: 180, current: 0, unit: 'г' },
    carbs: { target: 250, current: 0, unit: 'г' },
    fat: { target: 85, current: 0, unit: 'г' },
    fiber: { target: 35, current: 0, unit: 'г' },
  },
  weekly: {
    avgCalories: 2150,
    avgProtein: 172,
    avgCarbs: 245,
    avgFat: 82,
  },
});

const generateRecipeSuggestions = () => [
  {
    id: 1,
    name: 'Протеиновые панкейки',
    calories: 380,
    protein: 28,
    carbs: 42,
    fat: 10,
    time: '15 мин',
    difficulty: 'Легко',
    image: '🥞',
    ingredients: 5,
  },
  {
    id: 2,
    name: 'Боул с лососем',
    calories: 520,
    protein: 35,
    carbs: 48,
    fat: 22,
    time: '20 мин',
    difficulty: 'Средне',
    image: '🥗',
    ingredients: 8,
  },
  {
    id: 3,
    name: 'Курица терияки',
    calories: 480,
    protein: 42,
    carbs: 38,
    fat: 16,
    time: '25 мин',
    difficulty: 'Средне',
    image: '🍗',
    ingredients: 7,
  },
  {
    id: 4,
    name: 'Зелёный смузи',
    calories: 220,
    protein: 12,
    carbs: 32,
    fat: 6,
    time: '5 мин',
    difficulty: 'Легко',
    image: '🥤',
    ingredients: 5,
  },
];

const COLORS = {
  breakfast: '#f59e0b',
  lunch: '#10b981',
  dinner: '#8b5cf6',
  snacks: '#ec4899',
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * WeekDayCard - Карточка дня недели
 */
const WeekDayCard = ({ day, isSelected, onClick }) => {
  const isToday = day.day === DAYS_OF_WEEK[new Date().getDay() - 1] || 
                  (new Date().getDay() === 0 && day.day === 'Вс');

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl transition-all ${
        isSelected 
          ? 'bg-stone text-white shadow-lg scale-105' 
          : 'neu-card hover:shadow-md'
      } ${isToday ? 'ring-2 ring-emerald-500' : ''}`}
    >
      <div className={`text-sm font-medium mb-1 ${isSelected ? 'text-stone/70' : 'text-ink-light'}`}>
        {day.day}
      </div>
      <div className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-stone'}`}>
        {day.totalCalories}
      </div>
      <div className={`text-xs ${isSelected ? 'text-stone/70' : 'text-ink-light'}`}>
        ккал
      </div>
    </button>
  );
};

/**
 * MealPlanDay - Детали дня с приёмами пищи
 */
const MealPlanDay = ({ dayData, onEditMeal }) => {
  const meals = [
    { type: 'breakfast', ...dayData.breakfast },
    { type: 'lunch', ...dayData.lunch },
    { type: 'dinner', ...dayData.dinner },
    { type: 'snacks', ...dayData.snacks },
  ];

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">{dayData.day}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-stone">{dayData.totalCalories}</div>
          <div className="text-xs text-ink-light">ккал всего</div>
        </div>
      </div>

      <div className="space-y-4">
        {meals.map((meal, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 bg-sand/50 rounded-xl hover:bg-sand transition-all cursor-pointer group"
            onClick={() => onEditMeal?.(meal)}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${COLORS[meal.type]}20` }}
            >
              {meal.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone">{meal.name}</span>
                <span className="text-sm font-bold text-stone">{meal.calories} ккал</span>
              </div>
              <div className="flex items-center space-x-3 mt-1 text-xs">
                <span className="text-emerald-600">Б: {meal.protein}г</span>
                <span className="text-amber-600">У: {meal.carbs}г</span>
                <span className="text-red-600">Ж: {meal.fat}г</span>
              </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-stone/20 rounded-lg">
              ✏️
            </button>
          </div>
        ))}
      </div>

      {/* Macro breakdown for the day */}
      <div className="mt-6 pt-6 border-t border-stone/10">
        <h4 className="text-sm font-semibold text-stone mb-3">Макросы за день</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-emerald-50 rounded-xl">
            <div className="text-lg font-bold text-emerald-600">
              {meals.reduce((sum, m) => sum + m.protein, 0)}г
            </div>
            <div className="text-xs text-ink-light">Белки</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-xl">
            <div className="text-lg font-bold text-amber-600">
              {meals.reduce((sum, m) => sum + m.carbs, 0)}г
            </div>
            <div className="text-xs text-ink-light">Углеводы</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-xl">
            <div className="text-lg font-bold text-red-600">
              {meals.reduce((sum, m) => sum + m.fat, 0)}г
            </div>
            <div className="text-xs text-ink-light">Жиры</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ShoppingList - Список покупок
 */
const ShoppingList = ({ list }) => {
  const [items, setItems] = useState(list);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Все', icon: '🛒' },
    { id: 'proteins', label: 'Белки', icon: '🥩' },
    { id: 'carbs', label: 'Углеводы', icon: '🍞' },
    { id: 'fats', label: 'Жиры', icon: '🥑' },
    { id: 'vegetables', label: 'Овощи', icon: '🥬' },
    { id: 'fruits', label: 'Фрукты', icon: '🍎' },
  ];

  const toggleItem = (categoryId, itemId) => {
    setItems(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const getFilteredItems = () => {
    if (activeCategory === 'all') {
      return Object.entries(items).flatMap(([catId, catItems]) =>
        catItems.map(item => ({ ...item, category: catId }))
      );
    }
    return items[activeCategory]?.map(item => ({ ...item, category: activeCategory })) || [];
  };

  const getTotalProgress = () => {
    const allItems = Object.values(items).flat();
    const checked = allItems.filter(i => i.checked).length;
    return { checked, total: allItems.length, percentage: (checked / allItems.length) * 100 };
  };

  const progress = getTotalProgress();

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Список покупок</h3>
        <button className="neu-button-secondary px-4 py-2 rounded-xl text-sm font-medium">
          Экспорт 📤
        </button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink-light">
            {progress.checked} из {progress.total} куплено
          </span>
          <span className="text-sm font-bold text-emerald-600">{progress.percentage.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-sand rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-stone text-white'
                : 'bg-sand/50 text-stone hover:bg-sand'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {getFilteredItems().map(item => (
          <div
            key={item.id}
            className="flex items-center space-x-3 p-3 bg-sand/50 rounded-xl hover:bg-sand transition-all cursor-pointer"
            onClick={() => toggleItem(item.category, item.id)}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-stone/30'
            }`}>
              {item.checked && <span className="text-white text-xs">✓</span>}
            </div>
            <span className={`flex-1 ${item.checked ? 'line-through text-ink-light' : 'text-stone'}`}>
              {item.name}
            </span>
            <span className="text-sm text-ink-light">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * MacroGoalsWidget - Виджет целей по макросам
 */
const MacroGoalsWidget = ({ goals }) => {
  const data = [
    { name: 'Белки', current: goals.daily.protein.current, target: goals.daily.protein.target, color: '#10b981' },
    { name: 'Углеводы', current: goals.daily.carbs.current, target: goals.daily.carbs.target, color: '#f59e0b' },
    { name: 'Жиры', current: goals.daily.fat.current, target: goals.daily.fat.target, color: '#ef4444' },
  ];

  const radarData = [
    { subject: 'Белки', A: (goals.weekly.avgProtein / goals.daily.protein.target) * 100, fullMark: 100 },
    { subject: 'Углеводы', A: (goals.weekly.avgCarbs / goals.daily.carbs.target) * 100, fullMark: 100 },
    { subject: 'Жиры', A: (goals.weekly.avgFat / goals.daily.fat.target) * 100, fullMark: 100 },
  ];

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Цели по макросам</h3>

      {/* Daily Goals */}
      <div className="space-y-4 mb-6">
        {data.map((macro, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-stone">{macro.name}</span>
              <span className="text-sm font-bold" style={{ color: macro.color }}>
                {macro.current} / {macro.target}{macro.unit || 'г'}
              </span>
            </div>
            <div className="h-3 bg-sand rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  backgroundColor: macro.color,
                  width: `${Math.min((macro.current / macro.target) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Average Radar */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#dcd3c6" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#5c5243' }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar
              name="Среднее за неделю"
              dataKey="A"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Stats */}
      <div className="mt-4 pt-4 border-t border-stone/10 grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-emerald-600">{goals.weekly.avgProtein}г</div>
          <div className="text-xs text-ink-light">Ср. белки</div>
        </div>
        <div>
          <div className="text-lg font-bold text-amber-600">{goals.weekly.avgCarbs}г</div>
          <div className="text-xs text-ink-light">Ср. углеводы</div>
        </div>
        <div>
          <div className="text-lg font-bold text-red-600">{goals.weekly.avgFat}г</div>
          <div className="text-xs text-ink-light">Ср. жиры</div>
        </div>
      </div>
    </div>
  );
};

/**
 * RecipeSuggestions - Предложения рецептов
 */
const RecipeSuggestions = ({ recipes }) => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-stone">Рекомендуемые рецепты</h3>
        <Link to="/health/nutrition/recipes-v1" className="text-sm font-medium text-stone hover:text-ink">
          Все рецепты →
        </Link>
      </div>

      <div className="space-y-4">
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            className="flex items-center space-x-4 p-4 bg-sand/50 rounded-xl hover:bg-sand transition-all cursor-pointer"
          >
            <div className="text-4xl">{recipe.image}</div>
            <div className="flex-1">
              <h4 className="font-medium text-stone">{recipe.name}</h4>
              <div className="flex items-center space-x-3 mt-1 text-xs text-ink-light">
                <span>⏱️ {recipe.time}</span>
                <span>📊 {recipe.ingredients} ингред.</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  recipe.difficulty === 'Легко' ? 'bg-emerald-100 text-emerald-700' :
                  recipe.difficulty === 'Средне' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {recipe.difficulty}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-stone">{recipe.calories}</div>
              <div className="text-xs text-ink-light">ккал</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * WeeklyCaloriesChart - График калорий за неделю
 */
const WeeklyCaloriesChart = ({ weekPlan }) => {
  const data = weekPlan.map(day => ({
    day: day.day,
    calories: day.totalCalories,
    target: 2200,
    breakfast: day.breakfast.calories,
    lunch: day.lunch.calories,
    dinner: day.dinner.calories,
    snacks: day.snacks.calories,
  }));

  return (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone">Калории за неделю</h3>
          <p className="text-xs text-ink-light">Распределение по дням</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full" />
          <span className="text-xs text-ink-light">Цель: 2200</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#5c5243' }} />
            <YAxis tick={{ fontSize: 12, fill: '#5c5243' }} domain={[0, 3000]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fefae8',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="calories" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="target" fill="#d1d5db" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const MealPlannerV1 = () => {
  const [weekPlan] = useState(generateWeeklyPlan());
  const [shoppingList] = useState(generateShoppingList());
  const [macroGoals] = useState(generateMacroGoals());
  const [recipeSuggestions] = useState(generateRecipeSuggestions());
  const [selectedDay, setSelectedDay] = useState(weekPlan[0]);

  const handleEditMeal = (meal) => {
    console.log('Edit meal:', meal);
    // Здесь будет логика редактирования
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">📅</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">Планировщик питания</h1>
                <p className="text-ink-light">Планируйте приёмы пищи на неделю</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/nutrition-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Обзор
            </Link>
            <button className="neu-button px-4 py-2 rounded-xl font-medium">
              Авто-план 🤖
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Week Navigation */}
        <div className="neu-card p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-stone">Выберите день</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-sand">←</button>
              <span className="text-sm font-medium text-stone">Март 2026</span>
              <button className="p-2 rounded-lg hover:bg-sand">→</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekPlan.map((day, index) => (
              <WeekDayCard
                key={index}
                day={day}
                isSelected={selectedDay.day === day.day}
                onClick={() => setSelectedDay(day)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Day Details */}
          <div className="lg:col-span-2">
            <MealPlanDay dayData={selectedDay} onEditMeal={handleEditMeal} />
            <div className="mt-6">
              <WeeklyCaloriesChart weekPlan={weekPlan} />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <ShoppingList list={shoppingList} />
            <MacroGoalsWidget goals={macroGoals} />
            <RecipeSuggestions recipes={recipeSuggestions} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 neu-card p-6">
          <h3 className="text-xl font-bold text-stone mb-4">Быстрые действия</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-medium">Копировать неделю</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium">Подобрать рецепты</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl text-white hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">Анализ недели</div>
            </button>
            <button className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">📤</div>
              <div className="font-medium">Экспорт плана</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlannerV1;
