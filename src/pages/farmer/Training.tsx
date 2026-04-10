import { Play, Clock, BookOpen, Award, ChevronRight } from 'lucide-react';

const modules = [
  {
    id: 1,
    title: 'Modern Irrigation Techniques',
    category: 'Water Management',
    duration: '45 min',
    level: 'Beginner',
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
    progress: 100,
    badge: 'Completed',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 2,
    title: 'Organic Pest Control Methods',
    category: 'Crop Protection',
    duration: '1h 20min',
    level: 'Intermediate',
    img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80',
    progress: 60,
    badge: 'In Progress',
    badgeColor: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 3,
    title: 'Soil Health & Composting',
    category: 'Soil Science',
    duration: '55 min',
    level: 'Beginner',
    img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80',
    progress: 0,
    badge: 'New',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 4,
    title: 'Post-Harvest Storage & Handling',
    category: 'Post-Harvest',
    duration: '1h 10min',
    level: 'Intermediate',
    img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80',
    progress: 0,
    badge: 'Popular',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
  {
    id: 5,
    title: 'Digital Marketing for Farmers',
    category: 'Business Skills',
    duration: '2h',
    level: 'Advanced',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    progress: 0,
    badge: 'New',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 6,
    title: 'Climate-Smart Agriculture',
    category: 'Sustainability',
    duration: '1h 30min',
    level: 'Intermediate',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
    progress: 0,
    badge: 'Featured',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
];

const levelColor: Record<string, string> = {
  Beginner: 'text-green-600',
  Intermediate: 'text-yellow-600',
  Advanced: 'text-red-500',
};

export default function Training() {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Job Training</h1>
          <p className="text-gray-500 text-sm mt-0.5">Grow your skills and boost your farm's productivity.</p>
        </div>
        <div className="flex items-center gap-2 border rounded-2xl px-4 py-2" style={{ backgroundColor: '#f0f7f3', borderColor: '#aed4bc' }}>
          <Award className="w-4 h-4" style={{ color: '#0D592A' }} />
          <span className="text-sm font-bold" style={{ color: '#0D592A' }}>1 Certificate Earned</span>
        </div>
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Completed', value: '1', icon: Award, color: 'bg-green-50 text-green-600' },
          { label: 'In Progress', value: '1', icon: BookOpen, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Available', value: '4', icon: Play, color: 'bg-blue-50 text-blue-600' },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map(m => (
          <div key={m.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover group">
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
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full bg-yellow-400" style={{ width: `${m.progress}%` }} />
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-1">{m.category}</p>
              <h3 className="font-bold text-gray-800 text-sm mb-2 leading-snug">{m.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{m.duration}</span>
                  <span className={`font-semibold ${levelColor[m.level]}`}>{m.level}</span>
                </div>
                <button className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700 transition">
                  {m.progress === 100 ? 'Review' : m.progress > 0 ? 'Continue' : 'Start'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
