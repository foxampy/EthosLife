import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

/**
 * FoodDiaryV1 - Дневник питания
 * /health/nutrition/diary-v1
 * 
 * Функционал:
 * - Breakfast/Lunch/Dinner/Snacks секции
 * - Add meal modal
 * - Macro breakdown per meal
 * - Calorie timeline chart
 * - Notes
 * - Copy from yesterday
 */

// ============================================
// MOCK DATA
// ============================================

const generateMealsByType = () => ({
  breakfast: [
    {
      id: 1,
      name: 'Овсянка с ягодами',
      calories: 450,
      protein: 15,
      carbs: 65,
      fat: 12,
      fiber: 8,
      time: '07:30',
      notes: 'Добавил мёд и миндаль',
      icon: '🥣',
    },
    {
      id: 2,
      name: 'Кофе с молоком',
      calories: 80,
      protein: 4,
      carbs: 8,
      fat: 3,
      fiber: 0,
      time: '07:45',
      notes: '',
      icon: '☕',
    },
  ],
  lunch: [
    {
      id: 3,
      name: 'Куриная грудка гриль',
      calories: 280,
      protein: 45,
      carbs: 0,
      fat: 8,
      fiber: 0,
      time: '13:00',
      notes: 'С травами и лимоном',
      icon: '🍗',
    },
    {
      id: 4,
      name: 'Бурый рис',
      calories: 220,
      protein: 5,
      carbs: 45,
      fat: 2,
      fiber: 4,
      time: '13:00',
      notes: '150г готового',
      icon: '🍚',
    },
    {
      id: 5,
      name: 'Салат из овощей',
      calories: 120,
      protein: 3,
      carbs: 12,
      fat: 8,
      fiber: 5,
      time: '13:00',
      notes: 'Оливковое масло',
      icon: '🥗',
    },
  ],
  dinner: [
    {
      id: 6,
      name: 'Лосось запечённый',
      calories: 350,
      protein: 40,
      carbs: 0,
      fat: 20,
      fiber: 0,
      time: '19:30',
      notes: 'С лимоном и укропом',
      icon: '🐟',
    },
    {
      id: 7,
      name: 'Брокколи на пару',
      calories: 55,
      protein: 4,
      carbs: 11,
      fat: 0,
      fiber: 5,
      time: '19:30',
      notes: '',
      icon: '🥦',
    },
  ],
  snacks: [
    {
      id: 8,
      name: 'Греческий йогурт',
      calories: 120,
      protein: 15,
      carbs: 8,
      fat: 2,
      fiber: 0,
      time: '10:30',
      notes: 'Без сахара',
      icon: '🥛',
    },
    {
      id: 9,
      name: 'Яблоко',
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      fiber: 4,
      time: '16:00',
      notes: 'Зелёное',
      icon: '🍎',
    },
    {
      id: 10,
      name: 'Миндаль',
      calories: 170,
      protein: 6,
      carbs: 6,
      fat: 15,
      fiber: 3,
      time: '16:00',
      notes: '30г',
      icon: '🥜',
    },
  ],
});

const generateYesterdayMeals = () => [
  { type: 'breakfast', name: 'Омлет с овощами', calories: 380, protein: 22, carbs: 12, fat: 28 },
  { type: 'lunch', name: 'Паста с курицей', calories: 650, protein: 35, carbs: 72, fat: 22 },
  { type: 'dinner', name: 'Тунец салат', calories: 320, protein: 38, carbs: 15, fat: 12 },
  { type: 'snacks', name: 'Протеиновый батончик', calories: 200, protein: 20, carbs: 18, fat: 6 },
];

const generateCalorieTimeline = () => {
  const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
  return hours.map((hour) => ({
    time: hour,
    calories: Math.floor(Math.random() * 400),
    cumulative: 0,
  })).map((item, index, arr) => {
    const prev = index > 0 ? arr[index - 1].cumulative : 0;
    return { ...item, cumulative: prev + item.calories };
  });
};

const generateWeeklyComparison = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map((day) => ({
    day,
    thisWeek: Math.floor(1800 + Math.random() * 500),
    lastWeek: Math.floor(1800 + Math.random() * 500),
    target: 2200,
  }));
};

const MEAL_TYPES = {
  breakfast: { label: 'Завтрак', icon: '🌅', color: 'bg-amber-500', timeRange: '06:00 - 11:00' },
  lunch: { label: 'Обед', icon: '☀️', color: 'bg-emerald-500', timeRange: '11:00 - 16:00' },
  dinner: { label: 'Ужин', icon: '🌙', color: 'bg-violet-500', timeRange: '16:00 - 22:00' },
  snacks: { label: 'Перекусы', icon: '🍿', color: 'bg-pink-500', timeRange: 'Весь день' },
};

const COLORS = {
  protein: '#10b981',
  carbs: '#f59e0b',
  fat: '#ef4444',
  fiber: '#8b5cf6',
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * MealSection - Секция приёма пищи
 */
const MealSection = ({ type, meals, onAdd, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const mealType = MEAL_TYPES[type];

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  return (
    <div className="neu-card overflow-hidden">
      {/* Header */}
      <div 
        className={`${mealType.color} bg-opacity-10 p-4 cursor-pointer transition-all hover:bg-opacity-20`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{mealType.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-stone">{mealType.label}</h3>
              <p className="text-xs text-ink-light">{mealType.timeRange}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xl font-bold text-stone">{totalCalories} ккал</div>
              <div className="text-xs text-ink-light">
                Б: {totalProtein.toFixed(1)}г | У: {totalCarbs.toFixed(1)}г | Ж: {totalFat.toFixed(1)}г
              </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
              {isExpanded ? '▼' : '▲'}
            </button>
          </div>
        </div>
      </div>

      {/* Meals List */}
      {isExpanded && (
        <div className="p-4">
          {meals.length === 0 ? (
            <div className="text-center py-8 text-ink-light">
              <span className="text-4xl block mb-2">🍽️</span>
              Пока нет записей
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center space-x-4 p-4 bg-sand/50 rounded-xl hover:bg-sand transition-all group"
                >
                  <div className="text-3xl">{meal.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-stone">{meal.name}</span>
                      <span className="text-sm text-ink-light">{meal.time}</span>
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-xs">
                      <span className="text-emerald-600">Б: {meal.protein}г</span>
                      <span className="text-amber-600">У: {meal.carbs}г</span>
                      <span className="text-red-600">Ж: {meal.fat}г</span>
                      {meal.fiber > 0 && <span className="text-violet-600">К: {meal.fiber}г</span>}
                    </div>
                    {meal.notes && (
                      <div className="text-xs text-ink-light mt-1 italic">📝 {meal.notes}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-stone">{meal.calories}</div>
                    <div className="text-xs text-ink-light">ккал</div>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit?.(meal)}
                      className="p-2 rounded-lg hover:bg-stone/20 text-stone"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete?.(meal.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-500"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Button */}
          <button
            onClick={() => onAdd(type)}
            className="mt-4 w-full py-3 border-2 border-dashed border-stone/30 rounded-xl text-stone hover:border-stone/50 hover:bg-sand/50 transition-all flex items-center justify-center space-x-2"
          >
            <span className="text-xl">+</span>
            <span>Добавить продукт</span>
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * AddMealModal - Модальное окно добавления еды
 */
const AddMealModal = ({ isOpen, onClose, mealType, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    notes: '',
    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Date.now(),
      type: mealType,
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fat: Number(formData.fat),
      fiber: Number(formData.fiber),
      icon: '🍽️',
    });
    onClose();
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      notes: '',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neu-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone">
            Добавить в {MEAL_TYPES[mealType]?.label}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-sand flex items-center justify-center">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone mb-2">Название *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="neu-input w-full"
              placeholder="Например: Овсянка с ягодами"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone mb-2">Калории *</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="neu-input w-full"
                placeholder="ккал"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone mb-2">Время</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="neu-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone mb-2">Белки (г)</label>
              <input
                type="number"
                step="0.1"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                className="neu-input w-full"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone mb-2">Жиры (г)</label>
              <input
                type="number"
                step="0.1"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                className="neu-input w-full"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone mb-2">Углеводы (г)</label>
              <input
                type="number"
                step="0.1"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                className="neu-input w-full"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone mb-2">Клетчатка (г)</label>
              <input
                type="number"
                step="0.1"
                value={formData.fiber}
                onChange={(e) => setFormData({ ...formData, fiber: e.target.value })}
                className="neu-input w-full"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone mb-2">Заметки</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="neu-input w-full"
              rows="2"
              placeholder="Дополнительная информация..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="neu-button-secondary flex-1 py-3">
              Отмена
            </button>
            <button type="submit" className="neu-button flex-1 py-3">
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * MacroBreakdown - Распределение макросов
 */
const MacroBreakdown = ({ meals }) => {
  const totals = meals.flat().reduce((acc, meal) => ({
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat,
    fiber: acc.fiber + meal.fiber,
  }), { protein: 0, carbs: 0, fat: 0, fiber: 0 });

  const data = [
    { name: 'Белки', value: totals.protein, color: COLORS.protein },
    { name: 'Жиры', value: totals.fat, color: COLORS.fat },
    { name: 'Углеводы', value: totals.carbs, color: COLORS.carbs },
    { name: 'Клетчатка', value: totals.fiber, color: COLORS.fiber },
  ];

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Распределение макросов</h3>
      
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-sand/50 rounded-xl">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
            <div>
              <div className="text-sm text-ink-light">{item.name}</div>
              <div className="font-bold text-stone">{item.value.toFixed(1)}г</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * CalorieTimelineChart - График калорий по времени
 */
const CalorieTimelineChart = ({ data }) => {
  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Калории в течение дня</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="calorieGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#5c5243' }} />
            <YAxis tick={{ fontSize: 11, fill: '#5c5243' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fefae8',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="calories"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#calorieGradient)"
            />
            <Line type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full" />
          <span className="text-sm text-ink-light">За приём</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          <span className="text-sm text-ink-light">Накопительно</span>
        </div>
      </div>
    </div>
  );
};

/**
 * CopyFromYesterday - Копирование из вчерашнего дня
 */
const CopyFromYesterday = ({ yesterdayMeals, onCopy }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCopy = () => {
    onCopy(yesterdayMeals);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-3 neu-button-secondary rounded-xl font-medium flex items-center justify-center space-x-2"
      >
        <span>📋</span>
        <span>Копировать из вчерашнего дня</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="neu-card w-full max-w-md">
            <h3 className="text-xl font-bold text-stone mb-4">Вчерашние приёмы пищи</h3>
            
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {yesterdayMeals.map((meal, index) => (
                <div key={index} className="p-3 bg-sand/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone">{meal.name}</span>
                    <span className="text-sm text-ink-light">{meal.calories} ккал</span>
                  </div>
                  <div className="text-xs text-ink-light mt-1">
                    Б: {meal.protein}г | У: {meal.carbs}г | Ж: {meal.fat}г
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="neu-button-secondary flex-1 py-3"
              >
                Отмена
              </button>
              <button
                onClick={handleCopy}
                className="neu-button flex-1 py-3"
              >
                Копировать всё
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * DailySummary - Итоги дня
 */
const DailySummary = ({ meals }) => {
  const allMeals = Object.values(meals).flat();
  const totalCalories = allMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = allMeals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = allMeals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = allMeals.reduce((sum, meal) => sum + meal.fat, 0);
  const totalFiber = allMeals.reduce((sum, meal) => sum + meal.fiber, 0);

  const targets = {
    calories: 2200,
    protein: 180,
    carbs: 250,
    fat: 85,
    fiber: 35,
  };

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Итоги дня</h3>

      <div className="space-y-4">
        {/* Calories */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone">Калории</span>
            <span className="text-sm font-bold text-stone">{totalCalories} / {targets.calories}</span>
          </div>
          <div className="h-3 bg-sand rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                totalCalories <= targets.calories ? 'bg-emerald-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min((totalCalories / targets.calories) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Protein */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone">Белки</span>
            <span className="text-sm font-bold text-emerald-600">{totalProtein.toFixed(1)} / {targets.protein}г</span>
          </div>
          <div className="h-3 bg-sand rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.min((totalProtein / targets.protein) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone">Углеводы</span>
            <span className="text-sm font-bold text-amber-600">{totalCarbs.toFixed(1)} / {targets.carbs}г</span>
          </div>
          <div className="h-3 bg-sand rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${Math.min((totalCarbs / targets.carbs) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Fat */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone">Жиры</span>
            <span className="text-sm font-bold text-red-600">{totalFat.toFixed(1)} / {targets.fat}г</span>
          </div>
          <div className="h-3 bg-sand rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 rounded-full transition-all"
              style={{ width: `${Math.min((totalFat / targets.fat) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Fiber */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone">Клетчатка</span>
            <span className="text-sm font-bold text-violet-600">{totalFiber.toFixed(1)} / {targets.fiber}г</span>
          </div>
          <div className="h-3 bg-sand rounded-full overflow-hidden">
            <div 
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${Math.min((totalFiber / targets.fiber) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-stone/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-stone">{allMeals.length}</div>
          <div className="text-xs text-ink-light">Приёмов</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-stone">
            {allMeals.length > 0 ? (totalCalories / allMeals.length).toFixed(0) : 0}
          </div>
          <div className="text-xs text-ink-light">Среднее</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-stone">
            {((totalProtein * 4 + totalCarbs * 4 + totalFat * 9) / totalCalories * 100).toFixed(0) || 0}%
          </div>
          <div className="text-xs text-ink-light">Заполнено</div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const FoodDiaryV1 = () => {
  const [meals, setMeals] = useState(generateMealsByType());
  const [yesterdayMeals] = useState(generateYesterdayMeals());
  const [calorieTimeline] = useState(generateCalorieTimeline());
  const [weeklyComparison] = useState(generateWeeklyComparison());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');

  const handleAddMeal = (type) => {
    setSelectedMealType(type);
    setModalOpen(true);
  };

  const handleSaveMeal = (meal) => {
    setMeals(prev => ({
      ...prev,
      [meal.type]: [...prev[meal.type], meal],
    }));
  };

  const handleDeleteMeal = (mealId) => {
    setMeals(prev => {
      const updated = {};
      Object.keys(prev).forEach(key => {
        updated[key] = prev[key].filter(m => m.id !== mealId);
      });
      return updated;
    });
  };

  const handleCopyFromYesterday = (mealsToCopy) => {
    const newMeals = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    mealsToCopy.forEach(meal => {
      newMeals[meal.type].push({
        ...meal,
        id: Date.now() + Math.random(),
        time: '12:00',
        icon: '🍽️',
        fiber: 0,
        notes: 'Скопировано',
      });
    });
    setMeals(prev => ({
      ...prev,
      ...newMeals,
    }));
  };

  const allMeals = Object.values(meals).flat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">📝</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">Дневник питания</h1>
                <p className="text-ink-light">Записывайте всё, что съели</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/nutrition-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Обзор
            </Link>
            <CopyFromYesterday yesterdayMeals={yesterdayMeals} onCopy={handleCopyFromYesterday} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Meal Sections */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(MEAL_TYPES).map(([type]) => (
              <MealSection
                key={type}
                type={type}
                meals={meals[type]}
                onAdd={handleAddMeal}
                onDelete={handleDeleteMeal}
              />
            ))}
          </div>

          {/* Right Column - Stats & Charts */}
          <div className="space-y-6">
            <DailySummary meals={meals} />
            <MacroBreakdown meals={Object.values(meals)} />
            <CalorieTimelineChart data={calorieTimeline} />
            
            {/* Weekly Comparison */}
            <div className="neu-card p-6">
              <h3 className="text-xl font-bold text-stone mb-6">Сравнение с прошлой неделей</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5c5243' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#5c5243' }} />
                    <Tooltip />
                    <Bar dataKey="thisWeek" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="lastWeek" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      <AddMealModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mealType={selectedMealType}
        onAdd={handleSaveMeal}
      />
    </div>
  );
};

export default FoodDiaryV1;
