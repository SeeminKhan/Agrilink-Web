import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MapPin, Phone, CheckCircle, XCircle, X, Briefcase, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { jobsStore, type Applicant } from '../../lib/jobsStore';
import { staggerContainer, slideUp, scaleIn } from '../../lib/motion';

const statusColor: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Accepted: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-500',
};

function ApplicantDetail({ applicant, onClose, onAccept, onReject }: {
  applicant: Applicant; onClose: () => void;
  onAccept: () => void; onReject: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div variants={scaleIn} initial="hidden" animate="show" exit="hidden"
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
        <div className="p-6">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
            <X className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-4 mb-5">
            <img src={applicant.avatar} alt={applicant.name} className="w-16 h-16 rounded-2xl object-cover" />
            <div>
              <h3 className="font-black text-gray-900 text-lg">{applicant.name}</h3>
              <p className="text-sm text-gray-500">{applicant.experience}</p>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 inline-block ${statusColor[applicant.status]}`}>{applicant.status}</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Applied for</p>
                <p className="text-sm font-semibold text-gray-700">{applicant.jobTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-sm font-semibold text-gray-700">{applicant.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Contact</p>
                <a href={`tel:${applicant.phone}`} className="text-sm font-semibold text-green-700">{applicant.phone}</a>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Applied on</p>
                <p className="text-sm font-semibold text-gray-700">{applicant.appliedAt}</p>
              </div>
            </div>
          </div>

          {applicant.status === 'Pending' && (
            <div className="flex gap-3">
              <button onClick={onAccept}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
                style={{ backgroundColor: '#0D592A' }}>
                <CheckCircle className="w-4 h-4" /> Hire Farmer
              </button>
              <button onClick={onReject}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition">
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          )}
          {applicant.status !== 'Pending' && (
            <div className={`text-center py-3 rounded-2xl font-bold text-sm ${applicant.status === 'Accepted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
              {applicant.status === 'Accepted' ? '✓ Hired' : '✗ Rejected'}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function Applicants() {
  const [jobs, setJobs] = useState(jobsStore.getAll());
  const [filter, setFilter] = useState<'All' | Applicant['status']>('All');
  const [selected, setSelected] = useState<Applicant | null>(null);
  const { t } = useTranslation();

  useEffect(() => jobsStore.subscribe(() => setJobs(jobsStore.getAll())), []);

  const allApplicants = jobs.flatMap(j => j.applicants);
  const filtered = filter === 'All' ? allApplicants : allApplicants.filter(a => a.status === filter);

  const updateStatus = (applicant: Applicant, status: Applicant['status']) => {
    jobsStore.updateApplicantStatus(applicant.jobId, applicant.id, status);
    setSelected(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">{t('applicants.title')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{allApplicants.length !== 1 ? t('applicants.totalApplicationsPlural', { count: allApplicants.length }) : t('applicants.totalApplications', { count: allApplicants.length })}</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['All', 'Pending', 'Accepted', 'Rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${filter === f ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            style={filter === f ? { backgroundColor: '#d97706' } : {}}>
            {f} {f !== 'All' && <span className="ml-1 opacity-70">({allApplicants.filter(a => a.status === f).length})</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">{t('applicants.noApplicants')}</p>
          <p className="text-sm mt-1">{t('applicants.noApplicantsHint')}</p>
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(a => (
            <motion.div key={a.id} variants={slideUp}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm card-hover p-4 cursor-pointer"
              onClick={() => setSelected(a)}>
              <div className="flex items-start gap-3 mb-3">
                <img src={a.avatar} alt={a.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">{a.name}</p>
                  <p className="text-xs text-gray-400 truncate">{a.experience}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${statusColor[a.status]}`}>{a.status}</span>
              </div>
              <div className="space-y-1.5 mb-4">
                <p className="text-xs text-gray-500 flex items-center gap-1.5"><Briefcase className="w-3 h-3" />{a.jobTitle}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5"><MapPin className="w-3 h-3" />{a.location}</p>
              </div>
              {a.status === 'Pending' && (
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <button onClick={() => updateStatus(a, 'Accepted')}
                    className="flex-1 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 transition"
                    style={{ backgroundColor: '#0D592A' }}>
                    {t('applicants.accept')}
                  </button>
                  <button onClick={() => updateStatus(a, 'Rejected')}
                    className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition">
                    {t('applicants.reject')}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {selected && (
          <ApplicantDetail
            applicant={selected}
            onClose={() => setSelected(null)}
            onAccept={() => updateStatus(selected, 'Accepted')}
            onReject={() => updateStatus(selected, 'Rejected')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
