import { ShoppingBag, Search, ShieldCheck, TrendingDown, ArrowRight, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

const stats = [
  { label: 'Browse Listings', value: '120K+', icon: Search, color: 'bg-blue-50 text-blue-600' },
  { label: 'Active Orders', value: '3', icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
  { label: 'Verified Crops', value: '98%', icon: ShieldCheck, color: 'bg-purple-50 text-purple-600' },
  { label: 'Avg. Savings', value: '32%', icon: TrendingDown, color: 'bg-orange-50 text-orange-600' },
];

const featured = [
  { name: 'Organic Tomatoes', farmer: 'Green Valley Farm', location: 'Nairobi, Kenya', price: '$2.50/kg', rating: 4.8, img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&q=80', verified: true },
  { name: 'Fresh Avocados', farmer: 'Hillside Orchards', location: 'Meru, Kenya', price: '$3.20/kg', rating: 4.9, img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&q=80', verified: true },
  { name: 'Raw Honey', farmer: 'Bee Natural', location: 'Ethiopia', price: '$8.00/500g', rating: 5.0, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&q=80', verified: true },
];

export default function BuyerDashboard() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] || 'Buyer';
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Welcome back, {firstName} 👋</h1>
        <p className="text-gray-500 text-sm mt-0.5">Discover fresh produce from verified farmers across Africa.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-6 sm:p-8">
        <h3 className="text-white font-black text-xl mb-1">Find Fresh Produce</h3>
        <p className="text-green-100 text-sm mb-4">Search from 120,000+ verified listings</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search crops, location, farmer..." className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-white/50 transition" />
          </div>
          <button className="px-5 py-3 bg-white text-green-700 font-bold rounded-2xl hover:bg-green-50 transition text-sm shrink-0">
            Search
          </button>
        </div>
      </div>

      {/* Featured listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Featured Listings</h3>
          <Link to="/buyer/browse" className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featured.map(item => (
            <div key={item.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover group">
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
                  <span className="text-green-600 font-black text-base">{item.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-gray-700">{item.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
