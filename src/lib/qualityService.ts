import api from './api';

export interface QualityInput {
  crop: string;
  image_url?: string;
  market?: string;
  harvest_days_ago?: number;
  storage_condition?: 'normal' | 'cold' | 'poor';
  transport_time_hours?: number;
}

export interface QualityResult {
  quality_grade: 'A' | 'B' | 'C';
  confidence: number;
  freshness_score: number;
  defect_percentage: number;
  estimated_shelf_life_days: number;
  recommendation: string;
  disease_label?: string;
  urgency_level?: string;
  source?: string;
}

export async function analyzeCropQuality(input: QualityInput): Promise<QualityResult> {
  const { data } = await api.post('/ai/crop-quality', input);
  return data as QualityResult;
}
