import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, X, Sprout, TrendingUp, Package, Users, Briefcase, ShieldCheck, BarChart2 } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../lib/AuthContext';

interface DashboardLayoutProps {
  role: 'farmer' | 'buyer' | 'recruiter';
}

interface Notification {
  id: number;
  icon: React.ElementType;
  color: string;
  bg: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: Record<string, Notification[]> = {
  farmer: [
    { id: 1, icon: TrendingUp,  color: 'text-green-600',  bg: 'bg-green-50',  title: 'Price Alert',          desc: 'Tomato prices up 12% in Nashik mandi today.',           time: '2m ago',  unread: true  },
    { id: 2, icon: Users,       color: 'text-blue-600',   bg: 'bg-blue-50',   title: 'New Buyer Match',      desc: 'Pune Fresh Mart is interested in your onion listing.',   time: '1h ago',  unread: true  },
    { id: 3, icon: Package,     color: 'text-purple-600', bg: 'bg-purple-50', title: 'Listing Viewed',       desc: 'Your Organic Tomatoes listing got 24 new views.',        time: '3h ago',  unread: false },
    { id: 4, icon: Sprout,      color: 'text-emerald-600',bg: 'bg-emerald-50',title: 'Demand Forecast Ready', desc: 'Wheat demand forecast for next 7 days is now available.',     time: '5h ago',  unread: false },
    { id: 5, icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50', title: 'QR Verified',          desc: 'Batch AGRL-2025-TOM-001 was verified by a buyer.',       time: '1d ago',  unread: false },
  ],
  buyer: [
    { id: 1, icon: Package,     color: 'text-blue-600',   bg: 'bg-blue-50',   title: 'Order Update',         desc: 'Your order ORD-2024-002 is now In Transit.',             time: '5m ago',  unread: true  },
    { id: 2, icon: ShieldCheck, color: 'text-green-600',  bg: 'bg-green-50',  title: 'Quality Verified',     desc: 'Batch AGRL-2025-ONI-003 passed quality check.',          time: '30m ago', unread: true  },
    { id: 3, icon: TrendingUp,  color: 'text-purple-600', bg: 'bg-purple-50', title: 'Price Drop',           desc: 'Onion prices dropped 8% — good time to buy.',           time: '2h ago',  unread: false },
    { id: 4, icon: Users,       color: 'text-orange-600', bg: 'bg-orange-50', title: 'Farmer Match Found',   desc: '3 new farmers match your Tomato requirement.',           time: '4h ago',  unread: false },
    { id: 5, icon: Package,     color: 'text-emerald-600',bg: 'bg-emerald-50',title: 'Order Delivered',      desc: 'ORD-2024-001 was delivered successfully.',               time: '1d ago',  unread: false },
  ],
  recruiter: [
    { id: 1, icon: Users,       color: 'text-amber-600',  bg: 'bg-amber-50',  title: 'New Application',      desc: 'Vijay Shinde applied for Harvest Worker.',               time: '10m ago', unread: true  },
    { id: 2, icon: Briefcase,   color: 'text-green-600',  bg: 'bg-green-50',  title: 'Job Views Spike',      desc: 'Farm Supervisor post got 42 views today.',               time: '1h ago',  unread: true  },
    { id: 3, icon: Users,       color: 'text-blue-600',   bg: 'bg-blue-50',   title: 'Application Accepted', desc: 'Sunita Deshmukh accepted your offer.',                   time: '3h ago',  unread: false },
    { id: 4, icon: BarChart2,   color: 'text-purple-600', bg: 'bg-purple-50', title: 'Analytics Ready',      desc: 'Your weekly hiring report is ready to view.',            time: '6h ago',  unread: false },
    { id: 5, icon: Briefcase,   color: 'text-orange-600', bg: 'bg-orange-50', title: 'Job Expiring Soon',    desc: 'Irrigation Technician post expires in 2 days.',          time: '1d ago',  unread: false },
  ],
};

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate(`/login?role=${role}`);
    return null;
  }

  const notifications = NOTIFICATIONS[role] || [];
  const unreadCount = notifications.filter(n => n.unread).length;

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
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="relative w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition">
                <Bell className="w-4 h-4 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-black flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <p className="font-bold text-gray-800 text-sm">Notifications</p>
                      <span className="text-xs text-gray-400">{unreadCount} unread</span>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                      {notifications.map(n => {
                        const Icon = n.icon;
                        return (
                          <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer ${n.unread ? 'bg-blue-50/30' : ''}`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${n.bg}`}>
                              <Icon className={`w-4 h-4 ${n.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-bold text-gray-800">{n.title}</p>
                                <span className="text-xs text-gray-400 shrink-0">{n.time}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.desc}</p>
                            </div>
                            {n.unread && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-4 py-2.5 border-t border-gray-100">
                      <button className="text-xs font-semibold w-full text-center" style={{ color: '#0D592A' }}>
                        Mark all as read
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

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
