import { ArrowRight, Play, TrendingUp, Users, ShoppingBag, ChevronDown, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, value: '50K+', label: t('hero.farmers') },
    { icon: ShoppingBag, value: '120K+', label: t('hero.products') },
    { icon: TrendingUp, value: '$2M+', label: t('hero.traded') },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1800&q=85" alt="Agricultural market" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
      </div>

      <div className="absolute top-28 right-6 lg:right-20 z-20 animate-float hidden sm:block">
        <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0D592A' }}>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/60 text-xs">{t('hero.todaysGrowth')}</p>
            <p className="text-white font-bold text-sm">+24% Sales</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-36 right-6 lg:right-28 z-20 animate-float hidden sm:block" style={{ animationDelay: '1.5s' }}>
        <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=60&q=80" alt="" className="w-9 h-9 rounded-xl object-cover" />
          <div>
            <p className="text-white/60 text-xs">{t('hero.newListing')}</p>
            <p className="text-white font-bold text-sm">Fresh Tomatoes</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 border text-xs font-semibold px-3 py-1.5 rounded-full mb-6 animate-fade-in"
            style={{ backgroundColor: 'rgba(13,89,42,0.2)', borderColor: 'rgba(13,89,42,0.4)', color: '#86efac' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#86efac' }} />
            {t('hero.badge')}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-5 animate-slide-up">
            {t('hero.title1')} <span className="text-gradient">{t('hero.title2')}</span><br />
            {t('hero.title3')} <span className="text-yellow-400">{t('hero.title4')}</span> {t('hero.title5')}
          </h1>

          <p className="text-white/75 text-lg mb-3 animate-slide-up font-medium" style={{ animationDelay: '0.1s' }}>
            {t('hero.subtitle')}
          </p>
          <p className="text-white/55 text-base mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            {t('hero.desc')}
          </p>

          <div className="flex flex-wrap gap-4 mb-14 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/role-select?intent=farmer"
              className="flex items-center gap-2 text-white font-bold px-7 py-3.5 rounded-2xl hover:opacity-90 hover:scale-105 transition-all shadow-lg"
              style={{ backgroundColor: '#0D592A', boxShadow: '0 8px 24px -4px rgba(13,89,42,0.5)' }}>
              <Sprout className="w-4 h-4" /> {t('hero.farmerPortal')} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/role-select?intent=buyer"
              className="flex items-center gap-2 bg-white font-bold px-7 py-3.5 rounded-2xl hover:bg-gray-50 hover:scale-105 transition-all shadow-lg"
              style={{ color: '#0D592A' }}>
              <ShoppingBag className="w-4 h-4" /> {t('hero.buyerPortal')} <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="flex items-center gap-2 glass text-white font-semibold px-5 py-3.5 rounded-2xl hover:bg-white/20 transition-all">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                <Play className="w-3 h-3 fill-current ml-0.5" style={{ color: '#0D592A' }} />
              </div>
              {t('hero.watchDemo')}
            </button>
          </div>

          <div className="flex flex-wrap gap-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5" style={{ color: '#86efac' }} />
                </div>
                <div>
                  <p className="text-white font-black text-xl leading-none">{value}</p>
                  <p className="text-white/50 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <ChevronDown className="w-6 h-6 text-white/40" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 15C480 30 240 60 0 30L0 60Z" fill="#f8faf8" />
        </svg>
      </div>
    </section>
  );
}
