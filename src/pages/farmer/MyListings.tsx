import { useState } from 'react';
import { Edit2, Trash2, Plus, Search, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const listings = [
  { id: 1, name: 'Organic Tomatoes', variety: 'Roma', grade: 'Grade A', qty: '500 kg', price: '$2.50/kg', status: 'Active', img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=80', views: 142 },
  { id: 2, name: 'Fresh Maize', variety: 'Hybrid', grade: 'Grade B', qty: '1,200 kg', price: '$0.80/kg', status: 'Active', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=80&q=80', views: 89 },
  { id: 3, name: 'Premium Avocados', variety: 'Hass', grade: 'Grade A', qty: '300 kg', price: '$3.20/kg', status: 'Pending', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80&q=80', views: 210 },
  { id: 4, name: 'Sweet Potatoes', variety: 'Orange', grade: 'Grade B', qty: '800 kg', price: '$1.20/kg', status: 'Sold', img: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=80&q=80', views: 67 },
  { id: 5, name: 'Raw Honey', variety: 'Wildflower', grade: 'Organic', qty: '200 jars', price: '$8.00/jar', status: 'Active', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=80&q=80', views: 305 },
  { id: 6, name: 'Fresh Spinach', variety: 'Baby', grade: 'Grade A', qty: '150 bunches', price: '$1.50/bunch', status: 'Active', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=80&q=80', views: 44 },
];

const statusColor: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Sold: 'bg-gray-100 text-gray-500',
};

const filters = ['All', 'Active', 'Pending', 'Sold'];

export default function MyListings() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = listings.filter(l =>
    (filter === 'All' || l.status === filter) &&
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Listings</h1>
          <p className="text-gray-500 text-sm mt-0.5">{listings.length} total listings</p>
        </div>
        <Link to="/farmer/add-listing" className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-2xl hover:opacity-90 transition shadow-lg text-sm w-fit"
          style={{ backgroundColor: '#0D592A' }}>
          <Plus className="w-4 h-4" /> Add Listing
        </Link>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search listings..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition" />
        </div>
        <div className="flex gap-2">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === f ? 'text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
              style={filter === f ? { backgroundColor: '#0D592A' } : {}}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-hover">
            <div className="relative h-36 overflow-hidden">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[item.status]}`}>
                {item.status}
              </span>
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                <Eye className="w-3 h-3" /> {item.views}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{item.variety} · {item.grade}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="font-black text-base" style={{ color: '#0D592A' }}>{item.price}</span>
                <span className="text-xs text-gray-500">{item.qty}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-600 transition">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="flex items-center justify-center w-9 h-9 bg-red-50 hover:bg-red-100 rounded-xl text-red-500 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-semibold">No listings found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
