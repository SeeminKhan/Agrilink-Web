// Simple in-memory cart store for the landing page / marketplace

export interface CartItem {
  id: number;
  name: string;
  price: string;
  unit: string;
  image: string;
  seller: string;
  qty: number;
}

let _items: CartItem[] = [];
const _listeners: Array<() => void> = [];
const notify = () => _listeners.forEach(fn => fn());

export const cartStore = {
  getAll: () => _items,
  getCount: () => _items.reduce((s, i) => s + i.qty, 0),

  add: (product: Omit<CartItem, 'qty'>) => {
    const existing = _items.find(i => i.id === product.id);
    if (existing) {
      _items = _items.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
    } else {
      _items = [..._items, { ...product, qty: 1 }];
    }
    notify();
  },

  remove: (id: number) => {
    _items = _items.filter(i => i.id !== id);
    notify();
  },

  clear: () => { _items = []; notify(); },

  subscribe: (fn: () => void) => {
    _listeners.push(fn);
    return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1); };
  },
};
