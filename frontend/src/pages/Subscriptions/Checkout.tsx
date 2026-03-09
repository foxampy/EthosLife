import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, Wallet, Gift } from 'lucide-react';
import { NeuButton } from '../../components/Neumorphism/NeuButton';
import { NeuCard } from '../../components/Neumorphism/NeuCard';
import { NeuInput } from '../../components/Neumorphism/NeuInput';

interface CheckoutProps {
  planId: string;
  billingPeriod: 'monthly' | 'yearly';
  onBack: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ planId, billingPeriod, onBack }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirm'>('details');
  const [cashbackBalance, setCashbackBalance] = useState(0);
  const [applyCashback, setApplyCashback] = useState(false);
  const [cashbackAmount, setCashbackAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  });

  const plans = {
    premium: { name: 'Premium', price: billingPeriod === 'yearly' ? 99.99 : 9.99 },
    pro: { name: 'Pro', price: billingPeriod === 'yearly' ? 199.99 : 19.99 }
  };

  const plan = plans[planId as keyof typeof plans];
  const finalPrice = applyCashback ? Math.max(0, plan.price - cashbackAmount) : plan.price;

  useEffect(() => {
    // Fetch cashback balance
    fetchCashbackBalance();
  }, []);

  const fetchCashbackBalance = async () => {
    try {
      const response = await fetch('/api/cashback/balance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCashbackBalance(data.balance.available);
        setCashbackAmount(Math.min(data.balance.available, plan.price));
      }
    } catch (error) {
      console.error('Error fetching cashback:', error);
    }
  };

  const handleApplyCashback = async () => {
    if (!applyCashback) {
      setApplyCashback(true);
      return;
    }

    try {
      const response = await fetch('/api/subscriptions/apply-cashback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: cashbackAmount })
      });

      const data = await response.json();
      if (data.success) {
        setApplyCashback(true);
      }
    } catch (error) {
      console.error('Error applying cashback:', error);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId,
          billingPeriod,
          billingDetails: formData,
          cashbackApplied: applyCashback ? cashbackAmount : 0
        })
      });

      const data = await response.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e4dfd5] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <NeuButton variant="flat" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </NeuButton>
          <h1 className="text-2xl font-bold text-[#2d2418]">Complete Your Subscription</h1>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {['Details', 'Payment', 'Confirm'].map((s, idx) => (
            <React.Fragment key={s}>
              <div className={`flex-1 h-2 rounded-full ${
                idx <= ['details', 'payment', 'confirm'].indexOf(step) 
                  ? 'bg-amber-500' 
                  : 'bg-[#d4cfc5]'
              }`} />
            </React.Fragment>
          ))}
        </div>

        <NeuCard className="p-6">
          {/* Plan Summary */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#f0ece3] mb-6">
            <div>
              <h3 className="font-semibold text-[#2d2418]">{plan.name} Plan</h3>
              <p className="text-sm text-[#5c5243]">
                {billingPeriod === 'yearly' ? 'Billed annually' : 'Billed monthly'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#2d2418]">${finalPrice.toFixed(2)}</p>
              {applyCashback && (
                <p className="text-sm text-green-600">
                  -${cashbackAmount.toFixed(2)} cashback applied
                </p>
              )}
            </div>
          </div>

          {step === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Billing Details</h3>
              
              <div className="space-y-4">
                <NeuInput
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
                
                <NeuInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />

                <NeuInput
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St"
                />

                <div className="grid grid-cols-2 gap-4">
                  <NeuInput
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                  />
                  <NeuInput
                    label="Postal Code"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="10001"
                  />
                </div>

                <NeuInput
                  label="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="United States"
                />
              </div>

              {/* Cashback Section */}
              {cashbackBalance > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Gift className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      You have ${cashbackBalance.toFixed(2)} in cashback
                    </span>
                  </div>
                  <NeuButton
                    variant={applyCashback ? 'elevated' : 'flat'}
                    size="sm"
                    className={applyCashback ? 'bg-green-500 text-white' : ''}
                    onClick={handleApplyCashback}
                  >
                    {applyCashback ? 'Cashback Applied ✓' : 'Apply to This Order'}
                  </NeuButton>
                </div>
              )}

              <NeuButton
                className="w-full mt-6"
                onClick={() => setStep('payment')}
              >
                Continue to Payment
              </NeuButton>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold text-[#2d2418] mb-4">Payment Method</h3>
              
              <div className="space-y-3">
                <button className="w-full p-4 rounded-xl bg-[#f0ece3] flex items-center gap-3 border-2 border-amber-500">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span className="flex-grow text-left font-medium">Credit / Debit Card</span>
                  <span className="text-sm text-[#5c5243]">Stripe</span>
                </button>

                <button className="w-full p-4 rounded-xl bg-[#e4dfd5] flex items-center gap-3 opacity-50 cursor-not-allowed">
                  <Wallet className="w-5 h-5" />
                  <span className="flex-grow text-left">Crypto (Coming Soon)</span>
                </button>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm text-[#5c5243]">
                <Shield className="w-4 h-4" />
                <span>Your payment is secured by Stripe 256-bit encryption</span>
              </div>

              <div className="flex gap-3 mt-6">
                <NeuButton variant="flat" onClick={() => setStep('details')}>
                  Back
                </NeuButton>
                <NeuButton
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Pay $${finalPrice.toFixed(2)}`}
                </NeuButton>
              </div>
            </motion.div>
          )}
        </NeuCard>
      </div>
    </div>
  );
};

export default Checkout;
