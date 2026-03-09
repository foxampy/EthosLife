import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Gift, Tag,
  Truck, Shield, CreditCard
} from 'lucide-react';
import { NeuButton, NeuCard, NeuInput, NeuSlider } from '../../components/Neumorphism';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  stock_quantity?: number;
  sku?: string;
}

interface PromoCode {
  code: string;
  description: string;
  discountAmount: number;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [validatingPromo, setValidatingPromo] = useState(false);
  
  // Cashback
  const [cashbackBalance, setCashbackBalance] = useState(0);
  const [cashbackToUse, setCashbackToUse] = useState(0);
  
  // Totals
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(5.99);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
    if (user) {
      fetchCashbackBalance();
    }
  }, [user]);

  useEffect(() => {
    calculateTotals();
  }, [items, appliedPromo, cashbackToUse]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const fetchCashbackBalance = async () => {
    try {
      const response = await api.get('/auth/me');
      setCashbackBalance(response.data.cashback_balance || 0);
    } catch (error) {
      console.error('Failed to fetch cashback:', error);
    }
  };

  const calculateTotals = () => {
    const newSubtotal = items.reduce((sum, item) => 
      sum + (parseFloat(item.price.toString()) * item.quantity), 0
    );
    
    const promoDiscount = appliedPromo?.discountAmount || 0;
    const newDiscount = promoDiscount;
    
    // Free shipping over $50
    const newShipping = newSubtotal - newDiscount > 50 ? 0 : 5.99;
    
    // Tax calculation (simplified)
    const taxableAmount = Math.max(0, newSubtotal - newDiscount);
    const newTax = taxableAmount * 0.08;
    
    // Apply cashback
    const maxCashback = Math.min(cashbackToUse, taxableAmount + newShipping + newTax);
    
    const newTotal = Math.max(0, taxableAmount + newShipping + newTax - maxCashback);
    
    setSubtotal(newSubtotal);
    setDiscount(newDiscount);
    setShipping(newShipping);
    setTax(newTax);
    setTotal(newTotal);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    try {
      setUpdating(itemId);
      await api.put(`/cart/${itemId}`, { quantity: newQuantity });
      await fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setUpdating(itemId);
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
      toast.success('Item removed');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    try {
      setValidatingPromo(true);
      const response = await api.post('/cart/promo/validate', {
        code: promoCode,
        subtotal
      });
      
      setAppliedPromo(response.data.promo);
      toast.success('Promo code applied!');
    } catch (error: any) {
      console.error('Failed to apply promo:', error);
      toast.error(error.response?.data?.error || 'Invalid promo code');
      setAppliedPromo(null);
    } finally {
      setValidatingPromo(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    navigate('/checkout', {
      state: {
        items,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        promoCode: appliedPromo?.code,
        cashbackToUse
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e4dfd5] flex items-center justify-center">
        <div className="animate-pulse text-[#5c5243]">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e4dfd5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#e4dfd5]/95 backdrop-blur-sm border-b border-[#d4cfc5]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NeuButton variant="flat" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Continue Shopping
            </NeuButton>
            
            <h1 className="text-xl font-bold text-[#2d2418]">Shopping Cart</h1>
            
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 text-[#d4cfc5] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#2d2418] mb-2">Your cart is empty</h2>
            <p className="text-[#7a7268] mb-6">Looks like you haven&apos;t added anything yet</p>
            <NeuButton onClick={() => navigate('/products')}>
              Start Shopping
            </NeuButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <NeuCard className="flex gap-4">
                      {/* Product Image */}
                      <div 
                        className="w-24 h-24 rounded-xl overflow-hidden bg-[#d4cfc5] flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/products/${item.product_id}`)}
                      >
                        {item.images?.[0] ? (
                          <img 
                            src={item.images[0]} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-[#a39a8b]" />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-semibold text-[#2d2418] truncate cursor-pointer hover:text-[#5c5243]"
                          onClick={() => navigate(`/products/${item.product_id}`)}
                        >
                          {item.name}
                        </h3>
                        {item.sku && (
                          <p className="text-sm text-[#a39a8b]">SKU: {item.sku}</p>
                        )}
                        <p className="text-lg font-bold text-[#5c5243] mt-1">
                          ${item.price}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <NeuButton
                            variant="flat"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </NeuButton>
                          <span className="w-8 text-center font-semibold">
                            {updating === item.id ? '...' : item.quantity}
                          </span>
                          <NeuButton
                            variant="flat"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id || (item.stock_quantity !== null && item.quantity >= item.stock_quantity)}
                          >
                            <Plus className="w-3 h-3" />
                          </NeuButton>
                        </div>
                      </div>
                      
                      {/* Price & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <p className="text-xl font-bold text-[#2d2418]">
                          ${(parseFloat(item.price.toString()) * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </NeuCard>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <NeuButton variant="secondary" onClick={() => navigate('/products')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </NeuButton>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <NeuCard className="sticky top-24">
                <h2 className="text-xl font-bold text-[#2d2418] mb-6">Order Summary</h2>
                
                {/* Promo Code */}
                <div className="mb-6">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-700">{appliedPromo.code}</p>
                          <p className="text-sm text-green-600">-{appliedPromo.discountAmount}</p>
                        </div>
                      </div>
                      <button 
                        onClick={removePromoCode}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <NeuInput
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <NeuButton 
                        variant="secondary" 
                        size="sm"
                        onClick={applyPromoCode}
                        disabled={validatingPromo || !promoCode.trim()}
                      >
                        {validatingPromo ? '...' : 'Apply'}
                      </NeuButton>
                    </div>
                  )}
                </div>
                
                {/* Cashback Slider */}
                {user && cashbackBalance > 0 && (
                  <div className="mb-6 p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2 text-sm font-medium text-[#5c5243]">
                        <Gift className="w-4 h-4" />
                        Use Cashback
                      </span>
                      <span className="text-sm text-[#7a7268]">
                        Available: ${cashbackBalance.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={Math.min(cashbackBalance, subtotal + shipping + tax)}
                      step="0.01"
                      value={cashbackToUse}
                      onChange={(e) => setCashbackToUse(parseFloat(e.target.value))}
                      className="w-full accent-[#5c5243]"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-[#7a7268]">$0</span>
                      <span className="text-sm font-semibold text-[#5c5243]">
                        Using: ${cashbackToUse.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[#7a7268]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {cashbackToUse > 0 && (
                    <div className="flex justify-between text-amber-600">
                      <span>Cashback</span>
                      <span>-${cashbackToUse.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-[#7a7268]">
                    <span className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-[#7a7268]">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-[#d4cfc5]">
                    <div className="flex justify-between text-xl font-bold text-[#2d2418]">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <NeuButton 
                  size="lg" 
                  className="w-full"
                  onClick={handleCheckout}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </NeuButton>
                
                {/* Trust Badges */}
                <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-[#d4cfc5]">
                  <div className="flex items-center gap-1 text-xs text-[#7a7268]">
                    <Shield className="w-4 h-4" />
                    Secure
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#7a7268]">
                    <Truck className="w-4 h-4" />
                    Free over $50
                  </div>
                </div>
              </NeuCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
