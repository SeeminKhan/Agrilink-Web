import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, Tag, Award, Weight, MapPin, ImagePlus, DollarSign,
  ChevronRight, CheckCircle2, Sparkles, X, Calendar,
  Mic, MicOff, CloudRain, Truck,
} from 'lucide-react';
import { farmerListingsStore } from '../../lib/farmerListingsStore';
import { predictPrice, MH_MARKETS } from '../../lib/priceService';

const steps    = ['Crop Info', 'Quantity & Price', 'Photos', 'Review'];
const grades   = ['Grade A', 'Grade B', 'Grade C', 'Organic'];
const units    = ['kg', 'quintal', 'tonne', 'bags', 'crates', 'jars', 'bunches', 'pieces', 'trays'];
const seasons  = ['kharif', 'rabi', 'zaid'];
const BRAND    = '#0D592A';

const MH_LOCATIONS = [
  'Nashik, Maharashtra', 'Pune, Maharashtra', 'Nagpur, Maharashtra',
  'Aurangabad, Maharashtra', 'Solapur, Maharashtra', 'Kolhapur, Maharashtra',
  'Satara, Maharashtra', 'Sangli, Maharashtra', 'Ahmednagar, Maharashtra',
  'Jalgaon, Maharashtra', 'Latur, Maharashtra', 'Nanded, Maharashtra',
];

// ── Voice parser — extracts form fields from spoken text ─────────────────────
function parseVoice(text: string): Partial<Record<string, string>> {
  const t = text.toLowerCase();
  const result: Partial<Record<string, string>> = {};

  // Crop name — first noun-like word before quantity keywords
  const cropMatch = t.match(/(?:selling|listing|have|got|crop is|crop:)?\s*([a-z]+(?:\s[a-z]+)?)\s*(?:crop|produce)?/);
  if (cropMatch) result.crop = cropMatch[1].trim().replace(/\b\w/g, c => c.toUpperCase());

  // Quantity — number followed by unit
  const qtyMatch = t.match(/(\d+(?:\.\d+)?)\s*(kg|quintal|quintals|tonne|tonnes|bags?|crates?|pieces?)/);
  if (qtyMatch) { result.quantity = qtyMatch[1]; result.unit = qtyMatch[2].replace(/s$/, ''); }

  // Grade
  if (t.includes('grade a') || t.includes('a grade')) result.grade = 'Grade A';
  else if (t.includes('grade b') || t.includes('b grade')) result.grade = 'Grade B';
  else if (t.includes('grade c') || t.includes('c grade')) result.grade = 'Grade C';
  else if (t.includes('organic')) result.grade = 'Organic';

  // Price
  const priceMatch = t.match(/(?:price|rate|₹|rs\.?|rupees?)\s*(\d+(?:\.\d+)?)/);
  if (priceMatch) result.price = priceMatch[1];

  // Location — Maharashtra cities
  const cities = ['nashik', 'pune', 'nagpur', 'aurangabad', 'solapur', 'kolhapur', 'satara', 'sangli', 'ahmednagar', 'jalgaon', 'latur', 'nanded'];
  const city = cities.find(c => t.includes(c));
  if (city) result.location = `${city.charAt(0).toUpperCase() + city.slice(1)}, Maharashtra`;

  // Season
  if (t.includes('kharif')) result.season = 'kharif';
  else if (t.includes('rabi')) result.season = 'rabi';
  else if (t.includes('zaid')) result.season = 'zaid';

  return result;
}

export default function AddListing() {
  const navigate = useNavigate();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [step, setStep]     = useState(0);
  const [done, setDone]     = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm]     = useState({
    crop: '', variety: '', grade: '', quantity: '', unit: 'kg',
    location: '', price: '', description: '', harvestDate: '',
    market: 'Nashik', season: 'kharif', rainfall_mm: '80', days_to_market: '1',
  });

  // AI price state
  const [aiPrice, setAiPrice]     = useState<{ predicted: number; low: number; high: number; confidence: number } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Voice state
  const [listening, setListening]     = useState(false);
  const [transcript, setTranscript]   = useState('');
  const [voiceError, setVoiceError]   = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const fetchAiPrice = useCallback(async (crop: string, quantity: string, grade: string, market: string, season: string, rainfall: string, days: string) => {
    if (!crop || !quantity || !grade) return;
    setAiLoading(true);
    setAiPrice(null);
    try {
      const res = await predictPrice({
        crop, grade, quantity: Number(quantity),
        market: market || 'Nashik',
        harvestDate: form.harvestDate,
        rainfall_mm: Number(rainfall) || 80,
        days_to_market: Number(days) || 1,
      });
      setAiPrice({ predicted: res.predicted_price_per_kg, low: res.price_range.low, high: res.price_range.high, confidence: res.confidence });
    } catch { /* silent */ }
    finally { setAiLoading(false); }
  }, [form.harvestDate]);

  // Trigger AI price with current form values
  const triggerAi = (overrides: Partial<typeof form> = {}) => {
    const f = { ...form, ...overrides };
    fetchAiPrice(f.crop, f.quantity, f.grade, f.market, f.season, f.rainfall_mm, f.days_to_market);
  };

  // ── Voice recording ────────────────────────────────────────────────────────
  const startListening = () => {
    const SR = (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SR) { setVoiceError('Voice input not supported in this browser. Try Chrome.'); return; }

    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    recognitionRef.current = rec;

    rec.onstart  = () => { setListening(true); setTranscript(''); setVoiceError(''); };
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      const parsed = parseVoice(text);
      setForm(f => {
        const updated = { ...f, ...parsed } as typeof form;
        // auto-fetch AI price with parsed values
        fetchAiPrice(
          updated.crop, updated.quantity, updated.grade,
          updated.market, updated.season, updated.rainfall_mm, updated.days_to_market
        );
        return updated;
      });
    };
    rec.onerror  = () => { setVoiceError('Could not understand. Please try again.'); setListening(false); };
    rec.onend    = () => setListening(false);
    rec.start();
  };

  const stopListening = () => { recognitionRef.current?.stop(); setListening(false); };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => setImages(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    const fallbackImg = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=90';
    await farmerListingsStore.add({
      name: form.crop,
      variety: form.variety || '—',
      grade: form.grade || 'Grade A',
      qty: form.quantity,
      unit: form.unit,
      price: Number(form.price) || 0,
      location: form.location,
      description: form.description,
      status: 'Active',
      img: images[0] || fallbackImg,
      images: images.length > 0 ? images : [fallbackImg],
      harvestDate: form.harvestDate || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    });
    setDone(true);
  };

  const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition';

  if (done) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Listing Published!</h2>
          <p className="text-gray-500 text-sm mb-6">Your crop is now live and visible to buyers across Maharashtra.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/farmer/listings')}
              className="px-6 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
              style={{ backgroundColor: BRAND }}>
              View My Listings
            </button>
            <button onClick={() => { setDone(false); setStep(0); setImages([]); setForm({ crop: '', variety: '', grade: '', quantity: '', unit: 'kg', location: '', price: '', description: '', harvestDate: '' }); }}
              className="px-6 py-3 rounded-2xl border border-gray-200 font-bold text-sm text-gray-600 hover:bg-gray-50 transition">
              Add Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Add New Listing</h1>
          <p className="text-gray-500 text-sm mt-1">List your crop for buyers to discover and purchase directly.</p>
        </div>
        {/* Voice button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition shadow-sm ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'}`}>
            {listening ? <><MicOff className="w-4 h-4" /> Stop</> : <><Mic className="w-4 h-4" /> Voice Fill</>}
          </button>
          {listening && <p className="text-xs text-red-500 font-semibold mt-1 text-center animate-pulse">Listening...</p>}
        </div>
      </div>

      {/* Voice transcript */}
      <AnimatePresence>
        {(transcript || voiceError) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`rounded-2xl p-3 mb-4 text-sm flex items-start gap-2 ${voiceError ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-800'}`}>
            <Mic className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              {voiceError ? voiceError : <><strong>Heard:</strong> "{transcript}" — fields filled automatically.</>}
            </div>
            <button onClick={() => { setTranscript(''); setVoiceError(''); }} className="ml-auto shrink-0">
              <X className="w-4 h-4 opacity-50 hover:opacity-100" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all"
              style={i < step ? { backgroundColor: BRAND, color: 'white' }
                : i === step ? { backgroundColor: BRAND, color: 'white', boxShadow: '0 4px 12px rgba(13,89,42,0.35)' }
                : { backgroundColor: '#f3f4f6', color: '#9ca3af' }}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className="text-xs font-semibold hidden sm:block"
              style={i === step ? { color: BRAND } : { color: '#9ca3af' }}>{s}</span>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5" style={{ backgroundColor: i < step ? BRAND : '#e5e7eb' }} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {/* Step 0 — Crop Info */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  <Leaf className="w-3.5 h-3.5" style={{ color: BRAND }} /> Crop Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tomato, Onion, Soybean, Sugarcane..."
                  value={form.crop}
                  onChange={e => { set('crop')(e); triggerAi({ crop: e.target.value }); }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  <Tag className="w-3.5 h-3.5" style={{ color: BRAND }} /> Variety
                </label>
                <input type="text" placeholder="e.g. Roma, Alphonso, Hybrid..." value={form.variety} onChange={set('variety')} className={inputClass} />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  <Award className="w-3.5 h-3.5" style={{ color: BRAND }} /> Grade
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {grades.map(g => (
                    <button key={g} type="button" onClick={() => { setForm(f => ({ ...f, grade: g })); triggerAi({ grade: g }); }}
                      className="py-2.5 px-4 rounded-xl text-sm font-semibold border-2 transition"
                      style={form.grade === g ? { borderColor: BRAND, backgroundColor: '#f0f7f3', color: BRAND } : { borderColor: '#e5e7eb', color: '#6b7280' }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  <MapPin className="w-3.5 h-3.5" style={{ color: BRAND }} /> Farm Location
                </label>
                <input
                  type="text"
                  list="mh-locations"
                  placeholder="e.g. Nashik, Maharashtra"
                  value={form.location}
                  onChange={set('location')}
                  className={inputClass}
                />
                <datalist id="mh-locations">
                  {MH_LOCATIONS.map(l => <option key={l} value={l} />)}
                </datalist>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  <Calendar className="w-3.5 h-3.5" style={{ color: BRAND }} /> Harvest Date
                </label>
                <input type="date" value={form.harvestDate} onChange={set('harvestDate')} className={inputClass} />
              </div>
            </motion.div>
          )}

          {/* Step 1 — Quantity & Price */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {/* Quantity */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  <Weight className="w-3.5 h-3.5" style={{ color: BRAND }} /> Quantity Available *
                </label>
                <div className="flex gap-2">
                  <input type="number" placeholder="e.g. 500" value={form.quantity}
                    onChange={e => { set('quantity')(e); triggerAi({ quantity: e.target.value }); }}
                    className={`${inputClass} flex-1`} />
                  <select value={form.unit} onChange={set('unit')} className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none transition">
                    {units.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* AI Price params */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    <MapPin className="w-3 h-3" style={{ color: BRAND }} /> Mandi
                  </label>
                  <input type="text" list="mh-markets-s1" placeholder="e.g. Nashik"
                    value={form.market} onChange={e => { set('market')(e); triggerAi({ market: e.target.value }); }} className={inputClass} />
                  <datalist id="mh-markets-s1">{MH_MARKETS.map(m => <option key={m} value={m} />)}</datalist>
                </div>
                <div>
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    <Calendar className="w-3 h-3" style={{ color: BRAND }} /> Season
                  </label>
                  <select value={form.season} onChange={e => { set('season')(e); triggerAi({ season: e.target.value }); }} className={inputClass}>
                    {seasons.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    <CloudRain className="w-3 h-3" style={{ color: BRAND }} /> Rainfall (mm)
                  </label>
                  <input type="number" value={form.rainfall_mm}
                    onChange={e => { set('rainfall_mm')(e); triggerAi({ rainfall_mm: e.target.value }); }} className={inputClass} />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    <Truck className="w-3 h-3" style={{ color: BRAND }} /> Days to Mandi
                  </label>
                  <input type="number" min="1" value={form.days_to_market}
                    onChange={e => { set('days_to_market')(e); triggerAi({ days_to_market: e.target.value }); }} className={inputClass} />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  <DollarSign className="w-3.5 h-3.5" style={{ color: BRAND }} /> Price per unit (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₹</span>
                  <input type="number" step="0.01" placeholder="0.00" value={form.price} onChange={set('price')} className={`${inputClass} pl-8`} />
                </div>
                {aiLoading && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-purple-600 font-semibold">
                    <div className="w-3 h-3 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                    Fetching AI price prediction...
                  </div>
                )}
                {aiPrice && !aiLoading && (
                  <div className="mt-3 bg-purple-50 border border-purple-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">AI Suggested Price</span>
                      </div>
                      <span className="text-xs text-purple-500 font-semibold">{Math.round(aiPrice.confidence * 100)}% confidence</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-black text-purple-700">₹{aiPrice.predicted.toFixed(2)}<span className="text-sm font-semibold text-purple-400">/kg</span></p>
                        <p className="text-xs text-purple-500 mt-0.5">Range: ₹{aiPrice.low.toFixed(2)} – ₹{aiPrice.high.toFixed(2)}</p>
                      </div>
                      <button type="button" onClick={() => setForm(f => ({ ...f, price: aiPrice.predicted.toFixed(2) }))}
                        className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition">
                        Use This Price
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Description</label>
                <textarea rows={3} placeholder="Describe your crop — freshness, harvest date, storage conditions..."
                  value={form.description} onChange={set('description')} className={`${inputClass} resize-none`} />
              </div>
            </motion.div>
          )}

          {/* Step 2 — Photos */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
                <ImagePlus className="w-3.5 h-3.5" style={{ color: BRAND }} /> Upload Crop Photos
              </label>

              {/* Preview grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative h-28 rounded-2xl overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow">
                        <X className="w-3 h-3 text-white" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">Main</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Drop zone */}
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer bg-gray-50 hover:border-green-400 hover:bg-green-50 transition">
                <ImagePlus className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-500">Click to upload photos</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each · Multiple allowed</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
              <p className="text-xs text-gray-400 mt-3">
                {images.length === 0
                  ? 'Upload at least 1 photo. Clear, well-lit photos get 3× more inquiries.'
                  : `${images.length} photo${images.length > 1 ? 's' : ''} selected. First photo is the main display image.`}
              </p>
            </motion.div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h3 className="font-bold text-gray-800 mb-2">Review Your Listing</h3>

              {/* Preview image */}
              {images.length > 0 && (
                <div className="h-48 rounded-2xl overflow-hidden mb-4">
                  <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {[
                ['Crop', form.crop || '—'],
                ['Variety', form.variety || '—'],
                ['Grade', form.grade || '—'],
                ['Quantity', form.quantity ? `${form.quantity} ${form.unit}` : '—'],
                ['Price', form.price ? `₹${form.price}/${form.unit}` : '—'],
                ['Location', form.location || '—'],
                ['Harvest Date', form.harvestDate || '—'],
                ['Photos', `${images.length} uploaded`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-bold text-gray-800">{value}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="px-5 py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition">
            Back
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              disabled={step === 0 && !form.crop}
              className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-2xl hover:opacity-90 transition text-sm disabled:opacity-40"
              style={{ backgroundColor: BRAND }}>
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-2xl hover:opacity-90 transition text-sm"
              style={{ backgroundColor: BRAND }}>
              <CheckCircle2 className="w-4 h-4" /> Publish Listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
