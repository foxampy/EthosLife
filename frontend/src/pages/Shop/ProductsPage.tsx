import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ShoppingCart, Star, ChevronDown,
  Pill, Watch, Dumbbell, Brain, Moon, BookOpen, Box,
  SlidersHorizontal, X
} from 'lucide-react';
import { NeuButton, NeuCard, NeuInput } from '../../components/Neumorphism';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  rating: number;
  reviews_count: number;
  stock_quantity?: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'supplements': <Pill className="w-5 h-5" />,
  'wearables': <Watch className="w-5 h-5" />,
  'fitness': <Dumbbell className="w-5 h-5" />,
  'meditation': <Brain className="w-5 h-5" />,
  'sleep': <Moon className="w-5 h-5" />,
  'books': <BookOpen className="w-5 h-5" />,
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  
  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [showFilters, setShowFilters] = useState(false);
  
  const limit = 12;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCartCount();
  }, [selectedCategory, sort, offset, searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (search) params.set('search', search);
      params.set('sort', sort);
      params.set('limit', limit.toString());
      params.set('offset', offset.toString());

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.products);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await api.get('/cart');
      setCartCount(response.data.itemCount || 0);
    } catch (error) {
      // Guest cart might fail without session
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    setSearchParams(params);
    setOffset(0);
  };

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === selectedCategory) {
      setSelectedCategory('');
      params.delete('category');
    } else {
      setSelectedCategory(categoryId);
      params.set('category', categoryId);
    }
    setSearchParams(params);
    setOffset(0);
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      setCartCount(prev => prev + 1);
      // Could show toast here
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <NeuCard className="overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div 
          className="relative aspect-square overflow-hidden cursor-pointer bg-[#d4cfc5]"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Box className="w-16 h-16 text-[#a39a8b]" />
            </div>
          )}
          {product.compare_at_price && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg">
              Sale
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-1 mb-2">
            {categoryIcons[product.category?.toLowerCase()] || <Box className="w-4 h-4" />}
            <span className="text-xs text-[#7a7268] capitalize">{product.category}</span>
          </div>
          
          <h3 
            className="font-semibold text-[#2d2418] mb-1 line-clamp-2 cursor-pointer hover:text-[#5c5243]"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm text-[#5c5243]">
              {product.rating?.toFixed(1) || '5.0'}
            </span>
            <span className="text-sm text-[#a39a8b]">
              ({product.reviews_count || 0})
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#5c5243]">
                ${product.price}
              </span>
              {product.compare_at_price && (
                <span className="text-sm text-[#a39a8b] line-through">
                  ${product.compare_at_price}
                </span>
              )}
            </div>
            
            <NeuButton
              size="sm"
              onClick={() => handleAddToCart(product.id)}
              disabled={product.stock_quantity === 0}
            >
              Add
            </NeuButton>
          </div>
        </div>
      </NeuCard>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#e4dfd5] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#e4dfd5]/95 backdrop-blur-sm border-b border-[#d4cfc5]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-xl font-bold text-[#2d2418]"
            >
              EthosLife
            </button>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a7268]" />
                <NeuInput
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <NeuButton
                variant="flat"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'text-[#5c5243]' : ''}
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </NeuButton>
              
              <NeuButton
                variant="flat"
                size="sm"
                onClick={() => navigate('/cart')}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#5c5243] text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </NeuButton>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap
                  transition-all duration-200
                  ${selectedCategory === cat.id
                    ? 'bg-[#5c5243] text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
                    : 'bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.55)]'
                  }
                `}
              >
                {categoryIcons[cat.id] || <Box className="w-4 h-4" />}
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="shrink-0 overflow-hidden"
              >
                <NeuCard className="h-fit">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#2d2418]">Filters</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-5 h-5 text-[#7a7268]" />
                    </button>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-[#5c5243] mb-3">Price Range</h4>
                    <div className="flex items-center gap-2">
                      <NeuInput
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-24"
                      />
                      <span className="text-[#7a7268]">-</span>
                      <NeuInput
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-24"
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-[#5c5243] mb-3">Sort By</h4>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="w-full p-3 bg-[#e4dfd5] rounded-xl border-none shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)] focus:outline-none focus:ring-2 focus:ring-[#5c5243]/30"
                    >
                      <option value="newest">Newest</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>

                  <NeuButton 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                      setSelectedCategory('');
                      setSort('newest');
                    }}
                  >
                    Clear Filters
                  </NeuButton>
                </NeuCard>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#7a7268]">
                Showing {products.length} of {total} products
              </p>
              
              {/* Mobile Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#7a7268]">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="p-2 bg-[#e4dfd5] rounded-lg border-none shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)] text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price ↑</option>
                  <option value="price_desc">Price ↓</option>
                  <option value="popular">Popular</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-[#d4cfc5] rounded-3xl mb-4" />
                    <div className="h-4 bg-[#d4cfc5] rounded mb-2" />
                    <div className="h-4 bg-[#d4cfc5] rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Box className="w-16 h-16 text-[#a39a8b] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#2d2418] mb-2">No products found</h3>
                <p className="text-[#7a7268]">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {total > limit && (
                  <div className="flex justify-center gap-2 mt-8">
                    <NeuButton
                      variant="flat"
                      size="sm"
                      onClick={() => setOffset(Math.max(0, offset - limit))}
                      disabled={offset === 0}
                    >
                      Previous
                    </NeuButton>
                    <span className="px-4 py-2 text-[#5c5243]">
                      Page {Math.floor(offset / limit) + 1} of {Math.ceil(total / limit)}
                    </span>
                    <NeuButton
                      variant="flat"
                      size="sm"
                      onClick={() => setOffset(offset + limit)}
                      disabled={offset + limit >= total}
                    >
                      Next
                    </NeuButton>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
