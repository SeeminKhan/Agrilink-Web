// Shared reactive store for farmer's own listings

export type ListingStatus = 'Active' | 'Pending' | 'Sold';

export interface FarmerListing {
  id: number;
  name: string;
  variety: string;
  grade: string;
  qty: string;
  unit: string;
  price: number;          // ₹ per unit
  location: string;
  description: string;
  status: ListingStatus;
  img: string;
  images: string[];
  views: number;
  harvestDate: string;
  createdAt: string;
  batchId: string;
  qrDataUrl: string;      // base64 PNG of QR code
}

// Generate QR data URL using qrcode library
async function generateQR(batchId: string): Promise<string> {
  try {
    const QRCode = await import('qrcode');
    return await QRCode.toDataURL(
      `https://agrilink.in/verify/${batchId}`,
      { width: 200, margin: 1, color: { dark: '#0D592A', light: '#ffffff' } }
    );
  } catch {
    return '';
  }
}

const SEED_RAW = [
  {
    id: 1, name: 'Organic Tomatoes', variety: 'Desi', grade: 'Grade A',
    qty: '500', unit: 'kg', price: 28, location: 'Nashik, Maharashtra',
    description: 'Premium desi tomatoes grown using 100% organic methods. No pesticides.',
    status: 'Active' as ListingStatus,
    img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=90',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=90', 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&q=90'],
    views: 142, harvestDate: '10 Jan 2025', createdAt: '8 Jan 2025', batchId: 'AGRL-2025-TOM-001',
  },
  {
    id: 2, name: 'Fresh Maize', variety: 'Hybrid', grade: 'Grade B',
    qty: '1200', unit: 'kg', price: 18, location: 'Pune, Maharashtra',
    description: 'High-yield hybrid maize, perfect for milling and animal feed.',
    status: 'Active' as ListingStatus,
    img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=90',
    images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=90'],
    views: 89, harvestDate: '9 Jan 2025', createdAt: '7 Jan 2025', batchId: 'AGRL-2025-MAI-002',
  },
  {
    id: 3, name: 'Premium Onions', variety: 'Red Nasik', grade: 'Grade A',
    qty: '800', unit: 'kg', price: 22, location: 'Nashik, Maharashtra',
    description: 'Famous Nashik red onions. Sharp flavour, long shelf life. Export quality.',
    status: 'Pending' as ListingStatus,
    img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=90',
    images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=90'],
    views: 210, harvestDate: '12 Jan 2025', createdAt: '10 Jan 2025', batchId: 'AGRL-2025-ONI-003',
  },
  {
    id: 4, name: 'Sweet Potatoes', variety: 'Orange', grade: 'Grade B',
    qty: '400', unit: 'kg', price: 30, location: 'Solapur, Maharashtra',
    description: 'Nutritious orange-flesh sweet potatoes. High beta-carotene content.',
    status: 'Sold' as ListingStatus,
    img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=90',
    images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=90'],
    views: 67, harvestDate: '8 Jan 2025', createdAt: '6 Jan 2025', batchId: 'AGRL-2025-SWP-004',
  },
  {
    id: 5, name: 'Turmeric', variety: 'Erode', grade: 'Organic',
    qty: '200', unit: 'kg', price: 120, location: 'Sangli, Maharashtra',
    description: 'Pure organic turmeric with high curcumin content. Certified organic.',
    status: 'Active' as ListingStatus,
    img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=90',
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=90'],
    views: 305, harvestDate: '9 Jan 2025', createdAt: '5 Jan 2025', batchId: 'AGRL-2025-TUR-005',
  },
  {
    id: 6, name: 'Soybean', variety: 'JS-335', grade: 'Grade A',
    qty: '600', unit: 'kg', price: 45, location: 'Nagpur, Maharashtra',
    description: 'High-protein JS-335 soybean. Ideal for oil extraction and feed.',
    status: 'Active' as ListingStatus,
    img: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&q=90',
    images: ['https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&q=90'],
    views: 44, harvestDate: '12 Jan 2025', createdAt: '11 Jan 2025', batchId: 'AGRL-2025-SOY-006',
  },
];

// Initialise with empty QR — fill async after
let _listings: FarmerListing[] = SEED_RAW.map(s => ({ ...s, qrDataUrl: '' }));
let _nextId = 10;
const _listeners: Array<() => void> = [];
const notify = () => _listeners.forEach(fn => fn());

// Generate QRs for seed data in background
(async () => {
  for (const l of _listings) {
    l.qrDataUrl = await generateQR(l.batchId);
  }
  notify();
})();

export const farmerListingsStore = {
  getAll: () => _listings,
  getById: (id: number) => _listings.find(l => l.id === id),

  add: async (listing: Omit<FarmerListing, 'id' | 'views' | 'createdAt' | 'batchId' | 'qrDataUrl'>) => {
    const id = _nextId++;
    const batchId = `AGRL-${new Date().getFullYear()}-${listing.name.slice(0, 3).toUpperCase()}-${String(id).padStart(3, '0')}`;
    const qrDataUrl = await generateQR(batchId);
    const newListing: FarmerListing = {
      ...listing, id, views: 0,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      batchId,
      qrDataUrl,
    };
    _listings = [newListing, ..._listings];
    notify();
    return newListing;
  },

  update: (id: number, patch: Partial<FarmerListing>) => {
    _listings = _listings.map(l => l.id === id ? { ...l, ...patch } : l);
    notify();
  },

  remove: (id: number) => {
    _listings = _listings.filter(l => l.id !== id);
    notify();
  },

  subscribe: (fn: () => void) => {
    _listeners.push(fn);
    return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1); };
  },
};
