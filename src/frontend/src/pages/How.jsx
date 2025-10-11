export default function How(){
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand mb-4">How NourishNet Works</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">Our simple 4-step process ensures children get the meals they need while maintaining privacy and transparency.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          ['1','Submit Request','Trusted adult shares time, location, dietary needs.'],
          ['2','Assign Donor & Providers','Funds matched; providers shortlisted automatically.'],
          ['3','Requester Chooses','Adult selects the best provider option.'],
          ['4','Prepare, Deliver, Verify','Provider uploads photo; requester confirms delivery.'],
        ].map(([n,title,desc])=> (
          <div key={n} className="rounded-2xl p-6 border bg-white text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full brand-primary flex items-center justify-center text-white font-bold">{n}</div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-slate-600">{desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Privacy First</h3>
            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
              <li>Anonymous child profiles</li>
              <li>Verified trusted adults only</li>
              <li>Secure data handling</li>
            </ul>
          </div>
          <div className="rounded-2xl p-8 brand-surface text-center">
            <div className="text-6xl mb-4">🔒</div>
            <p className="font-semibold">100% Anonymous</p>
            <p className="text-sm text-slate-600">Child privacy protected</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl p-8 brand-surface order-2 md:order-1 text-center">
            <div className="text-6xl mb-4">📱</div>
            <p className="font-semibold">Real-time Tracking</p>
            <p className="text-sm text-slate-600">Follow your donation's impact</p>
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-2xl font-bold mb-4">Complete Transparency</h3>
            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
              <li>Photo verification</li>
              <li>Real-time status updates</li>
              <li>Impact reporting</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
