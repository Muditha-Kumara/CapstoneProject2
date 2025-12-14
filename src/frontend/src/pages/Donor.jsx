import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import PaymentModal from '../components/PaymentModal';

// 🚨 Custom CSS Styles for Animations (Simulating global or scoped CSS injection) 🚨
const customStyles = `
@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.9) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes pulse-once {
  0% { transform: scale(1); box-shadow: 0 4px 12px rgba(255, 140, 0, 0.2); }
  50% { transform: scale(1.03); box-shadow: 0 8px 20px rgba(255, 140, 0, 0.4); }
  100% { transform: scale(1); box-shadow: 0 4px 12px rgba(255, 140, 0, 0.2); }
}
@keyframes modal-slide-up {
  0% { opacity: 0; transform: translateY(50px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject the styles (A simplified way for a single component)
if (typeof document !== 'undefined' && !document.getElementById('custom-donor-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'custom-donor-styles';
  styleEl.innerHTML = customStyles;
  document.head.appendChild(styleEl);
}

// Placeholder feedback (can be replaced with real feedback from backend)
const placeholderFeedback = [
  { id: 1, image: '/images/child-placeholder.png', message: 'Thank you for the delicious meal! You made my day brighter.', name: 'Ayesha', rating: 5 },
  { id: 2, image: '/images/child-placeholder.png', message: 'I am so happy and grateful for your help!', name: 'Kamal', rating: 5 },
  { id: 3, image: '/images/child-placeholder.png', message: 'Thanks to you, I had a wonderful lunch today!', name: 'Sithara', rating: 5 },
];

export default function Donor({ user }) {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [stats, setStats] = useState({ totalDonated: 0, mealsFunded: 0, avgCostPerMeal: 0 });
  const [transactions, setTransactions] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [pulseStat, setPulseStat] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Navigation Guard
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch all donor data on mount
  useEffect(() => {
    if (!user) return;

    const fetchDonorData = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch all data in parallel
        const [statsData, transactionsData, deliveriesData, feedbackData] = await Promise.all([
          api.getDonorStats(),
          api.getTransactionHistory({ limit: 20 }),
          api.getDeliveredDonations({ limit: 20 }),
          api.getDonorFeedback({ limit: 10 }),
        ]);

        setStats(statsData);
        setTransactions(transactionsData.transactions || []);
        setDeliveries(deliveriesData.deliveries || []);
        
        // Use real feedback if available, otherwise use placeholder
        if (feedbackData.feedback && feedbackData.feedback.length > 0) {
          setFeedback(feedbackData.feedback);
        } else {
          setFeedback(placeholderFeedback);
        }

        // Pulse animation on data load
        setPulseStat('totalDonated');
        setTimeout(() => setPulseStat(null), 1500);
      } catch (err) {
        console.error('Error fetching donor data:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
        // Use placeholder feedback on error
        setFeedback(placeholderFeedback);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, [user]);

  // Carousel Animation for feedback
  useEffect(() => {
    if (feedback.length === 0) return;
    
    const timer = setInterval(() => {
      setFeedbackIndex((prev) => (prev + 1) % feedback.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [feedback.length]);

  // Handle donation success
  const handleDonationSuccess = async (paymentPayload) => {
    try {
      const result = await api.processDonation(paymentPayload);
      
      // Refresh stats and transactions
      const [newStats, newTransactions] = await Promise.all([
        api.getDonorStats(),
        api.getTransactionHistory({ limit: 20 }),
      ]);

      setStats(newStats);
      setTransactions(newTransactions.transactions || []);
      
      setSuccessMessage(`Thank you! Your donation of $${paymentPayload.amount} has been processed successfully.`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

      // Pulse the stats
      setPulseStat('totalDonated');
      setTimeout(() => setPulseStat(null), 1500);

      return result;
    } catch (err) {
      console.error('Donation error:', err);
      throw err;
    }
  };

  // Tab Content Renderer
  const renderActiveContent = () => {
    if (activeTab === 'donation') {
      if (transactions.length === 0) {
        return (
          <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-500" style={{ animation: 'pop-in 0.5s ease-out' }}>
            <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
              <span className="mr-2 text-2xl">📜</span> Detailed Donation History
            </h3>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No transactions yet. Make your first donation to get started!</p>
            </div>
          </div>
        );
      }

      return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-500" style={{ animation: 'pop-in 0.5s ease-out' }}>
          <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
            <span className="mr-2 text-2xl">📜</span> Detailed Donation History
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50 transition duration-150">
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(tx.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tx.type === 'deposit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.type === 'deposit' ? '➕ Deposit' : '➖ Deduction'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-green-600">${tx.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{tx.recipient}</td>
                    <td className={`py-3 px-4 text-sm font-medium ${tx.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'delivered') {
      return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-purple-500" style={{ animation: 'pop-in 0.5s ease-out' }}>
          <h3 className="text-xl font-bold mb-4 text-purple-700 flex items-center">
            <span className="mr-2 text-2xl">🗺️</span> Delivered Food and Logistics Tracking
          </h3>
          
          {deliveries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">No deliveries yet.</p>
              <p className="text-gray-400 text-sm">Your donations will be matched with requests and delivered to those in need.</p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-gray-600">
                Track your donations from our platform to the recipients. See exactly where your generosity made an impact.
              </p>
              <div className="space-y-4">
                {deliveries.map((delivery) => (
                  <div key={delivery.donationId} className="p-5 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-purple-800 text-lg">{delivery.foodType}</h4>
                        <p className="text-sm text-gray-600">Quantity: {delivery.quantity} meals</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        delivery.status === 'fulfilled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {delivery.status === 'fulfilled' ? '✅ Delivered' : '🚚 In Transit'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Recipient:</p>
                        <p className="font-semibold text-gray-700">{delivery.recipientName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Delivered:</p>
                        <p className="font-semibold text-gray-700">
                          {delivery.deliveredAt 
                            ? new Date(delivery.deliveredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : 'Pending'}
                        </p>
                      </div>
                      {delivery.address && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Location:</p>
                          <p className="font-semibold text-gray-700">📍 {delivery.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="font-semibold text-purple-700 mb-2">💡 Transportation Transparency:</p>
            <p className="text-sm text-gray-700">
              The average meal cost (${stats.avgCostPerMeal}) covers raw food materials, preparation, and logistics 
              (transport, personnel) to ensure meals reach recipients safely and quickly.
            </p>
          </div>
        </div>
      );
    }

    return (
        <div className="text-center p-8 bg-gray-100 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">Select a button above to view your history and impact details.</p>
        </div>
    );
  };

  if (!user) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const currentFeedback = feedback[feedbackIndex] || placeholderFeedback[0];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md" style={{ animation: 'pop-in 0.5s ease-out' }}>
          <div className="flex items-center">
            <span className="text-2xl mr-3">✅</span>
            <p className="text-green-700 font-semibold">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md" style={{ animation: 'pop-in 0.5s ease-out' }}>
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        </div>
      )}
      
      {/* 🌟 Decorated Header */}
      <header className="text-center mb-12 p-8 rounded-3xl shadow-2xl bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200" style={{ animation: 'pop-in 0.8s ease-out' }}>
        <h1 className="text-5xl font-extrabold text-orange-600 mb-2">
          🧡 Donor Dashboard
        </h1>
        <p className="text-2xl font-semibold text-gray-700 mb-4">Welcome Back, {user.name || 'Hero'}!</p>
        <p className="text-lg text-gray-500">
          Every contribution you make fuels hope and provides essential nourishment. Thank you for being a lifeline.
        </p>
      </header>

      {/* --- */}

      {/* 📊 Interactive Stats Dashboard (Now 3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Total Donated */}
        <div className={`bg-white p-8 rounded-2xl shadow-2xl transition duration-500 hover:shadow-orange-300/50 hover:scale-[1.01] ${pulseStat === 'totalDonated' ? 'border-4 border-orange-400' : 'border border-gray-100'}`}
             style={{ animation: pulseStat === 'totalDonated' ? 'pulse-once 1.5s ease-in-out' : 'pop-in 1s ease-out', animationDelay: '0.2s' }}>
          <p className="text-sm font-semibold text-orange-600 mb-3 uppercase tracking-widest flex items-center"><span className="text-xl mr-2">💰</span> Total Donated</p>
          <div className="text-5xl font-extrabold text-orange-700">${stats.totalDonated.toFixed(2)}</div>
          <p className="text-gray-500 mt-3">The cumulative value of your generosity.</p>
        </div>
        
        {/* Meals Funded */}
        <div className={`bg-white p-8 rounded-2xl shadow-2xl transition duration-500 hover:shadow-green-300/50 hover:scale-[1.01] ${pulseStat === 'mealsFunded' ? 'border-4 border-green-400' : 'border border-gray-100'}`}
             style={{ animation: pulseStat === 'mealsFunded' ? 'pulse-once 1.5s ease-in-out' : 'pop-in 1s ease-out', animationDelay: '0.4s' }}>
          <p className="text-sm font-semibold text-green-600 mb-3 uppercase tracking-widest flex items-center"><span className="text-xl mr-2">🍽️</span> Meals Arranged</p>
          <div className="text-5xl font-extrabold text-green-700">{stats.mealsFunded}</div>
          <p className="text-gray-500 mt-3">The direct impact count of meals provided.</p>
        </div>

        {/* 🌟 New Stat: Average Cost Per Meal */}
        <div className={`bg-white p-8 rounded-2xl shadow-2xl transition duration-500 hover:shadow-blue-300/50 hover:scale-[1.01] border border-gray-100`}
             style={{ animation: 'pop-in 1s ease-out', animationDelay: '0.6s' }}>
          <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-widest flex items-center"><span className="text-xl mr-2">🎯</span> Avg. Cost Per Meal</p>
          <div className="text-5xl font-extrabold text-blue-700">${stats.avgCostPerMeal}</div>
          <p className="text-gray-500 mt-3">This covers food, preparation, and logistics.</p>
        </div>
      </div>

      {/* 💖 Child Feedback Carousel */}
      {feedback.length > 0 && (
        <div className="mb-16 p-10 bg-gradient-to-bl from-teal-50 to-white rounded-3xl shadow-2xl border-2 border-teal-100" style={{ animation: 'pop-in 1.2s ease-out' }}>
          <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center border-b pb-3">Hear the Impact</h2>
          <div className="flex flex-col md:flex-row items-center justify-center transition-all duration-700 ease-in-out">
            
            {/* Image */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0 mb-6 md:mb-0 md:mr-10">
              <img
                key={currentFeedback.id}
                src={currentFeedback.image}
                alt={currentFeedback.name || currentFeedback.recipientName || 'Recipient'}
                onError={(e) => {
                  e.target.src = '/images/child-placeholder.png';
                }}
                className="w-full h-full object-cover rounded-full shadow-2xl border-8 border-orange-300 transition-all duration-700"
                style={{ animation: 'pop-in 0.8s ease-out' }}
              />
              <span className="absolute bottom-0 right-0 bg-teal-500 text-white px-3 py-1 rounded-full text-md font-bold shadow-lg transform rotate-3">
                {currentFeedback.name || currentFeedback.recipientName || 'Anonymous'}
              </span>
            </div>

            {/* Message */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg">
              <blockquote className="text-xl italic text-gray-800 font-medium mb-4 p-4 bg-teal-50 rounded-xl border-l-4 border-teal-400">
                "{currentFeedback.message || currentFeedback.chat || 'Thank you for your generous donation!'}"
              </blockquote>
              {currentFeedback.rating && (
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400 text-2xl mr-2">
                    {'⭐'.repeat(currentFeedback.rating)}
                  </span>
                  <span className="text-gray-600 font-semibold">
                    {currentFeedback.rating}/5
                  </span>
                </div>
              )}
              {currentFeedback.createdAt && (
                <p className="text-sm text-gray-500">
                  {new Date(currentFeedback.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- */}

      {/* 🚀 Interactive Tab/Action Buttons */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Impact History</h2>
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        <button
          className={`flex items-center px-8 py-4 rounded-xl font-extrabold transition duration-300 shadow-lg transform hover:-translate-y-0.5 ${activeTab === 'donation' ? 'bg-blue-600 text-white' : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'}`}
          onClick={() => setActiveTab(activeTab === 'donation' ? null : 'donation')}
        >
          <span className="mr-2 text-2xl">📑</span> Donation Log
        </button>
        <button
          className={`flex items-center px-8 py-4 rounded-xl font-extrabold transition duration-300 shadow-lg transform hover:-translate-y-0.5 ${activeTab === 'delivered' ? 'bg-purple-600 text-white' : 'bg-white text-purple-500 border border-purple-500 hover:bg-purple-50'}`}
          onClick={() => setActiveTab(activeTab === 'delivered' ? null : 'delivered')}
        >
          <span className="mr-2 text-2xl">🗺️</span> Delivered Food Map & Logistics
        </button>
        <button
          className="flex items-center px-8 py-4 rounded-xl font-extrabold text-white bg-orange-500 hover:bg-orange-600 transition duration-300 shadow-2xl transform hover:scale-105"
          onClick={() => setShowDonateModal(true)}
        >
          <span className="mr-2 text-2xl">❤️</span> Donate Again
        </button>
      </div>

      {/* Active Content Panel */}
      <div className="mb-16">
        {renderActiveContent()}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        onSuccess={handleDonationSuccess}
      />
    </div>
  );
}