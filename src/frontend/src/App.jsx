import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import How from './pages/How'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './components/Login'
import { api } from './lib/api'

export default function App() {
  console.log('App.jsx rendered');
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    // On mount, try to refresh session using refresh token
    api.refresh().then(result => {
      if (result && result.user && result.accessToken) {
        setUser(result.user);
        setAccessToken(result.accessToken);
      }
    }).catch(() => {
      setUser(null);
      setAccessToken(null);
    });
  }, []);

  useEffect(() => {
    if (user) setLoginOpen(false);
  }, [user]);

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setAccessToken(null);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header user={user} onLoginClick={() => setLoginOpen(true)} onLogout={handleLogout} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onLoginClick={() => setLoginOpen(true)} user={user} setUser={setUser} accessToken={accessToken} setAccessToken={setAccessToken} />} />
          <Route path="/how" element={<How />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Login open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={(userObj, token) => {
          setUser(userObj);
          setAccessToken(token);
          console.log('App.jsx user state updated:', userObj, token);
        }} />
      </main>
      <Footer />
    </div>
  )
}
