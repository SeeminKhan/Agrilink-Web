const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    postedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:        { type: String, required: true },
    company:      { type: String },
    location:     { type: String },
    type:         { type: String, enum: ['Full-time', 'Seasonal', 'Contract'], default: 'Seasonal' },
    skill:        { type: String, enum: ['Beginner', 'Skilled', 'Expert'], default: 'Beginner' },
    duration:     { type: String },
    wage:         { type: String },
    cropType:     { type: String },
    tags:         [{ type: String }],
    description:  { type: String },
    responsibilities: [{ type: String }],
    skills:       [{ type: String }],
    contact:      { type: String },
    imageUrl:     { type: String },
    status:       { type: String, enum: ['Open', 'Closed', 'Filled'], default: 'Open' },
    views:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
