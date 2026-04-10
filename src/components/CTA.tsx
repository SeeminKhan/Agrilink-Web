import { ArrowRight, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D592A 0%, #0a4721 100%)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-8 sm:px-12 py-14">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Sprout className="w-5 h-5 text-green-300" />
                <span className="text-green-200 font-semibold text-sm uppercase tracking-widest">{t('cta.badge')}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                {t('cta.title')}
              </h2>
              <p className="text-green-100 max-w-lg">{t('cta.subtitle')}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link to="/signup" className="flex items-center justify-center gap-2 bg-white font-bold px-7 py-3.5 rounded-xl hover:bg-gray-50 transition shadow-lg"
                style={{ color: '#0D592A' }}>
                {t('cta.getStarted')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/marketplace" className="flex items-center justify-center gap-2 border-2 border-white/40 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition">
                {t('cta.browseMarketplace')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
