import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from './ProductCard';

const products: Product[] = [
  { id: 1, name: 'Organic Tomatoes', price: '₹28', unit: 'kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80', seller: 'Nashik Green Farms', location: 'Nashik, Maharashtra', rating: 4.8, reviews: 124, badge: 'Organic', badgeColor: '#0D592A' },
  { id: 2, name: 'Fresh Maize', price: '₹18', unit: 'kg', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80', seller: 'Pune Agro Farms', location: 'Pune, Maharashtra', rating: 4.6, reviews: 89, badge: 'Hot Deal', badgeColor: '#c2410c' },
  { id: 3, name: 'Premium Onions', price: '₹22', unit: 'kg', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80', seller: 'Nashik Onion Traders', location: 'Nashik, Maharashtra', rating: 4.9, reviews: 210, badge: 'Premium', badgeColor: '#7c3aed' },
  { id: 4, name: 'Sweet Potatoes', price: '₹30', unit: 'kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80', seller: 'Solapur Root Farm', location: 'Solapur, Maharashtra', rating: 4.7, reviews: 67 },
  { id: 5, name: 'Organic Turmeric', price: '₹120', unit: 'kg', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', seller: 'Sangli Spice Farm', location: 'Sangli, Maharashtra', rating: 4.5, reviews: 43, badge: 'New', badgeColor: '#1d4ed8' },
  { id: 6, name: 'Soybean JS-335', price: '₹45', unit: 'kg', image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&q=80', seller: 'Nagpur Krishi Bazaar', location: 'Nagpur, Maharashtra', rating: 5.0, reviews: 156, badge: 'Best Seller', badgeColor: '#a16207' },
];

const categories = ['All', 'Vegetables', 'Grains', 'Honey & Spices'];

export default function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const filtered = activeCategory === 'All' ? products : products.filter(p => {
    if (activeCategory === 'Vegetables') return ['Tomatoes', 'Onions', 'Potatoes'].some(v => p.name.includes(v));
    if (activeCategory === 'Grains') return ['Maize', 'Wheat', 'Soybean'].some(v => p.name.includes(v));
    if (activeCategory === 'Honey & Spices') return ['Turmeric', 'Honey'].some(v => p.name.includes(v));
    return true;
  });

  return (
    <section id="featured-products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-semibold text-sm uppercase tracking-widest" style={{ color: '#0D592A' }}>Fresh Picks</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
              Featured <span style={{ color: '#0D592A' }}>Products</span>
            </h2>
          </div>
          <button onClick={() => navigate('/marketplace')} className="flex items-center gap-1 font-semibold text-sm hover:gap-2 transition-all" style={{ color: '#0D592A' }}>
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition"
              style={activeCategory === cat
                ? { backgroundColor: '#0D592A', color: 'white' }
                : { backgroundColor: '#f3f4f6', color: '#4b5563' }}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
