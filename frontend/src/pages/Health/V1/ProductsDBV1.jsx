import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';

/**
 * ProductsDBV1 - База продуктов
 * /health/nutrition/products-v1
 * 
 * Функционал:
 * - Поиск продуктов
 * - Фильтры (категория, калорийность)
 * - Карточки продуктов
 * - Пищевая ценность
 * - Частое использование
 * - Добавить свой продукт
 */

// ============================================
// MOCK DATA
// ============================================

const generateProducts = () => [
  // Белки
  { id: 1, name: 'Куриная грудка', category: 'protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, serving: '100г', icon: '🍗', barcode: '123456789' },
  { id: 2, name: 'Лосось филе', category: 'protein', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, serving: '100г', icon: '🐟', barcode: '123456790' },
  { id: 3, name: 'Яйца куриные', category: 'protein', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, serving: '100г', icon: '🥚', barcode: '123456791' },
  { id: 4, name: 'Творог 5%', category: 'protein', calories: 121, protein: 17, carbs: 1.8, fat: 5, fiber: 0, serving: '100г', icon: '🧀', barcode: '123456792' },
  { id: 5, name: 'Говядина постная', category: 'protein', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, serving: '100г', icon: '🥩', barcode: '123456793' },
  { id: 6, name: 'Тунец консервы', category: 'protein', calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0, serving: '100г', icon: '🐟', barcode: '123456794' },
  { id: 7, name: 'Индейка филе', category: 'protein', calories: 135, protein: 29, carbs: 0, fat: 1, fiber: 0, serving: '100г', icon: '🦃', barcode: '123456795' },
  { id: 8, name: 'Креветки', category: 'protein', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, serving: '100г', icon: '🍤', barcode: '123456796' },
  
  // Углеводы
  { id: 9, name: 'Овсянка', category: 'carbs', calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, serving: '100г', icon: '🥣', barcode: '123456797' },
  { id: 10, name: 'Рис бурый', category: 'carbs', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, serving: '100г', icon: '🍚', barcode: '123456798' },
  { id: 11, name: 'Гречка', category: 'carbs', calories: 343, protein: 13, carbs: 72, fat: 3.4, fiber: 10, serving: '100г', icon: '🌾', barcode: '123456799' },
  { id: 12, name: 'Паста цельнозерновая', category: 'carbs', calories: 124, protein: 5, carbs: 25, fat: 1.1, fiber: 3.2, serving: '100г', icon: '🍝', barcode: '123456800' },
  { id: 13, name: 'Хлеб цельнозерновой', category: 'carbs', calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, serving: '100г', icon: '🍞', barcode: '123456801' },
  { id: 14, name: 'Картофель', category: 'carbs', calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, serving: '100г', icon: '🥔', barcode: '123456802' },
  { id: 15, name: 'Киноа', category: 'carbs', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, serving: '100г', icon: '🌱', barcode: '123456803' },
  { id: 16, name: 'Бананы', category: 'carbs', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, serving: '100г', icon: '🍌', barcode: '123456804' },
  
  // Жиры
  { id: 17, name: 'Авокадо', category: 'fats', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, serving: '100г', icon: '🥑', barcode: '123456805' },
  { id: 18, name: 'Орехи грецкие', category: 'fats', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 7, serving: '100г', icon: '🥜', barcode: '123456806' },
  { id: 19, name: 'Миндаль', category: 'fats', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, serving: '100г', icon: '🌰', barcode: '123456807' },
  { id: 20, name: 'Оливковое масло', category: 'fats', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, serving: '100г', icon: '🫒', barcode: '123456808' },
  { id: 21, name: 'Арахисовая паста', category: 'fats', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, serving: '100г', icon: '🥜', barcode: '123456809' },
  { id: 22, name: 'Семена чиа', category: 'fats', calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, serving: '100г', icon: '🌱', barcode: '123456810' },
  
  // Овощи
  { id: 23, name: 'Брокколи', category: 'vegetables', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, serving: '100г', icon: '🥦', barcode: '123456811' },
  { id: 24, name: 'Шпинат', category: 'vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, serving: '100г', icon: '🥬', barcode: '123456812' },
  { id: 25, name: 'Помидоры', category: 'vegetables', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, serving: '100г', icon: '🍅', barcode: '123456813' },
  { id: 26, name: 'Огурцы', category: 'vegetables', calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, serving: '100г', icon: '🥒', barcode: '123456814' },
  { id: 27, name: 'Перец болгарский', category: 'vegetables', calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, serving: '100г', icon: '🫑', barcode: '123456815' },
  { id: 28, name: 'Морковь', category: 'vegetables', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, serving: '100г', icon: '🥕', barcode: '123456816' },
  
  // Фрукты
  { id: 29, name: 'Яблоки', category: 'fruits', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, serving: '100г', icon: '🍎', barcode: '123456817' },
  { id: 30, name: 'Апельсины', category: 'fruits', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, serving: '100г', icon: '🍊', barcode: '123456818' },
  { id: 31, name: 'Клубника', category: 'fruits', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, serving: '100г', icon: '🍓', barcode: '123456819' },
  { id: 32, name: 'Черника', category: 'fruits', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, serving: '100г', icon: '🫐', barcode: '123456820' },
  { id: 33, name: 'Виноград', category: 'fruits', calories: 67, protein: 0.6, carbs: 17, fat: 0.4, fiber: 0.9, serving: '100г', icon: '🍇', barcode: '123456821' },
  
  // Молочные
  { id: 34, name: 'Молоко 2.5%', category: 'dairy', calories: 52, protein: 3, carbs: 4.8, fat: 2.5, fiber: 0, serving: '100мл', icon: '🥛', barcode: '123456822' },
  { id: 35, name: 'Йогурт греческий', category: 'dairy', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, serving: '100г', icon: '🥛', barcode: '123456823' },
  { id: 36, name: 'Сыр моцарелла', category: 'dairy', calories: 280, protein: 28, carbs: 3, fat: 17, fiber: 0, serving: '100г', icon: '🧀', barcode: '123456824' },
  { id: 37, name: 'Кефир 1%', category: 'dairy', calories: 40, protein: 3, carbs: 4, fat: 1, fiber: 0, serving: '100мл', icon: '🥛', barcode: '123456825' },
];

const CATEGORIES = [
  { id: 'all', label: 'Все', icon: '🛒', color: 'bg-stone-500' },
  { id: 'protein', label: 'Белки', icon: '🥩', color: 'bg-red-500' },
  { id: 'carbs', label: 'Углеводы', icon: '🍞', color: 'bg-amber-500' },
  { id: 'fats', label: 'Жиры', icon: '🥑', color: 'bg-green-500' },
  { id: 'vegetables', label: 'Овощи', icon: '🥬', color: 'bg-emerald-500' },
  { id: 'fruits', label: 'Фрукты', icon: '🍎', color: 'bg-pink-500' },
  { id: 'dairy', label: 'Молочные', icon: '🥛', color: 'bg-blue-500' },
];

const generateFrequentProducts = () => [
  { id: 1, name: 'Овсянка', uses: 45, lastUsed: 'Сегодня' },
  { id: 2, name: 'Куриная грудка', uses: 38, lastUsed: 'Вчера' },
  { id: 3, name: 'Яйца', uses: 32, lastUsed: 'Сегодня' },
  { id: 4, name: 'Бананы', uses: 28, lastUsed: '2 дня назад' },
  { id: 5, name: 'Творог', uses: 24, lastUsed: 'Вчера' },
];

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * ProductCard - Карточка продукта
 */
const ProductCard = ({ product, onSelect, onAddToFrequent }) => {
  const getCategoryColor = (category) => {
    const cat = CATEGORIES.find(c => c.id === category);
    return cat?.color || 'bg-gray-500';
  };

  return (
    <div 
      className="neu-card p-4 hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => onSelect(product)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">{product.icon}</span>
          <div>
            <h3 className="font-bold text-stone group-hover:text-ink transition-colors">{product.name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full text-white ${getCategoryColor(product.category)}`}>
              {CATEGORIES.find(c => c.id === product.category)?.label}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToFrequent?.(product);
          }}
          className="p-2 rounded-lg hover:bg-sand text-ink-light hover:text-amber-500 transition-colors"
          title="Добавить в частые"
        >
          ⭐
        </button>
      </div>

      {/* Calories */}
      <div className="mb-3 p-3 bg-sand/50 rounded-xl">
        <div className="text-center">
          <div className="text-2xl font-bold text-stone">{product.calories}</div>
          <div className="text-xs text-ink-light">ккал / {product.serving}</div>
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-emerald-50 rounded-lg">
          <div className="text-sm font-bold text-emerald-600">{product.protein}г</div>
          <div className="text-xs text-ink-light">Б</div>
        </div>
        <div className="p-2 bg-amber-50 rounded-lg">
          <div className="text-sm font-bold text-amber-600">{product.carbs}г</div>
          <div className="text-xs text-ink-light">У</div>
        </div>
        <div className="p-2 bg-red-50 rounded-lg">
          <div className="text-sm font-bold text-red-600">{product.fat}г</div>
          <div className="text-xs text-ink-light">Ж</div>
        </div>
      </div>

      {/* Barcode */}
      {product.barcode && (
        <div className="mt-3 pt-3 border-t border-stone/10 text-center">
          <div className="text-xs text-ink-light font-mono">{product.barcode}</div>
        </div>
      )}
    </div>
  );
};

/**
 * ProductDetail - Детальная информация о продукте
 */
const ProductDetail = ({ product, onClose, onAddToDiary }) => {
  const [servingSize, setServingSize] = useState(100);

  if (!product) return null;

  const multipliers = servingSize / 100;
  const nutrition = {
    calories: Math.round(product.calories * multipliers),
    protein: (product.protein * multipliers).toFixed(1),
    carbs: (product.carbs * multipliers).toFixed(1),
    fat: (product.fat * multipliers).toFixed(1),
    fiber: (product.fiber * multipliers).toFixed(1),
  };

  const macroData = [
    { name: 'Белки', value: parseFloat(nutrition.protein), color: '#10b981' },
    { name: 'Жиры', value: parseFloat(nutrition.fat), color: '#ef4444' },
    { name: 'Углеводы', value: parseFloat(nutrition.carbs), color: '#f59e0b' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neu-card w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-5xl">{product.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-stone">{product.name}</h2>
              <span className="text-sm text-ink-light">{CATEGORIES.find(c => c.id === product.category)?.label}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-sand flex items-center justify-center text-xl">
            ✕
          </button>
        </div>

        {/* Serving Size Selector */}
        <div className="mb-6 p-4 bg-sand/50 rounded-xl">
          <label className="block text-sm font-semibold text-stone mb-3">Размер порции</label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setServingSize(Math.max(50, servingSize - 50))}
              className="w-10 h-10 rounded-full bg-stone text-white flex items-center justify-center font-bold"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <input
                type="number"
                value={servingSize}
                onChange={(e) => setServingSize(parseInt(e.target.value) || 0)}
                className="neu-input text-center w-32"
              />
              <div className="text-xs text-ink-light mt-1">грамм</div>
            </div>
            <button
              onClick={() => setServingSize(servingSize + 50)}
              className="w-10 h-10 rounded-full bg-stone text-white flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Nutrition Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Calories */}
          <div className="text-center p-4 bg-amber-50 rounded-xl">
            <div className="text-4xl font-bold text-amber-600">{nutrition.calories}</div>
            <div className="text-sm text-ink-light mt-1">ккал</div>
          </div>

          {/* Pie Chart */}
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Macros */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
            <span className="text-stone">🥩 Белки</span>
            <span className="font-bold text-emerald-600">{nutrition.protein}г</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
            <span className="text-stone">🍞 Углеводы</span>
            <span className="font-bold text-amber-600">{nutrition.carbs}г</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
            <span className="text-stone">🥑 Жиры</span>
            <span className="font-bold text-red-600">{nutrition.fat}г</span>
          </div>
          {product.fiber > 0 && (
            <div className="flex items-center justify-between p-3 bg-violet-50 rounded-xl">
              <span className="text-stone">🌾 Клетчатка</span>
              <span className="font-bold text-violet-600">{nutrition.fiber}г</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              onAddToDiary?.({ ...product, serving: servingSize, nutrition });
              onClose();
            }}
            className="neu-button flex-1 py-3"
          >
            Добавить в дневник
          </button>
          <button className="neu-button-secondary px-4 py-3">
            📷 Сканировать
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * FrequentProducts - Частые продукты
 */
const FrequentProducts = ({ products, onSelect }) => {
  return (
    <div className="neu-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-stone">Частые продукты</h3>
        <Link to="/health/nutrition/diary-v1" className="text-sm font-medium text-stone hover:text-ink">
          Все →
        </Link>
      </div>
      <div className="space-y-3">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-sand/50 rounded-xl hover:bg-sand transition-all cursor-pointer"
            onClick={() => onSelect(product)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="font-medium text-stone">{product.name}</div>
                <div className="text-xs text-ink-light">
                  Использован {product.uses} раз • {product.lastUsed}
                </div>
              </div>
            </div>
            <button className="neu-button-secondary px-3 py-1 text-sm">
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * CategoryNutritionChart - График по категориям
 */
const CategoryNutritionChart = ({ products }) => {
  const categoryData = CATEGORIES.filter(c => c.id !== 'all').map(cat => {
    const catProducts = products.filter(p => p.category === cat.id);
    const avgCalories = catProducts.length > 0 
      ? Math.round(catProducts.reduce((sum, p) => sum + p.calories, 0) / catProducts.length)
      : 0;
    return {
      name: cat.label,
      calories: avgCalories,
      count: catProducts.length,
    };
  });

  return (
    <div className="neu-card p-6">
      <h3 className="text-xl font-bold text-stone mb-6">Калорийность по категориям</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" opacity={0.5} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5c5243' }} />
            <YAxis tick={{ fontSize: 11, fill: '#5c5243' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fefae8',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="calories" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const ProductsDBV1 = () => {
  const [products] = useState(generateProducts());
  const [frequentProducts] = useState(generateFrequentProducts());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'calories': return a.calories - b.calories;
        case 'protein': return b.protein - a.protein;
        case 'carbs': return a.carbs - b.carbs;
        case 'fat': return a.fat - b.fat;
        default: return a.name.localeCompare(b.name);
      }
    });

  const handleAddToFrequent = (product) => {
    console.log('Adding to frequent:', product);
    // Здесь будет логика добавления в частые
  };

  const handleAddToDiary = (productData) => {
    console.log('Adding to diary:', productData);
    // Здесь будет логика добавления в дневник
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-stone/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">🛒</span>
              <div>
                <h1 className="text-3xl font-bold text-stone">База продуктов</h1>
                <p className="text-ink-light">{products.length} продуктов в базе</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/health/nutrition-v1" className="neu-button-secondary px-4 py-2 rounded-xl font-medium">
              Обзор
            </Link>
            <button className="neu-button px-4 py-2 rounded-xl font-medium">
              + Добавить продукт
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FrequentProducts products={frequentProducts} onSelect={setSelectedProduct} />
            <CategoryNutritionChart products={products} />
          </div>

          {/* Main Area */}
          <div className="lg:col-span-3">
            {/* Search & Filters */}
            <div className="neu-card p-6 mb-6">
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Поиск продуктов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="neu-input w-full pl-12 pr-4 py-3"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedCategory === cat.id
                        ? `${cat.color} text-white shadow-md`
                        : 'bg-sand/50 text-stone hover:bg-sand'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-light">
                  Найдено: <span className="font-bold text-stone">{filteredProducts.length}</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="neu-input"
                >
                  <option value="name">По названию</option>
                  <option value="calories">По калориям</option>
                  <option value="protein">По белку</option>
                  <option value="carbs">По углеводам</option>
                  <option value="fat">По жирам</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setSelectedProduct}
                  onAddToFrequent={handleAddToFrequent}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 neu-card">
                <span className="text-6xl block mb-4">🔍</span>
                <h3 className="text-xl font-bold text-stone mb-2">Ничего не найдено</h3>
                <p className="text-ink-light">Попробуйте изменить поисковый запрос</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToDiary={handleAddToDiary}
        />
      )}
    </div>
  );
};

export default ProductsDBV1;
