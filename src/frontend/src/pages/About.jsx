export default function About(){
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand mb-4">About NourishNet</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">We're on a mission to ensure no child goes hungry by connecting communities through technology and compassion.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-slate-600 mb-4">NourishNet was founded on the belief that every child deserves access to nutritious meals.</p>
          <p className="text-slate-600">Our platform ensures privacy for children while providing complete transparency for donors.</p>
        </div>
        <div className="rounded-3xl p-8 brand-surface text-center">
          <div className="text-8xl mb-4">🌟</div>
          <h3 className="text-2xl font-bold mb-2">Our Vision</h3>
          <p className="text-slate-600">A world where no child experiences hunger</p>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          ['🤝','Trust','Building trust through transparency and accountability.'],
          ['🛡️','Privacy','Protecting children\'s dignity and privacy.'],
          ['💪','Community','Connecting neighbors and fostering mutual support.'],
        ].map(([emoji,title,desc])=> (
          <div key={title} className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full brand-primary flex items-center justify-center">
              <span className="text-white text-2xl">{emoji}</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-slate-600 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
