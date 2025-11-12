import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from '../components/Modal';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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

function RequestFoodModal({ open, onClose, user }) {
  const [numChildren, setNumChildren] = useState('');
  const [childrenDropdownOpen, setChildrenDropdownOpen] = useState(false);
  const [mealType, setMealType] = useState('');
  const [mealTypeDropdownOpen, setMealTypeDropdownOpen] = useState(false);
  const [mealTime, setMealTime] = useState('');
  const [mealTimeDropdownOpen, setMealTimeDropdownOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(null);
  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timeOptions, setTimeOptions] = useState([]); // NEW: store time options in state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // NEW: track touched fields
  const [notification, setNotification] = useState(''); // NEW: notification state
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const timePickerWrapperRef = useRef(null);
  // Track which dropdown is active for z-index stacking
  const [activeDropdown, setActiveDropdown] = useState(null); // 'children' | 'mealType' | 'mealTime' | 'countryCode' | null

  const childrenOptions = ['1', '2', '3', '4', '5'];
  const mealTypeOptions = ['Main', 'Snack', 'Drink', 'Dessert', 'Sweet'];

  // Generate time options: 15-min intervals, starting 1 hour ahead
  const getTimeOptions = () => {
    const options = [];
    const now = new Date();
    let start = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour ahead
    start.setSeconds(0, 0);
    start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15); // round up to next 15 min
    const end = new Date(now);
    end.setHours(23, 59, 0, 0);
    while (start <= end) {
      let hours = start.getHours();
      let minutes = start.getMinutes();
      let ampm = hours >= 12 ? 'PM' : 'AM';
      let displayHour = hours % 12 || 12;
      let display = `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      options.push(display);
      start = new Date(start.getTime() + 15 * 60 * 1000);
    }
    return options;
  };

  // NEW: recalculate time options every time modal opens
  useEffect(() => {
    if (open) {
      const newOptions = getTimeOptions();
      setTimeOptions(newOptions);
      // If selected time is no longer valid, reset it
      if (!newOptions.includes(mealTime)) {
        setMealTime('');
      }
    }
  }, [open]);

  // Auto-detect location when modal opens
  useEffect(() => {
    if (open) {
      if (!navigator.geolocation) return;
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          setLocation(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`);
          setLocating(false);
        },
        () => {
          setLocating(false);
        }
      );
    }
  }, [open]);

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

  // Validation logic for each field
  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return !value.trim() ? 'Name is required.' : '';
      case 'phone':
        return (!value || value.replace(/\D/g, '').length < 10) ? 'Valid phone number required.' : '';
      case 'location':
        return !value.trim() ? 'Location is required.' : '';
      case 'numChildren':
        return !value ? 'Number of children required.' : '';
      case 'mealType':
        return !value ? 'Meal type required.' : '';
      case 'mealTime':
        return !value ? 'Meal time required.' : '';
      default:
        return '';
    }
  };

  // Validate all fields
  const validateAll = () => {
    return {
      name: validateField('name', name),
      phone: validateField('phone', phoneNumber),
      location: validateField('location', location),
      numChildren: validateField('numChildren', numChildren),
      mealType: validateField('mealType', mealType),
      mealTime: validateField('mealTime', mealTime),
    };
  };

  // Live validation on change
  useEffect(() => {
    setErrors(validateAll());
    // Hide notification if form becomes valid
    if (notification && Object.values(validateAll()).every(err => !err)) {
      setNotification('');
    }
    // eslint-disable-next-line
  }, [name, phoneNumber, location, numChildren, mealType, mealTime]);

  // Check if all required fields are valid
  const isFormValid = Object.values(validateAll()).every(err => !err);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, location: true, numChildren: true, mealType: true, mealTime: true });
    if (!isFormValid) {
      setNotification('Please complete all required fields correctly before submitting.');
      return;
    }
    setNotification('');
    alert('Food request submitted!');
    onClose();
  };

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  return (
    <Modal open={open} onClose={onClose} title="Request Food">
      <form className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-md" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold text-green-700 mb-2">Meal Request Details</h3>
        {/* Name input - move to top */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
            Your Name (Trusted Adult) <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            id="name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => handleBlur('name')}
            required
            disabled={!!user?.name}
          />
          {touched.name && errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
        </div>
        {/* Phone Input with Country Code and Flag - add gap and spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
            Phone Number <span className="text-red-500" aria-label="required">*</span>
          </label>
          <span className="block text-xs text-gray-500 mb-2">Provide a valid phone number for contact and order updates.</span>
          <PhoneInput
            country={'us'}
            value={phoneNumber}
            onChange={setPhoneNumber}
            inputProps={{
              name: 'phone',
              id: 'phone',
              required: true,
              className: 'pl-14 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition',
              placeholder: 'Phone Number',
              onBlur: () => handleBlur('phone'),
            }}
            containerClass="w-full"
            buttonClass=""
            dropdownClass=""
          />
          {touched.phone && errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
            Location (Select from the map) <span className="text-red-500" aria-label="required">*</span>
          </label>
          <span className="block text-xs text-gray-500 mb-2">Specify the location for meal delivery using map. You can drag and drop red mark to your location in the map.</span>
          <div className="flex gap-2">
            <input
              id="location"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
              placeholder="Location (School, etc.)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onBlur={() => handleBlur('location')}
              required
              readOnly
            />
            <button
              type="button"
              className="px-3 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              onClick={handleDetectLocation}
              disabled={locating}
            >
              {locating ? 'Locating…' : 'Detect'}
            </button>
          </div>
          {touched.location && errors.location && <div className="text-red-500 text-xs mt-1">{errors.location}</div>}
        </div>
        {/* Google Map for location selection */}
        <div className="w-full h-64 rounded-lg border mb-4" ref={mapRef} style={{ minHeight: '256px' }}></div>
        {/* Custom Dropdown for Number of Children */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Children <span className="text-red-500" aria-label="required">*</span>
          </label>
          <span className="block text-xs text-gray-500 mb-2">Select the number of children who need a meal.</span>
          <div className="relative" style={{ zIndex: activeDropdown === 'children' ? 100 : 30 }}>
            <div onMouseLeave={() => { setChildrenDropdownOpen(false); setActiveDropdown(null); }}>
              <button
                type="button"
                className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-white text-left flex justify-between items-center focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                onClick={() => { setChildrenDropdownOpen(!childrenDropdownOpen); setActiveDropdown('children'); }}
                tabIndex={0}
                onBlur={() => handleBlur('numChildren')}
              >
                {numChildren ? numChildren : 'Select number'}
                <span className="ml-2">▼</span>
              </button>
              {childrenDropdownOpen && (
                <div className="absolute left-0 right-0 bg-white border rounded-lg shadow-lg" style={{ zIndex: activeDropdown === 'children' ? 200 : 50, marginTop: 0 }}>
                  {childrenOptions.map(opt => (
                    <div
                      key={opt}
                      className="px-4 py-2 cursor-pointer hover:bg-green-100"
                      onClick={() => { setNumChildren(opt); setChildrenDropdownOpen(false); setActiveDropdown(null); handleBlur('numChildren'); }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {touched.numChildren && errors.numChildren && <div className="text-red-500 text-xs mt-1">{errors.numChildren}</div>}
        </div>
        {/* Custom Dropdown for Meal Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Type <span className="text-red-500" aria-label="required">*</span>
          </label>
          <span className="block text-xs text-gray-500 mb-2">Choose the type of meal needed (e.g., main, snack, drink).</span>
          <div className="relative" style={{ zIndex: activeDropdown === 'mealType' ? 100 : 30 }}>
            <div onMouseLeave={() => { setMealTypeDropdownOpen(false); setActiveDropdown(null); }}>
              <button
                type="button"
                className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-white text-left flex justify-between items-center focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                onClick={() => { setMealTypeDropdownOpen(!mealTypeDropdownOpen); setActiveDropdown('mealType'); }}
                tabIndex={0}
                onBlur={() => handleBlur('mealType')}
              >
                {mealType ? mealType : 'Select meal type'}
                <span className="ml-2">▼</span>
              </button>
              {mealTypeDropdownOpen && (
                <div className="absolute left-0 right-0 bg-white border rounded-lg shadow-lg" style={{ zIndex: activeDropdown === 'mealType' ? 200 : 50, marginTop: 0 }}>
                  {mealTypeOptions.map(opt => (
                    <div
                      key={opt}
                      className="px-4 py-2 cursor-pointer hover:bg-green-100"
                      onClick={() => { setMealType(opt); setMealTypeDropdownOpen(false); setActiveDropdown(null); handleBlur('mealType'); }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {touched.mealType && errors.mealType && <div className="text-red-500 text-xs mt-1">{errors.mealType}</div>}
        </div>
        {/* Custom Dropdown for Meal Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Time <span className="text-red-500" aria-label="required">*</span>
          </label>
          <span className="block text-xs text-gray-500 mb-2">Select the time you want the meal delivered. Earliest selectable time is 1 hour from now.</span>
          <div className="relative" style={{ zIndex: activeDropdown === 'mealTime' ? 100 : 30 }}>
            <div onMouseLeave={() => { setMealTimeDropdownOpen(false); setActiveDropdown(null); }}>
              <button
                type="button"
                className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-white text-left flex justify-between items-center focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                onClick={() => { setMealTimeDropdownOpen(!mealTimeDropdownOpen); setActiveDropdown('mealTime'); }}
                tabIndex={0}
                onBlur={() => handleBlur('mealTime')}
              >
                {mealTime ? mealTime : 'Select meal time'}
                <span className="ml-2">▼</span>
              </button>
              {mealTimeDropdownOpen && (
                <div className="absolute left-0 right-0 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto" style={{ zIndex: activeDropdown === 'mealTime' ? 200 : 50, marginTop: 0 }}>
                  {timeOptions.map(opt => (
                    <div
                      key={opt}
                      className="px-4 py-2 cursor-pointer hover:bg-green-100"
                      onClick={() => { setMealTime(opt); setMealTimeDropdownOpen(false); setActiveDropdown(null); handleBlur('mealTime'); }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {touched.mealTime && errors.mealTime && <div className="text-red-500 text-xs mt-1">{errors.mealTime}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dietary needs or preferences (optional)</label>
          <span className="block text-xs text-gray-500 mb-2">Mention any allergies, dietary restrictions, or preferences for the meal.</span>
          <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" placeholder="Dietary needs or preferences (optional)" />
        </div>
        <div className="flex justify-end gap-3 pt-2 items-center">
          <button type="button" className="px-4 py-2 border rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`px-4 py-2 text-white rounded-lg focus:ring-2 focus:ring-green-400 transition ${isFormValid ? 'bg-green-600 hover:bg-green-700 cursor-pointer shadow' : 'bg-gray-400 cursor-not-allowed opacity-60'}`}
              aria-disabled={!isFormValid}
              tabIndex={0}
              onClick={() => {
                if (!isFormValid) {
                  setTouched({ name: true, phone: true, location: true, numChildren: true, mealType: true, mealTime: true });
                  setNotification('Please complete all required fields correctly before submitting.');
                } else {
                  setNotification('');
                  alert('Food request submitted!');
                  onClose();
                }
              }}
            >
              Submit
            </button>
            {notification && (
              <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded flex items-center" role="alert">
                <span>{notification}</span>
                <button type="button" className="ml-2 text-red-700 font-bold" aria-label="Dismiss notification" onClick={() => setNotification('')}>&times;</button>
              </div>
            )}
          </div>
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

export default function Requester({ user }) {
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
      <RequestFoodModal open={isRequestModalOpen} onClose={() => setRequestModalOpen(false)} user={user} />
      <ChatModal open={isChatOpen} onClose={() => setChatOpen(false)} withWhom={isChatOpen ? 'Provider/Donor' : ''} />
      <FeedbackModal open={isFeedbackOpen} onClose={() => setFeedbackOpen(false)} orderId={activeOrder?.id} />
    </div>
  );
}
