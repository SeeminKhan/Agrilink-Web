import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../components/ProductCard';

const allProducts: Product[] = [
  { id: 1, name: 'Organic Tomatoes', price: '$2.50', unit: 'kg', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80', seller: 'Green Valley Farm', location: 'Nairobi, Kenya', rating: 4.8, reviews: 124, badge: 'Organic', badgeColor: 'bg-green-500 text-white' },
  { id: 2, name: 'Fresh Maize', price: '$0.80', unit: 'kg', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80', seller: 'Sunrise Farms', location: 'Kampala, Uganda', rating: 4.6, reviews: 89, badge: 'Hot Deal', badgeColor: 'bg-orange-500 text-white' },
  { id: 3, name: 'Premium Avocados', price: '$3.20', unit: 'kg', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80', seller: 'Hillside Orchards', location: 'Meru, Kenya', rating: 4.9, reviews: 210, badge: 'Premium', badgeColor: 'bg-purple-500 text-white' },
  { id: 4, name: 'Brown Eggs', price: '$4.00', unit: 'tray', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80', seller: 'Happy Hens Farm', location: 'Accra, Ghana', rating: 4.7, reviews: 67 },
  { id: 5, name: 'Sweet Potatoes', price: '$1.20', unit: 'kg', image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=400&q=80', seller: 'Root & Soil Co.', location: 'Lagos, Nigeria', rating: 4.5, reviews: 43, badge: 'New', badgeColor: 'bg-blue-500 text-white' },
  { id: 6, name: 'Raw Honey', price: '$8.00', unit: '500g', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80', seller: 'Bee Natural', location: 'Addis Ababa, Ethiopia', rating: 5.0, reviews: 156, badge: 'Best Seller', badgeColor: 'bg-yellow-500 text-white' },
  { id: 7, name: 'Fresh Spinach', price: '$1.50', unit: 'bunch', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80', seller: 'Leafy Greens Co.', location: 'Dar es Salaam, Tanzania', rating: 4.4, reviews: 31 },
  { id: 8, name: 'Cassava Flour', price: '$2.00', unit: 'kg', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80', seller: 'Grain Masters', location: 'Abidjan, Ivory Coast', rating: 4.3, reviews: 55 },
  { id: 9, name: 'Mango (Alphonso)', price: '$4.50', unit: 'kg', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80', seller: 'Tropical Fruits Ltd', location: 'Accra, Ghana', rating: 4.8, reviews: 98, badge: 'Seasonal', badgeColor: 'bg-yellow-400 text-white' },
];

const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Livestock', 'Honey & Spices'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Top Rated'];

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('Newest');

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Agricultural Marketplace</h1>
          <p className="text-green-100 mb-6">Browse fresh produce, grains, livestock and more from verified farmers</p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, locations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-green-400 shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeCategory === cat ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-green-400 transition">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none cursor-pointer"
              >
                {sortOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">{filtered.length} products found</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
