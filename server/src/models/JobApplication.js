const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    experience: { type: String },
    note:       { type: String },
    documentUrl:{ type: String },
    status:     { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

jobApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
