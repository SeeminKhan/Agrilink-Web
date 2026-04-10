import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, ShieldCheck, MessageCircle, Phone, Award, Leaf, Weight, Calendar, ChevronRight } from 'lucide-react';

const listing = {
  id: 1,
  name: 'Organic Tomatoes',
  variety: 'Roma',
  grade: 'Grade A',
  price: '$2.50',
  unit: 'kg',
  qty: '500 kg',
  freshness: 'Harvested 2 days ago',
  harvestDate: 'Dec 10, 2024',
  description: 'Premium Roma tomatoes grown using 100% organic methods. No pesticides, no chemicals. Ideal for restaurants, supermarkets, and bulk buyers. Consistent size and deep red color. Available for immediate pickup or delivery.',
  farmer: {
    name: 'Green Valley Farm',
    owner: 'James Mwangi',
    location: 'Nairobi, Kenya',
    rating: 4.8,
    reviews: 124,
    verified: true,
    joined: 'Jan 2022',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    totalSales: '2,400 kg sold',
  },
  images: [
    'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=700&q=80',
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80',
    'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=300&q=80',
  ],
  tags: ['Organic', 'Grade A', 'Pesticide-Free', 'Bulk Available'],
};

export default function ListingDetails() {
  const { id: _id } = useParams();

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <Link to="/buyer/browse" className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="rounded-3xl overflow-hidden h-72 sm:h-80 mb-3 shadow-md">
            <img src={listing.images[0]} alt={listing.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {listing.images.slice(1).map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden h-28 shadow-sm cursor-pointer hover:opacity-90 transition">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {listing.tags.map(tag => (
              <span key={tag} className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">{listing.name}</h1>
          <p className="text-gray-500 text-sm mb-4">{listing.variety} · {listing.grade}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-4 h-4 ${i <= Math.floor(listing.farmer.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700">{listing.farmer.rating}</span>
            <span className="text-sm text-gray-400">({listing.farmer.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="bg-green-50 rounded-2xl p-4 mb-5">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-green-600">{listing.price}</span>
              <span className="text-gray-500 text-sm mb-1">/{listing.unit}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{listing.qty} available · {listing.freshness}</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { icon: Award, label: 'Grade', value: listing.grade },
              { icon: Weight, label: 'Available', value: listing.qty },
              { icon: Leaf, label: 'Type', value: 'Organic' },
              { icon: Calendar, label: 'Harvested', value: listing.harvestDate },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                <Icon className="w-4 h-4 text-green-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-bold text-gray-700">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-6">{listing.description}</p>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 gradient-green text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg shadow-green-200">
              Request to Buy <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-green-50 rounded-2xl text-gray-500 hover:text-green-600 transition">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Farmer card */}
      <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">About the Farmer</h3>
        <div className="flex items-start gap-4">
          <img src={listing.farmer.avatar} alt={listing.farmer.owner} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-gray-800">{listing.farmer.name}</p>
              {listing.farmer.verified && (
                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-1">{listing.farmer.owner}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
              <MapPin className="w-3 h-3" /> {listing.farmer.location}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span>⭐ {listing.farmer.rating} rating</span>
              <span>📦 {listing.farmer.totalSales}</span>
              <span>📅 Member since {listing.farmer.joined}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 font-semibold text-sm rounded-xl hover:bg-green-100 transition">
              <MessageCircle className="w-4 h-4" /> Chat
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-100 transition">
              <Phone className="w-4 h-4" /> Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
