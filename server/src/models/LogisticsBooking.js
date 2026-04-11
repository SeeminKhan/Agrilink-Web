const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  label: { type: String },
  time:  { type: String, default: '' },
  done:  { type: Boolean, default: false },
}, { _id: false });

const logisticsBookingSchema = new mongoose.Schema(
  {
    farmerId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleId:       { type: String, required: true },
    vehicleType:     { type: String },
    driverName:      { type: String },
    driverPhone:     { type: String },
    vehicleNumber:   { type: String },
    pickupLocation:  { type: String, required: true },
    dropLocation:    { type: String, required: true },
    distanceKm:      { type: Number, required: true },
    totalCost:       { type: Number, required: true },
    cropName:        { type: String },
    quantity:        { type: String },
    status:          {
      type: String,
      enum: ['Assigned', 'On the Way', 'Picked Up', 'In Transit', 'Delivered'],
      default: 'Assigned',
    },
    timeline:        [timelineSchema],
    fromColdStorage: { type: Boolean, default: false },
    coldStorageName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LogisticsBooking', logisticsBookingSchema);
