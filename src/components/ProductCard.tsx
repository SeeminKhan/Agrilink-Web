import { Heart, Star, MapPin, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Product {
  id: number;
  name: string;
  price: string;
  unit: string;
  image: string;
  seller: string;
  location: string;
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100">
      <div className="relative overflow-hidden h-48">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.badge && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: product.badgeColor || '#0D592A' }}>
            {product.badge}
          </span>
        )}
        <button onClick={() => setLiked(!liked)} className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition">
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
          <MapPin className="w-3 h-3" /><span>{product.location}</span>
        </div>
        <h3 className="font-bold text-gray-800 text-base mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">by {product.seller}</p>
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-extrabold text-lg" style={{ color: '#0D592A' }}>{product.price}</span>
            <span className="text-gray-400 text-xs">/{product.unit}</span>
          </div>
          <button
            onClick={() => navigate('/buyer/browse')}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-2 rounded-lg transition hover:opacity-90"
            style={{ backgroundColor: '#0D592A' }}>
            <ShoppingCart className="w-3.5 h-3.5" /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
