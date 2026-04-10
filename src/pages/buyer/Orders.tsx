import { Package, Clock, CheckCircle2, XCircle, ChevronRight, MapPin } from 'lucide-react';

const orders = [
  {
    id: 'ORD-2024-001',
    product: 'Organic Tomatoes',
    farmer: 'Green Valley Farm',
    location: 'Nairobi, Kenya',
    qty: '50 kg',
    total: '$125.00',
    status: 'Delivered',
    date: 'Dec 12, 2024',
    img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=80',
  },
  {
    id: 'ORD-2024-002',
    product: 'Premium Avocados',
    farmer: 'Hillside Orchards',
    location: 'Meru, Kenya',
    qty: '30 kg',
    total: '$96.00',
    status: 'In Transit',
    date: 'Dec 14, 2024',
    img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80&q=80',
  },
  {
    id: 'ORD-2024-003',
    product: 'Raw Honey',
    farmer: 'Bee Natural',
    location: 'Addis Ababa, Ethiopia',
    qty: '10 jars',
    total: '$80.00',
    status: 'Pending',
    date: 'Dec 15, 2024',
    img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=80&q=80',
  },
  {
    id: 'ORD-2024-004',
    product: 'Fresh Maize',
    farmer: 'Sunrise Farms',
    location: 'Kampala, Uganda',
    qty: '100 kg',
    total: '$80.00',
    status: 'Cancelled',
    date: 'Dec 10, 2024',
    img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=80&q=80',
  },
];

const statusConfig: Record<string, { color: string; icon: React.ElementType; bg: string }> = {
  Delivered: { color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle2 },
  'In Transit': { color: 'text-blue-700', bg: 'bg-blue-100', icon: Package },
  Pending: { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  Cancelled: { color: 'text-red-600', bg: 'bg-red-100', icon: XCircle },
};

export default function Orders() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
        <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: '4', color: 'bg-gray-50 text-gray-700' },
          { label: 'Delivered', value: '1', color: 'bg-green-50 text-green-700' },
          { label: 'In Transit', value: '1', color: 'bg-blue-50 text-blue-700' },
          { label: 'Pending', value: '1', color: 'bg-yellow-50 text-yellow-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {orders.map(order => {
            const cfg = statusConfig[order.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition group">
                <img src={order.img} alt={order.product} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm">{order.product}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3" /> {order.farmer} · {order.location}
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-gray-700">{order.total}</p>
                  <p className="text-xs text-gray-400">{order.qty}</p>
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
      </div>
    </div>
  );
}
