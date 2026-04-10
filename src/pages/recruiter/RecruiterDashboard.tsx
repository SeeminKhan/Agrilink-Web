import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, CheckCircle, TrendingUp, ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { jobsStore } from '../../lib/jobsStore';
import { useAuth } from '../../lib/AuthContext';
import { slideUp, staggerContainer } from '../../lib/motion';

const statusColor: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Accepted: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-500',
};

const sparkData = [12, 18, 14, 25, 20, 32, 28, 38, 30, 42, 36, 48];

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState(jobsStore.getAll());

  useEffect(() => jobsStore.subscribe(() => setJobs(jobsStore.getAll())), []);

  const firstName = user?.name.split(' ')[0] || 'Recruiter';
  const totalApplicants = jobs.reduce((s, j) => s + j.applicants.length, 0);
  const activeJobs = jobs.filter(j => j.status === 'Open').length;
  const filled = jobs.filter(j => j.status === 'Filled').length;

  const recentApplicants = jobs
    .flatMap(j => j.applicants)
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
    .slice(0, 5);

  const stats = [
    { label: 'Jobs Posted', value: jobs.length, icon: Briefcase, color: 'bg-amber-50 text-amber-600', trend: true },
    { label: 'Active Jobs', value: activeJobs, icon: TrendingUp, color: 'bg-green-50 text-green-600', trend: true },
    { label: 'Total Applicants', value: totalApplicants, icon: Users, color: 'bg-blue-50 text-blue-600', trend: true },
    { label: 'Jobs Filled', value: filled, icon: CheckCircle, color: 'bg-purple-50 text-purple-600', trend: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Good morning, {firstName} 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's your hiring overview for today.</p>
        </div>
        <Link to="/recruiter/post-job"
          className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-2xl hover:opacity-90 transition shadow-lg text-sm w-fit"
          style={{ backgroundColor: '#d97706', boxShadow: '0 4px 16px -2px rgba(217,119,6,0.35)' }}>
          + Post a Job
        </Link>
      </div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, trend }) => (
          <motion.div key={label} variants={slideUp} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              {trend && <ArrowUpRight className="w-4 h-4 text-green-500" />}
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800">Applications Over Time</h3>
              <p className="text-xs text-gray-400">Last 12 weeks</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700">
              <TrendingUp className="w-3.5 h-3.5" /> +24%
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-24">
            {sparkData.map((h, i) => (
              <div key={i} className="flex-1">
                <div className="w-full rounded-t-md"
                  style={{ height: `${(h / 48) * 100}%`, backgroundColor: i === sparkData.length - 1 ? '#d97706' : '#fde68a' }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'].map(w => (
              <span key={w} className="text-xs text-gray-300 flex-1 text-center">{w}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Post New Job', to: '/recruiter/post-job', bg: '#fffbeb', color: '#92400e' },
              { label: 'View Applicants', to: '/recruiter/applicants', bg: '#eff6ff', color: '#1d4ed8' },
              { label: 'My Job Listings', to: '/recruiter/listings', bg: '#f0f7f3', color: '#0D592A' },
              { label: 'Analytics', to: '/recruiter/analytics', bg: '#f5f3ff', color: '#6d28d9' },
            ].map(a => (
              <Link key={a.label} to={a.to}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:opacity-80 transition text-sm font-semibold"
                style={{ backgroundColor: a.bg, color: a.color }}>
                {a.label} <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent applicants */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Recent Applications</h3>
          <Link to="/recruiter/applicants" className="text-amber-600 text-sm font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recentApplicants.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No applications yet. Post a job to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentApplicants.map(a => (
              <div key={a.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                <img src={a.avatar} alt={a.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{a.name}</p>
                  <p className="text-xs text-gray-400 truncate">{a.jobTitle}</p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />{a.appliedAt}
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[a.status]}`}>{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
