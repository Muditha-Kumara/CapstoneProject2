import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy data for demonstration; replace with API integration
const dummyStats = {
  totalDonated: 320,
  mealsFunded: 128,
};
const dummyTransactions = [
  { id: 1, date: '2025-11-01', amount: 50, recipient: 'School A', status: 'Completed' },
  { id: 2, date: '2025-10-20', amount: 100, recipient: 'Community Center', status: 'Completed' },
  { id: 3, date: '2025-09-15', amount: 170, recipient: 'Family B', status: 'Completed' },
];

export default function Donor({ user }) {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [stats, setStats] = useState(dummyStats);
  const [transactions, setTransactions] = useState(dummyTransactions);
  const navigate = useNavigate();

  // TODO: Fetch real stats and transactions from API
  useEffect(() => {
    // Example: fetch('/api/donor/stats').then(...)
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Prevent rendering anything while redirecting
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-green-800 mb-2">Welcome, {user.name || 'Donor'}!</h1>
      <p className="text-gray-600 mb-8">Thank you for making a difference. Here’s your impact and donation history.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-green-50 p-6 rounded-xl shadow text-center">
          <div className="text-2xl font-bold text-green-700">${stats.totalDonated}</div>
          <div className="text-gray-600 mt-1">Total Donated</div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-xl shadow text-center">
          <div className="text-2xl font-bold text-yellow-700">{stats.mealsFunded}</div>
          <div className="text-gray-600 mt-1">Meals Funded</div>
        </div>
      </div>

      {/* Donate Now Button */}
      <div className="mb-10 text-center">
        <button
          className="px-8 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition duration-300 shadow-lg"
          onClick={() => setShowDonateModal(true)}
        >
          Donate Now
        </button>
      </div>

      {/* Recent Transactions */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Donations</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Amount</th>
              <th className="py-2 px-4 border-b text-left">Recipient</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td className="py-2 px-4 border-b">{tx.date}</td>
                <td className="py-2 px-4 border-b">${tx.amount}</td>
                <td className="py-2 px-4 border-b">{tx.recipient}</td>
                <td className="py-2 px-4 border-b">{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Donate Modal Placeholder */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Donate (Demo)</h3>
            <p className="mb-4 text-gray-600">Donation flow coming soon.</p>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
              onClick={() => setShowDonateModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
