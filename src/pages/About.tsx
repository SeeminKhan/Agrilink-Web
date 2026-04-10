import { Target, Eye, Heart } from 'lucide-react';

const team = [
  { name: 'Kofi Mensah', role: 'CEO & Co-Founder', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'Amina Osei', role: 'CTO', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80' },
  { name: 'David Kamau', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
  { name: 'Fatou Diallo', role: 'Head of Marketing', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80' },
];

export default function About() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-green-800 to-emerald-700 py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">About AgriLink</h1>
          <p className="text-green-100 text-lg">
            We're on a mission to eliminate food insecurity and empower African farmers through technology and direct market access.
          </p>
        </div>
      </div>

      {/* Mission / Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Target, title: 'Our Mission', text: 'To connect every African farmer directly to buyers, eliminating middlemen and ensuring fair prices for all.', color: 'bg-green-100 text-green-600' },
            { icon: Eye, title: 'Our Vision', text: 'A food-secure Africa where technology empowers smallholder farmers to thrive in the global market.', color: 'bg-blue-100 text-blue-600' },
            { icon: Heart, title: 'Our Values', text: 'Transparency, fairness, sustainability, and community are at the heart of everything we do.', color: 'bg-red-100 text-red-600' },
          ].map(({ icon: Icon, title, text, color }) => (
            <div key={title} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">Our Story</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-4">Born from the Fields</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              AgriLink was founded in 2021 by a group of young African entrepreneurs who grew up watching their parents struggle to get fair prices for their crops. Despite producing quality food, farmers were at the mercy of middlemen who took most of the profit.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We built AgriLink to change that. By creating a direct digital marketplace, we've helped over 50,000 farmers across 35 African countries connect with buyers, get fair prices, and build sustainable livelihoods.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=700&q=80" alt="Farmers" className="w-full h-80 object-cover" />
          </div>
        </div>

        {/* Team */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Meet the Team</h2>
          <p className="text-gray-500 mt-2">The passionate people behind AgriLink</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map(m => (
            <div key={m.name} className="text-center group">
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <p className="font-bold text-gray-800 text-sm">{m.name}</p>
              <p className="text-xs text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
