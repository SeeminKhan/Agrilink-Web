import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Star, ShieldCheck, MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const listings = [
  { id: 1, name: 'Organic Tomatoes', variety: 'Roma', grade: 'Grade A', price: '$2.50', unit: 'kg', qty: '500 kg', farmer: 'Green Valley Farm', location: 'Nairobi, Kenya', rating: 4.8, reviews: 124, img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80', verified: true, fresh: 'Harvested 2 days ago' },
  { id: 2, name: 'Fresh Maize', variety: 'Hybrid', grade: 'Grade B', price: '$0.80', unit: 'kg', qty: '1,200 kg', farmer: 'Sunrise Farms', location: 'Kampala, Uganda', rating: 4.6, reviews: 89, img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80', verified: true, fresh: 'Harvested 3 days ago' },
  { id: 3, name: 'Premium Avocados', variety: 'Hass', grade: 'Grade A', price: '$3.20', unit: 'kg', qty: '300 kg', farmer: 'Hillside Orchards', location: 'Meru, Kenya', rating: 4.9, reviews: 210, img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80', verified: true, fresh: 'Harvested today' },
  { id: 4, name: 'Brown Eggs', variety: 'Free Range', grade: 'Organic', price: '$4.00', unit: 'tray', qty: '200 trays', farmer: 'Happy Hens Farm', location: 'Accra, Ghana', rating: 4.7, reviews: 67, img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80', verified: false, fresh: 'Collected yesterday' },
  { id: 5, name: 'Sweet Potatoes', variety: 'Orange', grade: 'Grade B', price: '$1.20', unit: 'kg', qty: '800 kg', farmer: 'Root & Soil Co.', location: 'Lagos, Nigeria', rating: 4.5, reviews: 43, img: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=400&q=80', verified: true, fresh: 'Harvested 4 days ago' },
  { id: 6, name: 'Raw Honey', variety: 'Wildflower', grade: 'Organic', price: '$8.00', unit: '500g', qty: '200 jars', farmer: 'Bee Natural', location: 'Addis Ababa, Ethiopia', rating: 5.0, reviews: 156, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80', verified: true, fresh: 'Harvested this week' },
  { id: 7, name: 'Fresh Spinach', variety: 'Baby Leaf', grade: 'Grade A', price: '$1.50', unit: 'bunch', qty: '150 bunches', farmer: 'Leafy Greens Co.', location: 'Dar es Salaam, Tanzania', rating: 4.4, reviews: 31, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80', verified: false, fresh: 'Harvested today' },
  { id: 8, name: 'Alphonso Mangoes', variety: 'Alphonso', grade: 'Grade A', price: '$4.50', unit: 'kg', qty: '600 kg', farmer: 'Tropical Fruits Ltd', location: 'Accra, Ghana', rating: 4.8, reviews: 98, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80', verified: true, fresh: 'Harvested 2 days ago' },
];

const cropTypes = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy & Eggs', 'Honey'];
const grades = ['All Grades', 'Grade A', 'Grade B', 'Organic'];
const locations = ['All Locations', 'Kenya', 'Uganda', 'Ghana', 'Nigeria', 'Ethiopia', 'Tanzania'];

export default function BrowseListings() {
  const [search, setSearch] = useState('');
  const [cropType, setCropType] = useState('All');
  const [grade, setGrade] = useState('All Grades');
  const [location, setLocation] = useState('All Locations');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = listings.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.farmer.toLowerCase().includes(search.toLowerCase());
    const matchGrade = grade === 'All Grades' || l.grade === grade;
    const matchLocation = location === 'All Locations' || l.location.includes(location);
    return matchSearch && matchGrade && matchLocation;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Browse Listings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Discover fresh produce from verified farmers across Africa.</p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search crops, farmers, locations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${showFilters ? 'bg-green-600 text-white border-green-600' : 'bg-white border-gray-200 text-gray-600 hover:border-green-300'}`}
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Crop Type</label>
              <div className="flex flex-wrap gap-2">
                {cropTypes.map(c => (
                  <button key={c} onClick={() => setCropType(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${cropType === c ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Grade</label>
              <div className="flex flex-wrap gap-2">
                {grades.map(g => (
                  <button key={g} onClick={() => setGrade(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${grade === g ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Location</label>
              <div className="flex flex-wrap gap-2">
                {locations.map(l => (
                  <button key={l} onClick={() => setLocation(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${location === l ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => { setCropType('All'); setGrade('All Grades'); setLocation('All Locations'); }}
            className="mt-4 flex items-center gap-1 text-xs text-red-500 font-semibold hover:text-red-600 transition">
            <X className="w-3.5 h-3.5" /> Clear all filters
          </button>
        </div>
      )}

      <p className="text-sm text-gray-400 mb-4">{filtered.length} listings found</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover group">
            <div className="relative h-44 overflow-hidden">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {item.verified && (
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                {item.fresh}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                <MapPin className="w-3 h-3" /> {item.location}
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-0.5">{item.name}</h3>
              <p className="text-xs text-gray-400 mb-1">{item.variety} · {item.grade}</p>
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold text-gray-700">{item.rating}</span>
                <span className="text-xs text-gray-400">({item.reviews})</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-green-600 font-black text-lg">{item.price}</span>
                <span className="text-xs text-gray-400">/{item.unit} · {item.qty}</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/buyer/listing/${item.id}`}
                  className="flex-1 text-center py-2 gradient-green text-white text-xs font-bold rounded-xl hover:opacity-90 transition">
                  View Details
                </Link>
                <button className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-green-50 rounded-xl text-gray-400 hover:text-green-600 transition">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No listings match your filters</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
