import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sprout, LayoutDashboard, LogOut, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/AuthContext';
import { setLanguage, LANG_OPTIONS, type SupportedLang } from '../lib/i18n';

const navLinks = [
  { labelKey: 'nav.home',        sectionId: '' },
  { labelKey: 'nav.whyAgrilink', sectionId: 'why-agrilink' },
  { labelKey: 'nav.howItWorks',  sectionId: 'how-it-works' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const currentLang = LANG_OPTIONS.find(l => l.code === i18n.language) || LANG_OPTIONS[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setOpen(false);
    if (!sectionId) { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 150);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleNavClick('')} className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#0D592A' }}>
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${scrolled ? '' : 'text-white'}`} style={scrolled ? { color: '#0D592A' } : {}}>AgriLink</span>
          </button>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <button key={link.labelKey}
                onClick={() => handleNavClick(link.sectionId)}
                className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/80 hover:text-white'}`}>
                {t(link.labelKey)}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setLangOpen(o => !o)}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition ${scrolled ? 'hover:bg-gray-100 text-gray-600' : 'text-white/80 hover:bg-white/10'}`}>
                <Globe className="w-4 h-4" />
                <span>{currentLang.code.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50 min-w-[140px]">
                  {LANG_OPTIONS.map(l => (
                    <button key={l.code} onClick={() => { setLanguage(l.code as SupportedLang); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition ${i18n.language === l.code ? 'font-bold text-green-700' : 'text-gray-700'}`}>
                      {l.native}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {user ? (
              <>
                <Link to={`/${user.role}/dashboard`}
                  className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition ${scrolled ? 'hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                  style={scrolled ? { color: '#0D592A' } : {}}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
                  <button onClick={handleLogout} className="flex items-center gap-1 text-sm font-medium px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`text-sm font-medium px-4 py-2 rounded-lg transition ${scrolled ? 'hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                  style={scrolled ? { color: '#0D592A' } : {}}>
                  Login
                </Link>
                <Link to="/login" className="text-sm font-medium px-4 py-2 text-white rounded-lg hover:opacity-90 transition" style={{ backgroundColor: '#0D592A' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className={`md:hidden ${scrolled ? 'text-gray-700' : 'text-white'}`}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white shadow-lg px-4 pb-4 pt-2">
          {navLinks.map(link => (
            <button key={link.labelKey}
              onClick={() => handleNavClick(link.sectionId)}
              className="block w-full text-left py-2 text-gray-700 font-medium text-sm hover:opacity-80 transition">
              {t(link.labelKey)}
            </button>
          ))}
          <div className="flex gap-3 mt-3">
            {user ? (
              <>
                <Link to={`/${user.role}/dashboard`} onClick={() => setOpen(false)}
                  className="flex-1 text-center py-2 border rounded-lg text-sm font-medium" style={{ borderColor: '#0D592A', color: '#0D592A' }}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="flex-1 text-center py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}
                  className="flex-1 text-center py-2 border rounded-lg text-sm font-medium" style={{ borderColor: '#0D592A', color: '#0D592A' }}>
                  Login
                </Link>
                <Link to="/login" onClick={() => setOpen(false)}
                  className="flex-1 text-center py-2 text-white rounded-lg text-sm font-medium" style={{ backgroundColor: '#0D592A' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
