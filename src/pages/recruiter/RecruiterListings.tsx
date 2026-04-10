import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Users, Edit2, Trash2, Eye, Plus } from 'lucide-react';
import { jobsStore, type Job } from '../../lib/jobsStore';
import { staggerContainer, slideUp } from '../../lib/motion';

const statusColor: Record<string, string> = {
  Open: 'bg-green-100 text-green-700',
  Closed: 'bg-gray-100 text-gray-500',
  Filled: 'bg-blue-100 text-blue-700',
};

export default function RecruiterListings() {
  const [jobs, setJobs] = useState(jobsStore.getAll());
  const [filter, setFilter] = useState<'All' | Job['status']>('All');
  const navigate = useNavigate();

  useEffect(() => jobsStore.subscribe(() => setJobs(jobsStore.getAll())), []);

  const filtered = filter === 'All' ? jobs : jobs.filter(j => j.status === filter);

  const handleDelete = (id: number) => {
    if (confirm('Delete this job posting?')) jobsStore.remove(id);
  };

  const cycleStatus = (job: Job) => {
    const next: Record<Job['status'], Job['status']> = { Open: 'Closed', Closed: 'Filled', Filled: 'Open' };
    jobsStore.update(job.id, { status: next[job.status] });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Job Listings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Link to="/recruiter/post-job"
          className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-2xl hover:opacity-90 transition text-sm w-fit"
          style={{ backgroundColor: '#d97706' }}>
          <Plus className="w-4 h-4" /> Post Job
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['All', 'Open', 'Closed', 'Filled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${filter === f ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            style={filter === f ? { backgroundColor: '#d97706' } : {}}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No jobs here yet</p>
          <Link to="/recruiter/post-job" className="text-sm text-amber-600 hover:underline mt-1 inline-block">Post your first job</Link>
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3">
          {filtered.map(job => (
            <motion.div key={job.id} variants={slideUp}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm card-hover overflow-hidden">
              {/* Desktop row */}
              <div className="hidden sm:flex items-center gap-4 p-4">
                <img src={job.img} alt={job.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-gray-800 text-sm">{job.title}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor[job.status]}`}>{job.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}</span>
                    <span>{job.type}</span>
                    <span>{job.wage}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => navigate('/recruiter/applicants')} title="View applicants"
                    className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => cycleStatus(job)} title="Toggle status"
                    className="w-8 h-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center hover:bg-amber-100 transition">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(job.id)} title="Delete"
                    className="w-8 h-8 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-100 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile card */}
              <div className="sm:hidden p-4">
                <div className="flex items-start gap-3 mb-3">
                  <img src={job.img} alt={job.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{job.title}</p>
                    <p className="text-xs text-gray-400">{job.location} · {job.type}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor[job.status]}`}>{job.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" />{job.applicants.length} applicants</span>
                  <div className="flex gap-2">
                    <button onClick={() => navigate('/recruiter/applicants')} className="text-xs font-bold text-blue-600 hover:underline">View</button>
                    <button onClick={() => handleDelete(job.id)} className="text-xs font-bold text-red-400 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
