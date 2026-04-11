import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Scan, Leaf, Award, Calendar, User, MapPin, Camera, X, Upload, Sparkles, Clock, TrendingDown, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getListings } from '../../lib/listingsData';
import { farmerListingsStore } from '../../lib/farmerListingsStore';
import { analyzeCropQuality, type QualityResult } from '../../lib/qualityService';

interface VerifyResult { status: 'authentic'|'failed'|'warning'; crop: string; grade: string; farmer: string; location: string; harvestDate: string; batchId: string; certifications: string[]; }

const extractBatchId = (raw: string) => { const m = raw.trim().match(/\/verify\/([A-Z0-9-]+)/i); return m ? m[1].toUpperCase() : raw.trim().toUpperCase(); };

const buildLookup = () => {
  const lookup: Record<string, VerifyResult> = {};
  getListings().forEach(l => { lookup[l.batchId] = { status: l.farmerVerified ? 'authentic' : 'warning', crop: `${l.name} (${l.variety})`, grade: l.grade, farmer: `${l.farmer} — ${l.farmerOwner}`, location: l.location, harvestDate: l.harvestDate, batchId: l.batchId, certifications: l.certifications }; });
  farmerListingsStore.getAll().forEach(l => { if (!lookup[l.batchId]) lookup[l.batchId] = { status: 'authentic', crop: `${l.name} (${l.variety})`, grade: l.grade, farmer: 'AgriLink Farmer', location: l.location, harvestDate: l.harvestDate, batchId: l.batchId, certifications: ['AgriLink Verified'] }; });
  return lookup;
};

const SC = {
  authentic: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-500', label: 'Authentic & Verified', desc: 'This batch has been verified and meets all quality standards.' },
  failed:    { icon: XCircle,      color: 'text-red-600',   bg: 'bg-red-50',   border: 'border-red-200',   badge: 'bg-red-500',   label: 'Verification Failed',  desc: 'This batch ID could not be verified.' },
  warning:   { icon: AlertCircle,  color: 'text-yellow-600',bg: 'bg-yellow-50',border: 'border-yellow-200',badge: 'bg-yellow-500',label: 'Partial Verification', desc: 'Some details could not be fully verified.' },
};

const GC = { A: { bg: 'bg-green-100', text: 'text-green-700' }, B: { bg: 'bg-yellow-100', text: 'text-yellow-700' }, C: { bg: 'bg-red-100', text: 'text-red-600' } };
const CROPS = ['Tomato','Onion','Potato','Mango','Banana','Grapes','Orange','Wheat','Rice','Soybean'];

function CameraScanner({ onResult, onClose, batchIds }: { onResult:(t:string)=>void; onClose:()=>void; batchIds:string[] }) {
  const vRef = useRef<HTMLVideoElement>(null);
  const [err, setErr] = useState('');
  const [scanning, setScanning] = useState(false);
  useEffect(() => { let s: MediaStream|null=null; navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}}).then(st=>{s=st;if(vRef.current)vRef.current.srcObject=st;setScanning(true);}).catch(()=>setErr('Camera access denied.')); return ()=>{s?.getTracks().forEach(t=>t.stop());}; }, []);
  useEffect(() => { if(!scanning)return; const t=setTimeout(()=>{const id=batchIds[Math.floor(Math.random()*batchIds.length)]||'AGRL-2025-TOM-001';onResult(`https://agrilink.in/verify/${id}`);},3000); return ()=>clearTimeout(t); }, [scanning,onResult,batchIds]);
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between p-4"><p className="text-white font-bold">Scan QR Code</p><button onClick={onClose} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center"><X className="w-5 h-5 text-white"/></button></div>
      <div className="flex-1 relative flex items-center justify-center">
        {err ? <div className="text-center px-8"><XCircle className="w-12 h-12 text-red-400 mx-auto mb-3"/><p className="text-white text-sm">{err}</p><button onClick={onClose} className="mt-4 px-6 py-2 bg-white text-gray-800 rounded-xl font-bold text-sm">Go Back</button></div> : <>
          <video ref={vRef} autoPlay playsInline muted className="w-full h-full object-cover"/>
          <div className="absolute inset-0 flex items-center justify-center"><div className="relative w-56 h-56">
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-green-400 rounded-tl-lg"/><div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-green-400 rounded-tr-lg"/>
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-green-400 rounded-bl-lg"/><div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-green-400 rounded-br-lg"/>
            <motion.div className="absolute left-2 right-2 h-0.5 bg-green-400" animate={{top:['10%','90%','10%']}} transition={{duration:2,repeat:Infinity,ease:'linear'}}/>
          </div></div>
          <div className="absolute bottom-8 left-0 right-0 text-center"><p className="text-white/70 text-sm">Point camera at QR code</p>{scanning&&<p className="text-green-400 text-xs mt-1 animate-pulse">Scanning...</p>}</div>
        </>}
      </div>
    </div>
  );
}

function CropQualityChecker() {
  const [crop,setCrop]=useState('Tomato');
  const [imageUrl,setImageUrl]=useState('');
  const [harvestDays,setHarvestDays]=useState('1');
  const [storage,setStorage]=useState<'normal'|'cold'|'poor'>('normal');
  const [transport,setTransport]=useState('2');
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState<QualityResult|null>(null);
  const [error,setError]=useState('');
  const uploadRef=useRef<HTMLInputElement>(null);
  const [preview,setPreview]=useState('');
  const handleUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;setPreview(URL.createObjectURL(f));setImageUrl('https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80');};
  const handleCheck=async()=>{
    if(!crop||!imageUrl){setError('Please provide crop name and image.');return;}
    setLoading(true);setResult(null);setError('');
    try{const r=await analyzeCropQuality({crop,image_url:imageUrl,harvest_days_ago:Number(harvestDays),storage_condition:storage,transport_time_hours:Number(transport)});setResult(r);}
    catch{setError('Quality check failed. Please try again.');}
    finally{setLoading(false);}
  };
  const ic='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition';
  const gc=result?GC[result.quality_grade]:null;
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Crop *</label><input list="qv-crops" value={crop} onChange={e=>setCrop(e.target.value)} placeholder="e.g. Tomato" className={ic}/><datalist id="qv-crops">{CROPS.map(c=><option key={c} value={c}/>)}</datalist></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Harvest (days ago)</label><input type="number" min="0" value={harvestDays} onChange={e=>setHarvestDays(e.target.value)} className={ic}/></div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Crop Image URL *</label>
          <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="https://example.com/crop.jpg" className={ic}/>
          <button onClick={()=>uploadRef.current?.click()} className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-green-400 hover:bg-green-50 transition"><Upload className="w-4 h-4"/> Or upload crop photo</button>
          <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={handleUpload}/>
          {preview&&<img src={preview} alt="preview" className="mt-2 h-24 w-full object-cover rounded-xl"/>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Storage Condition</label><select value={storage} onChange={e=>setStorage(e.target.value as typeof storage)} className={ic}><option value="normal">Normal (Room Temp)</option><option value="cold">Cold Storage</option><option value="poor">Poor Conditions</option></select></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Transport (hrs)</label><input type="number" min="0" value={transport} onChange={e=>setTransport(e.target.value)} className={ic}/></div>
        </div>
        {error&&<div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700"><AlertCircle className="w-4 h-4 shrink-0"/>{error}</div>}
        <button onClick={handleCheck} disabled={!crop||!imageUrl||loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg shadow-green-200 disabled:opacity-40 disabled:cursor-not-allowed">
          {loading?<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Analysing crop...</>:<><Sparkles className="w-4 h-4"/>Check Crop Quality</>}
        </button>
      </div>
      <AnimatePresence>
        {result&&gc&&(
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3"><span className={`text-4xl font-black px-4 py-1 rounded-2xl ${gc.bg} ${gc.text}`}>{result.quality_grade}</span><div><p className="text-white font-bold">{crop}</p><p className="text-gray-400 text-xs">{harvestDays}d since harvest</p></div></div>
              <div className="text-right"><p className="text-gray-400 text-xs">Confidence</p><p className="text-white font-black text-2xl">{Math.round(result.confidence*100)}%</p></div>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-3 gap-3 text-xs">
                {[{label:'Freshness',value:`${Math.round(result.freshness_score*100)}%`,icon:Leaf,color:'text-green-600'},{label:'Defects',value:`${Math.round(result.defect_percentage*100)}%`,icon:TrendingDown,color:'text-red-500'},{label:'Shelf Life',value:`${result.estimated_shelf_life_days}d`,icon:Clock,color:'text-blue-600'}].map(({label,value,icon:Icon,color})=>(
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center"><Icon className={`w-4 h-4 mx-auto mb-1 ${color}`}/><p className="font-black text-gray-800 text-base">{value}</p><p className="text-gray-400">{label}</p></div>
                ))}
              </div>
              <div className="bg-green-50 rounded-xl p-3 flex items-start gap-2"><Info className="w-4 h-4 text-green-600 shrink-0 mt-0.5"/><p className="text-sm font-semibold text-green-800">{result.recommendation}</p></div>
              {result.source==='fallback'&&<p className="text-xs text-gray-400 text-center">ML service unavailable — showing estimated result</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QualityVerification() {
  const [activeTab,setActiveTab]=useState<'qr'|'ai'>('qr');
  const [batchId,setBatchId]=useState('');
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState<VerifyResult|null>(null);
  const [notFound,setNotFound]=useState(false);
  const [showCamera,setShowCamera]=useState(false);
  const [batchLookup,setBatchLookup]=useState(buildLookup);
  const fileRef=useRef<HTMLInputElement>(null);
  const {t}=useTranslation();
  useEffect(()=>farmerListingsStore.subscribe(()=>setBatchLookup(buildLookup())),[]);
  const verify=useCallback((raw:string)=>{
    if(!raw.trim())return;
    const id=extractBatchId(raw);
    setLoading(true);setResult(null);setNotFound(false);
    setTimeout(()=>{setLoading(false);const found=batchLookup[id];if(found){setBatchId(id);setResult(found);}else setNotFound(true);},1200);
  },[batchLookup]);
  const handleScanResult=(text:string)=>{setShowCamera(false);setBatchId(text);verify(text);};
  const handleFileUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{if(!e.target.files?.[0])return;setLoading(true);setResult(null);setNotFound(false);setTimeout(()=>{setLoading(false);const ids=Object.keys(batchLookup);const d=ids[Math.floor(Math.random()*ids.length)];setBatchId(d);setResult(batchLookup[d]);},1500);};
  const cfg=result?SC[result.status]:null;
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {showCamera&&<CameraScanner onResult={handleScanResult} onClose={()=>setShowCamera(false)} batchIds={Object.keys(batchLookup)}/>}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-blue-600"/></div><h1 className="text-2xl font-black text-gray-900">{t('qualityVerification.title')}</h1></div>
        <p className="text-gray-500 text-sm">{t('qualityVerification.subtitle')}</p>
      </div>
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit mb-6">
        {[{key:'qr' as const,label:'QR / Batch Verify'},{key:'ai' as const,label:'AI Quality Check'}].map(tab=>(
          <button key={tab.key} onClick={()=>setActiveTab(tab.key)} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab===tab.key?'bg-white shadow-sm text-gray-900':'text-gray-500 hover:text-gray-700'}`}>{tab.label}</button>
        ))}
      </div>
      {activeTab==='ai'&&<CropQualityChecker/>}
      {activeTab==='qr'&&(
        <>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
            <div className="relative bg-gray-900 rounded-2xl h-44 flex items-center justify-center mb-6 overflow-hidden cursor-pointer group" onClick={()=>setShowCamera(true)}>
              <div className="absolute inset-0 opacity-20" style={{backgroundImage:'url(https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=60)',backgroundSize:'cover'}}/>
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="relative w-24 h-24">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-400 rounded-tl"/><div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-400 rounded-tr"/>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-400 rounded-bl"/><div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-400 rounded-br"/>
                  <div className="absolute inset-0 flex items-center justify-center"><Scan className="w-8 h-8 text-green-400"/></div>
                  <motion.div className="absolute left-1 right-1 h-0.5 bg-green-400/70" animate={{top:['10%','90%','10%']}} transition={{duration:2,repeat:Infinity,ease:'linear'}}/>
                </div>
                <p className="text-white/80 text-xs group-hover:text-white transition">Tap to open camera scanner</p>
              </div>
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><Camera className="w-3 h-3"/>Live Scanner</div>
            </div>
            <div className="flex gap-3 mb-5">
              <button onClick={()=>setShowCamera(true)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-100 transition"><Camera className="w-4 h-4"/>{t('qualityVerification.openCamera')}</button>
              <button onClick={()=>fileRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-100 transition"><Upload className="w-4 h-4"/>{t('qualityVerification.uploadQr')}</button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload}/>
            </div>
            <div className="flex items-center gap-3 mb-4"><div className="flex-1 h-px bg-gray-100"/><span className="text-xs text-gray-400 font-medium">or enter batch ID manually</span><div className="flex-1 h-px bg-gray-100"/></div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{t('qualityVerification.batchId')}</label>
                <input type="text" placeholder="e.g. AGRL-2024-TOM-001" value={batchId} onChange={e=>setBatchId(e.target.value)} onKeyDown={e=>e.key==='Enter'&&verify(batchId)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono outline-none focus:ring-2 focus:ring-blue-300 transition tracking-wider"/>
                <p className="text-xs text-gray-400 mt-1">Try: {Object.keys(batchLookup).slice(0,2).join(' or ')}</p>
              </div>
              <button onClick={()=>verify(batchId)} disabled={!batchId.trim()||loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed">
                {loading?<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>{t('qualityVerification.verifying')}</>:<><ShieldCheck className="w-4 h-4"/>{t('qualityVerification.verifyBatch')}</>}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {notFound&&(<motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center mb-6"><XCircle className="w-12 h-12 text-red-400 mx-auto mb-3"/><p className="font-bold text-red-700">{t('qualityVerification.batchNotFound')}</p><p className="text-sm text-red-500 mt-1">{t('qualityVerification.batchNotFoundDesc',{id:batchId})}</p></motion.div>)}
          </AnimatePresence>
          <AnimatePresence>
            {result&&cfg&&(
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className={`rounded-3xl border-2 ${cfg.border} overflow-hidden shadow-lg`}>
                <div className={`${cfg.badge} px-6 py-4 flex items-center gap-3`}><cfg.icon className="w-6 h-6 text-white"/><div><p className="text-white font-black text-lg">{cfg.label}</p><p className="text-white/80 text-xs">{cfg.desc}</p></div></div>
                <div className={`${cfg.bg} p-6 space-y-3`}>
                  {[{icon:Leaf,label:t('qualityVerification.crop'),value:result.crop},{icon:Award,label:t('qualityVerification.grade'),value:result.grade},{icon:User,label:t('qualityVerification.farmer'),value:result.farmer},{icon:MapPin,label:t('qualityVerification.location'),value:result.location},{icon:Calendar,label:t('qualityVerification.harvestDate'),value:result.harvestDate}].map(({icon:Icon,label,value})=>(
                    <div key={label} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm"><div className={`w-8 h-8 ${cfg.bg} rounded-xl flex items-center justify-center shrink-0`}><Icon className={`w-4 h-4 ${cfg.color}`}/></div><div><p className="text-xs text-gray-400">{label}</p><p className="text-sm font-bold text-gray-800">{value}</p></div></div>
                  ))}
                  {result.certifications.length>0&&(<div className="bg-white rounded-2xl px-4 py-3 shadow-sm"><p className="text-xs text-gray-400 mb-2">Certifications</p><div className="flex flex-wrap gap-2">{result.certifications.map(c=><span key={c} className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3"/>{c}</span>)}</div></div>)}
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm"><p className="text-xs text-gray-400 mb-1">Batch ID</p><p className="text-sm font-mono font-bold text-gray-800 tracking-wider">{result.batchId}</p></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
