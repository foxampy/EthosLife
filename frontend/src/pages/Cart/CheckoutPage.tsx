import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, CreditCard, Check, Truck, Home, Building,
  ChevronRight, Shield, AlertCircle
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { NeuButton, NeuCard, NeuInput } from '../../components/Neumorphism';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface CheckoutItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

interface CheckoutState {
  items: CheckoutItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promoCode?: string;
  cashbackToUse: number;
}

const STEPS = ['Shipping', 'Payment', 'Review', 'Confirmation'];

function CheckoutForm({ 
  state, 
  onComplete 
}: { 
  state: CheckoutState; 
  onComplete: (orderId: string) => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const stripe = useStripe();
  const elements = useElements();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  
  // Shipping form
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.full_name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: ''
  });
  
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');

  const shippingRates = {
    standard: { name: 'Standard Shipping', price: 5.99, days: '5-7' },
    express: { name: 'Express Shipping', price: 14.99, days: '2-3' },
    free: { name: 'Free Shipping', price: 0, days: '7-10' }
  };

  const handleShippingSubmit = async () => {
    // Validate shipping address
    if (!shippingAddress.fullName || !shippingAddress.addressLine1 || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setProcessing(true);
      
      // Create order
      const response = await api.post('/orders/checkout', {
        shippingAddress,
        shippingMethod,
        promoCode: state.promoCode,
        cashbackToUse: state.cashbackToUse,
        paymentMethod: 'stripe'
      });

      setOrderId(response.data.order.id);
      setClientSecret(response.data.payment?.clientSecret || '');
      setCurrentStep(1);
      toast.success('Shipping saved!');
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.error || 'Failed to proceed');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!stripe || !elements) {
      toast.error('Payment system not ready');
      return;
    }

    try {
      setProcessing(true);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: shippingAddress.fullName,
            phone: shippingAddress.phone,
            address: {
              line1: shippingAddress.addressLine1,
              line2: shippingAddress.addressLine2,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.postalCode,
              country: shippingAddress.country
            }
          }
        }
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on server
        await api.post('/orders/payment-success', {
          paymentIntentId: paymentIntent.id
        });
        
        setCurrentStep(2);
        toast.success('Payment successful!');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmOrder = () => {
    setCurrentStep(3);
    onComplete(orderId);
  };

  const ShippingStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#2d2418]">Shipping Address</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#5c5243] mb-2">
            Full Name *
          </label>
          <NeuInput
            value={shippingAddress.fullName}
            onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#5c5243] mb-2">
            Address Line 1 *
          </label>
          <NeuInput
            value={shippingAddress.addressLine1}
            onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
            placeholder="123 Main Street"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#5c5243] mb-2">
            Address Line 2
          </label>
          <NeuInput
            value={shippingAddress.addressLine2}
            onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
            placeholder="Apt 4B"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#5c5243] mb-2">
            City *
          </label>
          <NeuInput
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            placeholder="New York"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#5c5243] mb-2">
            State/Province *
          </label>
          <NeuInput
            value={shippingAddress.state}
            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
            placeholder="NY"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#5c5243] mb-2">
            Postal Code *
          </label>
          <NeuInput
            value={shippingAddress.postalCode}
            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
            placeholder="10001"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#5c5243] mb-2">
            Phone
          </label>
          <NeuInput
            value={shippingAddress.phone}
            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-[#d4cfc5]">
        <h3 className="font-semibold text-[#2d2418] mb-4">Shipping Method</h3>
        <div className="space-y-3">
          {Object.entries(shippingRates).map(([key, method]) => (
            <button
              key={key}
              onClick={() => setShippingMethod(key)}
              className={`
                w-full p-4 rounded-2xl text-left transition-all
                ${shippingMethod === key
                  ? 'bg-[#5c5243] text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
                  : 'bg-[#e4dfd5] text-[#5c5243] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.55)]'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{method.name}</p>
                  <p className={`text-sm ${shippingMethod === key ? 'text-white/70' : 'text-[#7a7268]'}`}>
                    {method.days} business days
                  </p>
                </div>
                <p className="font-bold">
                  {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <NeuButton 
        size="lg" 
        className="w-full"
        onClick={handleShippingSubmit}
        disabled={processing}
      >
        {processing ? 'Processing...' : 'Continue to Payment'}
        <ChevronRight className="w-5 h-5 ml-2" />
      </NeuButton>
    </div>
  );

  const PaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#2d2418]">Payment Details</h2>
      
      <NeuCard variant="inset">
        <div className="p-4">
          <label className="block text-sm font-medium text-[#5c5243] mb-4">
            Card Information
          </label>
          <div className="p-4 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#2d2418',
                    '::placeholder': { color: '#a39a8b' }
                  }
                }
              }}
            />
          </div>
        </div>
      </NeuCard>

      <div className="flex items-center gap-2 text-sm text-[#7a7268]">
        <Shield className="w-4 h-4" />
        Your payment information is secure and encrypted
      </div>

      <div className="flex gap-4">
        <NeuButton 
          variant="secondary" 
          onClick={() => setCurrentStep(0)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </NeuButton>
        <NeuButton 
          size="lg" 
          className="flex-1"
          onClick={handlePaymentSubmit}
          disabled={processing || !stripe}
        >
          {processing ? 'Processing...' : 'Pay Now'}
          <CreditCard className="w-5 h-5 ml-2" />
        </NeuButton>
      </div>
    </div>
  );

  const ReviewStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#2d2418]">Review Your Order</h2>
      
      {/* Order Items */}
      <NeuCard>
        <h3 className="font-semibold text-[#2d2418] mb-4">Items</h3>
        <div className="space-y-3">
          {state.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-[#d4cfc5] overflow-hidden">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-6 h-6 text-[#a39a8b]" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#2d2418]">{item.name}</p>
                <p className="text-sm text-[#7a7268]">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-[#5c5243]">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </NeuCard>

      {/* Shipping Address */}
      <NeuCard>
        <h3 className="font-semibold text-[#2d2418] mb-4">Shipping To</h3>
        <div className="text-[#5c5243]">
          <p className="font-medium">{shippingAddress.fullName}</p>
          <p>{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
          <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
          <p>{shippingAddress.country}</p>
        </div>
      </NeuCard>

      {/* Totals */}
      <NeuCard>
        <div className="space-y-2">
          <div className="flex justify-between text-[#7a7268]">
            <span>Subtotal</span>
            <span>${state.subtotal.toFixed(2)}</span>
          </div>
          {state.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${state.discount.toFixed(2)}</span>
            </div>
          )}
          {state.cashbackToUse > 0 && (
            <div className="flex justify-between text-amber-600">
              <span>Cashback</span>
              <span>-${state.cashbackToUse.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-[#7a7268]">
            <span>Shipping</span>
            <span>${state.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#7a7268]">
            <span>Tax</span>
            <span>${state.tax.toFixed(2)}</span>
          </div>
          <div className="pt-2 border-t border-[#d4cfc5] flex justify-between text-xl font-bold text-[#2d2418]">
            <span>Total</span>
            <span>${state.total.toFixed(2)}</span>
          </div>
        </div>
      </NeuCard>

      <NeuButton 
        size="lg" 
        className="w-full"
        onClick={handleConfirmOrder}
      >
        <Check className="w-5 h-5 mr-2" />
        Place Order
      </NeuButton>
    </div>
  );

  const ConfirmationStep = () => (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
      >
        <Check className="w-12 h-12 text-green-600" />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-[#2d2418] mb-2">Order Confirmed!</h2>
      <p className="text-[#7a7268] mb-6">
        Thank you for your order. We&apos;ll send you a confirmation email shortly.
      </p>
      
      <div className="flex justify-center gap-4">
        <NeuButton variant="secondary" onClick={() => navigate('/products')}>
          Continue Shopping
        </NeuButton>
        <NeuButton onClick={() => navigate('/orders')}>
          View Orders
        </NeuButton>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div key="shipping" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ShippingStep />
          </motion.div>
        )}
        {currentStep === 1 && (
          <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PaymentStep />
          </motion.div>
        )}
        {currentStep === 2 && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReviewStep />
          </motion.div>
        )}
        {currentStep === 3 && (
          <motion.div key="confirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ConfirmationStep />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutState;

  useEffect(() => {
    if (!state?.items || state.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [state, navigate]);

  if (!state?.items || state.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#e4dfd5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#e4dfd5]/95 backdrop-blur-sm border-b border-[#d4cfc5]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NeuButton variant="flat" size="sm" onClick={() => navigate('/cart')}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Cart
            </NeuButton>
            
            <h1 className="text-xl font-bold text-[#2d2418]">Checkout</h1>
            
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            state={state} 
            onComplete={(orderId) => {
              // Handle completion
            }}
          />
        </Elements>
      </div>
    </div>
  );
}
