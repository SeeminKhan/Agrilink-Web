import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, ShoppingBag, Briefcase, ArrowRight, Sparkles, Users, BarChart2, ShieldCheck, TrendingUp, Package } from 'lucide-react';

export default function RolesSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const roles = [
    {
      icon: Sprout,
      title: t('roles.farmer'),
      subtitle: t('rolesSection.farmerSubtitle'),
      color: '#0D592A',
      bg: '#f0f7f3',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
      features: [
        { icon: Sparkles, text: t('rolesSection.farmerF1') },
        { icon: TrendingUp, text: t('rolesSection.farmerF2') },
        { icon: Users, text: t('rolesSection.farmerF3') },
        { icon: Package, text: t('rolesSection.farmerF4') },
      ],
      cta: t('rolesSection.farmerCta'),
      route: '/login?role=farmer',
    },
    {
      icon: ShoppingBag,
      title: t('roles.buyer'),
      subtitle: t('rolesSection.buyerSubtitle'),
      color: '#1d4ed8',
      bg: '#eff6ff',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
      features: [
        { icon: ShieldCheck, text: t('rolesSection.buyerF1') },
        { icon: Users, text: t('rolesSection.buyerF2') },
        { icon: Package, text: t('rolesSection.buyerF3') },
        { icon: BarChart2, text: t('rolesSection.buyerF4') },
      ],
      cta: t('rolesSection.buyerCta'),
      route: '/login?role=buyer',
    },
    {
      icon: Briefcase,
      title: t('roles.recruiter'),
      subtitle: t('rolesSection.recruiterSubtitle'),
      color: '#d97706',
      bg: '#fffbeb',
      image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=600&q=80',
      features: [
        { icon: Briefcase, text: t('rolesSection.recruiterF1') },
        { icon: Users, text: t('rolesSection.recruiterF2') },
        { icon: BarChart2, text: t('rolesSection.recruiterF3') },
        { icon: ShieldCheck, text: t('rolesSection.recruiterF4') },
      ],
      cta: t('rolesSection.recruiterCta'),
      route: '/login?role=recruiter',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="font-semibold text-sm uppercase tracking-widest" style={{ color: '#0D592A' }}>{t('rolesSection.badge')}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            {t('rolesSection.title')} <span style={{ color: '#0D592A' }}>{t('rolesSection.titleHighlight')}</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">{t('rolesSection.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map(({ icon: Icon, title, subtitle, color, bg, image, features, cta, route }) => (
            <div key={title} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="relative h-40 overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${color}99, ${color}dd)` }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-black text-xl">{title}</p>
                  <p className="text-white/80 text-sm">{subtitle}</p>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {features.map(({ icon: FIcon, text }) => (
                    <li key={text} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                        <FIcon className="w-3.5 h-3.5" style={{ color }} />
                      </div>
                      <span className="text-sm text-gray-600">{text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate(route)}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
                  style={{ backgroundColor: color }}>
                  {cta} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
