import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Sprout, Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Users, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth, type Role } from '../lib/AuthContext';

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [params] = useSearchParams();
  const role = (params.get('role') || 'farmer') as Role;
  const isFarmer = role === 'farmer';
  const isRecruiter = role === 'recruiter';

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError(t('auth.fillAllFields')); return; }
    setLoading(true);
    setError('');
    const result = await login(email, password, role);
    setLoading(false);
    if (result.ok) {
      navigate(role === 'farmer' ? '/farmer/dashboard' : role === 'recruiter' ? '/recruiter/dashboard' : '/buyer/dashboard');
    } else {
      setError(result.error || t('auth.invalidCredentials'));
    }
  };

  const quickLogin = async (demoEmail: string, demoRole: Role) => {
    await login(demoEmail, 'password', demoRole);
    navigate(demoRole === 'farmer' ? '/farmer/dashboard' : demoRole === 'recruiter' ? '/recruiter/dashboard' : '/buyer/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={isFarmer
            ? 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&q=85'
            : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=85'}
          alt="AgriLink"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-emerald-800/60" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-black text-xl">AgriLink</span>
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              {isFarmer
                ? <><Sprout className="w-3.5 h-3.5" /> Farmer Portal</>
                : isRecruiter
                ? <><Users className="w-3.5 h-3.5" /> Recruiter Portal</>
                : <><ShoppingBag className="w-3.5 h-3.5" /> Buyer Portal</>}
            </div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              {isFarmer ? 'Welcome back,\nFarmer.' : isRecruiter ? 'Welcome back,\nRecruiter.' : 'Welcome back,\nBuyer.'}
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              {isFarmer
                ? 'Manage your listings, track sales, and connect with buyers across India.'
                : isRecruiter
                ? 'Post jobs, manage applicants, and hire skilled agricultural workers.'
                : 'Browse fresh produce, verify quality, and connect directly with farmers.'}
            </p>
            <div className="mt-8 glass rounded-2xl p-4">
              <p className="text-white/80 text-sm italic mb-3">
                "AgriLink helped me triple my income by selling directly to buyers in Mumbai."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80" alt="" className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className="text-white text-xs font-bold">Ramesh Patil</p>
                  <p className="text-white/50 text-xs">Farmer, Nashik</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0D592A' }}>
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-xl" style={{ color: '#0D592A' }}>AgriLink</span>
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-900 mb-1">{t('auth.signIn')}</h1>
            <p className="text-gray-500 text-sm">
              {t('auth.noAccount')}{' '}
              <Link to={`/signup?role=${role}`} className="text-green-600 font-semibold hover:underline">
                {t('auth.createFree')}
              </Link>
            </p>
          </div>

          {/* Demo quick-access */}
          <div className="border rounded-2xl p-4 mb-6" style={{ backgroundColor: '#f0f7f3', borderColor: '#aed4bc' }}>
            <p className="text-xs font-bold mb-2" style={{ color: '#0D592A' }}>{t('auth.quickDemo')}</p>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => quickLogin('farmer@demo.com', 'farmer')}
                className="flex-1 py-2 text-white text-xs font-bold rounded-xl hover:opacity-90 transition"
                style={{ backgroundColor: '#0D592A' }}>
                {t('auth.enterAsFarmer')}
              </button>
              <button onClick={() => quickLogin('buyer@demo.com', 'buyer')}
                className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition">
                {t('auth.enterAsBuyer')}
              </button>
              <button onClick={() => quickLogin('recruiter@demo.com', 'recruiter')}
                className="flex-1 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 transition">
                {t('auth.enterAsRecruiter')}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all shadow-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={show ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all shadow-sm" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm text-green-600 hover:underline font-medium">{t('auth.forgotPassword')}</a>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-lg disabled:opacity-60"
              style={{ backgroundColor: '#0D592A', boxShadow: '0 4px 16px -2px rgba(13,89,42,0.35)' }}>
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('auth.signingIn')}</>
                : <>{t('auth.signIn')} <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            {isFarmer ? t('roles.farmer') : isRecruiter ? t('roles.recruiter') : t('roles.buyer')}?{' '}
            <Link to="/role-select" className="text-green-600 hover:underline font-medium">
              {t('auth.switchRole')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
