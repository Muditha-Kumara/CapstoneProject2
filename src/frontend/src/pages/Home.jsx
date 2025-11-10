import { useState } from 'react';
import Modal from '../components/Modal';
import Login from '../components/Login';

// --- Data Definitions for Reusability ---

const projectStats = [
  { label: 'Meals today', value: '128' },
  { label: 'Requests funded', value: '93%' },
  { label: 'Active donors', value: '2,341' },
  { label: 'Verified providers', value: '412' },
];

const featureCards = [
  {
    title: 'For Children',
    desc: 'Anonymous requests ensure privacy while connecting children to nutritious meals through trusted adults.',
    icon: '❤️',
  },
  {
    title: 'For Donors',
    desc: 'Complete transparency with photo verification and real-time tracking of your donation impact.',
    icon: '❤️',
  },
  {
    title: 'For Providers',
    desc: 'Join our network of verified local food providers and help nourish your community.',
    icon: '🏪',
  },
];


// --- Helper Components ---

function Stat({ label, value, isDonorFocus }) {
  const baseClasses = "rounded-2xl p-6 border transition duration-500 shadow-md";
  const focusClasses = isDonorFocus 
    ? "bg-yellow-500 border-yellow-700 text-white transform hover:scale-105 cursor-pointer" 
    : "bg-white border-gray-200";

  return (
    <div className={`${baseClasses} ${focusClasses}`}>
      <div className={`text-sm ${isDonorFocus ? 'text-gray-900' : 'text-slate-500'}`}>{label}</div>
      <div className={`text-4xl font-extrabold mt-2 ${isDonorFocus ? 'text-white' : 'text-green-600'}`}>{value}</div>
      {isDonorFocus && <div className="text-xs mt-1 font-medium">Click to see impact details!</div>}
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="text-center p-6 transition duration-300 hover:shadow-xl rounded-xl">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
        <span className="text-white text-2xl">{icon}</span>
      </div>
      <h3 className="font-bold text-xl mb-2 text-green-800">{title}</h3>
      <p className="text-slate-600 text-base">{desc}</p>
    </div>
  );
}


// --- Extracted Components for Modularity ---

function HeroSection({ onRequestFood, onDonate }) {
  return (
    // Calming Hero Section with background image placeholder
    <section 
      className="relative bg-gray-100 bg-cover bg-center" 
      style={{ backgroundImage: 'url("/images/calming_hero_image.png")', height: '550px' }}
    >
      {/* Dark overlay for text readability - increased opacity */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div> 
      
      <div className="relative mx-auto max-w-7xl px-4 h-full flex items-center">
        <div className="w-full md:w-1/2 p-4 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-snug drop-shadow-lg" style={{textShadow: '0 2px 8px rgba(0,0,0,0.7)'}}>
            Connecting communities to <span className="text-yellow-300">nourish</span> children
          </h1>
          <p className="mt-4 text-xl font-light max-w-prose drop-shadow-md" style={{textShadow: '0 1px 6px rgba(0,0,0,0.6)'}}>
            A transparent, on-demand bridge between trusted adults, local food providers, and donors.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={onRequestFood} className="px-6 py-3 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition duration-300 shadow-lg">
              Request Food
            </button>
            <button onClick={onDonate} className="px-6 py-3 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 transition duration-300 shadow-lg">
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function RequestFoodModal({ open, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Request Submitted (Demo)');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Request Food">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="w-full px-4 py-2 border rounded-lg" placeholder="Your Name (Trusted Adult)" required />
        <select className="w-full px-4 py-2 border rounded-lg text-gray-500" required>
          <option value="" disabled selected>Your Relationship</option>
          <option value="parent">Parent/Guardian</option>
          <option value="teacher">Teacher</option>
          <option value="counselor">School Counselor</option>
          <option value="social-worker">Social Worker</option>
          <option value="other">Other</option>
        </select>
        <select className="w-full px-4 py-2 border rounded-lg text-gray-500" required>
          <option value="" disabled selected>Number of Children</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5+</option>
        </select>
        <select className="w-full px-4 py-2 border rounded-lg text-gray-500" required>
          <option value="" disabled selected>Preferred Meal Time</option>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>
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


// --- Main Home Component ---

export default function Home({ onLoginClick, user, setUser, setPostLoginRedirect }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDonateClick = () => {
    alert('Donate flow coming soon');
  };

  return (
    <div>
      <HeroSection
        onRequestFood={() => setIsModalOpen(true)}
        onDonate={() => setIsModalOpen(true)}
      />

      {/* Impact and Donation Promotion Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">See Your Direct Impact</h2>
        
        {/* Animated/Hoverable Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectStats.map((stat) => (
            <Stat 
              key={stat.label} 
              label={stat.label} 
              value={stat.value} 
              isDonorFocus={stat.label === 'Requests funded'} // Highlights the most important stat
            />
          ))}
        </div>
        
        {/* Strong Donor Promotion CTA */}
        <div className="mt-12 p-8 bg-green-50 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-green-800">Help us reach 100% funding and nourish more children today.</h3>
          <p className="text-gray-600 mt-2">Every meal counts. Join our active community of 2,341 donors.</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-6 px-8 py-4 rounded-xl font-bold text-white text-lg bg-orange-500 hover:bg-orange-600 transition duration-300 shadow-xl transform hover:scale-105">
            Donate Now and Track Your Impact
          </button>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-10">
          {featureCards.map((feature) => (
            <Feature
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
            />
          ))}
        </div>
      </section>

      <Login open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={userObj => {
        setUser(userObj);
        setIsModalOpen(false);
        setPostLoginRedirect(true);
      }} />
    </div>
  );
}