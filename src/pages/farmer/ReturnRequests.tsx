import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw, CheckCircle2, XCircle, AlertCircle, Clock,
  Camera, Package, X, ChevronRight, Snowflake, MessageSquare,
} from 'lucide-react';
import { returnsStore, reasonLabel, type ReturnRequest, type FarmerAction } from '../../lib/returnsStore';

const statusCfg = {
  Submitted:      { color: 'text-blue-700',   bg: 'bg-blue-100',   icon: Clock },
  'Under Review': { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: AlertCircle },
  Approved:       { color: 'text-green-700',  bg: 'bg-green-100',  icon: CheckCircle2 },
  Rejected:       { color: 'text-red-600',    bg: 'bg-red-100',    icon: XCircle },
};

// ── Respond Modal ─────────────────────────────────────────────────────────────
function RespondModal({ req, onClose }: { req: ReturnRequest; onClose: () => void }) {
  const [action, setAction] = useState<FarmerAction>(null);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!action) { setError('Please select a response.'); return; }
    if (!note.trim()) { setError('Please add a note to the buyer.'); return; }
    returnsStore.respond(req.id, action, note.trim());
    setDone(true);
  };

  const inputCls = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition';

  const actions: { value: FarmerAction; label: string; desc: string; color: string; bg: string }[] = [
    {
      value: 'accept',
      label: 'Accept Return — Full Refund',
      desc: 'You agree the issue is valid. Buyer gets a full refund.',
      color: 'border-green-500 bg-green-50',
      bg: 'text-green-700',
    },
    {
      value: 'partial',
      label: 'Accept Partially — Partial Refund',
      desc: 'Issue is partially valid. Agree on a partial refund.',
      color: 'border-yellow-500 bg-yellow-50',
      bg: 'text-yellow-700',
    },
    {
      value: 'reject',
      label: 'Reject Return',
      desc: 'You believe the claim is invalid or outside policy.',
      color: 'border-red-400 bg-red-50',
      bg: 'text-red-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!done ? onClose : undefined} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden max-h-[92vh] flex flex-col">

        {done ? (
          <div className="p-8 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              action === 'reject' ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {action === 'reject'
                ? <XCircle className="w-8 h-8 text-red-500" />
                : <CheckCircle2 className="w-8 h-8 text-green-600" />}
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Response Sent!</h3>
            <p className="text-gray-500 text-sm mb-1">
              You have <strong>{action === 'accept' ? 'accepted' : action === 'partial' ? 'partially accepted' : 'rejected'}</strong> the return for <strong>{req.product}</strong>.
            </p>
            <p className="text-gray-400 text-xs mb-6">The buyer has been notified.</p>
            <button onClick={onClose}
              className="w-full py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
              style={{ backgroundColor: '#0D592A' }}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="font-black text-gray-900">Respond to Return</h3>
                <p className="text-xs text-gray-400">{req.id} · {req.product}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Buyer's claim summary */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <img src={req.img} alt={req.product} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{req.product}</p>
                    <p className="text-xs text-gray-400">{req.qty} {req.unit} · ${req.total.toFixed(2)} · {req.orderId}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-semibold">
                    {reasonLabel[req.reason]}
                  </span>
                  {req.isColdStorage && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Snowflake className="w-3 h-3" /> Cold Storage
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 italic bg-white rounded-xl p-2.5 border border-gray-100">
                  "{req.description}"
                </p>
                {req.proofFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {req.proofFiles.map(f => (
                      <span key={f} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                        <Camera className="w-3 h-3" /> {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action selection */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Your Response *</label>
                <div className="space-y-2">
                  {actions.map(a => (
                    <button key={a.value} onClick={() => { setAction(a.value); setError(''); }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 transition text-left ${
                        action === a.value ? a.color : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        action === a.value ? 'border-current' : 'border-gray-300'
                      }`}>
                        {action === a.value && <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${action === a.value ? a.bg : 'text-gray-800'}`}>{a.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note to buyer */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Note to Buyer *
                </label>
                <textarea rows={3} value={note} onChange={e => { setNote(e.target.value); setError(''); }}
                  placeholder={
                    action === 'accept'  ? 'e.g. We apologise for the quality issue. Full refund will be processed within 2 days.' :
                    action === 'partial' ? 'e.g. We can offer a 50% refund as the damage was partial.' :
                    action === 'reject'  ? 'e.g. The product was Grade A at dispatch. Natural variation in colour is not a defect.' :
                    'Explain your decision to the buyer...'
                  }
                  className={`${inputCls} resize-none ${error && !note.trim() ? 'border-red-300' : ''}`} />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
                style={{ backgroundColor: action === 'reject' ? '#ef4444' : '#0D592A' }}>
                <MessageSquare className="w-4 h-4" />
                {action === 'accept'  ? 'Accept & Issue Refund' :
                 action === 'partial' ? 'Accept Partially' :
                 action === 'reject'  ? 'Reject Return' :
                 'Submit Response'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ReturnRequests() {
  const [requests, setRequests] = useState(returnsStore.getAll());
  const [responding, setResponding] = useState<ReturnRequest | null>(null);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Responded'>('All');

  useEffect(() => returnsStore.subscribe(() => setRequests(returnsStore.getAll())), []);

  const pending   = requests.filter(r => r.farmerAction === null);
  const responded = requests.filter(r => r.farmerAction !== null);
  const visible   = filter === 'Pending' ? pending : filter === 'Responded' ? responded : requests;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
            <RotateCcw className="w-4 h-4 text-orange-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Return Requests</h1>
        </div>
        <p className="text-gray-500 text-sm">Review and respond to buyer return requests.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',     value: requests.length,  color: 'bg-gray-50 text-gray-700' },
          { label: 'Pending',   value: pending.length,   color: 'bg-orange-50 text-orange-700' },
          { label: 'Responded', value: responded.length, color: 'bg-green-50 text-green-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['All', 'Pending', 'Responded'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${filter === f ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
            style={filter === f ? { backgroundColor: '#0D592A' } : {}}>
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <RotateCcw className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No {filter !== 'All' ? filter.toLowerCase() : ''} return requests</p>
          <p className="text-sm mt-1">Return requests from buyers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(req => {
            const cfg = statusCfg[req.status];
            const StatusIcon = cfg.icon;
            const isPending = req.farmerAction === null;

            return (
              <motion.div key={req.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl border shadow-sm p-5 ${isPending ? 'border-orange-200' : 'border-gray-100'}`}>

                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img src={req.img} alt={req.product} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div>
                      <p className="font-bold text-gray-800">{req.product}</p>
                      <p className="text-xs text-gray-400">{req.qty} {req.unit} · ${req.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{req.id} · Submitted {req.submittedAt}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" /> {req.status}
                    </span>
                    {isPending && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        Action Required
                      </span>
                    )}
                  </div>
                </div>

                {/* Reason + tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-semibold">
                    {reasonLabel[req.reason]}
                  </span>
                  {req.isColdStorage && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Snowflake className="w-3 h-3" /> Cold Storage
                    </span>
                  )}
                </div>

                {/* Buyer's description */}
                <p className="text-xs text-gray-600 italic bg-gray-50 rounded-xl p-3 mb-3">
                  "{req.description}"
                </p>

                {/* Proof files */}
                {req.proofFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {req.proofFiles.map(f => (
                      <span key={f} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                        <Camera className="w-3 h-3" /> {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Farmer's response (if already responded) */}
                {req.farmerAction && (
                  <div className={`rounded-xl p-3 mb-3 ${
                    req.farmerAction === 'reject' ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'
                  }`}>
                    <p className={`text-xs font-bold mb-1 ${req.farmerAction === 'reject' ? 'text-red-600' : 'text-green-700'}`}>
                      Your Response · {req.respondedAt}
                    </p>
                    <p className="text-xs text-gray-600">"{req.farmerNote}"</p>
                    {req.refundType && (
                      <p className="text-xs font-semibold text-gray-500 mt-1">
                        Refund: <span className="capitalize">{req.refundType}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Action button */}
                {isPending && (
                  <button onClick={() => setResponding(req)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition"
                    style={{ backgroundColor: '#0D592A' }}>
                    <MessageSquare className="w-4 h-4" /> Respond to Return <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {responding && <RespondModal req={responding} onClose={() => setResponding(null)} />}
      </AnimatePresence>
    </div>
  );
}
