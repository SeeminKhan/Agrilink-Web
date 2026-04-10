import { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Scan, Leaf, Award, Calendar, User, MapPin } from 'lucide-react';

interface VerifyResult {
  status: 'authentic' | 'failed' | 'warning';
  crop: string;
  grade: string;
  farmer: string;
  location: string;
  harvestDate: string;
  batchId: string;
  certifications: string[];
}

const mockResults: Record<string, VerifyResult> = {
  'AGRL-2024-TOM-001': {
    status: 'authentic',
    crop: 'Organic Tomatoes (Roma)',
    grade: 'Grade A',
    farmer: 'Green Valley Farm — James Mwangi',
    location: 'Nairobi, Kenya',
    harvestDate: 'December 10, 2024',
    batchId: 'AGRL-2024-TOM-001',
    certifications: ['Organic Certified', 'Pesticide-Free', 'AgriLink Verified'],
  },
  'AGRL-2024-AVO-003': {
    status: 'authentic',
    crop: 'Premium Avocados (Hass)',
    grade: 'Grade A',
    farmer: 'Hillside Orchards — Peter Kamau',
    location: 'Meru, Kenya',
    harvestDate: 'December 12, 2024',
    batchId: 'AGRL-2024-AVO-003',
    certifications: ['Grade A Certified', 'AgriLink Verified'],
  },
};

const statusConfig = {
  authentic: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-500',
    label: 'Authentic & Verified',
    desc: 'This batch has been verified and meets all quality standards.',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-500',
    label: 'Verification Failed',
    desc: 'This batch ID could not be verified. Do not proceed with purchase.',
  },
  warning: {
    icon: AlertCircle,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-500',
    label: 'Partial Verification',
    desc: 'Some details could not be fully verified. Proceed with caution.',
  },
};

export default function QualityVerification() {
  const [batchId, setBatchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleVerify = () => {
    if (!batchId.trim()) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setTimeout(() => {
      setLoading(false);
      const found = mockResults[batchId.trim().toUpperCase()];
      if (found) setResult(found);
      else setNotFound(true);
    }, 1800);
  };

  const cfg = result ? statusConfig[result.status] : null;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Quality Verification</h1>
        </div>
        <p className="text-gray-500 text-sm">Enter a batch ID or scan a QR code to verify crop authenticity and quality.</p>
      </div>

      {/* Scanner card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
        {/* QR scanner visual */}
        <div className="relative bg-gray-900 rounded-2xl h-44 flex items-center justify-center mb-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="relative w-24 h-24">
              {/* QR corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-400 rounded-tl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-400 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-400 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-400 rounded-br" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Scan className="w-8 h-8 text-green-400" />
              </div>
              {/* Scan line animation */}
              <div className="absolute left-1 right-1 h-0.5 bg-green-400/70 animate-bounce" style={{ top: '50%' }} />
            </div>
            <p className="text-white/60 text-xs">Camera scanner (demo)</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">or enter batch ID manually</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Batch ID / QR Code</label>
            <input
              type="text"
              placeholder="e.g. AGRL-2024-TOM-001"
              value={batchId}
              onChange={e => setBatchId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono outline-none focus:ring-2 focus:ring-blue-300 transition tracking-wider"
            />
            <p className="text-xs text-gray-400 mt-1">Try: AGRL-2024-TOM-001 or AGRL-2024-AVO-003</p>
          </div>
          <button
            onClick={handleVerify}
            disabled={!batchId.trim() || loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying batch...
              </>
            ) : (
              <><ShieldCheck className="w-4 h-4" /> Verify Batch</>
            )}
          </button>
        </div>
      </div>

      {/* Not found */}
      {notFound && (
        <div className="animate-slide-up bg-red-50 border border-red-200 rounded-3xl p-6 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="font-bold text-red-700">Batch Not Found</p>
          <p className="text-sm text-red-500 mt-1">No record found for "{batchId}". This product may not be registered on AgriLink.</p>
        </div>
      )}

      {/* Result */}
      {result && cfg && (
        <div className={`animate-slide-up rounded-3xl border-2 ${cfg.border} overflow-hidden shadow-lg`}>
          {/* Status header */}
          <div className={`${cfg.badge} px-6 py-4 flex items-center gap-3`}>
            <cfg.icon className="w-6 h-6 text-white" />
            <div>
              <p className="text-white font-black text-lg">{cfg.label}</p>
              <p className="text-white/80 text-xs">{cfg.desc}</p>
            </div>
          </div>

          {/* Details */}
          <div className={`${cfg.bg} p-6 space-y-4`}>
            {[
              { icon: Leaf, label: 'Crop', value: result.crop },
              { icon: Award, label: 'Grade', value: result.grade },
              { icon: User, label: 'Farmer', value: result.farmer },
              { icon: MapPin, label: 'Location', value: result.location },
              { icon: Calendar, label: 'Harvest Date', value: result.harvestDate },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm">
                <div className={`w-8 h-8 ${cfg.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-bold text-gray-800">{value}</p>
                </div>
              </div>
            ))}

            {/* Certifications */}
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <p className="text-xs text-gray-400 mb-2">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {result.certifications.map(cert => (
                  <span key={cert} className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Batch ID */}
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">Batch ID</p>
              <p className="text-sm font-mono font-bold text-gray-800 tracking-wider">{result.batchId}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
