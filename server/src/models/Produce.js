const mongoose = require('mongoose');

const produceSchema = new mongoose.Schema(
  {
    farmerId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropName:       { type: String, required: true },
    quantity:       { type: Number, required: true },       // kg
    grade:          { type: String, enum: ['A', 'B', 'C'], default: 'A' },
    harvestDate:    { type: Date },
    location:       { type: String },
    coordinates:    {
      lat: { type: Number },
      lng: { type: Number },
    },
    priceSuggested: { type: Number },                       // from AI
    priceManual:    { type: Number },
    imageUrls:      [{ type: String }],
    qrCodeUrl:      { type: String },
    status:         { type: String, enum: ['available', 'sold'], default: 'available' },
    demandScore:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

produceSchema.index({ cropName: 1, status: 1 });
produceSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

module.exports = mongoose.model('Produce', produceSchema);
