import { Sprout, Mail, Phone, MapPin, Globe, MessageCircle, Camera, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

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
            <p className="text-sm leading-relaxed text-gray-400 mb-5">{t('footer.desc')}</p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Camera, Video].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center transition hover:opacity-80"
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0D592A')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'Marketplace', 'About Us', 'How It Works', 'Blog', 'Contact'].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.categories')}</h4>
            <ul className="space-y-2 text-sm">
              {['Grains & Cereals', 'Vegetables', 'Fruits', 'Livestock', 'Dairy Products', 'Agri Equipment'].map(c => (
                <li key={c}><a href="#" className="hover:text-white transition">{c}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#4d9d78' }} /><span>Krishi Bhavan, Nashik, Maharashtra 422001</span></li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" style={{ color: '#4d9d78' }} /><span>+91 98765 43210</span></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" style={{ color: '#4d9d78' }} /><span>hello@agrilink.in</span></li>
            </ul>
            <div className="mt-5">
              <p className="text-sm mb-2 text-gray-400">{t('footer.newsletter')}</p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="flex-1 bg-gray-800 text-sm px-3 py-2 rounded-l-lg outline-none focus:ring-1 text-white" />
                <button className="px-3 py-2 rounded-r-lg text-sm text-white transition hover:opacity-90" style={{ backgroundColor: '#0D592A' }}>Go</button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-gray-300 transition">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
