import React, { useState } from 'react';
import { useGuest } from '../Auth/GuestAccessRoute';
import { useAuthStore } from '../../store/authStore';

/**
 * SubscriptionUpsell Component
 * Displays promotional banners and modals for non-authenticated users
 * Encourages users to purchase annual subscription with discount
 */
const SubscriptionUpsell = ({ variant = 'banner', onDismiss }) => {
  const { isGuest } = useGuest();
  const { isAuthenticated } = useAuthStore();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show for authenticated users
  if (!isGuest || isAuthenticated) {
    return null;
  }

  // Don't show if dismissed
  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };

  const DISCOUNT_PERCENT = 50;
  const ORIGINAL_PRICE = 299;
  const DISCOUNTED_PRICE = 149;

  // Banner variant - small top banner
  if (variant === 'banner') {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-2xl shadow-2xl p-4 border border-white/20">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎁</span>
              <span className="font-bold text-sm">СКИДКА {DISCOUNT_PERCENT}%</span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/70 hover:text-white transition-colors text-lg"
            >
              ✕
            </button>
          </div>
          <h4 className="font-bold text-base mb-1">
            Сохраните свои данные навсегда!
          </h4>
          <p className="text-xs opacity-90 mb-3">
            Сейчас ваши данные сохраняются временно. Зарегистрируйтесь и получите годовую подписку со скидкой.
          </p>
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg line-through opacity-60">${ORIGINAL_PRICE}</span>
            <span className="text-2xl font-bold">${DISCOUNTED_PRICE}</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">ГОД</span>
          </div>
          <a
            href="/register"
            className="block w-full bg-white text-emerald-700 text-center font-bold py-2 rounded-xl hover:bg-opacity-95 transition-all transform hover:scale-105 shadow-lg"
          >
            🚀 ЗАРЕГИСТРИРОВАТЬСЯ
          </a>
          <p className="text-xs opacity-70 text-center mt-2">
            ⏰ Предложение ограничено
          </p>
        </div>
      </div>
    );
  }

  // Modal variant - full overlay
  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-scale-up">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white text-center">
            <span className="text-5xl mb-2 block">🎉</span>
            <h2 className="text-2xl font-bold mb-1">
              Вам понравилось?
            </h2>
            <p className="text-white/80 text-sm">
              Сохраните все свои данные навсегда
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Warning about temporary data */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
              <p className="text-amber-800 text-sm">
                ⚠️ <strong>Внимание:</strong> Сейчас вы используете временное хранилище. 
                Данные будут удалены после очистки браузера.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700 text-sm">Все данные сохраняются в облаке</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700 text-sm">Доступ с любого устройства</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700 text-sm">AI-аналитика здоровья</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700 text-sm">Персональные рекомендации</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700 text-sm">Приоритетная поддержка</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-4 mb-6 text-center">
              <p className="text-gray-600 text-sm mb-1">Годовая подписка</p>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl line-through text-gray-400">${ORIGINAL_PRICE}</span>
                <span className="text-4xl font-bold text-emerald-600">${DISCOUNTED_PRICE}</span>
              </div>
              <p className="text-emerald-600 font-bold mt-1">Экономия ${ORIGINAL_PRICE - DISCOUNTED_PRICE}</p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <a
                href="/register"
                className="block w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center font-bold py-3 rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
              >
                🎁 ПОЛУЧИТЬ СО СКИДКОЙ {DISCOUNT_PERCENT}%
              </a>
              <button
                onClick={handleDismiss}
                className="block w-full text-gray-500 text-center text-sm hover:text-gray-700 transition-colors"
              >
                Может быть позже
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant - embedded in page content
  if (variant === 'inline') {
    return (
      <div className="my-6 mx-4">
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🔒</span>
                <h3 className="font-bold text-emerald-800">Сохраните ваши данные</h3>
              </div>
              <p className="text-emerald-700 text-sm mb-3">
                Сейчас вы используете временное хранилище. Зарегистрируйтесь, чтобы сохранить все данные навсегда и получить доступ ко всем функциям.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-xs text-emerald-600">Обычная цена</p>
                  <p className="text-lg line-through text-gray-400">${ORIGINAL_PRICE}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-emerald-600">Со скидкой</p>
                  <p className="text-2xl font-bold text-emerald-600">${DISCOUNTED_PRICE}</p>
                </div>
                <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{DISCOUNT_PERCENT}%
                </div>
              </div>
            </div>
            <a
              href="/register"
              className="ml-4 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg whitespace-nowrap"
            >
              Регистрация
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SubscriptionUpsell;
