import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, TrendingUp, TrendingDown, Minus,
  ChevronRight, Info, CheckCircle, AlertCircle,
  CloudRain, Calendar, MapPin, Truck, Mic, MicOff, X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { predictPrice, MH_MARKETS, type PriceResult } from '../../lib/priceService';
import { farmerListingsStore } from '../../lib/farmerListingsStore';

const grades  = ['Grade A', 'Grade B', 'Grade C', 'Organic'];
const seasons = ['kharif', 'rabi', 'zaid'];

const trendColor = (t: string) =>
  t === 'Rising' ? '#0D592A' : t === 'Falling' ? '#dc2626' : '#6b7280';
const trendBg = (t: string) =>
  t === 'Rising' ? '#f0f7f3' : t === 'Falling' ? '#fef2f2' : '#f9fafb';
const TrendIcon = (t: string) =>
  t === 'Rising' ? TrendingUp : t === 'Falling' ? TrendingDown : Minus;

const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-300 transition';

// Parse spoken text into form fields
function parseVoice(text: string): Partial<Record<string, string>> {
  const t = text.toLowerCase();
  const out: Partial<Record<string, string>> = {};

  // Crop — word before quantity keywords or after "crop"
  const cropMatch = t.match(/(?:crop\s+is\s+|for\s+|selling\s+)?([a-z]+(?:\s[a-z]+)?)\s+(?:\d|crop|grade|kharif|rabi|zaid)/);
  if (cropMatch) out.crop = cropMatch[1].trim().replace(/\b\w/g, c => c.toUpperCase());

  // Quantity
  const qtyMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:kg|quintal|quintals|tonne|tonnes)/);
  if (qtyMatch) out.quantity = qtyMatch[1];

  // Grade
  if (t.includes('grade a') || t.includes('a grade')) out.grade = 'Grade A';
  else if (t.includes('grade b') || t.includes('b grade')) out.grade = 'Grade B';
  else if (t.includes('grade c') || t.includes('c grade')) out.grade = 'Grade C';
  else if (t.includes('organic')) out.grade = 'Organic';

  // Market / mandi
  const cities = ['nashik', 'pune', 'nagpur', 'aurangabad', 'solapur', 'kolhapur', 'satara', 'sangli', 'ahmednagar', 'jalgaon', 'latur', 'nanded', 'mumbai'];
  const city = cities.find(c => t.includes(c));
  if (city) out.market = city.charAt(0).toUpperCase() + city.slice(1);

  // Season
  if (t.includes('kharif')) out.season = 'kharif';
  else if (t.includes('rabi')) out.season = 'rabi';
  else if (t.includes('zaid')) out.season = 'zaid';

  // Rainfall
  const rainMatch = t.match(/(\d+)\s*(?:mm|millimeter)/);
  if (rainMatch) out.rainfall_mm = rainMatch[1];

  // Days to market
  const daysMatch = t.match(/(\d+)\s*day/);
  if (daysMatch) out.days_to_market = daysMatch[1];

  return out;
}

export default function AIPrice() {
  const [form, setForm] = useState({
    crop: '', grade: 'Grade A', quantity: '',
    market: 'Nashik', season: 'kharif',
    rainfall_mm: '80', days_to_market: '1',
  });
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<PriceResult | null>(null);
  const [error, setError]         = useState('');
  const [applied, setApplied]     = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceErr, setVoiceErr]   = useState('');
  const recRef = useRef<SpeechRecognition | null>(null);
  const { t } = useTranslation();

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const activeListing = farmerListingsStore.getAll().find(l =>
    l.name.toLowerCase().includes(form.crop.toLowerCase()) && l.status === 'Active'
  );

  const handleSubmit = async () => {
    if (!form.crop || !form.quantity) return;
    setLoading(true); setResult(null); setError(''); setApplied(false);
    try {
      setResult(await predictPrice({
        crop: form.crop, grade: form.grade, quantity: Number(form.quantity),
        market: form.market, rainfall_mm: Number(form.rainfall_mm),
        days_to_market: Number(form.days_to_market),
      }));
    } catch {
      setError('Could not reach the prediction service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SR = (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SR) { setVoiceErr('Voice not supported. Try Chrome.'); return; }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    recRef.current = rec;
    rec.onstart  = () => { setListening(true); setTranscript(''); setVoiceErr(''); };
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      const parsed = parseVoice(text);
      setForm(f => ({ ...f, ...parsed } as typeof form));
    };
    rec.onerror  = () => { setVoiceErr('Could not understand. Please try again.'); setListening(false); };
    rec.onend    = () => setListening(false);
    rec.start();
  };

  const stopListening = () => { recRef.current?.stop(); setListening(false); };

  const priceTrend = result
    ? result.predicted_price_per_kg > result.price_range.low + (result.price_range.high - result.price_range.low) * 0.6
      ? 'Rising'
      : result.predicted_price_per_kg < result.price_range.low + (result.price_range.high - result.price_range.low) * 0.4
      ? 'Falling'
      : 'Stable'
    : 'Stable';
  const Icon = TrendIcon(priceTrend);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">{t('aiPrice.title')}</h1>
          </div>
          <p className="text-gray-500 text-sm">{t('aiPrice.subtitle')}</p>
        </div>
        {/* Voice button */}
        <div className="shrink-0">
          <button type="button" onClick={listening ? stopListening : startListening}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition shadow-sm ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'}`}>
            {listening ? <><MicOff className="w-4 h-4" /> Stop</> : <><Mic className="w-4 h-4" /> Voice</>}
          </button>
          {listening && <p className="text-xs text-red-500 font-semibold mt-1 text-center animate-pulse">Listening...</p>}
        </div>
      </div>

      {/* Voice feedback */}
      <AnimatePresence>
        {(transcript || voiceErr) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`rounded-2xl p-3 mb-4 text-sm flex items-start gap-2 ${voiceErr ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-purple-50 border border-purple-200 text-purple-800'}`}>
            <Mic className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1">
              {voiceErr || <><strong>Heard:</strong> "{transcript}" — fields filled automatically.</>}
            </span>
            <button onClick={() => { setTranscript(''); setVoiceErr(''); }}>
              <X className="w-4 h-4 opacity-50 hover:opacity-100" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Crop Name *</label>
              <input type="text" placeholder="e.g. Tomato, Onion, Soybean..."
                value={form.crop} onChange={set('crop')} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Quality Grade</label>
              <select value={form.grade} onChange={set('grade')} className={inputClass}>
                {grades.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Quantity (kg) *</label>
              <input type="number" placeholder="e.g. 500" value={form.quantity} onChange={set('quantity')} className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                <MapPin className="w-3 h-3" /> Mandi / Market
              </label>
              <input type="text" list="mh-markets" placeholder="e.g. Nashik"
                value={form.market} onChange={set('market')} className={inputClass} />
              <datalist id="mh-markets">
                {MH_MARKETS.map(m => <option key={m} value={m} />)}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                <Calendar className="w-3 h-3" /> Season
              </label>
              <select value={form.season} onChange={set('season')} className={inputClass}>
                {seasons.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                <CloudRain className="w-3 h-3" /> Rainfall (mm)
              </label>
              <input type="number" value={form.rainfall_mm} onChange={set('rainfall_mm')} className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                <Truck className="w-3 h-3" /> Days to Mandi
              </label>
              <input type="number" min="1" value={form.days_to_market} onChange={set('days_to_market')} className={inputClass} />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={!form.crop || !form.quantity || loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg shadow-purple-200 disabled:opacity-40 disabled:cursor-not-allowed">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analysing mandi data...</>
              : <><Sparkles className="w-4 h-4" /> Predict Price <ChevronRight className="w-4 h-4" /></>}
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

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="relative bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-xl shadow-purple-200 mb-4">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-purple-200 text-xs font-semibold uppercase tracking-wide mb-1">Predicted Mandi Price</p>
                    <p className="text-5xl font-black text-white">₹{result.predicted_price_per_kg.toFixed(2)}</p>
                    <p className="text-purple-200 text-sm mt-1">per kg · {form.crop} · {form.grade} · {form.market}</p>
                  </div>
                  <div className="rounded-2xl p-3" style={{ backgroundColor: trendBg(priceTrend) }}>
                    <Icon className="w-8 h-8" style={{ color: trendColor(priceTrend) }} />
                  </div>
                </div>

                <div className="glass rounded-2xl p-4 mb-4">
                  <p className="text-white/60 text-xs mb-3 font-semibold uppercase tracking-wide">Mandi Price Range</p>
                  <div className="flex items-center gap-3">
                    <div className="text-center"><p className="text-white/60 text-xs">Low</p><p className="text-white font-bold">₹{result.price_range.low.toFixed(2)}</p></div>
                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${Math.min(100, ((result.predicted_price_per_kg - result.price_range.low) / (result.price_range.high - result.price_range.low)) * 100)}%`,
                        background: 'linear-gradient(to right, #fbbf24, #0D592A)',
                      }} />
                    </div>
                    <div className="text-center"><p className="text-white/60 text-xs">High</p><p className="text-white font-bold">₹{result.price_range.high.toFixed(2)}</p></div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">Model Confidence</p>
                    <p className="text-white font-black">{Math.round(result.confidence * 100)}%</p>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }} transition={{ duration: 1 }}
                      style={{ background: 'linear-gradient(to right, #0D592A, #4d9d78)' }} />
                  </div>
                </div>

                <div className="glass rounded-2xl p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-purple-200 shrink-0 mt-0.5" />
                    <p className="text-white/80 text-sm leading-relaxed">
                      Based on <strong className="text-white">{form.quantity} kg</strong> of{' '}
                      <strong className="text-white">{form.crop}</strong> ({form.grade}) at{' '}
                      <strong className="text-white">{form.market}</strong> mandi during{' '}
                      <strong className="text-white">{form.season}</strong> season,{' '}
                      <strong className="text-white">{form.rainfall_mm}mm</strong> rainfall,{' '}
                      <strong className="text-white">{form.days_to_market} day(s)</strong> to market.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {activeListing && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={activeListing.img} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">{activeListing.name}</p>
                    <p className="text-xs text-gray-400">Current: ₹{activeListing.price}/{activeListing.unit}</p>
                  </div>
                </div>
                <button
                  onClick={() => { farmerListingsStore.update(activeListing.id, { price: result.predicted_price_per_kg }); setApplied(true); }}
                  disabled={applied}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-60"
                  style={{ backgroundColor: '#0D592A' }}>
                  {applied ? <><CheckCircle className="w-4 h-4" /> Applied!</> : <>Apply ₹{result.predicted_price_per_kg.toFixed(2)}</>}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
