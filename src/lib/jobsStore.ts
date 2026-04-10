// Shared in-memory store so recruiter-posted jobs appear in the farmer Jobs tab

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  wage: string;
  duration: string;
  type: 'Full-time' | 'Seasonal' | 'Contract';
  skill: 'Beginner' | 'Skilled' | 'Expert';
  tags: string[];
  img: string;
  rating: number;
  desc: string;
  responsibilities: string[];
  skills: string[];
  contact: string;
  status: 'Open' | 'Closed' | 'Filled';
  applicants: Applicant[];
  views: number;
  postedAt: string;
}

export interface Applicant {
  id: number;
  name: string;
  phone: string;
  experience: string;
  location: string;
  jobId: number;
  jobTitle: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  appliedAt: string;
  avatar: string;
}

const SEED_JOBS: Job[] = [
  {
    id: 1, title: 'Farm Supervisor', company: 'GreenValley Farms', location: 'Nairobi, Kenya',
    wage: '$45/day', duration: '6 months', type: 'Full-time', skill: 'Expert',
    tags: ['Urgent', 'Organic Farm'],
    img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80',
    rating: 4.8, desc: 'Oversee daily farm operations and manage a team of 12 workers.',
    responsibilities: ['Manage daily farm operations', 'Supervise harvest teams', 'Maintain quality records'],
    skills: ['Team leadership', 'Crop management'], contact: '+254 712 345 678',
    status: 'Open', views: 142,
    postedAt: '2026-04-01',
    applicants: [
      { id: 1, name: 'James Otieno', phone: '+254 711 000 001', experience: 'Experienced (3–5 years)', location: 'Nairobi, Kenya', jobId: 1, jobTitle: 'Farm Supervisor', status: 'Pending', appliedAt: '2026-04-03', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
      { id: 2, name: 'Amina Wanjiku', phone: '+254 722 000 002', experience: 'Expert (5+ years)', location: 'Kiambu, Kenya', jobId: 1, jobTitle: 'Farm Supervisor', status: 'Accepted', appliedAt: '2026-04-04', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80' },
    ],
  },
  {
    id: 2, title: 'Harvest Worker', company: 'GreenValley Farms', location: 'Mombasa, Kenya',
    wage: '$18/day', duration: '3 months', type: 'Seasonal', skill: 'Beginner',
    tags: ['Seasonal', 'Contract'],
    img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80',
    rating: 4.2, desc: 'Join our seasonal harvest team for tomato and maize collection.',
    responsibilities: ['Harvest crops manually', 'Sort and grade produce'],
    skills: ['Physical fitness', 'Attention to detail'], contact: '+254 722 456 789',
    status: 'Open', views: 89,
    postedAt: '2026-04-05',
    applicants: [
      { id: 3, name: 'Peter Kamau', phone: '+254 733 000 003', experience: 'No experience (0–1 years)', location: 'Mombasa, Kenya', jobId: 2, jobTitle: 'Harvest Worker', status: 'Pending', appliedAt: '2026-04-06', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
    ],
  },
  {
    id: 3, title: 'Irrigation Technician', company: 'GreenValley Farms', location: 'Kisumu, Kenya',
    wage: '$35/day', duration: 'Ongoing', type: 'Contract', skill: 'Skilled',
    tags: ['Technical', 'Contract'],
    img: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=600&q=80',
    rating: 4.6, desc: 'Install, maintain, and repair drip and sprinkler irrigation systems.',
    responsibilities: ['Install irrigation systems', 'Diagnose and repair faults'],
    skills: ['Irrigation systems', 'Plumbing basics'], contact: '+254 733 567 890',
    status: 'Filled', views: 201,
    postedAt: '2026-03-20',
    applicants: [],
  },
];

// Simple reactive store
let _jobs: Job[] = [...SEED_JOBS];
let _nextId = 10;
const _listeners: Array<() => void> = [];

export const jobsStore = {
  getAll: () => _jobs,
  getById: (id: number) => _jobs.find(j => j.id === id),

  add: (job: Omit<Job, 'id' | 'applicants' | 'views' | 'postedAt' | 'rating'>) => {
    const newJob: Job = { ...job, id: _nextId++, applicants: [], views: 0, rating: 0, postedAt: new Date().toISOString().split('T')[0] };
    _jobs = [newJob, ..._jobs];
    _listeners.forEach(fn => fn());
    return newJob;
  },

  update: (id: number, patch: Partial<Job>) => {
    _jobs = _jobs.map(j => j.id === id ? { ...j, ...patch } : j);
    _listeners.forEach(fn => fn());
  },

  remove: (id: number) => {
    _jobs = _jobs.filter(j => j.id !== id);
    _listeners.forEach(fn => fn());
  },

  addApplicant: (jobId: number, applicant: Omit<Applicant, 'id' | 'jobId' | 'jobTitle' | 'status' | 'appliedAt' | 'avatar'>) => {
    const job = _jobs.find(j => j.id === jobId);
    if (!job) return;
    const newApplicant: Applicant = {
      ...applicant, id: Date.now(), jobId, jobTitle: job.title,
      status: 'Pending', appliedAt: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    };
    job.applicants = [...job.applicants, newApplicant];
    _jobs = [..._jobs];
    _listeners.forEach(fn => fn());
  },

  updateApplicantStatus: (jobId: number, applicantId: number, status: Applicant['status']) => {
    _jobs = _jobs.map(j => j.id === jobId
      ? { ...j, applicants: j.applicants.map(a => a.id === applicantId ? { ...a, status } : a) }
      : j);
    _listeners.forEach(fn => fn());
  },

  subscribe: (fn: () => void) => {
    _listeners.push(fn);
    return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1); };
  },
};
