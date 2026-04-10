/**
 * Seeds the three demo users into MongoDB.
 * Run once: node src/config/seed.js
 * Safe to re-run — skips existing emails.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const DEMO_USERS = [
  {
    name: 'John Mwangi', email: 'farmer@demo.com', passwordHash: 'password',
    role: 'farmer', location: 'Nairobi, Kenya',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
  },
  {
    name: 'Sarah Osei', email: 'buyer@demo.com', passwordHash: 'password',
    role: 'buyer', location: 'Accra, Ghana',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
  },
  {
    name: 'David Kariuki', email: 'recruiter@demo.com', passwordHash: 'password',
    role: 'recruiter', location: 'Nairobi, Kenya',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
  },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  for (const u of DEMO_USERS) {
    const exists = await User.findOne({ email: u.email });
    if (exists) { console.log(`skip: ${u.email}`); continue; }
    await User.create(u);
    console.log(`seeded: ${u.email}`);
  }
  await mongoose.disconnect();
  console.log('done');
})();
