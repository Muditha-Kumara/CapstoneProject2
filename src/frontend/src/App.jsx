import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import How from './pages/How'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './components/Login'
import Donor from './pages/Donor';
import Requester from './pages/Requester';
import Provider from './pages/Provider';
import Admin from './pages/Admin';
import { api } from './lib/api'

export default function App() {
  console.log('App.jsx rendered');
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [postLoginRedirect, setPostLoginRedirect] = useState(false);
  const navigate = useNavigate();

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
    if (user && postLoginRedirect) {
      // Redirect users to their respective dashboards based on role
      if (user.role === 'donor' || user.isDonor) {
        navigate('/donor', { replace: true });
      } else if (user.role === 'recipient' || user.isRecipient) {
        navigate('/recipient', { replace: true });
      } else if (user.role === 'provider' || user.isProvider) {
        navigate('/provider', { replace: true });
      } else if (user.role === 'admin' || user.isAdmin) {
        navigate('/admin', { replace: true });
      }
      setPostLoginRedirect(false);
    }
  }, [user, postLoginRedirect, navigate]);

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
          <Route path="/" element={<Home onLoginClick={() => setLoginOpen(true)} user={user} setUser={setUser} accessToken={accessToken} setAccessToken={setAccessToken} setPostLoginRedirect={setPostLoginRedirect} />} />
          <Route path="/how" element={<How />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donor" element={user ? <Donor user={user} /> : <Navigate to="/" replace />} />
          <Route path="/recipient" element={user ? <Requester user={user} /> : <Navigate to="/" replace />} />
          <Route path="/provider" element={user ? <Provider user={user} /> : <Navigate to="/" replace />} />
          <Route path="/admin" element={user ? <Admin user={user} /> : <Navigate to="/" replace />} />
        </Routes>
        <Login open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={(userObj, token) => {
          setUser(userObj);
          setAccessToken(token);
          setPostLoginRedirect(true);
        }} />
      </main>
      <Footer />
    </div>
  )
}
