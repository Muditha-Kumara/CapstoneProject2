import { useState } from 'react';

const PAYMENT_METHODS = {
  CARD: 'card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
};

const CARD_TYPES = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  AMEX: 'amex',
  DISCOVER: 'discover',
};

// Detect card type from number
const detectCardType = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return CARD_TYPES.VISA;
  if (/^5[1-5]/.test(cleaned)) return CARD_TYPES.MASTERCARD;
  if (/^3[47]/.test(cleaned)) return CARD_TYPES.AMEX;
  if (/^6(?:011|5)/.test(cleaned)) return CARD_TYPES.DISCOVER;
  return null;
};

// Format card number with spaces
const formatCardNumber = (value) => {
  const cleaned = value.replace(/\s/g, '');
  const cardType = detectCardType(cleaned);
  
  if (cardType === CARD_TYPES.AMEX) {
    // AMEX: 4-6-5 format
    return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim();
  } else {
    // Others: 4-4-4-4 format
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
  }
};

// Validate card number using Luhn algorithm
const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export default function PaymentModal({ isOpen, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CARD);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  const cardType = detectCardType(cardNumber);

  const handleAmountClick = (value) => {
    setAmount(value.toString());
    setError('');
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value) && value.length <= 19) {
      setCardNumber(value);
      setError('');
    }
  };

  const handleExpiryMonthChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 2) {
      const num = parseInt(value, 10);
      if (value === '' || (num >= 1 && num <= 12)) {
        setExpiryMonth(value);
        setError('');
      }
    }
  };

  const handleExpiryYearChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setExpiryYear(value);
      setError('');
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value;
    const maxLength = cardType === CARD_TYPES.AMEX ? 4 : 3;
    if (/^\d*$/.test(value) && value.length <= maxLength) {
      setCvv(value);
      setError('');
    }
  };

  const validateForm = () => {
    if (!amount || parseFloat(amount) < 1) {
      setError('Please enter an amount of at least $1');
      return false;
    }

    if (paymentMethod === PAYMENT_METHODS.CARD) {
      if (!cardNumber) {
        setError('Please enter your card number');
        return false;
      }

      if (!validateCardNumber(cardNumber)) {
        setError('Invalid card number');
        return false;
      }

      if (!cardholderName.trim()) {
        setError('Please enter the cardholder name');
        return false;
      }

      if (!expiryMonth || !expiryYear) {
        setError('Please enter the card expiry date');
        return false;
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const expYear = parseInt(expiryYear, 10);
      const expMonth = parseInt(expiryMonth, 10);

      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        setError('Card has expired');
        return false;
      }

      if (!cvv || cvv.length < 3) {
        setError('Please enter a valid CVV');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        amount: parseFloat(amount),
        paymentMethod,
      };

      if (paymentMethod === PAYMENT_METHODS.CARD) {
        payload.cardDetails = {
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardholderName: cardholderName.trim(),
          expiryMonth: parseInt(expiryMonth, 10),
          expiryYear: parseInt(expiryYear, 10),
          cvv,
          last4: cardNumber.slice(-4),
        };
      }

      await onSuccess(payload);
      handleClose();
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setAmount('');
      setCardNumber('');
      setCardholderName('');
      setExpiryMonth('');
      setExpiryYear('');
      setCvv('');
      setError('');
      setPaymentMethod(PAYMENT_METHODS.CARD);
      onClose();
    }
  };

  if (!isOpen) return null;

  const displayCardNumber = formatCardNumber(cardNumber);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8" style={{ animation: 'modal-slide-up 0.4s ease-out' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-4xl mr-3">💳</span>
              <h2 className="text-3xl font-extrabold text-white">Make a Donation</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="text-white hover:text-gray-200 transition text-3xl font-bold leading-none disabled:opacity-50"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Amount Selection */}
          <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-3 text-lg">
              Donation Amount ($)
            </label>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[10, 25, 50, 100].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAmountClick(value)}
                  className={`py-3 px-4 rounded-lg font-bold transition ${
                    amount === value.toString()
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ${value}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder="Enter custom amount"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition text-lg"
            />
          </div>

          {/* Payment Method Selection */}
          <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-3 text-lg">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod(PAYMENT_METHODS.CARD)}
                className={`py-4 px-4 rounded-lg font-semibold transition flex flex-col items-center ${
                  paymentMethod === PAYMENT_METHODS.CARD
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl mb-1">💳</span>
                <span>Credit/Debit</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod(PAYMENT_METHODS.PAYPAL)}
                className={`py-4 px-4 rounded-lg font-semibold transition flex flex-col items-center ${
                  paymentMethod === PAYMENT_METHODS.PAYPAL
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl mb-1">🅿️</span>
                <span>PayPal</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod(PAYMENT_METHODS.BANK_TRANSFER)}
                className={`py-4 px-4 rounded-lg font-semibold transition flex flex-col items-center ${
                  paymentMethod === PAYMENT_METHODS.BANK_TRANSFER
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl mb-1">🏦</span>
                <span>Bank</span>
              </button>
            </div>
          </div>

          {/* Card Details Form */}
          {paymentMethod === PAYMENT_METHODS.CARD && (
            <div className="space-y-5 mb-8">
              {/* Card Number */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={displayCardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition pr-16"
                  />
                  {cardType && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-2xl">
                        {cardType === CARD_TYPES.VISA && '💳'}
                        {cardType === CARD_TYPES.MASTERCARD && '💳'}
                        {cardType === CARD_TYPES.AMEX && '💳'}
                        {cardType === CARD_TYPES.DISCOVER && '💳'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => {
                    setCardholderName(e.target.value);
                    setError('');
                  }}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition uppercase"
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Month
                  </label>
                  <input
                    type="text"
                    value={expiryMonth}
                    onChange={handleExpiryMonthChange}
                    placeholder="MM"
                    maxLength="2"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={expiryYear}
                    onChange={handleExpiryYearChange}
                    placeholder="YYYY"
                    maxLength="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder={cardType === CARD_TYPES.AMEX ? '1234' : '123'}
                    maxLength={cardType === CARD_TYPES.AMEX ? '4' : '3'}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PayPal Notice */}
          {paymentMethod === PAYMENT_METHODS.PAYPAL && (
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-medium">
                🔄 You will be redirected to PayPal to complete your donation securely.
              </p>
            </div>
          )}

          {/* Bank Transfer Notice */}
          {paymentMethod === PAYMENT_METHODS.BANK_TRANSFER && (
            <div className="mb-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-purple-800 font-medium mb-2">
                🏦 Bank transfer instructions will be sent to your email.
              </p>
              <p className="text-sm text-purple-600">
                Please allow 2-3 business days for processing.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-bold text-lg disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                `Donate $${amount || '0'}`
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center">
              <span className="mr-2">🔒</span>
              Your payment information is secure and encrypted
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
