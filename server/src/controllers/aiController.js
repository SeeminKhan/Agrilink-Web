// POST /ai/quality-check
// Placeholder logic — swap inner scoring with a real model call when ready.
const qualityCheck = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Image file required' });

  // Placeholder scoring based on file size as a proxy for image richness
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
    note: 'Placeholder result — integrate ML model for production use.',
  });
};

module.exports = { qualityCheck };
