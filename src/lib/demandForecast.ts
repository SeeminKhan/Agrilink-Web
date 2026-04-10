/**
 * Client-side Holt-Winters demand forecasting engine.
 * Mirrors the server model logic so it works even when the
 * /forecast endpoint is unavailable (missing CSV on Render).
 *
 * Uses additive Holt-Winters with weekly seasonality (period = 7).
 */

export interface ForecastDay {
  date: string;
  day: string;
  demand_estimate: number;
  unit: string;
}

export interface ForecastResult {
  crop: string;
  trend: 'Rising' | 'Falling' | 'Stable';
  forecast: ForecastDay[];
  source: 'api' | 'local';
}

// ── Maharashtra crop base demand (quintals/day at peak season) ────────────────
const CROP_BASE: Record<string, number> = {
  tomato: 120, onion: 180, potato: 95, wheat: 210, rice: 160,
  soybean: 85, sugarcane: 300, cotton: 70, maize: 110, mango: 65,
  banana: 90, grape: 55, pomegranate: 45, orange: 60, turmeric: 40,
  ginger: 35, garlic: 75, cabbage: 50, cauliflower: 48, brinjal: 42,
  default: 80,
};

// Weekly seasonality index (Mon–Sun) — higher on market days
const WEEKLY_SEASONAL = [0.85, 1.10, 1.05, 1.15, 1.20, 0.90, 0.75];

// Holt-Winters additive smoothing
function holtwinters(series: number[], steps: number, alpha = 0.4, beta = 0.2, gamma = 0.3, period = 7) {
  const n = series.length;
  // Initialise level, trend, seasonal
  let level = series.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let trend = (series.slice(period, 2 * period).reduce((a, b) => a + b, 0) / period - level) / period;
  const seasonal = series.slice(0, period).map(v => v / level);

  const smoothed: number[] = [];
  for (let i = 0; i < n; i++) {
    const s = seasonal[i % period];
    const prevLevel = level;
    level = alpha * (series[i] / s) + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    seasonal[i % period] = gamma * (series[i] / level) + (1 - gamma) * s;
    smoothed.push(level * s);
  }

  const forecast: number[] = [];
  for (let h = 1; h <= steps; h++) {
    const s = seasonal[(n + h - 1) % period];
    forecast.push(Math.max(5, (level + h * trend) * s));
  }
  return forecast;
}

// Generate synthetic historical series (52 weeks) for a crop
function generateHistory(cropKey: string): number[] {
  const base = CROP_BASE[cropKey] || CROP_BASE.default;
  const series: number[] = [];
  // Seed with crop name for deterministic output
  let seed = cropKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

  for (let week = 0; week < 8; week++) {
    for (let day = 0; day < 7; day++) {
      const seasonal = WEEKLY_SEASONAL[day];
      const noise = 0.85 + rand() * 0.3;
      const weekTrend = 1 + (week - 4) * 0.02;
      series.push(base * seasonal * noise * weekTrend);
    }
  }
  return series;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function localForecast(cropRaw: string, steps: number): ForecastResult {
  const cropKey = cropRaw.toLowerCase().replace(/\s+/g, '_').replace(/s$/, '');
  const history = generateHistory(cropKey);
  const values  = holtwinters(history, steps);

  const today = new Date();
  const forecast: ForecastDay[] = values.map((v, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return {
      date: d.toISOString().split('T')[0],
      day: DAYS[d.getDay()],
      demand_estimate: parseFloat(v.toFixed(1)),
      unit: 'Quintals',
    };
  });

  // Determine trend from first vs last value
  const first = forecast[0].demand_estimate;
  const last  = forecast[forecast.length - 1].demand_estimate;
  const diff  = ((last - first) / first) * 100;
  const trend: ForecastResult['trend'] = diff > 5 ? 'Rising' : diff < -5 ? 'Falling' : 'Stable';

  return { crop: cropRaw, trend, forecast, source: 'local' };
}
