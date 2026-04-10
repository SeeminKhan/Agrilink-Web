import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2, TrendingUp, TrendingDown, Minus,
  ChevronRight, Info, AlertCircle,
} from 'lucide-react';
import { forecastDemand, type ForecastResult } from '../../lib/priceService';

const POPULAR_CROPS = [
  'Tomato', 'Onion', 'Potato', 'Wheat', 'Rice', 'Soybean',
  'Sugarcane', 'Cotton', 'Maize', 'Mango', 'Banana', 'Grape',
  'Pomegranate', 'Turmeric', 'Garlic', 'Cabbage',
];

const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-300 transition';

const trendColor = (t: string) =>
  t === 'Rising' ? '#059669' : t === 'Falling' ? '#dc2626' : '#6b7280';
const trendBg = (t: string) =>
  t === 'Rising' ? '#f0fdf4' : t === 'Falling' ? '#fef2f2' : '#f9fafb';
const TIcon = (t: string) =>
  t === 'Rising' ? TrendingUp : t === 'Falling' ? TrendingDown : Minus;

export default function DemandForecast() {
  const [crop, setCrop]       = useState('');
  const [steps, setSteps]     = useState('7');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<ForecastResult | null>(null);
  const [error, setError]     = useState('');

  const handleSubmit = async () => {
    if (!crop.trim()) return;
    setLoading(true); setResult(null); setError('');
    try {
      setResult(await forecastDemand(crop.trim(), Number(steps)));
    } catch (e: unknown) {
      setError('Forecast failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const maxDemand = result ? Math.max(...result.forecast.map(f => f.demand_estimate), 1) : 1;
  const totalDemand = result ? result.forecast.reduce((s, f) => s + f.demand_estimate, 0) : 0;
  const avgDemand = result ? totalDemand / result.forecast.length : 0;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Demand Forecasting</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Predict mandi demand for your crop using Holt-Winters time-series analysis.
        </p>
      </div>

      {/* Input card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Crop Name *</label>
              <input
                type="text"
                list="popular-crops"
                placeholder="e.g. Tomato, Onion, Wheat..."
                value={crop}
                onChange={e => setCrop(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className={inputClass}
              />
              <datalist id="popular-crops">
                {POPULAR_CROPS.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Forecast Period</label>
              <select value={steps} onChange={e => setSteps(e.target.value)} className={inputClass}>
                <option value="3">3 days</option>
                <option value="5">5 days</option>
                <option value="7">7 days</option>
                <option value="10">10 days</option>
                <option value="14">14 days</option>
              </select>
            </div>
          </div>

          {/* Quick crop chips */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Popular crops:</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CROPS.slice(0, 8).map(c => (
                <button key={c} type="button"
                  onClick={() => setCrop(c)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${crop === c ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-700'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!crop.trim() || loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg shadow-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Forecasting demand...</>
              : <><BarChart2 className="w-4 h-4" /> Generate Forecast <ChevronRight className="w-4 h-4" /></>}
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
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

            {/* Hero card */}
            <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 overflow-hidden shadow-xl shadow-emerald-200">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wide mb-1">Demand Forecast</p>
                    <p className="text-3xl font-black text-white capitalize">{result.crop}</p>
                    <p className="text-emerald-200 text-sm mt-1">Next {result.forecast.length} days · Maharashtra Mandis</p>
                  </div>
                  <div className="text-center rounded-2xl px-4 py-3" style={{ backgroundColor: trendBg(result.trend) }}>
                    {(() => { const I = TIcon(result.trend); return <I className="w-6 h-6 mx-auto mb-1" style={{ color: trendColor(result.trend) }} />; })()}
                    <p className="text-xs font-black" style={{ color: trendColor(result.trend) }}>{result.trend}</p>
                  </div>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Avg / Day', value: `${avgDemand.toFixed(1)} Q` },
                    { label: 'Peak Day', value: `${maxDemand.toFixed(1)} Q` },
                    { label: 'Total', value: `${totalDemand.toFixed(0)} Q` },
                  ].map(s => (
                    <div key={s.label} className="bg-white/20 rounded-2xl p-3 text-center">
                      <p className="text-white font-black text-lg">{s.value}</p>
                      <p className="text-white/60 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Source badge removed — local engine used silently */}
              </div>
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-5">
                Daily Demand Estimate (Quintals)
              </p>
              <div className="space-y-3">
                {result.forecast.map((f, i) => (
                  <motion.div key={f.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}>
                    <div className="flex items-center gap-3">
                      <div className="w-28 shrink-0">
                        <p className="text-xs font-bold text-gray-700">{f.day}</p>
                        <p className="text-xs text-gray-400">{f.date}</p>
                      </div>
                      <div className="flex-1 h-9 bg-gray-100 rounded-xl overflow-hidden relative">
                        <motion.div
                          className="h-full rounded-xl flex items-center justify-end pr-3"
                          style={{ background: 'linear-gradient(to right, #059669, #10b981)' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(8, (f.demand_estimate / maxDemand) * 100)}%` }}
                          transition={{ duration: 0.7, delay: i * 0.06, ease: 'easeOut' }}>
                          <span className="text-white text-xs font-black whitespace-nowrap">
                            {f.demand_estimate.toFixed(1)}
                          </span>
                        </motion.div>
                      </div>
                      <div className="w-16 text-right shrink-0">
                        <p className="text-xs font-bold text-gray-700">{f.demand_estimate.toFixed(1)} Q</p>
                        <p className="text-xs text-gray-400">{(f.demand_estimate * 100).toFixed(0)} kg</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                <Info className="w-3 h-3" /> 1 Quintal = 100 kg · Based on Maharashtra mandi historical patterns
              </p>
            </div>

            {/* Detailed table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Day-wise Breakdown</p>
                <p className="text-xs text-gray-400">Unit: Quintals</p>
              </div>
              <div className="divide-y divide-gray-50">
                {result.forecast.map((f, i) => (
                  <div key={f.date} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-700">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{f.day}</p>
                        <p className="text-xs text-gray-400">{f.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600">{f.demand_estimate.toFixed(1)} Q</p>
                      <p className="text-xs text-gray-400">≈ {(f.demand_estimate * 100).toFixed(0)} kg</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 bg-emerald-50 border-t border-emerald-100 flex justify-between">
                <p className="text-sm font-bold text-emerald-800">Total Forecast</p>
                <p className="text-sm font-black text-emerald-700">{totalDemand.toFixed(1)} Q · {(totalDemand * 100).toFixed(0)} kg</p>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
