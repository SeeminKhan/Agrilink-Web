import { ShieldCheck, Truck, BarChart3, Smartphone, Headphones, Leaf } from 'lucide-react';

const features = [
  { icon: Leaf, title: 'Fresh & Organic', desc: 'Source directly from verified farmers. All produce is fresh, traceable, and quality-checked.', bg: '#f0f7f3', color: '#0D592A' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: 'Escrow-protected transactions ensure both buyers and sellers are always protected.', bg: '#eff6ff', color: '#1d4ed8' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Integrated logistics partners deliver your orders from farm to doorstep quickly.', bg: '#fff7ed', color: '#c2410c' },
  { icon: BarChart3, title: 'Market Insights', desc: 'Real-time price data and market trends help you make smarter buying and selling decisions.', bg: '#faf5ff', color: '#7c3aed' },
  { icon: Smartphone, title: 'Mobile First', desc: 'Manage your farm store, orders, and payments from any device, anywhere.', bg: '#fefce8', color: '#a16207' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated support team is always available to help farmers and buyers succeed.', bg: '#fff1f2', color: '#be123c' },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="font-semibold text-sm uppercase tracking-widest" style={{ color: '#0D592A' }}>Why AgriLink</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            Everything You Need to <span style={{ color: '#0D592A' }}>Grow</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            A complete platform built for the modern agricultural ecosystem — from smallholder farmers to large agri-businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc, bg, color }) => (
            <div key={title} className="group p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: bg }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
