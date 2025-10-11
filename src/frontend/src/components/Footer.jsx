export default function Footer(){
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg brand-primary"></div>
              <span className="font-bold text-lg">NourishNet</span>
            </div>
            <p className="text-gray-400 text-sm">Connecting communities to nourish children with transparency, dignity, and care.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/how" className="hover:text-white">How It Works</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Get Involved</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/contact" className="hover:text-white">Donate</a></li>
              <li><a href="/contact" className="hover:text-white">Become a Provider</a></li>
              <li><a href="/contact" className="hover:text-white">Volunteer</a></li>
              <li><a href="/contact" className="hover:text-white">Partner with Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/contact" className="hover:text-white">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/contact" className="hover:text-white">Terms of Service</a></li>
              <li><a href="/contact" className="hover:text-white">Safety</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 NourishNet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
