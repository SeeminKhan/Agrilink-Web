import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, CheckCircle2, XCircle, AlertCircle, Scan,
  Leaf, Award, Calendar, User, MapPin, Camera, X, Upload,
} from 'lucide-react';
import { getListings } from '../../lib/listingsData';
import { farmerListingsStore } from '../../lib/farmerListingsStore';

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

const buildLookup = () => {
  const lookup: Record<string, VerifyResult> = {};
  getListings().forEach(l => {
    lookup[l.batchId] = {
      status: l.farmerVerified ? 'authentic' : 'warning',
      crop: `${l.name} (${l.variety})`,
      grade: l.grade,
      farmer: `${l.farmer} — ${l.farmerOwner}`,
      location: l.location,
      harvestDate: l.harvestDate,
      batchId: l.batchId,
      certifications: l.certifications,
    };
  });
  return lookup;
};

const statusConfig = {
  authentic: {
    icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50',
    border: 'border-green-200', badge: 'bg-green-500',
    label: 'Authentic & Verified',
    desc: 'This batch has been verified and meets all quality standards.',
  },
  failed: {
    icon: XCircle, color: 'text-red-600', bg: 'bg-red-50',
    border: 'border-red-200', badge: 'bg-red-500',
    label: 'Verification Failed',
    desc: 'This batch ID could not be verified. Do not proceed with purchase.',
  },
  warning: {
    icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50',
    border: 'border-yellow-200', badge: 'bg-yellow-500',
    label: 'Partial Verification',
    desc: 'Some details could not be fully verified. Proceed with caution.',
  },
};

// ── Camera Scanner Component ──────────────────────────────────────────────────
function CameraScanner({ onResult, onClose, batchIds }: { onResult: (text: string) => void; onClose: () => void; batchIds: string[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
        setScanning(true);
      })
      .catch(() => setError('Camera access denied. Please allow camera permission and try again.'));

    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, []);

  // Simulate QR detection after 3s (real implementation would use jsQR library)
  useEffect(() => {
    if (!scanning) return;
    const timer = setTimeout(() => {
      onResult(batchIds[Math.floor(Math.random() * batchIds.length)] || 'AGRL-2024-TOM-001');
    }, 3000);
    return () => clearTimeout(timer);
  }, [scanning, onResult]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between p-4">
        <p className="text-white font-bold">Scan QR Code</p>
        <button onClick={onClose} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        {error ? (
          <div className="text-center px-8">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-white text-sm">{error}</p>
            <button onClick={onClose} className="mt-4 px-6 py-2 bg-white text-gray-800 rounded-xl font-bold text-sm">Go Back</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-56 h-56">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
                {/* Scan line */}
                <motion.div className="absolute left-2 right-2 h-0.5 bg-green-400"
                  animate={{ top: ['10%', '90%', '10%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
              </div>
            </div>
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-white/70 text-sm">Point camera at QR code</p>
              {scanning && <p className="text-green-400 text-xs mt-1 animate-pulse">Scanning...</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function QualityVerification() {
  const [batchId, setBatchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [batchLookup, setBatchLookup] = useState(buildLookup);
  const fileRef = useRef<HTMLInputElement>(null);

  // Keep lookup in sync with store
  useEffect(() => farmerListingsStore.subscribe(() => setBatchLookup(buildLookup())), []);

  const verify = useCallback((id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setTimeout(() => {
      setLoading(false);
      const found = batchLookup[id.trim().toUpperCase()];
      if (found) setResult(found);
      else setNotFound(true);
    }, 1200);
  }, [batchLookup]);

  const handleVerify = () => verify(batchId);

  const handleScanResult = (text: string) => {
    setShowCamera(false);
    setBatchId(text);
    verify(text);
  };

  // Simulate reading QR from uploaded image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setTimeout(() => {
      setLoading(false);
      const batchIds = Object.keys(batchLookup);
      const detected = batchIds[0];
      setBatchId(detected);
      setResult(batchLookup[detected]);
    }, 1500);
  };

  const cfg = result ? statusConfig[result.status] : null;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {showCamera && <CameraScanner onResult={handleScanResult} onClose={() => setShowCamera(false)} batchIds={Object.keys(batchLookup)} />}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Quality Verification</h1>
        </div>
        <p className="text-gray-500 text-sm">Scan a QR code or enter a batch ID to verify crop authenticity.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
        {/* Scanner area */}
        <div className="relative bg-gray-900 rounded-2xl h-44 flex items-center justify-center mb-6 overflow-hidden cursor-pointer group"
          onClick={() => setShowCamera(true)}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=60)', backgroundSize: 'cover' }} />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-400 rounded-tl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-400 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-400 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-400 rounded-br" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Scan className="w-8 h-8 text-green-400" />
              </div>
              <motion.div className="absolute left-1 right-1 h-0.5 bg-green-400/70"
                animate={{ top: ['10%', '90%', '10%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
            </div>
            <p className="text-white/80 text-xs group-hover:text-white transition">Tap to open camera scanner</p>
          </div>
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Camera className="w-3 h-3" /> Live Scanner
          </div>
        </div>

        {/* Upload option */}
        <div className="flex gap-3 mb-5">
          <button onClick={() => setShowCamera(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition">
            <Camera className="w-4 h-4" /> Open Camera
          </button>
          <button onClick={() => fileRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-100 transition">
            <Upload className="w-4 h-4" /> Upload QR Image
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">or enter batch ID manually</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Batch ID</label>
            <input type="text" placeholder="e.g. AGRL-2024-TOM-001" value={batchId}
              onChange={e => setBatchId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono outline-none focus:ring-2 focus:ring-blue-300 transition tracking-wider" />
            <p className="text-xs text-gray-400 mt-1">
              Try: {Object.keys(batchLookup).slice(0, 2).join(' or ')}
            </p>
          </div>
          <button onClick={handleVerify} disabled={!batchId.trim() || loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
            ) : (
              <><ShieldCheck className="w-4 h-4" /> Verify Batch</>
            )}
          </button>
        </div>
      </div>

      {/* Not found */}
      <AnimatePresence>
        {notFound && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center mb-6">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="font-bold text-red-700">Batch Not Found</p>
            <p className="text-sm text-red-500 mt-1">No record found for "{batchId}". This product may not be registered on AgriLink.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && cfg && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`rounded-3xl border-2 ${cfg.border} overflow-hidden shadow-lg`}>
            <div className={`${cfg.badge} px-6 py-4 flex items-center gap-3`}>
              <cfg.icon className="w-6 h-6 text-white" />
              <div>
                <p className="text-white font-black text-lg">{cfg.label}</p>
                <p className="text-white/80 text-xs">{cfg.desc}</p>
              </div>
            </div>
            <div className={`${cfg.bg} p-6 space-y-3`}>
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

              {result.certifications.length > 0 && (
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
              )}

              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <p className="text-xs text-gray-400 mb-1">Batch ID</p>
                <p className="text-sm font-mono font-bold text-gray-800 tracking-wider">{result.batchId}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
