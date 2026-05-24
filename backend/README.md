# 🦀 Backend - Railway Deployment

**Complete backend package for Railway deployment**

---

## 📦 What's Inside

```
backend/
├── services/              ← 5 Rust microservices
│   ├── auth-service/
│   ├── gateway-service/
│   ├── metadata-service/
│   ├── storage-node/
│   └── sync-service/
├── shared/                ← Common library
├── migrations/            ← Database migrations
├── .railway/              ← Service configurations
├── Dockerfile            ← Build instructions
├── Cargo.toml            ← Workspace config
├── railway.json          ← Railway config
├── railway.toml          ← Railway settings
└── .env.example          ← Environment variables template
```

---

## 🚀 Deploy to Railway

### Quick Deploy (3 Steps)

#### 1. Create Railway Project
```bash
# Go to https://railway.app
# Click "New Project"
# Add PostgreSQL database
# Add Redis database
```

#### 2. Deploy Each Service (5 times)

For each service (auth, gateway, metadata, storage-node, sync):

1. Click "+ New" → "GitHub Repo"
2. Select your repository
3. **Set Root Directory**: `backend`
4. **Set Build Args**: `SERVICE=auth-service` (change for each)
5. **Set Start Command**: `./auth-service` (change for each)
6. Add environment variables (see `.env.example`)
7. Deploy

#### 3. Enable Public Domain (Gateway Only)

- Go to gateway-service
- Settings → Networking
- Click "Generate Domain"
- Copy the URL (you'll need it for frontend)

---

## ⚙️ Environment Variables

### Auth Service
```
PORT=8081
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=your-super-secret-key-min-32-chars
```

### Metadata Service
```
PORT=8082
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
```

### Storage Node
```
PORT=8083
STORAGE_DIR=/data
```
+ Add Volume: `/data` (10GB)

### Sync Service
```
PORT=8084
REDIS_URL=${{Redis.REDIS_URL}}
```

### Gateway Service
```
PORT=8080
AUTH_SERVICE_URL=http://auth-service.railway.internal:8081
METADATA_SERVICE_URL=http://metadata-service.railway.internal:8082
STORAGE_SERVICE_URL=http://storage-node.railway.internal:8083
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Full details in `.env.example`**

---

## 🗄️ Database Setup

### Run Migrations

**Option 1: Railway CLI**
```bash
railway link
railway run sqlx migrate run
```

**Option 2: Local with Railway DB**
```bash
# Get DATABASE_URL from Railway dashboard
export DATABASE_URL="postgresql://..."
sqlx migrate run
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Gateway Service (PUBLIC)            │
│       https://gateway.railway.app           │
└──────────────┬──────────────────────────────┘
               │
    ┌──────────┴──────────┐
    │  Internal Network   │
    │  (.railway.internal)│
    └──────────┬──────────┘
               │
    ┌──────────┴──────────────────────┐
    │                                  │
┌───▼────┐  ┌─────────┐  ┌─────────┐ │
│  Auth  │  │Metadata │  │ Storage │ │
│ :8081  │  │  :8082  │  │  :8083  │ │
└───┬────┘  └────┬────┘  └────┬────┘ │
    │            │             │      │
    └────────────┴─────────────┴──────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼────┐    ┌─────▼────┐
    │PostgreSQL│    │  Redis   │
    └─────────┘    └──────────┘
```

---

## 📋 Deployment Checklist

- [ ] Create Railway project
- [ ] Add PostgreSQL database
- [ ] Add Redis database
- [ ] Run database migrations
- [ ] Deploy auth-service
- [ ] Deploy metadata-service
- [ ] Deploy storage-node (+ add volume)
- [ ] Deploy sync-service
- [ ] Deploy gateway-service
- [ ] Enable gateway public domain
- [ ] Copy gateway URL for frontend

---

## 🔧 Service Configuration

Each service needs:

1. **Root Directory**: `backend`
2. **Build Args**: `SERVICE=<service-name>`
3. **Start Command**: `./<service-name>`
4. **Environment Variables**: See `.env.example`

---

## 💡 Pro Tips

1. **Deploy in order**: auth → metadata → storage → sync → gateway
2. **Check logs**: After each deployment
3. **Save URLs**: You'll need them for configuration
4. **Test endpoints**: Before moving to next service
5. **Gateway last**: It depends on all other services

---

## 🆘 Troubleshooting

### Service won't start
→ Check environment variables are set correctly

### Database connection failed
→ Verify migrations ran successfully

### Services can't communicate
→ Use `.railway.internal` domain for internal URLs

### Build failed
→ Check Railway logs for specific error

---

## 📚 Documentation

- **Quick Guide**: `../QUICK_DEPLOY.md`
- **Complete Guide**: `../DEPLOYMENT_GUIDE.md`
- **Railway Details**: `../RAILWAY_SETUP.md`

---

## ✅ Success Criteria

Your backend is deployed when:

- ✅ All 5 services show "Active" status
- ✅ Gateway has public domain
- ✅ No errors in logs
- ✅ Health checks pass
- ✅ Services can communicate

---

**Ready to deploy?** Follow the steps above or read `../DEPLOYMENT_GUIDE.md` for detailed instructions.
