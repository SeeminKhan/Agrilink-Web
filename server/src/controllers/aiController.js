const axios = require('axios');

const ML_BASE_URL = (process.env.ML_QUALITY_URL || 'https://agrilink-ml-7.onrender.com/analyze-image')
  .replace('/analyze-image', '').replace('/analyze-b64', '');

const qualityCheck = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Image file required' });
  const sizeKb = req.file.size / 1024;
  let freshnessScore, qualityGrade, expectedShelfLife;
  if (sizeKb > 200) { freshnessScore = 0.85 + Math.random() * 0.15; qualityGrade = 'A'; expectedShelfLife = '7-10 days'; }
  else if (sizeKb > 80) { freshnessScore = 0.6 + Math.random() * 0.2; qualityGrade = 'B'; expectedShelfLife = '4-6 days'; }
  else { freshnessScore = 0.3 + Math.random() * 0.3; qualityGrade = 'C'; expectedShelfLife = '1-3 days'; }
  res.json({ qualityGrade, freshnessScore: parseFloat(freshnessScore.toFixed(2)), expectedShelfLife, imageUrl: `/uploads/${req.file.filename}` });
};

const cropQuality = async (req, res) => {
  const { crop, image_url, harvest_days_ago, storage_condition } = req.body;
  if (!crop) return res.status(400).json({ message: 'crop is required' });
  if (!image_url) return res.json(fallbackQuality({ crop, harvest_days_ago, storage_condition }));
  let image_b64;
  try {
    const imgResp = await axios.get(image_url, { responseType: 'arraybuffer', timeout: 10000 });
    image_b64 = Buffer.from(imgResp.data).toString('base64');
  } catch { return res.json(fallbackQuality({ crop, harvest_days_ago, storage_condition })); }
  try {
    const { data } = await axios.post(`${ML_BASE_URL}/analyze-b64`, { image_b64, crop_hint: crop.toLowerCase().trim() }, { timeout: 30000 });
    res.json({
      quality_grade: data.quality_grade,
      confidence: parseFloat((data.disease_confidence || 0.85).toFixed(2)),
      freshness_score: parseFloat(((data.freshness_score || 75) / 100).toFixed(2)),
      defect_percentage: parseFloat((data.is_diseased ? (data.disease_confidence || 0.2) : 0.05).toFixed(2)),
      estimated_shelf_life_days: data.shelf_life_days || 5,
      recommendation: data.summary || `${data.grade_label || data.quality_grade} quality.`,
      disease_label: data.disease_label,
      urgency_level: data.urgency_level,
      source: 'ml',
    });
  } catch { return res.json(fallbackQuality({ crop, harvest_days_ago, storage_condition })); }
};

function fallbackQuality({ crop = 'crop', harvest_days_ago = 1, storage_condition = 'normal' } = {}) {
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
    recommendation: grade === 'A' ? `Premium quality ${crop}. List at top price.`
      : grade === 'B' ? `Good quality. Sell within ${shelf} days for best price.`
      : `Below standard. Consider immediate sale or processing.`,
    source: 'fallback',
  };
}

module.exports = { qualityCheck, cropQuality };
