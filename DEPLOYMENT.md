# Supabase + Vercel Deployment Guide

## ✅ Database Setup Complete!

Your Supabase database is now fully configured with:
- ✅ All tables created (10 models)
- ✅ Sample data seeded
- ✅ Indexes and relationships set up

### 🔍 View Your Data

Open Prisma Studio to see your data:
```bash
npm run db:studio
```

Or view in Supabase Dashboard:
https://xfaxtwzxxtbfxbmwgtvs.supabase.co/project/xfaxtwzxxtbfxbmwgtvs/editor

### 📊 Seeded Data

**Users:**
- Email: `admin@aryanproducts.com`
- Password: `admin123`

**Customers:**
- Acme Corporation (C001)
- Tech Solutions Ltd (C002)

**Products:**
- Premium Widget A (P001)
- Standard Component B (P002)
- Industrial Part C (P003)

**Invoices:**
- INV-2024-001 (Paid - LKR 26,550)
- INV-2024-002 (Partial - LKR 20,060, Balance: 10,060)

**Payments:**
- PAY-2024-001 (Bank Transfer - LKR 26,550)
- PAY-2024-002 (UPI - LKR 10,000)

---

## 🚀 Deploy to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit with database setup"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```env
DATABASE_URL=postgresql://postgres.xfaxtwzxxtbfxbmwgtvs:Wasantha%40123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

DIRECT_URL=postgresql://postgres:Wasantha%40123@db.xfaxtwzxxtbfxbmwgtvs.supabase.co:5432/postgres

NEXT_PUBLIC_SUPABASE_URL=https://xfaxtwzxxtbfxbmwgtvs.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_VCShv-gstPxol9fUrjoydw_v-31MhMq

NEXTAUTH_SECRET=generate-a-random-secret-key-here

NEXTAUTH_URL=https://your-app.vercel.app
```

**Important:**
- Add these to **Production**, **Preview**, and **Development** environments
- Generate a secure `NEXTAUTH_SECRET`: [Generate Secret](https://generate-secret.vercel.app/32)
- Update `NEXTAUTH_URL` with your actual Vercel URL after deployment

### Step 4: Deploy

Click **"Deploy"** - Vercel will:
1. Install dependencies
2. Generate Prisma Client
3. Build your Next.js app
4. Deploy to production

---

## 🔧 Local Development

### Run Development Server
```bash
npm run dev
```

### View Database
```bash
npm run db:studio
```

### Update Database Schema
```bash
npm run db:push
```

---

## 📝 Next Steps

### 1. Implement API Routes
Create backend APIs in `app/api/`:
- `/api/customers` - Customer CRUD
- `/api/products` - Product CRUD
- `/api/invoices` - Invoice CRUD
- `/api/payments` - Payment CRUD
- `/api/users` - User management
- `/api/settings` - Settings management

See `API_IMPLEMENTATION.md` for detailed guide.

### 2. Update Frontend Components
Replace mock data with API calls:
- Customer pages
- Product pages
- Invoice pages
- Payment pages
- Dashboard
- Settings

### 3. Add Authentication
Implement NextAuth.js for user login

### 4. Test Production
After Vercel deployment, test all features

---

## 🔐 Security Checklist

Before going live:
- [ ] Change database password
- [ ] Generate new `NEXTAUTH_SECRET`
- [ ] Enable Row Level Security (RLS) in Supabase
- [ ] Set up API rate limiting
- [ ] Review CORS settings
- [ ] Enable SSL connections
- [ ] Set up monitoring

---

## 📚 Resources

- **Supabase Dashboard**: https://xfaxtwzxxtbfxbmwgtvs.supabase.co
- **Prisma Docs**: https://www.prisma.io/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## 🆘 Troubleshooting

### Database Connection Issues

**Error: "Tenant or user not found"**
- Use `DIRECT_URL` for migrations/seeds
- Use `DATABASE_URL` (pooled) for production API calls

**Connection Timeout**
- Check Supabase project is running
- Verify password is URL-encoded (`@` → `%40`)
- Check region matches your Supabase project

### Vercel Build Failures

**Error: "Prisma Client not generated"**
- Ensure `postinstall` script exists in package.json
- Check `DATABASE_URL` and `DIRECT_URL` are set in Vercel

**Error: "Module not found: @prisma/client"**
- Ensure `@prisma/client` is in `dependencies` (not devDependencies)

---

## ✅ Current Status

- ✅ Database schema designed
- ✅ Supabase connected
- ✅ Tables created
- ✅ Sample data seeded
- ✅ Vercel config ready
- ⏳ API routes pending
- ⏳ Frontend integration pending
- ⏳ Authentication pending

**Ready to deploy to Vercel! 🚀**
