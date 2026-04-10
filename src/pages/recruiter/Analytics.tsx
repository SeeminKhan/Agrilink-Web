import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Eye, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { jobsStore } from '../../lib/jobsStore';
import { staggerContainer, slideUp } from '../../lib/motion';

export default function Analytics() {
  const [jobs, setJobs] = useState(jobsStore.getAll());
  useEffect(() => jobsStore.subscribe(() => setJobs(jobsStore.getAll())), []);

  const totalViews = jobs.reduce((s, j) => s + j.views, 0);
  const totalApplicants = jobs.reduce((s, j) => s + j.applicants.length, 0);
  const totalAccepted = jobs.flatMap(j => j.applicants).filter(a => a.status === 'Accepted').length;
  const hiringRate = totalApplicants > 0 ? Math.round((totalAccepted / totalApplicants) * 100) : 0;

  const maxApplicants = Math.max(...jobs.map(j => j.applicants.length), 1);
  const maxViews = Math.max(...jobs.map(j => j.views), 1);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track your hiring performance</p>
      </div>

      {/* Summary cards */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Views', value: totalViews, icon: Eye, color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Applicants', value: totalApplicants, icon: Users, color: 'bg-amber-50 text-amber-600' },
          { label: 'Hired', value: totalAccepted, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Hiring Rate', value: `${hiringRate}%`, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div key={label} variants={slideUp} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications per job */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-gray-800">Applications per Job</h3>
          </div>
          {jobs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-3">
              {jobs.map(j => (
                <div key={j.id}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className="truncate max-w-[60%]">{j.title}</span>
                    <span className="font-bold">{j.applicants.length}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{ backgroundColor: '#d97706' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(j.applicants.length / maxApplicants) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Views vs Applications */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <Eye className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-gray-800">Views vs Applications</h3>
          </div>
          {jobs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-4">
              {jobs.map(j => (
                <div key={j.id} className="space-y-1.5">
                  <p className="text-xs font-semibold text-gray-600 truncate">{j.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-16 shrink-0">Views</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full bg-blue-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(j.views / maxViews) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-6 text-right">{j.views}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-16 shrink-0">Applied</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ backgroundColor: '#d97706' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(j.applicants.length / maxViews) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-6 text-right">{j.applicants.length}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hiring success */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <h3 className="font-bold text-gray-800">Hiring Success by Job</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(j => {
              const accepted = j.applicants.filter(a => a.status === 'Accepted').length;
              const rate = j.applicants.length > 0 ? Math.round((accepted / j.applicants.length) * 100) : 0;
              return (
                <div key={j.id} className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-700 mb-1 truncate">{j.title}</p>
                  <p className="text-xs text-gray-400 mb-3">{j.applicants.length} applicants · {accepted} hired</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${rate}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }} />
                    </div>
                    <span className="text-xs font-black text-green-600">{rate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
