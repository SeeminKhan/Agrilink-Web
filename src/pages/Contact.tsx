import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 py-16 px-4 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-3">{t('contact.title')}</h1>
        <p className="text-green-100">{t('contact.subtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.infoTitle')}</h2>
            <div className="space-y-5 mb-8">
              {[
                { icon: MapPin, label: t('contact.address'), value: '123 Farm Road, Nairobi, Kenya' },
                { icon: Phone, label: t('contact.phone'), value: '+254 700 000 000' },
                { icon: Mail, label: t('contact.email'), value: 'hello@agrilink.com' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{label}</p>
                    <p className="text-gray-700 font-semibold">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden h-56 shadow-md">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=700&q=80" alt="Map" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.formTitle')}</h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t('contact.firstName')}</label>
                  <input type="text" placeholder="John" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-400 transition" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t('contact.lastName')}</label>
                  <input type="text" placeholder="Doe" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-400 transition" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t('contact.email')}</label>
                <input type="email" placeholder="you@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-400 transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t('contact.subject')}</label>
                <input type="text" placeholder={t('contact.subjectPlaceholder')} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-400 transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t('contact.message')}</label>
                <textarea rows={4} placeholder={t('contact.messagePlaceholder')} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-400 transition resize-none" />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition">
                <Send className="w-4 h-4" /> {t('contact.send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
