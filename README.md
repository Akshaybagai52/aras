# A.R.A.S — Animal Rescue Alert System 🐾

A Next.js + AI + Kestra workflow system that detects injured animals from uploaded photos, identifies injury severity, uses GPS location, and automatically notifies the nearest NGO.

## Features

- 📸 Image upload with AI-powered animal injury detection (OpenAI Vision API)
- 📍 GPS location capture to find nearest rescue NGO
- 🗺️ Interactive map visualization using Leaflet
- 🔔 Automated workflow execution via Kestra
- 📧 Email notifications to NGOs via Resend
- 💾 PostgreSQL database via Supabase

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React Server Components, Tailwind CSS, Shadcn UI
- **Backend**: Next.js Server Actions & API Routes, Axios
- **AI**: OpenAI Vision API (GPT-4o)
- **Database**: Supabase (PostgreSQL + Storage)
- **Workflow**: Kestra
- **Email**: Resend
- **Maps**: Leaflet.js (OpenStreetMap)
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier)
- OpenAI API key
- Kestra instance (self-hosted or cloud)
- Resend account (free tier)

## Database Setup

1. Create a new Supabase project
2. Run the following SQL to create tables:

```sql
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
```

3. Seed NGO data:

```bash
npm install tsx
npx tsx scripts/seed-ngos.ts
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

4. Configure Kestra workflow:
   - Upload `kestra/workflow.yml` to your Kestra instance
   - Set the `RESEND_API_KEY` as a Kestra secret

## Development

```bash
npm run dev
```

Open [http://localhost:3000/upload](http://localhost:3000/upload) to start reporting animal rescues.

## Project Structure

```
/app
  /upload          # Main upload page
  /alert/[id]      # Alert details page
  /api             # API routes for image upload and Kestra trigger

/components        # React components (ImageUploader, MapView, etc.)
/lib               # Utility functions (AI, geo, database)
/types             # TypeScript type definitions
/scripts           # Database seeding scripts
/kestra            # Kestra workflow definition
```

## Usage

1. Navigate to `/upload`
2. Allow location access
3. Take or upload a photo of an injured animal
4. Submit the alert
5. AI analyzes the image and determines injury details
6. System finds the nearest NGO
7. Kestra workflow sends email notification to NGO
8. View alert details with map on `/alert/[id]`

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

Make sure to add all environment variables in Vercel project settings.

## License

MIT
