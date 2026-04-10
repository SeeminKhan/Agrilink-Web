import { UserPlus, Store, ShoppingCart, PackageCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { icon: UserPlus, step: '01', title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc'), bg: '#0D592A' },
    { icon: Store, step: '02', title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc'), bg: '#a16207' },
    { icon: ShoppingCart, step: '03', title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc'), bg: '#1d4ed8' },
    { icon: PackageCheck, step: '04', title: t('howItWorks.step4Title'), desc: t('howItWorks.step4Desc'), bg: '#7c3aed' },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="font-semibold text-sm uppercase tracking-widest" style={{ color: '#0D592A' }}>{t('howItWorks.badge')}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            {t('howItWorks.title')} <span style={{ color: '#0D592A' }}>{t('howItWorks.titleHighlight')}</span> {t('howItWorks.titleEnd')}
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">{t('howItWorks.subtitle')}</p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ icon: Icon, step, title, desc, bg }) => (
              <div key={step} className="flex flex-col items-center text-center group">
                <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform" style={{ backgroundColor: bg }}>
                  <Icon className="w-7 h-7 text-white" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-200 rounded-full text-xs font-bold text-gray-700 flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-14">
          <a href="/signup" className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl transition shadow-lg"
            style={{ backgroundColor: '#0D592A', boxShadow: '0 4px 16px -2px rgba(13,89,42,0.35)' }}>
            {t('howItWorks.startTrading')}
          </a>
        </div>
      </div>
    </section>
  );
}
