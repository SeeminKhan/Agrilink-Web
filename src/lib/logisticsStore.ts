// Logistics store — API-first with mock fallback

import api from './api';

export type VehicleType = 'Mini Truck' | 'Pickup' | 'Large Truck';
export type AvailabilityStatus = 'Available' | 'Busy';
export type BookingStatus = 'Assigned' | 'On the Way' | 'Picked Up' | 'In Transit' | 'Delivered';

export interface Vehicle {
  id: string;
  type: VehicleType;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  distanceKm: number;
  costPerKm: number;
  capacity: string;
  availability: AvailabilityStatus;
  rating: number;
  avatar: string;
}

export interface LogisticsBooking {
  id: string;
  _id?: string;
  vehicleId: string;
  vehicle: Vehicle;
  pickupLocation: string;
  dropLocation: string;
  distanceKm: number;
  totalCost: number;
  cropName: string;
  quantity: string;
  bookedAt: string;
  status: BookingStatus;
  timeline: { label: BookingStatus; time: string; done: boolean }[];
  fromColdStorage: boolean;
  coldStorageName?: string;
}

// ── Seed vehicles (always available as fallback) ───────────────────────────────
export const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'V001', type: 'Mini Truck', driverName: 'Ramesh Patil', driverPhone: '+919876543210',
    vehicleNumber: 'MH-15-AB-1234', distanceKm: 2.4, costPerKm: 18, capacity: '1 ton',
    availability: 'Available', rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
  },
  {
    id: 'V002', type: 'Pickup', driverName: 'Suresh Jadhav', driverPhone: '+919765432109',
    vehicleNumber: 'MH-09-CD-5678', distanceKm: 4.1, costPerKm: 12, capacity: '500 kg',
    availability: 'Available', rating: 4.5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
  },
  {
    id: 'V003', type: 'Large Truck', driverName: 'Vijay Shinde', driverPhone: '+919654321098',
    vehicleNumber: 'MH-22-EF-9012', distanceKm: 7.8, costPerKm: 25, capacity: '5 tons',
    availability: 'Busy', rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80',
  },
  {
    id: 'V004', type: 'Mini Truck', driverName: 'Anil Deshmukh', driverPhone: '+919543210987',
    vehicleNumber: 'MH-04-GH-3456', distanceKm: 3.2, costPerKm: 16, capacity: '1.5 tons',
    availability: 'Available', rating: 4.6,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
  },
];

const TIMELINE_STEPS: BookingStatus[] = ['Assigned', 'On the Way', 'Picked Up', 'In Transit', 'Delivered'];

let _bookings: LogisticsBooking[] = [];
let _nextId = 1;
const _listeners: Array<() => void> = [];
const notify = () => _listeners.forEach(fn => fn());

const normaliseBooking = (raw: Record<string, unknown>): LogisticsBooking => {
  const vehicle: Vehicle = SEED_VEHICLES.find(v => v.id === raw.vehicleId) || {
    id: raw.vehicleId as string,
    type: (raw.vehicleType as VehicleType) || 'Mini Truck',
    driverName: raw.driverName as string,
    driverPhone: raw.driverPhone as string,
    vehicleNumber: raw.vehicleNumber as string,
    distanceKm: 0, costPerKm: 0, capacity: '—',
    availability: 'Available', rating: 0, avatar: '',
  };
  return {
    id: (raw._id as string) || (raw.id as string),
    _id: raw._id as string,
    vehicleId: raw.vehicleId as string,
    vehicle,
    pickupLocation: raw.pickupLocation as string,
    dropLocation: raw.dropLocation as string,
    distanceKm: raw.distanceKm as number,
    totalCost: raw.totalCost as number,
    cropName: raw.cropName as string,
    quantity: raw.quantity as string,
    bookedAt: raw.createdAt as string || raw.bookedAt as string || '',
    status: raw.status as BookingStatus,
    timeline: (raw.timeline as { label: BookingStatus; time: string; done: boolean }[]) || [],
    fromColdStorage: raw.fromColdStorage as boolean,
    coldStorageName: raw.coldStorageName as string | undefined,
  };
};

export const logisticsStore = {
  getAll: () => _bookings,

  // Fetch vehicles from API, fall back to seed
  fetchVehicles: async (filters?: { type?: string; availability?: string }): Promise<Vehicle[]> => {
    try {
      const { data } = await api.get('/logistics/vehicles', { params: filters });
      return data as Vehicle[];
    } catch {
      let result = [...SEED_VEHICLES];
      if (filters?.type && filters.type !== 'All') result = result.filter(v => v.type === filters.type);
      if (filters?.availability && filters.availability !== 'All') result = result.filter(v => v.availability === filters.availability);
      return result;
    }
  },

  // Fetch my bookings from API
  fetchMy: async () => {
    try {
      const { data } = await api.get('/logistics/my');
      _bookings = (data as Record<string, unknown>[]).map(normaliseBooking);
      notify();
    } catch {
      // keep existing
    }
  },

  book: async (params: {
    vehicleId: string;
    pickupLocation: string;
    dropLocation: string;
    distanceKm: number;
    cropName: string;
    quantity: string;
    fromColdStorage: boolean;
    coldStorageName?: string;
  }): Promise<LogisticsBooking> => {
    try {
      const { data } = await api.post('/logistics', params);
      const booking = normaliseBooking(data as Record<string, unknown>);
      _bookings = [booking, ..._bookings];
      notify();
      return booking;
    } catch {
      // fallback mock
      const vehicle = SEED_VEHICLES.find(v => v.id === params.vehicleId)!;
      const totalCost = Math.round(params.distanceKm * vehicle.costPerKm);
      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const booking: LogisticsBooking = {
        id: `LOG-${String(_nextId++).padStart(3, '0')}`,
        vehicleId: params.vehicleId,
        vehicle,
        pickupLocation: params.pickupLocation,
        dropLocation: params.dropLocation,
        distanceKm: params.distanceKm,
        totalCost,
        cropName: params.cropName,
        quantity: params.quantity,
        bookedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        status: 'Assigned',
        fromColdStorage: params.fromColdStorage,
        coldStorageName: params.coldStorageName,
        timeline: TIMELINE_STEPS.map((label, i) => ({ label, done: i === 0, time: i === 0 ? now : '' })),
      };
      _bookings = [booking, ..._bookings];
      notify();
      return booking;
    }
  },

  advance: async (id: string) => {
    // Optimistic update
    _bookings = _bookings.map(b => {
      if (b.id !== id) return b;
      const currentIdx = TIMELINE_STEPS.indexOf(b.status);
      if (currentIdx >= TIMELINE_STEPS.length - 1) return b;
      const nextStatus = TIMELINE_STEPS[currentIdx + 1];
      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      return {
        ...b,
        status: nextStatus,
        timeline: b.timeline.map((t, i) =>
          i <= currentIdx + 1 ? { ...t, done: true, time: t.time || now } : t
        ),
      };
    });
    notify();
    try {
      await api.patch(`/logistics/${id}/advance`);
    } catch { /* keep optimistic */ }
  },

  subscribe: (fn: () => void) => {
    _listeners.push(fn);
    return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1); };
  },
};
