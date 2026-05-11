import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Plus, Check } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useWidgetStore } from '../../store/widgetStore';
import { DayPlanSection } from './DayPlanSection';
import { WidgetGrid } from '../../components/WidgetSystem/WidgetGrid';
import { WidgetLibrary } from '../../components/WidgetSystem/WidgetLibrary';

const neuBtn = {
  background: '#e8e0d5',
  boxShadow: '4px 4px 8px rgba(44,40,34,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
  borderRadius: '12px',
};

export default function Dashboard2() {
  const { userName } = useAppStore();
  const { isEditMode, toggleEditMode } = useWidgetStore();
  const [showLibrary, setShowLibrary] = useState(false);

  const dateStr = new Date().toLocaleDateString('ru', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="min-h-screen pb-24 px-4 pt-4" style={{ background: 'linear-gradient(135deg, #dcd3c6 0%, #e8e0d5 100%)' }}>
      {/* Greeting */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#2d2418]">
            Привет, {userName} 👋
          </h1>
          <p className="text-sm text-[#a09282] capitalize">{dateStr}</p>
        </div>
        <motion.button
          onClick={toggleEditMode}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 flex items-center justify-center"
          style={neuBtn}
        >
          {isEditMode
            ? <Check className="w-4 h-4 text-emerald-500" />
            : <Settings2 className="w-4 h-4 text-[#8c7a6b]" />
          }
        </motion.button>
      </div>

      {/* Day Plan */}
      <DayPlanSection />

      {/* Widgets Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-[#2d2418]">Виджеты</h2>
        <motion.button
          onClick={() => setShowLibrary(true)}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 flex items-center justify-center"
          style={neuBtn}
        >
          <Plus className="w-4 h-4 text-[#8c7a6b]" />
        </motion.button>
      </div>

      {/* Widget Grid */}
      <WidgetGrid />

      {/* Widget Library */}
      {showLibrary && <WidgetLibrary onClose={() => setShowLibrary(false)} />}
    </div>
  );
}
