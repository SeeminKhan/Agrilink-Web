const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ['farmer', 'buyer', 'recruiter', 'admin'], default: 'buyer' },
    phone:        { type: String },
    location:     { type: String },
    language:     { type: String, enum: ['en', 'hi', 'mr'], default: 'en' },
    primaryCrop:  { type: String },   // farmer only
    avatar:       { type: String },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
