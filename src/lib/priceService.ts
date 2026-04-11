/**
 * AgriLink ML service — Price Prediction + Demand Forecast
 * Base: https://agrilink-ml-3.onrender.com
 */

export interface PriceResult {
  predicted_price_per_kg: number;
  price_range: { low: number; high: number };
  confidence: number;
  factors?: Record<string, unknown>;
}

export interface ForecastDay {
  date: string;
  day: string;
  demand_estimate: number;
  unit: string;
}

export interface ForecastResult {
  crop: string;
  trend: string;
  forecast: ForecastDay[];
  source?: 'api' | 'local';
}

// Maharashtra mandi markets
export const MH_MARKETS = [
  'Nashik', 'Pune', 'Nagpur', 'Aurangabad', 'Solapur',
  'Kolhapur', 'Satara', 'Sangli', 'Ahmednagar', 'Jalgaon',
  'Latur', 'Nanded', 'Mumbai', 'Thane',
];

const ML_BASE      = import.meta.env.VITE_ML_API_URL ?? 'https://agrilink-ml-3.onrender.com';
const PRICE_API    = `${ML_BASE}/predict-price`;
const FORECAST_API = `${ML_BASE}/forecast`;

// Normalise crop name for the API
const normCrop = (crop: string) =>
  crop.toLowerCase().replace(/\s+/g, '_').replace(/s$/, ''); // "Tomatoes" → "tomato"

const GRADE_MAP: Record<string, string> = {
  'Grade A': 'A', 'Grade B': 'B', 'Grade C': 'C', 'Organic': 'A',
};

const getSeason = (harvestDate?: string): string => {
  const m = harvestDate ? new Date(harvestDate).getMonth() : new Date().getMonth();
  if (m >= 5 && m <= 9) return 'kharif';
  if (m >= 10 || m <= 1) return 'rabi';
  return 'zaid';
};

export const predictPrice = async (params: {
  crop: string;
  grade: string;
  quantity: number;
  market?: string;
  harvestDate?: string;
  rainfall_mm?: number;
  days_to_market?: number;
}): Promise<PriceResult> => {
  const body = {
    crop: normCrop(params.crop),
    season: getSeason(params.harvestDate),
    market: params.market || 'Nashik',
    quality_grade: GRADE_MAP[params.grade] || 'B',
    quantity_quintals: Math.max(1, Math.round(params.quantity / 100)),
    rainfall_mm: params.rainfall_mm ?? 80,
    days_to_market: params.days_to_market ?? 1,
  };
  const res = await fetch(PRICE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Price API ${res.status}`);
  return res.json();
};

export const forecastDemand = async (crop: string, steps = 7): Promise<ForecastResult> => {
  try {
    const res = await fetch(FORECAST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop: normCrop(crop), steps }),
    });
    if (!res.ok) throw new Error(`Forecast API ${res.status}`);
    const data = await res.json();
    // API returns an error object when CSV is missing
    if (data.error) throw new Error(data.error);
    return { ...data, source: 'api' };
  } catch {
    // Fall back to local Holt-Winters engine
    const { localForecast } = await import('./demandForecast');
    return localForecast(crop, steps);
  }
};

// ── Buyer Matching ────────────────────────────────────────────────────────────

export interface BuyerMatch {
  buyer_name: string;
  score: number;
  offered_price: number;
  distance_km: number;
  quantity_needed_kg?: number;
  location?: string;
  contact?: string;
}

export interface MatchResult {
  matches: BuyerMatch[];
  source: 'api' | 'local';
}

const MATCH_API = `${ML_BASE}/match-buyers`;

// Haversine distance in km
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Realistic Maharashtra buyer pool for local fallback
const BUYER_POOL = [
  { name: 'Nashik Agro Traders',    lat: 20.006, lon: 73.790, base_price_factor: 1.05, demand_kg: 800,  contact: '+919876543001', location: 'Nashik, Maharashtra' },
  { name: 'Pune Fresh Mart',        lat: 18.520, lon: 73.856, base_price_factor: 1.08, demand_kg: 500,  contact: '+919876543002', location: 'Pune, Maharashtra' },
  { name: 'Mumbai Wholesale Hub',   lat: 19.076, lon: 72.877, base_price_factor: 1.12, demand_kg: 2000, contact: '+919876543003', location: 'Mumbai, Maharashtra' },
  { name: 'Nagpur Krishi Bazaar',   lat: 21.146, lon: 79.088, base_price_factor: 1.02, demand_kg: 600,  contact: '+919876543004', location: 'Nagpur, Maharashtra' },
  { name: 'Aurangabad Food Corp',   lat: 19.877, lon: 75.343, base_price_factor: 1.04, demand_kg: 400,  contact: '+919876543005', location: 'Aurangabad, Maharashtra' },
  { name: 'Solapur Mandi Traders',  lat: 17.687, lon: 75.906, base_price_factor: 1.01, demand_kg: 350,  contact: '+919876543006', location: 'Solapur, Maharashtra' },
  { name: 'Kolhapur Agri Exports',  lat: 16.705, lon: 74.243, base_price_factor: 1.06, demand_kg: 700,  contact: '+919876543007', location: 'Kolhapur, Maharashtra' },
  { name: 'Sangli Spice Traders',   lat: 16.852, lon: 74.582, base_price_factor: 1.03, demand_kg: 300,  contact: '+919876543008', location: 'Sangli, Maharashtra' },
  { name: 'Jalgaon Banana Exports', lat: 21.004, lon: 75.563, base_price_factor: 1.07, demand_kg: 900,  contact: '+919876543009', location: 'Jalgaon, Maharashtra' },
  { name: 'Thane Organic Buyers',   lat: 19.218, lon: 72.978, base_price_factor: 1.10, demand_kg: 450,  contact: '+919876543010', location: 'Thane, Maharashtra' },
];

function localMatchBuyers(
  crop: string, quantity_kg: number,
  farmer_lat: number, farmer_lon: number,
  market_price: number, top_n: number
): MatchResult {
  const cropKey = normCrop(crop);
  // Seed deterministic variation per crop
  let seed = cropKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

  const scored = BUYER_POOL.map(b => {
    const dist = haversine(farmer_lat, farmer_lon, b.lat, b.lon);
    const offered = parseFloat((market_price * b.base_price_factor * (0.95 + rand() * 0.1)).toFixed(2));
    const qty_needed = Math.round(b.demand_kg * (0.8 + rand() * 0.4));

    // Score: 40% proximity, 35% price premium, 25% quantity match
    const proxScore  = Math.max(0, 100 - dist * 0.8);
    const priceScore = Math.min(100, ((offered - market_price) / market_price) * 500 + 50);
    const qtyScore   = qty_needed >= quantity_kg ? 100 : (qty_needed / quantity_kg) * 100;
    const score      = parseFloat((0.4 * proxScore + 0.35 * priceScore + 0.25 * qtyScore).toFixed(1));

    return {
      buyer_name: b.name,
      score,
      offered_price: offered,
      distance_km: parseFloat(dist.toFixed(1)),
      quantity_needed_kg: qty_needed,
      location: b.location,
      contact: b.contact,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return { matches: scored.slice(0, top_n), source: 'local' };
}

export const matchBuyers = async (params: {
  crop: string;
  quantity_kg: number;
  farmer_lat: number;
  farmer_lon: number;
  market_price_per_kg: number;
  top_n?: number;
}): Promise<MatchResult> => {
  const top_n = params.top_n ?? 5;
  try {
    const res = await fetch(MATCH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, top_n }),
    });
    if (!res.ok) throw new Error(`Match API ${res.status}`);
    const data = await res.json();
    if (data.detail || data.error) throw new Error('API data unavailable');
    return { matches: data.matches, source: 'api' };
  } catch {
    return localMatchBuyers(
      params.crop, params.quantity_kg,
      params.farmer_lat, params.farmer_lon,
      params.market_price_per_kg, top_n
    );
  }
};
