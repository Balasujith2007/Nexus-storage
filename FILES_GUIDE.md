# 📁 Frontend vs Backend Files Guide

## 🎨 FRONTEND FILES (Vercel Deployment)

### Frontend Code
```
frontend/
├── src/                          ← All React/Next.js code
├── public/                       ← Static assets
├── package.json                  ← Dependencies
├── package-lock.json            ← Lock file
├── next.config.ts               ← Next.js config
├── tsconfig.json                ← TypeScript config
├── tailwind.config.ts           ← Tailwind CSS config
├── postcss.config.mjs           ← PostCSS config
└── eslint.config.mjs            ← ESLint config
```

### Frontend Deployment Files
```
frontend/
├── vercel.json                   ← Vercel deployment config ⭐
└── .env.vercel.example          ← Environment variables template ⭐
```

### Frontend Documentation
```
DEPLOYMENT_GUIDE.md              ← Part 2: Vercel Frontend Deployment
QUICK_DEPLOY.md                  ← Section: Vercel Frontend
deploy-vercel.sh                 ← Vercel deployment script ⭐
```

---

## 🦀 BACKEND FILES (Railway Deployment)

### Backend Code
```
services/
├── auth-service/                ← Auth microservice
│   ├── src/
│   └── Cargo.toml
├── gateway-service/             ← API Gateway
│   ├── src/
│   └── Cargo.toml
├── metadata-service/            ← Metadata microservice
│   ├── src/
│   └── Cargo.toml
├── storage-node/                ← Storage microservice
│   ├── src/
│   └── Cargo.toml
└── sync-service/                ← Sync microservice
    ├── src/
    └── Cargo.toml

shared/
└── common-lib/                  ← Shared Rust library
    ├── src/
    └── Cargo.toml

migrations/                      ← Database migrations
└── 20240101000000_initial_schema.sql

Cargo.toml                       ← Workspace config
```

### Backend Deployment Files
```
Dockerfile.backend               ← Docker build file ⭐
railway.json                     ← Railway project config ⭐
railway.toml                     ← Railway settings ⭐
.env.railway.example            ← Environment variables template ⭐

.railway/                        ← Service-specific configs ⭐
├── auth-service.json
├── gateway-service.json
├── metadata-service.json
├── storage-node.json
└── sync-service.json
```

### Backend Documentation
```
DEPLOYMENT_GUIDE.md              ← Part 1: Railway Backend Deployment
RAILWAY_SETUP.md                 ← Railway-specific guide ⭐
QUICK_DEPLOY.md                  ← Section: Railway Backend
deploy-railway.sh                ← Railway deployment script ⭐
```

---

## 📋 DEPLOYMENT CHECKLIST

### For FRONTEND (Vercel):

**Files You Need:**
1. ✅ `frontend/` folder (entire directory)
2. ✅ `frontend/vercel.json` (deployment config)
3. ✅ `frontend/.env.vercel.example` (copy to create .env)

**Steps:**
1. Go to https://vercel.com
2. Import GitHub repository
3. Set root directory: `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy!

**Documentation to Read:**
- `DEPLOYMENT_GUIDE.md` (Part 2)
- `QUICK_DEPLOY.md` (Vercel section)

---

### For BACKEND (Railway):

**Files You Need:**
1. ✅ `services/` folder (all 5 microservices)
2. ✅ `shared/` folder (common library)
3. ✅ `migrations/` folder (database migrations)
4. ✅ `Dockerfile.backend` (build instructions)
5. ✅ `Cargo.toml` (workspace config)
6. ✅ `.env.railway.example` (environment variables reference)
7. ✅ `railway.json` or `railway.toml` (optional, for reference)

**Steps:**
1. Go to https://railway.app
2. Create project
3. Add PostgreSQL + Redis
4. Deploy each service (5 times):
   - auth-service
   - metadata-service
   - storage-node
   - sync-service
   - gateway-service
5. Configure environment variables for each

**Documentation to Read:**
- `RAILWAY_SETUP.md` (detailed Railway guide)
- `DEPLOYMENT_GUIDE.md` (Part 1)
- `QUICK_DEPLOY.md` (Railway section)

---

## 🗂️ FILE STRUCTURE OVERVIEW

```
Nexus-storage/
│
├── 🎨 FRONTEND (Deploy to Vercel)
│   └── frontend/
│       ├── src/                    ← React/Next.js code
│       ├── public/                 ← Static files
│       ├── package.json            ← Dependencies
│       ├── vercel.json            ← Vercel config ⭐
│       └── .env.vercel.example    ← Env vars ⭐
│
├── 🦀 BACKEND (Deploy to Railway)
│   ├── services/                   ← 5 microservices
│   │   ├── auth-service/
│   │   ├── gateway-service/
│   │   ├── metadata-service/
│   │   ├── storage-node/
│   │   └── sync-service/
│   ├── shared/                     ← Common library
│   ├── migrations/                 ← Database migrations
│   ├── Dockerfile.backend         ← Docker build ⭐
│   ├── Cargo.toml                 ← Workspace config
│   ├── railway.json               ← Railway config ⭐
│   ├── .railway/                  ← Service configs ⭐
│   └── .env.railway.example       ← Env vars ⭐
│
└── 📚 DOCUMENTATION (Read these)
    ├── README_DEPLOYMENT.md        ← Start here
    ├── DEPLOYMENT_COMPLETE.md      ← Success guide
    ├── DEPLOYMENT_GUIDE.md         ← Complete guide
    ├── QUICK_DEPLOY.md             ← Quick reference
    ├── RAILWAY_SETUP.md            ← Railway details
    ├── DEPLOYMENT_CHECKLIST.md     ← Progress tracker
    ├── deploy-railway.sh           ← Railway script
    └── deploy-vercel.sh            ← Vercel script
```

---

## 🎯 QUICK REFERENCE

### What to Deploy Where:

| What | Where | Key Files |
|------|-------|-----------|
| **Frontend** | Vercel | `frontend/` folder + `vercel.json` |
| **Backend** | Railway | `services/`, `Dockerfile.backend`, `Cargo.toml` |
| **Database** | Railway | `migrations/` folder |
| **Config** | Both | `.env.railway.example`, `.env.vercel.example` |

---

## 📦 DEPLOYMENT PACKAGES

### Package 1: Frontend to Vercel
```
frontend/
├── src/                    ← Your Next.js app
├── public/                 ← Static assets
├── package.json            ← Dependencies
├── vercel.json            ← Deployment config
└── .env.vercel.example    ← Environment template

Required Environment Variable:
- NEXT_PUBLIC_API_URL=https://your-gateway.railway.app
```

### Package 2: Backend to Railway
```
Root directory (Nexus-storage/)
├── services/              ← 5 microservices
├── shared/                ← Common code
├── migrations/            ← Database setup
├── Dockerfile.backend     ← Build instructions
├── Cargo.toml            ← Rust workspace
└── .env.railway.example  ← Environment template

Required for Each Service:
- Build Arg: SERVICE=service-name
- Environment variables (see .env.railway.example)
```

---

## 🔧 CONFIGURATION FILES EXPLAINED

### Frontend Configuration

**vercel.json**
```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```
- Tells Vercel how to build your app
- Auto-detected, but included for customization

**frontend/.env.vercel.example**
```
NEXT_PUBLIC_API_URL=https://gateway-service.railway.app
```
- Template for environment variables
- Copy and customize for your deployment

### Backend Configuration

**Dockerfile.backend**
- Builds each Rust microservice
- Uses multi-stage build for optimization
- Accepts SERVICE build argument

**railway.json / railway.toml**
- Railway project configuration
- Optional (Railway auto-detects)
- Included for customization

**.railway/*.json**
- Individual service configurations
- Reference for manual setup
- Shows recommended settings

**.env.railway.example**
- All backend environment variables
- Copy values to Railway dashboard
- One template for all services

---

## 📝 ENVIRONMENT VARIABLES

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-gateway.railway.app
```
**Where to set:** Vercel Dashboard → Settings → Environment Variables

### Backend (Railway)

**Auth Service:**
```
PORT=8081
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=your-secret-key
```

**Metadata Service:**
```
PORT=8082
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
```

**Storage Node:**
```
PORT=8083
STORAGE_DIR=/data
```

**Sync Service:**
```
PORT=8084
REDIS_URL=${{Redis.REDIS_URL}}
```

**Gateway Service:**
```
PORT=8080
AUTH_SERVICE_URL=http://auth-service.railway.internal:8081
METADATA_SERVICE_URL=http://metadata-service.railway.internal:8082
STORAGE_SERVICE_URL=http://storage-node.railway.internal:8083
```

**Where to set:** Railway Dashboard → Service → Variables

---

## ✅ DEPLOYMENT CHECKLIST

### Frontend Deployment
- [ ] Have `frontend/` folder
- [ ] Have `vercel.json` configured
- [ ] Know your Railway gateway URL
- [ ] Vercel account ready
- [ ] Deploy to Vercel
- [ ] Set `NEXT_PUBLIC_API_URL`

### Backend Deployment
- [ ] Have all `services/` folders
- [ ] Have `Dockerfile.backend`
- [ ] Have `Cargo.toml`
- [ ] Have `migrations/` folder
- [ ] Railway account ready
- [ ] Create PostgreSQL database
- [ ] Create Redis database
- [ ] Run migrations
- [ ] Deploy 5 services
- [ ] Configure environment variables

---

## 🚀 QUICK START

### Deploy Frontend (10 minutes)
```bash
cd frontend
vercel --prod
# Set NEXT_PUBLIC_API_URL when prompted
```

### Deploy Backend (30 minutes)
```bash
# Use Railway Dashboard
# Follow RAILWAY_SETUP.md
# Or use deploy-railway.sh script
```

---

## 📖 RECOMMENDED READING ORDER

1. **FILES_GUIDE.md** (this file) - Understand file structure
2. **DEPLOYMENT_COMPLETE.md** - Get overview
3. **QUICK_DEPLOY.md** - See deployment steps
4. **RAILWAY_SETUP.md** - Backend details
5. **DEPLOYMENT_GUIDE.md** - Complete walkthrough

---

## 🆘 NEED HELP?

**Can't find a file?**
- Use this guide to locate it
- Check DEPLOYMENT_INDEX.md

**Don't know what a file does?**
- See explanations above
- Read file comments

**Ready to deploy?**
- Frontend: Read DEPLOYMENT_GUIDE.md Part 2
- Backend: Read RAILWAY_SETUP.md

---

**Summary:**
- **Frontend = `frontend/` folder** → Deploy to Vercel
- **Backend = `services/` + `Dockerfile.backend` + `Cargo.toml`** → Deploy to Railway
- **Documentation = All `.md` files** → Read before deploying
