import { ShieldCheck, Truck, BarChart3, Smartphone, Headphones, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    { icon: Leaf, title: t('features.fresh'), desc: t('features.freshDesc'), bg: '#f0f7f3', color: '#0D592A' },
    { icon: ShieldCheck, title: t('features.secure'), desc: t('features.secureDesc'), bg: '#eff6ff', color: '#1d4ed8' },
    { icon: Truck, title: t('features.delivery'), desc: t('features.deliveryDesc'), bg: '#fff7ed', color: '#c2410c' },
    { icon: BarChart3, title: t('features.insights'), desc: t('features.insightsDesc'), bg: '#faf5ff', color: '#7c3aed' },
    { icon: Smartphone, title: t('features.mobile'), desc: t('features.mobileDesc'), bg: '#fefce8', color: '#a16207' },
    { icon: Headphones, title: t('features.support'), desc: t('features.supportDesc'), bg: '#fff1f2', color: '#be123c' },
  ];

  return (
    <section id="why-agrilink" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="font-semibold text-sm uppercase tracking-widest" style={{ color: '#0D592A' }}>{t('features.badge')}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            {t('features.title')} <span style={{ color: '#0D592A' }}>{t('features.titleHighlight')}</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">{t('features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc, bg, color }) => (
            <div key={title} className="group p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: bg }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
