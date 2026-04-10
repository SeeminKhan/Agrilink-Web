import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Sprout, ShoppingBag, Briefcase, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RoleSelect() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const intent = params.get('intent');
  const { t } = useTranslation();

  const roles = [
    {
      id: 'farmer', icon: Sprout, title: t('roleSelect.farmer.title'), subtitle: t('roleSelect.farmer.subtitle'),
      description: t('roleSelect.farmer.description'),
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80',
      perks: ['List unlimited crops', 'AI price suggestions', 'Direct buyer connections', 'Free job training'],
      gradientFrom: '#0D592A', gradientTo: '#0a4721',
      borderColor: '#0D592A', bgColor: '#f0f7f3', badgeColor: '#0D592A', badgeBg: '#d6eade',
    },
    {
      id: 'buyer', icon: ShoppingBag, title: t('roleSelect.buyer.title'), subtitle: t('roleSelect.buyer.subtitle'),
      description: t('roleSelect.buyer.description'),
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
      perks: ['Browse 120K+ listings', 'Quality verification', 'Direct farmer contact', 'Price comparison'],
      gradientFrom: '#1d4ed8', gradientTo: '#1e40af',
      borderColor: '#1d4ed8', bgColor: '#eff6ff', badgeColor: '#1d4ed8', badgeBg: '#dbeafe',
    },
    {
      id: 'recruiter', icon: Briefcase, title: t('roleSelect.recruiter.title'), subtitle: t('roleSelect.recruiter.subtitle'),
      description: t('roleSelect.recruiter.description'),
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
      perks: ['Post unlimited jobs', 'Manage applicants', 'Hire verified farmers', 'Analytics dashboard'],
      gradientFrom: '#92400e', gradientTo: '#78350f',
      borderColor: '#d97706', bgColor: '#fffbeb', badgeColor: '#92400e', badgeBg: '#fde68a',
    },
  ];

  const handleContinue = () => {
    if (!selected) return;
    navigate(`/login?role=${selected}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f8faf8 0%, #f0f7f3 100%)' }}>
      <div className="text-center pt-16 pb-10 px-4 animate-fade-in">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0D592A' }}>
            <Sprout className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-xl" style={{ color: '#0D592A' }}>AgriLink</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">{t('roleSelect.title')}</h1>
        <p className="text-gray-500 max-w-md mx-auto">{t('roleSelect.subtitle')}</p>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          {roles.map(role => {
            const Icon = role.icon;
            const isSelected = selected === role.id || intent === role.id;
            return (
              <button key={role.id} onClick={() => setSelected(role.id)}
                className="relative text-left rounded-3xl overflow-hidden border-2 transition-all duration-300 card-hover"
                style={{ borderColor: isSelected ? role.borderColor : '#e5e7eb', transform: isSelected ? 'scale(1.02)' : '' }}>
                <div className="relative h-44 overflow-hidden">
                  <img src={role.image} alt={role.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${role.gradientFrom}cc, transparent)` }} />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg">{role.title}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-7 h-7 text-white" style={{ fill: '#0D592A' }} />
                    </div>
                  )}
                </div>

                <div className="p-5" style={{ backgroundColor: isSelected ? role.bgColor : 'white' }}>
                  <span className="text-xs font-semibold inline-block px-2 py-0.5 rounded-full mb-2"
                    style={{ backgroundColor: isSelected ? role.badgeBg : '#f3f4f6', color: isSelected ? role.badgeColor : '#6b7280' }}>
                    {role.subtitle}
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{role.description}</p>
                  <ul className="space-y-1.5">
                    {role.perks.map(p => (
                      <li key={p} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#0D592A' }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-100 px-4 py-4 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {selected ? `${t('roleSelect.selected')}: ${roles.find(r => r.id === selected)?.title}` : t('roleSelect.selectRole')}
          </p>
          <button onClick={handleContinue} disabled={!selected}
            className="flex items-center gap-2 font-bold px-8 py-3 rounded-2xl transition-all text-white"
            style={selected
              ? { backgroundColor: '#0D592A', boxShadow: '0 4px 16px -2px rgba(13,89,42,0.35)' }
              : { backgroundColor: '#e5e7eb', color: '#9ca3af', cursor: 'not-allowed' }}>
            {t('roleSelect.continue')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
