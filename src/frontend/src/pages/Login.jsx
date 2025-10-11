import { useState } from 'react'
import { api } from '../lib/api'

export default function Login(){
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const form = new FormData(e.target)
    const payload = Object.fromEntries(form.entries())

    try{
      if(mode==='signup') await api.signup(payload)
      else await api.login(payload)
      setMsg({type:'ok', text: mode==='signup' ? 'Account created!' : 'Logged in!'})
      e.target.reset()
    }catch(err){
      setMsg({type:'err', text: err.message})
    }finally{ setLoading(false) }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-brand mb-4">{mode==='login' ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="text-slate-600">{mode==='login' ? 'Sign in to your account' : 'Join NourishNet'}</p>
      </div>

      <div className="bg-white rounded-2xl border p-8">
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button onClick={()=>setMode('login')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${mode==='login' ? 'brand-primary text-white' : 'text-gray-600'}`}>Sign In</button>
          <button onClick={()=>setMode('signup')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${mode==='signup' ? 'brand-primary text-white' : 'text-gray-600'}`}>Sign Up</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode==='signup' && (
            <div className="grid grid-cols-2 gap-4">
              <input name="firstName" placeholder="First Name" className="w-full px-4 py-2 border rounded-lg" required />
              <input name="lastName" placeholder="Last Name" className="w-full px-4 py-2 border rounded-lg" required />
            </div>
          )}
          <input type="email" name="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg" required />
          <input type="password" name="password" placeholder="Password" className="w-full px-4 py-2 border rounded-lg" required />
          {mode==='signup' && (
            <select name="role" className="w-full px-4 py-2 border rounded-lg" required>
              <option value="">I am a…</option>
              <option value="donor">Donor</option>
              <option value="trusted-adult">Trusted Adult</option>
              <option value="provider">Food Provider</option>
            </select>
          )}
          <button disabled={loading} className="w-full py-3 brand-primary text-white rounded-lg hover:opacity-90">{loading? 'Please wait…' : (mode==='login' ? 'Sign In' : 'Create Account')}</button>
          {msg && <p className={msg.type==='ok' ? 'text-green-700' : 'text-red-600'}>{msg.text}</p>}
        </form>
      </div>
    </section>
  )
}
