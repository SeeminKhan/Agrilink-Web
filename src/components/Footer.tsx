import { Sprout, Mail, Phone, MapPin, Globe, MessageCircle, Camera, Video } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#0D592A' }}>
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">AgriLink</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">
              Connecting farmers, buyers, and agri-businesses across Africa for a sustainable food future.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Camera, Video].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center transition hover:opacity-80"
                  style={{ ':hover': { backgroundColor: '#0D592A' } } as React.CSSProperties}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0D592A')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'Marketplace', 'About Us', 'How It Works', 'Blog', 'Contact'].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {['Grains & Cereals', 'Vegetables', 'Fruits', 'Livestock', 'Dairy Products', 'Agri Equipment'].map(c => (
                <li key={c}><a href="#" className="hover:text-white transition">{c}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#4d9d78' }} /><span>123 Farm Road, Nairobi, Kenya</span></li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" style={{ color: '#4d9d78' }} /><span>+254 700 000 000</span></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" style={{ color: '#4d9d78' }} /><span>hello@agrilink.com</span></li>
            </ul>
            <div className="mt-5">
              <p className="text-sm mb-2 text-gray-400">Subscribe to our newsletter</p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="flex-1 bg-gray-800 text-sm px-3 py-2 rounded-l-lg outline-none focus:ring-1 text-white" style={{ '--tw-ring-color': '#0D592A' } as React.CSSProperties} />
                <button className="px-3 py-2 rounded-r-lg text-sm text-white transition hover:opacity-90" style={{ backgroundColor: '#0D592A' }}>Go</button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© 2024 AgriLink Technologies. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
