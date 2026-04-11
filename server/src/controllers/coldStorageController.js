const ColdStorageBooking = require('../models/ColdStorageBooking');

// Seed facility data (static — no DB needed for facilities)
const FACILITIES = [
  {
    id: 'ST001', name: 'Nashik Cold Hub', location: 'Nashik, Maharashtra',
    distanceKm: 4.2, capacityTons: 500, availableTons: 180, pricePerTonPerDay: 12,
    tempRange: '2–8°C', status: 'Optimal', phone: '+912532345678',
    crops: ['Tomato', 'Onion', 'Grapes', 'Pomegranate'],
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
    logs: [
      { time: '06:00', temp: 4, humidity: 85, ok: true },
      { time: '09:00', temp: 5, humidity: 84, ok: true },
      { time: '12:00', temp: 6, humidity: 83, ok: true },
      { time: '15:00', temp: 5, humidity: 85, ok: true },
      { time: '18:00', temp: 4, humidity: 86, ok: true },
      { time: '21:00', temp: 4, humidity: 85, ok: true },
    ],
  },
  {
    id: 'ST002', name: 'Pune AgroFreeze', location: 'Pune, Maharashtra',
    distanceKm: 12.8, capacityTons: 300, availableTons: 60, pricePerTonPerDay: 15,
    tempRange: '0–5°C', status: 'Moderate', phone: '+912022345678',
    crops: ['Potato', 'Cabbage', 'Cauliflower', 'Strawberry'],
    img: 'https://images.unsplash.com/photo-1565793979680-f1d3f3b5e5e5?w=600&q=80',
    logs: [
      { time: '06:00', temp: 3, humidity: 80, ok: true },
      { time: '09:00', temp: 4, humidity: 79, ok: true },
      { time: '12:00', temp: 7, humidity: 78, ok: false },
      { time: '15:00', temp: 6, humidity: 80, ok: false },
      { time: '18:00', temp: 5, humidity: 81, ok: true },
      { time: '21:00', temp: 4, humidity: 82, ok: true },
    ],
  },
  {
    id: 'ST003', name: 'Nagpur CoolStore', location: 'Nagpur, Maharashtra',
    distanceKm: 28.5, capacityTons: 800, availableTons: 420, pricePerTonPerDay: 10,
    tempRange: '4–10°C', status: 'Optimal', phone: '+917122345678',
    crops: ['Orange', 'Mango', 'Banana', 'Soybean'],
    img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
    logs: [
      { time: '06:00', temp: 6, humidity: 75, ok: true },
      { time: '09:00', temp: 7, humidity: 74, ok: true },
      { time: '12:00', temp: 8, humidity: 73, ok: true },
      { time: '15:00', temp: 8, humidity: 74, ok: true },
      { time: '18:00', temp: 7, humidity: 75, ok: true },
      { time: '21:00', temp: 6, humidity: 76, ok: true },
    ],
  },
  {
    id: 'ST004', name: 'Solapur FreshVault', location: 'Solapur, Maharashtra',
    distanceKm: 45.0, capacityTons: 200, availableTons: 0, pricePerTonPerDay: 11,
    tempRange: '3–7°C', status: 'Risk', phone: '+912172345678',
    crops: ['Pomegranate', 'Turmeric', 'Onion'],
    img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80',
    logs: [
      { time: '06:00', temp: 5, humidity: 70, ok: true },
      { time: '09:00', temp: 9, humidity: 68, ok: false },
      { time: '12:00', temp: 12, humidity: 65, ok: false },
      { time: '15:00', temp: 11, humidity: 66, ok: false },
      { time: '18:00', temp: 9, humidity: 68, ok: false },
      { time: '21:00', temp: 8, humidity: 70, ok: false },
    ],
  },
];

// GET /cold-storage/facilities
const getFacilities = (req, res) => {
  const { status } = req.query;
  const result = status && status !== 'All'
    ? FACILITIES.filter(f => f.status === status)
    : FACILITIES;
  res.json(result);
};

// GET /cold-storage/my
const getMyCrops = async (req, res, next) => {
  try {
    const crops = await ColdStorageBooking.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) { next(err); }
};

// POST /cold-storage
const bookStorage = async (req, res, next) => {
  try {
    const { cropName, quantity, storageId, storageName, storageLocation, entryDate, expectedShelfLife } = req.body;
    const facility = FACILITIES.find(f => f.id === storageId);
    const booking = await ColdStorageBooking.create({
      farmerId: req.user._id,
      cropName, quantity, storageId,
      storageName: storageName || facility?.name || storageId,
      storageLocation: storageLocation || facility?.location || '',
      entryDate: entryDate || new Date().toISOString().split('T')[0],
      expectedShelfLife: Number(expectedShelfLife) || 10,
      tempLogs: facility?.logs || [],
    });
    res.status(201).json(booking);
  } catch (err) { next(err); }
};

// PATCH /cold-storage/:id/status
const updateCropStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const crop = await ColdStorageBooking.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.user._id },
      { status },
      { new: true }
    );
    if (!crop) return res.status(404).json({ message: 'Booking not found' });
    res.json(crop);
  } catch (err) { next(err); }
};

// DELETE /cold-storage/:id
const deleteCrop = async (req, res, next) => {
  try {
    await ColdStorageBooking.findOneAndDelete({ _id: req.params.id, farmerId: req.user._id });
    res.json({ message: 'Removed' });
  } catch (err) { next(err); }
};

module.exports = { getFacilities, getMyCrops, bookStorage, updateCropStatus, deleteCrop };
