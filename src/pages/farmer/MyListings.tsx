import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit2, Trash2, Plus, Search, Eye, X, Save,
  ImagePlus, CheckCircle, ChevronLeft, ChevronRight, QrCode, Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { farmerListingsStore, type FarmerListing } from '../../lib/farmerListingsStore';

const statusColor: Record<string, string> = {
  Active:  'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Sold:    'bg-gray-100 text-gray-500',
};
const filters = ['All', 'Active', 'Pending', 'Sold'] as const;
const grades  = ['Grade A', 'Grade B', 'Grade C', 'Organic'];
const units   = ['kg', 'quintal', 'tonne', 'bags', 'crates', 'jars', 'bunches', 'pieces'];

const MH_LOCATIONS = [
  'Nashik, Maharashtra', 'Pune, Maharashtra', 'Nagpur, Maharashtra',
  'Aurangabad, Maharashtra', 'Solapur, Maharashtra', 'Kolhapur, Maharashtra',
  'Satara, Maharashtra', 'Sangli, Maharashtra', 'Ahmednagar, Maharashtra',
  'Jalgaon, Maharashtra', 'Latur, Maharashtra', 'Nanded, Maharashtra',
];

// ── Image Gallery Modal ───────────────────────────────────────────────────────
function GalleryModal({ images, name, onClose }: { images: string[]; name: string; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <img src={images[idx]} alt={name} className="w-full max-h-[70vh] object-contain rounded-2xl" />
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={() => setIdx(i => (i - 1 + images.length) % images.length)}
              className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white text-sm">{idx + 1} / {images.length}</span>
            <button onClick={() => setIdx(i => (i + 1) % images.length)}
              className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── QR Code Modal ─────────────────────────────────────────────────────────────
function QRModal({ listing, onClose }: { listing: FarmerListing; onClose: () => void }) {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = listing.qrDataUrl;
    a.download = `${listing.batchId}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm z-10 p-6 text-center">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
          <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-5 h-5 text-green-700" />
        </div>
        <h3 className="font-black text-gray-900 mb-0.5">{listing.name}</h3>
        <p className="text-xs text-gray-400 mb-4 font-mono">{listing.batchId}</p>

        {listing.qrDataUrl ? (
          <div className="bg-gray-50 rounded-2xl p-4 mb-4 inline-block">
            <img src={listing.qrDataUrl} alt="QR Code" className="w-44 h-44 mx-auto" />
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 mb-4 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <p className="text-xs text-gray-500 mb-4">
          Buyers can scan this QR to verify crop authenticity, grade, and harvest details.
        </p>

        <div className="flex gap-3">
          <button onClick={handleDownload} disabled={!listing.qrDataUrl}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-40"
            style={{ backgroundColor: '#0D592A' }}>
            <Download className="w-4 h-4" /> Download QR
          </button>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
function EditModal({ listing, onClose }: { listing: FarmerListing; onClose: () => void }) {
  const [form, setForm] = useState({ ...listing });
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm(f => ({
          ...f,
          images: [...f.images, reader.result as string],
          img: f.images.length === 0 ? reader.result as string : f.img,
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => {
    setForm(f => {
      const imgs = f.images.filter((_, idx) => idx !== i);
      return { ...f, images: imgs, img: imgs[0] || f.img };
    });
  };

  const handleSave = () => {
    farmerListingsStore.update(listing.id, {
      ...form,
      price: Number(form.price),
    });
    setSaved(true);
    setTimeout(onClose, 900);
  };

  const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <h3 className="font-black text-gray-900">Edit Listing</h3>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Images */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Photos</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative h-24 rounded-xl overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <X className="w-3 h-3 text-white" />
                  </button>
                  {i === 0 && <span className="absolute bottom-1 left-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded font-bold">Main</span>}
                </div>
              ))}
              <button onClick={() => fileRef.current?.click()}
                className="h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-green-400 transition text-gray-400 hover:text-green-500">
                <ImagePlus className="w-5 h-5" />
                <span className="text-xs font-semibold">Add</span>
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Crop Name</label>
              <input value={form.name} onChange={set('name')} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Variety</label>
              <input value={form.variety} onChange={set('variety')} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Grade</label>
              <select value={form.grade} onChange={set('grade')} className={inputClass}>
                {grades.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Quantity</label>
              <input type="number" value={form.qty} onChange={set('qty')} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Unit</label>
              <select value={form.unit} onChange={set('unit')} className={inputClass}>
                {units.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Price (₹)</label>
              <input type="number" step="0.01" value={form.price} onChange={set('price')} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Status</label>
              <select value={form.status} onChange={set('status')} className={inputClass}>
                <option>Active</option><option>Pending</option><option>Sold</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Location</label>
              <input value={form.location} onChange={set('location')} list="mh-edit-locations" className={inputClass} />
              <datalist id="mh-edit-locations">
                {MH_LOCATIONS.map(l => <option key={l} value={l} />)}
              </datalist>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
              <textarea rows={3} value={form.description} onChange={set('description')} className={`${inputClass} resize-none`} />
            </div>
          </div>

          <button onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
            style={{ backgroundColor: '#0D592A' }}>
            {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
function DeleteConfirm({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm z-10 p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="font-black text-gray-900 mb-2">Delete Listing?</h3>
        <p className="text-sm text-gray-500 mb-6">"{name}" will be permanently removed from your listings.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MyListings() {
  const [listings, setListings] = useState(farmerListingsStore.getAll());
  const [filter, setFilter]     = useState<typeof filters[number]>('All');
  const [search, setSearch]     = useState('');
  const [editing, setEditing]   = useState<FarmerListing | null>(null);
  const [deleting, setDeleting] = useState<FarmerListing | null>(null);
  const [gallery, setGallery]   = useState<FarmerListing | null>(null);
  const [qrItem, setQrItem]     = useState<FarmerListing | null>(null);
  const { t } = useTranslation();

  useEffect(() => farmerListingsStore.subscribe(() => setListings(farmerListingsStore.getAll())), []);

  const filtered = listings.filter(l =>
    (filter === 'All' || l.status === filter) &&
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (deleting) { farmerListingsStore.remove(deleting.id); setDeleting(null); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{t('myListings.title')}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{t('myListings.totalListings', { count: listings.length })}</p>
        </div>
        <Link to="/farmer/add-listing"
          className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-2xl hover:opacity-90 transition shadow-lg text-sm w-fit"
          style={{ backgroundColor: '#0D592A' }}>
          <Plus className="w-4 h-4" /> {t('myListings.addListing')}
        </Link>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder={t('myListings.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === f ? 'text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
              style={filter === f ? { backgroundColor: '#0D592A' } : {}}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map(item => (
            <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-hover">

              {/* Image — large, clear, clickable */}
              <div className="relative h-52 overflow-hidden cursor-pointer group" onClick={() => setGallery(item)}>
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Dark gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[item.status]}`}>
                  {item.status}
                </span>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                  <Eye className="w-3 h-3" /> {item.views}
                </div>
                {/* Multiple images indicator */}
                {item.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                    1/{item.images.length}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-0.5">{item.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{item.variety} · {item.grade} · {item.location}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-lg" style={{ color: '#0D592A' }}>
                    ₹{item.price}<span className="text-xs font-semibold text-gray-400">/{item.unit}</span>
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">{item.qty} {item.unit}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-50 hover:bg-green-50 rounded-xl text-xs font-bold text-gray-600 hover:text-green-700 transition">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => setQrItem(item)}
                    className="flex items-center justify-center w-9 h-9 bg-green-50 hover:bg-green-100 rounded-xl text-green-600 transition"
                    title="View QR Code">
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setGallery(item)}
                    className="flex items-center justify-center w-9 h-9 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-500 transition"
                    title="View photos">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleting(item)}
                    className="flex items-center justify-center w-9 h-9 bg-red-50 hover:bg-red-100 rounded-xl text-red-500 transition"
                    title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-semibold">{t('myListings.noListings')}</p>
          <p className="text-sm mt-1">{t('myListings.noListingsHint')}</p>
        </div>
      )}

      <AnimatePresence>
        {editing  && <EditModal listing={editing} onClose={() => setEditing(null)} />}
        {deleting && <DeleteConfirm name={deleting.name} onConfirm={handleDelete} onClose={() => setDeleting(null)} />}
        {gallery  && <GalleryModal images={gallery.images} name={gallery.name} onClose={() => setGallery(null)} />}
        {qrItem   && <QRModal listing={qrItem} onClose={() => setQrItem(null)} />}
      </AnimatePresence>
    </div>
  );
}
