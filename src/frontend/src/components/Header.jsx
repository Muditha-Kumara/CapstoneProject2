import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

const ROLES = [
  { value: '', label: 'I am a…' },
  { value: 'donor', label: 'Donor' },
  { value: 'recipient', label: 'Trusted Adult' },
  { value: 'provider', label: 'Food Provider' },
  { value: 'admin', label: 'Admin' },
];

function getDashboardInfo(role) {
  switch (role) {
    case 'donor':
      return { route: '/donor', label: 'Donor Dashboard', color: 'orange-600' };
    case 'recipient':
      return { route: '/requester', label: 'Recipient Dashboard', color: 'blue-600' };
    case 'provider':
      return { route: '/provider', label: 'Provider Dashboard', color: 'purple-600' };
    case 'admin':
      return { route: '/admin', label: 'Admin Dashboard', color: 'red-600' };
    default:
      return null;
  }
}

export default function Header({ user, onLoginClick, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dashboardInfo = user && user.role ? getDashboardInfo(user.role) : null;

    return (
    <header className="sticky top-0 bg-white/90 backdrop-blur border-b z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 focus:outline-none" aria-label="Home">
          <div className="w-9 h-9 rounded-xl brand-primary bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="font-bold text-lg text-green-800">NourishNet</span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold" aria-label="Main navigation">
          <NavLink to="/" end className={({isActive})=> isActive? 'text-green-700 underline' : 'hover:text-green-700'}>Home</NavLink>
          <NavLink to="/how" className={({isActive})=> isActive? 'text-green-700 underline' : 'hover:text-green-700'}>How It Works</NavLink>
          <NavLink to="/about" className={({isActive})=> isActive? 'text-green-700 underline' : 'hover:text-green-700'}>About</NavLink>
          <NavLink to="/contact" className={({isActive})=> isActive? 'text-green-700 underline' : 'hover:text-green-700'}>Contact</NavLink>
          {/* Dashboard link by role */}
          {dashboardInfo && (
            <NavLink to={dashboardInfo.route} className={({isActive})=> isActive? `text-${dashboardInfo.color} underline` : `hover:text-${dashboardInfo.color}`}>
              {dashboardInfo.label}
            </NavLink>
          )}
          <div className="flex items-center">
            {user && user.email ? (
              <div className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button type="button" className="font-bold text-green-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400" aria-haspopup="true" aria-expanded={dropdownOpen}>
                  {user.email}
                </button>
                {/* Dropdown controlled by state */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full w-40 bg-white border rounded shadow-lg z-20">
                    <button className="w-full text-left px-4 py-2 hover:bg-green-50">Profile</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-green-50" onClick={onLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button type="button" onClick={onLoginClick} className="px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">Login / Signup</button>
            )}
          </div>
        </nav>
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Open menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-4 text-sm font-semibold" aria-label="Mobile navigation">
          <NavLink to="/" end className={({isActive})=> isActive? 'text-green-700 underline' : 'hover:text-green-700'} onClick={()=>setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/how" className={({isActive})=> isActive? 'text-green-700 underline' : 'hover:text-green-700'} onClick={()=>setMenuOpen(false)}>How It Works</NavLink>
          <NavLink to="/about" className={({isActive})=> isActive? 'text-green-700 underline' : 'hover:text-green-700'} onClick={()=>setMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" className={({isActive})=> isActive? 'text-green-700 underline' : 'hover:text-green-700'} onClick={()=>setMenuOpen(false)}>Contact</NavLink>
          {/* Dashboard link by role */}
          {dashboardInfo && (
            <NavLink to={dashboardInfo.route} className={({isActive})=> isActive? `text-${dashboardInfo.color} underline` : `hover:text-${dashboardInfo.color}`} onClick={()=>setMenuOpen(false)}>
              {dashboardInfo.label}
            </NavLink>
          )}
          {user && user.email ? (
            <span className="font-bold text-green-700">{user.email}</span>
          ) : (
            <button type="button" onClick={()=>{setMenuOpen(false);onLoginClick();}} className="px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">Login / Signup</button>
          )}
        </nav>
      )}
    </header>
  )
}
