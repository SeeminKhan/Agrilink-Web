import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MapPin, ChevronRight, AlertCircle, Search,
  Phone, MessageCircle, Star, TrendingUp, Package,
  ShieldCheck, Leaf,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { farmerListingsStore, type FarmerListing } from '../../lib/farmerListingsStore';
import { MH_MARKETS } from '../../lib/priceService';

// Maharashtra city → lat/lon
const CITY_COORDS: Record<string, [number, number]> = {
  'Nashik':      [20.006, 73.790],
  'Pune':        [18.520, 73.856],
  'Nagpur':      [21.146, 79.088],
  'Aurangabad':  [19.877, 75.343],
  'Solapur':     [17.687, 75.906],
  'Kolhapur':    [16.705, 74.243],
  'Satara':      [17.686, 74.002],
  'Sangli':      [16.852, 74.582],
  'Ahmednagar':  [19.095, 74.738],
  'Jalgaon':     [21.004, 75.563],
  'Latur':       [18.400, 76.560],
  'Nanded':      [19.160, 77.310],
  'Mumbai':      [19.076, 72.877],
  'Thane':       [19.218, 72.978],
};

// Farmer city → approx coords (from location string)
const FARMER_COORDS: Record<string, [number, number]> = {
  'Nashik':      [20.006, 73.790],
  'Pune':        [18.520, 73.856],
  'Nagpur':      [21.146, 79.088],
  'Aurangabad':  [19.877, 75.343],
  'Solapur':     [17.687, 75.906],
  'Kolhapur':    [16.705, 74.243],
  'Satara':      [17.686, 74.002],
  'Sangli':      [16.852, 74.582],
  'Ahmednagar':  [19.095, 74.738],
  'Jalgaon':     [21.004, 75.563],
  'Latur':       [18.400, 76.560],
  'Nanded':      [19.160, 77.310],
  'Mumbai':      [19.076, 72.877],
  'Thane':       [19.218, 72.978],
};

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180)
    * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface FarmerMatch {
  listing: FarmerListing;
  score: number;
  distance_km: number;
  price_diff: number; // negative = cheaper than budget
}

function matchFarmers(
  crop: string,
  qty: number,
  budget: number,
  buyerCity: string,
  topN: number,
  listings: FarmerListing[]
): FarmerMatch[] {
  const buyerCoords = CITY_COORDS[buyerCity] || CITY_COORDS['Pune'];

  const active = listings.filter(l =>
    l.status === 'Active' &&
    l.name.toLowerCase().includes(crop.toLowerCase())
  );

  if (active.length === 0) return [];

  const scored = active.map(l => {
    const farmerCity = l.location.split(',')[0].trim();
    const farmerCoords = FARMER_COORDS[farmerCity] || [19.5, 74.0];
    const dist = haversine(buyerCoords[0], buyerCoords[1], farmerCoords[0], farmerCoords[1]);

    // Score: 40% proximity, 35% price vs budget, 25% quantity availability
    const proxScore  = Math.max(0, 100 - dist * 0.8);
    const priceDiff  = budget - l.price;
    const priceScore = priceDiff >= 0
      ? Math.min(100, 50 + (priceDiff / budget) * 100)
      : Math.max(0, 50 + (priceDiff / budget) * 50);
    const qtyScore   = Number(l.qty) >= qty ? 100 : (Number(l.qty) / qty) * 100;
    const score      = parseFloat((0.4 * proxScore + 0.35 * priceScore + 0.25 * qtyScore).toFixed(1));

    return { listing: l, score, distance_km: parseFloat(dist.toFixed(1)), price_diff: priceDiff };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, topN);
}

function scoreColor(s: number) {
  if (s >= 75) return { bg: 'bg-green-100', text: 'text-green-700', bar: '#0D592A' };
  if (s >= 50) return { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: '#d97706' };
  return { bg: 'bg-red-100', text: 'text-red-600', bar: '#dc2626' };
}

const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-300 transition';

export default function FarmerMatching() {
  const [listings, setListings] = useState(farmerListingsStore.getAll());
  const [form, setForm] = useState({
    crop: '', quantity: '', budget: '', city: 'Pune', topN: '5',
  });
  const [matches, setMatches] = useState<FarmerMatch[] | null>(null);
  const [error, setError]     = useState('');
  const { t } = useTranslation();

  useEffect(() => farmerListingsStore.subscribe(() => setListings(farmerListingsStore.getAll())), []);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.crop || !form.quantity || !form.budget) {
      setError('Please fill in crop, quantity, and your budget price.');
      return;
    }
    setError('');
    const results = matchFarmers(
      form.crop, Number(form.quantity), Number(form.budget),
      form.city, Number(form.topN), listings
    );
    if (results.length === 0) {
      setError(`No active listings found for "${form.crop}". Try a different crop name.`);
      setMatches(null);
    } else {
      setMatches(results);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">{t('farmerMatching.title')}</h1>
        </div>
        <p className="text-gray-500 text-sm">{t('farmerMatching.subtitle')}</p>
      </div>

      {/* Input card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Crop Needed *</label>
              <input type="text" placeholder="e.g. Tomato, Onion..."
                value={form.crop} onChange={set('crop')} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Quantity (kg) *</label>
              <input type="number" placeholder="e.g. 200"
                value={form.quantity} onChange={set('quantity')} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                <MapPin className="w-3 h-3" /> Your City *
              </label>
              <input type="text" list="buyer-cities" placeholder="e.g. Pune"
                value={form.city} onChange={set('city')} className={inputClass} />
              <datalist id="buyer-cities">
                {MH_MARKETS.map(m => <option key={m} value={m} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                Budget (₹/kg) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₹</span>
                <input type="number" step="0.5" placeholder="e.g. 25"
                  value={form.budget} onChange={set('budget')} className={`${inputClass} pl-8`} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Show Top</label>
            <select value={form.topN} onChange={set('topN')} className={inputClass}>
              {[3, 5, 8, 10].map(n => <option key={n} value={n}>Top {n} farmers</option>)}
            </select>
          </div>

          <button onClick={handleSubmit}
            disabled={!form.crop || !form.quantity || !form.budget}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed">
            <Search className="w-4 h-4" /> Find Best Farmers <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {matches && matches.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Best match banner */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-5 text-white">
              <p className="text-blue-100 text-xs font-semibold uppercase tracking-wide mb-1">Best Match</p>
              <p className="text-2xl font-black">{matches[0].listing.name}</p>
              <p className="text-blue-100 text-sm mb-2">{matches[0].listing.variety} · {matches[0].listing.grade}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> ₹{matches[0].listing.price}/kg
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {matches[0].distance_km} km away
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" /> Score {matches[0].score}
                </span>
              </div>
            </div>

            {/* All matches */}
            <div className="space-y-3">
              {matches.map((m, i) => {
                const sc = scoreColor(m.score);
                const farmerPhone = '+919800000000'; // default — real phone in META
                const farmerWA = '919800000000';
                return (
                  <motion.div key={m.listing.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Listing image strip */}
                    <div className="relative h-28 overflow-hidden">
                      <img src={m.listing.img} alt={m.listing.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <p className="text-white font-black text-lg">{m.listing.name}</p>
                        <p className="text-white/70 text-xs">{m.listing.variety} · {m.listing.grade}</p>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {m.listing.status === 'Active' && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Active
                          </span>
                        )}
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                          {m.score} pts
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Score bar */}
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <motion.div className="h-full rounded-full"
                          style={{ backgroundColor: sc.bar }}
                          initial={{ width: 0 }}
                          animate={{ width: `${m.score}%` }}
                          transition={{ duration: 0.7, delay: i * 0.07 }} />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-green-50 rounded-xl p-2.5 text-center">
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-black text-green-700 text-sm">₹{m.listing.price}/kg</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                          <p className="text-xs text-gray-500">Distance</p>
                          <p className="font-black text-blue-700 text-sm">{m.distance_km} km</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-2.5 text-center">
                          <p className="text-xs text-gray-500">Available</p>
                          <p className="font-black text-purple-700 text-sm">{m.listing.qty} {m.listing.unit}</p>
                        </div>
                      </div>

                      {/* Location + batch */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" /> {m.listing.location}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                          <Leaf className="w-3 h-3" /> {m.listing.batchId}
                        </span>
                      </div>

                      {/* Savings / extra cost */}
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 mb-3">
                        <Package className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-xs text-gray-600">
                          Buy {Math.min(Number(form.quantity), Number(m.listing.qty))} kg →{' '}
                          <strong className={m.price_diff >= 0 ? 'text-green-700' : 'text-red-600'}>
                            ₹{(Math.min(Number(form.quantity), Number(m.listing.qty)) * m.listing.price).toLocaleString('en-IN')}
                          </strong>
                          {m.price_diff >= 0
                            ? <span className="text-green-600"> · saves ₹{(m.price_diff * Number(form.quantity)).toFixed(0)} vs budget</span>
                            : <span className="text-red-500"> · ₹{Math.abs(m.price_diff).toFixed(2)}/kg above budget</span>}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <a href={`/buyer/listing/${m.listing.id}`}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-white font-bold text-xs rounded-xl hover:opacity-90 transition"
                          style={{ backgroundColor: '#0D592A' }}>
                          View Listing
                        </a>
                        <a href={`https://wa.me/${farmerWA}?text=Hi%2C%20I%20need%20${encodeURIComponent(form.quantity)}%20kg%20of%20${encodeURIComponent(m.listing.name)}.%20Batch%3A%20${m.listing.batchId}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 bg-green-50 hover:bg-green-100 rounded-xl text-green-600 transition"
                          title="WhatsApp">
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <a href={`tel:${farmerPhone}`}
                          className="flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 transition"
                          title="Call">
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
