import { Link, NavLink } from 'react-router-dom'

export default function Header(){
  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur border-b z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl brand-primary"></div>
          <span className="font-bold text-lg">NourishNet</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-semibold">
          <NavLink to="/" end className={({isActive})=> isActive? 'text-green-700' : 'hover:text-green-700'}>Home</NavLink>
          <NavLink to="/how" className={({isActive})=> isActive? 'text-green-700' : 'hover:text-green-700'}>How It Works</NavLink>
          <NavLink to="/about" className={({isActive})=> isActive? 'text-green-700' : 'hover:text-green-700'}>About</NavLink>
          <NavLink to="/contact" className={({isActive})=> isActive? 'text-green-700' : 'hover:text-green-700'}>Contact</NavLink>
          <NavLink to="/login" className={({isActive})=> isActive? 'text-green-700' : 'hover:text-green-700'}>Login / Signup</NavLink>
        </nav>
      </div>
    </header>
  )
}
