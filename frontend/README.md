# 🎨 Frontend - Vercel Deployment

**Complete frontend package for Vercel deployment**

---

## 📦 What's Inside

```
frontend/
├── src/                   ← Next.js application
│   ├── app/              (Pages & layouts)
│   ├── components/       (React components)
│   └── lib/              (Utilities)
├── public/               ← Static assets
├── vercel.json          ← Vercel configuration
├── package.json         ← Dependencies
├── next.config.ts       ← Next.js config
└── .env.example         ← Environment variables template
```

---

## 🚀 Deploy to Vercel

### Quick Deploy (3 Steps)

#### 1. Install Vercel CLI (Optional)
```bash
npm install -g vercel
vercel login
```

#### 2. Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

#### 3. Add Environment Variable

In Vercel Dashboard → Settings → Environment Variables:

```
Name: NEXT_PUBLIC_API_URL
Value: https://your-gateway-service.railway.app
```

**Important:** Replace with your actual Railway gateway URL!

Then click "Deploy" 🚀

---

## ⚙️ Environment Variables

### Required

```bash
NEXT_PUBLIC_API_URL=https://gateway-service.railway.app
```

This is your Railway backend gateway URL. Get it from:
1. Railway Dashboard
2. gateway-service
3. Settings → Networking → Public Domain

### Optional

```bash
# Analytics (if using)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

**Full details in `.env.example`**

---

## 🛠️ Local Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

### Build for Production
```bash
npm run build
npm start
```

---

## 📋 Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] Gateway service has public URL
- [ ] Copy gateway URL
- [ ] Go to Vercel dashboard
- [ ] Import GitHub repository
- [ ] Set root directory: `frontend`
- [ ] Add `NEXT_PUBLIC_API_URL` environment variable
- [ ] Deploy
- [ ] Test the live site

---

## 🔧 Configuration Files

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

Tells Vercel how to build your app.

### .env.example
```
NEXT_PUBLIC_API_URL=https://your-gateway.railway.app
```

Template for environment variables. Copy and customize.

### next.config.ts
```typescript
const nextConfig = {
  // Next.js configuration
};
```

Next.js framework configuration.

---

## 🌐 After Deployment

### Your App URLs

- **Production**: `https://your-app.vercel.app`
- **Preview**: Auto-generated for each PR
- **Development**: `http://localhost:3000`

### Update CORS on Backend

After deploying, update your Railway gateway-service:

Add environment variable:
```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

This allows your frontend to communicate with the backend.

---

## 🧪 Testing

### Test Locally
```bash
npm run dev
# Visit http://localhost:3000
```

### Test Production
1. Visit your Vercel URL
2. Try to register a new account
3. Login with credentials
4. Upload a file
5. Download the file
6. Check browser console for errors

---

## 📊 Features

- ✅ User authentication (register/login)
- ✅ File upload/download
- ✅ Dashboard with analytics
- ✅ File management
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Dark mode UI

---

## 🎨 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion

---

## 🔍 Project Structure

```
src/
├── app/                    ← Next.js App Router
│   ├── page.tsx           (Home page)
│   ├── layout.tsx         (Root layout)
│   ├── login/             (Login page)
│   ├── register/          (Register page)
│   └── dashboard/         (Dashboard pages)
│       ├── page.tsx       (Main dashboard)
│       ├── analytics/     (Analytics page)
│       ├── security/      (Security page)
│       └── settings/      (Settings page)
│
├── components/             ← React components
│   └── ui/                (UI components)
│
└── lib/                    ← Utilities
    └── utils.ts           (Helper functions)
```

---

## 🆘 Troubleshooting

### Build Fails
→ Check `package.json` dependencies  
→ Run `npm install` locally  
→ Check Vercel build logs

### API Calls Fail
→ Verify `NEXT_PUBLIC_API_URL` is set correctly  
→ Check CORS on backend  
→ Check browser console for errors

### Environment Variable Not Working
→ Must start with `NEXT_PUBLIC_` for client-side  
→ Redeploy after adding variables  
→ Check Vercel dashboard → Settings → Environment Variables

### CORS Errors
→ Add your Vercel domain to backend `ALLOWED_ORIGINS`  
→ Redeploy backend gateway-service  
→ Clear browser cache

---

## 💡 Pro Tips

1. **Use Preview Deployments** - Test changes before production
2. **Enable Analytics** - Track performance with Vercel Analytics
3. **Set up Custom Domain** - Professional look
4. **Use Environment Variables** - Never hardcode URLs
5. **Check Build Logs** - Catch issues early

---

## 📚 Documentation

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Deployment Guide**: `../DEPLOYMENT_GUIDE.md`
- **Quick Start**: `../QUICK_DEPLOY.md`

---

## ✅ Success Criteria

Your frontend is deployed when:

- ✅ Vercel build succeeds
- ✅ Site loads on Vercel URL
- ✅ Can register new user
- ✅ Can login
- ✅ Can upload files
- ✅ Can download files
- ✅ No console errors
- ✅ API calls work

---

## 🎉 Next Steps

After deployment:

1. Test all features
2. Set up custom domain (optional)
3. Enable Vercel Analytics
4. Monitor performance
5. Share with users!

---

**Ready to deploy?** Follow the steps above or read `../DEPLOYMENT_GUIDE.md` for detailed instructions.
