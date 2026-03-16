/**
 * MedicineUnified - Medicine/Medication Health Module Page
 * Medication tracking, reminders, and refill alerts
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Pill,
  Plus,
  Check,
  X,
  Clock,
  Calendar,
  AlertCircle,
  ChevronRight,
  Bell,
  Package,
  History,
  TrendingUp,
} from 'lucide-react';
import { ElCard, ElButton } from '../../../components/ElCore';

// Mock medication data
const TODAY_MEDICATIONS = [
  {
    id: 1,
    name: 'Vitamin D3',
    dosage: '2000 IU',
    time: '8:00 AM',
    taken: true,
    type: 'supplement',
    icon: '☀️',
  },
  {
    id: 2,
    name: 'Omega-3',
    dosage: '1000mg',
    time: '8:00 AM',
    taken: true,
    type: 'supplement',
    icon: '🐟',
  },
  {
    id: 3,
    name: 'Multivitamin',
    dosage: '1 tablet',
    time: '12:00 PM',
    taken: false,
    type: 'supplement',
    icon: '💊',
  },
  {
    id: 4,
    name: 'Magnesium',
    dosage: '400mg',
    time: '8:00 PM',
    taken: false,
    type: 'supplement',
    icon: '🌙',
  },
];

const REFILL_REMINDERS = [
  { id: 1, name: 'Vitamin D3', daysLeft: 5, totalDays: 30, icon: '☀️' },
  { id: 2, name: 'Omega-3', daysLeft: 12, totalDays: 60, icon: '🐟' },
];

const UPCOMING_DOSES = [
  { time: '12:00 PM', medications: ['Multivitamin'] },
  { time: '8:00 PM', medications: ['Magnesium'] },
];

const WEEKLY_ADHERENCE = [
  { day: 'Mon', taken: 4, total: 4 },
  { day: 'Tue', taken: 3, total: 4 },
  { day: 'Wed', taken: 4, total: 4 },
  { day: 'Thu', taken: 4, total: 4 },
  { day: 'Fri', taken: 2, total: 4 },
  { day: 'Sat', taken: 4, total: 4 },
  { day: 'Sun', taken: 2, total: 4 },
];

// Medication Item Component
const MedicationItem: React.FC<{
  medication: typeof TODAY_MEDICATIONS[0];
  onToggle: (id: number) => void;
  delay?: number;
}> = ({ medication, onToggle, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className={`flex items-center justify-between p-3 rounded-xl ${
      medication.taken 
        ? 'bg-emerald-50/50 border border-emerald-100' 
        : 'bg-[var(--bone-300)]/30'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
        medication.taken ? 'bg-emerald-100' : 'bg-[var(--bone-200)]'
      }`}>
        {medication.icon}
      </div>
      <div>
        <p className={`font-medium text-sm ${medication.taken ? 'text-emerald-700 line-through' : 'text-[var(--text-primary)]'}`}>
          {medication.name}
        </p>
        <p className="text-xs text-[var(--text-tertiary)]">{medication.dosage} • {medication.time}</p>
      </div>
    </div>
    <button
      onClick={() => onToggle(medication.id)}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
        medication.taken
          ? 'bg-emerald-500 text-white'
          : 'bg-[var(--bone-200)] shadow-neu text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
      }`}
    >
      {medication.taken ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
    </button>
  </motion.div>
);

// Refill Card Component
const RefillCard: React.FC<{
  medication: typeof REFILL_REMINDERS[0];
  delay?: number;
}> = ({ medication, delay = 0 }) => {
  const percentage = (medication.daysLeft / medication.totalDays) * 100;
  const isLow = percentage < 20;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-3 rounded-xl ${isLow ? 'bg-amber-50 border border-amber-100' : 'bg-[var(--bone-300)]/30'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{medication.icon}</span>
          <span className={`font-medium text-sm ${isLow ? 'text-amber-800' : 'text-[var(--text-primary)]'}`}>
            {medication.name}
          </span>
        </div>
        {isLow && <AlertCircle className="w-4 h-4 text-amber-500" />}
      </div>
      <div className="h-2 bg-[var(--bone-400)]/30 rounded-full overflow-hidden mb-1">
        <div 
          className={`h-full rounded-full ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className={`text-xs ${isLow ? 'text-amber-600' : 'text-[var(--text-tertiary)]'}`}>
        {medication.daysLeft} days left
      </p>
    </motion.div>
  );
};

export const MedicineUnified: React.FC = () => {
  const { t } = useTranslation();
  const [medications, setMedications] = useState(TODAY_MEDICATIONS);

  const toggleMedication = (id: number) => {
    setMedications(prev =>
      prev.map(med =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  const takenCount = medications.filter(m => m.taken).length;
  const totalCount = medications.length;
  const adherenceRate = Math.round((takenCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-[var(--bone-200)] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {t('medicine.title', 'Medicine')}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {t('medicine.subtitle', 'Track your medications & supplements')}
              </p>
            </div>
          </div>
          <ElButton variant="gradient" leftIcon={<Plus className="w-4 h-4" />}>
            {t('medicine.addMedication', 'Add')}
          </ElButton>
        </motion.div>

        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <ElCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="var(--bone-400)"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="url(#medGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '176', strokeDashoffset: '176' }}
                      animate={{ strokeDashoffset: 176 - (176 * adherenceRate) / 100 }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                    <defs>
                      <linearGradient id="medGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-[var(--text-primary)]">{adherenceRate}%</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {takenCount} of {totalCount} taken today
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {adherenceRate >= 80 
                      ? 'Great job! Keep it up 💪' 
                      : 'Don\'t forget your medications'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--text-secondary)]">Next dose</p>
                <p className="text-lg font-semibold text-rose-500">12:00 PM</p>
              </div>
            </div>
          </ElCard>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Medications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <ElCard className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-rose-500" />
                  {t('medicine.todayMedications', "Today's Medications")}
                </h3>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div className="space-y-2">
                {medications.map((med, idx) => (
                  <MedicationItem
                    key={med.id}
                    medication={med}
                    onToggle={toggleMedication}
                    delay={0.3 + idx * 0.05}
                  />
                ))}
              </div>

              {/* Upcoming Doses */}
              <div className="mt-6 pt-4 border-t border-[var(--bone-400)]/30">
                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                  {t('medicine.upcomingDoses', 'Upcoming Doses')}
                </h4>
                <div className="space-y-2">
                  {UPCOMING_DOSES.map((dose, idx) => (
                    <motion.div
                      key={dose.time}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[var(--bone-300)]/20"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-[var(--text-tertiary)]" />
                        <span className="font-medium text-[var(--text-primary)] text-sm">{dose.time}</span>
                      </div>
                      <span className="text-sm text-[var(--text-secondary)]">
                        {dose.medications.join(', ')}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ElCard>
          </motion.div>

          {/* Refill Reminders & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Refill Reminders */}
            <ElCard className="mb-4">
              <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" />
                {t('medicine.refillReminders', 'Refill Reminders')}
              </h3>
              <div className="space-y-2">
                {REFILL_REMINDERS.map((med, idx) => (
                  <RefillCard key={med.id} medication={med} delay={0.4 + idx * 0.1} />
                ))}
              </div>
              <ElButton variant="flat" fullWidth size="sm" className="mt-3">
                {t('medicine.orderRefills', 'Order Refills')}
              </ElButton>
            </ElCard>

            {/* Weekly Adherence */}
            <ElCard>
              <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                {t('medicine.weeklyAdherence', 'Weekly Adherence')}
              </h3>
              <div className="flex items-end justify-between gap-1 h-24">
                {WEEKLY_ADHERENCE.map((day, idx) => {
                  const percentage = (day.taken / day.total) * 100;
                  const isGood = percentage >= 75;
                  return (
                    <div key={day.day} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${percentage}%` }}
                        transition={{ delay: 0.5 + idx * 0.05, duration: 0.4 }}
                        className={`w-full rounded-t ${isGood ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      />
                      <span className="text-xs text-[var(--text-tertiary)] mt-1">{day.day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-400" />
                  <span className="text-[var(--text-secondary)]">Good (&gt;75%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-400" />
                  <span className="text-[var(--text-secondary)]">Missed</span>
                </div>
              </div>
            </ElCard>
          </motion.div>
        </div>

        {/* History Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-[var(--bone-300)]/50 hover:bg-[var(--bone-300)] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--text-primary)]">
                  {t('medicine.medicationHistory', 'Medication History')}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t('medicine.historyDesc', 'View past medications and adherence reports')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default MedicineUnified;
