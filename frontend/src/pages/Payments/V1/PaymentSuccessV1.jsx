import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './PaymentsV1.css';

/**
 * PaymentSuccessV1 - Страница успешной оплаты
 * Анимация конфетти, детали транзакции, следующие шаги
 * Retrofuturism Neumorphism Design
 */

// ============================================
// MOCK DATA
// ============================================

const RELATED_PRODUCTS = [
  {
    id: 1,
    name: 'AI Health Coach Pro',
    description: 'Расширенный AI-тренер с видео-сессиями',
    price: 149.99,
    icon: '🤖',
    badge: 'NEW',
  },
  {
    id: 2,
    name: 'Family Plan',
    description: 'До 5 членов семьи',
    price: 499.99,
    icon: '👨‍👩‍👧‍👦',
    badge: 'SAVE 40%',
  },
  {
    id: 3,
    name: 'Lifetime Access',
    description: 'Пожизненный доступ ко всем модулям',
    price: 999.99,
    icon: '♾️',
    badge: 'BEST VALUE',
  },
  {
    id: 4,
    name: 'Wellness Retreat',
    description: 'Недельный ретрит в Швейцарии',
    price: 2999.99,
    icon: '🏔️',
    badge: 'EXCLUSIVE',
  },
];

const NEXT_STEPS = [
  {
    id: 1,
    icon: '📧',
    title: 'Проверьте email',
    description: 'Чек и инструкция отправлены на вашу почту',
    completed: true,
  },
  {
    id: 2,
    icon: '⚙️',
    title: 'Настройте профиль',
    description: 'Заполните данные для персонализации',
    completed: false,
  },
  {
    id: 3,
    icon: '🎯',
    title: 'Начните с модуля',
    description: 'Выберите первый модуль для старта',
    completed: false,
  },
  {
    id: 4,
    icon: '👥',
    title: 'Присоединяйтесь к сообществу',
    description: 'Найдите единомышленников в EthosLife',
    completed: false,
  },
];

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * ConfettiAnimation - Анимация конфетти
 */
const ConfettiAnimation = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#00d9ff', '#e94560', '#9d4edd', '#f0a500', '#00ff88'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 12,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * SuccessAnimation - Анимация успеха
 */
const SuccessAnimation = () => {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setScale(1), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="success-animation-container">
      <div
        className="success-circle"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="success-checkmark">
          <svg viewBox="0 0 52 52" className="checkmark-svg">
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
              strokeWidth="2"
            />
            <path
              className="checkmark-check"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

/**
 * TransactionDetails - Детали транзакции
 */
const TransactionDetails = ({ transaction }) => {
  return (
    <div className="neu-card p-6 holo-display">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-2xl">🧾</span>
        <h3 className="text-xl font-bold text-cyan-400 neon-text">Детали транзакции</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between py-3 border-b border-cyan-500/20">
          <span className="text-gray-400">ID транзакции:</span>
          <span className="text-white font-mono text-sm">{transaction.id}</span>
        </div>
        <div className="flex justify-between py-3 border-b border-cyan-500/20">
          <span className="text-gray-400">Дата:</span>
          <span className="text-white">{transaction.date}</span>
        </div>
        <div className="flex justify-between py-3 border-b border-cyan-500/20">
          <span className="text-gray-400">Способ оплаты:</span>
          <span className="text-white flex items-center space-x-2">
            <span>{transaction.methodIcon}</span>
            <span>{transaction.method}</span>
          </span>
        </div>
        <div className="flex justify-between py-3 border-b border-cyan-500/20">
          <span className="text-gray-400">Статус:</span>
          <span className="text-emerald-400 flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Успешно</span>
          </span>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-gray-400">Сумма:</span>
          <span className="text-2xl font-bold text-cyan-400 neon-text">
            ${transaction.amount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * ReceiptDownload - Кнопка скачивания чека
 */
const ReceiptDownload = ({ transaction }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert('Чек скачан! Проверьте папку загрузок.');
    }, 1500);
  };

  return (
    <div className="neu-card p-6">
      <div className="text-center">
        <div className="text-5xl mb-4">📄</div>
        <h4 className="font-bold text-white mb-2">Скачать чек</h4>
        <p className="text-gray-400 text-sm mb-4">
          Чек будет отправлен в формате PDF
        </p>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="neu-button-retro w-full disabled:opacity-50"
        >
          {isDownloading ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="animate-spin">⏳</span>
              <span>Скачивание...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <span>⬇️</span>
              <span>Скачать PDF</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

/**
 * NextStepsWidget - Виджет следующих шагов
 */
const NextStepsWidget = () => {
  const [steps, setSteps] = useState(NEXT_STEPS);

  const handleStepClick = (id) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
  };

  const progress = (steps.filter(s => s.completed).length / steps.length) * 100;

  return (
    <div className="neu-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-2xl">🎯</span>
        <h3 className="text-xl font-bold text-white">Следующие шаги</h3>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Прогресс онбординга</span>
          <span className="text-cyan-400 font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-[#0f3460] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => handleStepClick(step.id)}
            className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all ${
              step.completed
                ? 'bg-emerald-500/20 border border-emerald-500/30'
                : 'bg-[#0f3460]/30 border border-cyan-500/10 hover:border-cyan-500/30'
            }`}
          >
            <div className="text-2xl">{step.icon}</div>
            <div className="flex-1">
              <div className={`font-bold ${step.completed ? 'text-emerald-400' : 'text-white'}`}>
                {step.title}
              </div>
              <div className="text-sm text-gray-400">{step.description}</div>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              step.completed ? 'bg-emerald-500' : 'bg-gray-600'
            }`}>
              {step.completed && <span className="text-white text-sm">✓</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * ShareButtons - Кнопки поделиться
 */
const ShareButtons = () => {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: 'https://twitter.com/intent/tweet?text=Я только что присоединился к EthosLife!',
    facebook: 'https://www.facebook.com/sharer/sharer.php',
    telegram: 'https://t.me/share/url?url=https://ethoslife.com',
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://ethoslife.com/ref/user123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="neu-card p-6">
      <h4 className="font-bold text-white mb-4 text-center">Поделиться с друзьями</h4>
      
      <div className="flex justify-center space-x-3 mb-4">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-xl bg-[#1DA1F2]/20 border border-[#1DA1F2]/50 flex items-center justify-center hover:bg-[#1DA1F2]/40 transition-all"
        >
          <span className="text-xl">🐦</span>
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-xl bg-[#4267B2]/20 border border-[#4267B2]/50 flex items-center justify-center hover:bg-[#4267B2]/40 transition-all"
        >
          <span className="text-xl">📘</span>
        </a>
        <a
          href={shareLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/50 flex items-center justify-center hover:bg-[#0088cc]/40 transition-all"
        >
          <span className="text-xl">✈️</span>
        </a>
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value="https://ethoslife.com/ref/user123"
          readOnly
          className="neu-input-retro flex-1 text-sm"
        />
        <button
          onClick={handleCopyLink}
          className="neu-button-retro px-4"
        >
          {copied ? '✓' : '📋'}
        </button>
      </div>
      {copied && (
        <div className="text-center text-emerald-400 text-sm mt-2">
          Ссылка скопирована!
        </div>
      )}
    </div>
  );
};

/**
 * RelatedProducts - Похожие продукты
 */
const RelatedProducts = () => {
  return (
    <div className="neu-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-2xl">🛍️</span>
        <h3 className="text-xl font-bold text-white">Вам может понравиться</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {RELATED_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="neu-card-pressed p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer"
          >
            {product.badge && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded text-xs font-bold text-white">
                {product.badge}
              </div>
            )}
            <div className="text-3xl mb-3">{product.icon}</div>
            <div className="font-bold text-white text-sm mb-1">{product.name}</div>
            <div className="text-xs text-gray-400 mb-3">{product.description}</div>
            <div className="text-cyan-400 font-bold">${product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const PaymentSuccessV1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);

  const transaction = location.state || {
    id: `TXN-${Date.now()}`,
    amount: 624.98,
    method: 'Банковская карта',
    methodIcon: '💳',
    date: new Date().toLocaleString('ru-RU'),
  };

  useEffect(() => {
    // Stop confetti after 10 seconds
    const timer = setTimeout(() => setShowConfetti(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="payments-v1-container min-h-screen">
      {/* Retro Grid Background */}
      <div className="retro-grid-bg" />

      {/* Confetti Animation */}
      {showConfetti && <ConfettiAnimation />}

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-500/20 bg-[#1a1a2e]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-3xl">🌱</span>
              <span className="text-xl font-bold text-cyan-400 neon-text">EthosLife</span>
            </Link>
            <Link to="/dashboard-v1" className="neu-button-retro px-4 py-2 text-sm">
              🏠 В дашборд
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <SuccessAnimation />
          
          <h1 className="text-4xl font-bold text-white mb-4 mt-8 neon-text">
            🎉 Оплата успешна!
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Спасибо за вашу покупку
          </p>
          <p className="text-gray-400">
            Транзакция #{transaction.id.slice(0, 20)}...
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <TransactionDetails transaction={transaction} />
          <ReceiptDownload transaction={transaction} />
        </div>

        {/* Next Steps */}
        <div className="mb-8">
          <NextStepsWidget />
        </div>

        {/* Share & Products */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ShareButtons />
          <RelatedProducts />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard-v1"
            className="neu-button-retro px-8 py-4 text-lg"
          >
            📊 Перейти в дашборд
          </Link>
          <Link
            to="/health/nutrition-v1"
            className="neu-button-retro px-8 py-4 text-lg"
          >
            🥗 Начать с питания
          </Link>
          <Link
            to="/checkout-v1"
            className="neu-button-secondary-retro px-8 py-4 text-lg"
          >
            🛒 Ещё покупки
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/20 bg-[#1a1a2e]/90 backdrop-blur-md mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            © 2026 EthosLife. Все права защищены.
          </div>
          <div className="text-center text-gray-600 text-xs mt-2">
            Нужна помощь?{' '}
            <Link to="/support" className="text-cyan-400 hover:underline">
              Служба поддержки
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentSuccessV1;
