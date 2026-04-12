import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Star, ShieldCheck, MessageCircle, Phone,
  Award, Leaf, Weight, Calendar, ChevronRight, X, CheckCircle,
  CreditCard, Banknote, Smartphone, Package,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getListingById, getListings } from '../../lib/listingsData';
import { ordersStore } from '../../lib/ordersStore';

const STEPS = ['Quantity', 'Address', 'Payment', 'Confirm'];

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = getListingById(Number(id)) || getListings()[0];
  const { t } = useTranslation();

  const [activeImg, setActiveImg] = useState(0);
  const [showOrder, setShowOrder] = useState(false);
  const [step, setStep] = useState(0);
  const [ordered, setOrdered] = useState(false);

  // Form state
  const [qty, setQty] = useState(10);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [payMethod, setPayMethod] = useState('M-Pesa');

  const total = (qty * listing.price).toFixed(2);

  const handlePlaceOrder = () => {
    ordersStore.add({
      productId: listing.id,
      product: listing.name,
      farmer: listing.farmer,
      farmerPhone: listing.farmerPhone,
      location: listing.location,
      qty, unit: listing.unit,
      pricePerUnit: listing.price,
      total: qty * listing.price,
      status: 'Pending',
      img: listing.img,
      address, city,
      paymentMethod: payMethod,
      lat: listing.lat,
      lng: listing.lng,
    });
    setOrdered(true);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <Link to="/buyer/browse" className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition mb-6">
        <ArrowLeft className="w-4 h-4" /> {t('listingDetails.backToListings')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="rounded-3xl overflow-hidden h-72 sm:h-80 mb-3 shadow-md">
            <img src={listing.images[activeImg]} alt={listing.name} className="w-full h-full object-cover" />
          </div>
          {listing.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {listing.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`rounded-2xl overflow-hidden h-20 shadow-sm transition border-2 ${activeImg === i ? 'border-green-500' : 'border-transparent hover:opacity-90'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {listing.tags.map(tag => (
              <span key={tag} className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">{listing.name}</h1>
          <p className="text-gray-500 text-sm mb-4">{listing.variety} · {listing.grade}</p>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-4 h-4 ${i <= Math.floor(listing.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700">{listing.rating}</span>
            <span className="text-sm text-gray-400">({listing.reviews} reviews)</span>
          </div>

          <div className="bg-green-50 rounded-2xl p-4 mb-5">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-green-600">${listing.price}</span>
              <span className="text-gray-500 text-sm mb-1">/{listing.unit}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{listing.qty} available · {listing.fresh}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { icon: Award, label: 'Grade', value: listing.grade },
              { icon: Weight, label: 'Available', value: listing.qty },
              { icon: Leaf, label: 'Type', value: listing.tags[0] },
              { icon: Calendar, label: 'Harvested', value: listing.harvestDate },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                <Icon className="w-4 h-4 text-green-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-bold text-gray-700">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">{listing.description}</p>

          <div className="flex gap-3">
            <button onClick={() => { setShowOrder(true); setStep(0); setOrdered(false); }}
              className="flex-1 flex items-center justify-center gap-2 gradient-green text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg shadow-green-200">
              Request to Buy <ChevronRight className="w-4 h-4" />
            </button>
            {/* WhatsApp */}
            <a href={`https://wa.me/${listing.farmerWhatsApp}?text=Hi%20${encodeURIComponent(listing.farmerOwner)}%2C%20I'm%20interested%20in%20your%20${encodeURIComponent(listing.name)}%20on%20AgriLink.`}
              target="_blank" rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-green-100 hover:bg-green-200 rounded-2xl text-green-600 transition"
              title="WhatsApp">
              <MessageCircle className="w-5 h-5" />
            </a>
            {/* Call */}
            <a href={`tel:${listing.farmerPhone}`}
              className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-blue-50 rounded-2xl text-gray-500 hover:text-blue-600 transition"
              title={`Call ${listing.farmerOwner}`}>
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Farmer card */}
      <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">{t('listingDetails.aboutFarmer')}</h3>
        <div className="flex items-start gap-4">
          <img src={listing.farmerAvatar} alt={listing.farmerOwner} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-gray-800">{listing.farmer}</p>
              {listing.farmerVerified && (
                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-1">{listing.farmerOwner}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
              <MapPin className="w-3 h-3" /> {listing.location}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {listing.farmerRating} rating</span>
              <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {listing.farmerSales}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Member since {listing.farmerJoined}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <a href={`https://wa.me/${listing.farmerWhatsApp}?text=Hi%20${encodeURIComponent(listing.farmerOwner)}%2C%20I%20saw%20your%20listing%20on%20AgriLink.`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 font-semibold text-sm rounded-xl hover:bg-green-100 transition">
              <MessageCircle className="w-4 h-4" /> Chat
            </a>
            <a href={`tel:${listing.farmerPhone}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-100 transition">
              <Phone className="w-4 h-4" /> Call
            </a>
          </div>
        </div>
      </div>

      {/* ── Order Modal ── */}
      <AnimatePresence>
        {showOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !ordered && setShowOrder(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden">

              {ordered ? (
                /* Success state */
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{t('listingDetails.orderPlaced')}</h3>
                  <p className="text-gray-500 text-sm mb-1">{t('listingDetails.orderConfirm', { qty, unit: listing.unit, product: listing.name })}</p>
                  <p className="text-gray-400 text-xs mb-6">{t('listingDetails.farmerConfirm')}</p>
                  <div className="flex gap-3">
                    <button onClick={() => { setShowOrder(false); navigate('/buyer/orders'); }}
                      className="flex-1 py-3 gradient-green text-white font-bold rounded-2xl text-sm hover:opacity-90 transition">
                      {t('listingDetails.trackOrder')}
                    </button>
                    <button onClick={() => setShowOrder(false)}
                      className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl text-sm hover:bg-gray-200 transition">
                      {t('listingDetails.continueShopping')}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="font-black text-gray-900">Place Order</h3>
                    <button onClick={() => setShowOrder(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Step indicator */}
                  <div className="flex items-center gap-1 px-6 py-3 border-b border-gray-50">
                    {STEPS.map((s, i) => (
                      <div key={s} className="flex items-center gap-1 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${i < step ? 'bg-green-500 text-white' : i === step ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                          style={i === step ? { backgroundColor: '#0D592A' } : {}}>
                          {i < step ? 'OK' : i + 1}
                        </div>
                        <span className={`text-xs font-semibold hidden sm:block ${i === step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
                        {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
                      </div>
                    ))}
                  </div>

                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      {/* Step 0 — Quantity */}
                      {step === 0 && (
                        <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                            <img src={listing.img} alt="" className="w-12 h-12 rounded-xl object-cover" />
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{listing.name}</p>
                              <p className="text-xs text-gray-400">${listing.price}/{listing.unit}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Quantity ({listing.unit})</label>
                            <div className="flex items-center gap-3">
                              <button onClick={() => setQty(q => Math.max(1, q - 5))}
                                className="w-10 h-10 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition text-lg">−</button>
                              <input type="number" value={qty} min={1}
                                onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                                className="flex-1 text-center py-2.5 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-green-300" />
                              <button onClick={() => setQty(q => q + 5)}
                                className="w-10 h-10 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition text-lg">+</button>
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-2xl p-4 flex justify-between items-center">
                            <span className="text-sm text-gray-600">Estimated Total</span>
                            <span className="text-xl font-black text-green-600">${total}</span>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 1 — Address */}
                      {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Delivery Address *</label>
                            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address, building, floor..."
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">City *</label>
                            <input value={city} onChange={e => setCity(e.target.value)} placeholder="City"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-300 transition" />
                          </div>
                          <div className="bg-blue-50 rounded-2xl p-3 text-xs text-blue-700 flex items-start gap-2">
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                            Delivery from <strong className="mx-1">{listing.location}</strong> — estimated 2–4 days
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2 — Payment */}
                      {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Select Payment Method</p>
                          {[
                            { id: 'M-Pesa', label: 'M-Pesa', icon: Smartphone, desc: 'Pay via mobile money' },
                            { id: 'Card', label: 'Debit / Credit Card', icon: CreditCard, desc: 'Visa, Mastercard' },
                            { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
                          ].map(({ id, label, icon: Icon, desc }) => (
                            <button key={id} onClick={() => setPayMethod(id)}
                              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition text-left ${payMethod === id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payMethod === id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm">{label}</p>
                                <p className="text-xs text-gray-400">{desc}</p>
                              </div>
                              {payMethod === id && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                            </button>
                          ))}
                        </motion.div>
                      )}

                      {/* Step 3 — Confirm */}
                      {step === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                          <h4 className="font-bold text-gray-700 text-sm">Order Summary</h4>
                          {[
                            ['Product', `${listing.name} (${listing.variety})`],
                            ['Quantity', `${qty} ${listing.unit}`],
                            ['Price per unit', `$${listing.price}`],
                            ['Delivery to', `${address}, ${city}`],
                            ['Payment', payMethod],
                          ].map(([k, v]) => (
                            <div key={k} className="flex justify-between text-sm py-2 border-b border-gray-50">
                              <span className="text-gray-500">{k}</span>
                              <span className="font-semibold text-gray-800 text-right max-w-[55%]">{v}</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-base font-black pt-2">
                            <span>Total</span>
                            <span className="text-green-600">${total}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex gap-3 mt-6">
                      {step > 0 && (
                        <button onClick={() => setStep(s => s - 1)}
                          className="px-5 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                          Back
                        </button>
                      )}
                      {step < STEPS.length - 1 ? (
                        <button onClick={() => {
                          if (step === 1 && (!address.trim() || !city.trim())) return;
                          setStep(s => s + 1);
                        }}
                          disabled={step === 1 && (!address.trim() || !city.trim())}
                          className="flex-1 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-40"
                          style={{ backgroundColor: '#0D592A' }}>
                          Continue
                        </button>
                      ) : (
                        <button onClick={handlePlaceOrder}
                          className="flex-1 py-3 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
                          style={{ backgroundColor: '#0D592A' }}>
                          <Package className="w-4 h-4 inline mr-2" />
                          Place Order
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
