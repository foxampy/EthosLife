/**
 * Widget Settings Popup - Контекстные настройки виджета
 */

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useWidgetStore, widgetDefinitions } from '../../store/widgetStore';
import { ElCard, ElButton } from '../ElCore';

interface WidgetSettingsPopupProps {
  widgetId: string;
  onClose: () => void;
}

export const WidgetSettingsPopup: React.FC<WidgetSettingsPopupProps> = ({
  widgetId,
  onClose,
}) => {
  const { widgets, updateWidgetSettings } = useWidgetStore();
  const widget = widgets.find((w) => w.id === widgetId);
  const definition = widget ? widgetDefinitions.find((d) => d.id === widget.widgetType) : null;

  if (!widget || !definition) return null;

  const handleSettingChange = (key: string, value: any) => {
    updateWidgetSettings(widgetId, { [key]: value });
  };

  // Render settings based on widget type
  const renderSettings = () => {
    switch (widget.widgetType) {
      case 'steps':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Daily Goal
              </label>
              <input
                type="number"
                value={widget.settings.goal || 10000}
                onChange={(e) => handleSettingChange('goal', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-[var(--bone-300)] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={widget.settings.showChart !== false}
                onChange={(e) => handleSettingChange('showChart', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-[var(--text-primary)]">Show weekly chart</span>
            </div>
          </div>
        );

      case 'water':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Daily Goal (glasses)
              </label>
              <input
                type="number"
                value={widget.settings.goal || 8}
                onChange={(e) => handleSettingChange('goal', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-[var(--bone-300)] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Glass size (ml)
              </label>
              <select
                value={widget.settings.glassSize || 250}
                onChange={(e) => handleSettingChange('glassSize', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-[var(--bone-300)] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08)]"
              >
                <option value={200}>200 ml (Small)</option>
                <option value={250}>250 ml (Standard)</option>
                <option value={330}>330 ml (Can)</option>
                <option value={500}>500 ml (Bottle)</option>
              </select>
            </div>
          </div>
        );

      case 'sleep':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Sleep Goal (hours)
              </label>
              <input
                type="number"
                step="0.5"
                value={widget.settings.goal || 8}
                onChange={(e) => handleSettingChange('goal', parseFloat(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-[var(--bone-300)] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={widget.settings.showSleepStages !== false}
                onChange={(e) => handleSettingChange('showSleepStages', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-[var(--text-primary)]">Show sleep stages</span>
            </div>
          </div>
        );

      case 'quickActions':
        return (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Select which actions to display:
            </p>
            {['meal', 'workout', 'sleep', 'mood', 'water', 'medication'].map((action) => (
              <div key={action} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={widget.settings[action] !== false}
                  onChange={(e) => handleSettingChange(action, e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-[var(--text-primary)] capitalize">{action}</span>
              </div>
            ))}
          </div>
        );

      case 'aiInsights':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={widget.settings.showNutrition !== false}
                onChange={(e) => handleSettingChange('showNutrition', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-[var(--text-primary)]">Nutrition insights</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={widget.settings.showSleep !== false}
                onChange={(e) => handleSettingChange('showSleep', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-[var(--text-primary)]">Sleep insights</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={widget.settings.showActivity !== false}
                onChange={(e) => handleSettingChange('showActivity', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-[var(--text-primary)]">Activity insights</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Max insights shown
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={widget.settings.maxInsights || 3}
                onChange={(e) => handleSettingChange('maxInsights', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-[var(--bone-300)] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08)]"
              />
            </div>
          </div>
        );

      default:
        return (
          <p className="text-sm text-[var(--text-secondary)]">
            No settings available for this widget.
          </p>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[var(--bone-200)] rounded-3xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--bone-400)]/30">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              {definition.name} Settings
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Customize your widget
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--bone-300)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Settings */}
        <div className="p-6">
          {renderSettings()}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t border-[var(--bone-400)]/30">
          <ElButton variant="flat" size="sm" onClick={onClose}>
            Cancel
          </ElButton>
          <ElButton variant="gradient" size="sm" onClick={onClose}>
            Save
          </ElButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WidgetSettingsPopup;
