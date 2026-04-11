import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer, MapPin, Package, Phone, CheckCircle2,
  X, Plus, Clock, TrendingUp, Snowflake, AlertTriangle,
  ChevronRight, Warehouse, Activity, ChevronDown, Filter,
} from 'lucide-react';
import {
  facilities as seedFacilities, coldStorageStore,
  type StorageFacility, type StoredCrop,
} from '../../lib/coldStorageStore';

const statusCfg = {
  Optimal:  { color: 'text-green-700',  bg: 'bg-green-100',  dot: 'bg-green-500',  icon: CheckCircle2 },
  Moderate: { color: 'text-yellow-700', bg: 'bg-yellow-100', dot: 'bg-yellow-500', icon: AlertTriangle },
  Risk:     { color: 'text-red-600',    bg: 'bg-red-100',    dot: 'bg-red-500',    icon: AlertTriangle },
};

const cropStatusCfg = {
  Stored: { color: 'text-blue-700',   bg: 'bg-blue-100'   },
  Listed: { color: 'text-purple-700', bg: 'bg-purple-100' },
  Sold:   { color: 'text-gray-500',   bg: 'bg-gray-100'   },
};

function daysStored(entryDate: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(entryDate).getTime()) / 86400000));
}

function shelfPct(entry: string, shelf: number) {
  return Math.min(100, Math.round((daysStored(entry) / shelf) * 100));
}

// ── Book Modal ────────────────────────────────────────────────────────────────
function BookModal({ facility, onClose }: { facility: StorageFacility; onClose: () => void }) {
  const [crop, setCrop] = useState('');
  const [qty, setQty] = useState('');
  const [shelf, setShelf] = useState('10');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleBook = async () => {
    if (!crop || !qty) return;
    setLoading(true);
    await coldStorageStore.add({
      farmerId: 'demo',
      cropName: crop,
      quantity: `${qty} kg`,
      storageId: facility.id,
      storageName: facility.name,
      entryDate: new Date().toISOString().split('T')[0],
      expectedShelfLife: Number(shelf),
      status: 'Stored',
    });
    setLoading(false);
    setDone(true);
  };

  const inputCls = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Slot Booked!</h3>
            <p className="text-gray-500 text-sm mb-1"><strong>{qty} kg</strong> of <strong>{crop}</strong> stored at <strong>{facility.name}</strong>.</p>
            <p className="text-gray-400 text-xs mb-6">Entry: {new Date().toLocaleDateString('en-IN')}</p>
            <button onClick={onClose} className="w-full py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition" style={{ backgroundColor: '#0D592A' }}>Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-black text-gray-900">Book Storage Slot</h3>
                <p className="text-xs text-gray-400">{facility.name} · {facility.location}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"><X className="w-4 h-4 text-gray-600" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 bg-blue-50 rounded-2xl p-3">
                <Snowflake className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="text-xs text-blue-700">
                  <span className="font-bold">{facility.tempRange}</span> · Rs.{facility.pricePerTonPerDay}/ton/day · <span className="font-bold">{facility.availableTons}t</span> available
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Crop Name *</label>
                <input list="cold-crops" value={crop} onChange={e => setCrop(e.target.value)} placeholder="e.g. Tomato, Onion..." className={inputCls} />
                <datalist id="cold-crops">{facility.crops.map(c => <option key={c} value={c} />)}</datalist>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Quantity (kg) *</label>
                  <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="e.g. 500" className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Shelf Life</label>
                  <select value={shelf} onChange={e => setShelf(e.target.value)} className={inputCls}>
                    {[5, 7, 10, 14, 21, 30].map(d => <option key={d} value={d}>{d} days</option>)}
                  </select>
                </div>
              </div>
              {qty && crop && (
                <div className="bg-gray-50 rounded-2xl p-3 text-xs text-gray-600">
                  Estimated cost: <strong className="text-gray-800">Rs.{((Number(qty) / 1000) * facility.pricePerTonPerDay * Number(shelf)).toFixed(0)}</strong> for {shelf} days
                </div>
              )}
              <button onClick={handleBook} disabled={!crop || !qty || loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-40"
                style={{ backgroundColor: '#0D592A' }}>
                <Snowflake className="w-4 h-4" /> {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ── Facility Card ─────────────────────────────────────────────────────────────
function FacilityCard({ f, onBook }: { f: StorageFacility; onBook: (f: StorageFacility) => void }) {
  const cfg = statusCfg[f.status];
  const usedPct = Math.round(((f.capacityTons - f.availableTons) / f.capacityTons) * 100);
  const full = f.availableTons === 0;
  const [showLogs, setShowLogs] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-hover">
      <div className="relative h-36 overflow-hidden">
        <img src={f.img} alt={f.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {f.status}
          </span>
        </div>
        {f.status === 'Optimal' && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <p className="text-white font-black text-base">{f.name}</p>
          <p className="text-white/70 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> {f.location} · {f.distanceKm} km</p>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-bold text-blue-600"><Thermometer className="w-4 h-4" /> {f.tempRange}</div>
          <div className="text-sm font-bold text-gray-700">Rs.{f.pricePerTonPerDay}<span className="text-xs font-normal text-gray-400">/ton/day</span></div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Capacity used</span>
            <span className="font-bold">{usedPct}% · {f.availableTons}t free</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${usedPct}%`, backgroundColor: usedPct > 90 ? '#ef4444' : usedPct > 60 ? '#f59e0b' : '#0D592A' }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {f.crops.map(c => <span key={c} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100">{c}</span>)}
        </div>
        <button onClick={() => setShowLogs(v => !v)}
          className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition">
          <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-blue-500" /> Temperature Logs</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLogs ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {showLogs && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="space-y-1.5 pt-1">
                {f.logs.map((log, i) => (
                  <div key={i} className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs ${log.ok ? 'bg-green-50' : 'bg-red-50'}`}>
                    <span className="text-gray-500 font-mono w-12">{log.time}</span>
                    <span className={`font-bold ${log.ok ? 'text-green-700' : 'text-red-600'}`}>{log.temp}°C</span>
                    <span className="text-gray-400">{log.humidity}% RH</span>
                    <span className={`font-bold ${log.ok ? 'text-green-600' : 'text-red-500'}`}>{log.ok ? 'OK' : 'Alert'}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-2 pt-1">
          <button onClick={() => !full && onBook(f)} disabled={full}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#0D592A' }}>
            <Snowflake className="w-3.5 h-3.5" /> {full ? 'Full' : 'Book Slot'}
          </button>
          <a href={`tel:${f.phone}`} className="flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-blue-50 rounded-xl text-gray-500 hover:text-blue-600 transition" title="Call">
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ColdStorage() {
  const [tab, setTab] = useState<'facilities' | 'my-storage'>('facilities');
  const [booking, setBooking] = useState<StorageFacility | null>(null);
  const [stored, setStored] = useState(coldStorageStore.getAll());
  const [facilityList, setFacilityList] = useState<StorageFacility[]>(seedFacilities);
  const [showPicker, setShowPicker] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'All' | 'Optimal' | 'Moderate' | 'Risk'>('All');
  const [cropFilter, setCropFilter] = useState('All');
  const [myStatusFilter, setMyStatusFilter] = useState<'All' | 'Stored' | 'Listed' | 'Sold'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    coldStorageStore.subscribe(() => setStored(coldStorageStore.getAll()));
    coldStorageStore.fetchMy();
  }, []);

  useEffect(() => {
    coldStorageStore.fetchFacilities(statusFilter !== 'All' ? statusFilter : undefined)
      .then(setFacilityList);
  }, [statusFilter]);

  // All unique crops across facilities for filter
  const allCrops = ['All', ...Array.from(new Set(seedFacilities.flatMap(f => f.crops)))];

  const visibleFacilities = facilityList.filter(f => {
    if (cropFilter !== 'All' && !f.crops.includes(cropFilter)) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase()) && !f.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const visibleStored = stored.filter(s => {
    if (myStatusFilter !== 'All' && s.status !== myStatusFilter) return false;
    return true;
  });

  const totalStored = stored.filter(s => s.status === 'Stored').length;
  const totalListed = stored.filter(s => s.status === 'Listed').length;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center"><Snowflake className="w-4 h-4 text-blue-600" /></div>
            <h1 className="text-2xl font-black text-gray-900">Cold Storage</h1>
          </div>
          <p className="text-gray-500 text-sm">Store now, sell later — without losing quality.</p>
        </div>
        <button onClick={() => setShowPicker(true)}
          className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-2xl hover:opacity-90 transition shadow-lg text-sm w-fit"
          style={{ backgroundColor: '#0D592A' }}>
          <Plus className="w-4 h-4" /> Store My Crop
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Facilities Nearby', value: facilityList.length, icon: Warehouse, color: 'bg-blue-50 text-blue-600' },
          { label: 'Crops Stored', value: totalStored, icon: Package, color: 'bg-green-50 text-green-600' },
          { label: 'Listed for Sale', value: totalListed, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
          { label: 'Avg. Temp', value: '4°C', icon: Thermometer, color: 'bg-cyan-50 text-cyan-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`${color} rounded-2xl p-4`}>
            <Icon className="w-5 h-5 mb-2" />
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs font-semibold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit">
        {(['facilities', 'my-storage'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'facilities' ? 'Storage Facilities' : 'My Stored Crops'}
          </button>
        ))}
      </div>

      {/* ── Facilities Tab ── */}
      {tab === 'facilities' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
              <Filter className="w-3.5 h-3.5" /> Filters
            </div>
            <div className="flex flex-wrap gap-2">
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Status</p>
                <div className="flex gap-1.5 flex-wrap">
                  {(['All', 'Optimal', 'Moderate', 'Risk'] as const).map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${statusFilter === s ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      style={statusFilter === s ? { backgroundColor: '#0D592A' } : {}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Crop Type</p>
                <div className="flex gap-1.5 flex-wrap">
                  {allCrops.map(c => (
                    <button key={c} onClick={() => setCropFilter(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${cropFilter === c ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      style={cropFilter === c ? { backgroundColor: '#0D592A' } : {}}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name or location..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition" />
          </div>

          <p className="text-sm text-gray-400">{visibleFacilities.length} facilities found</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {visibleFacilities.map(f => <FacilityCard key={f.id} f={f} onBook={setBooking} />)}
          </div>
          {visibleFacilities.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Warehouse className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No facilities match your filters</p>
            </div>
          )}
        </div>
      )}

      {/* ── My Stored Crops Tab ── */}
      {tab === 'my-storage' && (
        <div className="space-y-4">
          {/* My status filter */}
          <div className="flex gap-2 flex-wrap">
            {(['All', 'Stored', 'Listed', 'Sold'] as const).map(s => (
              <button key={s} onClick={() => setMyStatusFilter(s)}
                className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${myStatusFilter === s ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
                style={myStatusFilter === s ? { backgroundColor: '#0D592A' } : {}}>
                {s}
              </button>
            ))}
          </div>

          {visibleStored.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Snowflake className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No crops {myStatusFilter !== 'All' ? `with status "${myStatusFilter}"` : 'stored yet'}</p>
              {myStatusFilter === 'All' && (
                <button onClick={() => setTab('facilities')}
                  className="mt-4 flex items-center gap-2 mx-auto px-5 py-2.5 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
                  style={{ backgroundColor: '#0D592A' }}>
                  <Plus className="w-4 h-4" /> Find Storage
                </button>
              )}
            </div>
          ) : (
            visibleStored.map(s => {
              const days = daysStored(s.entryDate);
              const pct = shelfPct(s.entryDate, s.expectedShelfLife);
              const fresh = pct < 60;
              const warning = pct >= 60 && pct < 85;
              const cfg = cropStatusCfg[s.status];
              return (
                <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Package className="w-5 h-5 text-blue-600" /></div>
                      <div>
                        <p className="font-bold text-gray-800">{s.cropName}</p>
                        <p className="text-xs text-gray-400">{s.quantity} · {s.storageName}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>{s.status}</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Stored for <strong className="ml-1">{days} day{days !== 1 ? 's' : ''}</strong></span>
                      <span className={`font-bold ${fresh ? 'text-green-600' : warning ? 'text-yellow-600' : 'text-red-500'}`}>{pct}% shelf life used</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: fresh ? '#0D592A' : warning ? '#f59e0b' : '#ef4444' }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {s.expectedShelfLife - days > 0 ? `${s.expectedShelfLife - days} days remaining` : 'Shelf life exceeded — sell immediately'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.storageName}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Entry: {s.entryDate}</span>
                    <span className="font-mono text-gray-400">ID: {s.storageId}</span>
                  </div>
                  {s.status === 'Stored' && (
                    <div className="flex gap-2">
                      <button onClick={() => coldStorageStore.updateStatus(s.id, 'Listed')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition"
                        style={{ backgroundColor: '#7c3aed' }}>
                        <TrendingUp className="w-3.5 h-3.5" /> List for Sale
                      </button>
                      <button onClick={() => coldStorageStore.remove(s.id)}
                        className="flex items-center justify-center w-10 h-10 bg-red-50 hover:bg-red-100 rounded-xl text-red-400 transition" title="Remove">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {s.status === 'Listed' && (
                    <div className="flex items-center gap-2 bg-purple-50 rounded-xl px-4 py-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      <p className="text-sm font-semibold text-purple-700">Listed for sale from storage</p>
                      <button onClick={() => coldStorageStore.updateStatus(s.id, 'Sold')}
                        className="ml-auto text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                        Mark Sold <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Facility picker */}
      <AnimatePresence>
        {showPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPicker(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-black text-gray-900">Choose a Storage Facility</h3>
                  <p className="text-xs text-gray-400">Select where you want to store your crop</p>
                </div>
                <button onClick={() => setShowPicker(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"><X className="w-4 h-4 text-gray-600" /></button>
              </div>
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {facilityList.map(f => {
                  const cfg = statusCfg[f.status];
                  const full = f.availableTons === 0;
                  return (
                    <button key={f.id} disabled={full}
                      onClick={() => { setShowPicker(false); setBooking(f); }}
                      className="w-full flex items-center gap-4 p-3 rounded-2xl border-2 border-gray-100 hover:border-green-300 hover:bg-green-50 transition text-left disabled:opacity-40 disabled:cursor-not-allowed">
                      <img src={f.img} alt={f.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-gray-800 text-sm">{f.name}</p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{f.status}</span>
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {f.location} · {f.distanceKm} km</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          <Thermometer className="w-3 h-3 inline mr-1 text-blue-500" />
                          {f.tempRange} · Rs.{f.pricePerTonPerDay}/ton/day · {full ? 'Full' : `${f.availableTons}t free`}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {booking && <BookModal facility={booking} onClose={() => setBooking(null)} />}
      </AnimatePresence>
    </div>
  );
}
