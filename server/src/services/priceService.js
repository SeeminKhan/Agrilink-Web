const axios = require('axios');

/**
 * Call the FastAPI price prediction microservice.
 * Falls back to a simple heuristic if the service is unavailable.
 *
 * @param {{ crop: string, quantity: number, location: string, season?: string }} params
 * @returns {Promise<number>} recommendedPrice
 */
const predictPrice = async ({ crop, quantity, location, season = 'current' }) => {
  try {
    const { data } = await axios.post(
      process.env.FASTAPI_URL || 'https://agrilink-ml-3.onrender.com/predict-price',
      {
        crop: crop.toLowerCase(),
        season,
        market: location || 'Nashik',
        quality_grade: 'B',
        quantity_quintals: Math.max(1, Math.round(quantity / 100)),
        rainfall_mm: 80,
        days_to_market: 1,
      },
      { timeout: 8000 }
    );
    return data.predicted_price_per_kg;
  } catch {
    const base = { tomatoes: 18, maize: 8, avocado: 32, default: 15 };
    return (base[crop.toLowerCase()] || base.default) * (1 + Math.random() * 0.2);
  }
};

module.exports = { predictPrice };
