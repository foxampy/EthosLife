import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PaymentsV1.css';

/**
 * CheckoutV1 - Оформление заказа
 * Страница оплаты с поддержкой Fiat и Crypto
 * Retrofuturism Neumorphism Design
 */

// ============================================
// MOCK DATA
// ============================================

const ORDER_ITEMS = [
  {
    id: 1,
    name: 'EthosLife Premium (Год)',
    description: 'Полный доступ ко всем модулям',
    quantity: 1,
    price: 299.99,
    icon: '🌱',
  },
  {
    id: 2,
    name: 'AI Health Coach',
    description: 'Персональный AI-тренер',
    quantity: 1,
    price: 99.99,
    icon: '🤖',
  },
  {
    id: 3,
    name: 'UNITY Tokens Pack',
    description: '500 UNITY токенов',
    quantity: 1,
    price: 225.00,
    icon: '🪙',
  },
];

const CRYPTO_RATES = {
  USDC: { rate: 1.0, icon: '🪙', color: '#2775ca', name: 'USD Coin' },
  USDT: { rate: 1.0, icon: '₮', color: '#26a17b', name: 'Tether' },
  ETH: { rate: 0.00035, icon: '⟠', color: '#627eea', name: 'Ethereum' },
  UNITY: { rate: 2.22, icon: '🌱', color: '#10b981', name: 'EthosLife Token' },
  BTC: { rate: 0.000016, icon: '₿', color: '#f7931a', name: 'Bitcoin' },
};

const PAYMENT_METHODS = [
  { id: 'card', name: 'Банковская карта', icon: '💳', description: 'Visa, Mastercard, MIR' },
  { id: 'crypto', name: 'Криптовалюта', icon: '🪙', description: 'USDC, USDT, ETH, UNITY' },
  { id: 'bank', name: 'Банковский перевод', icon: '🏦', description: 'SEPA, SWIFT' },
];

const SECURITY_BADGES = [
  { icon: '🔒', label: 'SSL Encrypted' },
  { icon: '🛡️', label: 'PCI DSS Compliant' },
  { icon: '✅', label: '3D Secure' },
  { icon: '🔐', label: 'Fraud Protection' },
];

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * OrderSummary - Сводка заказа
 */
const OrderSummary = ({ items, promoCode, discount }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discount / 100);
  const tax = (subtotal - discountAmount) * 0.2;
  const total = subtotal - discountAmount + tax;

  return (
    <div className="neu-card p-6 holo-display">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-2xl">📦</span>
        <h3 className="text-xl font-bold text-cyan-400 neon-text">Сводка заказа</h3>
      </div>

      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-4 p-4 rounded-xl bg-[#0f3460]/30 border border-cyan-500/10"
          >
            <div className="text-3xl">{item.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-white">{item.name}</div>
              <div className="text-sm text-gray-400">{item.description}</div>
              <div className="text-xs text-gray-500 mt-1">Кол-во: {item.quantity}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-cyan-400">${item.price.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code Applied */}
      {promoCode && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎉</span>
            <span className="text-sm text-emerald-400">Промокод: {promoCode}</span>
          </div>
          <span className="text-emerald-400 font-bold">-{discount}%</span>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 pt-4 border-t border-cyan-500/20">
        <div className="flex justify-between text-gray-400">
          <span>Подытог:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-400">
            <span>Скидка:</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-400">
          <span>Налог (20%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-cyan-400 pt-3 border-t border-cyan-500/20">
          <span>Итого:</span>
          <span className="neon-text">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * CreditCardForm - Форма банковской карты
 */
const CreditCardForm = ({ formData, setFormData, errors }) => {
  const [cardFocus, setCardFocus] = useState('');

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    setFormData({ ...formData, cardNumber: value.slice(0, 19) });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setFormData({ ...formData, expiry: value });
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData({ ...formData, cvv: value });
  };

  return (
    <div className="space-y-6">
      {/* Card Preview */}
      <div className="neu-card p-6 overflow-hidden">
        <div
          className="relative h-48 rounded-xl p-6"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
          }}
        >
          {/* Holographic Effect */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(0, 217, 255, 0.3) 50%, transparent 70%)',
              backgroundSize: '200% 200%',
              animation: 'shimmer 3s linear infinite',
            }}
          />

          {/* Card Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-2xl">💳</span>
              <span className="text-cyan-400 font-bold neon-text">VISA</span>
            </div>

            <div>
              <div className="text-gray-400 text-xs mb-1">Card Number</div>
              <div className="text-white text-xl font-mono tracking-wider">
                {formData.cardNumber || '•••• •••• •••• ••••'}
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <div className="text-gray-400 text-xs mb-1">Card Holder</div>
                <div className="text-white text-sm uppercase tracking-wide">
                  {formData.cardName || 'CARD HOLDER'}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Expires</div>
                <div className="text-white text-sm font-mono">
                  {formData.expiry || 'MM/YY'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Номер карты
          </label>
          <input
            type="text"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            onFocus={() => setCardFocus('number')}
            onBlur={() => setCardFocus('')}
            placeholder="1234 5678 9012 3456"
            className={`neu-input-retro w-full ${errors.cardNumber ? 'border-red-500' : ''}`}
          />
          {errors.cardNumber && (
            <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Имя владельца
          </label>
          <input
            type="text"
            value={formData.cardName}
            onChange={(e) => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })}
            placeholder="IVAN IVANOV"
            className={`neu-input-retro w-full ${errors.cardName ? 'border-red-500' : ''}`}
          />
          {errors.cardName && (
            <p className="text-red-400 text-sm mt-1">{errors.cardName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Срок действия
            </label>
            <input
              type="text"
              value={formData.expiry}
              onChange={handleExpiryChange}
              onFocus={() => setCardFocus('expiry')}
              onBlur={() => setCardFocus('')}
              placeholder="MM/YY"
              className={`neu-input-retro w-full ${errors.expiry ? 'border-red-500' : ''}`}
            />
            {errors.expiry && (
              <p className="text-red-400 text-sm mt-1">{errors.expiry}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CVV/CVC
            </label>
            <input
              type="password"
              value={formData.cvv}
              onChange={handleCVVChange}
              onFocus={() => setCardFocus('cvv')}
              onBlur={() => setCardFocus('')}
              placeholder="123"
              maxLength={4}
              className={`neu-input-retro w-full ${errors.cvv ? 'border-red-500' : ''}`}
            />
            {errors.cvv && (
              <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * CryptoPaymentForm - Форма крипто оплаты
 */
const CryptoPaymentForm = ({ amount, selectedCrypto, setSelectedCrypto }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const cryptoAmount = (amount * CRYPTO_RATES[selectedCrypto].rate).toFixed(6);

  return (
    <div className="space-y-6">
      {/* Crypto Selector */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(CRYPTO_RATES).map(([symbol, data]) => (
          <button
            key={symbol}
            onClick={() => setSelectedCrypto(symbol)}
            className={`neu-card-pressed p-3 rounded-xl text-center transition-all hover:scale-105 ${
              selectedCrypto === symbol ? 'border-2 border-cyan-500 glow-border' : ''
            }`}
          >
            <div className="text-2xl mb-1">{data.icon}</div>
            <div className="text-xs font-bold text-white">{symbol}</div>
          </button>
        ))}
      </div>

      {/* Conversion Display */}
      <div className="neu-card p-6 holo-display">
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">Сумма к оплате</div>
          <div className="text-3xl font-bold text-cyan-400 neon-text mb-2">
            {cryptoAmount} {selectedCrypto}
          </div>
          <div className="text-gray-500 text-sm">
            ≈ ${amount.toFixed(2)} USD
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="mt-4 pt-4 border-t border-cyan-500/20">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Курс:</span>
            <span className="text-white">
              1 USD = {CRYPTO_RATES[selectedCrypto].rate} {selectedCrypto}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-400">Сеть:</span>
            <span className="text-emerald-400">
              {selectedCrypto === 'ETH' ? 'ERC-20' : selectedCrypto === 'BTC' ? 'Bitcoin' : 'TRC-20'}
            </span>
          </div>
        </div>
      </div>

      {/* Wallet Address */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Адрес кошелька
        </label>
        <div className="relative">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            className="neu-input-retro w-full font-mono"
          />
          <button
            onClick={() => setWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f8aE')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 text-sm hover:text-cyan-300"
          >
            Paste
          </button>
        </div>
      </div>

      {/* QR Code Placeholder */}
      <div className="neu-card p-4 flex justify-center">
        <div className="w-48 h-48 bg-white rounded-lg p-2">
          <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 rounded flex items-center justify-center">
            <span className="text-6xl">📱</span>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 rounded-lg bg-amber-500/20 border border-amber-500/30">
        <div className="flex items-start space-x-3">
          <span className="text-xl">⚠️</span>
          <div className="text-sm text-amber-300">
            <strong>Важно:</strong> Отправляйте только {selectedCrypto} в сети{' '}
            {selectedCrypto === 'ETH' ? 'ERC-20' : selectedCrypto === 'BTC' ? 'Bitcoin' : 'TRC-20'}.
            Отправка других токенов может привести к потере средств.
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * BankTransferForm - Форма банковского перевода
 */
const BankTransferForm = () => {
  return (
    <div className="space-y-6">
      {/* Bank Details */}
      <div className="neu-card p-6 holo-display">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">🏦</span>
          <h4 className="font-bold text-white">Реквизиты для оплаты</h4>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Получатель:</span>
            <span className="text-white">EthosLife Ltd.</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">IBAN:</span>
            <span className="text-white font-mono">GB82 ETHS 6016 1331 9268 19</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">SWIFT/BIC:</span>
            <span className="text-white font-mono">ETHSGB2L</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Банк:</span>
            <span className="text-white">Barclays Bank UK</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Адрес банка:</span>
            <span className="text-white text-right">1 Churchill Place,<br />London E14 5HP</span>
          </div>
        </div>
      </div>

      {/* Payment Reference */}
      <div className="p-4 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">Платёжное поручение (Reference)</div>
          <div className="text-2xl font-bold text-cyan-400 neon-text font-mono">
            ORDER-2026-03-09-7X8K2
          </div>
          <div className="text-gray-500 text-xs mt-2">
            Укажите этот номер в назначении платежа
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-3">
        <h5 className="font-bold text-white">Инструкция:</h5>
        <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
          <li>Скопируйте реквизиты выше</li>
          <li>Создайте перевод в вашем банке</li>
          <li>Укажите платёжное поручение в назначении</li>
          <li>Отправьте подтверждение оплаты</li>
          <li>Ожидайте зачисления (1-3 рабочих дня)</li>
        </ol>
      </div>
    </div>
  );
};

/**
 * PromoCodeInput - Ввод промокода
 */
const PromoCodeInput = ({ onApply }) => {
  const [code, setCode] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (code.toUpperCase() === 'WELCOME10' || code.toUpperCase() === 'ETHOS2026') {
        setIsApplied(true);
        onApply(code.toUpperCase(), code.toUpperCase() === 'WELCOME10' ? 10 : 20);
      }
      setIsLoading(false);
    }, 800);
  };

  if (isApplied) {
    return (
      <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
        <div className="flex items-center space-x-2">
          <span className="text-xl">✅</span>
          <span className="text-emerald-400 font-medium">Промокод применён</span>
        </div>
        <button
          onClick={() => {
            setIsApplied(false);
            onApply('', 0);
          }}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="flex space-x-3">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="WELCOME10"
        className="neu-input-retro flex-1 uppercase"
      />
      <button
        onClick={handleApply}
        disabled={isLoading || !code}
        className="neu-button-retro px-6 disabled:opacity-50"
      >
        {isLoading ? '...' : 'Применить'}
      </button>
    </div>
  );
};

/**
 * SecurityBadges - Значки безопасности
 */
const SecurityBadges = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SECURITY_BADGES.map((badge, idx) => (
        <div
          key={idx}
          className="flex items-center space-x-2 p-3 rounded-lg bg-[#0f3460]/30 border border-cyan-500/10"
        >
          <span className="text-xl">{badge.icon}</span>
          <span className="text-xs text-gray-400">{badge.label}</span>
        </div>
      ))}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const CheckoutV1 = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const [selectedCrypto, setSelectedCrypto] = useState('USDC');

  const total = ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = total * (discount / 100);
  const tax = (total - discountAmount) * 0.2;
  const finalTotal = total - discountAmount + tax;

  const validateCard = () => {
    const newErrors = {};
    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Введите корректный номер карты';
    }
    if (!cardData.cardName) {
      newErrors.cardName = 'Введите имя владельца';
    }
    if (!cardData.expiry || cardData.expiry.length !== 5) {
      newErrors.expiry = 'Введите срок действия';
    }
    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'Введите CVV код';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = () => {
    if (selectedMethod === 'card' && !validateCard()) {
      return;
    }

    if (!termsAccepted) {
      alert('Примите условия соглашения');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/payment/success-v1', {
        state: {
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          amount: finalTotal,
          method: selectedMethod,
        },
      });
    }, 3000);
  };

  return (
    <div className="payments-v1-container min-h-screen">
      {/* Retro Grid Background */}
      <div className="retro-grid-bg" />

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-500/20 bg-[#1a1a2e]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-3xl">🌱</span>
              <span className="text-xl font-bold text-cyan-400 neon-text">EthosLife</span>
            </Link>
            <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">
              ✕ Закрыть
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 neon-text">Оформление заказа</h1>
          <p className="text-gray-400">Безопасная оплата с помощью SSL шифрования</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Tabs */}
            <div className="neu-card p-2">
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl transition-all ${
                      selectedMethod === method.id
                        ? 'bg-cyan-500/20 border-2 border-cyan-500 glow-border'
                        : 'hover:bg-[#0f3460]/30'
                    }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="font-bold text-white text-sm">{method.name}</div>
                    <div className="text-xs text-gray-500">{method.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Forms */}
            <div className="neu-card p-6">
              {selectedMethod === 'card' && (
                <CreditCardForm
                  formData={cardData}
                  setFormData={setCardData}
                  errors={errors}
                />
              )}
              {selectedMethod === 'crypto' && (
                <CryptoPaymentForm
                  amount={finalTotal}
                  selectedCrypto={selectedCrypto}
                  setSelectedCrypto={setSelectedCrypto}
                />
              )}
              {selectedMethod === 'bank' && <BankTransferForm />}
            </div>

            {/* Security Badges */}
            <div className="neu-card p-6">
              <h4 className="font-bold text-white mb-4">Защита платежей</h4>
              <SecurityBadges />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <OrderSummary
              items={ORDER_ITEMS}
              promoCode={promoCode}
              discount={discount}
            />

            {/* Promo Code */}
            <div className="neu-card p-6">
              <h4 className="font-bold text-white mb-4">Промокод</h4>
              <PromoCodeInput
                onApply={(code, disc) => {
                  setPromoCode(code);
                  setDiscount(disc);
                }}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="neu-card p-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-cyan-500/50 bg-[#0f3460]/50 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">
                  Я принимаю{' '}
                  <Link to="/terms" className="text-cyan-400 hover:underline">
                    Условия использования
                  </Link>{' '}
                  и{' '}
                  <Link to="/privacy" className="text-cyan-400 hover:underline">
                    Политику конфиденциальности
                  </Link>
                </span>
              </label>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="neu-button-retro w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="animate-spin">⏳</span>
                  <span>Обработка...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>💳</span>
                  <span>Оплатить ${finalTotal.toFixed(2)}</span>
                </span>
              )}
            </button>

            {/* Help Text */}
            <div className="text-center">
              <Link to="/support" className="text-gray-400 hover:text-cyan-400 text-sm">
                Нужна помощь? Свяжитесь с поддержкой
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/20 bg-[#1a1a2e]/90 backdrop-blur-md mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © 2026 EthosLife. Все права защищены.
            </div>
            <div className="flex items-center space-x-6">
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
        </div>
      </footer>
    </div>
  );
};

export default CheckoutV1;
