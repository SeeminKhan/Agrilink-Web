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
    id: 'ORD-2024-001', productId: 1, product: 'Organic Tomatoes', farmer: 'Nashik Green Farms',
    farmerPhone: '+919876543210', location: 'Nashik, Maharashtra', qty: 50, unit: 'kg',
    pricePerUnit: 28, total: 1400, status: 'Delivered', date: 'Dec 12, 2024',
    img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&q=80',
    address: '14 MG Road', city: 'Nashik', paymentMethod: 'UPI',
    lat: 20.0059, lng: 73.7897,
    tracking: [
      { time: 'Dec 10, 09:00', label: 'Order Placed', done: true },
      { time: 'Dec 10, 14:00', label: 'Farmer Confirmed', done: true },
      { time: 'Dec 11, 08:00', label: 'Picked Up', done: true },
      { time: 'Dec 12, 11:00', label: 'In Transit', done: true },
      { time: 'Dec 12, 16:00', label: 'Delivered', done: true },
    ],
  },
  {
    id: 'ORD-2024-002', productId: 3, product: 'Premium Onions', farmer: 'Pune Agro Traders',
    farmerPhone: '+919823456789', location: 'Pune, Maharashtra', qty: 30, unit: 'kg',
    pricePerUnit: 22, total: 660, status: 'In Transit', date: 'Dec 14, 2024',
    img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=80&q=80',
    address: '7 Shivaji Nagar', city: 'Pune', paymentMethod: 'Net Banking',
    lat: 18.5204, lng: 73.8567,
    tracking: [
      { time: 'Dec 14, 10:00', label: 'Order Placed', done: true },
      { time: 'Dec 14, 13:00', label: 'Farmer Confirmed', done: true },
      { time: 'Dec 15, 07:00', label: 'Picked Up', done: true },
      { time: 'Dec 15, 14:00', label: 'In Transit', done: true },
      { time: 'Dec 16, 12:00', label: 'Delivered', done: false },
    ],
  },
  {
    id: 'ORD-2024-003', productId: 6, product: 'Organic Turmeric', farmer: 'Sangli Spice Farm',
    farmerPhone: '+919765432109', location: 'Sangli, Maharashtra', qty: 10, unit: 'kg',
    pricePerUnit: 120, total: 1200, status: 'Pending', date: 'Dec 15, 2024',
    img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=80&q=80',
    address: '22 Krishi Road', city: 'Sangli', paymentMethod: 'Cash on Delivery',
    lat: 16.8524, lng: 74.5815,
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
