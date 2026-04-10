import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Sprout, Eye, EyeOff, User, Mail, Lock, Phone, MapPin, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth, type Role } from '../lib/AuthContext';

export default function Signup() {
  const [show, setShow] = useState(false);
  const [params] = useSearchParams();
  const [role, setRole] = useState<Role>(params.get('role') === 'buyer' ? 'buyer' : params.get('role') === 'recruiter' ? 'recruiter' : 'farmer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !password) { setError('Please fill in required fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    const result = await signup(
      `${firstName} ${lastName}`.trim(),
      email,
      password,
      role,
      { phone, location }
    );
    setLoading(false);
    if (result.ok) {
      navigate(role === 'farmer' ? '/farmer/dashboard' : role === 'recruiter' ? '/recruiter/dashboard' : '/buyer/dashboard');
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  const inputClass = 'w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all shadow-sm';

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=900&q=85" alt="Farm" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/85 to-emerald-700/60" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-black text-xl">AgriLink</span>
          </Link>
          <div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">Join 50,000+<br />Farmers & Buyers</h2>
            <p className="text-white/70 mb-8">Create your free account and start trading agricultural products directly today.</p>
            <div className="space-y-3">
              {['Free to join, no hidden fees', 'Verified & trusted community', 'AI-powered price insights', 'Offline-friendly mobile app'].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-white/80 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0D592A' }}>
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-xl" style={{ color: '#0D592A' }}>AgriLink</span>
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-900 mb-1">{t('auth.createAccount')}</h1>
            <p className="text-gray-500 text-sm">
              {t('auth.alreadyAccount')}{' '}
              <Link to="/login" className="text-green-600 font-semibold hover:underline">{t('auth.signIn')}</Link>
            </p>
          </div>

          {/* Role toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl mb-6">
            {(['farmer', 'buyer', 'recruiter'] as Role[]).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${role === r ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                style={role === r ? { color: '#0D592A' } : {}}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t('auth.firstName')} *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t('auth.lastName')}</label>
                <input type="text" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-400 transition-all shadow-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t('auth.email')} *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t('auth.phone')}</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" placeholder="+254 700 000 000" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t('auth.location')}</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="City, Country" value={location} onChange={e => setLocation(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t('auth.password')} *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={show ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-400 transition-all shadow-sm" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" id="terms" className="mt-0.5 accent-green-600 w-4 h-4" />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                I agree to the <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-lg disabled:opacity-60"
              style={{ backgroundColor: '#0D592A', boxShadow: '0 4px 16px -2px rgba(13,89,42,0.35)' }}>
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('auth.creatingAccount')}</>
                : <>{t('auth.createAccount')} <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
