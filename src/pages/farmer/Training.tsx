import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Briefcase, SlidersHorizontal, Bookmark, BookmarkCheck,
  Clock, Play, Award, BookOpen, ChevronRight, X, Upload,
  Phone, User, Star, Banknote, Calendar, CheckCircle, Download,
} from 'lucide-react';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '../../lib/motion';
import { jobsStore, type Job } from '../../lib/jobsStore';

// ─── DATA ────────────────────────────────────────────────────────────────────

const trainingModules = [
  { id: 1, title: 'Modern Irrigation Techniques', category: 'Water Management', duration: '45 min', level: 'Beginner', img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80', progress: 100, badge: 'Completed', badgeColor: 'bg-green-100 text-green-700', learnings: ['Drip vs sprinkler systems', 'Water conservation methods', 'Scheduling irrigation cycles'] },
  { id: 2, title: 'Organic Pest Control Methods', category: 'Crop Protection', duration: '1h 20min', level: 'Intermediate', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80', progress: 60, badge: 'In Progress', badgeColor: 'bg-yellow-100 text-yellow-700', learnings: ['Identifying common pests', 'Natural pesticide recipes', 'Integrated pest management'] },
  { id: 3, title: 'Soil Health & Composting', category: 'Soil Science', duration: '55 min', level: 'Beginner', img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80', progress: 0, badge: 'New', badgeColor: 'bg-blue-100 text-blue-700', learnings: ['Soil pH and nutrients', 'Composting techniques', 'Cover cropping benefits'] },
  { id: 4, title: 'Post-Harvest Storage & Handling', category: 'Post-Harvest', duration: '1h 10min', level: 'Intermediate', img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&q=80', progress: 0, badge: 'Popular', badgeColor: 'bg-orange-100 text-orange-700', learnings: ['Cold chain management', 'Packaging best practices', 'Reducing post-harvest losses'] },
  { id: 5, title: 'Digital Marketing for Farmers', category: 'Business Skills', duration: '2h', level: 'Advanced', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80', progress: 0, badge: 'New', badgeColor: 'bg-blue-100 text-blue-700', learnings: ['Social media for farm sales', 'Building an online presence', 'Pricing strategies'] },
  { id: 6, title: 'Climate-Smart Agriculture', category: 'Sustainability', duration: '1h 30min', level: 'Intermediate', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80', progress: 0, badge: 'Featured', badgeColor: 'bg-purple-100 text-purple-700', learnings: ['Adapting to climate change', 'Carbon sequestration basics', 'Drought-resistant crops'] },
];

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

// ─── TRAINING DETAIL MODAL ───────────────────────────────────────────────────

function TrainingModal({ mod, onClose }: { mod: typeof trainingModules[0]; onClose: () => void }) {
  const [completed, setCompleted] = useState(mod.progress === 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto z-10">
        {/* Video area */}
        <div className="relative h-52 bg-gray-900 rounded-t-3xl overflow-hidden">
          <img src={mod.img} alt={mod.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition">
              <Play className="w-7 h-7 fill-green-600 text-green-600 ml-1" />
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition shadow">
            <X className="w-4 h-4 text-gray-700" />
          </button>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
            <motion.div className="h-full bg-green-400" initial={{ width: 0 }} animate={{ width: `${mod.progress}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">{mod.category}</p>
              <h2 className="text-lg font-black text-gray-800">{mod.title}</h2>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${mod.badgeColor}`}>{mod.badge}</span>
          </div>

          <div className="flex items-center gap-4 mb-5 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{mod.duration}</span>
            <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${levelColor[mod.level]}`}>{mod.level}</span>
          </div>

          {/* Progress tracker */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Progress</span><span className="font-bold">{mod.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: '#0D592A' }}
                initial={{ width: 0 }} animate={{ width: `${mod.progress}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Key Learnings</h4>
            <ul className="space-y-2">
              {mod.learnings.map(l => (
                <li key={l} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{l}
                </li>
              ))}
            </ul>
          </div>

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
              <button className="flex-1 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
                style={{ backgroundColor: '#0D592A' }}>
                {mod.progress > 0 ? 'Continue Learning' : 'Start Learning'}
              </button>
              {mod.progress > 0 && (
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
  const [selectedMod, setSelectedMod] = useState<typeof trainingModules[0] | null>(null);

  const completed = trainingModules.filter(m => m.progress === 100).length;
  const inProgress = trainingModules.filter(m => m.progress > 0 && m.progress < 100).length;
  const available = trainingModules.filter(m => m.progress === 0).length;

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="show">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">Skill Development & Training</h2>
          <p className="text-sm text-gray-500 mt-0.5">Upgrade your farming techniques with expert-led modules</p>
        </div>
        <div className="flex items-center gap-2 border rounded-2xl px-4 py-2 w-fit" style={{ backgroundColor: '#f0f7f3', borderColor: '#aed4bc' }}>
          <Award className="w-4 h-4" style={{ color: '#0D592A' }} />
          <span className="text-sm font-bold" style={{ color: '#0D592A' }}>{completed} Certificate{completed !== 1 ? 's' : ''} Earned</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Completed', value: completed, icon: Award, color: 'bg-green-50 text-green-600' },
          { label: 'In Progress', value: inProgress, icon: BookOpen, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Available', value: available, icon: Play, color: 'bg-blue-50 text-blue-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Modules grid */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {trainingModules.map(m => (
          <motion.div key={m.id} variants={scaleIn}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover group cursor-pointer"
            onClick={() => setSelectedMod(m)}>
            <div className="relative h-40 overflow-hidden">
              <img src={m.img} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${m.badgeColor}`}>{m.badge}</span>
              {m.progress === 0 && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-green-600 fill-green-600 ml-0.5" />
                  </div>
                </div>
              )}
              {m.progress > 0 && m.progress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                  <div className="h-full bg-yellow-400 transition-all" style={{ width: `${m.progress}%` }} />
                </div>
              )}
              {m.progress === 100 && (
                <div className="absolute bottom-3 right-3">
                  <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-1">{m.category}</p>
              <h3 className="font-bold text-gray-800 text-sm mb-3 leading-snug">{m.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{m.duration}</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${levelColor[m.level]}`}>{m.level}</span>
                </div>
                <button className="flex items-center gap-1 text-xs font-bold transition" style={{ color: '#0D592A' }}>
                  {m.progress === 100 ? 'Review' : m.progress > 0 ? 'Continue' : 'Start'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Training modal */}
      <AnimatePresence>
        {selectedMod && <TrainingModal mod={selectedMod} onClose={() => setSelectedMod(null)} />}
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
