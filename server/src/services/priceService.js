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
      process.env.FASTAPI_URL || 'http://localhost:8000/predict',
      { crop, quantity, location, season },
      { timeout: 5000 }
    );
    return data.recommendedPrice;
  } catch {
    // Heuristic fallback: base price map
    const base = { tomatoes: 2.5, maize: 0.8, avocado: 3.2, default: 1.5 };
    return (base[crop.toLowerCase()] || base.default) * (1 + Math.random() * 0.2);
  }
};

module.exports = { predictPrice };
