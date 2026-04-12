import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import type { Product } from '../components/ProductCard';

const allProducts: Product[] = [
  { id: 1, name: 'Organic Tomatoes', price: '₹28', unit: 'kg', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80', seller: 'Nashik Green Farms', location: 'Nashik, Maharashtra', rating: 4.8, reviews: 124, badge: 'Organic', badgeColor: 'bg-green-500 text-white' },
  { id: 2, name: 'Fresh Maize', price: '₹18', unit: 'kg', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80', seller: 'Pune Agro Farms', location: 'Pune, Maharashtra', rating: 4.6, reviews: 89, badge: 'Hot Deal', badgeColor: 'bg-orange-500 text-white' },
  { id: 3, name: 'Premium Onions', price: '₹22', unit: 'kg', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80', seller: 'Nashik Onion Traders', location: 'Nashik, Maharashtra', rating: 4.9, reviews: 210, badge: 'Premium', badgeColor: 'bg-purple-500 text-white' },
  { id: 4, name: 'Sweet Potatoes', price: '₹30', unit: 'kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80', seller: 'Solapur Root Farm', location: 'Solapur, Maharashtra', rating: 4.7, reviews: 67 },
  { id: 5, name: 'Organic Turmeric', price: '₹120', unit: 'kg', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80', seller: 'Sangli Spice Farm', location: 'Sangli, Maharashtra', rating: 4.5, reviews: 43, badge: 'New', badgeColor: 'bg-blue-500 text-white' },
  { id: 6, name: 'Soybean JS-335', price: '₹45', unit: 'kg', image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&q=80', seller: 'Nagpur Krishi Bazaar', location: 'Nagpur, Maharashtra', rating: 5.0, reviews: 156, badge: 'Best Seller', badgeColor: 'bg-yellow-500 text-white' },
  { id: 7, name: 'Fresh Spinach', price: '₹25', unit: 'bunch', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80', seller: 'Kolhapur Leafy Farms', location: 'Kolhapur, Maharashtra', rating: 4.4, reviews: 31 },
  { id: 8, name: 'Wheat (Lokwan)', price: '₹24', unit: 'kg', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80', seller: 'Aurangabad Grain Traders', location: 'Aurangabad, Maharashtra', rating: 4.3, reviews: 55 },
  { id: 9, name: 'Alphonso Mango', price: '₹180', unit: 'kg', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80', seller: 'Ratnagiri Mango Farm', location: 'Ratnagiri, Maharashtra', rating: 4.8, reviews: 98, badge: 'Seasonal', badgeColor: 'bg-yellow-400 text-white' },
];

const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Livestock', 'Honey & Spices'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Top Rated'];

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('Newest');
  const { t } = useTranslation();

  const filtered = allProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' ||
      (activeCategory === 'Vegetables' && ['Tomatoes', 'Onions', 'Spinach', 'Potatoes'].some(v => p.name.includes(v))) ||
      (activeCategory === 'Fruits' && ['Mango', 'Avocado'].some(v => p.name.includes(v))) ||
      (activeCategory === 'Grains' && ['Maize', 'Wheat', 'Soybean'].some(v => p.name.includes(v))) ||
      (activeCategory === 'Honey & Spices' && ['Turmeric', 'Honey'].some(v => p.name.includes(v)));
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{t('marketplace.title')}</h1>
          <p className="text-green-100 mb-6">{t('marketplace.subtitle')}</p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('marketplace.searchPlaceholder')}
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
              <SlidersHorizontal className="w-4 h-4" /> {t('marketplace.filters')}
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

        <p className="text-sm text-gray-500 mb-6">{t('marketplace.productsFound', { count: filtered.length })}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
