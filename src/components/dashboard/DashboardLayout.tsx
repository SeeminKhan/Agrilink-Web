import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../lib/AuthContext';

interface DashboardLayoutProps {
  role: 'farmer' | 'buyer' | 'recruiter';
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // If no user, redirect to login
  if (!user) {
    navigate(`/login?role=${role}`);
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar role={role} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex">
            <Sidebar role={role} />
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center gap-4 shadow-sm">
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-gray-500 hover:text-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition" />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/${role}/settings`)}>
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-xl object-cover" />
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-gray-800 leading-none">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
