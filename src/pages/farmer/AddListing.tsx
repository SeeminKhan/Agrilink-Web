import { useState } from 'react';
import { Leaf, Tag, Award, Weight, MapPin, ImagePlus, DollarSign, ChevronRight, CheckCircle2, Lightbulb } from 'lucide-react';

const steps = ['Crop Info', 'Quantity & Price', 'Photos', 'Review'];
const grades = ['Grade A', 'Grade B', 'Grade C', 'Organic Certified'];
const crops = ['Tomatoes', 'Maize', 'Avocado', 'Cassava', 'Sweet Potato', 'Mango', 'Spinach', 'Beans', 'Rice', 'Wheat'];

const BRAND = '#0D592A';

export default function AddListing() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ crop: '', variety: '', grade: '', quantity: '', unit: 'kg', location: '', price: '', description: '' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none transition';

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Add New Listing</h1>
        <p className="text-gray-500 text-sm mt-1">List your crop for buyers to discover and purchase directly.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all"
              style={i < step ? { backgroundColor: BRAND, color: 'white' } : i === step ? { backgroundColor: BRAND, color: 'white', boxShadow: '0 4px 12px rgba(13,89,42,0.35)' } : { backgroundColor: '#f3f4f6', color: '#9ca3af' }}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className="text-xs font-semibold hidden sm:block" style={i === step ? { color: BRAND } : { color: '#9ca3af' }}>{s}</span>
            {i < steps.length - 1 && <div className="flex-1 h-0.5" style={{ backgroundColor: i < step ? BRAND : '#e5e7eb' }} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
        {step === 0 && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                <Leaf className="w-3.5 h-3.5" style={{ color: BRAND }} /> Crop Name
              </label>
              <select value={form.crop} onChange={e => set('crop', e.target.value)} className={inputClass}>
                <option value="">Select crop...</option>
                {crops.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                <Tag className="w-3.5 h-3.5" style={{ color: BRAND }} /> Variety
              </label>
              <input type="text" placeholder="e.g. Roma, Alphonso, Hybrid..." value={form.variety} onChange={e => set('variety', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                <Award className="w-3.5 h-3.5" style={{ color: BRAND }} /> Grade
              </label>
              <div className="grid grid-cols-2 gap-2">
                {grades.map(g => (
                  <button key={g} type="button" onClick={() => set('grade', g)}
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
              <input type="text" placeholder="City, Region, Country" value={form.location} onChange={e => set('location', e.target.value)} className={inputClass} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                <Weight className="w-3.5 h-3.5" style={{ color: BRAND }} /> Quantity Available
              </label>
              <div className="flex gap-2">
                <input type="number" placeholder="e.g. 500" value={form.quantity} onChange={e => set('quantity', e.target.value)} className={`${inputClass} flex-1`} />
                <select value={form.unit} onChange={e => set('unit', e.target.value)} className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none transition">
                  {['kg', 'tonnes', 'bags', 'crates', 'pieces'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                <DollarSign className="w-3.5 h-3.5" style={{ color: BRAND }} /> Expected Price (per unit)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                <input type="number" placeholder="0.00" value={form.price} onChange={e => set('price', e.target.value)} className={`${inputClass} pl-8`} />
              </div>
              <p className="flex items-center gap-1 text-xs mt-1.5 font-medium" style={{ color: BRAND }}>
                <Lightbulb className="w-3 h-3" /> Use AI Price Suggestion for optimal pricing
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Description</label>
              <textarea rows={4} placeholder="Describe your crop — freshness, harvest date, storage conditions..." value={form.description} onChange={e => set('description', e.target.value)} className={`${inputClass} resize-none`} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-up">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
              <ImagePlus className="w-3.5 h-3.5" style={{ color: BRAND }} /> Upload Crop Photos
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer bg-gray-50 hover:border-gray-300 transition">
              <ImagePlus className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500">Drag & drop photos here</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
              <button className="mt-4 px-5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Browse Files
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">Upload at least 2 photos. Clear, well-lit photos get 3x more inquiries.</p>
          </div>
        )}

        {step === 3 && (
          <div className="animate-slide-up space-y-4">
            <h3 className="font-bold text-gray-800 mb-2">Review Your Listing</h3>
            {[
              { label: 'Crop', value: form.crop || '—' },
              { label: 'Variety', value: form.variety || '—' },
              { label: 'Grade', value: form.grade || '—' },
              { label: 'Quantity', value: form.quantity ? `${form.quantity} ${form.unit}` : '—' },
              { label: 'Price', value: form.price ? `$${form.price}/${form.unit}` : '—' },
              { label: 'Location', value: form.location || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-bold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="px-5 py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition">
            Back
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-2xl hover:opacity-90 transition text-sm"
              style={{ backgroundColor: BRAND }}>
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-2xl hover:opacity-90 transition text-sm"
              style={{ backgroundColor: BRAND }}>
              <CheckCircle2 className="w-4 h-4" /> Submit Listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
