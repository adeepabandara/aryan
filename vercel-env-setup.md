# Vercel Environment Variables Setup

## Option 1: Using Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/dashboard
2. Select your project: **aryan**
3. Navigate to: **Settings** → **Environment Variables**
4. Add each variable below:

### Required Environment Variables:

**DATABASE_URL** (Production, Preview, Development)
```
postgresql://postgres.xfaxtwzxxtbfxbmwgtvs:Wasantha%40123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**DIRECT_URL** (Production, Preview, Development)
```
postgresql://postgres:Wasantha%40123@db.xfaxtwzxxtbfxbmwgtvs.supabase.co:5432/postgres
```

**NEXTAUTH_SECRET** (Production, Preview, Development)
```
YV/+wZxjjmUI3VUhugbmGLXM8cK561D2zwt1UX3aZWA=
```

**NEXTAUTH_URL** (Production only)
```
https://your-actual-vercel-url.vercel.app
```
Note: Replace with your actual Vercel deployment URL after first deployment

**NEXT_PUBLIC_SUPABASE_URL** (Production, Preview, Development)
```
https://xfaxtwzxxtbfxbmwgtvs.supabase.co
```

**NEXT_PUBLIC_SUPABASE_ANON_KEY** (Production, Preview, Development)
```
sb_publishable_VCShv-gstPxol9fUrjoydw_v-31MhMq
```

---

## Option 2: Using Vercel CLI

Install Vercel CLI (if not already installed):
```bash
npm i -g vercel
```

Login to Vercel:
```bash
vercel login
```

Link your project:
```bash
vercel link
```

Add environment variables:
```bash
vercel env add DATABASE_URL production
# Paste: postgresql://postgres.xfaxtwzxxtbfxbmwgtvs:Wasantha%40123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

vercel env add DIRECT_URL production
# Paste: postgresql://postgres:Wasantha%40123@db.xfaxtwzxxtbfxbmwgtvs.supabase.co:5432/postgres

vercel env add NEXTAUTH_SECRET production
# Paste: YV/+wZxjjmUI3VUhugbmGLXM8cK561D2zwt1UX3aZWA=

vercel env add NEXTAUTH_URL production
# Paste: https://your-vercel-url.vercel.app

vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste: https://xfaxtwzxxtbfxbmwgtvs.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste: sb_publishable_VCShv-gstPxol9fUrjoydw_v-31MhMq
```

---

## After Adding Environment Variables:

1. **Redeploy** your project from Vercel dashboard or run:
   ```bash
   vercel --prod
   ```

2. **Update NEXTAUTH_URL** with your actual Vercel URL after first successful deployment

3. **Run Database Migration** (if needed):
   - Vercel will run `prisma generate` automatically
   - Your database already has the schema, so no migration needed

---

## Troubleshooting:

### If build still fails:
- Verify all environment variables are added
- Check for typos in variable names
- Ensure values don't have extra spaces
- Make sure variables are enabled for "Production" environment

### If authentication fails:
- Update NEXTAUTH_URL to match your production domain
- Redeploy after updating NEXTAUTH_URL

### If database connection fails:
- Verify Supabase credentials are correct
- Check if Supabase project is still active
- Ensure connection string includes `?pgbouncer=true`

---

## Quick Verification:

After deployment, test these URLs:
- https://your-app.vercel.app/login (should show login page)
- https://your-app.vercel.app/api/auth/session (should return JSON)
- Login with: admin@aryanproducts.com / admin123

