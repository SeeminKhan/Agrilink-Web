import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sprout, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Features', to: '/features' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#0D592A' }}>
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${scrolled ? '' : 'text-white'}`} style={scrolled ? { color: '#0D592A' } : {}}>AgriLink</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.label} to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? scrolled ? '' : 'text-green-300'
                    : scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/80 hover:text-white'
                }`}
                style={location.pathname === link.to && scrolled ? { color: '#0D592A' } : {}}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
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
                <Link to="/role-select" className="text-sm font-medium px-4 py-2 text-white rounded-lg hover:opacity-90 transition" style={{ backgroundColor: '#0D592A' }}>
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
            <Link key={link.label} to={link.to} onClick={() => setOpen(false)}
              className="block py-2 text-gray-700 font-medium text-sm hover:opacity-80 transition"
              style={location.pathname === link.to ? { color: '#0D592A' } : {}}>
              {link.label}
            </Link>
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
                <Link to="/role-select" onClick={() => setOpen(false)}
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
