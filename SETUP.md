# A.R.A.S Setup Guide

Complete setup instructions for the Animal Rescue Alert System.

## 📋 Prerequisites

Before starting, ensure you have:

- Node.js 18 or higher
- npm or yarn package manager
- A Supabase account (free tier works)
- An OpenAI API key with GPT-4o access
- A Kestra instance (cloud or self-hosted)
- A Resend account (free tier works)

## 🔧 Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. **Create a new project** at [supabase.com](https://supabase.com)

2. **Run the database schema**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `schema.sql`
   - Click "Run" to execute the SQL

3. **Get your credentials**:
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key

4. **Create storage bucket manually (if needed)**:
   - Navigate to Storage in Supabase dashboard
   - Create a bucket named `animal-images`
   - Make it public
   - Set policies for public read and authenticated write

### 3. Configure OpenAI

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Ensure you have access to GPT-4o (gpt-4o model)
4. Copy your API key

### 4. Configure Kestra

**Option A: Cloud (Recommended for testing)**
1. Sign up at [kestra.io](https://kestra.io)
2. Create a new workspace
3. Get your API endpoint and API key

**Option B: Self-hosted**
1. Follow Kestra installation guide
2. Start Kestra locally or on a server
3. Note your Kestra URL (e.g., http://localhost:8080)

**Upload Workflow**:
1. Go to Kestra UI
2. Navigate to Flows
3. Create new namespace: `aras.rescue`
4. Upload `kestra/workflow.yml`
5. Add secret for `RESEND_API_KEY` in Kestra settings

### 5. Configure Resend

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain)
3. Create an API key
4. Add this key as a secret in Kestra (not in .env)

### 6. Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in all values in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# OpenAI
OPENAI_API_KEY=sk-your_openai_key_here

# Kestra
KESTRA_URL=https://your-kestra-instance.com
KESTRA_API_KEY=your_kestra_api_key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 7. Seed NGO Data

Run the seed script to populate sample NGOs:

```bash
npm run seed
```

This will add 8 sample NGOs across different cities in India.

### 8. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the homepage.

## 🧪 Testing the System

1. Navigate to `/upload`
2. Allow location access when prompted
3. Upload a test image (any animal photo)
4. Click "Submit Alert"
5. You should be redirected to the alert details page
6. Check Kestra for workflow execution
7. Check email (if NGO email is valid)

## 🚀 Deployment to Vercel

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial A.R.A.S setup"
git push
```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables from `.env.local`
   - Update `NEXT_PUBLIC_SITE_URL` to your Vercel URL
   - Deploy!

3. **Update Kestra**:
   - Update any URLs in your Kestra workflow if needed

## 📝 Customization

### Adding More NGOs

Edit `scripts/seed-ngos.ts` and add more NGO objects:

```typescript
{
  name: 'Your NGO Name',
  email: 'contact@ngo.org',
  latitude: 12.9716,  // Your NGO location
  longitude: 77.5946,
  radius_km: 50  // Service radius in km
}
```

Then run: `npm run seed`

### Modifying AI Prompt

Edit `lib/ai.ts` to change how the AI analyzes images.

### Changing Map Style

Edit `components/MapView.tsx` to use different tile providers (all free):
- OpenStreetMap (current)
- CartoDB
- Stamen

### Customizing Email Template

Edit `kestra/workflow.yml` in the `sendEmail` task's HTML body.

## 🐛 Troubleshooting

### "No NGO found within service radius"
- Ensure you've run the seed script
- Check that your location is within 50km of a seeded NGO
- Or adjust `radius_km` in the database

### Image upload fails
- Check Supabase storage bucket is created
- Verify storage policies are set correctly
- Ensure `animal-images` bucket is public

### AI analysis fails
- Verify OpenAI API key is valid
- Check you have GPT-4o access
- Review API quota limits

### Kestra workflow doesn't trigger
- Verify Kestra URL is accessible
- Check API key is correct
- Ensure workflow is uploaded to `aras.rescue` namespace
- Check workflow ID is `rescue-workflow`

### Email not sent
- Verify Resend API key is added as Kestra secret
- Check email address is valid
- Review Resend dashboard for errors

## 📚 Project Structure

```
/app
  /upload              # Upload page with image and location capture
    page.tsx
    actions.ts
  /alert/[id]          # Alert details with map
    page.tsx
  /api
    /upload-image      # Handles image upload and AI analysis
    /trigger-kestra    # Manual Kestra trigger endpoint

/components
  ImageUploader.tsx    # Image capture component
  LocationCapture.tsx  # GPS location component
  AlertSummary.tsx     # Alert info display
  MapView.tsx          # Leaflet map component

/lib
  ai.ts               # OpenAI Vision integration
  db.ts               # Supabase client
  kestra.ts           # Kestra API calls
  geo.ts              # Distance calculations
  ngos.ts             # NGO data queries

/types
  alert.ts            # Alert TypeScript types
  ngo.ts              # NGO TypeScript types

/scripts
  seed-ngos.ts        # Database seeding script

/kestra
  workflow.yml        # Kestra workflow definition

schema.sql            # Database schema
```

## 🔐 Security Notes

- Never commit `.env.local` to Git
- Keep API keys secure
- Use environment variables for all secrets
- Implement rate limiting in production
- Add authentication if needed
- Validate all user inputs

## 📞 Support

For issues or questions:
- Check the README.md
- Review this setup guide
- Check Supabase, OpenAI, Kestra docs
- Review error logs in browser console and terminal

## ✅ Verification Checklist

- [ ] Dependencies installed
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Storage bucket created
- [ ] OpenAI API key obtained
- [ ] Kestra instance set up
- [ ] Kestra workflow uploaded
- [ ] Resend API key added to Kestra
- [ ] All environment variables configured
- [ ] NGO data seeded
- [ ] Dev server runs without errors
- [ ] Can access homepage at localhost:3000
- [ ] Can access upload page
- [ ] Location capture works
- [ ] Image upload works
- [ ] Alert page displays correctly

Once all items are checked, your A.R.A.S system is ready! 🎉
