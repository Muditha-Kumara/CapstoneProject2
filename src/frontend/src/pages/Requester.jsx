import { useState, useRef, useEffect } from 'react';
import Modal from '../components/Modal';

// Demo data for active order and history
const activeOrder = {
  id: 'ORD-20251110-001',
  status: 'Preparing',
  provider: 'GreenLeaf Restaurant',
  donor: 'Jane Doe',
  meal: 'Lunch',
  children: 2,
  eta: '12:30 PM',
  location: 'Sunrise Elementary',
};

const orderHistory = [
  {
    id: 'ORD-20251109-003',
    date: '2025-11-09',
    meal: 'Breakfast',
    provider: 'Happy Foods',
    donor: 'John Smith',
    children: 1,
    value: '$8.50',
    status: 'Completed',
    feedback: 'Thank you! Fast and friendly.'
  },
  {
    id: 'ORD-20251108-002',
    date: '2025-11-08',
    meal: 'Lunch',
    provider: 'GreenLeaf Restaurant',
    donor: 'Jane Doe',
    children: 2,
    value: '$16.00',
    status: 'Completed',
    feedback: 'Great food, kids loved it.'
  },
];

function RequestFoodModal({ open, onClose }) {
  const [numChildren, setNumChildren] = useState('');
  const [childrenDropdownOpen, setChildrenDropdownOpen] = useState(false);
  const [mealTime, setMealTime] = useState('');
  const [mealDropdownOpen, setMealDropdownOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const childrenOptions = ['1', '2', '3', '4', '5'];
  const mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  useEffect(() => {
    if (coords && window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 16,
      });
      const marker = new window.google.maps.Marker({
        position: coords,
        map,
        draggable: true,
      });
      marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        setCoords({ lat: pos.lat(), lng: pos.lng() });
        setLocation(`Lat: ${pos.lat().toFixed(5)}, Lng: ${pos.lng().toFixed(5)}`);
      });
      markerRef.current = marker;
    }
  }, [coords]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocation(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`);
        setLocating(false);
      },
      (err) => {
        alert('Unable to retrieve your location.');
        setLocating(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Food request submitted!');
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Request Food">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="w-full px-4 py-2 border rounded-lg" placeholder="Your Name (Trusted Adult)" required />
        <div className="flex gap-2">
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Location (School, etc.)"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
          <button
            type="button"
            className="px-3 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={handleDetectLocation}
            disabled={locating}
          >
            {locating ? 'Locating…' : 'Detect'}
          </button>
        </div>
        {/* Google Map for location selection */}
        <div className="w-full h-64 rounded-lg border" ref={mapRef} style={{ minHeight: '256px', marginBottom: '1rem' }}></div>
        {/* Custom Dropdown for Number of Children */}
        <div className="relative">
          <button
            type="button"
            className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-white text-left flex justify-between items-center"
            onClick={() => setChildrenDropdownOpen(!childrenDropdownOpen)}
            tabIndex={0}
          >
            {numChildren ? numChildren : 'Number of Children'}
            <span className="ml-2">▼</span>
          </button>
          {childrenDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
              {childrenOptions.map(opt => (
                <div
                  key={opt}
                  className="px-4 py-2 cursor-pointer hover:bg-green-100"
                  onClick={() => { setNumChildren(opt); setChildrenDropdownOpen(false); }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Custom Dropdown for Preferred Meal Time */}
        <div className="relative">
          <button
            type="button"
            className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-white text-left flex justify-between items-center"
            onClick={() => setMealDropdownOpen(!mealDropdownOpen)}
            tabIndex={0}
          >
            {mealTime ? mealTime : 'Preferred Meal Time'}
            <span className="ml-2">▼</span>
          </button>
          {mealDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
              {mealOptions.map(opt => (
                <div
                  key={opt}
                  className="px-4 py-2 cursor-pointer hover:bg-green-100"
                  onClick={() => { setMealTime(opt); setMealDropdownOpen(false); }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
        <textarea className="w-full px-4 py-2 border rounded-lg" placeholder="Dietary needs or preferences (optional)" />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="px-4 py-2 border rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg">
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ChatModal({ open, onClose, withWhom }) {
  return (
    <Modal open={open} onClose={onClose} title={`Chat with ${withWhom}`}> 
      <div className="space-y-2">
        <div className="bg-gray-100 p-2 rounded">Provider: Your meal is being prepared!</div>
        <div className="bg-green-100 p-2 rounded self-end">You: Thank you!</div>
        <input className="w-full px-4 py-2 border rounded-lg mt-2" placeholder="Type your message..." />
        <div className="flex justify-end pt-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Send</button>
        </div>
      </div>
    </Modal>
  );
}

function FeedbackModal({ open, onClose, orderId }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Feedback submitted!');
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Give Feedback">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <textarea className="w-full px-4 py-2 border rounded-lg" placeholder="Your feedback..." required />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="px-4 py-2 border rounded-lg" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg">Submit</button>
        </div>
      </form>
    </Modal>
  );
}

export default function Requester() {
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-green-50 bg-cover bg-center" style={{ backgroundImage: 'url(/images/requesting2.png)', height: '600px' }}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative mx-auto max-w-4xl px-4 h-full flex items-center">
          <div className="w-full p-4 text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-snug drop-shadow-lg" style={{textShadow: '0 2px 8px rgba(0,0,0,0.7)'}}>
              Welcome, Trusted Adult
            </h1>
            <p className="mt-3 text-lg font-light drop-shadow-md px-4 py-2 rounded-lg" style={{background: 'rgba(0,0,0,0.45)', color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.6)'}}>
              Quickly request meals for children, chat with food providers and donors, track your orders, and see your full order history and impact.
            </p>
            <div className="mt-6 flex gap-4">
              <button onClick={() => setRequestModalOpen(true)} className="px-6 py-3 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition duration-300 shadow-lg">
                Request Food
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Order Section */}
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Active Request</h2>
        {activeOrder ? (
          <div className="rounded-2xl p-6 border bg-white shadow-md flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <div className="text-lg font-semibold text-green-700">Order #{activeOrder.id}</div>
              <div className="mt-2 text-gray-600">Status: <span className="font-bold text-orange-600">{activeOrder.status}</span></div>
              <div className="mt-1 text-gray-600">Provider: <span className="font-bold">{activeOrder.provider}</span></div>
              <div className="mt-1 text-gray-600">Donor: <span className="font-bold">{activeOrder.donor}</span></div>
              <div className="mt-1 text-gray-600">Meal: <span className="font-bold">{activeOrder.meal}</span></div>
              <div className="mt-1 text-gray-600">Children: <span className="font-bold">{activeOrder.children}</span></div>
              <div className="mt-1 text-gray-600">ETA: <span className="font-bold">{activeOrder.eta}</span></div>
              <div className="mt-1 text-gray-600">Location: <span className="font-bold">{activeOrder.location}</span></div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => setChatOpen(true)} className="px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700">Chat with Provider</button>
              <button onClick={() => setChatOpen(true)} className="px-4 py-2 rounded bg-orange-500 text-white font-bold hover:bg-orange-600">Chat with Donor</button>
              <button onClick={() => setFeedbackOpen(true)} className="px-4 py-2 rounded bg-yellow-500 text-white font-bold hover:bg-yellow-600">Give Feedback</button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No active requests.</div>
        )}
      </section>

      {/* Order History Section */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Order History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Meal</th>
                <th className="py-3 px-4 text-left">Provider</th>
                <th className="py-3 px-4 text-left">Donor</th>
                <th className="py-3 px-4 text-left">Children</th>
                <th className="py-3 px-4 text-left">Value</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map(order => (
                <tr key={order.id} className="border-b hover:bg-green-50">
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">{order.date}</td>
                  <td className="py-2 px-4">{order.meal}</td>
                  <td className="py-2 px-4">{order.provider}</td>
                  <td className="py-2 px-4">{order.donor}</td>
                  <td className="py-2 px-4">{order.children}</td>
                  <td className="py-2 px-4">{order.value}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">{order.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modals */}
      <RequestFoodModal open={isRequestModalOpen} onClose={() => setRequestModalOpen(false)} />
      <ChatModal open={isChatOpen} onClose={() => setChatOpen(false)} withWhom={isChatOpen ? 'Provider/Donor' : ''} />
      <FeedbackModal open={isFeedbackOpen} onClose={() => setFeedbackOpen(false)} orderId={activeOrder?.id} />
    </div>
  );
}
