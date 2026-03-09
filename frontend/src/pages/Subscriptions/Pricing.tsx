import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Zap, ArrowRight } from 'lucide-react';
import { NeuButton } from '../../components/Neumorphism/NeuButton';
import { NeuCard } from '../../components/Neumorphism/NeuCard';

interface Plan {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  yearlyDiscount: number;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  description: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    yearlyDiscount: 0,
    description: 'Perfect for getting started',
    icon: <Zap className="w-6 h-6" />,
    features: [
      'Basic health trackers',
      '3 AI insights daily',
      'Community access',
      'Basic analytics',
      '7-day data history',
      'Mobile app access'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    yearlyPrice: 99.99,
    yearlyDiscount: 17,
    description: 'Best for health enthusiasts',
    icon: <Sparkles className="w-6 h-6" />,
    popular: true,
    features: [
      'Unlimited AI insights',
      'All health modules',
      'Advanced analytics',
      'Priority support',
      '30-day data history',
      'Data export',
      'Custom reminders',
      'Health insights reports',
      'Family sharing (2 members)'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    yearlyPrice: 199.99,
    yearlyDiscount: 17,
    description: 'Complete health optimization',
    icon: <Crown className="w-6 h-6" />,
    features: [
      'Everything in Premium',
      '1-on-1 coaching monthly',
      'Genetic reports access',
      'Family accounts (5 members)',
      'Unlimited data history',
      'API access',
      'White-label reports',
      'Dedicated manager',
      'Early access to features',
      'Personalized protocols'
    ]
  }
];

const PlanCard: React.FC<{ 
  plan: Plan; 
  billingPeriod: 'monthly' | 'yearly';
  isPopular?: boolean;
  onSelect: (planId: string) => void;
}> = ({ plan, billingPeriod, isPopular, onSelect }) => {
  const price = billingPeriod === 'yearly' ? plan.yearlyPrice : plan.price;
  const monthlyEquivalent = billingPeriod === 'yearly' 
    ? (plan.yearlyPrice / 12).toFixed(2) 
    : plan.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative ${isPopular ? 'lg:-mt-4 lg:mb-4' : ''}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <NeuCard
        className={`h-full flex flex-col ${isPopular ? 'ring-2 ring-amber-500/30' : ''}`}
        hover={!isPopular}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-2xl ${
              plan.id === 'free' ? 'bg-slate-200 text-slate-600' :
              plan.id === 'premium' ? 'bg-amber-100 text-amber-600' :
              'bg-purple-100 text-purple-600'
            } shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]`}>
              {plan.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#2d2418]">{plan.name}</h3>
              <p className="text-sm text-[#5c5243]">{plan.description}</p>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#2d2418]">
                ${price === 0 ? '0' : billingPeriod === 'yearly' ? Math.floor(plan.yearlyPrice) : plan.price}
              </span>
              {price > 0 && billingPeriod === 'yearly' && (
                <span className="text-lg text-[#5c5243]">.{(plan.yearlyPrice % 1).toFixed(2).slice(2)}</span>
              )}
            </div>
            <div className="text-[#5c5243] text-sm">
              {price === 0 ? (
                'Forever free'
              ) : billingPeriod === 'yearly' ? (
                <>
                  <span className="line-through opacity-60">${(plan.price * 12).toFixed(0)}</span>
                  <span className="ml-2 text-green-600 font-medium">Save {plan.yearlyDiscount}%</span>
                  <div className="text-xs mt-1">${monthlyEquivalent}/mo equivalent</div>
                </>
              ) : (
                'per month'
              )}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8 flex-grow">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  plan.id === 'free' ? 'bg-slate-200' :
                  plan.id === 'premium' ? 'bg-amber-100' :
                  'bg-purple-100'
                }`}>
                  <Check className={`w-3 h-3 ${
                    plan.id === 'free' ? 'text-slate-600' :
                    plan.id === 'premium' ? 'text-amber-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <span className="text-sm text-[#2d2418]">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <NeuButton
            variant={isPopular ? 'elevated' : 'flat'}
            className={`w-full ${
              plan.id === 'free' ? '' :
              isPopular ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
              'bg-[#2d2418] text-white'
            }`}
            onClick={() => onSelect(plan.id)}
          >
            {plan.id === 'free' ? 'Get Started Free' : 'Subscribe Now'}
            {plan.id !== 'free' && <ArrowRight className="w-4 h-4 ml-2" />}
          </NeuButton>
        </div>
      </NeuCard>
    </motion.div>
  );
};

export const Pricing: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      // Redirect to signup or dashboard
      window.location.href = '/signup';
      return;
    }

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
          billingPeriod 
        })
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session');
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e4dfd5] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#2d2418] mb-4"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#5c5243] max-w-2xl mx-auto"
          >
            Unlock your full health potential with EthosLife. 
            Start free and upgrade anytime as your journey evolves.
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)] text-[#2d2418]'
                  : 'text-[#5c5243] hover:text-[#2d2418]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                billingPeriod === 'yearly'
                  ? 'bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)] text-[#2d2418]'
                  : 'text-[#5c5243] hover:text-[#2d2418]'
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingPeriod={billingPeriod}
              isPopular={plan.popular}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-[#5c5243]">
            Have questions?{' '}
            <a href="#faq" className="text-amber-600 hover:text-amber-700 font-medium underline">
              Check our FAQ
            </a>{' '}
            or{' '}
            <a href="/contact" className="text-amber-600 hover:text-amber-700 font-medium underline">
              contact support
            </a>
          </p>
        </motion.div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          {[
            { title: 'Cancel Anytime', desc: 'No long-term contracts, cancel whenever you want' },
            { title: '30-Day Guarantee', desc: 'Not satisfied? Get a full refund within 30 days' },
            { title: 'Secure Payment', desc: 'Your payment information is always protected' }
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <h4 className="font-semibold text-[#2d2418] mb-1">{item.title}</h4>
              <p className="text-sm text-[#5c5243]">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#e4dfd5] rounded-2xl p-8 shadow-2xl">
            <div className="animate-spin w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-[#2d2418] font-medium">Redirecting to checkout...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
