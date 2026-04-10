import { TrendingUp, Package, Clock, DollarSign, ArrowUpRight, ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

const stats = [
  { label: 'Total Listings', value: '24', change: '+3 this week', icon: Package, color: 'bg-green-50 text-green-600', trend: 'up' },
  { label: 'Active Crops', value: '18', change: '6 expiring soon', icon: Leaf, color: 'bg-emerald-50 text-emerald-600', trend: 'neutral' },
  { label: 'Pending Sales', value: '7', change: '+2 new requests', icon: Clock, color: 'bg-yellow-50 text-yellow-600', trend: 'up' },
  { label: 'Total Earnings', value: '$1,240', change: '+18% this month', icon: DollarSign, color: 'bg-blue-50 text-blue-600', trend: 'up' },
];

const recentListings = [
  { name: 'Organic Tomatoes', qty: '500 kg', price: '$2.50/kg', status: 'Active', img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=80' },
  { name: 'Fresh Maize', qty: '1,200 kg', price: '$0.80/kg', status: 'Active', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=80&q=80' },
  { name: 'Avocados', qty: '300 kg', price: '$3.20/kg', status: 'Pending', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80&q=80' },
  { name: 'Sweet Potatoes', qty: '800 kg', price: '$1.20/kg', status: 'Sold', img: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=80&q=80' },
];

const statusColor: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Sold: 'bg-gray-100 text-gray-500',
};

// Mini sparkline bars
const sparkData = [40, 65, 50, 80, 70, 90, 85, 95, 88, 100, 92, 110];

export default function FarmerDashboard() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] || 'Farmer';
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Good morning, {firstName} 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's what's happening with your farm today.</p>
        </div>
        <Link to="/farmer/add-listing" className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-2xl hover:opacity-90 transition shadow-lg text-sm w-fit"
          style={{ backgroundColor: '#0D592A', boxShadow: '0 4px 16px -2px rgba(13,89,42,0.3)' }}>
          + Add Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, color, trend }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            <p className={`text-xs mt-1 font-medium ${trend === 'up' ? 'text-green-600' : 'text-gray-400'}`}>{change}</p>
          </div>
        ))}
      </div>

      {/* Market trend + recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market trend chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800">Market Trends</h3>
              <p className="text-xs text-gray-400">Price index over last 12 weeks</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#f0f7f3', color: '#0D592A' }}>
              <TrendingUp className="w-3.5 h-3.5" /> +12.4%
            </div>
          </div>
          {/* Sparkline */}
          <div className="flex items-end gap-1.5 h-24">
            {sparkData.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-md transition-all ${i === sparkData.length - 1 ? '' : ''}`}
                  style={{ height: `${(h / 110) * 100}%`, backgroundColor: i === sparkData.length - 1 ? '#0D592A' : '#aed4bc' }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'].map(w => (
              <span key={w} className="text-xs text-gray-300 flex-1 text-center">{w}</span>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New Listing', to: '/farmer/add-listing', bg: '#f0f7f3', color: '#0D592A' },
              { label: 'Get AI Price', to: '/farmer/ai-price', bg: '#faf5ff', color: '#7c3aed' },
              { label: 'View Training', to: '/farmer/training', bg: '#eff6ff', color: '#1d4ed8' },
              { label: 'Update Profile', to: '/farmer/settings', bg: '#f9fafb', color: '#374151' },
            ].map(a => (
              <Link key={a.label} to={a.to} className="flex items-center justify-between px-4 py-3 rounded-xl hover:opacity-80 transition text-sm font-semibold"
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
          <h3 className="font-bold text-gray-800">Recent Listings</h3>
          <Link to="/farmer/listings" className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentListings.map(item => (
            <div key={item.name} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
              <img src={item.img} alt={item.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-400">{item.qty}</p>
              </div>
              <p className="text-sm font-bold text-gray-700 hidden sm:block">{item.price}</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[item.status]}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
