import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Plus, MoreHorizontal, Check } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function getWeekDays(baseDate: Date) {
  const day = baseDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toISO(d: Date) {
  return d.toISOString().split('T')[0];
}

const categoryColors: Record<string, string> = {
  water: '#60a5fa',
  workout: '#34d399',
  meal: '#fb923c',
  meditation: '#a78bfa',
  work: '#fbbf24',
  rest: '#818cf8',
  social: '#f472b6',
  custom: '#94a3b8',
};

export const DayPlanSection: React.FC = () => {
  const { todayActivities, selectedDate, toggleActivity, setSelectedDate, addActivity } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [newEmoji, setNewEmoji] = useState('⚡');

  const today = new Date();
  const selectedDateObj = new Date(selectedDate + 'T00:00:00');
  const weekDays = getWeekDays(selectedDateObj);

  const completedCount = todayActivities.filter((a) => a.completed).length;
  const totalCount = todayActivities.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const neuCard = {
    background: '#e8e0d5',
    boxShadow: '8px 8px 16px rgba(44,40,34,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
    borderRadius: '20px',
  };

  const neuBtn = {
    background: '#e8e0d5',
    boxShadow: '3px 3px 6px rgba(44,40,34,0.1), -3px -3px 6px rgba(255,255,255,0.7)',
  };

  const prevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(toISO(d));
  };

  const nextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(toISO(d));
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addActivity({ time: newTime, title: newTitle, emoji: newEmoji, completed: false, category: 'custom' });
    setNewTitle('');
    setShowAdd(false);
  };

  return (
    <div style={neuCard} className="p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-[#2d2418]">План дня</h2>
          <p className="text-xs text-[#a09282]">{completedCount} из {totalCount} выполнено</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAdd(!showAdd)}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={neuBtn}>
            <Plus className="w-4 h-4 text-[#8c7a6b]" />
          </button>
          <button className="w-8 h-8 rounded-xl flex items-center justify-center" style={neuBtn}>
            <MoreHorizontal className="w-4 h-4 text-[#8c7a6b]" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full mb-3 overflow-hidden"
        style={{ background: 'rgba(44,40,34,0.08)', boxShadow: 'inset 2px 2px 4px rgba(44,40,34,0.1)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #5c5243, #8c7a6b)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Day picker */}
      <div className="flex items-center gap-1 mb-3">
        <button onClick={prevDay} className="w-7 h-7 rounded-lg flex items-center justify-center" style={neuBtn}>
          <ChevronLeft className="w-3 h-3 text-[#8c7a6b]" />
        </button>

        <div className="flex-1 flex justify-between gap-0.5">
          {weekDays.map((d, i) => {
            const iso = toISO(d);
            const isSelected = iso === selectedDate;
            const isToday = iso === toISO(today);
            return (
              <button key={iso} onClick={() => setSelectedDate(iso)}
                className="flex-1 flex flex-col items-center py-1.5 rounded-lg transition-all"
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #5c5243, #8c7a6b)' : 'transparent',
                  boxShadow: isSelected ? '2px 2px 6px rgba(92,82,67,0.3)' : 'none',
                }}>
                <span className="text-[9px] font-medium"
                  style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#a09282' }}>
                  {DAYS[i]}
                </span>
                <span className="text-sm font-bold"
                  style={{ color: isSelected ? 'white' : isToday ? '#5c5243' : '#2d2418' }}>
                  {d.getDate()}
                </span>
                {isToday && !isSelected && <div className="w-1 h-1 rounded-full mt-0.5 bg-[#8c7a6b]" />}
              </button>
            );
          })}
        </div>

        <button onClick={nextDay} className="w-7 h-7 rounded-lg flex items-center justify-center" style={neuBtn}>
          <ChevronRight className="w-3 h-3 text-[#8c7a6b]" />
        </button>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center ml-0.5" style={neuBtn}>
          <Calendar className="w-3 h-3 text-[#8c7a6b]" />
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3">
            <div className="flex gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(44,40,34,0.04)', boxShadow: 'inset 2px 2px 5px rgba(44,40,34,0.08)' }}>
              <input value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)}
                className="w-10 text-center bg-transparent outline-none text-lg" />
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="flex-1 bg-transparent outline-none text-sm text-[#2d2418] placeholder-[#a09282]"
                placeholder="Название активности..." />
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)}
                className="text-xs bg-transparent outline-none text-[#8c7a6b]" />
              <button onClick={handleAdd}
                className="px-3 py-1 rounded-lg text-white text-xs font-medium"
                style={{ background: 'linear-gradient(135deg, #5c5243, #8c7a6b)' }}>
                +
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activities */}
      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
        {todayActivities.map((activity) => (
          <motion.div key={activity.id} layout
            className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer"
            style={{
              background: activity.completed ? 'rgba(52,211,153,0.06)' : 'transparent',
              borderLeft: `2px solid ${categoryColors[activity.category] || '#94a3b8'}`,
            }}
            onClick={() => toggleActivity(activity.id)}
            whileTap={{ scale: 0.98 }}>
            <span className="text-base w-6 text-center flex-shrink-0">{activity.emoji}</span>
            <span className="text-sm font-medium flex-1 text-[#2d2418]"
              style={{ textDecoration: activity.completed ? 'line-through' : 'none', opacity: activity.completed ? 0.5 : 1 }}>
              {activity.title}
            </span>
            <span className="text-xs text-[#a09282] mr-1 flex-shrink-0">{activity.time}</span>
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: activity.completed ? 'linear-gradient(135deg, #34d399, #10b981)' : '#e8e0d5',
                boxShadow: activity.completed
                  ? '0 2px 8px rgba(52,211,153,0.4)'
                  : 'inset 2px 2px 4px rgba(44,40,34,0.1), inset -2px -2px 4px rgba(255,255,255,0.7)',
              }}>
              {activity.completed && <Check className="w-3 h-3 text-white" />}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
