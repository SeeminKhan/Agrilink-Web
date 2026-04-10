import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Briefcase, SlidersHorizontal, Bookmark, BookmarkCheck,
  Clock, Play, Award, BookOpen, ChevronRight, X, Upload,
  Phone, User, Star, Banknote, Calendar, CheckCircle, Download,
} from 'lucide-react';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '../../lib/motion';
import { jobsStore, type Job } from '../../lib/jobsStore';

// ─── TRAINING VIDEO DATA ─────────────────────────────────────────────────────

export interface TrainingVideo {
  id: number;
  title: string;
  description: string;
  category: 'Crop Training' | 'Soil & Composting' | 'Pest Control' | 'Irrigation' | 'Post-Harvest' | 'Business Skills' | 'Machinery' | 'Dairy';
  language: 'Hindi' | 'Marathi' | 'English';
  youtubeId: string;          // YouTube video ID
  thumbnail: string;          // YouTube thumbnail URL
  duration: string;
  channel: string;
  views: string;
  uploadedAt: string;
  learnings: string[];
  progress: number;           // 0–100
}

const trainingVideos: TrainingVideo[] = [
  {
    id: 1,
    title: 'Modern Farming Techniques (Hindi)',
    description: 'आधुनिक खेती के तरीके सीखें — कम लागत में ज्यादा उत्पादन कैसे करें।',
    category: 'Crop Training',
    language: 'Hindi',
    youtubeId: 'V4sVQ0QXK1U',
    thumbnail: 'https://img.youtube.com/vi/V4sVQ0QXK1U/hqdefault.jpg',
    duration: '10 min',
    channel: 'Farming Leader',
    views: '1M+',
    uploadedAt: '2024',
    learnings: [
      'Modern farming methods',
      'Yield improvement techniques',
      'Cost reduction tips'
    ],
    progress: 0,
  },
  {
    id: 2,
    title: 'Drip Irrigation Explained',
    description: 'Learn how drip irrigation saves water and increases crop productivity.',
    category: 'Irrigation',
    language: 'English',
    youtubeId: 'Q3zV1G7z4kQ',
    thumbnail: 'https://img.youtube.com/vi/Q3zV1G7z4kQ/hqdefault.jpg',
    duration: '6 min',
    channel: 'AgriTech Solutions',
    views: '500K+',
    uploadedAt: '2023',
    learnings: [
      'Water-saving techniques',
      'Installation basics',
      'Crop suitability'
    ],
    progress: 0,
  },
  {
    id: 3,
    title: 'Organic Farming Basics (Hindi)',
    description: 'जैविक खेती कैसे शुरू करें और केमिकल फ्री उत्पादन कैसे करें।',
    category: 'Soil & Composting',
    language: 'Hindi',
    youtubeId: 'Ue8Zz7pGz8Q',
    thumbnail: 'https://img.youtube.com/vi/Ue8Zz7pGz8Q/hqdefault.jpg',
    duration: '9 min',
    channel: 'Kheti Ki Duniya',
    views: '800K+',
    uploadedAt: '2024',
    learnings: [
      'Organic fertilizers',
      'Chemical-free farming',
      'Market demand for organic produce'
    ],
    progress: 0,
  },
  {
    id: 4,
    title: 'How to Increase Crop Yield',
    description: 'Practical tips to improve crop productivity and maximize profit.',
    category: 'Crop Training',
    language: 'English',
    youtubeId: '2z7F8K9r0XQ',
    thumbnail: 'https://img.youtube.com/vi/2z7F8K9r0XQ/hqdefault.jpg',
    duration: '7 min',
    channel: 'Smart Farmer',
    views: '300K+',
    uploadedAt: '2023',
    learnings: [
      'Soil health improvement',
      'Fertilizer optimization',
      'Best farming practices'
    ],
    progress: 0,
  },
  {
    id: 5,
    title: 'Government Schemes for Farmers (Hindi)',
    description: 'सरकारी योजनाओं का लाभ कैसे उठाएं और आवेदन कैसे करें।',
    category: 'Business Skills',
    language: 'Hindi',
    youtubeId: 'Jk2L9mP0xYQ',
    thumbnail: 'https://img.youtube.com/vi/Jk2L9mP0xYQ/hqdefault.jpg',
    duration: '8 min',
    channel: 'Agri Help India',
    views: '600K+',
    uploadedAt: '2024',
    learnings: [
      'PM किसान योजना',
      'Subsidies and loans',
      'Application process'
    ],
    progress: 0,
  }
];

const CATEGORIES = ['All', 'Crop Training', 'Irrigation', 'Soil & Composting', 'Pest Control', 'Post-Harvest', 'Business Skills', 'Machinery', 'Dairy'];
const LANGUAGES  = ['All', 'Hindi', 'Marathi', 'English'];

const levelColor: Record<string, string> = {
  Beginner: 'text-green-600 bg-green-50',
  Intermediate: 'text-yellow-600 bg-yellow-50',
  Advanced: 'text-red-500 bg-red-50',
  Skilled: 'text-blue-600 bg-blue-50',
  Expert: 'text-purple-600 bg-purple-50',
};

const typeColor: Record<string, string> = {
  'Full-time': 'bg-green-100 text-green-700',
  'Seasonal': 'bg-orange-100 text-orange-700',
  'Contract': 'bg-blue-100 text-blue-700',
};

// ─── JOB CARD ────────────────────────────────────────────────────────────────

function JobCard({ job, saved, onSave, onOpen }: { job: Job; saved: boolean; onSave: () => void; onOpen: () => void }) {
  return (
    <motion.div variants={slideUp} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover group flex flex-col">
      <div className="relative h-40 overflow-hidden">
        <img src={job.img} alt={job.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {job.tags.map(t => (
            <span key={t} className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 text-gray-700">{t}</span>
          ))}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onSave(); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition shadow">
          {saved
            ? <BookmarkCheck className="w-4 h-4 text-green-600" />
            : <Bookmark className="w-4 h-4 text-gray-500" />}
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-white">{job.rating}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 text-sm mb-0.5">{job.title}</h3>
        <p className="text-xs text-gray-400 mb-3">{job.company}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="w-3 h-3" />{job.location}</span>
          <span className="flex items-center gap-1 text-xs text-gray-500"><Calendar className="w-3 h-3" />{job.duration}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeColor[job.type]}`}>{job.type}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor[job.skill]}`}>{job.skill}</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-sm font-black text-gray-800">
            <Banknote className="w-4 h-4 text-green-600" />{job.wage}
          </div>
          <button onClick={onOpen}
            className="flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-xl transition hover:opacity-90"
            style={{ backgroundColor: '#0D592A' }}>
            View Job <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── JOB DETAIL MODAL ────────────────────────────────────────────────────────

function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [applying, setApplying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', experience: '', file: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (job) {
      jobsStore.addApplicant(job.id, {
        name: form.name,
        phone: form.phone,
        experience: form.experience,
        location: 'Unknown',
      });
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
        {/* Header image */}
        <div className="relative h-52 overflow-hidden rounded-t-3xl">
          <img src={job.img} alt={job.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition shadow">
            <X className="w-4 h-4 text-gray-700" />
          </button>
          <div className="absolute bottom-4 left-5">
            <h2 className="text-xl font-black text-white">{job.title}</h2>
            <p className="text-sm text-white/80">{job.company} · {job.location}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Meta row */}
          <div className="flex flex-wrap gap-3 mb-5">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColor[job.type]}`}>{job.type}</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${levelColor[job.skill]}`}>{job.skill}</span>
            <span className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <Banknote className="w-3.5 h-3.5 text-green-600" />{job.wage}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5" />{job.duration}
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-5">{job.desc}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Responsibilities</h4>
              <ul className="space-y-1.5">
                {job.responsibilities.map(r => (
                  <li key={r} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(s => (
                  <span key={s} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600">{s}</span>
                ))}
              </div>
              <div className="mt-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Contact</h4>
                <a href={`tel:${job.contact}`} className="flex items-center gap-2 text-sm font-semibold text-green-700">
                  <Phone className="w-4 h-4" />{job.contact}
                </a>
              </div>
            </div>
          </div>

          {!applying && !submitted && (
            <div className="flex gap-3">
              <button onClick={() => setApplying(true)}
                className="flex-1 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
                style={{ backgroundColor: '#0D592A' }}>
                Apply for Job
              </button>
              <a href={`tel:${job.contact}`}
                className="flex-1 py-3 rounded-2xl border-2 font-bold text-sm text-center hover:bg-gray-50 transition"
                style={{ borderColor: '#0D592A', color: '#0D592A' }}>
                Contact Employer
              </a>
            </div>
          )}

          {/* Application form */}
          <AnimatePresence>
            {applying && !submitted && (
              <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                onSubmit={handleSubmit} className="space-y-4 border-t border-gray-100 pt-5">
                <h4 className="font-bold text-gray-800">Apply for this Job</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="[name]" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="[phone_number]" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Experience Level</label>
                  <select required value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition bg-white">
                    <option value="">Select experience</option>
                    <option>No experience (0–1 years)</option>
                    <option>Some experience (1–3 years)</option>
                    <option>Experienced (3–5 years)</option>
                    <option>Expert (5+ years)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Upload Document (optional)</label>
                  <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-green-400 transition">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{form.file || 'CV, certificate, or ID'}</span>
                    <input type="file" className="hidden" onChange={e => setForm(f => ({ ...f, file: e.target.files?.[0]?.name || '' }))} />
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition" style={{ backgroundColor: '#0D592A' }}>
                    Submit Application
                  </button>
                  <button type="button" onClick={() => setApplying(false)} className="px-5 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {submitted && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 border-t border-gray-100 mt-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h4 className="font-black text-gray-800 mb-1">Application Submitted!</h4>
              <p className="text-sm text-gray-500">The employer will contact you at your provided number.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── TRAINING VIDEO MODAL (YouTube embed) ────────────────────────────────────

function TrainingModal({ video, onClose }: { video: TrainingVideo; onClose: () => void }) {
  const [completed, setCompleted] = useState(video.progress === 100);

  const langColor: Record<string, string> = {
    Hindi: 'bg-orange-100 text-orange-700',
    Marathi: 'bg-purple-100 text-purple-700',
    English: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 max-h-[95vh] overflow-y-auto">

        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition">
          <X className="w-4 h-4 text-white" />
        </button>

        {/* ── YouTube embed ── */}
        <div className="relative w-full rounded-t-3xl overflow-hidden bg-black"
          style={{ paddingTop: '56.25%' /* 16:9 */ }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* ── Metadata ── */}
        <div className="p-5">
          {/* Tags row */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${langColor[video.language] || 'bg-gray-100 text-gray-600'}`}>
              🌐 {video.language}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
              {video.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3" /> {video.duration}
            </span>
          </div>

          <h2 className="text-lg font-black text-gray-900 mb-1 leading-snug">{video.title}</h2>

          {/* Channel + views */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span className="font-semibold text-gray-600">{video.channel}</span>
            <span>·</span>
            <span>{video.views} views</span>
            <span>·</span>
            <span>{video.uploadedAt}</span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-4">{video.description}</p>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Progress</span>
              <span className="font-bold">{video.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: '#0D592A' }}
                initial={{ width: 0 }} animate={{ width: `${video.progress}%` }} transition={{ duration: 1 }} />
            </div>
          </div>

          {/* Key learnings */}
          <div className="mb-5">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Key Learnings</h4>
            <ul className="space-y-2">
              {video.learnings.map(l => (
                <li key={l} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {l}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          {completed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                <Award className="w-8 h-8 text-green-600 shrink-0" />
                <div>
                  <p className="font-bold text-green-800 text-sm">Module Completed!</p>
                  <p className="text-xs text-green-600">You've earned a certificate for this module.</p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-bold text-sm hover:bg-gray-50 transition"
                style={{ borderColor: '#0D592A', color: '#0D592A' }}>
                <Download className="w-4 h-4" /> Download Certificate
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
                style={{ backgroundColor: '#FF0000' }}>
                <Play className="w-4 h-4 fill-white" /> Watch on YouTube
              </a>
              {video.progress > 0 && (
                <button onClick={() => setCompleted(true)}
                  className="px-5 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                  Mark Complete
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── JOBS TAB ────────────────────────────────────────────────────────────────

function JobsTab() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [skill, setSkill] = useState('');
  const [saved, setSaved] = useState<number[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [allJobs, setAllJobs] = useState(jobsStore.getAll().filter(j => j.status === 'Open'));

  useEffect(() => jobsStore.subscribe(() => setAllJobs(jobsStore.getAll().filter(j => j.status === 'Open'))), []);

  const filtered = allJobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.title.toLowerCase().includes(q) || j.location.toLowerCase().includes(q) || j.company.toLowerCase().includes(q);
    const matchLoc = !location || j.location.includes(location);
    const matchType = !type || j.type === type;
    const matchSkill = !skill || j.skill === skill;
    return matchSearch && matchLoc && matchType && matchSkill;
  });

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="show">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-900">Find Agricultural Jobs</h2>
        <p className="text-sm text-gray-500 mt-0.5">Explore seasonal, part-time, and full-time opportunities near you</p>
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by role, location, or farm..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition shadow-sm" />
        </div>
        <button onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${showFilters ? 'border-green-500 text-green-700 bg-green-50' : 'border-gray-200 text-gray-600 bg-white'}`}>
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1 block">Location</label>
                <select value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-green-300">
                  <option value="">All locations</option>
                  <option>Nairobi, Kenya</option>
                  <option>Mombasa, Kenya</option>
                  <option>Kisumu, Kenya</option>
                  <option>Nakuru, Kenya</option>
                  <option>Eldoret, Kenya</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1 block">Job Type</label>
                <select value={type} onChange={e => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-green-300">
                  <option value="">All types</option>
                  <option>Full-time</option>
                  <option>Seasonal</option>
                  <option>Contract</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1 block">Skill Level</label>
                <select value={skill} onChange={e => setSkill(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-green-300">
                  <option value="">All levels</option>
                  <option>Beginner</option>
                  <option>Skilled</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-4">{filtered.length} job{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(job => (
          <JobCard key={job.id} job={job}
            saved={saved.includes(job.id)}
            onSave={() => setSaved(s => s.includes(job.id) ? s.filter(i => i !== job.id) : [...s, job.id])}
            onOpen={() => setSelectedJob(job)} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No jobs match your filters</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </motion.div>

      {/* Job modal */}
      <AnimatePresence>
        {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── TRAINING TAB ────────────────────────────────────────────────────────────

function TrainingTab() {
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);
  const [category, setCategory]           = useState('All');
  const [language, setLanguage]           = useState('All');
  const [search, setSearch]               = useState('');

  const filtered = trainingVideos.filter(v =>
    (category === 'All' || v.category === category) &&
    (language === 'All' || v.language === language) &&
    (v.title.toLowerCase().includes(search.toLowerCase()) ||
     v.description.toLowerCase().includes(search.toLowerCase()))
  );

  const completed  = trainingVideos.filter(v => v.progress === 100).length;
  const inProgress = trainingVideos.filter(v => v.progress > 0 && v.progress < 100).length;

  const langColor: Record<string, string> = {
    Hindi: 'bg-orange-100 text-orange-700',
    Marathi: 'bg-purple-100 text-purple-700',
    English: 'bg-blue-100 text-blue-700',
  };

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="show">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-black text-gray-900">Skill Development & Training</h2>
          <p className="text-sm text-gray-500 mt-0.5">Expert-led video modules in Hindi, Marathi & English</p>
        </div>
        <div className="flex items-center gap-2 border rounded-2xl px-4 py-2 w-fit" style={{ backgroundColor: '#f0f7f3', borderColor: '#aed4bc' }}>
          <Award className="w-4 h-4" style={{ color: '#0D592A' }} />
          <span className="text-sm font-bold" style={{ color: '#0D592A' }}>{completed} Certificate{completed !== 1 ? 's' : ''} Earned</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Completed',   value: completed,                    icon: Award,    color: 'bg-green-50 text-green-600' },
          { label: 'In Progress', value: inProgress,                   icon: BookOpen, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Available',   value: trainingVideos.length - completed - inProgress, icon: Play, color: 'bg-blue-50 text-blue-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
            <div className={`w-8 h-8 ${color} rounded-xl flex items-center justify-center mx-auto mb-1.5`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search videos..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition" />
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        {/* Category filter */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${category === c ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={category === c ? { backgroundColor: '#0D592A' } : {}}>
                {c}
              </button>
            ))}
          </div>
        </div>
        {/* Language filter */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Language</p>
          <div className="flex gap-2">
            {LANGUAGES.map(l => (
              <button key={l} onClick={() => setLanguage(l)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${language === l ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={language === l ? { backgroundColor: '#0D592A' } : {}}>
                {l === 'All' ? '🌐 All' : l === 'Hindi' ? '🇮🇳 Hindi' : l === 'Marathi' ? '🟠 Marathi' : '🇬🇧 English'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">{filtered.length} video{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Video grid */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(v => (
          <motion.div key={v.id} variants={scaleIn}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover group cursor-pointer"
            onClick={() => setSelectedVideo(v)}>

            {/* Thumbnail with play overlay */}
            <div className="relative h-44 overflow-hidden bg-gray-900">
              <img
                src={v.thumbnail}
                alt={v.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                onError={e => {
                  // Fallback to topic-relevant image if YouTube thumbnail fails
                  const fallbacks: Record<string, string> = {
                    'Crop Training': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&q=80',
                    'Irrigation': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80',
                    'Soil & Composting': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80',
                    'Pest Control': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80',
                    'Post-Harvest': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&q=80',
                    'Business Skills': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80',
                    'Machinery': 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&q=80',
                    'Dairy': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80',
                  };
                  (e.target as HTMLImageElement).src = fallbacks[v.category] || fallbacks['Crop Training'];
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl">
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded">
                {v.duration}
              </div>

              {/* Progress bar */}
              {v.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full bg-green-400" style={{ width: `${v.progress}%` }} />
                </div>
              )}

              {/* Completed badge */}
              {v.progress === 100 && (
                <div className="absolute top-3 right-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Card body */}
            <div className="p-4">
              {/* Language + category */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${langColor[v.language] || 'bg-gray-100 text-gray-600'}`}>
                  {v.language}
                </span>
                <span className="text-xs text-gray-400 truncate">{v.category}</span>
              </div>

              <h3 className="font-bold text-gray-800 text-sm mb-1 leading-snug line-clamp-2">{v.title}</h3>
              <p className="text-xs text-gray-400 mb-3 truncate">{v.channel} · {v.views} views</p>

              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-bold hover:opacity-90 transition"
                style={{ backgroundColor: v.progress === 100 ? '#059669' : '#0D592A' }}>
                <Play className="w-3.5 h-3.5 fill-white" />
                {v.progress === 100 ? 'Watch Again' : v.progress > 0 ? 'Continue' : 'Watch Now'}
              </button>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No videos match your filters</p>
            <p className="text-sm mt-1">Try a different category or language</p>
          </div>
        )}
      </motion.div>

      {/* Video modal */}
      <AnimatePresence>
        {selectedVideo && <TrainingModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function Training() {
  const [tab, setTab] = useState<'jobs' | 'training'>('jobs');

  return (
    <div className="animate-fade-in">
      {/* Segmented tab control */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-2xl w-fit mb-6">
        {(['jobs', 'training'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="relative px-5 py-2 rounded-xl text-sm font-bold transition-colors duration-200"
            style={tab === t ? { color: '#0D592A' } : { color: '#9ca3af' }}>
            {tab === t && (
              <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white rounded-xl shadow-sm" style={{ zIndex: 0 }} />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {t === 'jobs' ? <Briefcase className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              {t === 'jobs' ? 'Jobs' : 'Training'}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {tab === 'jobs' ? <JobsTab /> : <TrainingTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
