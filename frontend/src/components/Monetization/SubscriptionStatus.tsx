import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Sparkles, 
  Zap, 
  Calendar, 
  CreditCard, 
  AlertCircle,
  Check,
  X,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuCard } from '../Neumorphism/NeuCard';

interface Subscription {
  plan: {
    id: string;
    name: string;
    price: number;
    features: string[];
  };
  status: string;
  isActive: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  features: string[];
  limits: {
    aiRequestsPerDay: number;
    dataRetentionDays: number;
    familyMembers: number;
    coachingSessions: number;
  };
}

export const SubscriptionStatus: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [subRes, invoicesRes] = await Promise.all([
        fetch('/api/subscriptions/current', { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }),
        fetch('/api/subscriptions/invoices?limit=5', { 
          headers: { 'Authorization': `Bearer ${token}` } 
        })
      ]);

      const [subData, invoicesData] = await Promise.all([
        subRes.json(),
        invoicesRes.json()
      ]);

      setSubscription(subData);
      setInvoices(invoicesData.invoices || []);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchSubscriptionData();
        setShowCancelConfirm(false);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReactivate = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/subscriptions/reactivate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchSubscriptionData();
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const openBillingPortal = async () => {
    try {
      const response = await fetch('/api/subscriptions/billing-portal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Zap className="w-6 h-6 text-slate-600" />;
      case 'premium':
        return <Sparkles className="w-6 h-6 text-amber-600" />;
      case 'pro':
        return <Crown className="w-6 h-6 text-purple-600" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'bg-slate-100 text-slate-700';
      case 'premium':
        return 'bg-amber-100 text-amber-700';
      case 'pro':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (isLoading) {
    return (
      <NeuCard className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-[#d4cfc5] rounded" />
          <div className="h-32 bg-[#d4cfc5] rounded" />
        </div>
      </NeuCard>
    );
  }

  if (!subscription) {
    return (
      <NeuCard className="p-6">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-[#5c5243] mx-auto mb-4" />
          <p className="text-[#5c5243]">Unable to load subscription data</p>
          <NeuButton className="mt-4" onClick={fetchSubscriptionData}>Retry</NeuButton>
        </div>
      </NeuCard>
    );
  }

  const isCanceled = subscription.cancelAtPeriodEnd;
  const periodEnd = subscription.currentPeriodEnd 
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString() 
    : null;

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <NeuCard className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${getPlanColor(subscription.plan.id)}`}>
              {getPlanIcon(subscription.plan.id)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#2d2418]">
                {subscription.plan.name} Plan
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  subscription.isActive && !isCanceled
                    ? 'bg-green-100 text-green-700'
                    : isCanceled
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {isCanceled ? 'Canceling' : subscription.isActive ? 'Active' : 'Inactive'}
                </span>
                {subscription.plan.price > 0 && (
                  <span className="text-sm text-[#5c5243]">
                    ${subscription.plan.price}/month
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {subscription.plan.id !== 'pro' && (
            <NeuButton
              size="sm"
              onClick={() => window.location.href = '/pricing'}
            >
              Upgrade
            </NeuButton>
          )}
        </div>

        {subscription.plan.id !== 'free' && periodEnd && (
          <div className="p-4 rounded-xl bg-[#f0ece3] mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#5c5243]" />
              <div>
                <p className="text-sm text-[#5c5243]">
                  {isCanceled 
                    ? 'Your subscription ends on'
                    : 'Next billing date'}
                </p>
                <p className="font-medium text-[#2d2418]">{periodEnd}</p>
              </div>
            </div>
          </div>
        )}

        {/* Limits Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { 
              label: 'AI Requests', 
              value: subscription.limits.aiRequestsPerDay === -1 
                ? 'Unlimited' 
                : `${subscription.limits.aiRequestsPerDay}/day` 
            },
            { 
              label: 'Data History', 
              value: subscription.limits.dataRetentionDays === -1 
                ? 'Unlimited' 
                : `${subscription.limits.dataRetentionDays} days` 
            },
            { 
              label: 'Family', 
              value: `${subscription.limits.familyMembers} members` 
            },
            { 
              label: 'Coaching', 
              value: subscription.limits.coachingSessions === 0 
                ? 'None' 
                : `${subscription.limits.coachingSessions}/mo` 
            }
          ].map((limit) => (
            <div key={limit.label} className="text-center p-3 rounded-xl bg-[#f0ece3]">
              <p className="text-xs text-[#5c5243] mb-1">{limit.label}</p>
              <p className="font-medium text-[#2d2418]">{limit.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        {subscription.plan.id !== 'free' && (
          <div className="flex flex-wrap gap-3">
            <NeuButton variant="flat" size="sm" onClick={openBillingPortal}>
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Billing
            </NeuButton>
            
            {!isCanceled ? (
              <NeuButton 
                variant="flat" 
                size="sm" 
                onClick={() => setShowCancelConfirm(true)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </NeuButton>
            ) : (
              <NeuButton 
                size="sm" 
                onClick={handleReactivate}
                disabled={isProcessing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                Reactivate
              </NeuButton>
            )}
          </div>
        )}
      </NeuCard>

      {/* Recent Invoices */}
      {invoices.length > 0 && (
        <NeuCard className="p-6">
          <h4 className="font-semibold text-[#2d2418] mb-4">Recent Invoices</h4>
          <div className="space-y-2">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#f0ece3] hover:bg-[#e8e4db] transition-colors"
              >
                <div>
                  <p className="font-medium text-[#2d2418]">
                    {new Date(invoice.periodStart).toLocaleDateString()} - {new Date(invoice.periodEnd).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-[#5c5243]">
                    {new Date(invoice.created).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#2d2418]">
                    ${invoice.amount.toFixed(2)}
                  </span>
                  {invoice.pdfUrl && (
                    <a
                      href={invoice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-[#d4cfc5] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-[#5c5243]" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </NeuCard>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#e4dfd5] rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-red-100">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-[#2d2418]">Cancel Subscription?</h3>
            </div>
            
            <p className="text-[#5c5243] mb-4">
              Your subscription will remain active until <strong>{periodEnd}</strong>, 
              after which you'll be downgraded to the Free plan. You can reactivate anytime.
            </p>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
              <p className="text-sm text-amber-800">
                You'll lose access to premium features like unlimited AI insights, 
                advanced analytics, and extended data history.
              </p>
            </div>

            <div className="flex gap-3">
              <NeuButton
                variant="flat"
                className="flex-1"
                onClick={() => setShowCancelConfirm(false)}
              >
                Keep Subscription
              </NeuButton>
              <NeuButton
                className="flex-1 bg-red-500 text-white"
                onClick={handleCancel}
                disabled={isProcessing}
              >
                {isProcessing ? 'Canceling...' : 'Yes, Cancel'}
              </NeuButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
