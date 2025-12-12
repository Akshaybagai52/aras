# Database Schema SQL for Supabase

-- Create NGOs table
CREATE TABLE ngos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  latitude FLOAT8 NOT NULL,
  longitude FLOAT8 NOT NULL,
  radius_km INT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Create alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  animal_type TEXT NOT NULL,
  injury_location TEXT NOT NULL,
  severity INT NOT NULL CHECK (severity >= 1 AND severity <= 5),
  latitude FLOAT8 NOT NULL,
  longitude FLOAT8 NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','notified','in_progress','resolved')),
  nearest_ngo_id UUID REFERENCES ngos(id),
  kestra_execution_id TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('animal-images', 'animal-images', true);

-- Set storage policy (allow public read, authenticated write)
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'animal-images');
CREATE POLICY "Authenticated write access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'animal-images');

-- Create indexes for better query performance
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_ngo_id ON alerts(nearest_ngo_id);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_ngos_location ON ngos(latitude, longitude);
