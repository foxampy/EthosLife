import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './PaymentsV1.css';

/**
 * PaymentFailedV1 - Страница ошибки оплаты
 * Анимация ошибки, сообщение, повторная попытка
 * Retrofuturism Neumorphism Design
 */

// ============================================
// MOCK DATA
// ============================================

const ERROR_REASONS = [
  {
    id: 'insufficient_funds',
    icon: '💸',
    title: 'Недостаточно средств',
    message: 'На вашем счёте недостаточно средств для совершения платежа.',
    solution: 'Пополните счёт или используйте другой метод оплаты.',
  },
  {
    id: 'card_declined',
    icon: '❌',
    title: 'Карта отклонена',
    message: 'Ваш банк отклонил транзакцию.',
    solution: 'Свяжитесь с банком или используйте другую карту.',
  },
  {
    id: 'expired_card',
    icon: '⏰',
    title: 'Срок действия карты истёк',
    message: 'Срок действия вашей карты истёк.',
    solution: 'Обновите данные карты или используйте другую.',
  },
  {
    id: 'invalid_cvv',
    icon: '🔢',
    title: 'Неверный CVV код',
    message: 'Указанный CVV код не совпадает.',
    solution: 'Проверьте CVV код на обратной стороне карты.',
  },
  {
    id: 'network_error',
    icon: '🌐',
    title: 'Ошибка сети',
    message: 'Произошла ошибка при подключении к платёжному шлюзу.',
    solution: 'Проверьте соединение и попробуйте снова.',
  },
  {
    id: 'fraud_detected',
    icon: '🛡️',
    title: 'Подозрительная активность',
    message: 'Система безопасности заблокировала транзакцию.',
    solution: 'Свяжитесь со службой поддержки для верификации.',
  },
];

const ALTERNATIVE_METHODS = [
  {
    id: 'crypto',
    icon: '🪙',
    name: 'Криптовалюта',
    description: 'USDC, USDT, ETH, UNITY',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'bank_transfer',
    icon: '🏦',
    name: 'Банковский перевод',
    description: 'SEPA, SWIFT',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'digital_wallet',
    icon: '📱',
    name: 'Электронный кошелёк',
    description: 'Apple Pay, Google Pay',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'paypal',
    icon: '🅿️',
    name: 'PayPal',
    description: 'Быстро и безопасно',
    color: 'from-blue-600 to-blue-800',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Почему моя карта была отклонена?',
    answer: 'Это может произойти по нескольким причинам: недостаточно средств, истёк срок действия, неверный CVV, или банк заблокировал транзакцию из соображений безопасности.',
  },
  {
    question: 'Будут ли списаны средства?',
    answer: 'Нет, при неудачной транзакции средства не списываются. Если вы видите списание, это временная авторизация, которая исчезнет в течение 3-5 рабочих дней.',
  },
  {
    question: 'Как связаться с поддержкой?',
    answer: 'Вы можете написать нам в чат поддержки, отправить email на support@ethoslife.com, или позвонить по телефону горячей линии.',
  },
  {
    question: 'Могу ли я оплатить позже?',
    answer: 'Да, ваш заказ сохранён в корзине в течение 24 часов. Вы можете вернуться и завершить оплату в любое время.',
  },
];

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * ErrorAnimation - Анимация ошибки
 */
const ErrorAnimation = () => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setShake(true);
    const timer = setTimeout(() => setShake(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="error-animation-container">
      <div className={`error-circle ${shake ? 'shake' : ''}`}>
        <svg viewBox="0 0 52 52" className="error-svg">
          <circle
            className="error-circle-outline"
            cx="26"
            cy="26"
            r="25"
            fill="none"
            strokeWidth="2"
          />
          <path
            className="error-x"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            d="M16 16 L36 36 M36 16 L16 36"
          />
        </svg>
      </div>
    </div>
  );
};

/**
 * ErrorDetails - Детали ошибки
 */
const ErrorDetails = ({ errorId }) => {
  const error = ERROR_REASONS.find(e => e.id === errorId) || ERROR_REASONS[4];

  return (
    <div className="neu-card p-6 holo-display border-red-500/30">
      <div className="flex items-center space-x-4 mb-6">
        <span className="text-5xl">{error.icon}</span>
        <div>
          <h3 className="text-2xl font-bold text-red-400 neon-text-red">{error.title}</h3>
          <p className="text-gray-400 text-sm">Код ошибки: {error.id.toUpperCase()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-start space-x-3">
            <span className="text-xl">📋</span>
            <div>
              <div className="text-red-300 font-medium mb-1">Что произошло:</div>
              <div className="text-gray-300 text-sm">{error.message}</div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-start space-x-3">
            <span className="text-xl">💡</span>
            <div>
              <div className="text-emerald-300 font-medium mb-1">Как решить:</div>
              <div className="text-gray-300 text-sm">{error.solution}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * RetryButton - Кнопка повторной попытки
 */
const RetryButton = ({ onRetry, isRetrying }) => {
  return (
    <button
      onClick={onRetry}
      disabled={isRetrying}
      className="neu-button-retro w-full py-4 text-lg disabled:opacity-50"
    >
      {isRetrying ? (
        <span className="flex items-center justify-center space-x-2">
          <span className="animate-spin">⏳</span>
          <span>Повторная попытка...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center space-x-2">
          <span>🔄</span>
          <span>Попробовать снова</span>
        </span>
      )}
    </button>
  );
};

/**
 * AlternativeMethods - Альтернативные методы оплаты
 */
const AlternativeMethods = ({ onSelectMethod }) => {
  return (
    <div className="neu-card p-6">
      <h4 className="font-bold text-white mb-4 text-center">
        Или выберите другой способ оплаты
      </h4>

      <div className="grid grid-cols-2 gap-3">
        {ALTERNATIVE_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className="neu-card-pressed p-4 rounded-xl hover:scale-105 transition-all group"
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
              {method.icon}
            </div>
            <div className="font-bold text-white text-sm">{method.name}</div>
            <div className="text-xs text-gray-400">{method.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * SupportContact - Контакт поддержки
 */
const SupportContact = () => {
  const [expanded, setExpanded] = useState(false);

  const contactMethods = [
    { icon: '💬', name: 'Онлайн чат', action: 'Начать чат', href: '/support/chat' },
    { icon: '📧', name: 'Email', action: 'support@ethoslife.com', href: 'mailto:support@ethoslife.com' },
    { icon: '📞', name: 'Телефон', action: '+44 20 1234 5678', href: 'tel:+442012345678' },
    { icon: '🤖', name: 'AI Ассистент', action: 'Получить помощь', href: '/ai-chat' },
  ];

  return (
    <div className="neu-card p-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full mb-4"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🆘</span>
          <h4 className="font-bold text-white">Нужна помощь?</h4>
        </div>
        <span className="text-gray-400">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="space-y-3 animate-fadeIn">
          {contactMethods.map((method, idx) => (
            <a
              key={idx}
              href={method.href}
              className="flex items-center justify-between p-3 rounded-lg bg-[#0f3460]/30 hover:bg-[#0f3460]/50 transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{method.icon}</span>
                <span className="text-white text-sm">{method.name}</span>
              </div>
              <span className="text-cyan-400 text-sm">{method.action}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * FAQSection - Секция FAQ
 */
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="neu-card p-6">
      <h4 className="font-bold text-white mb-4">Частые вопросы</h4>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="neu-card-pressed rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="flex items-center justify-between w-full p-4 text-left"
            >
              <span className="text-white text-sm font-medium">{item.question}</span>
              <span className="text-gray-400">{openIndex === idx ? '▲' : '▼'}</span>
            </button>
            {openIndex === idx && (
              <div className="px-4 pb-4 text-gray-400 text-sm animate-fadeIn">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * OrderSummary - Сводка заказа (мини)
 */
const MiniOrderSummary = () => {
  const items = [
    { name: 'EthosLife Premium (Год)', price: 299.99 },
    { name: 'AI Health Coach', price: 99.99 },
    { name: 'UNITY Tokens Pack', price: 225.00 },
  ];

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const tax = total * 0.2;
  const finalTotal = total + tax;

  return (
    <div className="neu-card p-6">
      <h4 className="font-bold text-white mb-4">Ваш заказ</h4>

      <div className="space-y-3 mb-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-gray-400">{item.name}</span>
            <span className="text-white">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-cyan-500/20 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Подытог:</span>
          <span className="text-white">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Налог:</span>
          <span className="text-white">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span className="text-white">Итого:</span>
          <span className="text-cyan-400">${finalTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const PaymentFailedV1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRetrying, setIsRetrying] = useState(false);
  const [selectedError, setSelectedError] = useState(
    location.state?.errorId || 'network_error'
  );

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      navigate('/checkout-v1', {
        state: { retry: true, previousError: selectedError },
      });
    }, 1500);
  };

  const handleSelectMethod = (methodId) => {
    navigate('/checkout-v1', {
      state: { preferredMethod: methodId },
    });
  };

  return (
    <div className="payments-v1-container min-h-screen">
      {/* Retro Grid Background */}
      <div className="retro-grid-bg" />

      {/* Header */}
      <header className="relative z-10 border-b border-red-500/20 bg-[#1a1a2e]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-3xl">🌱</span>
              <span className="text-xl font-bold text-cyan-400 neon-text">EthosLife</span>
            </Link>
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              ✕ Закрыть
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Error Animation */}
        <div className="text-center mb-8">
          <ErrorAnimation />

          <h1 className="text-4xl font-bold text-white mb-4 mt-8 neon-text-red">
            Оплата не удалась
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Произошла ошибка при обработке платежа
          </p>
          <p className="text-gray-400">
            Не волнуйтесь, средства не были списаны
          </p>
        </div>

        {/* Error Details */}
        <div className="mb-8">
          <ErrorDetails errorId={selectedError} />
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <RetryButton onRetry={handleRetry} isRetrying={isRetrying} />
          <Link
            to="/"
            className="neu-button-secondary-retro w-full py-4 text-lg flex items-center justify-center space-x-2"
          >
            <span>🏪</span>
            <span>Вернуться в магазин</span>
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <AlternativeMethods onSelectMethod={handleSelectMethod} />
          <MiniOrderSummary />
        </div>

        {/* Support & FAQ */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <SupportContact />
          <FAQSection />
        </div>

        {/* Security Notice */}
        <div className="neu-card p-6 border-cyan-500/20">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">🔒</span>
            <div>
              <h4 className="font-bold text-white mb-1">Безопасность платежей</h4>
              <p className="text-gray-400 text-sm">
                Все транзакции защищены SSL-шифрованием и соответствуют стандарту PCI DSS.
                Ваши данные в безопасности.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-red-500/20 bg-[#1a1a2e]/90 backdrop-blur-md mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            © 2026 EthosLife. Все права защищены.
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <Link to="/terms" className="text-gray-500 hover:text-cyan-400 text-sm">
              Условия
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-cyan-400 text-sm">
              Конфиденциальность
            </Link>
            <Link to="/support" className="text-gray-500 hover:text-cyan-400 text-sm">
              Поддержка
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentFailedV1;
