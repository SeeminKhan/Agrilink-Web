import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, Banknote, Tag, FileText,
  Image, ChevronRight, ChevronLeft, CheckCircle, Upload,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { jobsStore, type Job } from '../../lib/jobsStore';
import { slideUp } from '../../lib/motion';

const STEPS = ['Job Details', 'Requirements', 'Review'];

const JOB_IMAGES = [
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80',
  'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=600&q=80',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
];

const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300 transition bg-white';
const labelClass = 'block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide';

export default function PostJob() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const { t } = useTranslation();

  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time' as Job['type'],
    duration: '', wage: '', cropType: '', skill: 'Beginner' as Job['skill'],
    tags: '', desc: '', responsibilities: '', skills: '', contact: '',
    img: JOB_IMAGES[0],
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    jobsStore.add({
      title: form.title || 'Untitled Job',
      company: form.company || 'My Company',
      location: form.location,
      type: form.type,
      duration: form.duration,
      wage: form.wage,
      skill: form.skill,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      desc: form.desc,
      responsibilities: form.responsibilities.split('\n').filter(Boolean),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      contact: form.contact,
      img: form.img,
      status: 'Open',
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">{t('postJob.jobPosted')}</h2>
          <p className="text-gray-500 text-sm mb-6">{t('postJob.jobLive')}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/recruiter/listings')}
              className="px-6 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
              style={{ backgroundColor: '#d97706' }}>
              {t('postJob.viewListings')}
            </button>
            <button onClick={() => { setDone(false); setStep(0); setForm({ title: '', company: '', location: '', type: 'Full-time', duration: '', wage: '', cropType: '', skill: 'Beginner', tags: '', desc: '', responsibilities: '', skills: '', contact: '', img: JOB_IMAGES[0] }); }}
              className="px-6 py-3 rounded-2xl border border-gray-200 font-bold text-sm text-gray-600 hover:bg-gray-50 transition">
              {t('postJob.postAnother')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">{t('postJob.title')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t('postJob.subtitle')}</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${i < step ? 'bg-green-500 text-white' : i === step ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
              style={i === step ? { backgroundColor: '#d97706' } : {}}>
              {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs font-semibold hidden sm:block ${i === step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Job Title *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.title} onChange={set('title')} placeholder="e.g. Farm Supervisor" className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Company / Farm Name *</label>
                  <input value={form.company} onChange={set('company')} placeholder="e.g. GreenValley Farms" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.location} onChange={set('location')} placeholder="City, Country" className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Job Type</label>
                  <select value={form.type} onChange={set('type')} className={inputClass}>
                    <option>Full-time</option>
                    <option>Seasonal</option>
                    <option>Contract</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Duration</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.duration} onChange={set('duration')} placeholder="e.g. 3 months, Ongoing" className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Salary / Wage</label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.wage} onChange={set('wage')} placeholder="e.g. $30/day" className={`${inputClass} pl-9`} />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Tags (comma-separated)</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={form.tags} onChange={set('tags')} placeholder="e.g. Urgent, Organic Farm, Contract" className={`${inputClass} pl-9`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Job Image</label>
                <div className="grid grid-cols-4 gap-2">
                  {JOB_IMAGES.map(img => (
                    <button key={img} type="button" onClick={() => setForm(f => ({ ...f, img }))}
                      className={`relative h-16 rounded-xl overflow-hidden border-2 transition ${form.img === img ? 'border-amber-500' : 'border-transparent'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {form.img === img && <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-amber-600" /></div>}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1"><Upload className="w-3 h-3" /> Custom upload coming soon</p>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <label className={labelClass}>Skill Level Required</label>
                <select value={form.skill} onChange={set('skill')} className={inputClass}>
                  <option>Beginner</option>
                  <option>Skilled</option>
                  <option>Expert</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Crop Type (optional)</label>
                <input value={form.cropType} onChange={set('cropType')} placeholder="e.g. Maize, Tomatoes, Coffee" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Job Description *</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea value={form.desc} onChange={set('desc')} rows={4} placeholder="Describe the role, environment, and expectations..."
                    className={`${inputClass} pl-9 resize-none`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Responsibilities (one per line)</label>
                <textarea value={form.responsibilities} onChange={set('responsibilities')} rows={3}
                  placeholder={"Manage daily operations\nSupervise harvest teams\nMaintain quality records"}
                  className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>Required Skills (comma-separated)</label>
                <input value={form.skills} onChange={set('skills')} placeholder="e.g. Team leadership, Crop management" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Contact Number</label>
                <input value={form.contact} onChange={set('contact')} placeholder="+254 700 000 000" className={inputClass} />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h3 className="font-bold text-gray-700 text-sm">Review your job posting</h3>
              <div className="relative h-40 rounded-2xl overflow-hidden">
                <img src={form.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-black text-lg">{form.title || 'Job Title'}</p>
                  <p className="text-white/80 text-sm">{form.company} · {form.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Type', form.type], ['Duration', form.duration || '—'],
                  ['Wage', form.wage || '—'], ['Skill', form.skill],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                    <p className="font-semibold text-gray-700">{v}</p>
                  </div>
                ))}
              </div>
              {form.desc && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{form.desc}</p>
                </div>
              )}
              {form.tags && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                    <span key={t} className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">{t}</span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-5 border-t border-gray-100">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition"
              style={{ backgroundColor: '#d97706' }}>
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition"
              style={{ backgroundColor: '#0D592A' }}>
              <CheckCircle className="w-4 h-4" /> Post Job
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
