require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const i18nMiddleware = require('./middleware/i18nMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// Routes
const authRoutes        = require('./routes/authRoutes');
const produceRoutes     = require('./routes/produceRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const traceRoutes       = require('./routes/traceRoutes');
const matchingRoutes    = require('./routes/matchingRoutes');
const jobRoutes         = require('./routes/jobRoutes');
const analyticsRoutes   = require('./routes/analyticsRoutes');
const syncRoutes        = require('./routes/syncRoutes');
const voiceRoutes       = require('./routes/voiceRoutes');
const aiRoutes          = require('./routes/aiRoutes');

connectDB();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Static uploads ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── i18n ──────────────────────────────────────────────────────────────────────
app.use(i18nMiddleware);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/produce',     produceRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/trace',       traceRoutes);
app.use('/api/matching',    matchingRoutes);
app.use('/api/jobs',        jobRoutes);
app.use('/api/analytics',   analyticsRoutes);
app.use('/api/sync',        syncRoutes);
app.use('/api/voice',       voiceRoutes);
app.use('/api/ai',          aiRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AgriLink API running on port ${PORT}`));

module.exports = app;
