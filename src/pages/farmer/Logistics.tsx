import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, MapPin, Clock, Star, Phone, CheckCircle2,
  X, ChevronRight, Package, Banknote, Navigation,
  Snowflake, AlertCircle, Filter, Search, TruckIcon,
} from 'lucide-react';
import { SEED_VEHICLES, logisticsStore, type Vehicle, type LogisticsBooking, type VehicleType } from '../../lib/logisticsStore';
import { coldStorageStore } from '../../lib/coldStorageStore';
import { farmerListingsStore } from '../../lib/farmerListingsStore';

const MH_DESTINATIONS = [
  'Nashik APMC Market', 'Pune Market Yard', 'Mumbai Vashi Market',
  'Nagpur Kalamna Market', 'Aurangabad Market', 'Solapur Market',
  'Kolhapur Market', 'Sangli Market',
];

const VEHICLE_TYPES: VehicleType[] = ['Mini Truck', 'Pickup', 'Large Truck'];

const statusColor: Record<string, string> = {
  Assigned:     'bg-blue-100 text-blue-700',
  'On the Way': 'bg-yellow-100 text-yellow-700',
  'Picked Up':  'bg-orange-100 text-orange-700',
  'In Transit': 'bg-purple-100 text-purple-700',
  Delivered:    'bg-green-100 text-green-700',
};

// ── Vehicle Card ──────────────────────────────────────────────────────────────
function VehicleCard({ v, selected, distKm, onSelect }: { v: Vehicle; selected: boolean; distKm: number; onSelect: () => void }) {
  const busy = v.availability === 'Busy';
  const est = Math.round(distKm * v.costPerKm);
  const etaHrs = Math.ceil(distKm / 40);

  return (
    <button disabled={busy} onClick={onSelect}
      className={`w-full text-left rounded-2xl border-2 overflow-hidden transition ${busy ? 'opacity-50 cursor-not-allowed border-gray-100' : selected ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-300 bg-white'}`}>
      <div className="flex items-center gap-3 p-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected ? 'bg-green-500' : 'bg-gray-100'}`}>
          <Truck className={`w-5 h-5 ${selected ? 'text-white' : 'text-gray-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-bold text-gray-800 text-sm">{v.type}</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${busy ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>{v.availability}</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={v.avatar} alt={v.driverName} className="w-5 h-5 rounded-full object-cover" />
            <p className="text-xs text-gray-500">{v.driverName} · {v.vehicleNumber}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-black text-green-700 text-sm">Rs.{est}</p>
          <p className="text-xs text-gray-400">Rs.{v.costPerKm}/km · {v.capacity}</p>
          <div className="flex items-center gap-0.5 justify-end mt-0.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-500">{v.rating}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-3 pb-2 text-xs text-gray-400">
        <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {v.distanceKm} km away</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~{etaHrs}h delivery</span>
      </div>
    </button>
  );
}

// ── Booking Form ──────────────────────────────────────────────────────────────
function BookingForm({ onBooked }: { onBooked: (b: LogisticsBooking) => void }) {
  const storedCrops = coldStorageStore.getAll().filter(c => c.status === 'Stored');
  const listings = farmerListingsStore.getAll().filter(l => l.status === 'Active');

  const [fromCold, setFromCold] = useState(false);
  const [coldCropId, setColdCropId] = useState(storedCrops[0]?.id || '');
  const [farmPickup, setFarmPickup] = useState(listings[0]?.location || 'Nashik, Maharashtra');
  const [destination, setDestination] = useState(MH_DESTINATIONS[0]);
  const [customDest, setCustomDest] = useState('');
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [distanceKm, setDistanceKm] = useState('35');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>(SEED_VEHICLES);
  const [typeFilter, setTypeFilter] = useState<'All' | VehicleType>('All');
  const [availFilter, setAvailFilter] = useState<'All' | 'Available' | 'Busy'>('All');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedCrop = storedCrops.find(c => c.id === coldCropId);
  const pickupLocation = fromCold
    ? (selectedCrop?.storageName || '')
    : farmPickup;
  const dropLocation = destination === 'custom' ? customDest : destination;
  const dist = Number(distanceKm) || 35;
  const totalCost = selectedVehicle ? Math.round(dist * selectedVehicle.costPerKm) : 0;

  useEffect(() => {
    if (fromCold && selectedCrop) {
      setCropName(selectedCrop.cropName);
      setQuantity(selectedCrop.quantity);
    }
  }, [fromCold, coldCropId, selectedCrop]);

  useEffect(() => {
    logisticsStore.fetchVehicles({
      type: typeFilter !== 'All' ? typeFilter : undefined,
      availability: availFilter !== 'All' ? availFilter : undefined,
    }).then(setVehicles);
  }, [typeFilter, availFilter]);

  const visibleVehicles = vehicles.filter(v =>
    !vehicleSearch || v.driverName.toLowerCase().includes(vehicleSearch.toLowerCase()) || v.vehicleNumber.toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  const handleConfirm = async () => {
    if (!selectedVehicle) return;
    setLoading(true);
    const booking = await logisticsStore.book({
      vehicleId: selectedVehicle.id,
      pickupLocation,
      dropLocation,
      distanceKm: dist,
      cropName: cropName || 'Mixed Produce',
      quantity: quantity || '—',
      fromColdStorage: fromCold,
      coldStorageName: fromCold ? selectedCrop?.storageName : undefined,
    });
    setLoading(false);
    onBooked(booking);
  };

  const inputCls = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition';

  return (
    <div className="space-y-5">
      {/* Pickup source */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Pickup From</p>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setFromCold(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition border-2 ${!fromCold ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
            <MapPin className="w-4 h-4" /> My Farm
          </button>
          <button onClick={() => setFromCold(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition border-2 ${fromCold ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
            <Snowflake className="w-4 h-4" /> Cold Storage
          </button>
        </div>
        {fromCold ? (
          storedCrops.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> No crops in cold storage. Book a storage slot first.
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Select Stored Crop</label>
              <select value={coldCropId} onChange={e => setColdCropId(e.target.value)} className={inputCls}>
                {storedCrops.map(c => <option key={c.id} value={c.id}>{c.cropName} — {c.quantity} @ {c.storageName}</option>)}
              </select>
              {selectedCrop && (
                <div className="mt-2 flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2 text-xs text-blue-700">
                  <Snowflake className="w-3.5 h-3.5 shrink-0" /> Pickup: <strong className="ml-1">{pickupLocation}</strong>
                </div>
              )}
            </div>
          )
        ) : (
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Farm / Pickup Location</label>
            <input list="mh-locations" value={farmPickup} onChange={e => setFarmPickup(e.target.value)} placeholder="e.g. Nashik, Maharashtra" className={inputCls} />
            <datalist id="mh-locations">{listings.map(l => <option key={l.id} value={l.location} />)}</datalist>
          </div>
        )}
      </div>

      {/* Delivery details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Delivery Details</p>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Destination Market / Buyer</label>
          <select value={destination} onChange={e => { setDestination(e.target.value); setCustomDest(''); }} className={inputCls}>
            {MH_DESTINATIONS.map(d => <option key={d}>{d}</option>)}
            <option value="custom">Enter custom address...</option>
          </select>
          {destination === 'custom' && (
            <input value={customDest} onChange={e => setCustomDest(e.target.value)} placeholder="Enter full address" className={`${inputCls} mt-2`} />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Crop Name</label>
            <input value={cropName} onChange={e => setCropName(e.target.value)} placeholder="e.g. Tomato" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Quantity</label>
            <input value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g. 200 kg" className={inputCls} />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Estimated Distance (km)</label>
          <input type="number" value={distanceKm} onChange={e => setDistanceKm(e.target.value)} placeholder="35" className={inputCls} />
        </div>
      </div>

      {/* Vehicle selection with filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Available Vehicles</p>
        {/* Vehicle filters */}
        <div className="space-y-2 mb-4">
          <div className="flex gap-1.5 flex-wrap">
            {(['All', ...VEHICLE_TYPES] as const).map(t => (
              <button key={t} onClick={() => setTypeFilter(t as typeof typeFilter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${typeFilter === t ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={typeFilter === t ? { backgroundColor: '#0D592A' } : {}}>
                {t}
              </button>
            ))}
            {(['All', 'Available', 'Busy'] as const).map(a => (
              <button key={a} onClick={() => setAvailFilter(a)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${availFilter === a ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={availFilter === a ? { backgroundColor: '#0D592A' } : {}}>
                {a}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={vehicleSearch} onChange={e => setVehicleSearch(e.target.value)}
              placeholder="Search driver or vehicle number..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition" />
          </div>
        </div>
        <div className="space-y-3">
          {visibleVehicles.map(v => (
            <VehicleCard key={v.id} v={v} selected={selectedVehicle?.id === v.id} distKm={dist}
              onSelect={() => setSelectedVehicle(selectedVehicle?.id === v.id ? null : v)} />
          ))}
          {visibleVehicles.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">No vehicles match your filters</p>
          )}
        </div>
      </div>

      {/* Fare summary */}
      {selectedVehicle && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-green-200 shadow-sm p-5 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Fare Breakdown</p>
          {[
            ['Pickup', pickupLocation],
            ['Drop', dropLocation],
            ['Distance', `${dist} km`],
            ['Rate', `Rs.${selectedVehicle.costPerKm}/km`],
            ['Vehicle', `${selectedVehicle.type} · ${selectedVehicle.vehicleNumber}`],
            ['Driver', selectedVehicle.driverName],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-gray-500">{k}</span>
              <span className="font-semibold text-gray-800 text-right max-w-[55%] truncate">{v}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-800">Total Cost</span>
            <span className="text-xl font-black text-green-700">Rs.{totalCost}</span>
          </div>
          <button onClick={handleConfirm} disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition shadow-lg disabled:opacity-60"
            style={{ backgroundColor: '#0D592A' }}>
            <Truck className="w-4 h-4" /> {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ── Booking Card ──────────────────────────────────────────────────────────────
function BookingCard({ booking, onAdvance }: { booking: LogisticsBooking; onAdvance: () => void }) {
  const isDelivered = booking.status === 'Delivered';
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div>
          <p className="font-black text-gray-900 text-sm">{booking.id}</p>
          <p className="text-xs text-gray-400">{booking.bookedAt}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[booking.status]}`}>{booking.status}</span>
      </div>
      <div className="p-5 space-y-4">
        {/* Route */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1 pt-0.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="w-0.5 h-8 bg-gray-200" />
            <div className="w-3 h-3 rounded-full bg-red-400" />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-xs text-gray-400">Pickup</p>
              <p className="text-sm font-semibold text-gray-800">{booking.pickupLocation}</p>
              {booking.fromColdStorage && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 mt-0.5">
                  <Snowflake className="w-3 h-3" /> Cold Storage
                </span>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400">Drop</p>
              <p className="text-sm font-semibold text-gray-800">{booking.dropLocation}</p>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Package className="w-4 h-4 text-gray-400 mx-auto mb-1" />
            <p className="font-bold text-gray-700">{booking.cropName}</p>
            <p className="text-gray-400">{booking.quantity}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Navigation className="w-4 h-4 text-gray-400 mx-auto mb-1" />
            <p className="font-bold text-gray-700">{booking.distanceKm} km</p>
            <p className="text-gray-400">Distance</p>
          </div>
          <div className="bg-green-50 rounded-xl p-2.5 text-center">
            <Banknote className="w-4 h-4 text-green-600 mx-auto mb-1" />
            <p className="font-black text-green-700">Rs.{booking.totalCost}</p>
            <p className="text-gray-400">Total</p>
          </div>
        </div>
        {/* Driver */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <img src={booking.vehicle.avatar} alt={booking.vehicle.driverName} className="w-10 h-10 rounded-xl object-cover shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-gray-800 text-sm">{booking.vehicle.driverName}</p>
            <p className="text-xs text-gray-400">{booking.vehicle.type} · {booking.vehicle.vehicleNumber}</p>
          </div>
          <a href={`tel:${booking.vehicle.driverPhone}`}
            className="w-9 h-9 bg-green-100 hover:bg-green-200 rounded-xl flex items-center justify-center text-green-700 transition">
            <Phone className="w-4 h-4" />
          </a>
        </div>
        {/* Timeline */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Tracking</p>
          <div className="space-y-2">
            {booking.timeline.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-green-500' : 'bg-gray-100'}`}>
                  {step.done ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                </div>
                <p className={`text-sm font-semibold flex-1 ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</p>
                {step.time && <p className="text-xs text-gray-400 font-mono">{step.time}</p>}
              </div>
            ))}
          </div>
        </div>
        {!isDelivered ? (
          <button onClick={onAdvance}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 border-green-200 text-green-700 hover:bg-green-50 transition">
            <ChevronRight className="w-4 h-4" /> Advance Status (Demo)
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2.5 bg-green-50 rounded-xl text-green-700 text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" /> Delivered Successfully
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Logistics() {
  const [tab, setTab] = useState<'book' | 'my-bookings'>('book');
  const [bookings, setBookings] = useState(logisticsStore.getAll());
  const [statusFilter, setStatusFilter] = useState<'All' | string>('All');

  useEffect(() => {
    logisticsStore.subscribe(() => setBookings(logisticsStore.getAll()));
    logisticsStore.fetchMy();
  }, []);

  const handleBooked = () => {
    setBookings(logisticsStore.getAll());
    setTab('my-bookings');
  };

  const handleAdvance = async (id: string) => {
    await logisticsStore.advance(id);
    setBookings([...logisticsStore.getAll()]);
  };

  const statuses = ['All', 'Assigned', 'On the Way', 'Picked Up', 'In Transit', 'Delivered'];
  const visibleBookings = statusFilter === 'All' ? bookings : bookings.filter(b => b.status === statusFilter);

  const active    = bookings.filter(b => b.status !== 'Delivered').length;
  const delivered = bookings.filter(b => b.status === 'Delivered').length;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center"><Truck className="w-4 h-4 text-green-700" /></div>
            <h1 className="text-2xl font-black text-gray-900">Logistics</h1>
          </div>
          <p className="text-gray-500 text-sm">Book transport from farm or cold storage to market.</p>
        </div>
        <button onClick={() => setTab('book')}
          className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-2xl hover:opacity-90 transition shadow-lg text-sm w-fit"
          style={{ backgroundColor: '#0D592A' }}>
          <Truck className="w-4 h-4" /> Book Transport
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Bookings', value: bookings.length, color: 'bg-gray-50 text-gray-700' },
          { label: 'Active',         value: active,          color: 'bg-blue-50 text-blue-700' },
          { label: 'Delivered',      value: delivered,       color: 'bg-green-50 text-green-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit">
        {(['book', 'my-bookings'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'book' ? 'Book Transport' : `My Bookings (${bookings.length})`}
          </button>
        ))}
      </div>

      {tab === 'book' && <BookingForm onBooked={handleBooked} />}

      {tab === 'my-bookings' && (
        <div className="space-y-4">
          {/* Status filter */}
          <div className="flex gap-2 flex-wrap">
            {statuses.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${statusFilter === s ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
                style={statusFilter === s ? { backgroundColor: '#0D592A' } : {}}>
                {s}
              </button>
            ))}
          </div>

          {visibleBookings.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Truck className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No bookings {statusFilter !== 'All' ? `with status "${statusFilter}"` : 'yet'}</p>
              {statusFilter === 'All' && <p className="text-sm mt-1">Book a transport to get started.</p>}
            </div>
          ) : (
            visibleBookings.map(b => <BookingCard key={b.id} booking={b} onAdvance={() => handleAdvance(b.id)} />)
          )}
        </div>
      )}
    </div>
  );
}
