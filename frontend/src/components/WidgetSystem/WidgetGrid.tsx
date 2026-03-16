/**
 * Widget Grid - Draggable grid layout for widgets
 * Android-style home screen behavior
 */

import React, { useState, useCallback } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, GripVertical, Settings, Maximize2, Minimize2, Eye, EyeOff } from 'lucide-react';
import { useWidgetStore, WidgetInstance, widgetDefinitions, WidgetSize } from '../../store/widgetStore';
import { ElCard, ElButton } from '../ElCore';
import { WidgetSettingsPopup } from './WidgetSettingsPopup';

// Import widget components
import { HealthScoreWidget } from './widgets/HealthScoreWidget';
import { ActivityRingsWidget } from './widgets/ActivityRingsWidget';
import { StepsWidget } from './widgets/StepsWidget';
import { WaterWidget } from './widgets/WaterWidget';
import { SleepWidget } from './widgets/SleepWidget';
import { QuickActionsWidget } from './widgets/QuickActionsWidget';
import { AIInsightsWidget } from './widgets/AIInsightsWidget';

const widgetComponentMap: Record<string, React.ComponentType<any>> = {
  healthScore: HealthScoreWidget,
  activityRings: ActivityRingsWidget,
  steps: StepsWidget,
  water: WaterWidget,
  sleep: SleepWidget,
  quickActions: QuickActionsWidget,
  aiInsights: AIInsightsWidget,
};

const sizeClasses: Record<WidgetSize, string> = {
  small: 'col-span-1 row-span-1 min-h-[140px]',
  medium: 'col-span-1 md:col-span-2 row-span-1 min-h-[180px]',
  large: 'col-span-1 md:col-span-2 row-span-2 min-h-[280px]',
  full: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-1 min-h-[160px]',
};

export const WidgetGrid: React.FC = () => {
  const { t } = useTranslation();
  const {
    widgets,
    isEditMode,
    toggleEditMode,
    removeWidget,
    updateWidgetSize,
    reorderWidgets,
  } = useWidgetStore();

  const [settingsWidget, setSettingsWidget] = useState<string | null>(null);

  const handleReorder = useCallback(
    (newOrder: WidgetInstance[]) => {
      reorderWidgets(newOrder);
    },
    [reorderWidgets]
  );

  const cycleSize = (widget: WidgetInstance) => {
    const definition = widgetDefinitions.find((d) => d.id === widget.widgetType);
    if (!definition) return;

    const sizes = definition.allowedSizes;
    const currentIndex = sizes.indexOf(widget.size);
    const nextIndex = (currentIndex + 1) % sizes.length;
    updateWidgetSize(widget.id, sizes[nextIndex]);
  };

  const sortedWidgets = [...widgets].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-4">
      {/* Edit Mode Toggle */}
      <div className="flex justify-end">
        <ElButton
          variant={isEditMode ? 'gradient' : 'flat'}
          size="sm"
          onClick={toggleEditMode}
        >
          {isEditMode ? 'Done' : 'Edit Layout'}
        </ElButton>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Reorder.Group
          axis="y"
          values={sortedWidgets}
          onReorder={handleReorder}
          className="contents"
        >
          {sortedWidgets.map((widget) => (
            <WidgetItem
              key={widget.id}
              widget={widget}
              isEditMode={isEditMode}
              onRemove={() => removeWidget(widget.id)}
              onSettings={() => setSettingsWidget(widget.id)}
              onResize={() => cycleSize(widget)}
            />
          ))}
        </Reorder.Group>
      </div>

      {/* Settings Popup */}
      <AnimatePresence>
        {settingsWidget && (
          <WidgetSettingsPopup
            widgetId={settingsWidget}
            onClose={() => setSettingsWidget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface WidgetItemProps {
  widget: WidgetInstance;
  isEditMode: boolean;
  onRemove: () => void;
  onSettings: () => void;
  onResize: () => void;
}

const WidgetItem: React.FC<WidgetItemProps> = ({
  widget,
  isEditMode,
  onRemove,
  onSettings,
  onResize,
}) => {
  const definition = widgetDefinitions.find((d) => d.id === widget.widgetType);
  const WidgetComponent = definition ? widgetComponentMap[definition.component] : null;

  if (!WidgetComponent) return null;

  return (
    <Reorder.Item
      value={widget}
      className={`${sizeClasses[widget.size]} ${isEditMode ? 'z-10' : ''}`}
      drag={isEditMode}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
    >
      <motion.div
        layout
        className="relative h-full"
        whileHover={isEditMode ? { scale: 1.02 } : {}}
        whileTap={isEditMode ? { scale: 0.98 } : {}}
      >
        <ElCard className="h-full" hover={!isEditMode}>
          {/* Widget Header (Edit Mode) */}
          {isEditMode && (
            <div className="absolute -top-3 -right-3 z-20 flex gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onResize}
                className="w-8 h-8 rounded-full bg-[var(--neon-cyan)] text-white shadow-lg flex items-center justify-center"
                title="Resize"
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>
              {definition?.hasSettings && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onSettings}
                  className="w-8 h-8 rounded-full bg-[var(--stone-600)] text-white shadow-lg flex items-center justify-center"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onRemove}
                className="w-8 h-8 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          )}

          {/* Drag Handle (Edit Mode) */}
          {isEditMode && (
            <div className="absolute top-2 left-2 z-10 p-2 rounded-lg bg-[var(--bone-300)]/80 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-5 h-5 text-[var(--text-tertiary)]" />
            </div>
          )}

          {/* Widget Content */}
          <div className={`h-full ${isEditMode ? 'pt-8' : ''}`}>
            <WidgetComponent settings={widget.settings} size={widget.size} />
          </div>
        </ElCard>
      </motion.div>
    </Reorder.Item>
  );
};

export default WidgetGrid;
