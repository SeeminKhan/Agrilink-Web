/**
 * Weighted matching score between a buyer and a produce listing.
 * Weights are configurable via env vars for future ML upgrade.
 */

const DISTANCE_WEIGHT = parseFloat(process.env.MATCH_DISTANCE_W || '0.4');
const DEMAND_WEIGHT   = parseFloat(process.env.MATCH_DEMAND_W   || '0.35');
const PRICE_WEIGHT    = parseFloat(process.env.MATCH_PRICE_W    || '0.25');

/**
 * Haversine distance in km between two lat/lng points.
 */
const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Score a single produce listing for a buyer.
 * @param {{ coordinates?: { lat, lng } }} buyer
 * @param {object} produce  Mongoose Produce doc
 * @param {number} avgMarketPrice  for fairness calc
 */
const scoreMatch = (buyer, produce, avgMarketPrice = 2) => {
  // Proximity score (0–1): closer = higher
  let proximityScore = 0.5;
  if (buyer.coordinates && produce.coordinates?.lat) {
    const dist = haversine(
      buyer.coordinates.lat, buyer.coordinates.lng,
      produce.coordinates.lat, produce.coordinates.lng
    );
    proximityScore = Math.max(0, 1 - dist / 500); // normalise over 500 km
  }

  // Demand score (0–1): stored on produce
  const demandScore = Math.min(1, (produce.demandScore || 0) / 100);

  // Price fairness (0–1): closer to market avg = higher
  const price = produce.priceSuggested || produce.priceManual || avgMarketPrice;
  const priceFairness = Math.max(0, 1 - Math.abs(price - avgMarketPrice) / avgMarketPrice);

  const total =
    DISTANCE_WEIGHT * proximityScore +
    DEMAND_WEIGHT   * demandScore +
    PRICE_WEIGHT    * priceFairness;

  return parseFloat(total.toFixed(4));
};

module.exports = { scoreMatch, haversine };
