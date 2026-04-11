// Return requests store

export type ReturnReason = 'damage' | 'mismatch' | 'wrong_delivery';
export type ReturnStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
export type ReturnDecision = 'farmer_fault' | 'logistics' | 'storage' | 'false_claim' | null;
export type FarmerAction = 'accept' | 'reject' | 'partial' | null;

export interface ReturnRequest {
  id: string;
  orderId: string;
  product: string;
  farmer: string;
  qty: number;
  unit: string;
  total: number;
  img: string;
  reason: ReturnReason;
  description: string;
  proofFiles: string[];
  submittedAt: string;
  status: ReturnStatus;
  decision: ReturnDecision;
  refundType?: 'full' | 'partial' | 'replacement';
  isColdStorage: boolean;
  // Farmer response fields
  farmerAction: FarmerAction;
  farmerNote: string;
  respondedAt?: string;
}

export const reasonLabel: Record<ReturnReason, string> = {
  damage: 'Damage / Spoilage',
  mismatch: 'Quality Mismatch',
  wrong_delivery: 'Wrong Delivery',
};

let _requests: ReturnRequest[] = [
  {
    id: 'RET-001', orderId: 'ORD-2024-002', product: 'Premium Avocados',
    farmer: 'Hillside Orchards', qty: 30, unit: 'kg', total: 96,
    img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80&q=80',
    reason: 'mismatch', description: 'Grade declared as A but received Grade B quality.',
    proofFiles: ['photo1.jpg'],
    submittedAt: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    status: 'Under Review', decision: null, isColdStorage: false,
    farmerAction: null, farmerNote: '',
  },
];

let _nextId = 2;
const _listeners: Array<() => void> = [];
const notify = () => _listeners.forEach(fn => fn());

export const returnsStore = {
  getAll: () => _requests,

  hasReturn: (orderId: string) => _requests.some(r => r.orderId === orderId),

  add: (req: Omit<ReturnRequest, 'id' | 'submittedAt' | 'status' | 'decision' | 'farmerAction' | 'farmerNote'>) => {
    const newReq: ReturnRequest = {
      ...req,
      id: `RET-${String(_nextId++).padStart(3, '0')}`,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      decision: null,
      farmerAction: null,
      farmerNote: '',
    };
    _requests = [newReq, ..._requests];
    notify();
    return newReq;
  },

  // Farmer responds to a return request
  respond: (id: string, action: FarmerAction, note: string) => {
    _requests = _requests.map(r => {
      if (r.id !== id) return r;
      const status: ReturnStatus =
        action === 'accept'  ? 'Approved' :
        action === 'partial' ? 'Approved' :
        'Rejected';
      const decision: ReturnDecision =
        action === 'accept'  ? 'farmer_fault' :
        action === 'partial' ? 'farmer_fault' :
        'false_claim';
      const refundType =
        action === 'accept'  ? 'full' :
        action === 'partial' ? 'partial' :
        undefined;
      return {
        ...r,
        farmerAction: action,
        farmerNote: note,
        respondedAt: new Date().toISOString().split('T')[0],
        status,
        decision,
        refundType,
      };
    });
    notify();
  },

  subscribe: (fn: () => void) => {
    _listeners.push(fn);
    return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1); };
  },
};
