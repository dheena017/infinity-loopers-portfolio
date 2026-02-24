# Enable Automatic Netlify Deployments

Currently, your site deploys only when you run `npm run deploy:netlify` manually.

## Enable Auto-Deploy from GitHub (5 minutes)

### Step 1: Connect GitHub to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: **infinity-loopers-portfolio**
3. Go to **Site Configuration** → **Build & Deploy**
4. Click **Link repository**

### Step 2: Configure Build Settings

Set these values:

- **Repository:** `dheena017/portfolio-`
- **Branch to deploy:** `main`
- **Build command:** `npm run build`
- **Publish directory:** `client/dist`
- **Base directory:** (leave empty)

### Step 3: Add Environment Variables

Go to **Site Configuration** → **Environment Variables** and add:

```
VITE_SUPABASE_URL=https://arniiywzkkizgocnkuqy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFybmlpeXd6a2tpemdvY25rdXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3Mjg2ODYsImV4cCI6MjA4NzMwNDY4Nn0.UOdSHPCMCRB8SdZ3dfEvxx9kPlwekUFaZiD8_50Xs3s
```

### Step 4: Test Auto-Deploy

```bash
# Commit your changes
git add .
git commit -m "Enable Supabase integration"
git push origin main
```

✨ Netlify will automatically:
1. Detect the push
2. Run the build
3. Deploy to production
4. Update your site in ~2 minutes

---

## Current Workflow (Manual)

If you prefer manual control:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Then manually deploy
npm run deploy:netlify
```

---

## Which Should You Choose?

### ✅ Auto-Deploy (Recommended)
- **Pros:** Push → auto-updates website
- **Cons:** Every push goes live immediately

### Manual Deploy
- **Pros:** Full control, test before deploy
- **Cons:** Extra step each time

---

## Quick Commands

### Push changes to GitHub only (no deploy):
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### Deploy to website (after enabling auto-deploy):
```bash
# Just push - Netlify handles the rest!
git push origin main
```

### Deploy to website (manual method):
```bash
npm run deploy:netlify
```
