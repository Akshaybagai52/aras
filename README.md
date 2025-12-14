# A.R.A.S — Animal Rescue Alert System

A.R.A.S is a full‑stack rescue reporting web app that helps people report injured animals fast. Users upload a photo + location; the app runs AI image analysis, matches the nearest NGO within a service radius, creates an alert, and (optionally) triggers an automated workflow to notify rescuers.

**Live pages**
- Home: `/`
- Report (upload): `/upload`
- Alert details: `/alert/[id]`

**Screenshots (add before submission)**
- <img width="1897" height="766" alt="image" src="https://github.com/user-attachments/assets/055f4404-8217-4704-8682-403bd625bcb3" />

- <img width="1919" height="795" alt="image" src="https://github.com/user-attachments/assets/76de5e32-238f-47ca-ac09-3c13a45fd36c" />

- <img width="1630" height="813" alt="image" src="https://github.com/user-attachments/assets/2504a1ff-3c1e-4772-946c-a130a639bff0" />


## Features

- Image-based reporting (camera/gallery)
- AI analysis (animal type, injury location, severity 1–5, brief description)
- Location capture and nearest-NGO matching (Haversine distance + service radius)
- Alert details view: zoomable image, status progression, map with quick actions
- Optional automation with Kestra (email notifications + scheduled summaries)

## Tech Stack

- **Web**: Next.js 16 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **DB + Storage**: Supabase (Postgres + Storage bucket)
- **Maps**: Leaflet + OpenStreetMap
- **AI**: Perplexity API (OpenAI-compatible chat endpoint w/ vision content)
- **Automation (optional)**: Kestra
- **Email (optional)**: Resend (used from Kestra workflow)

## How it Works (Architecture)

1. User uploads an image and shares location on `/upload`.
2. `POST /api/upload-image`:
   - Uploads the file to Supabase Storage (`animal-images`) and gets a public URL.
   - Sends base64 image to AI (`lib/ai.ts`) and parses a JSON response.
   - Finds the nearest NGO within radius (`lib/geo.ts` + NGO coordinates).
   - Inserts a new row in `alerts`.
   - Triggers a Kestra workflow (optional) to email the assigned NGO.
3. The user is redirected to `/alert/[id]` to track details, map, and progress.

## Getting Started (Local)

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (free tier works)
- A Perplexity API key (for AI image analysis)
- (Optional) Kestra instance (local Docker or cloud)
- (Optional) Resend API key (for email sending via Kestra)

### 1) Install dependencies

```powershell
npm install
```

### 2) Configure environment

Create `.env.local` in the repo root:

```dotenv
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# AI (required for analysis)
PERPLEXITY_API_KEY=

# App URL (required for some server-to-server calls)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Kestra (optional, only if you want workflow triggers)
KESTRA_URL=http://localhost:8080
KESTRA_USERNAME=
KESTRA_PASSWORD=
```

### 3) Supabase database + storage

1. Create a Supabase project.
2. In Supabase SQL editor, run `schema.sql`.
3. Confirm:
   - tables: `ngos`, `alerts`
   - storage bucket: `animal-images`

### 4) Seed sample NGOs

```powershell
npm run seed
```

### 5) Run the dev server

```powershell
npm run dev
```

Open `http://localhost:3000`.

## API

See `API.md` for full details.

Common endpoints:
- `POST /api/upload-image` — uploads image + runs AI + creates alert + triggers workflow
- `POST /api/trigger-kestra` — manually triggers Kestra workflow for an alert
- `GET /api/alerts` — returns alerts (demo endpoint)
- `GET /api/stats` — returns basic stats (demo endpoint)

## Kestra (Optional)

### Run Kestra locally

```powershell
docker compose up -d
```

Kestra UI: `http://localhost:8080`

### Rescue notification workflow

- Flow: `kestra/workflow.yml`
- Namespace: `aras.rescue`
- Flow ID: `rescue-workflow`

In Kestra, set the Resend SMTP password as a secret/value (see `kestra/workflow.yml`).

### Scheduled summary workflow (example)

- Flow: `daily-ai-summary.yml`
- Uses a cron trigger (currently configured for every 5 minutes)
- Uses Perplexity API via HTTP request and emails the result

## Deployment

Recommended: Vercel + Supabase.

1. Deploy to Vercel.
2. Add the same env vars from `.env.local` in Vercel project settings.
3. Update `NEXT_PUBLIC_SITE_URL` to your Vercel URL.
4. Ensure Supabase Storage bucket policies allow reads for the alert images.

## Troubleshooting

- **Build fails with `supabaseUrl is required`**
  - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in the environment used by `next build`.
- **No NGO found within service radius**
  - Run `npm run seed` and ensure your test location is within a seeded NGO’s `radius_km`.
- **AI analysis fails**
  - Check `PERPLEXITY_API_KEY` and Perplexity quotas; the app falls back to a default response if the AI call fails.
- **Kestra trigger fails**
  - Verify `KESTRA_URL`, `KESTRA_USERNAME`, `KESTRA_PASSWORD` and that `rescue-workflow` exists in namespace `aras.rescue`.

## Security Notes

- Do not commit `.env.local`.
- The demo `GET /api/alerts` and `GET /api/stats` endpoints are unauthenticated; for production, add auth + Supabase RLS.
- Use least-privilege keys; never expose Supabase service role keys in the browser.

## License

MIT
