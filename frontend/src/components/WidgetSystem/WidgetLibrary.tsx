/**
 * Widget Library Modal - Интерфейс добавления виджетов
 * Android-style widget selection
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, X, Plus, Heart, Activity, Zap, Sparkles, Grid3X3 } from 'lucide-react';
import { useWidgetStore, widgetDefinitions, WidgetCategory } from '../../store/widgetStore';
import { ElCard, ElButton, ElInput } from '../ElCore';

interface WidgetLibraryProps {
  onClose: () => void;
}

const categoryIcons: Record<WidgetCategory, React.ElementType> = {
  health: Heart,
  social: Activity,
  gamification: Zap,
  utility: Grid3X3,
  gadgets: Sparkles,
};

const categoryLabels: Record<WidgetCategory, string> = {
  health: 'Health',
  social: 'Social',
  gamification: 'Gamification',
  utility: 'Utilities',
  gadgets: 'Gadgets',
};

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { addWidget, widgets } = useWidgetStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WidgetCategory | 'all'>('all');

  const categories: (WidgetCategory | 'all')[] = ['all', 'health', 'social', 'gamification', 'utility', 'gadgets'];

  const filteredWidgets = widgetDefinitions.filter((widget) => {
    const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
    const matchesSearch = widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isWidgetAdded = (widgetType: string) => {
    return widgets.some((w) => w.widgetType === widgetType);
  };

  const handleAddWidget = (widgetType: string) => {
    addWidget(widgetType);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[var(--bone-200)] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--bone-400)]/30">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Widget Library
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Customize your dashboard with widgets
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--bone-300)] transition-colors"
          >
            <X className="w-6 h-6 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-[var(--bone-400)]/30 space-y-4">
          <ElInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search widgets..."
            leftIcon={<Search className="w-5 h-5" />}
            className="max-w-md"
          />

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category === 'all' ? Grid3X3 : categoryIcons[category];
              const isSelected = selectedCategory === category;

              return (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] text-white shadow-lg'
                      : 'bg-[var(--bone-300)] text-[var(--text-secondary)] shadow-neu hover:shadow-neu-hover'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category === 'all' ? 'All' : categoryLabels[category]}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Widget Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredWidgets.map((widget, index) => {
                const CategoryIcon = categoryIcons[widget.category];
                const added = isWidgetAdded(widget.id);

                return (
                  <motion.div
                    key={widget.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <ElCard
                      variant={added ? 'flat' : 'elevated'}
                      className={`relative overflow-hidden group ${added ? 'opacity-60' : ''}`}
                    >
                      {/* Category Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[var(--bone-300)] text-[var(--text-tertiary)]">
                          <CategoryIcon className="w-3 h-3" />
                          {categoryLabels[widget.category]}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-purple)]/20 flex items-center justify-center">
                            {widget.icon ? (
                              <span className="text-2xl">{widget.icon}</span>
                            ) : (
                              <CategoryIcon className="w-6 h-6 text-[var(--neon-cyan)]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <h3 className="font-semibold text-[var(--text-primary)] truncate">
                              {widget.name}
                            </h3>
                            <p className="text-xs text-[var(--text-tertiary)]">
                              {widget.allowedSizes.length} size{widget.allowedSizes.length > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 flex-1">
                          {widget.description}
                        </p>

                        {/* Add Button */}
                        <ElButton
                          variant={added ? 'flat' : 'gradient'}
                          size="sm"
                          fullWidth
                          leftIcon={added ? undefined : <Plus className="w-4 h-4" />}
                          isDisabled={added}
                          onClick={() => handleAddWidget(widget.id)}
                        >
                          {added ? 'Added' : 'Add Widget'}
                        </ElButton>
                      </div>
                    </ElCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredWidgets.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-[var(--bone-400)] mb-4" />
              <p className="text-lg font-medium text-[var(--text-secondary)]">
                No widgets found
              </p>
              <p className="text-sm text-[var(--text-tertiary)]">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[var(--bone-400)]/30">
          <p className="text-sm text-[var(--text-tertiary)]">
            {widgets.length} widget{widgets.length !== 1 ? 's' : ''} on dashboard
          </p>
          <ElButton variant="flat" onClick={onClose}>
            Done
          </ElButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WidgetLibrary;
