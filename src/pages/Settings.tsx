import { useState } from 'react';
import { User, Lock, Globe, Bell, Camera, Save, Eye, EyeOff } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const languages = ['English', 'French', 'Swahili', 'Hausa', 'Amharic', 'Yoruba', 'Zulu'];

const notifSettings = [
  { id: 'new_order', label: 'New Order Requests', desc: 'Get notified when a buyer requests your product', enabled: true },
  { id: 'price_alert', label: 'Price Alerts', desc: 'Alerts when market prices change significantly', enabled: true },
  { id: 'messages', label: 'New Messages', desc: 'Notifications for new chat messages', enabled: true },
  { id: 'training', label: 'Training Updates', desc: 'New training modules and course completions', enabled: false },
  { id: 'promotions', label: 'Promotions & Offers', desc: 'Special deals and platform announcements', enabled: false },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPass, setShowPass] = useState(false);
  const [lang, setLang] = useState('English');
  const [notifs, setNotifs] = useState(notifSettings);

  const toggleNotif = (id: string) => {
    setNotifs(n => n.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition';

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account preferences and settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === id ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === id ? 'text-green-600' : 'text-gray-400'}`} />
                {label}
                {activeTab === id && <div className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="animate-slide-up space-y-6">
              <h2 className="font-bold text-gray-800 text-lg">Profile Information</h2>
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80"
                    alt="Avatar"
                    className="w-20 h-20 rounded-2xl object-cover shadow-md"
                  />
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center shadow hover:bg-green-700 transition">
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-gray-800">John Farmer</p>
                  <p className="text-sm text-gray-400">Farmer · Nairobi, Kenya</p>
                  <button className="text-xs text-green-600 font-semibold mt-1 hover:underline">Change photo</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">First Name</label>
                  <input type="text" defaultValue="John" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Last Name</label>
                  <input type="text" defaultValue="Farmer" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                  <input type="email" defaultValue="john@farm.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                  <input type="tel" defaultValue="+254 700 000 000" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Location</label>
                  <input type="text" defaultValue="Nairobi, Kenya" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Bio</label>
                  <textarea rows={3} defaultValue="Organic farmer with 10+ years of experience growing tomatoes and avocados in the Nairobi highlands."
                    className={`${inputClass} resize-none`} />
                </div>
              </div>

              <button className="flex items-center gap-2 gradient-green text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-lg shadow-green-200 text-sm">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {/* Password */}
          {activeTab === 'password' && (
            <div className="animate-slide-up space-y-5">
              <h2 className="font-bold text-gray-800 text-lg">Change Password</h2>
              {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => (
                <div key={label}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className={inputClass} />
                    {i === 1 && (
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700">
                Password must be at least 8 characters and include a number and special character.
              </div>
              <button className="flex items-center gap-2 gradient-green text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-lg shadow-green-200 text-sm">
                <Lock className="w-4 h-4" /> Update Password
              </button>
            </div>
          )}

          {/* Language */}
          {activeTab === 'language' && (
            <div className="animate-slide-up space-y-5">
              <h2 className="font-bold text-gray-800 text-lg">Language Preferences</h2>
              <p className="text-sm text-gray-500">Choose your preferred language for the AgriLink interface.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languages.map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`py-3 px-4 rounded-2xl border-2 text-sm font-semibold transition ${
                      lang === l ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-green-300'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 gradient-green text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-lg shadow-green-200 text-sm">
                <Save className="w-4 h-4" /> Save Language
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="animate-slide-up space-y-5">
              <h2 className="font-bold text-gray-800 text-lg">Notification Settings</h2>
              <p className="text-sm text-gray-500">Control which notifications you receive from AgriLink.</p>
              <div className="space-y-3">
                {notifs.map(n => (
                  <div key={n.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex-1 mr-4">
                      <p className="text-sm font-bold text-gray-800">{n.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotif(n.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${n.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${n.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 gradient-green text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-lg shadow-green-200 text-sm">
                <Save className="w-4 h-4" /> Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
