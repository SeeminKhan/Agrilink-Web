import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw, CheckCircle2, XCircle, AlertCircle, Clock,
  Camera, FileText, ChevronRight, ShieldCheck, Star,
  Snowflake, Package, X, Upload,
} from 'lucide-react';
import { returnsStore, reasonLabel, type ReturnReason, type ReturnRequest } from '../../lib/returnsStore';
import { ordersStore } from '../../lib/ordersStore';

// ── Status tracker ────────────────────────────────────────────────────────────
const statusSteps = ['Submitted', 'Under Review', 'Approved', 'Rejected'] as const;

const statusCfg = {
  Submitted:     { color: 'text-blue-700',   bg: 'bg-blue-100',   icon: Clock },
  'Under Review':{ color: 'text-yellow-700', bg: 'bg-yellow-100', icon: AlertCircle },
  Approved:      { color: 'text-green-700',  bg: 'bg-green-100',  icon: CheckCircle2 },
  Rejected:      { color: 'text-red-600',    bg: 'bg-red-100',    icon: XCircle },
};

const decisionInfo = {
  farmer_fault: { label: 'Farmer at Fault', desc: 'Full refund issued. Farmer rating decreased.', color: 'text-red-600', bg: 'bg-red-50' },
  logistics:    { label: 'Logistics Issue', desc: 'Platform/logistics handling refund.', color: 'text-blue-600', bg: 'bg-blue-50' },
  storage:      { label: 'Storage Issue', desc: 'Cold storage provider is responsible.', color: 'text-purple-600', bg: 'bg-purple-50' },
  false_claim:  { label: 'Claim Rejected', desc: 'Buyer trust score decreased.', color: 'text-gray-600', bg: 'bg-gray-50' },
};

// ── Request Form Modal ────────────────────────────────────────────────────────
function RequestModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const allOrders = ordersStore.getAll();
  // Allow returns on Delivered or In Transit orders that don't already have a return
  const eligibleOrders = allOrders.filter(
    o => (o.status === 'Delivered' || o.status === 'In Transit') && !returnsStore.hasReturn(o.id)
  );

  const [orderId, setOrderId] = useState(eligibleOrders[0]?.id || '');
  const [reason, setReason] = useState<ReturnReason>('damage');
  const [desc, setDesc] = useState('');
  const [isCold, setIsCold] = useState(false);
  const [proofFiles, setProofFiles] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const selectedOrder = allOrders.find(o => o.id === orderId);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).map(f => f.name);
    setProofFiles(prev => [...prev, ...files]);
    setErrors(prev => ({ ...prev, proof: '' }));
  };

  const removeFile = (name: string) => setProofFiles(prev => prev.filter(f => f !== name));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!orderId) errs.order = 'Please select an order.';
    if (!desc.trim()) errs.desc = 'Please describe the issue.';
    if (proofFiles.length === 0) errs.proof = 'At least one photo or video is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !selectedOrder) return;
    returnsStore.add({
      orderId,
      product: selectedOrder.product,
      farmer: selectedOrder.farmer,
      qty: selectedOrder.qty,
      unit: selectedOrder.unit,
      total: selectedOrder.total,
      img: selectedOrder.img,
      reason,
      description: desc.trim(),
      proofFiles,
      isColdStorage: isCold,
      refundType: 'full',
    });
    setDone(true);
  };

  const inputCls = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!done ? onClose : undefined} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden max-h-[92vh] flex flex-col">

        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Return Submitted!</h3>
            <p className="text-gray-500 text-sm mb-1">
              Your return for <strong>{selectedOrder?.product}</strong> has been submitted.
            </p>
            <p className="text-gray-400 text-xs mb-6">You'll be notified within 24–48 hours.</p>
            <button onClick={() => { onClose(); onSuccess(); }}
              className="w-full py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
              style={{ backgroundColor: '#0D592A' }}>
              View My Returns
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="font-black text-gray-900">Request Return</h3>
                <p className="text-xs text-gray-400">All fields marked * are required</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">

              {/* No eligible orders */}
              {eligibleOrders.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
                  No eligible orders found. Returns are only available for Delivered or In Transit orders that haven't already been returned.
                </div>
              )}

              {/* Order select */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Select Order *</label>
                <select value={orderId} onChange={e => setOrderId(e.target.value)} className={inputCls}
                  disabled={eligibleOrders.length === 0}>
                  {eligibleOrders.length === 0
                    ? <option value="">No eligible orders</option>
                    : eligibleOrders.map(o => (
                        <option key={o.id} value={o.id}>{o.id} — {o.product} ({o.status})</option>
                      ))
                  }
                </select>
                {errors.order && <p className="text-xs text-red-500 mt-1">{errors.order}</p>}
              </div>

              {/* Order preview */}
              {selectedOrder && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <img src={selectedOrder.img} alt={selectedOrder.product}
                    className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{selectedOrder.product}</p>
                    <p className="text-xs text-gray-400">{selectedOrder.farmer} · {selectedOrder.qty} {selectedOrder.unit}</p>
                    <p className="text-xs text-gray-400">Total paid: <strong className="text-gray-700">${selectedOrder.total.toFixed(2)}</strong> · {selectedOrder.date}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>{selectedOrder.status}</span>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Reason for Return *</label>
                <div className="space-y-2">
                  {([
                    { value: 'damage',        label: 'Damage / Spoilage',  desc: 'Product is rotten, crushed, or unfit for use' },
                    { value: 'mismatch',      label: 'Quality Mismatch',   desc: 'Grade or quality does not match listing' },
                    { value: 'wrong_delivery',label: 'Wrong Delivery',     desc: 'Wrong crop type or quantity received' },
                  ] as { value: ReturnReason; label: string; desc: string }[]).map(r => (
                    <button key={r.value} onClick={() => setReason(r.value)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 transition text-left ${reason === r.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${reason === r.value ? 'border-green-500' : 'border-gray-300'}`}>
                        {reason === r.value && <div className="w-2 h-2 rounded-full bg-green-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{r.label}</p>
                        <p className="text-xs text-gray-400">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Describe the Issue *</label>
                <textarea rows={3} value={desc} onChange={e => { setDesc(e.target.value); setErrors(p => ({ ...p, desc: '' })); }}
                  placeholder="Be specific — e.g. 'Tomatoes were soft and mouldy, not Grade A as listed.'"
                  className={`${inputCls} resize-none ${errors.desc ? 'border-red-300 focus:ring-red-300' : ''}`} />
                {errors.desc && <p className="text-xs text-red-500 mt-1">{errors.desc}</p>}
              </div>

              {/* Photo/video upload — real file input */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Upload Proof * <span className="text-gray-400 normal-case font-normal">(photos or video)</span>
                </label>
                <div onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                    errors.proof ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
                  }`}>
                  <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500">Click to upload photos or video</p>
                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, MP4 accepted</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFiles} />
                {errors.proof && <p className="text-xs text-red-500 mt-1">{errors.proof}</p>}

                {proofFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {proofFiles.map(f => (
                      <div key={f} className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-1.5">
                        <Camera className="w-3.5 h-3.5 text-green-600 shrink-0" />
                        <span className="text-xs text-gray-700 flex-1 truncate">{f}</span>
                        <button onClick={() => removeFile(f)} className="text-gray-400 hover:text-red-500 transition">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cold storage toggle */}
              <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                <Snowflake className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-700 flex-1">Was this product from cold storage?</p>
                <button onClick={() => setIsCold(v => !v)}
                  className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${isCold ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${isCold ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {isCold && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
                  ⚠ Cold storage returns require strong proof. Temperature logs will be checked automatically.
                </div>
              )}

              <button onClick={handleSubmit}
                disabled={eligibleOrders.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-40"
                style={{ backgroundColor: '#0D592A' }}>
                <RotateCcw className="w-4 h-4" /> Submit Return Request
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ReturnPolicy() {
  const [tab, setTab] = useState<'policy' | 'my-returns'>('policy');
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState(returnsStore.getAll());

  useEffect(() => returnsStore.subscribe(() => setRequests(returnsStore.getAll())), []);
  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
              <RotateCcw className="w-4 h-4 text-orange-600" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Returns & Policy</h1>
          </div>
          <p className="text-gray-500 text-sm">Fair returns, verified quality, trusted trade.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-2xl hover:opacity-90 transition shadow-lg text-sm w-fit"
          style={{ backgroundColor: '#0D592A' }}>
          <RotateCcw className="w-4 h-4" /> Request Return
        </button>
      </div>

      {/* Quick policy banner */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl p-5 text-white">
        <p className="font-bold text-sm mb-3">Return Policy at a Glance</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { icon: CheckCircle2, text: 'Damage, mismatch, wrong delivery' },
            { icon: Clock, text: '24h fresh · 48h cold storage' },
            { icon: Camera, text: 'Photo/video proof required' },
            { icon: XCircle, text: 'No returns for natural variation' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-2 bg-white/10 rounded-xl p-2.5">
              <Icon className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-tight">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit">
        {(['policy', 'my-returns'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'policy' ? 'Return Policy' : `My Returns (${requests.length})`}
          </button>
        ))}
      </div>

      {/* ── Policy Tab ── */}
      {tab === 'policy' && (
        <div className="space-y-5">
          {/* When allowed */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" /> When Returns Are Allowed
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Quality Mismatch', desc: 'Product does not match declared grade (A/B/C), uploaded images, or inspection report.' },
                { title: 'Spoilage / Damage', desc: 'Produce is rotten, crushed, damaged, or unfit for sale.' },
                { title: 'Wrong Delivery', desc: 'Incorrect crop type or quantity was delivered.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* When NOT allowed */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" /> When Returns Are NOT Allowed
            </h3>
            <div className="space-y-2">
              {[
                'Change of mind after purchase',
                'Delay in checking the product',
                'Natural variation in size, color, or shape',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-gray-50 rounded-xl p-3 text-xs text-gray-500 italic">
              Agricultural products naturally vary — minor differences in size, color, or shape are not defects.
            </div>
          </div>

          {/* Cold storage rule */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-blue-500" /> Cold Storage Special Rule
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-blue-800 mb-2">If product was stored in verified cold storage:</p>
                <ul className="space-y-1.5 text-xs text-blue-700">
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Storage temperature logs are checked</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Storage duration is verified</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> If conditions were proper → strong proof required</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> If storage failed → storage provider is responsible</li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <Clock className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <p className="font-bold text-green-700">24 hours</p>
                  <p className="text-gray-500">Fresh produce</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <Snowflake className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <p className="font-bold text-blue-700">48 hours</p>
                  <p className="text-gray-500">Cold storage produce</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decision outcomes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" /> Decision Outcomes
            </h3>
            <div className="space-y-2">
              {Object.entries(decisionInfo).map(([key, val]) => (
                <div key={key} className={`flex items-start gap-3 p-3 rounded-xl ${val.bg}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${val.color.replace('text-', 'bg-')}`} />
                  <div>
                    <p className={`text-sm font-bold ${val.color}`}>{val.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust score */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" /> Trust Score System
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-green-600 fill-green-600" />
                  <p className="font-bold text-green-800 text-sm">Buyer Score</p>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Genuine claims → score increases</p>
                  <p className="flex items-center gap-2"><XCircle className="w-3 h-3 text-red-400" /> False claims → score decreases</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                  <span className="text-xs font-bold text-green-700">78/100</span>
                </div>
                <p className="text-xs text-green-700 font-bold mt-1">Reliable Buyer ✓</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                  <p className="font-bold text-amber-800 text-sm">Farmer Score</p>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Consistent quality → score increases</p>
                  <p className="flex items-center gap-2"><XCircle className="w-3 h-3 text-red-400" /> Complaints → score decreases</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="text-xs font-bold text-amber-700">92/100</span>
                </div>
                <p className="text-xs text-amber-700 font-bold mt-1">Trusted Farmer ✓</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── My Returns Tab ── */}
      {tab === 'my-returns' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <RotateCcw className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No return requests yet</p>
              <p className="text-sm mt-1">If you have an issue with an order, click "Request Return".</p>
            </div>
          ) : (
            requests.map(req => {
              const cfg = statusCfg[req.status];
              const StatusIcon = cfg.icon;
              const currentStep = statusSteps.indexOf(req.status as typeof statusSteps[number]);

              return (
                <motion.div key={req.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img src={req.img} alt={req.product}
                        className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div>
                        <p className="font-bold text-gray-800">{req.product}</p>
                        <p className="text-xs text-gray-400">{req.farmer} · {req.qty} {req.unit} · ${req.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{req.id} · {req.submittedAt}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" /> {req.status}
                    </span>
                  </div>

                  {/* Reason + cold storage */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-semibold">
                      {reasonLabel[req.reason]}
                    </span>
                    {req.isColdStorage && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                        <Snowflake className="w-3 h-3" /> Cold Storage
                      </span>
                    )}
                  </div>

                  {/* Status tracker */}
                  <div className="flex items-center gap-1 mb-4">
                    {['Submitted', 'Under Review', req.status === 'Rejected' ? 'Rejected' : 'Approved'].map((step, i) => {
                      const done = i <= (req.status === 'Rejected' ? 2 : currentStep);
                      const isRejected = step === 'Rejected' && req.status === 'Rejected';
                      return (
                        <div key={step} className="flex items-center gap-1 flex-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                            isRejected ? 'bg-red-500 text-white' : done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {isRejected ? '✗' : done ? '✓' : i + 1}
                          </div>
                          <span className="text-xs text-gray-400 hidden sm:block">{step}</span>
                          {i < 2 && <div className={`flex-1 h-0.5 ${done && i < currentStep ? 'bg-green-400' : 'bg-gray-200'}`} />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Decision */}
                  {req.decision && (
                    <div className={`rounded-xl p-3 ${decisionInfo[req.decision].bg}`}>
                      <p className={`text-sm font-bold ${decisionInfo[req.decision].color}`}>
                        {decisionInfo[req.decision].label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{decisionInfo[req.decision].desc}</p>
                      {req.refundType && (
                        <p className="text-xs font-semibold text-gray-600 mt-1">
                          Refund type: <span className="capitalize">{req.refundType}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-gray-500 mt-3 bg-gray-50 rounded-xl p-3 italic">"{req.description}"</p>

                  {/* Proof files */}
                  {req.proofFiles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {req.proofFiles.map(f => (
                        <span key={f} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                          <Camera className="w-3 h-3" /> {f}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Request modal */}
      <AnimatePresence>
        {showForm && (
          <RequestModal
            onClose={() => setShowForm(false)}
            onSuccess={() => { setShowForm(false); setTab('my-returns'); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
