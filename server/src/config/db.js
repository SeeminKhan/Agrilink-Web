const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    // Auto-seed demo users on first run
    await seedDemoUsers();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

async function seedDemoUsers() {
  const User = require('../models/User');
  const demos = [
    { name: 'John Mwangi',   email: 'farmer@demo.com',    passwordHash: 'password', role: 'farmer',    location: 'Nairobi, Kenya',    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
    { name: 'Sarah Osei',    email: 'buyer@demo.com',     passwordHash: 'password', role: 'buyer',     location: 'Accra, Ghana',      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80' },
    { name: 'David Kariuki', email: 'recruiter@demo.com', passwordHash: 'password', role: 'recruiter', location: 'Nairobi, Kenya',    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80' },
  ];
  for (const u of demos) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) { await User.create(u); console.log(`Seeded: ${u.email}`); }
  }
}

module.exports = connectDB;
