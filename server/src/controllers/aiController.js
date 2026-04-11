const axios = require('axios');
const path = require('path');

const ML_QUALITY_URL = process.env.ML_QUALITY_URL || 'https://agrilink-ml-7.onrender.com/analyze-image';

// POST /ai/quality-check  (legacy — file upload, placeholder)
const qualityCheck = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Image file required' });
  const sizeKb = req.file.size / 1024;
  let freshnessScore, qualityGrade, expectedShelfLife;
  if (sizeKb > 200) {
    freshnessScore = 0.85 + Math.random() * 0.15;
    qualityGrade = 'A';
    expectedShelfLife = '7–10 days';
  } else if (sizeKb > 80) {
    freshnessScore = 0.6 + Math.random() * 0.2;
    qualityGrade = 'B';
    expectedShelfLife = '4–6 days';
  } else {
    freshnessScore = 0.3 + Math.random() * 0.3;
    qualityGrade = 'C';
    expectedShelfLife = '1–3 days';
  }
  res.json({
    qualityGrade,
    freshnessScore: parseFloat(freshnessScore.toFixed(2)),
    expectedShelfLife,
    imageUrl: `/uploads/${req.file.filename}`,
  });
};

// POST /ai/crop-quality  — proxies to Render ML service
const cropQuality = async (req, res, next) => {
  try {
    const { crop, image_url, market, harvest_days_ago, storage_condition, transport_time_hours } = req.body;

    if (!crop || !image_url) {
      return res.status(400).json({ message: 'crop and image_url are required' });
    }

    const payload = {
      crop: crop.toLowerCase().trim(),
      image_url,
      market: market || 'Nashik',
      harvest_days_ago: Number(harvest_days_ago) || 1,
      storage_condition: storage_condition || 'normal',
      transport_time_hours: Number(transport_time_hours) || 0,
    };

    const { data } = await axios.post(ML_QUALITY_URL, payload, { timeout: 30000 });
    res.json(data);
  } catch (err) {
    // If ML service is down, return a graceful fallback
    if (err.code === 'ECONNABORTED' || err.response?.status >= 500 || err.code === 'ENOTFOUND') {
      return res.json(fallbackQuality(req.body));
    }
    next(err);
  }
};

function fallbackQuality({ crop = 'crop', harvest_days_ago = 1, storage_condition = 'normal' }) {
  const days = Number(harvest_days_ago) || 1;
  const cold = storage_condition === 'cold';
  const freshness = Math.max(0.2, Math.min(0.98, 1 - (days * (cold ? 0.04 : 0.08))));
  const grade = freshness > 0.8 ? 'A' : freshness > 0.55 ? 'B' : 'C';
  const shelf = Math.max(1, Math.round(freshness * (cold ? 14 : 7)));
  return {
    quality_grade: grade,
    confidence: parseFloat((0.75 + Math.random() * 0.2).toFixed(2)),
    freshness_score: parseFloat(freshness.toFixed(2)),
    defect_percentage: parseFloat((Math.random() * (grade === 'A' ? 0.08 : grade === 'B' ? 0.18 : 0.35)).toFixed(2)),
    estimated_shelf_life_days: shelf,
    recommendation: grade === 'A'
      ? `Premium quality ${crop}. List at top price.`
      : grade === 'B'
      ? `Good quality. Sell within ${shelf} days for best price.`
      : `Below standard. Consider immediate sale or processing.`,
    source: 'fallback',
  };
}

module.exports = { qualityCheck, cropQuality };
