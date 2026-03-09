import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShoppingCart, Heart, Share2, Star, Minus, Plus,
  Truck, Shield, RotateCcw, Check, Box
} from 'lucide-react';
import { NeuButton, NeuCard, NeuButton as QuantityButton } from '../../components/Neumorphism';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

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
  sku: string;
  tags: string[];
  metadata?: {
    benefits?: string[];
    ingredients?: string;
    directions?: string;
  };
}

interface Review {
  id: string;
  rating: number;
  review: string;
  created_at: string;
  full_name: string;
  avatar_url?: string;
  is_verified_purchase: boolean;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
      setRelatedProducts(response.data.relatedProducts || []);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      await api.post('/cart/add', { productId: product.id, quantity });
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 99)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e4dfd5] flex items-center justify-center">
        <div className="animate-pulse text-[#5c5243]">Loading...</div>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.compare_at_price 
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#e4dfd5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#e4dfd5]/95 backdrop-blur-sm border-b border-[#d4cfc5]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NeuButton variant="flat" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </NeuButton>
            
            <div className="flex gap-2">
              <NeuButton variant="flat" size="sm">
                <Heart className="w-4 h-4" />
              </NeuButton>
              <NeuButton variant="flat" size="sm">
                <Share2 className="w-4 h-4" />
              </NeuButton>
              <NeuButton variant="flat" size="sm" onClick={() => navigate('/cart')}>
                <ShoppingCart className="w-4 h-4" />
              </NeuButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-3xl overflow-hidden bg-[#d4cfc5] shadow-[8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.6)]"
            >
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Box className="w-24 h-24 text-[#a39a8b]" />
                </div>
              )}
            </motion.div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`
                      w-20 h-20 rounded-xl overflow-hidden flex-shrink-0
                      ${selectedImage === idx 
                        ? 'ring-2 ring-[#5c5243] shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)]' 
                        : 'shadow-[2px_2px_4px_rgba(44,40,34,0.1),-2px_-2px_4px_rgba(255,255,255,0.5)]'
                      }
                    `}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-[#7a7268] uppercase tracking-wide">
                  {product.category}
                </span>
                {product.sku && (
                  <>
                    <span className="text-[#d4cfc5]">|</span>
                    <span className="text-sm text-[#a39a8b]">SKU: {product.sku}</span>
                  </>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-[#2d2418] mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-[#2d2418]">
                    {product.rating?.toFixed(1) || '5.0'}
                  </span>
                </div>
                <span className="text-[#7a7268]">
                  ({product.reviews_count} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-[#5c5243]">
                  ${product.price}
                </span>
                {product.compare_at_price && (
                  <>
                    <span className="text-xl text-[#a39a8b] line-through">
                      ${product.compare_at_price}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-lg">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Benefits */}
            {product.metadata?.benefits && (
              <div className="space-y-2">
                <h3 className="font-semibold text-[#2d2418]">Benefits</h3>
                <ul className="space-y-1">
                  {product.metadata.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[#5c5243]">
                      <Check className="w-4 h-4 text-green-600" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#d4cfc5]">
              <div className="flex items-center gap-2">
                <QuantityButton
                  variant="flat"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </QuantityButton>
                <span className="w-12 text-center font-semibold text-[#2d2418]">
                  {quantity}
                </span>
                <QuantityButton
                  variant="flat"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock_quantity || 99)}
                >
                  <Plus className="w-4 h-4" />
                </QuantityButton>
              </div>
              
              <NeuButton
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock_quantity === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </NeuButton>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]">
                <Truck className="w-6 h-6 text-[#5c5243] mb-1" />
                <span className="text-xs text-[#5c5243]">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]">
                <Shield className="w-6 h-6 text-[#5c5243] mb-1" />
                <span className="text-xs text-[#5c5243]">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]">
                <RotateCcw className="w-6 h-6 text-[#5c5243] mb-1" />
                <span className="text-xs text-[#5c5243]">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`
                px-6 py-3 rounded-2xl font-semibold transition-all
                ${activeTab === 'description'
                  ? 'bg-[#5c5243] text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
                  : 'bg-[#e4dfd5] text-[#5c5243] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.5)]'
                }
              `}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`
                px-6 py-3 rounded-2xl font-semibold transition-all
                ${activeTab === 'reviews'
                  ? 'bg-[#5c5243] text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
                  : 'bg-[#e4dfd5] text-[#5c5243] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.5)]'
                }
              `}
            >
              Reviews ({product.reviews_count})
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'description' ? (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="prose max-w-none"
              >
                <div className="text-[#5c5243] whitespace-pre-wrap">
                  {product.description}
                </div>
                
                {product.metadata?.ingredients && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-[#2d2418] mb-3">Ingredients</h3>
                    <p className="text-[#5c5243]">{product.metadata.ingredients}</p>
                  </div>
                )}
                
                {product.metadata?.directions && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-[#2d2418] mb-3">Directions</h3>
                    <p className="text-[#5c5243]">{product.metadata.directions}</p>
                  </div>
                )}
                
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-[#2d2418] mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-[#d4cfc5] text-[#5c5243] rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-[#d4cfc5] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#2d2418]">No reviews yet</h3>
                    <p className="text-[#7a7268]">Be the first to review this product!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <NeuCard key={review.id} className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#d4cfc5] flex items-center justify-center flex-shrink-0">
                          {review.avatar_url ? (
                            <img src={review.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-lg font-semibold text-[#5c5243]">
                              {review.full_name?.[0]?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[#2d2418]">{review.full_name}</span>
                            {review.is_verified_purchase && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? 'fill-amber-400 text-amber-400' 
                                    : 'text-[#d4cfc5]'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-[#a39a8b] ml-2">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[#5c5243]">{review.review}</p>
                        </div>
                      </NeuCard>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#2d2418] mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <NeuCard 
                  key={related.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/products/${related.id}`)}
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-[#d4cfc5]">
                    {related.images?.[0] ? (
                      <img src={related.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Box className="w-8 h-8 text-[#a39a8b]" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-[#2d2418] line-clamp-1">{related.name}</h4>
                  <p className="text-[#5c5243] font-bold">${related.price}</p>
                </NeuCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
