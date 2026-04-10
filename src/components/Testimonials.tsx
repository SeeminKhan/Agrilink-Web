import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const testimonials = [
  {
    name: 'Amara Diallo', role: 'Smallholder Farmer', location: 'Senegal',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80',
    text: 'AgriLink changed my life. I used to sell through middlemen and barely made a profit. Now I sell directly to buyers in the city and earn 3x more.',
    rating: 5,
  },
  {
    name: 'Kwame Asante', role: 'Restaurant Owner', location: 'Ghana',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    text: 'I source all my vegetables through AgriLink. The quality is consistently excellent and the prices are fair. Delivery is always on time.',
    rating: 5,
  },
  {
    name: 'Fatima Nkosi', role: 'Agri-Business Owner', location: 'South Africa',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
    text: 'The market insights feature alone is worth it. I can see price trends and plan my harvests accordingly. My revenue has grown 40% this year.',
    rating: 5,
  },
];

export default function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #f0f7f3 0%, #e8f5ee 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="font-semibold text-sm uppercase tracking-widest" style={{ color: '#0D592A' }}>{t('testimonials.badge')}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            {t('testimonials.title')} <span style={{ color: '#0D592A' }}>{t('testimonials.titleHighlight')}</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">{t('testimonials.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(item => (
            <div key={item.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow relative">
              <Quote className="absolute top-4 right-4 w-8 h-8" style={{ color: '#d6eade' }} />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">"{item.text}"</p>
              <div className="flex items-center gap-3">
                <img src={item.avatar} alt={item.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.role} · {item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
