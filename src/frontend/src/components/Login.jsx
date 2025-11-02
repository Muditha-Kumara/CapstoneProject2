import { useState } from 'react'
import { api } from '../lib/api'

const ROLES = [
  { value: '', label: 'I am a…' },
  { value: 'donor', label: 'Donor' },
  { value: 'trusted-adult', label: 'Trusted Adult' },
  { value: 'provider', label: 'Food Provider' },
];

export default function Login({ open, onClose, onSuccess }){
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [role, setRole] = useState('');

  if (!open) return null;

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const form = new FormData(e.target)
    const payload = Object.fromEntries(form.entries())
    if (mode === 'signup') {
      // Only allow valid roles for backend
      const validRoles = ['donor', 'recipient', 'provider'];
      payload.role = validRoles.includes(role) ? role : 'none';
      // Combine firstName and lastName into name for backend
      payload.name = `${payload.firstName} ${payload.lastName}`.trim();
      delete payload.firstName;
      delete payload.lastName;
    }

    try{
      let result;
      if(mode==='signup') result = await api.signup(payload)
      else result = await api.login(payload)
      setMsg({type:'ok', text: mode==='signup' ? 'Account created!' : 'Logged in!'})
      e.target.reset()
      setRole('');
      if (result && result.user && result.user.email) {
        console.log('Calling onSuccess with:', result.user);
        onSuccess(result.user);
        console.log('onSuccess callback finished');
      }
     // setTimeout(onClose, 0);
    }catch(err){
      setMsg({type:'err', text: err.message})
    }finally{ setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl border p-8 shadow-2xl animate-fadein relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">×</button>
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-4 drop-shadow-lg">{mode==='login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-slate-600 text-lg font-medium">{mode==='login' ? 'Sign in to your account' : 'Join NourishNet'}</p>
        </div>
        <div>
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button onClick={()=>setMode('login')} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition duration-200 ${mode==='login' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>Sign In</button>
            <button onClick={()=>setMode('signup')} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition duration-200 ${mode==='signup' ? 'bg-yellow-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>Sign Up</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode==='signup' && (
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" placeholder="First Name" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200" required />
                <input name="lastName" placeholder="Last Name" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200" required />
              </div>
            )}
            <input type="email" name="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200" required />
            <input type="password" name="password" placeholder="Password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200" required />
            {mode==='signup' && (
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-white text-left flex justify-between items-center"
                  onClick={() => setRole(role === '' ? ROLES[0].value : '')}
                  tabIndex={0}
                >
                  {ROLES.find(r => r.value === role)?.label || ROLES[0].label}
                  <span className="ml-2">▼</span>
                </button>
                <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10" style={{ display: role === '' ? 'block' : 'none' }}>
                  {ROLES.slice(1).map(r => (
                    <div
                      key={r.value}
                      className="px-4 py-2 cursor-pointer hover:bg-green-100"
                      onClick={() => setRole(r.value)}
                    >
                      {r.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button disabled={loading} className="w-full py-3 font-bold text-lg rounded-lg transition duration-200 shadow-md bg-green-600 text-white hover:bg-green-700 hover:scale-105 disabled:opacity-60">{loading? 'Please wait…' : (mode==='login' ? 'Sign In' : 'Create Account')}</button>
            {msg && <p className={`mt-2 text-center font-semibold transition-all duration-500 ${msg.type==='ok' ? 'text-green-700 animate-bounce' : 'text-red-600 animate-shake'}`}>{msg.text}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
