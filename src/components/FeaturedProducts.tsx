import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from './ProductCard';

const products: Product[] = [
  { id: 1, name: 'Organic Tomatoes', price: '$2.50', unit: 'kg', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80', seller: 'Green Valley Farm', location: 'Nairobi, Kenya', rating: 4.8, reviews: 124, badge: 'Organic', badgeColor: '#0D592A' },
  { id: 2, name: 'Fresh Maize (Corn)', price: '$0.80', unit: 'kg', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80', seller: 'Sunrise Farms', location: 'Kampala, Uganda', rating: 4.6, reviews: 89, badge: 'Hot Deal', badgeColor: '#c2410c' },
  { id: 3, name: 'Premium Avocados', price: '$3.20', unit: 'kg', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80', seller: 'Hillside Orchards', location: 'Meru, Kenya', rating: 4.9, reviews: 210, badge: 'Premium', badgeColor: '#7c3aed' },
  { id: 4, name: 'Brown Eggs (Tray)', price: '$4.00', unit: 'tray', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80', seller: 'Happy Hens Farm', location: 'Accra, Ghana', rating: 4.7, reviews: 67 },
  { id: 5, name: 'Sweet Potatoes', price: '$1.20', unit: 'kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80', seller: 'Root & Soil Co.', location: 'Lagos, Nigeria', rating: 4.5, reviews: 43, badge: 'New', badgeColor: '#1d4ed8' },
  { id: 6, name: 'Raw Honey', price: '$8.00', unit: '500g', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80', seller: 'Bee Natural', location: 'Addis Ababa, Ethiopia', rating: 5.0, reviews: 156, badge: 'Best Seller', badgeColor: '#a16207' },
];

const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Livestock', 'Honey'];

export default function FeaturedProducts() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-semibold text-sm uppercase tracking-widest" style={{ color: '#0D592A' }}>Fresh Picks</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
              Featured <span style={{ color: '#0D592A' }}>Products</span>
            </h2>
          </div>
          <Link to="/marketplace" className="flex items-center gap-1 font-semibold text-sm hover:gap-2 transition-all" style={{ color: '#0D592A' }}>
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {categories.map((cat, i) => (
            <button key={cat}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition"
              style={i === 0
                ? { backgroundColor: '#0D592A', color: 'white' }
                : { backgroundColor: '#f3f4f6', color: '#4b5563' }}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
