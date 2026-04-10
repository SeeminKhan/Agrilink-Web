const mongoose = require('mongoose');

const traceLogSchema = new mongoose.Schema(
  {
    produceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produce', required: true },
    actor:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    event:     { type: String, required: true },   // e.g. "harvested", "graded", "shipped"
    note:      { type: String },
    location:  { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TraceLog', traceLogSchema);
