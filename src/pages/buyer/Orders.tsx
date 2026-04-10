import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Clock, CheckCircle2, XCircle, ChevronRight, MapPin,
  X, Phone, MessageCircle, Navigation, Truck,
} from 'lucide-react';
import { ordersStore, type Order } from '../../lib/ordersStore';

const statusConfig: Record<string, { color: string; icon: React.ElementType; bg: string }> = {
  Delivered:   { color: 'text-green-700',  bg: 'bg-green-100',  icon: CheckCircle2 },
  'In Transit':{ color: 'text-blue-700',   bg: 'bg-blue-100',   icon: Truck },
  Pending:     { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  Confirmed:   { color: 'text-purple-700', bg: 'bg-purple-100', icon: Package },
  Cancelled:   { color: 'text-red-600',    bg: 'bg-red-100',    icon: XCircle },
};

function TrackingModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const doneCount = order.tracking.filter(t => t.done).length;
  const progress = Math.round((doneCount / order.tracking.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden">

        {/* Map placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-green-800 to-emerald-600 overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=60)', backgroundSize: 'cover' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-white font-bold text-sm">Live Tracking</p>
            <p className="text-white/70 text-xs">{order.location} → {order.city}</p>
          </div>
          <a href={`https://www.google.com/maps/search/?api=1&query=${order.lat},${order.lng}`}
            target="_blank" rel="noopener noreferrer"
            className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white text-green-700 text-xs font-bold px-3 py-1.5 rounded-full shadow hover:bg-green-50 transition">
            <Navigation className="w-3 h-3" /> Open in Maps
          </a>
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition shadow">
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <img src={order.img} alt={order.product} className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <p className="font-black text-gray-900">{order.product}</p>
              <p className="text-xs text-gray-400">{order.id} · {order.qty} {order.unit}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Delivery Progress</span><span className="font-bold">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-green-500"
                initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }} />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3 mb-5">
            {order.tracking.map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${event.done ? 'bg-green-500' : 'bg-gray-200'}`}>
                  {event.done ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${event.done ? 'text-gray-800' : 'text-gray-400'}`}>{event.label}</p>
                  {event.time && <p className="text-xs text-gray-400">{event.time}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Contact farmer */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <a href={`https://wa.me/${order.farmerPhone.replace('+', '')}?text=Hi%2C%20I'm%20checking%20on%20my%20order%20${order.id}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 font-bold text-sm rounded-2xl hover:bg-green-100 transition">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <a href={`tel:${order.farmerPhone}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 font-bold text-sm rounded-2xl hover:bg-gray-100 transition">
              <Phone className="w-4 h-4" /> Call Farmer
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState(ordersStore.getAll());
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'All' | Order['status']>('All');

  useEffect(() => ordersStore.subscribe(() => setOrders(ordersStore.getAll())), []);

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  const counts = {
    All: orders.length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    'In Transit': orders.filter(o => o.status === 'In Transit').length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
        <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: counts.All, color: 'bg-gray-50 text-gray-700' },
          { label: 'Delivered', value: counts.Delivered, color: 'bg-green-50 text-green-700' },
          { label: 'In Transit', value: counts['In Transit'], color: 'bg-blue-50 text-blue-700' },
          { label: 'Pending', value: counts.Pending, color: 'bg-yellow-50 text-yellow-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['All', 'Pending', 'In Transit', 'Delivered', 'Cancelled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${filter === f ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            style={filter === f ? { backgroundColor: '#0D592A' } : {}}>
            {f} <span className="opacity-60 ml-1">({counts[f as keyof typeof counts] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No orders here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(order => {
              const cfg = statusConfig[order.status] || statusConfig.Pending;
              const StatusIcon = cfg.icon;
              return (
                <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition group cursor-pointer"
                  onClick={() => setSelected(order)}>
                  <img src={order.img} alt={order.product} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm">{order.product}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <MapPin className="w-3 h-3" /> {order.farmer} · {order.location}
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-gray-700">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{order.qty} {order.unit}</p>
                  </div>
                  <div className="hidden sm:block text-xs text-gray-400">{order.date}</div>
                  <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" /> {order.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <TrackingModal order={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
