// Cold Storage store — API-first with mock fallback

import api from './api';

export type StorageStatus = 'Optimal' | 'Moderate' | 'Risk';

export interface TempLog {
  time: string;
  temp: number;
  humidity: number;
  ok: boolean;
}

export interface StorageFacility {
  id: string;
  name: string;
  location: string;
  distanceKm: number;
  capacityTons: number;
  availableTons: number;
  pricePerTonPerDay: number;
  tempRange: string;
  status: StorageStatus;
  phone: string;
  crops: string[];
  img: string;
  logs: TempLog[];
}

export interface StoredCrop {
  id: string;
  _id?: string;
  farmerId: string;
  cropName: string;
  quantity: string;
  storageId: string;
  storageName: string;
  entryDate: string;
  expectedShelfLife: number;
  status: 'Stored' | 'Listed' | 'Sold';
  pricePerUnit?: number;
}

// ── Seed facilities (always available as fallback) ────────────────────────────
export const facilities: StorageFacility[] = [
  {
    id: 'ST001', name: 'Nashik Cold Hub', location: 'Nashik, Maharashtra',
    distanceKm: 4.2, capacityTons: 500, availableTons: 180, pricePerTonPerDay: 12,
    tempRange: '2–8°C', status: 'Optimal', phone: '+912532345678',
    crops: ['Tomato', 'Onion', 'Grapes', 'Pomegranate'],
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
    logs: [
      { time: '06:00', temp: 4, humidity: 85, ok: true },
      { time: '09:00', temp: 5, humidity: 84, ok: true },
      { time: '12:00', temp: 6, humidity: 83, ok: true },
      { time: '15:00', temp: 5, humidity: 85, ok: true },
      { time: '18:00', temp: 4, humidity: 86, ok: true },
      { time: '21:00', temp: 4, humidity: 85, ok: true },
    ],
  },
  {
    id: 'ST002', name: 'Pune AgroFreeze', location: 'Pune, Maharashtra',
    distanceKm: 12.8, capacityTons: 300, availableTons: 60, pricePerTonPerDay: 15,
    tempRange: '0–5°C', status: 'Moderate', phone: '+912022345678',
    crops: ['Potato', 'Cabbage', 'Cauliflower', 'Strawberry'],
    img: 'https://images.unsplash.com/photo-1565793979680-f1d3f3b5e5e5?w=600&q=80',
    logs: [
      { time: '06:00', temp: 3, humidity: 80, ok: true },
      { time: '09:00', temp: 4, humidity: 79, ok: true },
      { time: '12:00', temp: 7, humidity: 78, ok: false },
      { time: '15:00', temp: 6, humidity: 80, ok: false },
      { time: '18:00', temp: 5, humidity: 81, ok: true },
      { time: '21:00', temp: 4, humidity: 82, ok: true },
    ],
  },
  {
    id: 'ST003', name: 'Nagpur CoolStore', location: 'Nagpur, Maharashtra',
    distanceKm: 28.5, capacityTons: 800, availableTons: 420, pricePerTonPerDay: 10,
    tempRange: '4–10°C', status: 'Optimal', phone: '+917122345678',
    crops: ['Orange', 'Mango', 'Banana', 'Soybean'],
    img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
    logs: [
      { time: '06:00', temp: 6, humidity: 75, ok: true },
      { time: '09:00', temp: 7, humidity: 74, ok: true },
      { time: '12:00', temp: 8, humidity: 73, ok: true },
      { time: '15:00', temp: 8, humidity: 74, ok: true },
      { time: '18:00', temp: 7, humidity: 75, ok: true },
      { time: '21:00', temp: 6, humidity: 76, ok: true },
    ],
  },
  {
    id: 'ST004', name: 'Solapur FreshVault', location: 'Solapur, Maharashtra',
    distanceKm: 45.0, capacityTons: 200, availableTons: 0, pricePerTonPerDay: 11,
    tempRange: '3–7°C', status: 'Risk', phone: '+912172345678',
    crops: ['Pomegranate', 'Turmeric', 'Onion'],
    img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80',
    logs: [
      { time: '06:00', temp: 5, humidity: 70, ok: true },
      { time: '09:00', temp: 9, humidity: 68, ok: false },
      { time: '12:00', temp: 12, humidity: 65, ok: false },
      { time: '15:00', temp: 11, humidity: 66, ok: false },
      { time: '18:00', temp: 9, humidity: 68, ok: false },
      { time: '21:00', temp: 8, humidity: 70, ok: false },
    ],
  },
];

// ── In-memory fallback store ───────────────────────────────────────────────────
let _stored: StoredCrop[] = [
  {
    id: 'SC001', farmerId: 'demo', cropName: 'Tomato', quantity: '200 kg',
    storageId: 'ST001', storageName: 'Nashik Cold Hub',
    entryDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    expectedShelfLife: 10, status: 'Stored',
  },
];

let _nextId = 2;
const _listeners: Array<() => void> = [];
const notify = () => _listeners.forEach(fn => fn());

const normalise = (raw: Record<string, unknown>): StoredCrop => ({
  id: (raw._id as string) || (raw.id as string),
  _id: raw._id as string,
  farmerId: raw.farmerId as string,
  cropName: raw.cropName as string,
  quantity: raw.quantity as string,
  storageId: raw.storageId as string,
  storageName: raw.storageName as string,
  entryDate: raw.entryDate as string,
  expectedShelfLife: raw.expectedShelfLife as number,
  status: raw.status as StoredCrop['status'],
  pricePerUnit: raw.pricePerUnit as number | undefined,
});

export const coldStorageStore = {
  getAll: () => _stored,

  // Fetch from API, fall back to mock
  fetchMy: async () => {
    try {
      const { data } = await api.get('/cold-storage/my');
      _stored = (data as Record<string, unknown>[]).map(normalise);
      notify();
    } catch {
      // keep mock data
    }
  },

  // Fetch facilities from API (falls back to exported `facilities` array)
  fetchFacilities: async (statusFilter?: string): Promise<StorageFacility[]> => {
    try {
      const params = statusFilter && statusFilter !== 'All' ? { status: statusFilter } : {};
      const { data } = await api.get('/cold-storage/facilities', { params });
      return data as StorageFacility[];
    } catch {
      return statusFilter && statusFilter !== 'All'
        ? facilities.filter(f => f.status === statusFilter)
        : facilities;
    }
  },

  add: async (crop: Omit<StoredCrop, 'id' | '_id'>) => {
    try {
      const { data } = await api.post('/cold-storage', crop);
      const newEntry = normalise(data as Record<string, unknown>);
      _stored = [newEntry, ..._stored];
      notify();
      return newEntry;
    } catch {
      // fallback: add to mock
      const newEntry: StoredCrop = { ...crop, id: `SC${String(_nextId++).padStart(3, '0')}` };
      _stored = [newEntry, ..._stored];
      notify();
      return newEntry;
    }
  },

  updateStatus: async (id: string, status: StoredCrop['status']) => {
    // Optimistic update
    _stored = _stored.map(s => s.id === id ? { ...s, status } : s);
    notify();
    try {
      await api.patch(`/cold-storage/${id}/status`, { status });
    } catch { /* keep optimistic */ }
  },

  remove: async (id: string) => {
    _stored = _stored.filter(s => s.id !== id);
    notify();
    try {
      await api.delete(`/cold-storage/${id}`);
    } catch { /* keep optimistic */ }
  },

  subscribe: (fn: () => void) => {
    _listeners.push(fn);
    return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1); };
  },
};
