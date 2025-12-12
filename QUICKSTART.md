# 🚀 Quick Start Guide - A.R.A.S

Get your Animal Rescue Alert System up and running in minutes!

## ⚡ Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn
- ✅ Git (optional, for version control)

## 📦 Step 1: Install Dependencies

```bash
npm install
```

## 🔑 Step 2: Get API Keys

### Supabase (Database & Storage)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project (free tier)
3. Wait for project to be ready (~2 minutes)
4. Go to **Project Settings → API**
5. Copy:
   - Project URL
   - `anon` public key

### OpenAI (AI Vision)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to **API Keys**
3. Click **Create new secret key**
4. Copy the key (starts with `sk-...`)

### Kestra (Workflow Engine)
**Quick Option - Cloud:**
1. Sign up at [kestra.io](https://kestra.io)
2. Create workspace
3. Get API URL and key from settings

**Alternative - Local Docker:**
```bash
docker run -p 8080:8080 kestra/kestra:latest
```
Then use `http://localhost:8080`

### Resend (Email)
1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys**
3. Create new key
4. Copy the key

## 🔧 Step 3: Configure Environment

1. Copy the example file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
OPENAI_API_KEY=sk-...
KESTRA_URL=https://your-kestra-instance.com
KESTRA_API_KEY=your_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🗄️ Step 4: Setup Database

1. Open Supabase dashboard
2. Click **SQL Editor**
3. Copy all content from `schema.sql`
4. Paste and click **Run**

**Verify:**
- Tables created: `ngos`, `alerts`
- Storage bucket: `animal-images`

## 🌱 Step 5: Seed Sample Data

```bash
npm run seed
```

This adds 8 sample NGOs across different locations.

## 🔄 Step 6: Configure Kestra Workflow

1. Open Kestra UI (your Kestra URL)
2. Go to **Flows**
3. Click **Create Flow**
4. Set namespace: `aras.rescue`
5. Copy content from `kestra/workflow.yml`
6. Paste and save
7. Go to **Secrets** and add `RESEND_API_KEY`

## ▶️ Step 7: Start the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ Step 8: Test It!

1. Navigate to `/upload`
2. Allow location access
3. Upload any animal photo
4. Click **Submit Alert**
5. Check the alert details page
6. Verify email sent (if NGO email is valid)

---

## 🎯 Quick Test Checklist

After setup, verify:

- [ ] Homepage loads at `localhost:3000`
- [ ] Upload page shows at `/upload`
- [ ] Location capture works
- [ ] Can select an image
- [ ] Submit button is enabled
- [ ] Alert details page loads
- [ ] Map displays correctly

---

## ❗ Common Issues

### "Supabase connection error"
- Verify SUPABASE_URL and SUPABASE_ANON_KEY
- Check if project is active in Supabase dashboard

### "No NGO found"
- Run seed script: `npm run seed`
- Check your location is within 50km of seeded NGOs
- Verify NGOs table has data in Supabase

### "OpenAI API error"
- Verify API key is correct
- Check you have credits/access to GPT-4o
- Try a different image

### "Kestra workflow failed"
- Check Kestra URL is accessible
- Verify workflow is uploaded
- Ensure Resend key is added as secret

### "Image upload fails"
- Verify storage bucket exists
- Check storage policies are set
- Ensure bucket name is `animal-images`

---

## 🌐 Deployment (Optional)

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Update after deployment
1. Get your Vercel URL
2. Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars
3. Redeploy

---

## 📚 Next Steps

Once running:

1. **Customize NGOs**: Edit `scripts/seed-ngos.ts` with real NGO data
2. **Test thoroughly**: Try different images and locations
3. **Review docs**: Check `SETUP.md` for detailed info
4. **API docs**: Read `API.md` for integration details

---

## 🆘 Need Help?

1. Check `SETUP.md` for detailed instructions
2. Review `API.md` for API documentation
3. Read `PROJECT_SUMMARY.md` for overview
4. Check service provider docs:
   - Supabase: supabase.com/docs
   - OpenAI: platform.openai.com/docs
   - Kestra: kestra.io/docs
   - Resend: resend.com/docs

---

## 🎉 You're All Set!

Your A.R.A.S system is now ready to help save animals! 🐾

**Test URL:** http://localhost:3000/upload

Start reporting and rescuing! 🚑🐕🐈
