import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import How from './pages/How'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './components/Login'

export default function App() {
  console.log('App.jsx rendered');
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (user) setLoginOpen(false);
  }, [user]);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header user={user} onLoginClick={() => setLoginOpen(true)} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onLoginClick={() => setLoginOpen(true)} user={user} setUser={setUser} />} />
          <Route path="/how" element={<How />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Login open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={userObj => {
          setUser(userObj);
          console.log('App.jsx user state updated:', userObj);
        }} />
      </main>
      <Footer />
    </div>
  )
}
