import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  User, Bell, Shield, Heart, Settings, Watch, CreditCard, Clock, Users, HelpCircle,
  Info, ChevronRight, Search, Save, RotateCcw, Upload, Download, LogOut, Smartphone,
  Mail, Lock, Eye, EyeOff, Trash2, Check, X, Moon, Sun, Globe, Palette, Volume2,
  Zap, Activity, FileText, MessageSquare, Bug, Gift, ExternalLink, AlertTriangle,
  Smartphone as DeviceIcon, Plus, MoreVertical, RefreshCw, Wifi, Battery, MapPin,
  Languages, Calendar, Type, Play, Video, ToggleLeft, ToggleRight, Sliders, Hash,
  Crown, CreditCard as CardIcon, History, FileDown, Percent, Pill, Dumbbell, Bed,
  Utensils, PlusCircle, MessageCircle, Ban, VolumeX, AtSign, Camera, Search as SearchIcon,
  BookOpen, LifeBuoy, Send, Lightbulb, MessageSquare as ChatIcon, ChevronDown,
  Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface AccountSettings {
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
    avatar: string | null;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
    phoneNumber: string;
  };
  username: string;
  email: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  passwordLastChanged: string;
}

interface NotificationChannel {
  enabled: boolean;
  weeklyReports: boolean;
  goalReminders: boolean;
  newFeatures: boolean;
  marketing: boolean;
}

interface PushNotificationSettings {
  enabled: boolean;
  medicationReminders: boolean;
  activityReminders: boolean;
  sleepAlerts: boolean;
  socialInteractions: boolean;
}

interface NotificationSettings {
  email: NotificationChannel;
  push: PushNotificationSettings;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  digestFrequency: 'daily' | 'weekly' | 'never';
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  activitySharing: 'everyone' | 'friends' | 'only-me';
  dataCollection: {
    analytics: boolean;
    personalization: boolean;
    crashReports: boolean;
  };
  thirdPartySharing: boolean;
  cookies: {
    essential: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  sessions: ActiveSession[];
  loginHistory: LoginEntry[];
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

interface LoginEntry {
  id: string;
  timestamp: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  success: boolean;
}

interface HealthDataSettings {
  dataSources: DataSource[];
  importHistory: ImportEntry[];
  retentionPeriod: number;
  sharingWithProviders: ProviderSharing[];
  researchParticipation: boolean;
  anonymizedDataSharing: boolean;
}

interface DataSource {
  id: string;
  name: string;
  type: 'wearable' | 'app' | 'manual' | 'file';
  connected: boolean;
  lastSync: string | null;
  dataTypes: string[];
}

interface ImportEntry {
  id: string;
  source: string;
  date: string;
  recordsCount: number;
  status: 'completed' | 'failed' | 'processing';
}

interface ProviderSharing {
  providerId: string;
  providerName: string;
  enabled: boolean;
  dataTypes: string[];
  expiryDate: string;
}

interface AppPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  units: 'metric' | 'imperial';
  timeFormat: '12h' | '24h';
  startOfWeek: 'monday' | 'sunday';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  defaultLandingPage: string;
  autoPlayVideos: boolean;
  reduceAnimations: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  colorAccent: string;
}

interface ConnectedDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'smart_scale' | 'blood_pressure' | 'glucose_meter' | 'other';
  brand: string;
  model: string;
  connected: boolean;
  batteryLevel: number | null;
  lastSync: string;
  syncSettings: {
    autoSync: boolean;
    syncFrequency: 'realtime' | 'hourly' | 'daily' | 'manual';
    dataTypes: string[];
  };
}

interface SubscriptionSettings {
  currentPlan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  paymentMethods: PaymentMethod[];
  billingHistory: BillingEntry[];
  features: string[];
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface BillingEntry {
  id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl: string;
}

interface ReminderSettings {
  defaultReminderTime: string;
  medication: {
    enabled: boolean;
    defaultTime: string;
    advanceNotice: number;
    sound: string;
    vibrate: boolean;
  };
  workout: {
    enabled: boolean;
    defaultTime: string;
    daysOfWeek: number[];
    sound: string;
  };
  sleep: {
    enabled: boolean;
    bedtimeReminder: string;
    wakeUpReminder: string;
    windDownStart: number;
  };
  meals: {
    enabled: boolean;
    breakfastTime: string;
    lunchTime: string;
    dinnerTime: string;
    snackReminders: boolean;
  };
  customReminders: CustomReminder[];
}

interface CustomReminder {
  id: string;
  title: string;
  time: string;
  daysOfWeek: number[];
  enabled: boolean;
  category: string;
}

interface SocialSettings {
  postVisibility: 'public' | 'friends' | 'private';
  messaging: 'everyone' | 'friends' | 'nobody';
  comments: 'everyone' | 'friends' | 'nobody';
  tagging: 'everyone' | 'friends' | 'nobody';
  blockedUsers: BlockedUser[];
  mutedAccounts: MutedAccount[];
}

interface BlockedUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  blockedDate: string;
}

interface MutedAccount {
  id: string;
  username: string;
  displayName: string;
  mutedDate: string;
  expiresAt: string | null;
}

interface SettingsState {
  account: AccountSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  healthData: HealthDataSettings;
  preferences: AppPreferences;
  devices: ConnectedDevice[];
  subscription: SubscriptionSettings;
  reminders: ReminderSettings;
  social: SocialSettings;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const defaultSettings: SettingsState = {
  account: {
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John D.',
      bio: 'Health enthusiast & marathon runner',
      avatar: null,
      dateOfBirth: '1990-05-15',
      gender: 'male',
      phoneNumber: '+1 (555) 123-4567'
    },
    username: 'johndoe',
    email: 'john.doe@example.com',
    emailVerified: true,
    twoFactorEnabled: false,
    passwordLastChanged: '2024-01-15'
  },
  notifications: {
    email: {
      enabled: true,
      weeklyReports: true,
      goalReminders: true,
      newFeatures: true,
      marketing: false
    },
    push: {
      enabled: true,
      medicationReminders: true,
      activityReminders: true,
      sleepAlerts: true,
      socialInteractions: false
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '07:00'
    },
    digestFrequency: 'weekly'
  },
  privacy: {
    profileVisibility: 'friends',
    activitySharing: 'friends',
    dataCollection: {
      analytics: true,
      personalization: true,
      crashReports: true
    },
    thirdPartySharing: false,
    cookies: {
      essential: true,
      functional: true,
      analytics: true,
      marketing: false
    },
    sessions: [
      {
        id: '1',
        device: 'iPhone 15 Pro',
        browser: 'Safari',
        location: 'New York, USA',
        ip: '192.168.1.***',
        lastActive: '2024-03-06T11:30:00Z',
        current: true
      },
      {
        id: '2',
        device: 'MacBook Pro',
        browser: 'Chrome',
        location: 'New York, USA',
        ip: '192.168.1.***',
        lastActive: '2024-03-06T09:15:00Z',
        current: false
      }
    ],
    loginHistory: [
      {
        id: '1',
        timestamp: '2024-03-06T11:30:00Z',
        device: 'iPhone 15 Pro',
        browser: 'Safari',
        location: 'New York, USA',
        ip: '192.168.1.100',
        success: true
      },
      {
        id: '2',
        timestamp: '2024-03-06T09:15:00Z',
        device: 'MacBook Pro',
        browser: 'Chrome',
        location: 'New York, USA',
        ip: '192.168.1.101',
        success: true
      },
      {
        id: '3',
        timestamp: '2024-03-05T22:45:00Z',
        device: 'Unknown',
        browser: 'Firefox',
        location: 'London, UK',
        ip: '203.0.113.50',
        success: false
      }
    ]
  },
  healthData: {
    dataSources: [
      {
        id: '1',
        name: 'Apple Health',
        type: 'app',
        connected: true,
        lastSync: '2024-03-06T10:00:00Z',
        dataTypes: ['steps', 'heart_rate', 'sleep', 'workouts']
      },
      {
        id: '2',
        name: 'Manual Entry',
        type: 'manual',
        connected: true,
        lastSync: null,
        dataTypes: ['weight', 'mood', 'symptoms']
      }
    ],
    importHistory: [
      {
        id: '1',
        source: 'Fitbit Export',
        date: '2024-02-15',
        recordsCount: 15234,
        status: 'completed'
      }
    ],
    retentionPeriod: 365,
    sharingWithProviders: [
      {
        providerId: '1',
        providerName: 'Dr. Sarah Johnson',
        enabled: true,
        dataTypes: ['heart_rate', 'blood_pressure', 'weight'],
        expiryDate: '2024-06-01'
      }
    ],
    researchParticipation: false,
    anonymizedDataSharing: false
  },
  preferences: {
    theme: 'system',
    language: 'en',
    units: 'metric',
    timeFormat: '12h',
    startOfWeek: 'sunday',
    dateFormat: 'MM/DD/YYYY',
    defaultLandingPage: 'dashboard',
    autoPlayVideos: false,
    reduceAnimations: false,
    highContrast: false,
    fontSize: 'medium',
    colorAccent: '#3b82f6'
  },
  devices: [
    {
      id: '1',
      name: 'Apple Watch Series 9',
      type: 'smartwatch',
      brand: 'Apple',
      model: 'Series 9',
      connected: true,
      batteryLevel: 78,
      lastSync: '2024-03-06T10:30:00Z',
      syncSettings: {
        autoSync: true,
        syncFrequency: 'realtime',
        dataTypes: ['steps', 'heart_rate', 'sleep', 'workouts', 'blood_oxygen']
      }
    },
    {
      id: '2',
      name: 'Withings Body+',
      type: 'smart_scale',
      brand: 'Withings',
      model: 'Body+',
      connected: true,
      batteryLevel: null,
      lastSync: '2024-03-06T08:00:00Z',
      syncSettings: {
        autoSync: true,
        syncFrequency: 'daily',
        dataTypes: ['weight', 'body_fat', 'muscle_mass']
      }
    }
  ],
  subscription: {
    currentPlan: 'premium',
    status: 'active',
    billingCycle: 'yearly',
    nextBillingDate: '2024-12-15',
    paymentMethods: [
      {
        id: '1',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true
      }
    ],
    billingHistory: [
      {
        id: '1',
        date: '2023-12-15',
        amount: 99.99,
        currency: 'USD',
        description: 'Premium Plan - Yearly',
        status: 'paid',
        invoiceUrl: '#'
      },
      {
        id: '2',
        date: '2022-12-15',
        amount: 99.99,
        currency: 'USD',
        description: 'Premium Plan - Yearly',
        status: 'paid',
        invoiceUrl: '#'
      }
    ],
    features: ['Unlimited AI Coaching', 'Advanced Analytics', 'Family Sharing (5 members)', 'Priority Support', 'Custom Reports']
  },
  reminders: {
    defaultReminderTime: '09:00',
    medication: {
      enabled: true,
      defaultTime: '08:00',
      advanceNotice: 15,
      sound: 'chime',
      vibrate: true
    },
    workout: {
      enabled: true,
      defaultTime: '07:00',
      daysOfWeek: [1, 2, 3, 4, 5],
      sound: 'energetic'
    },
    sleep: {
      enabled: true,
      bedtimeReminder: '22:00',
      wakeUpReminder: '06:30',
      windDownStart: 30
    },
    meals: {
      enabled: true,
      breakfastTime: '08:00',
      lunchTime: '12:30',
      dinnerTime: '19:00',
      snackReminders: false
    },
    customReminders: [
      {
        id: '1',
        title: 'Drink Water',
        time: '14:00',
        daysOfWeek: [1, 2, 3, 4, 5],
        enabled: true,
        category: 'hydration'
      }
    ]
  },
  social: {
    postVisibility: 'friends',
    messaging: 'friends',
    comments: 'friends',
    tagging: 'friends',
    blockedUsers: [],
    mutedAccounts: []
  }
};


// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const Toggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ checked, onChange, disabled, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7'
  };
  
  const thumbClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0.5',
    md: checked ? 'translate-x-6' : 'translate-x-1',
    lg: checked ? 'translate-x-7' : 'translate-x-1'
  };
  
  const thumbSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex ${sizeClasses[size]} items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={disabled}
    >
      <span
        className={`inline-block ${thumbSize[size]} transform rounded-full bg-white transition-transform duration-200 ${thumbClasses[size]}`}
      />
    </button>
  );
};

const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  className?: string;
}> = ({ value, onChange, options, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
      >
        <span className="flex items-center gap-2">
          {selected?.icon}
          <span className="text-gray-900 dark:text-white">{selected?.label}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  value === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Input: React.FC<{
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  helper?: string;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}> = ({ type = 'text', value, onChange, placeholder, label, helper, error, icon, disabled, className = '' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            icon ? 'pl-10' : ''
          } ${
            type === 'password' ? 'pr-10' : ''
          } ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helper}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

const TextArea: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  helper?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
}> = ({ value, onChange, placeholder, label, helper, rows = 4, maxLength, className = '' }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
      />
      <div className="flex justify-between mt-1">
        {helper && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{helper}</p>
        )}
        {maxLength && (
          <p className={`text-sm ml-auto ${value.length > maxLength * 0.9 ? 'text-amber-600' : 'text-gray-500 dark:text-gray-400'}`}>
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

const RadioGroup: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string; icon?: React.ReactNode }[];
}> = ({ value, onChange, options }) => {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
            value === option.value
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <input
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {option.icon}
              <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
            </div>
            {option.description && (
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
};

const Checkbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, description, disabled }) => {
  return (
    <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
    </label>
  );
};

const Slider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  valueLabel?: string;
}> = ({ value, onChange, min, max, step = 1, label, valueLabel }) => {
  return (
    <div>
      {label && (
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
          {valueLabel && (
            <span className="text-sm text-gray-500 dark:text-gray-400">{valueLabel}</span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

const ColorPicker: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label?: string;
}> = ({ value, onChange, label }) => {
  const presets = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'];
  
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              value === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-0 p-0"
          />
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ children, className = '', title, description, icon, action }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      {(title || icon) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}> = ({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled, loading, icon, className = '' }) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon}
      {children}
    </button>
  );
};

const Tooltip: React.FC<{
  content: string;
  children: React.ReactNode;
}> = ({ content, children }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap z-50">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
};

const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}> = ({ isOpen, onClose, onConfirm, title, description, confirmText = 'Confirm', cancelText = 'Cancel', danger }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${danger ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
};

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const DatabaseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const CookieIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 1010 10c0-5.523-4.477-10-10-10zm0 0v20m-5-5a2 2 0 100-4 2 2 0 000 4zm10-6a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);


// ============================================================================
// SECTION COMPONENTS
// ============================================================================

const AccountSection: React.FC<{
  settings: AccountSettings;
  onChange: (settings: AccountSettings) => void;
  hasChanges: boolean;
  onSave: () => void;
}> = ({ settings, onChange, hasChanges, onSave }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const handlePasswordChange = () => {
    if (passwordForm.new !== passwordForm.confirm) return;
    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Profile Information"
        description="Manage your public profile details"
        icon={<User className="w-5 h-5 text-blue-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {settings.profile.firstName[0]}{settings.profile.lastName[0]}
            </div>
            <div>
              <Button variant="secondary" size="sm" icon={<Upload className="w-4 h-4" />}>
                Upload Photo
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                JPG, PNG or GIF. Max 5MB.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={settings.profile.firstName}
              onChange={(v) => onChange({ ...settings, profile: { ...settings.profile, firstName: v } })}
            />
            <Input
              label="Last Name"
              value={settings.profile.lastName}
              onChange={(v) => onChange({ ...settings, profile: { ...settings.profile, lastName: v } })}
            />
          </div>
          
          <Input
            label="Display Name"
            value={settings.profile.displayName}
            onChange={(v) => onChange({ ...settings, profile: { ...settings.profile, displayName: v } })}
            helper="This is how you will appear to others"
          />
          
          <TextArea
            label="Bio"
            value={settings.profile.bio}
            onChange={(v) => onChange({ ...settings, profile: { ...settings.profile, bio: v } })}
            maxLength={160}
            helper="Brief description for your profile"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              value={settings.profile.dateOfBirth}
              onChange={(v) => onChange({ ...settings, profile: { ...settings.profile, dateOfBirth: v } })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <Select
                value={settings.profile.gender}
                onChange={(v) => onChange({ ...settings, profile: { ...settings.profile, gender: v as any } })}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'non-binary', label: 'Non-binary' },
                  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                ]}
              />
            </div>
          </div>
          
          <Input
            label="Phone Number"
            type="tel"
            value={settings.profile.phoneNumber}
            onChange={(v) => onChange({ ...settings, profile: { ...settings.profile, phoneNumber: v } })}
            icon={<Smartphone className="w-4 h-4" />}
          />
        </div>
      </Card>

      <Card
        title="Account Credentials"
        description="Manage your login information"
        icon={<Settings className="w-5 h-5 text-green-600" />}
      >
        <div className="space-y-4">
          <Input
            label="Username"
            value={settings.username}
            onChange={(v) => onChange({ ...settings, username: v })}
            helper="URL: ethoslife.com/u/{username}"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => onChange({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
                {settings.emailVerified && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {!settings.emailVerified ? (
                <Button
                  variant="secondary"
                  onClick={() => setEmailVerificationSent(true)}
                  disabled={emailVerificationSent}
                >
                  {emailVerificationSent ? 'Sent!' : 'Verify'}
                </Button>
              ) : (
                <Button variant="ghost" icon={<Check className="w-4 h-4 text-green-500" />}>
                  Verified
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Change Password"
        description="Update your password regularly for security"
        icon={<Lock className="w-5 h-5 text-amber-600" />}
      >
        <div className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            value={passwordForm.current}
            onChange={(v) => setPasswordForm({ ...passwordForm, current: v })}
          />
          <Input
            type="password"
            label="New Password"
            value={passwordForm.new}
            onChange={(v) => setPasswordForm({ ...passwordForm, new: v })}
          />
          <Input
            type="password"
            label="Confirm New Password"
            value={passwordForm.confirm}
            onChange={(v) => setPasswordForm({ ...passwordForm, confirm: v })}
            error={passwordForm.confirm && passwordForm.new !== passwordForm.confirm ? 'Passwords do not match' : undefined}
          />
          <Button
            onClick={handlePasswordChange}
            disabled={!passwordForm.current || !passwordForm.new || passwordForm.new !== passwordForm.confirm}
            loading={isChangingPassword}
          >
            Update Password
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last changed: {new Date(settings.passwordLastChanged).toLocaleDateString()}
          </p>
        </div>
      </Card>

      <Card
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
        icon={<Shield className="w-5 h-5 text-purple-600" />}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {settings.twoFactorEnabled ? '2FA is enabled' : '2FA is disabled'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {settings.twoFactorEnabled 
                ? 'Your account is protected with an authenticator app'
                : 'Protect your account with an additional verification step'
              }
            </p>
          </div>
          <Toggle
            checked={settings.twoFactorEnabled}
            onChange={(v) => onChange({ ...settings, twoFactorEnabled: v })}
          />
        </div>
        {settings.twoFactorEnabled && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Authenticator app connected</span>
            </div>
            <Button variant="ghost" size="sm" className="mt-2">Configure 2FA</Button>
          </div>
        )}
      </Card>

      <Card
        title="Data and Account"
        description="Export your data or delete your account"
        icon={<FileText className="w-5 h-5 text-gray-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Export Your Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download a copy of all your personal data
              </p>
            </div>
            <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={() => setShowExportConfirm(true)}>
              Request Export
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-lg">
            <div>
              <p className="font-medium text-red-700 dark:text-red-400">Delete Account</p>
              <p className="text-sm text-red-600/80 dark:text-red-400/80">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="danger" icon={<Trash2 className="w-4 h-4" />} onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </Button>
          </div>
        </div>
      </Card>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => { setShowDeleteConfirm(false); }}
        title="Delete Your Account?"
        description="This action cannot be undone. All your data, including health records, goals, and settings will be permanently deleted."
        confirmText="Delete Account"
        danger
      />
      
      <ConfirmModal
        isOpen={showExportConfirm}
        onClose={() => setShowExportConfirm(false)}
        onConfirm={() => { setShowExportConfirm(false); }}
        title="Request Data Export?"
        description="We will prepare a ZIP file with all your personal data and send you a download link via email. This may take up to 24 hours."
        confirmText="Request Export"
      />
    </div>
  );
};

const NotificationsSection: React.FC<{
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
}> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6">
      <Card
        title="Email Notifications"
        description="Control which emails you receive"
        icon={<Mail className="w-5 h-5 text-blue-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Email Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Master switch for all email notifications</p>
            </div>
            <Toggle
              checked={settings.email.enabled}
              onChange={(v) => onChange({ ...settings, email: { ...settings.email, enabled: v } })}
            />
          </div>
          
          <div className="space-y-3">
            <Checkbox
              checked={settings.email.weeklyReports}
              onChange={(v) => onChange({ ...settings, email: { ...settings.email, weeklyReports: v } })}
              label="Weekly Health Reports"
              description="Summary of your weekly health metrics and progress"
              disabled={!settings.email.enabled}
            />
            <Checkbox
              checked={settings.email.goalReminders}
              onChange={(v) => onChange({ ...settings, email: { ...settings.email, goalReminders: v } })}
              label="Goal Reminders"
              description="Notifications about upcoming and overdue goals"
              disabled={!settings.email.enabled}
            />
            <Checkbox
              checked={settings.email.newFeatures}
              onChange={(v) => onChange({ ...settings, email: { ...settings.email, newFeatures: v } })}
              label="New Features and Updates"
              description="Learn about new features and improvements"
              disabled={!settings.email.enabled}
            />
            <Checkbox
              checked={settings.email.marketing}
              onChange={(v) => onChange({ ...settings, email: { ...settings.email, marketing: v } })}
              label="Marketing and Promotions"
              description="Special offers and promotional content"
              disabled={!settings.email.enabled}
            />
          </div>
        </div>
      </Card>

      <Card
        title="Push Notifications"
        description="Mobile and desktop push notifications"
        icon={<Bell className="w-5 h-5 text-green-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Push Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications on your devices</p>
            </div>
            <Toggle
              checked={settings.push.enabled}
              onChange={(v) => onChange({ ...settings, push: { ...settings.push, enabled: v } })}
            />
          </div>
          
          <div className="space-y-3">
            <Checkbox
              checked={settings.push.medicationReminders}
              onChange={(v) => onChange({ ...settings, push: { ...settings.push, medicationReminders: v } })}
              label="Medication Reminders"
              description="Reminders to take your medications"
              disabled={!settings.push.enabled}
            />
            <Checkbox
              checked={settings.push.activityReminders}
              onChange={(v) => onChange({ ...settings, push: { ...settings.push, activityReminders: v } })}
              label="Activity Reminders"
              description="Workout and activity notifications"
              disabled={!settings.push.enabled}
            />
            <Checkbox
              checked={settings.push.sleepAlerts}
              onChange={(v) => onChange({ ...settings, push: { ...settings.push, sleepAlerts: v } })}
              label="Sleep Schedule Alerts"
              description="Bedtime and wake-up reminders"
              disabled={!settings.push.enabled}
            />
            <Checkbox
              checked={settings.push.socialInteractions}
              onChange={(v) => onChange({ ...settings, push: { ...settings.push, socialInteractions: v } })}
              label="Social Interactions"
              description="Comments, likes, and new followers"
              disabled={!settings.push.enabled}
            />
          </div>
        </div>
      </Card>

      <Card
        title="Quiet Hours"
        description="Pause notifications during specific times"
        icon={<Moon className="w-5 h-5 text-purple-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Quiet Hours</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Silence non-urgent notifications</p>
            </div>
            <Toggle
              checked={settings.quietHours.enabled}
              onChange={(v) => onChange({ ...settings, quietHours: { ...settings.quietHours, enabled: v } })}
            />
          </div>
          
          {settings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                <input
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) => onChange({ ...settings, quietHours: { ...settings.quietHours, start: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                <input
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) => onChange({ ...settings, quietHours: { ...settings.quietHours, end: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="Digest Preferences"
        description="How often you want summary emails"
        icon={<Clock className="w-5 h-5 text-amber-600" />}
      >
        <RadioGroup
          value={settings.digestFrequency}
          onChange={(v) => onChange({ ...settings, digestFrequency: v as any })}
          options={[
            { value: 'daily', label: 'Daily Digest', description: 'Receive a summary every day at 8 AM' },
            { value: 'weekly', label: 'Weekly Digest', description: 'Receive a summary every Monday morning' },
            { value: 'never', label: 'No Digest', description: 'Only send important notifications' }
          ]}
        />
      </Card>
    </div>
  );
};

const PrivacySection: React.FC<{
  settings: PrivacySettings;
  onChange: (settings: PrivacySettings) => void;
}> = ({ settings, onChange }) => {
  const [showTerminateAll, setShowTerminateAll] = useState(false);

  return (
    <div className="space-y-6">
      <Card
        title="Profile Visibility"
        description="Control who can see your profile"
        icon={<Eye className="w-5 h-5 text-blue-600" />}
      >
        <RadioGroup
          value={settings.profileVisibility}
          onChange={(v) => onChange({ ...settings, profileVisibility: v as any })}
          options={[
            { value: 'public', label: 'Public', description: 'Anyone can view your profile', icon:<Globe className="w-4 h-4"/> },
            { value: 'friends', label: 'Friends Only', description: 'Only connected friends can view', icon:<Users className="w-4 h-4"/> },
            { value: 'private', label: 'Private', description: 'Only you can view your profile', icon:<Lock className="w-4 h-4"/> }
          ]}
        />
      </Card>

      <Card
        title="Activity Sharing"
        description="Who can see your health activities and posts"
        icon={<Activity className="w-5 h-5 text-green-600" />}
      >
        <Select
          value={settings.activitySharing}
          onChange={(v) => onChange({ ...settings, activitySharing: v as any })}
          options={[
            { value: 'everyone', label: 'Everyone' },
            { value: 'friends', label: 'Friends Only' },
            { value: 'only-me', label: 'Only Me' }
          ]}
        />
      </Card>

      <Card
        title="Data Collection"
        description="Manage how we collect and use your data"
        icon={<DatabaseIcon className="w-5 h-5 text-purple-600" />}
      >
        <div className="space-y-4">
          <Checkbox
            checked={settings.dataCollection.analytics}
            onChange={(v) => onChange({ ...settings, dataCollection: { ...settings.dataCollection, analytics: v } })}
            label="Analytics Data"
            description="Help us improve by sharing usage statistics"
          />
          <Checkbox
            checked={settings.dataCollection.personalization}
            onChange={(v) => onChange({ ...settings, dataCollection: { ...settings.dataCollection, personalization: v } })}
            label="Personalization"
            description="Allow us to personalize your experience"
          />
          <Checkbox
            checked={settings.dataCollection.crashReports}
            onChange={(v) => onChange({ ...settings, dataCollection: { ...settings.dataCollection, crashReports: v } })}
            label="Crash Reports"
            description="Automatically send error reports"
          />
        </div>
      </Card>

      <Card
        title="Third-Party Sharing"
        description="Control data sharing with partners"
        icon={<ExternalLink className="w-5 h-5 text-amber-600" />}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Allow Third-Party Sharing</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share anonymized data with trusted partners
            </p>
          </div>
          <Toggle
            checked={settings.thirdPartySharing}
            onChange={(v) => onChange({ ...settings, thirdPartySharing: v })}
          />
        </div>
      </Card>

      <Card
        title="Cookie Preferences"
        description="Manage cookie settings"
        icon={<CookieIcon className="w-5 h-5 text-pink-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Essential Cookies</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Required for the app to function</p>
            </div>
            <Toggle checked={true} onChange={() => {}} disabled />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Functional Cookies</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remember your preferences</p>
            </div>
            <Toggle
              checked={settings.cookies.functional}
              onChange={(v) => onChange({ ...settings, cookies: { ...settings.cookies, functional: v } })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Analytics Cookies</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Help us improve our service</p>
            </div>
            <Toggle
              checked={settings.cookies.analytics}
              onChange={(v) => onChange({ ...settings, cookies: { ...settings.cookies, analytics: v } })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Marketing Cookies</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Used for targeted advertising</p>
            </div>
            <Toggle
              checked={settings.cookies.marketing}
              onChange={(v) => onChange({ ...settings, cookies: { ...settings.cookies, marketing: v } })}
            />
          </div>
        </div>
      </Card>

      <Card
        title="Active Sessions"
        description="Manage your active logins"
        icon={<DeviceIcon className="w-5 h-5 text-cyan-600" />}
      >
        <div className="space-y-3">
          {settings.sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                session.current ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {session.device.includes('iPhone') || session.device.includes('Android') ? (
                    <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <DeviceIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session.device}
                    {session.current && <Badge variant="info" className="ml-2">Current</Badge>}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {session.browser} • {session.location} • {session.ip}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Last active: {new Date(session.lastActive).toLocaleString()}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />}>
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          className="mt-4 w-full"
          icon={<LogOut className="w-4 h-4" />}
          onClick={() => setShowTerminateAll(true)}
        >
          Sign Out All Other Devices
        </Button>
      </Card>

      <Card
        title="Login History"
        description="Recent account access attempts"
        icon={<History className="w-5 h-5 text-gray-600" />}
      >
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {settings.loginHistory.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={entry.success ? 'text-green-500' : 'text-red-500'}>
                  {entry.success ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {entry.device} • {entry.browser}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.location} • {entry.ip}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(entry.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <ConfirmModal
        isOpen={showTerminateAll}
        onClose={() => setShowTerminateAll(false)}
        onConfirm={() => setShowTerminateAll(false)}
        title="Sign Out All Devices?"
        description="This will sign you out of all devices except your current one. You will need to sign in again on other devices."
        confirmText="Sign Out All"
      />
    </div>
  );
};


const HealthDataSection: React.FC<{
  settings: HealthDataSettings;
  onChange: (settings: HealthDataSettings) => void;
}> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6">
      <Card
        title="Data Sources"
        description="Manage connected health data sources"
        icon={<DatabaseIcon className="w-5 h-5 text-blue-600" />}
      >
        <div className="space-y-3">
          {settings.dataSources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {source.type === 'app' ? (
                    <Activity className="w-5 h-5 text-green-600" />
                  ) : source.type === 'wearable' ? (
                    <Watch className="w-5 h-5 text-blue-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{source.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {source.dataTypes.join(', ')} • {source.lastSync ? `Last sync: ${new Date(source.lastSync).toLocaleDateString()}` : 'Manual entry'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={source.connected ? 'success' : 'default'}>
                  {source.connected ? 'Connected' : 'Disconnected'}
                </Badge>
                <Button variant="ghost" size="sm" icon={<MoreVertical className="w-4 h-4" />} />
              </div>
            </div>
          ))}
          <Button variant="secondary" className="w-full" icon={<Plus className="w-4 h-4" />}>
            Connect New Source
          </Button>
        </div>
      </Card>

      <Card
        title="Import Data"
        description="Import health data from files or services"
        icon={<Upload className="w-5 h-5 text-green-600" />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <FileText className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CSV File</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <Activity className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Apple Health</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <Globe className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google Fit</span>
            </button>
          </div>
          
          {settings.importHistory.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Import History</h4>
              <div className="space-y-2">
                {settings.importHistory.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.source}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{entry.recordsCount.toLocaleString()} records</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={entry.status === 'completed' ? 'success' : entry.status === 'failed' ? 'error' : 'warning'}>
                        {entry.status}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{entry.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="Export Health Data"
        description="Download your health records"
        icon={<Download className="w-5 h-5 text-amber-600" />}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Export all your health data in various formats. This may take a few minutes depending on the amount of data.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" icon={<FileText className="w-4 h-4" />}>CSV</Button>
            <Button variant="secondary" size="sm" icon={<FileText className="w-4 h-4" />}>JSON</Button>
            <Button variant="secondary" size="sm" icon={<FileText className="w-4 h-4" />}>PDF Report</Button>
          </div>
        </div>
      </Card>

      <Card
        title="Data Retention"
        description="Control how long we keep your data"
        icon={<Clock className="w-5 h-5 text-purple-600" />}
      >
        <Slider
          value={settings.retentionPeriod}
          onChange={(v) => onChange({ ...settings, retentionPeriod: v })}
          min={30}
          max={365 * 5}
          step={30}
          label="Keep data for"
          valueLabel={`${Math.floor(settings.retentionPeriod / 365)} years ${settings.retentionPeriod % 365 > 0 ? `${settings.retentionPeriod % 365} days` : ''}`}
        />
      </Card>

      <Card
        title="Healthcare Providers"
        description="Share data with your doctors"
        icon={<Heart className="w-5 h-5 text-red-600" />}
      >
        <div className="space-y-3">
          {settings.sharingWithProviders.map((provider) => (
            <div key={provider.providerId} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{provider.providerName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {provider.dataTypes.join(', ')} • Expires: {new Date(provider.expiryDate).toLocaleDateString()}
                </p>
              </div>
              <Toggle
                checked={provider.enabled}
                onChange={(v) => {
                  const updated = settings.sharingWithProviders.map(p =>
                    p.providerId === provider.providerId ? { ...p, enabled: v } : p
                  );
                  onChange({ ...settings, sharingWithProviders: updated });
                }}
              />
            </div>
          ))}
          <Button variant="secondary" className="w-full" icon={<Plus className="w-4 h-4" />}>
            Add Healthcare Provider
          </Button>
        </div>
      </Card>

      <Card
        title="Research Participation"
        description="Contribute to health research"
        icon={<Lightbulb className="w-5 h-5 text-yellow-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Participate in Research</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Share anonymized data with health researchers
              </p>
            </div>
            <Toggle
              checked={settings.researchParticipation}
              onChange={(v) => onChange({ ...settings, researchParticipation: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Anonymized Data Sharing</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allow use of your anonymized data for insights
              </p>
            </div>
            <Toggle
              checked={settings.anonymizedDataSharing}
              onChange={(v) => onChange({ ...settings, anonymizedDataSharing: v })}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

const PreferencesSection: React.FC<{
  settings: AppPreferences;
  onChange: (settings: AppPreferences) => void;
}> = ({ settings, onChange }) => {
  const languages = [
    { value: 'en', label: 'English', icon: '🇺🇸' },
    { value: 'es', label: 'Español', icon: '🇪🇸' },
    { value: 'de', label: 'Deutsch', icon: '🇩🇪' },
    { value: 'pl', label: 'Polski', icon: '🇵🇱' },
    { value: 'he', label: 'עברית', icon: '🇮🇱' },
    { value: 'ar', label: 'العربية', icon: '🇸🇦' },
    { value: 'ru', label: 'Русский', icon: '🇷🇺' },
    { value: 'ko', label: '한국어', icon: '🇰🇷' },
    { value: 'ja', label: '日本語', icon: '🇯🇵' },
    { value: 'zh', label: '中文', icon: '🇨🇳' }
  ];

  const landingPages = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'health', label: 'Health Overview' },
    { value: 'goals', label: 'Goals' },
    { value: 'ai-coach', label: 'AI Coach' },
    { value: 'social', label: 'Social Feed' }
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Appearance"
        description="Customize the look and feel"
        icon={<Palette className="w-5 h-5 text-purple-600" />}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
            <RadioGroup
              value={settings.theme}
              onChange={(v) => onChange({ ...settings, theme: v as any })}
              options={[
                { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                { value: 'system', label: 'System', icon: <Settings className="w-4 h-4" /> }
              ]}
            />
          </div>
          
          <ColorPicker
            label="Accent Color"
            value={settings.colorAccent}
            onChange={(v) => onChange({ ...settings, colorAccent: v })}
          />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">High Contrast Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Increase contrast for better visibility</p>
            </div>
            <Toggle
              checked={settings.highContrast}
              onChange={(v) => onChange({ ...settings, highContrast: v })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
            <Select
              value={settings.fontSize}
              onChange={(v) => onChange({ ...settings, fontSize: v as any })}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ]}
            />
          </div>
        </div>
      </Card>

      <Card
        title="Localization"
        description="Language and regional settings"
        icon={<Globe className="w-5 h-5 text-blue-600" />}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
            <Select
              value={settings.language}
              onChange={(v) => onChange({ ...settings, language: v })}
              options={languages.map(l => ({ value: l.value, label: `${l.icon} ${l.label}` }))}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Units</label>
              <Select
                value={settings.units}
                onChange={(v) => onChange({ ...settings, units: v as any })}
                options={[
                  { value: 'metric', label: 'Metric (kg, km, °C)' },
                  { value: 'imperial', label: 'Imperial (lb, mi, °F)' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Format</label>
              <Select
                value={settings.timeFormat}
                onChange={(v) => onChange({ ...settings, timeFormat: v as any })}
                options={[
                  { value: '12h', label: '12-hour (AM/PM)' },
                  { value: '24h', label: '24-hour' }
                ]}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start of Week</label>
              <Select
                value={settings.startOfWeek}
                onChange={(v) => onChange({ ...settings, startOfWeek: v as any })}
                options={[
                  { value: 'sunday', label: 'Sunday' },
                  { value: 'monday', label: 'Monday' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Format</label>
              <Select
                value={settings.dateFormat}
                onChange={(v) => onChange({ ...settings, dateFormat: v as any })}
                options={[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                ]}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="App Behavior"
        description="Control how the app behaves"
        icon={<Sliders className="w-5 h-5 text-green-600" />}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Landing Page</label>
            <Select
              value={settings.defaultLandingPage}
              onChange={(v) => onChange({ ...settings, defaultLandingPage: v })}
              options={landingPages}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Auto-play Videos</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Automatically play videos in feed</p>
            </div>
            <Toggle
              checked={settings.autoPlayVideos}
              onChange={(v) => onChange({ ...settings, autoPlayVideos: v })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Reduce Animations</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Minimize motion for accessibility</p>
            </div>
            <Toggle
              checked={settings.reduceAnimations}
              onChange={(v) => onChange({ ...settings, reduceAnimations: v })}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};


const DevicesSection: React.FC<{
  devices: ConnectedDevice[];
  onChange: (devices: ConnectedDevice[]) => void;
}> = ({ devices, onChange }) => {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);

  const deviceIcons: Record<string, React.ReactNode> = {
    smartwatch: <Watch className="w-5 h-5" />,
    fitness_tracker: <Activity className="w-5 h-5" />,
    smart_scale: <Sliders className="w-5 h-5" />,
    blood_pressure: <Heart className="w-5 h-5" />,
    glucose_meter: <Activity className="w-5 h-5" />,
    other: <DeviceIcon className="w-5 h-5" />
  };

  return (
    <div className="space-y-6">
      <Card
        title="Connected Devices"
        description="Manage your wearable and health devices"
        icon={<Watch className="w-5 h-5 text-blue-600" />}
        action={
          <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Connect Device
          </Button>
        }
      >
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  {deviceIcons[device.type]}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{device.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {device.brand} {device.model} • Last sync: {new Date(device.lastSync).toLocaleTimeString()}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant={device.connected ? 'success' : 'default'}>
                      {device.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                    {device.batteryLevel !== null && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Battery className="w-3 h-3" />
                        {device.batteryLevel}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip content="Sync now">
                  <Button variant="ghost" size="sm" icon={<RefreshCw className="w-4 h-4" />} />
                </Tooltip>
                <Tooltip content="Settings">
                  <Button variant="ghost" size="sm" icon={<Settings className="w-4 h-4" />} />
                </Tooltip>
                <Tooltip content="Remove">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4 text-red-500" />}
                    onClick={() => setShowRemoveConfirm(device.id)}
                  />
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Health App Integrations"
        description="Sync with platform health apps"
        icon={<Heart className="w-5 h-5 text-red-600" />}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Activity className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Apple Health</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">iPhone and Apple Watch data</p>
              </div>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Google Fit</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Android and Wear OS data</p>
              </div>
            </div>
            <Toggle checked={false} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Samsung Health</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Galaxy devices and watches</p>
              </div>
            </div>
            <Toggle checked={false} onChange={() => {}} />
          </div>
        </div>
      </Card>

      {showRemoveConfirm && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setShowRemoveConfirm(null)}
          onConfirm={() => {
            onChange(devices.filter(d => d.id !== showRemoveConfirm));
            setShowRemoveConfirm(null);
          }}
          title="Remove Device?"
          description="This will disconnect the device and remove all associated data from your account."
          confirmText="Remove"
          danger
        />
      )}
    </div>
  );
};

const SubscriptionSection: React.FC<{
  settings: SubscriptionSettings;
  onChange: (settings: SubscriptionSettings) => void;
}> = ({ settings, onChange }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <Card
        title="Current Plan"
        description="Your subscription details"
        icon={<Crown className="w-5 h-5 text-amber-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white">
            <div>
              <p className="text-sm opacity-90">Current Plan</p>
              <p className="text-2xl font-bold capitalize">{settings.currentPlan}</p>
              <p className="text-sm opacity-90">
                {settings.billingCycle} • Next billing: {new Date(settings.nextBillingDate).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="success" className="bg-white/20 text-white border-0">Active</Badge>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Included Features</h4>
            <ul className="space-y-2">
              {settings.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button variant="primary" className="flex-1">Upgrade Plan</Button>
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700"
              onClick={() => setShowCancelConfirm(true)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>

      <Card
        title="Payment Methods"
        description="Manage your payment options"
        icon={<CardIcon className="w-5 h-5 text-blue-600" />}
      >
        <div className="space-y-3">
          {settings.paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                method.isDefault ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {method.brand} •••• {method.last4}
                    {method.isDefault && <Badge variant="info" className="ml-2">Default</Badge>}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          ))}
          <Button variant="secondary" className="w-full" icon={<Plus className="w-4 h-4" />}>
            Add Payment Method
          </Button>
        </div>
      </Card>

      <Card
        title="Billing History"
        description="View and download past invoices"
        icon={<History className="w-5 h-5 text-green-600" />}
      >
        <div className="space-y-2">
          {settings.billingHistory.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{entry.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{entry.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900 dark:text-white">
                  ${entry.amount} {entry.currency}
                </span>
                <Badge variant={entry.status === 'paid' ? 'success' : entry.status === 'failed' ? 'error' : 'warning'}>
                  {entry.status}
                </Badge>
                <Button variant="ghost" size="sm" icon={<FileDown className="w-4 h-4" />}>
                  PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Promo Code"
        description="Redeem a discount code"
        icon={<Percent className="w-5 h-5 text-purple-600" />}
      >
        <div className="flex gap-2">
          <Input
            placeholder="Enter promo code"
            value=""
            onChange={() => {}}
            className="flex-1"
          />
          <Button variant="secondary">Redeem</Button>
        </div>
      </Card>

      <ConfirmModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={() => { setShowCancelConfirm(false); }}
        title="Cancel Subscription?"
        description="You will continue to have access until the end of your billing period. After that, your account will be downgraded to the Free plan."
        confirmText="Cancel Subscription"
        danger
      />
    </div>
  );
};

const RemindersSection: React.FC<{
  settings: ReminderSettings;
  onChange: (settings: ReminderSettings) => void;
}> = ({ settings, onChange }) => {
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<CustomReminder>>({
    title: '',
    time: '09:00',
    daysOfWeek: [1, 2, 3, 4, 5],
    enabled: true,
    category: 'general'
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (day: number) => {
    const current = newReminder.daysOfWeek || [];
    if (current.includes(day)) {
      setNewReminder({ ...newReminder, daysOfWeek: current.filter(d => d !== day) });
    } else {
      setNewReminder({ ...newReminder, daysOfWeek: [...current, day].sort() });
    }
  };

  const addReminder = () => {
    if (!newReminder.title) return;
    const reminder: CustomReminder = {
      id: Date.now().toString(),
      title: newReminder.title!,
      time: newReminder.time!,
      daysOfWeek: newReminder.daysOfWeek!,
      enabled: newReminder.enabled!,
      category: newReminder.category!
    };
    onChange({ ...settings, customReminders: [...settings.customReminders, reminder] });
    setShowAddReminder(false);
    setNewReminder({ title: '', time: '09:00', daysOfWeek: [1, 2, 3, 4, 5], enabled: true, category: 'general' });
  };

  return (
    <div className="space-y-6">
      <Card
        title="Medication Reminders"
        description="Never miss your medications"
        icon={<Pill className="w-5 h-5 text-blue-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Medication Reminders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when it is time to take medication</p>
            </div>
            <Toggle
              checked={settings.medication.enabled}
              onChange={(v) => onChange({ ...settings, medication: { ...settings.medication, enabled: v } })}
            />
          </div>
          
          {settings.medication.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Time</label>
                <input
                  type="time"
                  value={settings.medication.defaultTime}
                  onChange={(e) => onChange({ ...settings, medication: { ...settings.medication, defaultTime: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Advance Notice</label>
                <Select
                  value={settings.medication.advanceNotice.toString()}
                  onChange={(v) => onChange({ ...settings, medication: { ...settings.medication, advanceNotice: parseInt(v) } })}
                  options={[
                    { value: '0', label: 'At time of dose' },
                    { value: '5', label: '5 minutes before' },
                    { value: '15', label: '15 minutes before' },
                    { value: '30', label: '30 minutes before' }
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="Workout Reminders"
        description="Stay on track with your fitness goals"
        icon={<Dumbbell className="w-5 h-5 text-green-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Workout Reminders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get reminded to exercise</p>
            </div>
            <Toggle
              checked={settings.workout.enabled}
              onChange={(v) => onChange({ ...settings, workout: { ...settings.workout, enabled: v } })}
            />
          </div>
          
          {settings.workout.enabled && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Time</label>
                <input
                  type="time"
                  value={settings.workout.defaultTime}
                  onChange={(e) => onChange({ ...settings, workout: { ...settings.workout, defaultTime: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active Days</label>
                <div className="flex gap-2">
                  {daysOfWeek.map((day, idx) => (
                    <button
                      key={day}
                      onClick={() => {
                        const current = settings.workout.daysOfWeek;
                        const newDays = current.includes(idx)
                          ? current.filter(d => d !== idx)
                          : [...current, idx].sort();
                        onChange({ ...settings, workout: { ...settings.workout, daysOfWeek: newDays } });
                      }}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        settings.workout.daysOfWeek.includes(idx)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {day[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="Sleep Schedule"
        description="Maintain healthy sleep habits"
        icon={<Bed className="w-5 h-5 text-purple-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Sleep Reminders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get reminded for bedtime and wake-up</p>
            </div>
            <Toggle
              checked={settings.sleep.enabled}
              onChange={(v) => onChange({ ...settings, sleep: { ...settings.sleep, enabled: v } })}
            />
          </div>
          
          {settings.sleep.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedtime Reminder</label>
                <input
                  type="time"
                  value={settings.sleep.bedtimeReminder}
                  onChange={(e) => onChange({ ...settings, sleep: { ...settings.sleep, bedtimeReminder: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wake-up Reminder</label>
                <input
                  type="time"
                  value={settings.sleep.wakeUpReminder}
                  onChange={(e) => onChange({ ...settings, sleep: { ...settings.sleep, wakeUpReminder: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <Slider
                  value={settings.sleep.windDownStart}
                  onChange={(v) => onChange({ ...settings, sleep: { ...settings.sleep, windDownStart: v } })}
                  min={0}
                  max={120}
                  step={15}
                  label="Wind-down starts"
                  valueLabel={`${settings.sleep.windDownStart} min before bedtime`}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="Meal Reminders"
        description="Track your nutrition consistently"
        icon={<Utensils className="w-5 h-5 text-orange-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Meal Reminders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get reminded to log your meals</p>
            </div>
            <Toggle
              checked={settings.meals.enabled}
              onChange={(v) => onChange({ ...settings, meals: { ...settings.meals, enabled: v } })}
            />
          </div>
          
          {settings.meals.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Breakfast</label>
                <input
                  type="time"
                  value={settings.meals.breakfastTime}
                  onChange={(e) => onChange({ ...settings, meals: { ...settings.meals, breakfastTime: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lunch</label>
                <input
                  type="time"
                  value={settings.meals.lunchTime}
                  onChange={(e) => onChange({ ...settings, meals: { ...settings.meals, lunchTime: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dinner</label>
                <input
                  type="time"
                  value={settings.meals.dinnerTime}
                  onChange={(e) => onChange({ ...settings, meals: { ...settings.meals, dinnerTime: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="Custom Reminders"
        description="Create your own reminders"
        icon={<PlusCircle className="w-5 h-5 text-pink-600" />}
        action={
          <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddReminder(true)}>
            Add Reminder
          </Button>
        }
      >
        <div className="space-y-3">
          {settings.customReminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{reminder.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {reminder.time} • {reminder.daysOfWeek.map(d => daysOfWeek[d]).join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Toggle
                  checked={reminder.enabled}
                  onChange={(v) => {
                    const updated = settings.customReminders.map(r =>
                      r.id === reminder.id ? { ...r, enabled: v } : r
                    );
                    onChange({ ...settings, customReminders: updated });
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="w-4 h-4 text-red-500" />}
                  onClick={() => {
                    const updated = settings.customReminders.filter(r => r.id !== reminder.id);
                    onChange({ ...settings, customReminders: updated });
                  }}
                />
              </div>
            </div>
          ))}
          {settings.customReminders.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No custom reminders yet</p>
          )}
        </div>
      </Card>

      {showAddReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Custom Reminder</h3>
            <div className="space-y-4">
              <Input
                label="Reminder Title"
                value={newReminder.title || ''}
                onChange={(v) => setNewReminder({ ...newReminder, title: v })}
                placeholder="e.g., Drink Water"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active Days</label>
                <div className="flex gap-2">
                  {daysOfWeek.map((day, idx) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(idx)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        newReminder.daysOfWeek?.includes(idx)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {day[0]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <Select
                  value={newReminder.category || 'general'}
                  onChange={(v) => setNewReminder({ ...newReminder, category: v })}
                  options={[
                    { value: 'general', label: 'General' },
                    { value: 'hydration', label: 'Hydration' },
                    { value: 'meditation', label: 'Meditation' },
                    { value: 'posture', label: 'Posture Check' },
                    { value: 'custom', label: 'Custom' }
                  ]}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="ghost" className="flex-1" onClick={() => setShowAddReminder(false)}>Cancel</Button>
              <Button className="flex-1" onClick={addReminder} disabled={!newReminder.title}>Add Reminder</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const SocialSection: React.FC<{
  settings: SocialSettings;
  onChange: (settings: SocialSettings) => void;
}> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6">
      <Card
        title="Post Visibility"
        description="Who can see your posts by default"
        icon={<Eye className="w-5 h-5 text-blue-600" />}
      >
        <RadioGroup
          value={settings.postVisibility}
          onChange={(v) => onChange({ ...settings, postVisibility: v as any })}
          options={[
            { value: 'public', label: 'Public', description: 'Anyone can see your posts' },
            { value: 'friends', label: 'Friends Only', description: 'Only friends can see your posts' },
            { value: 'private', label: 'Private', description: 'Only you can see your posts' }
          ]}
        />
      </Card>

      <Card
        title="Messaging"
        description="Control who can send you messages"
        icon={<MessageCircle className="w-5 h-5 text-green-600" />}
      >
        <RadioGroup
          value={settings.messaging}
          onChange={(v) => onChange({ ...settings, messaging: v as any })}
          options={[
            { value: 'everyone', label: 'Everyone', description: 'Anyone can message you' },
            { value: 'friends', label: 'Friends Only', description: 'Only friends can message you' },
            { value: 'nobody', label: 'Nobody', description: 'Disable direct messages' }
          ]}
        />
      </Card>

      <Card
        title="Comments"
        description="Who can comment on your posts"
        icon={<MessageSquare className="w-5 h-5 text-purple-600" />}
      >
        <RadioGroup
          value={settings.comments}
          onChange={(v) => onChange({ ...settings, comments: v as any })}
          options={[
            { value: 'everyone', label: 'Everyone', description: 'Anyone can comment' },
            { value: 'friends', label: 'Friends Only', description: 'Only friends can comment' },
            { value: 'nobody', label: 'Nobody', description: 'Disable comments' }
          ]}
        />
      </Card>

      <Card
        title="Tagging"
        description="Who can tag you in posts"
        icon={<AtSign className="w-5 h-5 text-amber-600" />}
      >
        <RadioGroup
          value={settings.tagging}
          onChange={(v) => onChange({ ...settings, tagging: v as any })}
          options={[
            { value: 'everyone', label: 'Everyone', description: 'Anyone can tag you' },
            { value: 'friends', label: 'Friends Only', description: 'Only friends can tag you' },
            { value: 'nobody', label: 'Nobody', description: 'Disable tagging' }
          ]}
        />
      </Card>

      <Card
        title="Blocked Users"
        description="People you have blocked"
        icon={<Ban className="w-5 h-5 text-red-600" />}
      >
        {settings.blockedUsers.length > 0 ? (
          <div className="space-y-2">
            {settings.blockedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-medium">
                    {user.displayName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.displayName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">Unblock</Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No blocked users</p>
        )}
      </Card>

      <Card
        title="Muted Accounts"
        description="Accounts you have muted"
        icon={<VolumeX className="w-5 h-5 text-gray-600" />}
      >
        {settings.mutedAccounts.length > 0 ? (
          <div className="space-y-2">
            {settings.mutedAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-medium">
                    {account.displayName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{account.displayName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{account.username} • {account.expiresAt ? `Until ${account.expiresAt}` : 'Indefinitely'}
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">Unmute</Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No muted accounts</p>
        )}
      </Card>
    </div>
  );
};

const HelpSection: React.FC = () => {
  const [activeTicket, setActiveTicket] = useState<'none' | 'support' | 'bug' | 'feature'>('none');
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '', category: '' });

  const faqs = [
    { question: 'How do I sync my Apple Watch?', answer: 'Go to Settings > Connected Devices and tap "Connect Device" to pair your Apple Watch.' },
    { question: 'Can I export my health data?', answer: 'Yes! Go to Settings > Health Data > Export to download your data in CSV, JSON, or PDF format.' },
    { question: 'How do I cancel my subscription?', answer: 'Navigate to Settings > Subscription & Billing and click "Cancel Subscription" at the bottom of the page.' },
    { question: 'Is my data secure?', answer: 'Absolutely. We use end-to-end encryption and comply with HIPAA and GDPR regulations.' }
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Frequently Asked Questions"
        description="Quick answers to common questions"
        icon={<HelpCircle className="w-5 h-5 text-blue-600" />}
      >
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group">
              <summary className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="p-3 text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Card>

      <Card
        title="Contact Support"
        description="Get help from our team"
        icon={<LifeBuoy className="w-5 h-5 text-green-600" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTicket('support')}
            className="flex flex-col items-center gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-gray-900 dark:text-white">Contact Support</span>
          </button>
          <button
            onClick={() => setActiveTicket('bug')}
            className="flex flex-col items-center gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-red-500 dark:hover:border-red-400 transition-colors"
          >
            <Bug className="w-6 h-6 text-red-600" />
            <span className="font-medium text-gray-900 dark:text-white">Report a Bug</span>
          </button>
          <button
            onClick={() => setActiveTicket('feature')}
            className="flex flex-col items-center gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-amber-500 dark:hover:border-amber-400 transition-colors"
          >
            <Lightbulb className="w-6 h-6 text-amber-600" />
            <span className="font-medium text-gray-900 dark:text-white">Feature Request</span>
          </button>
        </div>
      </Card>

      {activeTicket !== 'none' && (
        <Card
          title={activeTicket === 'support' ? 'Contact Support' : activeTicket === 'bug' ? 'Report a Bug' : 'Feature Request'}
          description="Fill out the form below"
          icon={activeTicket === 'support' ? <MessageSquare className="w-5 h-5 text-blue-600" /> : activeTicket === 'bug' ? <Bug className="w-5 h-5 text-red-600" /> : <Lightbulb className="w-5 h-5 text-amber-600" />}
          action={
            <Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />} onClick={() => setActiveTicket('none')}>
              Close
            </Button>
          }
        >
          <div className="space-y-4">
            <Input
              label="Subject"
              value={ticketForm.subject}
              onChange={(v) => setTicketForm({ ...ticketForm, subject: v })}
              placeholder={activeTicket === 'bug' ? 'Brief description of the issue' : 'What do you need help with?'}
            />
            <TextArea
              label="Message"
              value={ticketForm.message}
              onChange={(v) => setTicketForm({ ...ticketForm, message: v })}
              placeholder="Provide as much detail as possible..."
              rows={5}
            />
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setActiveTicket('none')}>Cancel</Button>
              <Button icon={<Send className="w-4 h-4" />}>Submit Ticket</Button>
            </div>
          </div>
        </Card>
      )}

      <Card
        title="Documentation"
        description="Learn more about using EthosLife"
        icon={<BookOpen className="w-5 h-5 text-purple-600" />}
      >
        <div className="space-y-2">
          <a href="#" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="text-gray-900 dark:text-white">Getting Started Guide</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="text-gray-900 dark:text-white">API Documentation</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="text-gray-900 dark:text-white">Video Tutorials</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      </Card>

      <Card
        title="Live Chat"
        description="Chat with our support team"
        icon={<ChatIcon className="w-5 h-5 text-cyan-600" />}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-gray-600 dark:text-gray-400">
              Our support team is available Monday-Friday, 9am-6pm EST. Average response time: 2 minutes.
            </p>
          </div>
          <Button variant="primary" icon={<MessageCircle className="w-4 h-4" />}>
            Start Chat
          </Button>
        </div>
      </Card>
    </div>
  );
};

const AboutSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card
        title="App Information"
        description="Version and build details"
        icon={<Info className="w-5 h-5 text-blue-600" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Version</span>
            <span className="font-medium text-gray-900 dark:text-white">2.4.1</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Build Number</span>
            <span className="font-medium text-gray-900 dark:text-white">2024.03.06.1</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Platform</span>
            <span className="font-medium text-gray-900 dark:text-white">Web</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Environment</span>
            <Badge variant="success">Production</Badge>
          </div>
          <Button variant="secondary" className="w-full" icon={<RefreshCw className="w-4 h-4" />}>
            Check for Updates
          </Button>
        </div>
      </Card>

      <Card
        title="Legal"
        description="Terms and policies"
        icon={<FileText className="w-5 h-5 text-gray-600" />}
      >
        <div className="space-y-2">
          <a href="#" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="text-gray-900 dark:text-white">Terms of Service</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="text-gray-900 dark:text-white">Privacy Policy</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="text-gray-900 dark:text-white">Cookie Policy</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="text-gray-900 dark:text-white">HIPAA Compliance</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      </Card>

      <Card
        title="Licenses"
        description="Open source licenses"
        icon={<BookOpen className="w-5 h-5 text-purple-600" />}
      >
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          This app uses open source software. View the licenses for the libraries we use.
        </p>
        <Button variant="secondary">View Licenses</Button>
      </Card>

      <Card
        title="Credits"
        description="Team and acknowledgments"
        icon={<Users className="w-5 h-5 text-pink-600" />}
      >
        <div className="text-center py-4">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">EthosLife Team</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Built with care in San Francisco
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            © 2024 EthosLife Inc. All rights reserved.
          </p>
        </div>
      </Card>
    </div>
  );
};


// ============================================================================
// MAIN SETTINGS COMPONENT
// ============================================================================

const categories = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'health', label: 'Health Data', icon: Heart },
  { id: 'preferences', label: 'App Preferences', icon: Settings },
  { id: 'devices', label: 'Connected Devices', icon: Watch },
  { id: 'subscription', label: 'Subscription & Billing', icon: CreditCard },
  { id: 'reminders', label: 'Reminders & Schedule', icon: Clock },
  { id: 'social', label: 'Social Preferences', icon: Users },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
  { id: 'about', label: 'About', icon: Info }
];

export default function Settings2() {
  const [activeCategory, setActiveCategory] = useState('account');
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [originalSettings] = useState<SettingsState>(defaultSettings);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasChanges = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  }, [settings, originalSettings]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleReset = () => {
    if (hasChanges) {
      setShowUnsavedWarning(true);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter(c => 
      c.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderContent = () => {
    switch (activeCategory) {
      case 'account':
        return (
          <AccountSection
            settings={settings.account}
            onChange={(account) => setSettings({ ...settings, account })}
            hasChanges={hasChanges}
            onSave={handleSave}
          />
        );
      case 'notifications':
        return (
          <NotificationsSection
            settings={settings.notifications}
            onChange={(notifications) => setSettings({ ...settings, notifications })}
          />
        );
      case 'privacy':
        return (
          <PrivacySection
            settings={settings.privacy}
            onChange={(privacy) => setSettings({ ...settings, privacy })}
          />
        );
      case 'health':
        return (
          <HealthDataSection
            settings={settings.healthData}
            onChange={(healthData) => setSettings({ ...settings, healthData })}
          />
        );
      case 'preferences':
        return (
          <PreferencesSection
            settings={settings.preferences}
            onChange={(preferences) => setSettings({ ...settings, preferences })}
          />
        );
      case 'devices':
        return (
          <DevicesSection
            devices={settings.devices}
            onChange={(devices) => setSettings({ ...settings, devices })}
          />
        );
      case 'subscription':
        return (
          <SubscriptionSection
            settings={settings.subscription}
            onChange={(subscription) => setSettings({ ...settings, subscription })}
          />
        );
      case 'reminders':
        return (
          <RemindersSection
            settings={settings.reminders}
            onChange={(reminders) => setSettings({ ...settings, reminders })}
          />
        );
      case 'social':
        return (
          <SocialSection
            settings={settings.social}
            onChange={(social) => setSettings({ ...settings, social })}
          />
        );
      case 'help':
        return <HelpSection />;
      case 'about':
        return <AboutSection />;
      default:
        return null;
    }
  };

  const getBreadcrumb = () => {
    const category = categories.find(c => c.id === activeCategory);
    return [
      { label: 'Settings', href: '#' },
      { label: category?.label || '', href: '#' }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="hidden sm:flex items-center gap-1 text-sm text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  Unsaved changes
                </span>
              )}
              <Button
                variant="secondary"
                size="sm"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={handleReset}
                disabled={!hasChanges}
              >
                Reset
              </Button>
              <Button
                size="sm"
                icon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                onClick={handleSave}
                loading={isSaving}
                disabled={!hasChanges}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-4">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Categories */}
              <nav className="space-y-1">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.label}
                    </button>
                  );
                })}
              </nav>

              {/* Import/Export */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">SETTINGS DATA</p>
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <Upload className="w-4 h-4" />
                    Import Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                    Export Settings
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              {getBreadcrumb().map((item, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className={idx === arr.length - 1 ? 'text-gray-900 dark:text-white font-medium' : ''}>
                    {item.label}
                  </span>
                  {idx < arr.length - 1 && <ChevronRight className="w-4 h-4" />}
                </React.Fragment>
              ))}
            </nav>

            {/* Content */}
            <div className="animate-in fade-in duration-200">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Unsaved Changes Warning Modal */}
      <ConfirmModal
        isOpen={showUnsavedWarning}
        onClose={() => setShowUnsavedWarning(false)}
        onConfirm={() => {
          setSettings(originalSettings);
          setShowUnsavedWarning(false);
        }}
        title="Reset Settings?"
        description="All unsaved changes will be lost. This action cannot be undone."
        confirmText="Reset"
        danger
      />
    </div>
  );
}
