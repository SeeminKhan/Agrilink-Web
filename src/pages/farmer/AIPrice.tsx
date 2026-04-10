import { useState } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Minus, ChevronRight, Info } from 'lucide-react';

const crops = ['Tomatoes', 'Maize', 'Avocado', 'Cassava', 'Sweet Potato', 'Mango', 'Spinach', 'Beans', 'Rice', 'Wheat', 'Honey'];
const grades = ['Grade A', 'Grade B', 'Grade C', 'Organic Certified'];

interface PriceResult {
  suggested: string;
  low: string;
  high: string;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  insight: string;
}

export default function AIPrice() {
  const [crop, setCrop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PriceResult | null>(null);

  const handleSubmit = () => {
    if (!crop || !quantity || !grade) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult({
        suggested: '$2.80',
        low: '$2.20',
        high: '$3.40',
        trend: 'up',
        confidence: 87,
        insight: 'Tomato prices are rising due to seasonal demand. Grade A produce commands a 20% premium in urban markets this week.',
      });
    }, 2000);
  };

  const TrendIcon = result?.trend === 'up' ? TrendingUp : result?.trend === 'down' ? TrendingDown : Minus;
  const trendColor = result?.trend === 'up' ? '#0D592A' : result?.trend === 'down' ? '#dc2626' : '#6b7280';
  const trendBg = result?.trend === 'up' ? '#f0f7f3' : result?.trend === 'down' ? '#fef2f2' : '#f9fafb';

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">AI Price Suggestion</h1>
        </div>
        <p className="text-gray-500 text-sm">Get real-time market-based pricing powered by AI analysis.</p>
      </div>

      {/* Input card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
        <h3 className="font-bold text-gray-700 mb-5 text-sm uppercase tracking-wide">Enter Crop Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Crop Name</label>
            <select value={crop} onChange={e => setCrop(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-300 transition">
              <option value="">Select crop...</option>
              {crops.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Quantity (kg)</label>
              <input type="number" placeholder="e.g. 500" value={quantity} onChange={e => setQuantity(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-300 transition" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Grade</label>
              <select value={grade} onChange={e => setGrade(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-300 transition">
                <option value="">Select grade...</option>
                {grades.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!crop || !quantity || !grade || loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg shadow-purple-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing market data...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Get AI Suggested Price <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result card */}
      {result && (
        <div className="animate-slide-up">
          <div className="relative bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-xl shadow-purple-200">
            {/* Glass overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-purple-200 text-xs font-semibold uppercase tracking-wide mb-1">AI Suggested Price</p>
                  <p className="text-5xl font-black text-white">{result.suggested}</p>
                  <p className="text-purple-200 text-sm mt-1">per kg · {crop} · {grade}</p>
                </div>
                <div className="rounded-2xl p-3" style={{ backgroundColor: trendBg }}>
                  <TrendIcon className="w-8 h-8" style={{ color: trendColor }} />
                </div>
              </div>

              {/* Range */}
              <div className="glass rounded-2xl p-4 mb-4">
                <p className="text-white/60 text-xs mb-3 font-semibold uppercase tracking-wide">Market Price Range</p>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-white/60 text-xs">Low</p>
                    <p className="text-white font-bold">{result.low}</p>
                  </div>
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '65%', background: 'linear-gradient(to right, #fbbf24, #0D592A)' }} />
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-xs">High</p>
                    <p className="text-white font-bold">{result.high}</p>
                  </div>
                </div>
              </div>

              {/* Confidence */}
              <div className="glass rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">Confidence Score</p>
                  <p className="text-white font-black">{result.confidence}%</p>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${result.confidence}%`, background: 'linear-gradient(to right, #0D592A, #4d9d78)' }} />
                </div>
              </div>

              {/* Insight */}
              <div className="glass rounded-2xl p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-purple-200 shrink-0 mt-0.5" />
                  <p className="text-white/80 text-sm leading-relaxed">{result.insight}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
