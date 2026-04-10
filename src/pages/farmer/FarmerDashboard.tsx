import { useState, useEffect } from 'react';
import { TrendingUp, Package, Clock, DollarSign, ArrowUpRight, ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../lib/AuthContext';
import { farmerListingsStore } from '../../lib/farmerListingsStore';

const sparkData = [40, 65, 50, 80, 70, 90, 85, 95, 88, 100, 92, 110];

const statusColor: Record<string, string> = {
  Active:  'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Sold:    'bg-gray-100 text-gray-500',
};

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const firstName = user?.name.split(' ')[0] || 'Farmer';
  const [listings, setListings] = useState(farmerListingsStore.getAll());

  useEffect(() => farmerListingsStore.subscribe(() => setListings(farmerListingsStore.getAll())), []);

  const active   = listings.filter(l => l.status === 'Active').length;
  const pending  = listings.filter(l => l.status === 'Pending').length;
  const earnings = listings.filter(l => l.status === 'Sold').reduce((s, l) => s + l.price * Number(l.qty), 0);

  const stats = [
    { label: t('farmerDashboard.totalListings'), value: String(listings.length), change: `${active} ${t('farmerDashboard.active')}`,       icon: Package,   color: 'bg-green-50 text-green-600',   trend: 'up',                          to: '/farmer/listings' },
    { label: t('farmerDashboard.activeCrops'),   value: String(active),          change: `${pending} ${t('farmerDashboard.pending')}`,      icon: Leaf,      color: 'bg-emerald-50 text-emerald-600', trend: 'neutral',                    to: '/farmer/listings' },
    { label: t('farmerDashboard.pendingSales'),  value: String(pending),         change: t('farmerDashboard.awaitingBuyers'),               icon: Clock,     color: 'bg-yellow-50 text-yellow-600',  trend: pending > 0 ? 'up' : 'neutral', to: '/farmer/listings' },
    { label: t('farmerDashboard.totalEarnings'), value: `₹${earnings.toFixed(0)}`, change: t('farmerDashboard.fromSold'),                  icon: DollarSign, color: 'bg-blue-50 text-blue-600',     trend: 'up',                          to: '/farmer/listings' },
  ];

  const recent = listings.slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{t('farmerDashboard.greeting', { name: firstName })}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{t('farmerDashboard.subtitle')}</p>
        </div>
        <Link to="/farmer/add-listing"
          className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-2xl hover:opacity-90 transition shadow-lg text-sm w-fit"
          style={{ backgroundColor: '#0D592A', boxShadow: '0 4px 16px -2px rgba(13,89,42,0.3)' }}>
          {t('farmerDashboard.addListing')}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, color, trend, to }) => (
          <Link key={label} to={to} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover block">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            <p className={`text-xs mt-1 font-medium ${trend === 'up' ? 'text-green-600' : 'text-gray-400'}`}>{change}</p>
          </Link>
        ))}
      </div>

      {/* Chart + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800">{t('farmerDashboard.marketTrends')}</h3>
              <p className="text-xs text-gray-400">{t('farmerDashboard.priceIndex')}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#f0f7f3', color: '#0D592A' }}>
              <TrendingUp className="w-3.5 h-3.5" /> +12.4%
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-24">
            {sparkData.map((h, i) => (
              <div key={i} className="flex-1">
                <div className="w-full rounded-t-md"
                  style={{ height: `${(h / 110) * 100}%`, backgroundColor: i === sparkData.length - 1 ? '#0D592A' : '#aed4bc' }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'].map(w => (
              <span key={w} className="text-xs text-gray-300 flex-1 text-center">{w}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">{t('farmerDashboard.quickActions')}</h3>
          <div className="space-y-3">
            {[
              { label: t('farmerDashboard.addNewListing'), to: '/farmer/add-listing',     bg: '#f0f7f3', color: '#0D592A' },
              { label: t('farmerDashboard.getAiPrice'),    to: '/farmer/ai-price',         bg: '#faf5ff', color: '#7c3aed' },
              { label: t('farmerDashboard.demandForecast'),to: '/farmer/demand-forecast',  bg: '#f0fdf4', color: '#059669' },
              { label: t('farmerDashboard.bestBuyers'),    to: '/farmer/buyer-matching',   bg: '#eff6ff', color: '#1d4ed8' },
            ].map(a => (
              <Link key={a.label} to={a.to}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:opacity-80 transition text-sm font-semibold"
                style={{ backgroundColor: a.bg, color: a.color }}>
                {a.label} <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent listings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">{t('farmerDashboard.recentListings')}</h3>
          <Link to="/farmer/listings" className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1">
            {t('farmerDashboard.viewAll')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recent.map(item => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-400">{item.qty} {item.unit} · {item.variety}</p>
              </div>
              <p className="text-sm font-bold text-gray-700 hidden sm:block">${item.price}/{item.unit}</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[item.status]}`}>{item.status}</span>
            </div>
          ))}
          {recent.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">
              {t('farmerDashboard.noListings')}{' '}
              <Link to="/farmer/add-listing" className="text-green-600 font-semibold hover:underline">{t('farmerDashboard.addFirst')}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
