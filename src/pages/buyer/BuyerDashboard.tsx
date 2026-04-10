import { useState, useEffect } from 'react';
import { ShoppingBag, Search, ShieldCheck, TrendingDown, ArrowRight, Star, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../lib/AuthContext';
import { getListings } from '../../lib/listingsData';
import { farmerListingsStore } from '../../lib/farmerListingsStore';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const firstName = user?.name.split(' ')[0] || 'Buyer';

  const stats = [
    { label: t('buyerDashboard.browseListings'), value: '120K+', icon: Search,      color: 'bg-blue-50 text-blue-600',   to: '/buyer/browse' },
    { label: t('buyerDashboard.activeOrders'),   value: '3',     icon: ShoppingBag, color: 'bg-green-50 text-green-600', to: '/buyer/orders' },
    { label: t('buyerDashboard.verifiedCrops'),  value: '98%',   icon: ShieldCheck, color: 'bg-purple-50 text-purple-600', to: '/buyer/quality' },
    { label: t('buyerDashboard.avgSavings'),     value: '32%',   icon: TrendingDown, color: 'bg-orange-50 text-orange-600', to: '/buyer/browse' },
  ];
  const [search, setSearch] = useState('');
  const [allListings, setAllListings] = useState(getListings());

  useEffect(() => farmerListingsStore.subscribe(() => setAllListings(getListings())), []);

  const featured = allListings.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/buyer/browse?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">{t('buyerDashboard.greeting', { name: firstName })}</h1>
        <p className="text-gray-500 text-sm mt-0.5">{t('buyerDashboard.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, to }) => (
          <Link key={label} to={to} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover block">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Browse Listings',  to: '/buyer/browse',           bg: '#f0f7f3', color: '#0D592A' },
          { label: 'Best Farmers',     to: '/buyer/farmer-matching',  bg: '#eff6ff', color: '#1d4ed8' },
          { label: 'Quality Check',    to: '/buyer/quality',          bg: '#f5f3ff', color: '#6d28d9' },
          { label: 'My Orders',        to: '/buyer/orders',           bg: '#fffbeb', color: '#92400e' },
        ].map(a => (
          <Link key={a.label} to={a.to}
            className="flex items-center justify-between px-4 py-3 rounded-2xl hover:opacity-80 transition text-sm font-bold"
            style={{ backgroundColor: a.bg, color: a.color }}>
            {a.label} <ArrowRight className="w-4 h-4" />
          </Link>
        ))}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-6 sm:p-8">
        <h3 className="text-white font-black text-xl mb-1">{t('buyerDashboard.findProduce')}</h3>
        <p className="text-green-100 text-sm mb-4">Search from 120,000+ verified listings</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder={t('buyerDashboard.searchPlaceholder')}
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-white/50 transition" />
          </div>
          <button type="submit" className="px-5 py-3 bg-white text-green-700 font-bold rounded-2xl hover:bg-green-50 transition text-sm shrink-0">
            {t('buyerDashboard.search')}
          </button>
        </div>
      </form>

      {/* Featured listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">{t('buyerDashboard.featuredListings')}</h3>
          <Link to="/buyer/browse" className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1">
            {t('buyerDashboard.viewAll')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featured.map(item => (
            <Link key={item.id} to={`/buyer/listing/${item.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover group block">
              <div className="relative h-36 overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {item.verified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                <p className="text-xs text-gray-400 mb-1">{item.farmer}</p>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{item.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-black text-base">₹{item.price}/{item.unit}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-gray-700">{item.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
