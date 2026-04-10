import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sprout, LayoutDashboard, List, PlusCircle, Sparkles, BookOpen,
  Settings, LogOut, ChevronLeft, ChevronRight,
  Search, ShieldCheck, Package, Briefcase, Users, BarChart2, ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

interface NavItem { icon: React.ElementType; label: string; to: string; }

const farmerNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/farmer/dashboard' },
  { icon: List, label: 'My Listings', to: '/farmer/listings' },
  { icon: PlusCircle, label: 'Add Listing', to: '/farmer/add-listing' },
  { icon: Sparkles, label: 'AI Price', to: '/farmer/ai-price' },
  { icon: BookOpen, label: 'Jobs & Training', to: '/farmer/training' },
  { icon: Settings, label: 'Settings', to: '/farmer/settings' },
];

const buyerNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/buyer/dashboard' },
  { icon: Search, label: 'Browse Listings', to: '/buyer/browse' },
  { icon: ShieldCheck, label: 'Quality Check', to: '/buyer/quality' },
  { icon: Package, label: 'My Orders', to: '/buyer/orders' },
  { icon: Settings, label: 'Settings', to: '/buyer/settings' },
];

const recruiterNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/recruiter/dashboard' },
  { icon: PlusCircle, label: 'Post Job', to: '/recruiter/post-job' },
  { icon: ClipboardList, label: 'My Listings', to: '/recruiter/listings' },
  { icon: Users, label: 'Applicants', to: '/recruiter/applicants' },
  { icon: BarChart2, label: 'Analytics', to: '/recruiter/analytics' },
  { icon: Settings, label: 'Settings', to: '/recruiter/settings' },
];

export default function Sidebar({ role }: { role: 'farmer' | 'buyer' | 'recruiter' }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const nav = role === 'farmer' ? farmerNav : role === 'recruiter' ? recruiterNav : buyerNav;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className={`relative flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} min-h-screen`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#0D592A' }}>
          <Sprout className="w-4 h-4 text-white" />
        </div>
        {!collapsed && <span className="font-black text-lg" style={{ color: '#0D592A' }}>AgriLink</span>}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-gray-100">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={role === 'farmer'
              ? { backgroundColor: '#f0f7f3', color: '#0D592A' }
              : role === 'recruiter'
              ? { backgroundColor: '#fffbeb', color: '#92400e' }
              : { backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
            {role === 'farmer' ? 'Farmer' : role === 'recruiter' ? 'Recruiter' : 'Buyer'}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ icon: Icon, label, to }) => {
          const active = location.pathname === to;
          return (
            <Link key={label} to={to} title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${collapsed ? 'justify-center' : ''}`}
              style={active ? { backgroundColor: '#f0f7f3', color: '#0D592A' } : {}}>
              <Icon className="w-5 h-5 shrink-0" style={active ? { color: '#0D592A' } : { color: '#9ca3af' }} />
              {!collapsed && (
                <span className="text-sm font-semibold" style={active ? { color: '#0D592A' } : { color: '#6b7280' }}>{label}</span>
              )}
              {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0D592A' }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-gray-100">
        <button onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}>
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition z-10">
        {collapsed ? <ChevronRight className="w-3 h-3 text-gray-500" /> : <ChevronLeft className="w-3 h-3 text-gray-500" />}
      </button>
    </aside>
  );
}
