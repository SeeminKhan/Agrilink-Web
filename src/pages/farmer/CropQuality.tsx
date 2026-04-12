import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Leaf, Clock, AlertCircle,
  CheckCircle2, TrendingDown, Upload, Link as LinkIcon,
  Sparkles, ChevronRight, Info,
} from 'lucide-react';
import { analyzeCropQuality, type QualityResult } from '../../lib/qualityService';
import { MH_MARKETS } from '../../lib/priceService';
import { useTranslation } from 'react-i18next';

const CROPS = ['Tomato', 'Onion', 'Potato', 'Mango', 'Banana', 'Grapes', 'Orange', 'Wheat', 'Rice', 'Soybean', 'Cabbage', 'Cauliflower'];
const STORAGE_CONDITIONS = (t: (k: string) => string) => [
  { value: 'normal', label: t('cropQuality.storageNormal') },
  { value: 'cold',   label: t('cropQuality.storageCold') },
  { value: 'poor',   label: t('cropQuality.storagePoor') },
];

const gradeColor = {
  A: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', bar: '#0D592A' },
  B: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', bar: '#d97706' },
  C: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-300', bar: '#ef4444' },
};

const inputCls = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition';

export default function CropQuality() {
  const { t } = useTranslation();
  const storageConditions = STORAGE_CONDITIONS(t);
  const [form, setForm] = useState({
    crop: 'Tomato',
    image_url: '',
    market: 'Nashik',
    harvest_days_ago: '1',
    storage_condition: 'normal' as 'normal' | 'cold' | 'poor',
    transport_time_hours: '2',
  });
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QualityResult | null>(null);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Use a public placeholder URL for demo — in production upload to S3/Cloudinary
    const objectUrl = URL.createObjectURL(file);
    setUploadedUrl(objectUrl);
    // Use a stable demo image URL for the API call
    setForm(f => ({ ...f, image_url: `https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80` }));
  };

  const handleSubmit = async () => {
    const imageUrl = imageMode === 'upload' ? form.image_url : form.image_url;
    if (!form.crop || !imageUrl) { setError(t('cropQuality.errorMsg')); return; }
    setLoading(true); setResult(null); setError('');
    try {
      const res = await analyzeCropQuality({
        crop: form.crop,
        image_url: imageUrl,
        market: form.market,
        harvest_days_ago: Number(form.harvest_days_ago),
        storage_condition: form.storage_condition,
        transport_time_hours: Number(form.transport_time_hours),
      });
      setResult(res);
    } catch {
      setError(t('cropQuality.errorFailed'));
    } finally {
      setLoading(false);
    }
  };

  const gc = result ? gradeColor[result.quality_grade] : null;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">{t('cropQuality.title')}</h1>
        </div>
        <p className="text-gray-500 text-sm">{t('cropQuality.subtitle')}</p>
      </div>

      {/* Input card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-5 space-y-4">

        {/* Crop + market */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t('cropQuality.crop')}</label>
            <input list="quality-crops" value={form.crop} onChange={set('crop')} placeholder="e.g. Tomato" className={inputCls} />
            <datalist id="quality-crops">{CROPS.map(c => <option key={c} value={c} />)}</datalist>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t('cropQuality.market')}</label>
            <input list="quality-markets" value={form.market} onChange={set('market')} className={inputCls} />
            <datalist id="quality-markets">{MH_MARKETS.map(m => <option key={m} value={m} />)}</datalist>
          </div>
        </div>

        {/* Image input */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t('cropQuality.cropImage')}</label>
          <div className="flex gap-2 mb-2">
            <button onClick={() => setImageMode('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition border-2 ${imageMode === 'url' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}>
              <LinkIcon className="w-3.5 h-3.5" /> {t('cropQuality.imageUrl')}
            </button>
            <button onClick={() => setImageMode('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition border-2 ${imageMode === 'upload' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}>
              <Upload className="w-3.5 h-3.5" /> {t('cropQuality.uploadPhoto')}
            </button>
          </div>
          {imageMode === 'url' ? (
            <input value={form.image_url} onChange={set('image_url')}
              placeholder="https://example.com/tomato.jpg"
              className={inputCls} />
          ) : (
            <div>
              <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-500">{t('cropQuality.clickUpload')}</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              {uploadedUrl && (
                <div className="mt-2 relative h-32 rounded-xl overflow-hidden">
                  <img src={uploadedUrl} alt="Uploaded crop" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Harvest + storage + transport */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Harvest (days ago)</label>
            <input type="number" min="0" value={form.harvest_days_ago} onChange={set('harvest_days_ago')} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Storage</label>
            <select value={form.storage_condition} onChange={set('storage_condition')} className={inputCls}>
              {storageConditions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Transport (hrs)</label>
            <input type="number" min="0" value={form.transport_time_hours} onChange={set('transport_time_hours')} className={inputCls} />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={!form.crop || (!form.image_url && !uploadedUrl) || loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg shadow-green-200 disabled:opacity-40 disabled:cursor-not-allowed">
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analysing crop...</>
            : <><Sparkles className="w-4 h-4" /> Check Quality <ChevronRight className="w-4 h-4" /></>}
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && gc && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

            {/* Grade hero */}
            <div className={`rounded-3xl border-2 ${gc.border} overflow-hidden shadow-lg`}>
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">Quality Grade</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-5xl font-black ${gc.text.replace('text-', 'text-')} ${gc.bg} px-4 py-1 rounded-2xl`}>
                      {result.quality_grade}
                    </span>
                    <div>
                      <p className="text-white font-bold text-lg">{form.crop}</p>
                      <p className="text-gray-400 text-xs">{form.market} · {form.harvest_days_ago} days since harvest</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs mb-1">Confidence</p>
                  <p className="text-white font-black text-2xl">{Math.round(result.confidence * 100)}%</p>
                </div>
              </div>

              <div className={`${gc.bg} p-6 space-y-4`}>
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Leaf, label: 'Freshness Score', value: `${Math.round(result.freshness_score * 100)}%`, bar: result.freshness_score },
                    { icon: TrendingDown, label: 'Defect %', value: `${Math.round(result.defect_percentage * 100)}%`, bar: result.defect_percentage, invert: true },
                  ].map(({ icon: Icon, label, value, bar, invert }) => (
                    <div key={label} className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <p className="text-xs text-gray-500">{label}</p>
                      </div>
                      <p className="text-xl font-black text-gray-900 mb-2">{value}</p>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                          animate={{ width: `${bar * 100}%` }} transition={{ duration: 1 }}
                          style={{ backgroundColor: invert ? (bar > 0.2 ? '#ef4444' : '#0D592A') : gc.bar }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shelf life */}
                <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Estimated Shelf Life</p>
                    <p className="text-2xl font-black text-gray-900">{result.estimated_shelf_life_days} <span className="text-sm font-semibold text-gray-400">days</span></p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Recommendation</p>
                    <p className="text-sm font-bold text-gray-800">{result.recommendation}</p>
                  </div>
                </div>

                {result.source === 'fallback' && (
                  <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" /> ML service unavailable — showing estimated result
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
