import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 🚨 Custom CSS Styles for Animations (Simulating global or scoped CSS injection) 🚨
const customStyles = `
@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.9) translateY(10px); }
  100% { opacity 1; transform: scale(1) translateY(0); }
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
`;

// Inject the styles (A simplified way for a single component)
if (typeof document !== 'undefined' && !document.getElementById('custom-donor-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'custom-donor-styles';
  styleEl.innerHTML = customStyles;
  document.head.appendChild(styleEl);
}

// Dummy Data
const dummyStats = {
  totalDonated: 320,
  mealsFunded: 128,
};
const dummyTransactions = [
  { id: 1, date: '2025-11-01', amount: 50, recipient: 'School A', status: 'Completed' },
  { id: 2, date: '2025-10-20', amount: 100, recipient: 'Community Center', status: 'Completed' },
  { id: 3, date: '2025-09-15', amount: 170, recipient: 'Family B', status: 'Completed' },
];

const dummyFeedback = [
  { id: 1, image: '/donor/child1.png', chat: 'Thank you for the delicious meal! You made my day brighter.', voice: '/donor/child1.mp3', name: 'Ayesha' },
  { id: 2, image: '/donor/child2.png', chat: 'I am so happy and grateful for your help!', voice: '/donor/child2.mp3', name: 'Kamal' },
  { id: 3, image: '/donor/child3.png', chat: 'Thanks to you, I had a wonderful lunch today!', voice: '/donor/child3.mp3', name: 'Sithara' },
];

export default function Donor({ user }) {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [stats, setStats] = useState(dummyStats);
  const [transactions, setTransactions] = useState(dummyTransactions);
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pulseStat, setPulseStat] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // --- CALCULATED VALUE ---
  const avgCostPerMeal = useMemo(() => {
    if (stats.mealsFunded > 0) {
      // Calculate average cost and round to two decimal places
      return (stats.totalDonated / stats.mealsFunded).toFixed(2);
    }
    return 0;
  }, [stats.totalDonated, stats.mealsFunded]);
  // -------------------------

  // Simulate stat update/pulse on initial load
  useEffect(() => {
    setPulseStat('totalDonated');
    const timer = setTimeout(() => setPulseStat(null), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Navigation Guard
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Carousel Animation
  useEffect(() => {
    const timer = setInterval(() => {
      setFeedbackIndex((prev) => (prev + 1) % dummyFeedback.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Audio Handler
  const handlePlayVoice = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, []);

  // Tab Content Renderer
  const renderActiveContent = () => {
    if (activeTab === 'donation') {
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
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Recipient</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50 transition duration-150">
                    <td className="py-3 px-4 text-sm text-gray-700">{tx.date}</td>
                    <td className="py-3 px-4 text-sm font-bold text-green-600">${tx.amount}</td>
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
            <span className="mr-2 text-2xl">🗺️</span> Delivered Food and Logistics Tracking (Demo)
          </h3>
          <p className="mb-4 text-gray-600">
            This tracking system, coming soon, will use geolocation data to show you exactly when and where your meals were distributed.
          </p>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="font-semibold text-purple-700 mb-2">💡 Transportation Transparency:</p>
              <p className="text-sm text-gray-700">The **average meal cost (${avgCostPerMeal})** covers the raw food materials, preparation, and a small portion of the necessary logistics (transport, personnel) to ensure the meal reaches the child safely and quickly.</p>
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

  const currentFeedback = dummyFeedback[feedbackIndex];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      
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
          <div className="text-5xl font-extrabold text-orange-700">${stats.totalDonated}</div>
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
          <div className="text-5xl font-extrabold text-blue-700">${avgCostPerMeal}</div>
          <p className="text-gray-500 mt-3">This covers food, preparation, and logistics.</p>
        </div>
      </div>

      {/* 💖 Child Feedback Carousel (Remains the same) */}
      <div className="mb-16 p-10 bg-gradient-to-bl from-teal-50 to-white rounded-3xl shadow-2xl border-2 border-teal-100" style={{ animation: 'pop-in 1.2s ease-out' }}>
        <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center border-b pb-3">Hear the Impact</h2>
        <div className="flex flex-col md:flex-row items-center justify-center transition-all duration-700 ease-in-out">
          
          {/* Image */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0 mb-6 md:mb-0 md:mr-10">
            <img
              key={currentFeedback.id}
              src={currentFeedback.image}
              alt={currentFeedback.name}
              className="w-full h-full object-cover rounded-full shadow-2xl border-8 border-orange-300 transition-all duration-700"
              style={{ animation: 'pop-in 0.8s ease-out' }}
            />
            <span className="absolute bottom-0 right-0 bg-teal-500 text-white px-3 py-1 rounded-full text-md font-bold shadow-lg transform rotate-3">{currentFeedback.name}</span>
          </div>

          {/* Message and Button */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg">
            <blockquote className="text-xl italic text-gray-800 font-medium mb-4 p-4 bg-teal-50 rounded-xl border-l-4 border-teal-400">
              "{currentFeedback.chat}"
            </blockquote>
            <button
              className={`flex items-center px-6 py-3 rounded-full font-bold transition duration-300 shadow-lg transform hover:scale-[1.05] ${isPlaying ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
              onClick={handlePlayVoice}
              disabled={isPlaying}
            >
              {isPlaying ? (
                <>
                  <span className="mr-2 animate-pulse">🎤</span> Playing Voice Note...
                </>
              ) : (
                <>
                  <span className="mr-2">👂</span> Listen to Voice Message
                </>
              )}
            </button>
            <audio ref={audioRef} src={currentFeedback.voice} preload="auto" />
          </div>
        </div>
      </div>

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

      {/* --- MODALS (Unchanged) --- */}

      {/* Donate Modal Placeholder */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-3xl max-w-md w-full" style={{ animation: 'modal-slide-up 0.5s ease-out' }}>
            <h3 className="text-3xl font-extrabold mb-4 text-orange-700 flex items-center">
                <span className="mr-2 text-3xl">🎁</span> Donate Now
            </h3>
            <p className="mb-6 text-gray-600">
              Thank you for choosing to make another generous contribution! The full, secure payment flow will appear here shortly.
            </p>
            <div className="flex justify-end space-x-3">
                <button
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                    onClick={() => setShowDonateModal(false)}
                >
                    Cancel
                </button>
                <button
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    onClick={() => {
                        alert('Simulated Donation Successful!');
                        setShowDonateModal(false);
                    }}
                >
                    Simulate Donate $50
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}