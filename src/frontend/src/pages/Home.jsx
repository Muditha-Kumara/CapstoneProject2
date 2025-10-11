import { useState } from 'react'
import Modal from '../components/Modal'

export default function Home(){
  const [open, setOpen] = useState(false)

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-brand">
            Connecting communities to <span className="text-yellow-500">nourish</span> children
          </h1>
          <p className="mt-4 text-slate-600 max-w-prose">
            A transparent, on-demand bridge between trusted adults, local food providers, and donors.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={()=>setOpen(true)} className="px-4 py-2 rounded-xl text-white brand-primary hover:opacity-90">Request Food</button>
            <button onClick={()=>alert('Donate flow coming soon')} className="px-4 py-2 rounded-xl text-white brand-accent hover:opacity-90">Donate Now</button>
          </div>
        </div>
        <div className="rounded-3xl p-8 brand-surface">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Stat label="Meals today" value="128" />
            <Stat label="Requests funded" value="93%" />
            <Stat label="Active donors" value="2,341" />
            <Stat label="Verified providers" value="412" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid md:grid-cols-3 gap-8">
          <Feature emoji="🍎" title="For Children" desc="Anonymous requests ensure privacy while connecting children to nutritious meals through trusted adults."/>
          <Feature emoji="❤️" title="For Donors" desc="Complete transparency with photo verification and real-time tracking of your donation impact."/>
          <Feature emoji="🏪" title="For Providers" desc="Join our network of verified local food providers and help nourish your community."/>
        </div>
      </section>

      <Modal open={open} onClose={()=>setOpen(false)} title="Request Food">
        <form className="space-y-4" onSubmit={(e)=>{e.preventDefault(); alert('Submitted (demo)'); setOpen(false);}}>
          <input className="w-full px-4 py-2 border rounded-lg" placeholder="Your Name (Trusted Adult)" required/>
          <select className="w-full px-4 py-2 border rounded-lg" required>
            <option value="">Your Relationship</option>
            <option value="parent">Parent/Guardian</option>
            <option value="teacher">Teacher</option>
            <option value="counselor">School Counselor</option>
            <option value="social-worker">Social Worker</option>
            <option value="other">Other</option>
          </select>
          <select className="w-full px-4 py-2 border rounded-lg" required>
            <option value="">Number of Children</option>
            <option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option>
          </select>
          <select className="w-full px-4 py-2 border rounded-lg" required>
            <option value="">Preferred Meal Time</option>
            <option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option>
          </select>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="px-4 py-2 border rounded-lg" onClick={()=>setOpen(false)}>Cancel</button>
            <button type="submit" className="px-4 py-2 text-white brand-primary rounded-lg">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function Stat({label, value}){
  return (
    <div className="rounded-2xl p-4 border bg-white">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  )
}

function Feature({emoji, title, desc}){
  return (
    <div className="text-center p-6">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full brand-primary flex items-center justify-center">
        <span className="text-white text-2xl">{emoji}</span>
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{desc}</p>
    </div>
  )
}
