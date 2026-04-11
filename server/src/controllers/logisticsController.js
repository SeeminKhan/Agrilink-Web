const LogisticsBooking = require('../models/LogisticsBooking');

const VEHICLES = [
  {
    id: 'V001', type: 'Mini Truck', driverName: 'Ramesh Patil', driverPhone: '+919876543210',
    vehicleNumber: 'MH-15-AB-1234', distanceKm: 2.4, costPerKm: 18, capacity: '1 ton',
    availability: 'Available', rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
  },
  {
    id: 'V002', type: 'Pickup', driverName: 'Suresh Jadhav', driverPhone: '+919765432109',
    vehicleNumber: 'MH-09-CD-5678', distanceKm: 4.1, costPerKm: 12, capacity: '500 kg',
    availability: 'Available', rating: 4.5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
  },
  {
    id: 'V003', type: 'Large Truck', driverName: 'Vijay Shinde', driverPhone: '+919654321098',
    vehicleNumber: 'MH-22-EF-9012', distanceKm: 7.8, costPerKm: 25, capacity: '5 tons',
    availability: 'Busy', rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80',
  },
  {
    id: 'V004', type: 'Mini Truck', driverName: 'Anil Deshmukh', driverPhone: '+919543210987',
    vehicleNumber: 'MH-04-GH-3456', distanceKm: 3.2, costPerKm: 16, capacity: '1.5 tons',
    availability: 'Available', rating: 4.6,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
  },
];

const TIMELINE_STEPS = ['Assigned', 'On the Way', 'Picked Up', 'In Transit', 'Delivered'];

// GET /logistics/vehicles
const getVehicles = (req, res) => {
  const { type, availability } = req.query;
  let result = [...VEHICLES];
  if (type && type !== 'All') result = result.filter(v => v.type === type);
  if (availability && availability !== 'All') result = result.filter(v => v.availability === availability);
  res.json(result);
};

// GET /logistics/my
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await LogisticsBooking.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { next(err); }
};

// POST /logistics
const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, pickupLocation, dropLocation, distanceKm, cropName, quantity, fromColdStorage, coldStorageName } = req.body;
    const vehicle = VEHICLES.find(v => v.id === vehicleId);
    if (!vehicle) return res.status(400).json({ message: 'Vehicle not found' });
    if (vehicle.availability === 'Busy') return res.status(400).json({ message: 'Vehicle is currently busy' });

    const totalCost = Math.round(Number(distanceKm) * vehicle.costPerKm);
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const booking = await LogisticsBooking.create({
      farmerId: req.user._id,
      vehicleId,
      vehicleType: vehicle.type,
      driverName: vehicle.driverName,
      driverPhone: vehicle.driverPhone,
      vehicleNumber: vehicle.vehicleNumber,
      pickupLocation, dropLocation,
      distanceKm: Number(distanceKm),
      totalCost, cropName, quantity,
      fromColdStorage: Boolean(fromColdStorage),
      coldStorageName,
      status: 'Assigned',
      timeline: TIMELINE_STEPS.map((label, i) => ({
        label, done: i === 0, time: i === 0 ? now : '',
      })),
    });
    res.status(201).json(booking);
  } catch (err) { next(err); }
};

// PATCH /logistics/:id/advance
const advanceStatus = async (req, res, next) => {
  try {
    const booking = await LogisticsBooking.findOne({ _id: req.params.id, farmerId: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const currentIdx = TIMELINE_STEPS.indexOf(booking.status);
    if (currentIdx >= TIMELINE_STEPS.length - 1) return res.json(booking);

    const nextStatus = TIMELINE_STEPS[currentIdx + 1];
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    booking.status = nextStatus;
    booking.timeline = booking.timeline.map((t, i) =>
      i <= currentIdx + 1 ? { ...t.toObject(), done: true, time: t.time || now } : t.toObject()
    );
    await booking.save();
    res.json(booking);
  } catch (err) { next(err); }
};

module.exports = { getVehicles, getMyBookings, createBooking, advanceStatus };
