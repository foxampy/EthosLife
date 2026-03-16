/**
 * SettingsUnified - User Settings Page
 * EthosLife Account Management
 * 
 * Features:
 * - Sidebar navigation for settings categories
 * - Account settings (email, password, delete)
 * - Notification preferences
 * - Privacy settings
 * - Appearance (theme, language)
 * - Connected devices
 * - Billing & subscriptions
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Palette,
  Smartphone,
  CreditCard,
  ChevronRight,
  Mail,
  Lock,
  Trash2,
  Moon,
  Sun,
  Globe,
  Eye,
  Download,
  LogOut,
  Check,
  X,
  Smartphone as DeviceIcon,
  Laptop,
  Tablet,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ElCard, ElButton, ElInput } from '../../components/ElCore';

// ============================================
// TYPES
// ============================================
type SettingsCategory = 
  | 'account' 
  | 'notifications' 
  | 'privacy' 
  | 'appearance' 
  | 'devices' 
  | 'billing';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

interface Device {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'tablet';
  lastActive: string;
  location: string;
  isCurrent: boolean;
}

// ============================================
// COMPONENTS
// ============================================

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => (
  <div className="flex items-center justify-between">
    {label && <span className="text-[var(--text-primary)] font-medium">{label}</span>}
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
        checked ? 'bg-[var(--neon-cyan)]' : 'bg-[var(--bone-400)]'
      }`}
    >
      <motion.div
        initial={false}
        animate={{ x: checked ? 28 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
      />
    </button>
  </div>
);

const SettingsItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}> = ({ icon, title, description, action, onClick, danger }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between p-4 rounded-2xl bg-[var(--bone-200)] hover:bg-[var(--bone-300)] transition-colors ${
      onClick ? 'cursor-pointer' : ''
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        danger ? 'bg-red-100 text-red-500' : 'bg-[var(--bone-300)] text-[var(--stone-600)]'
      }`}>
        {icon}
      </div>
      <div>
        <h4 className={`font-semibold ${danger ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
          {title}
        </h4>
        {description && (
          <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        )}
      </div>
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ============================================
// SETTINGS SECTIONS
// ============================================

const AccountSettings: React.FC = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <ElCard variant="elevated">
        <ElCard.Header
          title="Email Address"
          subtitle="Manage your email preferences"
          icon={<Mail className="w-5 h-5" />}
        />
        <div className="space-y-4">
          <ElInput
            label="Current Email"
            value="alex.chen@example.com"
            disabled
            fullWidth
          />
          <ElButton variant="flat" size="sm">
            Change Email
          </ElButton>
        </div>
      </ElCard>

      <ElCard variant="elevated">
        <ElCard.Header
          title="Password"
          subtitle="Update your password regularly"
          icon={<Lock className="w-5 h-5" />}
        />
        <div className="space-y-4">
          {!showPasswordForm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--text-primary)] font-medium">Password</p>
                <p className="text-sm text-[var(--text-secondary)]">Last changed 3 months ago</p>
              </div>
              <ElButton variant="flat" size="sm" onClick={() => setShowPasswordForm(true)}>
                Change Password
              </ElButton>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <ElInput
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                fullWidth
              />
              <ElInput
                label="New Password"
                type="password"
                placeholder="Enter new password"
                fullWidth
              />
              <ElInput
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                fullWidth
              />
              <div className="flex gap-3">
                <ElButton variant="flat" size="sm" onClick={() => setShowPasswordForm(false)}>
                  Cancel
                </ElButton>
                <ElButton variant="gradient" size="sm">
                  Update Password
                </ElButton>
              </div>
            </motion.div>
          )}
        </div>
      </ElCard>

      <ElCard variant="elevated" className="border-red-200">
        <ElCard.Header
          title="Danger Zone"
          subtitle="Irreversible actions for your account"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        />
        <div className="space-y-4">
          <SettingsItem
            icon={<Trash2 className="w-5 h-5" />}
            title="Delete Account"
            description="Permanently delete your account and all data"
            danger
            action={
              <ElButton variant="flat" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                Delete
              </ElButton>
            }
          />
        </div>
      </ElCard>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <ElCard variant="glass" padding="lg">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                    Delete Account?
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-6">
                    This action cannot be undone. All your data, including health records, 
                    achievements, and tokens will be permanently deleted.
                  </p>
                  <div className="space-y-3">
                    <ElButton variant="flat" fullWidth onClick={() => setShowDeleteConfirm(false)}>
                      Cancel
                    </ElButton>
                    <ElButton variant="flat" fullWidth className="!bg-red-500 !text-white">
                      Yes, Delete My Account
                    </ElButton>
                  </div>
                </div>
              </ElCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    healthReminders: true,
    goalUpdates: true,
    communityActivity: false,
    marketingEmails: false,
    weeklyReport: true,
    achievementAlerts: true,
  });

  const updateSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <ElCard variant="elevated">
        <ElCard.Header
          title="Push Notifications"
          subtitle="Receive notifications on your device"
          icon={<Bell className="w-5 h-5" />}
        />
        <div className="space-y-4">
          <Toggle
            checked={settings.pushEnabled}
            onChange={() => updateSetting('pushEnabled')}
            label="Enable Push Notifications"
          />
          {settings.pushEnabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 pt-4 border-t border-[var(--bone-400)]/50"
            >
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--text-secondary)]">Health Reminders</span>
                <Toggle checked={settings.healthReminders} onChange={() => updateSetting('healthReminders')} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--text-secondary)]">Goal Updates</span>
                <Toggle checked={settings.goalUpdates} onChange={() => updateSetting('goalUpdates')} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--text-secondary)]">Achievement Alerts</span>
                <Toggle checked={settings.achievementAlerts} onChange={() => updateSetting('achievementAlerts')} />
              </div>
            </motion.div>
          )}
        </div>
      </ElCard>

      <ElCard variant="elevated">
        <ElCard.Header
          title="Email Notifications"
          subtitle="Manage your email preferences"
          icon={<Mail className="w-5 h-5" />}
        />
        <div className="space-y-4">
          <Toggle
            checked={settings.emailEnabled}
            onChange={() => updateSetting('emailEnabled')}
            label="Enable Email Notifications"
          />
          {settings.emailEnabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 pt-4 border-t border-[var(--bone-400)]/50"
            >
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--text-secondary)]">Weekly Health Report</span>
                <Toggle checked={settings.weeklyReport} onChange={() => updateSetting('weeklyReport')} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--text-secondary)]">Community Activity</span>
                <Toggle checked={settings.communityActivity} onChange={() => updateSetting('communityActivity')} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--text-secondary)]">Marketing & Promotions</span>
                <Toggle checked={settings.marketingEmails} onChange={() => updateSetting('marketingEmails')} />
              </div>
            </motion.div>
          )}
        </div>
      </ElCard>
    </div>
  );
};

const PrivacySettings: React.FC = () => {
  const [settings, setSettings] = useState({
    profilePublic: true,
    showActivity: true,
    showAchievements: true,
    allowTagging: true,
    dataSharing: false,
  });

  const updateSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <ElCard variant="elevated">
        <ElCard.Header
          title="Profile Visibility"
          subtitle="Control who can see your profile"
          icon={<Eye className="w-5 h-5" />}
        />
        <div className="space-y-4">
          <Toggle
            checked={settings.profilePublic}
            onChange={() => updateSetting('profilePublic')}
            label="Public Profile"
          />
          <p className="text-sm text-[var(--text-secondary)]">
            When enabled, anyone can view your profile and activity. When disabled, 
            only approved followers can see your content.
          </p>
        </div>
      </ElCard>

      <ElCard variant="elevated">
        <ElCard.Header
          title="Activity Sharing"
          subtitle="Choose what to share with others"
          icon={<Shield className="w-5 h-5" />}
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-[var(--text-secondary)]">Show Activity Status</span>
            <Toggle checked={settings.showActivity} onChange={() => updateSetting('showActivity')} />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-[var(--text-secondary)]">Show Achievements</span>
            <Toggle checked={settings.showAchievements} onChange={() => updateSetting('showAchievements')} />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-[var(--text-secondary)]">Allow Tagging</span>
            <Toggle checked={settings.allowTagging} onChange={() => updateSetting('allowTagging')} />
          </div>
        </div>
      </ElCard>

      <ElCard variant="elevated">
        <ElCard.Header
          title="Data & Privacy"
          subtitle="Manage your personal data"
          icon={<Download className="w-5 h-5" />}
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-[var(--text-primary)] font-medium block">Data Sharing</span>
              <span className="text-sm text-[var(--text-secondary)]">Share anonymized data for research</span>
            </div>
            <Toggle checked={settings.dataSharing} onChange={() => updateSetting('dataSharing')} />
          </div>
          <div className="pt-4 border-t border-[var(--bone-400)]/50">
            <ElButton variant="flat" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Download My Data
            </ElButton>
          </div>
        </div>
      </ElCard>
    </div>
  );
};

const AppearanceSettings: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [language, setLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  return (
    <div className="space-y-6">
      <ElCard variant="elevated">
        <ElCard.Header
          title="Theme"
          subtitle="Choose your preferred appearance"
          icon={<Palette className="w-5 h-5" />}
        />
        <div className="grid grid-cols-3 gap-3">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <motion.button
              key={t}
              onClick={() => setTheme(t)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-2xl border-2 transition-all ${
                theme === t
                  ? 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10'
                  : 'border-transparent bg-[var(--bone-300)]'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {t === 'light' && <Sun className="w-6 h-6 text-amber-500" />}
                {t === 'dark' && <Moon className="w-6 h-6 text-purple-500" />}
                {t === 'system' && <div className="flex"><Sun className="w-4 h-4 text-amber-500" /><Moon className="w-4 h-4 text-purple-500 -ml-1" /></div>}
                <span className="text-sm font-medium text-[var(--text-primary)] capitalize">{t}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </ElCard>

      <ElCard variant="elevated">
        <ElCard.Header
          title="Language"
          subtitle="Select your preferred language"
          icon={<Globe className="w-5 h-5" />}
        />
        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                language === lang.code
                  ? 'bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]'
                  : 'bg-[var(--bone-300)] hover:bg-[var(--bone-400)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-[var(--text-primary)] font-medium">{lang.name}</span>
              </div>
              {language === lang.code && <Check className="w-5 h-5 text-[var(--neon-cyan)]" />}
            </button>
          ))}
        </div>
      </ElCard>
    </div>
  );
};

const DevicesSettings: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'iPhone 15 Pro', type: 'phone', lastActive: 'Active now', location: 'San Francisco, CA', isCurrent: true },
    { id: '2', name: 'MacBook Pro', type: 'laptop', lastActive: '2 hours ago', location: 'San Francisco, CA', isCurrent: false },
    { id: '3', name: 'iPad Air', type: 'tablet', lastActive: '3 days ago', location: 'Los Angeles, CA', isCurrent: false },
  ]);

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'phone': return <DeviceIcon className="w-5 h-5" />;
      case 'laptop': return <Laptop className="w-5 h-5" />;
      case 'tablet': return <Tablet className="w-5 h-5" />;
    }
  };

  const revokeDevice = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <ElCard variant="elevated">
        <ElCard.Header
          title="Connected Devices"
          subtitle="Manage devices with access to your account"
          icon={<DeviceIcon className="w-5 h-5" />}
        />
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`p-4 rounded-2xl border ${
                device.isCurrent
                  ? 'bg-[var(--neon-cyan)]/5 border-[var(--neon-cyan)]/30'
                  : 'bg-[var(--bone-300)] border-transparent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bone-200)] flex items-center justify-center text-[var(--stone-600)]">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">{device.name}</span>
                      {device.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] text-xs font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{device.location}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{device.lastActive}</p>
                  </div>
                </div>
                {!device.isCurrent && (
                  <button
                    onClick={() => revokeDevice(device.id)}
                    className="p-2 rounded-lg hover:bg-red-100 text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ElCard>

      <ElButton variant="flat" fullWidth leftIcon={<LogOut className="w-4 h-4" />}>
        Sign Out All Devices
      </ElButton>
    </div>
  );
};

const BillingSettings: React.FC = () => {
  const [plan] = useState({
    name: 'Premium',
    price: 9.99,
    billing: 'monthly',
    nextBilling: 'Apr 15, 2026',
    features: ['Unlimited Health Insights', 'AI Coach Access', 'Priority Support', 'Advanced Analytics'],
  });

  return (
    <div className="space-y-6">
      <ElCard variant="elevated" glowColor="amber">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-amber)] to-orange-500 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">{plan.name} Plan</h3>
              <p className="text-[var(--text-secondary)]">${plan.price}/{plan.billing}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[var(--neon-green)]/20 text-[var(--neon-green)] text-sm font-medium">
            Active
          </span>
        </div>
        
        <div className="p-4 rounded-2xl bg-[var(--bone-300)] mb-4">
          <p className="text-sm text-[var(--text-secondary)]">Next billing date</p>
          <p className="font-semibold text-[var(--text-primary)]">{plan.nextBilling}</p>
        </div>

        <div className="space-y-2 mb-6">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Check className="w-4 h-4 text-[var(--neon-green)]" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <ElButton variant="flat" size="sm" fullWidth>
            Change Plan
          </ElButton>
          <ElButton variant="flat" size="sm" fullWidth className="!text-red-500">
            Cancel
          </ElButton>
        </div>
      </ElCard>

      <ElCard variant="elevated">
        <ElCard.Header
          title="Payment Method"
          subtitle="Manage your payment options"
          icon={<CreditCard className="w-5 h-5" />}
        />
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bone-300)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
              VISA
            </div>
            <div>
              <p className="font-medium text-[var(--text-primary)]">•••• •••• •••• 4242</p>
              <p className="text-sm text-[var(--text-secondary)]">Expires 12/27</p>
            </div>
          </div>
          <ElButton variant="flat" size="sm">
            Update
          </ElButton>
        </div>
      </ElCard>

      <ElCard variant="elevated">
        <ElCard.Header
          title="Billing History"
          subtitle="View past invoices and receipts"
          icon={<Download className="w-5 h-5" />}
        />
        <div className="space-y-2">
          {[
            { date: 'Mar 15, 2026', amount: 9.99, status: 'Paid' },
            { date: 'Feb 15, 2026', amount: 9.99, status: 'Paid' },
            { date: 'Jan 15, 2026', amount: 9.99, status: 'Paid' },
          ].map((invoice, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bone-300)]">
              <div>
                <p className="font-medium text-[var(--text-primary)]">{invoice.date}</p>
                <p className="text-sm text-[var(--neon-green)]">{invoice.status}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[var(--text-primary)]">${invoice.amount}</span>
                <button className="p-2 rounded-lg hover:bg-[var(--bone-400)] transition-colors">
                  <Download className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ElCard>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const SettingsUnified: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('account');

  const categories: { id: SettingsCategory; label: string; icon: React.ElementType }[] = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'account': return <AccountSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'privacy': return <PrivacySettings />;
      case 'appearance': return <AppearanceSettings />;
      case 'devices': return <DevicesSettings />;
      case 'billing': return <BillingSettings />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bone-200)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--bone-200)]/80 backdrop-blur-lg border-b border-[var(--bone-400)]/30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Settings</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)] text-white shadow-lg'
                      : 'bg-[var(--bone-300)] text-[var(--text-secondary)] hover:bg-[var(--bone-400)]'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span className="font-medium">{category.label}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                    activeCategory === category.id ? 'rotate-90' : ''
                  }`} />
                </motion.button>
              ))}

              <div className="pt-4 mt-4 border-t border-[var(--bone-400)]/50">
                <ElButton
                  variant="flat"
                  fullWidth
                  leftIcon={<LogOut className="w-4 h-4" />}
                  onClick={() => navigate('/')}
                >
                  Sign Out
                </ElButton>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                    {categories.find(c => c.id === activeCategory)?.label}
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    Manage your {activeCategory.toLowerCase()} preferences
                  </p>
                </div>
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsUnified;
