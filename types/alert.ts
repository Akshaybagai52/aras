export interface Alert {
  id: string;
  image_url: string;
  animal_type: string;
  injury_location: string;
  severity: number;
  latitude: number;
  longitude: number;
  status: 'pending' | 'notified' | 'in_progress' | 'resolved';
  nearest_ngo_id: string | null;
  kestra_execution_id: string | null;
  created_at?: string;
}

export interface AIAnalysisResult {
  animal_type: string;
  injury_location: string;
  severity: string;
  description: string;
}
