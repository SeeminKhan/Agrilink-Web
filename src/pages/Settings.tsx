import { useState, useRef } from 'react';
import { User, Lock, Globe, Bell, Camera, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/AuthContext';
import { setLanguage, LANG_OPTIONS, type SupportedLang } from '../lib/i18n';

const notifDefaults = [
  { id: 'new_order',   label: 'New Order Requests',  desc: 'Get notified when a buyer requests your product', enabled: true },
  { id: 'price_alert', label: 'Price Alerts',         desc: 'Alerts when market prices change significantly',  enabled: true },
  { id: 'messages',    label: 'New Messages',         desc: 'Notifications for new chat messages',             enabled: true },
  { id: 'training',    label: 'Training Updates',     desc: 'New training modules and course completions',     enabled: false },
  { id: 'promotions',  label: 'Promotions & Offers',  desc: 'Special deals and platform announcements',        enabled: false },
];

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { t, i18n } = useTranslation();

  const [activeTab, setActiveTab]   = useState('profile');
  const [saved, setSaved]           = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const [lang, setLang]             = useState<SupportedLang>((i18n.language as SupportedLang) || 'en');
  const [notifs, setNotifs]         = useState(notifDefaults);

  // Profile fields — seeded from real auth user
  const [avatar, setAvatar]         = useState(user?.avatar || '');
  const [firstName, setFirstName]   = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName]     = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail]           = useState(user?.email || '');
  const [phone, setPhone]           = useState(user?.phone || '');
  const [location, setLocation]     = useState(user?.location || '');
  const [bio, setBio]               = useState('');

  const fileRef = useRef<HTMLInputElement>(null);

  // ── Avatar picker ────────────────────────────────────────────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // ── Save profile ─────────────────────────────────────────────────────────
  const tabs = [
    { id: 'profile',       label: t('settings.profile'),       icon: User },
    { id: 'password',      label: t('settings.password'),      icon: Lock },
    { id: 'language',      label: t('settings.language'),      icon: Globe },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
  ];

  const handleSaveLanguage = () => {
    setLanguage(lang);
    flashSaved();
  };
  const handleSaveProfile = () => {
    updateUser({
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      location,
      avatar,
    });
    flashSaved();
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleNotif = (id: string) =>
    setNotifs(n => n.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));

  const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition';

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">{t('settings.title')}</h1>
        <p className="text-gray-500 text-sm mt-0.5">{t('settings.subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === id ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}>
                <Icon className={`w-4 h-4 ${activeTab === id ? 'text-green-600' : 'text-gray-400'}`} />
                {label}
                {activeTab === id && <div className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content panel */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">

          {/* ── Profile ── */}
          {activeTab === 'profile' && (
            <div className="animate-slide-up space-y-6">
              <h2 className="font-bold text-gray-800 text-lg">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <img
                    src={avatar || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80'}
                    alt="Avatar"
                    className="w-20 h-20 rounded-2xl object-cover shadow-md"
                  />
                  {/* Overlay on hover */}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer"
                    title="Change photo"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                  {/* Camera badge */}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center shadow hover:bg-green-700 transition"
                  >
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
                  {/* Hidden file input */}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{`${firstName} ${lastName}`.trim() || 'Your Name'}</p>
                  <p className="text-sm text-gray-400 capitalize">{user?.role} · {location || 'Location'}</p>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-xs text-green-600 font-semibold mt-1 hover:underline"
                  >
                    Change photo
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 700 000 000" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Location</label>
                  <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Bio</label>
                  <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)}
                    placeholder="Tell buyers and farmers a bit about yourself..."
                    className={`${inputClass} resize-none`} />
                </div>
              </div>

              <button onClick={handleSaveProfile}
                className="flex items-center gap-2 gradient-green text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-lg shadow-green-200 text-sm">
                {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          )}

          {/* ── Password ── */}
          {activeTab === 'password' && (
            <div className="animate-slide-up space-y-5">
              <h2 className="font-bold text-gray-800 text-lg">Change Password</h2>
              {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => (
                <div key={label}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className={inputClass} />
                    {i === 1 && (
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700">
                Password must be at least 6 characters.
              </div>
              <button onClick={flashSaved}
                className="flex items-center gap-2 gradient-green text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-lg shadow-green-200 text-sm">
                {saved ? <><CheckCircle className="w-4 h-4" /> Updated!</> : <><Lock className="w-4 h-4" /> Update Password</>}
              </button>
            </div>
          )}

          {/* ── Language ── */}
          {activeTab === 'language' && (
            <div className="animate-slide-up space-y-5">
              <h2 className="font-bold text-gray-800 text-lg">{t('settings.languagePrefs')}</h2>
              <p className="text-sm text-gray-500">{t('settings.chooseLanguage')}</p>
              <div className="grid grid-cols-1 gap-3">
                {LANG_OPTIONS.map(l => (
                  <button key={l.code} onClick={() => setLang(l.code)}
                    className={`flex items-center gap-4 py-4 px-5 rounded-2xl border-2 text-left transition ${
                      lang === l.code ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                    }`}>
                    <span className="text-2xl">{l.flag}</span>
                    <div>
                      <p className={`font-bold text-sm ${lang === l.code ? 'text-green-700' : 'text-gray-700'}`}>{l.native}</p>
                      <p className="text-xs text-gray-400">{l.label}</p>
                    </div>
                    {lang === l.code && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                  </button>
                ))}
              </div>
              <button onClick={handleSaveLanguage}
                className="flex items-center gap-2 gradient-green text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-lg shadow-green-200 text-sm">
                {saved ? <><CheckCircle className="w-4 h-4" /> {t('settings.saved')}</> : <><Save className="w-4 h-4" /> {t('settings.saveLanguage')}</>}
              </button>
            </div>
          )}

          {/* ── Notifications ── */}
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
                    <button onClick={() => toggleNotif(n.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${n.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${n.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={flashSaved}
                className="flex items-center gap-2 gradient-green text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-lg shadow-green-200 text-sm">
                {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Preferences</>}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
