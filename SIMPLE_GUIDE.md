# 🎯 Simple Guide: Which Files Go Where

## Frontend → Vercel

### What to Deploy:
```
frontend/  ← This entire folder
```

### Key Files:
- `frontend/vercel.json` - Vercel configuration
- `frontend/.env.vercel.example` - Environment variables template
- `frontend/package.json` - Dependencies
- `frontend/src/` - Your Next.js code

### How to Deploy:
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Set **Root Directory** to: `frontend`
5. Add environment variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-gateway.railway.app` (get this from Railway)
6. Click "Deploy"

---

## Backend → Railway

### What to Deploy:
```
services/           ← All 5 microservices
shared/             ← Common library
migrations/         ← Database setup
Dockerfile.backend  ← Build instructions
Cargo.toml         ← Rust configuration
```

### Key Files:
- `Dockerfile.backend` - Tells Railway how to build
- `Cargo.toml` - Rust workspace configuration
- `.env.railway.example` - Environment variables reference
- `services/auth-service/` - Auth microservice
- `services/gateway-service/` - API Gateway
- `services/metadata-service/` - Metadata microservice
- `services/storage-node/` - Storage microservice
- `services/sync-service/` - Sync microservice

### How to Deploy:
1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL database
4. Add Redis database
5. Deploy each service (5 times):
   - Click "+ New" → "GitHub Repo"
   - Set **Build Args**: `SERVICE=auth-service` (change for each)
   - Add environment variables (see `.env.railway.example`)
   - Deploy
6. Enable public domain on **gateway-service only**

---

## Quick Visual

```
YOUR PROJECT
│
├── frontend/              → Deploy to VERCEL
│   ├── src/              (Next.js app)
│   ├── vercel.json       (config)
│   └── package.json      (dependencies)
│
├── services/              → Deploy to RAILWAY
│   ├── auth-service/     (microservice 1)
│   ├── gateway-service/  (microservice 2)
│   ├── metadata-service/ (microservice 3)
│   ├── storage-node/     (microservice 4)
│   └── sync-service/     (microservice 5)
│
├── Dockerfile.backend     → Used by RAILWAY
├── Cargo.toml            → Used by RAILWAY
│
└── Documentation/         → Read before deploying
    ├── DEPLOYMENT_GUIDE.md
    ├── QUICK_DEPLOY.md
    └── RAILWAY_SETUP.md
```

---

## Environment Variables

### Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://gateway-service.railway.app
```

### Backend (Railway):
Each service needs different variables. See `.env.railway.example` for complete list.

**Example for auth-service:**
```
PORT=8081
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=your-secret-key-here
```

---

## Deployment Order

1. ✅ Deploy Backend to Railway (30 min)
   - Create databases
   - Deploy 5 services
   - Get gateway URL

2. ✅ Deploy Frontend to Vercel (10 min)
   - Use gateway URL from step 1
   - Deploy frontend

3. ✅ Test (10 min)
   - Visit Vercel URL
   - Try registering/login
   - Test file upload

---

## Need More Details?

- **Quick Start**: Read `QUICK_DEPLOY.md`
- **Complete Guide**: Read `DEPLOYMENT_GUIDE.md`
- **Railway Details**: Read `RAILWAY_SETUP.md`
- **File Details**: Read `FILES_GUIDE.md`

---

## Summary

**Frontend:**
- Folder: `frontend/`
- Platform: Vercel
- Time: 10 minutes

**Backend:**
- Folders: `services/`, `shared/`, `migrations/`
- Files: `Dockerfile.backend`, `Cargo.toml`
- Platform: Railway
- Time: 30 minutes

**Total Time:** ~40 minutes

---

That's it! 🚀
