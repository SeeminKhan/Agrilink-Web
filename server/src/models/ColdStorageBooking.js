const mongoose = require('mongoose');

const tempLogSchema = new mongoose.Schema({
  time:     { type: String },
  temp:     { type: Number },
  humidity: { type: Number },
  ok:       { type: Boolean, default: true },
}, { _id: false });

const coldStorageBookingSchema = new mongoose.Schema(
  {
    farmerId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropName:          { type: String, required: true },
    quantity:          { type: String, required: true },
    storageId:         { type: String, required: true },
    storageName:       { type: String, required: true },
    storageLocation:   { type: String },
    entryDate:         { type: String, required: true },
    expectedShelfLife: { type: Number, required: true },
    status:            { type: String, enum: ['Stored', 'Listed', 'Sold'], default: 'Stored' },
    pricePerUnit:      { type: Number },
    tempLogs:          [tempLogSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ColdStorageBooking', coldStorageBookingSchema);
