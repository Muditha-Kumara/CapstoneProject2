import { useState } from 'react'
import { api } from '../lib/api'

export default function Contact(){
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    const form = new FormData(e.target)
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      subject: form.get('subject'),
      message: form.get('message'),
    }
    try{
      await api.contact(payload)
      setMsg({type:'ok', text:"Message sent! We'll be in touch."})
      e.target.reset()
    }catch(err){
      setMsg({type:'err', text: err.message})
    }finally{ setLoading(false) }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-4xl font-bold text-brand mb-4">Contact Us</h1>
        <p className="text-slate-600 mb-8">Have questions? Need support? Want to partner with us? We'd love to hear from you.</p>
        <form className="space-y-6" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input name="name" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input name="email" type="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select name="subject" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>General Inquiry</option>
              <option>Partnership Opportunity</option>
              <option>Technical Support</option>
              <option>Donation Question</option>
              <option>Provider Application</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea name="message" rows="5" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea>
          </div>
          <button disabled={loading} type="submit" className="w-full px-6 py-3 brand-primary text-white rounded-lg hover:opacity-90">
            {loading? 'Sending…' : 'Send Message'}
          </button>
          {msg && (
            <p className={msg.type==='ok' ? 'text-green-700' : 'text-red-600'}>{msg.text}</p>
          )}
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Get in touch</h2>
        <div className="space-y-6">
          <Item icon="📧" title="Email" lines={["hello@nourishnet.org","support@nourishnet.org"]} />
          <Item icon="📞" title="Phone" lines={["1-800-NOURISH","Mon–Fri 9–18"]} />
          <Item icon="📍" title="Address" lines={["123 Community Street","Hope City, HC 12345"]} />
        </div>
      </div>
    </section>
  )
}

function Item({icon,title,lines}){
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 brand-primary rounded-lg flex items-center justify-center">
        <span className="text-white text-xl">{icon}</span>
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        {lines.map((l)=> <p key={l} className="text-slate-600">{l}</p>)}
      </div>
    </div>
  )
}
