import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Переиспользуемый компонент навигации
 * @param {Array} items - Массив элементов навигации { path, label, icon }
 * @param {Function} isActive - Функция проверки активности пути
 * @param {Function} onItemClick - Обработчик клика на элемент
 * @param {string} orientation - 'horizontal' | 'vertical'
 * @param {string} variant - 'default' | 'compact' | 'minimal'
 */
const Navigation = ({ 
  items = [], 
  isActive = () => false, 
  onItemClick,
  orientation = 'horizontal',
  variant = 'default'
}) => {
  const orientationClasses = {
    horizontal: 'flex items-center space-x-1',
    vertical: 'flex flex-col space-y-1',
  };

  const itemClasses = {
    default: `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-1
      ${orientation === 'horizontal' ? '' : 'w-full justify-start'}
    `,
    compact: `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1
      ${orientation === 'horizontal' ? '' : 'w-full justify-start'}
    `,
    minimal: `px-2 py-1 rounded text-sm transition-all duration-200 flex items-center space-x-1
      ${orientation === 'horizontal' ? '' : 'w-full justify-start'}
    `,
  };

  const activeClasses = {
    default: 'bg-stone text-bone shadow-md transform scale-105',
    compact: 'bg-stone text-bone shadow-sm',
    minimal: 'bg-stone text-bone',
  };

  const inactiveClasses = {
    default: 'text-ink hover:text-ink-light hover:bg-sand/50 hover:shadow-sm',
    compact: 'text-ink hover:text-ink-light hover:bg-sand/30',
    minimal: 'text-ink hover:text-ink-light hover:bg-sand/20',
  };

  return (
    <nav className={orientationClasses[orientation]} aria-label="Navigation">
      {items.map((item, index) => (
        <Link
          key={item.path || index}
          to={item.path}
          onClick={onItemClick}
          className={`
            ${itemClasses[variant]}
            ${isActive(item.path) ? activeClasses[variant] : inactiveClasses[variant]}
          `}
          aria-current={isActive(item.path) ? 'page' : undefined}
        >
          {item.icon && <span>{item.icon}</span>}
          {item.label && <span>{item.label}</span>}
        </Link>
      ))}
    </nav>
  );
};

/**
 * Компонент для группы элементов навигации с заголовком
 */
export const NavGroup = ({ title, items, isActive, onItemClick }) => {
  return (
    <div className="space-y-2">
      {title && (
        <h3 className="text-xs font-bold text-stone uppercase tracking-wider px-2">
          {title}
        </h3>
      )}
      <Navigation 
        items={items} 
        isActive={isActive} 
        onItemClick={onItemClick}
        orientation="vertical"
      />
    </div>
  );
};

/**
 * Компонент для разделённых секций навигации
 */
export const NavSection = ({ children, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export default Navigation;
