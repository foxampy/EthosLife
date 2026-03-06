import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

/**
 * RecipesV1 - Рецепты
 * /health/nutrition/recipes-v1
 * 
 * Функционал:
 * - Поиск рецептов
 * - Фильтры (категория, время, сложность, макросы)
 * - Карточки рецептов с фото
 * - Детальная информация
 * - Избранное
 * - Добавить свой рецепт
 */

// ============================================
// MOCK DATA
// ============================================

const generateRecipes = () => [
  {
    id: 1,
    name: 'Протеиновые панкейки',
    description: 'Воздушные панкейки с высоким содержанием белка для идеального завтрака',
    calories: 380,
    protein: 28,
    carbs: 42,
    fat: 10,
    fiber: 4,
    time: 15,
    servings: 2,
    difficulty: 'easy',
    category: 'breakfast',
    image: '🥞',
    ingredients: [
      { name: 'Протеин ванильный', amount: '30г' },
      { name: 'Яйца', amount: '2 шт' },
      { name: 'Овсяная мука', amount: '50г' },
      { name: 'Банан', amount: '1 шт' },
      { name: 'Разрыхлитель', amount: '1 ч.л.' },
    ],
    instructions: [
      'Смешайте все сухие ингредиенты',
      'Добавьте яйца и размятый банан',
      'Перемешайте до однородности',
      'Жарьте на сухой сковороде 2-3 минуты с каждой стороны',
    ],
    tags: ['высокий белок', 'завтрак', 'быстро'],
    rating: 4.8,
    reviews: 124,
    author: 'Chef Anna',
    isFavorite: true,
  },
  {
    id: 2,
    name: 'Боул с лососем и киноа',
    description: 'Питательный боул с запечённым лососем, киноа и свежими овощами',
    calories: 520,
    protein: 35,
    carbs: 48,
    fat: 22,
    fiber: 8,
    time: 25,
    servings: 1,
    difficulty: 'medium',
    category: 'lunch',
    image: '🥗',
    ingredients: [
      { name: 'Лосось филе', amount: '150г' },
      { name: 'Киноа', amount: '60г' },
      { name: 'Авокадо', amount: '½ шт' },
      { name: 'Огурец', amount: '1 шт' },
      { name: 'Эдамаме', amount: '50г' },
      { name: 'Соус понзу', amount: '2 ст.л.' },
    ],
    instructions: [
      'Отварите киноа согласно инструкции',
      'Запеките лосось при 200°C 12-15 минут',
      'Нарежьте овощи',
      'Соберите боул, полейте соусом',
    ],
    tags: ['омега-3', 'обед', 'полезно'],
    rating: 4.9,
    reviews: 89,
    author: 'Healthy Kitchen',
    isFavorite: true,
  },
  {
    id: 3,
    name: 'Курица терияки с брокколи',
    description: 'Азиатская классика - курица в соусе терияки с паровой брокколи',
    calories: 480,
    protein: 42,
    carbs: 38,
    fat: 16,
    fiber: 5,
    time: 30,
    servings: 2,
    difficulty: 'medium',
    category: 'dinner',
    image: '🍗',
    ingredients: [
      { name: 'Куриное филе', amount: '400г' },
      { name: 'Брокколи', amount: '300г' },
      { name: 'Соус терияки', amount: '60мл' },
      { name: 'Рис жасмин', amount: '100г' },
      { name: 'Кунжут', amount: '1 ст.л.' },
      { name: 'Имбирь', amount: '10г' },
    ],
    instructions: [
      'Нарежьте курицу кубиками',
      'Обжарьте курицу до золотистой корочки',
      'Добавьте соус терияки и тушите 5 минут',
      'Приготовьте брокколи на пару',
      'Подавайте с рисом, посыпав кунжутом',
    ],
    tags: ['азиатская', 'ужин', 'высокий белок'],
    rating: 4.7,
    reviews: 156,
    author: 'Asian Fusion',
    isFavorite: false,
  },
  {
    id: 4,
    name: 'Зелёный детокс смузи',
    description: 'Освежающий смузи для очищения и заряда энергией',
    calories: 220,
    protein: 12,
    carbs: 32,
    fat: 6,
    fiber: 8,
    time: 5,
    servings: 1,
    difficulty: 'easy',
    category: 'snack',
    image: '🥤',
    ingredients: [
      { name: 'Шпинат', amount: '50г' },
      { name: 'Банан', amount: '1 шт' },
      { name: 'Яблоко зелёное', amount: '1 шт' },
      { name: 'Огурец', amount: '½ шт' },
      { name: 'Имбирь', amount: '5г' },
      { name: 'Вода кокосовая', amount: '200мл' },
    ],
    instructions: [
      'Промойте все ингредиенты',
      'Нарежьте фрукты и огурец',
      'Поместите всё в блендер',
      'Взбивайте до однородности 1-2 минуты',
    ],
    tags: ['детокс', 'веган', 'быстро'],
    rating: 4.6,
    reviews: 78,
    author: 'Green Life',
    isFavorite: false,
  },
  {
    id: 5,
    name: 'Овсянка overnight с ягодами',
    description: 'Ленивая овсянка, приготовленная с вечера - идеальный завтрак',
    calories: 350,
    protein: 14,
    carbs: 58,
    fat: 8,
    fiber: 10,
    time: 5,
    servings: 1,
    difficulty: 'easy',
    category: 'breakfast',
    image: '🥣',
    ingredients: [
      { name: 'Овсяные хлопья', amount: '60г' },
      { name: 'Йогурт греческий', amount: '150г' },
      { name: 'Молоко миндальное', amount: '100мл' },
      { name: 'Ягоды микс', amount: '100г' },
      { name: 'Мёд', amount: '1 ст.л.' },
      { name: 'Семена чиа', amount: '1 ч.л.' },
    ],
    instructions: [
      'Смешайте овсянку с йогуртом и молоком',
      'Добавьте семена чиа',
      'Уберите в холодильник на ночь',
      'Утром добавьте ягоды и мёд',
    ],
    tags: ['завтрак', 'подготовка', 'вегетарианский'],
    rating: 4.8,
    reviews: 203,
    author: 'Morning Delights',
    isFavorite: true,
  },
  {
    id: 6,
    name: 'Стейк из говядины с овощами',
    description: 'Сочный стейк рибай с запечёнными сезонными овощами',
    calories: 680,
    protein: 52,
    carbs: 22,
    fat: 42,
    fiber: 6,
    time: 40,
    servings: 2,
    difficulty: 'hard',
    category: 'dinner',
    image: '🥩',
    ingredients: [
      { name: 'Говядина рибай', amount: '400г' },
      { name: 'Спаржа', amount: '200г' },
      { name: 'Перец болгарский', amount: '2 шт' },
      { name: 'Цукини', amount: '1 шт' },
      { name: 'Оливковое масло', amount: '2 ст.л.' },
      { name: 'Розмарин', amount: '2 веточки' },
    ],
    instructions: [
      'Достаньте мясо за 30 минут до готовки',
      'Разогрейте гриль или сковороду',
      'Жарьте стейк 4-5 минут с каждой стороны',
      'Запеките овощи с маслом и розмарином',
      'Дайте мясу отдохнуть 5 минут перед подачей',
    ],
    tags: ['кето', 'высокий белок', 'ужин'],
    rating: 4.9,
    reviews: 67,
    author: 'Meat Master',
    isFavorite: false,
  },
  {
    id: 7,
    name: 'Творожная запеканка',
    description: 'Классическая творожная запеканка как в детстве',
    calories: 420,
    protein: 28,
    carbs: 42,
    fat: 15,
    fiber: 2,
    time: 50,
    servings: 6,
    difficulty: 'medium',
    category: 'breakfast',
    image: '🧀',
    ingredients: [
      { name: 'Творог 5%', amount: '500г' },
      { name: 'Яйца', amount: '3 шт' },
      { name: 'Манка', amount: '60г' },
      { name: 'Сахар', amount: '80г' },
      { name: 'Сметана', amount: '100г' },
      { name: 'Ванилин', amount: '1 щепотка' },
    ],
    instructions: [
      'Протрите творог через сито',
      'Взбейте яйца с сахаром',
      'Смешайте все ингредиенты',
      'Выпекайте при 180°C 40 минут',
    ],
    tags: ['завтрак', 'выпечка', 'семейный'],
    rating: 4.7,
    reviews: 312,
    author: 'Бабушкины рецепты',
    isFavorite: true,
  },
  {
    id: 8,
    name: 'Салат с тунцом и авокадо',
    description: 'Лёгкий и сытный салат с тунцом для быстрого обеда',
    calories: 380,
    protein: 32,
    carbs: 12,
    fat: 24,
    fiber: 8,
    time: 10,
    servings: 1,
    difficulty: 'easy',
    category: 'lunch',
    image: '🥗',
    ingredients: [
      { name: 'Тунец в собственном соку', amount: '150г' },
      { name: 'Авокадо', amount: '1 шт' },
      { name: 'Яйцо варёное', amount: '2 шт' },
      { name: 'Салат микс', amount: '50г' },
      { name: 'Помидоры черри', amount: '8 шт' },
      { name: 'Оливковое масло', amount: '1 ст.л.' },
    ],
    instructions: [
      'Нарежьте авокадо и яйца',
      'Слейте жидкость с тунца',
      'Соберите салат',
      'Заправьте маслом и лимонным соком',
    ],
    tags: ['кето', 'быстро', 'обед'],
    rating: 4.6,
    reviews: 94,
    author: 'Quick Meals',
    isFavorite: false,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Все', icon: '🍽️' },
  { id: 'breakfast', label: 'Завтраки', icon: '🌅' },
  { id: 'lunch', label: 'Обеды', icon: '☀️' },
  { id: 'dinner', label: 'Ужины', icon: '🌙' },
  { id: 'snack', label: 'Перекусы', icon: '🍿' },
  { id: 'dessert', label: 'Десерты', icon: '🍰' },
];

const DIFFICULTIES = [
  { id: 'all', label: 'Любая' },
  { id: 'easy', label: 'Легко', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'medium', label: 'Средне', color: 'bg-amber-100 text-amber-700' },
  { id: 'hard', label: 'Сложно', color: 'bg-red-100 text-red-700' },
];

const SORT_OPTIONS = [
  { id: 'popular', label: 'Популярные' },
  { id: 'rating', label: 'По рейтингу' },
  { id: 'time', label: 'По времени' },
  { id: 'calories', label: 'По калориям' },
  { id: 'protein', label: 'По белку' },
  { id: 'newest', label: 'Новые' },
];

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * RecipeCard - Карточка рецепта
 */
const RecipeCard = ({ recipe, onView, onToggleFavorite }) => {
  const difficultyConfig = DIFFICULTIES.find(d => d.id === recipe.difficulty);

  return (
    <div className="neu-card overflow-hidden hover:shadow-lg transition-all group">
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center relative">
        <span className="text-7xl">{recipe.image}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(recipe.id);
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            recipe.isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-400 hover:bg-red-100 hover:text-red-500'
          }`}
        >
          {recipe.isFavorite ? '❤️' : '🤍'}
        </button>
        <div className="absolute bottom-3 left-3 flex items-center space-x-2">
          <span className="px-2 py-1 bg-white/90 rounded-lg text-xs font-medium text-stone">
            ⏱️ {recipe.time} мин
          </span>
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${difficultyConfig?.color}`}>
            {difficultyConfig?.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-stone mb-2 line-clamp-1">{recipe.name}</h3>
        <p className="text-sm text-ink-light mb-3 line-clamp-2">{recipe.description}</p>

        {/* Macros */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="text-center p-2 bg-sand/50 rounded-lg">
            <div className="text-sm font-bold text-stone">{recipe.calories}</div>
            <div className="text-xs text-ink-light">ккал</div>
          </div>
          <div className="text-center p-2 bg-emerald-50 rounded-lg">
            <div className="text-sm font-bold text-emerald-600">{recipe.protein}г</div>
            <div className="text-xs text-ink-light">белки</div>
          </div>
          <div className="text-center p-2 bg-amber-50 rounded-lg">
            <div className="text-sm font-bold text-amber-600">{recipe.carbs}г</div>
            <div className="text-xs text-ink-light">углеводы</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <div className="text-sm font-bold text-red-600">{recipe.fat}г</div>
            <div className="text-xs text-ink-light">жиры</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium text-stone">{recipe.rating}</span>
            <span className="text-xs text-ink-light">({recipe.reviews})</span>
          </div>
          <button
            onClick={() => onView(recipe)}
            className="neu-button px-4 py-2 rounded-lg text-sm font-medium"
          >
            Рецепт →
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * RecipeDetail - Детальный просмотр рецепта
 */
const RecipeDetail = ({ recipe, onClose }) => {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [servings, setServings] = useState(recipe.servings);

  if (!recipe) return null;

  const difficultyConfig = DIFFICULTIES.find(d => d.id === recipe.difficulty);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="neu-card w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-6xl">{recipe.image}</span>
            <div>
              <h2 className="text-2xl font-bold text-stone mb-2">{recipe.name}</h2>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                  {CATEGORIES.find(c => c.id === recipe.category)?.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyConfig?.color}`}>
                  {difficultyConfig?.label}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-sand flex items-center justify-center text-xl"
          >
            ✕
          </button>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-sand/50 rounded-xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-stone">{recipe.calories}</div>
            <div className="text-xs text-ink-light">ккал</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{recipe.protein}г</div>
            <div className="text-xs text-ink-light">белки</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{recipe.carbs}г</div>
            <div className="text-xs text-ink-light">углеводы</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{recipe.fat}г</div>
            <div className="text-xs text-ink-light">жиры</div>
          </div>
        </div>

        {/* Servings Adjuster */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-medium text-stone">Порции:</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-8 h-8 rounded-full bg-sand flex items-center justify-center font-bold"
            >
              −
            </button>
            <span className="text-xl font-bold text-stone w-8 text-center">{servings}</span>
            <button
              onClick={() => setServings(servings + 1)}
              className="w-8 h-8 rounded-full bg-sand flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-stone/20">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'ingredients'
                ? 'text-stone border-b-2 border-stone'
                : 'text-ink-light hover:text-stone'
            }`}
          >
            Ингредиенты
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'instructions'
                ? 'text-stone border-b-2 border-stone'
                : 'text-ink-light hover:text-stone'
            }`}
          >
            Приготовление
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'info'
                ? 'text-stone border-b-2 border-stone'
                : 'text-ink-light hover:text-stone'
            }`}
          >
            Информация
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'ingredients' && (
          <div className="space-y-3">
            {recipe.ingredients.map((ing, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-sand/50 rounded-xl">
                <span className="text-stone">{ing.name}</span>
                <span className="font-medium text-stone">{ing.amount}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'instructions' && (
          <div className="space-y-4">
            {recipe.instructions.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-stone text-white flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-stone pt-1">{step}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-sand/50 rounded-xl">
                <div className="text-sm text-ink-light mb-1">Время приготовления</div>
                <div className="text-xl font-bold text-stone">{recipe.time} минут</div>
              </div>
              <div className="p-4 bg-sand/50 rounded-xl">
                <div className="text-sm text-ink-light mb-1">Порций</div>
                <div className="text-xl font-bold text-stone">{recipe.servings}</div>
              </div>
              <div className="p-4 bg-sand/50 rounded-xl">
                <div className="text-sm text-ink-light mb-1">Автор</div>
                <div className="text-xl font-bold text-stone">{recipe.author}</div>
              </div>
              <div className="p-4 bg-sand/50 rounded-xl">
                <div className="text-sm text-ink-light mb-1">Рейтинг</div>
                <div className="text-xl font-bold text-stone">⭐ {recipe.rating} ({recipe.reviews} отзывов)</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-ink-light mb-2">Теги</div>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 mt-6 pt-6 border-t border-stone/20">
          <button className="neu-button flex-1 py-3">
            Добавить в план
          </button>
          <button className="neu-button-secondary flex-1 py-3">
            В избранное
          </button>
          <button className="neu-button-secondary px-4 py-3">
            Поделиться
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * SearchFilters - Поиск и фильтры
 */
const SearchFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="neu-card p-6 mb-6">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск рецептов..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="neu-input w-full pl-12 pr-4 py-3"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
        </div>
      </div>

      {/* Filters Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-stone mb-2">Категория</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="neu-input w-full"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-stone mb-2">Сложность</label>
          <select
            value={filters.difficulty}
            onChange={(e) => onFilterChange('difficulty', e.target.value)}
            className="neu-input w-full"
          >
            {DIFFICULTIES.map(diff => (
              <option key={diff.id} value={diff.id}>{diff.label}</option>
            ))}
          </select>
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-semibold text-stone mb-2">Время</label>
          <select
            value={filters.time}
            onChange={(e) => onFilterChange('time', e.target.value)}
            className="neu-input w-full"
          >
            <option value="all">Любое</option>
            <option value="15">До 15 мин</option>
            <option value="30">До 30 мин</option>
            <option value="60">До 1 часа</option>
            <option value="60+">Более 1 часа</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-stone mb-2">Сортировка</label>
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="neu-input w-full"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters Row 2 - Macros */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-stone mb-2">Ккал макс</label>
          <input
            type="number"
            value={filters.maxCalories}
            onChange={(e) => onFilterChange('maxCalories', e.target.value)}
            className="neu-input w-full"
            placeholder="Любые"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone mb-2">Белок мин (г)</label>
          <input
            type="number"
            value={filters.minProtein}
            onChange={(e) => onFilterChange('minProtein', e.target.value)}
            className="neu-input w-full"
            placeholder="Любой"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone mb-2">Углеводы макс (г)</label>
          <input
            type="number"
            value={filters.maxCarbs}
            onChange={(e) => onFilterChange('maxCarbs', e.target.value)}
            className="neu-input w-full"
            placeholder="Любые"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone mb-2">Жиры макс (г)</label>
          <input
            type="number"
            value={filters.maxFat}
            onChange={(e) => onFilterChange('maxFat', e.target.value)}
            className="neu-input w-full"
            placeholder="Любые"
          />
        </div>
      </div>

      {/* Active Filters & Clear */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone/10">
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="px-3 py-1 bg-stone text-white rounded-full text-sm">
              Поиск: {filters.search} ✕
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="px-3 py-1 bg-stone text-white rounded-full text-sm">
              {CATEGORIES.find(c => c.id === filters.category)?.label} ✕
            </span>
          )}
        </div>
        <button
          onClick={() => onFilterChange('reset', {})}
          className="text-sm font-medium text-stone hover:text-ink"
        >
          Сбросить все фильтры
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const RecipesV1 = () => {
  const [recipes, setRecipes] = useState(generateRecipes());
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    difficulty: 'all',
    time: 'all',
    sort: 'popular',
    maxCalories: '',
    minProtein: '',
    maxCarbs: '',
    maxFat: '',
  });

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        search: '',
        category: 'all',
        difficulty: 'all',
        time: 'all',
        sort: 'popular',
        maxCalories: '',
        minProtein: '',
        maxCarbs: '',
        maxFat: '',
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleToggleFavorite = (recipeId) => {
    setRecipes(prev =>
      prev.map(r => r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r)
    );
  };

  // Filter recipes
  const filteredRecipes = recipes.filter(recipe => {
    if (filters.search && !recipe.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.category !== 'all' && recipe.category !== filters.category) return false;
    if (filters.difficulty !== 'all' && recipe.difficulty !== filters.difficulty) return false;
    if (filters.time !== 'all' && recipe.time > parseInt(filters.time)) return false;
    if (filters.maxCalories && recipe.calories > parseInt(filters.maxCalories)) return false;
    if (filters.minProtein && recipe.protein < parseInt(filters.minProtein)) return false;
    if (filters.maxCarbs && recipe.carbs > parseInt(filters.maxCarbs)) return false;
    if (filters.maxFat && recipe.fat > parseInt(filters.maxFat)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">👨‍🍳</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">Рецепты</h1>
                <p className="text-ink-light">Здоровые и вкусные блюда</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/nutrition-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Обзор
            </Link>
            <button className="neu-button px-4 py-2 rounded-xl font-medium">
              + Добавить рецепт
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <SearchFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-ink-light">
            Найдено: <span className="font-bold text-stone">{filteredRecipes.length}</span> рецептов
          </p>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg bg-stone text-white">▦</button>
            <button className="p-2 rounded-lg hover:bg-sand text-stone">☰</button>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={setSelectedRecipe}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🔍</span>
            <h3 className="text-xl font-bold text-stone mb-2">Ничего не найдено</h3>
            <p className="text-ink-light">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
};

export default RecipesV1;
