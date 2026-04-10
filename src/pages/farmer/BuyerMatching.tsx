import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MapPin, ChevronRight, AlertCircle,
  Phone, MessageCircle, Star, TrendingUp, Package,
} from 'lucide-react';
import { matchBuyers, MH_MARKETS, type BuyerMatch } from '../../lib/priceService';
import { farmerListingsStore } from '../../lib/farmerListingsStore';

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

const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition';

function scoreColor(s: number) {
  if (s >= 80) return { bg: 'bg-green-100', text: 'text-green-700', bar: '#0D592A' };
  if (s >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: '#d97706' };
  return { bg: 'bg-red-100', text: 'text-red-600', bar: '#dc2626' };
}

export default function BuyerMatching() {
  // Pre-fill from first active listing if available
  const activeListing = farmerListingsStore.getAll().find(l => l.status === 'Active');

  const [form, setForm] = useState({
    crop:     activeListing?.name || '',
    quantity: activeListing?.qty  || '',
    city:     activeListing?.location?.split(',')[0]?.trim() || 'Nashik',
    price:    String(activeListing?.price || ''),
    top_n:    '5',
  });
  const [loading, setLoading]   = useState(false);
  const [matches, setMatches]   = useState<BuyerMatch[] | null>(null);
  const [error, setError]       = useState('');

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.crop || !form.quantity || !form.price) return;
    const coords = CITY_COORDS[form.city] || CITY_COORDS['Nashik'];
    setLoading(true); setMatches(null); setError('');
    try {
      const res = await matchBuyers({
        crop: form.crop,
        quantity_kg: Number(form.quantity),
        farmer_lat: coords[0],
        farmer_lon: coords[1],
        market_price_per_kg: Number(form.price),
        top_n: Number(form.top_n),
      });
      setMatches(res.matches);
    } catch {
      setError('Could not fetch buyer matches. Please try again.');
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-black text-gray-900">Best Buyer Matches</h1>
        </div>
        <p className="text-gray-500 text-sm">Find the best buyers for your crop based on distance, price offered, and demand.</p>
      </div>

      {/* Input card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Crop Name *</label>
              <input type="text" placeholder="e.g. Tomato, Onion..."
                value={form.crop} onChange={set('crop')} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Quantity (kg) *</label>
              <input type="number" placeholder="e.g. 500"
                value={form.quantity} onChange={set('quantity')} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                <MapPin className="w-3 h-3" /> Your Location *
              </label>
              <input type="text" list="mh-cities" placeholder="e.g. Nashik"
                value={form.city} onChange={set('city')} className={inputClass} />
              <datalist id="mh-cities">
                {MH_MARKETS.map(m => <option key={m} value={m} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                Market Price (₹/kg) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₹</span>
                <input type="number" step="0.5" placeholder="e.g. 18.5"
                  value={form.price} onChange={set('price')} className={`${inputClass} pl-8`} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Show Top</label>
            <select value={form.top_n} onChange={set('top_n')} className={inputClass}>
              {[3, 5, 8, 10].map(n => <option key={n} value={n}>Top {n} buyers</option>)}
            </select>
          </div>

          <button onClick={handleSubmit}
            disabled={!form.crop || !form.quantity || !form.price || loading}
            className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#0D592A', boxShadow: '0 4px 16px -2px rgba(13,89,42,0.3)' }}>
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Finding best buyers...</>
              : <><Users className="w-4 h-4" /> Find Best Buyers <ChevronRight className="w-4 h-4" /></>}
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
        {matches && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Summary banner */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-5 text-white">
              <p className="text-green-100 text-xs font-semibold uppercase tracking-wide mb-1">Best Match</p>
              <p className="text-2xl font-black">{matches[0]?.buyer_name}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Offering ₹{matches[0]?.offered_price}/kg
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {matches[0]?.distance_km} km away
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" /> Score {matches[0]?.score}
                </span>
              </div>
            </div>

            {/* All matches */}
            <div className="space-y-3">
              {matches.map((m, i) => {
                const sc = scoreColor(m.score);
                return (
                  <motion.div key={m.buyer_name}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                          style={{ backgroundColor: '#0D592A' }}>
                          #{i + 1}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{m.buyer_name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {m.location || `${m.distance_km} km away`}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                        {m.score} pts
                      </span>
                    </div>

                    {/* Score bar */}
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                      <motion.div className="h-full rounded-full"
                        style={{ backgroundColor: sc.bar }}
                        initial={{ width: 0 }}
                        animate={{ width: `${m.score}%` }}
                        transition={{ duration: 0.7, delay: i * 0.07 }} />
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-green-50 rounded-xl p-2.5 text-center">
                        <p className="text-xs text-gray-500">Offering</p>
                        <p className="font-black text-green-700 text-sm">₹{m.offered_price}/kg</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                        <p className="text-xs text-gray-500">Distance</p>
                        <p className="font-black text-blue-700 text-sm">{m.distance_km} km</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-2.5 text-center">
                        <p className="text-xs text-gray-500">Needs</p>
                        <p className="font-black text-purple-700 text-sm">
                          {m.quantity_needed_kg ? `${m.quantity_needed_kg} kg` : '—'}
                        </p>
                      </div>
                    </div>

                    {/* Earnings estimate */}
                    {m.quantity_needed_kg && (
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 mb-3">
                        <Package className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-xs text-gray-600">
                          Sell {Math.min(Number(form.quantity), m.quantity_needed_kg)} kg →{' '}
                          <strong className="text-green-700">
                            ₹{(Math.min(Number(form.quantity), m.quantity_needed_kg) * m.offered_price).toLocaleString('en-IN')}
                          </strong> estimated earnings
                        </p>
                      </div>
                    )}

                    {/* Contact buttons */}
                    {m.contact && (
                      <div className="flex gap-2">
                        <a href={`https://wa.me/${m.contact.replace('+', '')}?text=Hi%2C%20I%20have%20${encodeURIComponent(form.quantity)}%20kg%20of%20${encodeURIComponent(form.crop)}%20available%20at%20₹${form.price}%2Fkg.%20Interested%3F`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 font-bold text-xs rounded-xl hover:bg-green-100 transition">
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                        <a href={`tel:${m.contact}`}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-100 transition">
                          <Phone className="w-3.5 h-3.5" /> Call
                        </a>
                      </div>
                    )}
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
