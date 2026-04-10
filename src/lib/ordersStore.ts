// Shared in-memory orders store — keeps orders across buyer portal pages

export type OrderStatus = 'Pending' | 'Confirmed' | 'In Transit' | 'Delivered' | 'Cancelled';

export interface TrackingEvent {
  time: string;
  label: string;
  done: boolean;
}

export interface Order {
  id: string;
  productId: number;
  product: string;
  farmer: string;
  farmerPhone: string;
  location: string;
  qty: number;
  unit: string;
  pricePerUnit: number;
  total: number;
  status: OrderStatus;
  date: string;
  img: string;
  address: string;
  city: string;
  paymentMethod: string;
  tracking: TrackingEvent[];
  lat?: number;
  lng?: number;
}

let _orders: Order[] = [
  {
    id: 'ORD-2024-001', productId: 1, product: 'Organic Tomatoes', farmer: 'Green Valley Farm',
    farmerPhone: '+254712345678', location: 'Nairobi, Kenya', qty: 50, unit: 'kg',
    pricePerUnit: 2.5, total: 125, status: 'Delivered', date: 'Dec 12, 2024',
    img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=80',
    address: '14 Moi Avenue', city: 'Nairobi', paymentMethod: 'M-Pesa',
    lat: -1.286389, lng: 36.817223,
    tracking: [
      { time: 'Dec 10, 09:00', label: 'Order Placed', done: true },
      { time: 'Dec 10, 14:00', label: 'Farmer Confirmed', done: true },
      { time: 'Dec 11, 08:00', label: 'Picked Up', done: true },
      { time: 'Dec 12, 11:00', label: 'In Transit', done: true },
      { time: 'Dec 12, 16:00', label: 'Delivered', done: true },
    ],
  },
  {
    id: 'ORD-2024-002', productId: 3, product: 'Premium Avocados', farmer: 'Hillside Orchards',
    farmerPhone: '+254722456789', location: 'Meru, Kenya', qty: 30, unit: 'kg',
    pricePerUnit: 3.2, total: 96, status: 'In Transit', date: 'Dec 14, 2024',
    img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80&q=80',
    address: '7 Kenyatta Road', city: 'Meru', paymentMethod: 'Card',
    lat: 0.046667, lng: 37.649444,
    tracking: [
      { time: 'Dec 14, 10:00', label: 'Order Placed', done: true },
      { time: 'Dec 14, 13:00', label: 'Farmer Confirmed', done: true },
      { time: 'Dec 15, 07:00', label: 'Picked Up', done: true },
      { time: 'Dec 15, 14:00', label: 'In Transit', done: true },
      { time: 'Dec 16, 12:00', label: 'Delivered', done: false },
    ],
  },
  {
    id: 'ORD-2024-003', productId: 6, product: 'Raw Honey', farmer: 'Bee Natural',
    farmerPhone: '+251911234567', location: 'Addis Ababa, Ethiopia', qty: 10, unit: 'jars',
    pricePerUnit: 8, total: 80, status: 'Pending', date: 'Dec 15, 2024',
    img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=80&q=80',
    address: '22 Bole Road', city: 'Addis Ababa', paymentMethod: 'Cash on Delivery',
    lat: 9.005401, lng: 38.763611,
    tracking: [
      { time: 'Dec 15, 09:00', label: 'Order Placed', done: true },
      { time: '', label: 'Farmer Confirmed', done: false },
      { time: '', label: 'Picked Up', done: false },
      { time: '', label: 'In Transit', done: false },
      { time: '', label: 'Delivered', done: false },
    ],
  },
];

let _nextId = 5;
const _listeners: Array<() => void> = [];

export const ordersStore = {
  getAll: () => _orders,
  getById: (id: string) => _orders.find(o => o.id === id),
  add: (order: Omit<Order, 'id' | 'date' | 'tracking'>) => {
    const id = `ORD-2024-00${_nextId++}`;
    const newOrder: Order = {
      ...order, id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tracking: [
        { time: new Date().toLocaleString(), label: 'Order Placed', done: true },
        { time: '', label: 'Farmer Confirmed', done: false },
        { time: '', label: 'Picked Up', done: false },
        { time: '', label: 'In Transit', done: false },
        { time: '', label: 'Delivered', done: false },
      ],
    };
    _orders = [newOrder, ..._orders];
    _listeners.forEach(fn => fn());
    return newOrder;
  },
  subscribe: (fn: () => void) => {
    _listeners.push(fn);
    return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1); };
  },
};
