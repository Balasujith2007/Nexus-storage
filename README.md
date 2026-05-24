# Nexus Storage - Distributed File Storage System

A production-grade, distributed cloud storage platform written in Rust (Backend) and Next.js (Frontend).

## 🚀 Quick Start

### For Deployment (Production)

**Backend → Railway:**
```bash
cd backend
# Follow backend/README.md
```

**Frontend → Vercel:**
```bash
cd frontend
# Follow frontend/README.md
```

**Complete Guide:** Read `DEPLOYMENT_GUIDE.md`

### For Local Development

1. **Start infrastructure:**
   ```bash
   docker-compose up -d db redis
   ```

2. **Run migrations:**
   ```bash
   cd backend
   sqlx migrate run
   ```

3. **Start backend services:**
   ```bash
   cd backend
   cargo run --bin auth-service
   cargo run --bin metadata-service
   cargo run --bin storage-node
   cargo run --bin gateway-service
   ```

4. **Start frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📁 Project Structure

```
Nexus-storage/
├── backend/              → Deploy to Railway 🦀
│   ├── services/         (5 Rust microservices)
│   ├── shared/           (common library)
│   ├── migrations/       (database setup)
│   └── README.md         (deployment guide)
│
├── frontend/             → Deploy to Vercel 🎨
│   ├── src/              (Next.js app)
│   ├── vercel.json       (Vercel config)
│   └── README.md         (deployment guide)
│
└── Documentation/        → Read before deploying 📚
    ├── DEPLOYMENT_GUIDE.md
    ├── QUICK_DEPLOY.md
    └── RAILWAY_SETUP.md
```

## 🏗️ Architecture

This system uses a microservices architecture:
- **API Gateway**: Routes external traffic to internal services
- **Auth Service**: User authentication (JWT + Argon2)
- **Metadata Service**: File metadata in PostgreSQL
- **Storage Nodes**: Distributed file chunk storage
- **Sync Service**: Real-time updates via WebSockets

## 📚 Documentation

- **Quick Deploy**: `QUICK_DEPLOY.md` - 5-minute deployment
- **Complete Guide**: `DEPLOYMENT_GUIDE.md` - Full walkthrough
- **Railway Setup**: `RAILWAY_SETUP.md` - Railway specifics
- **Project Structure**: `PROJECT_STRUCTURE.md` - File organization
- **Simple Guide**: `SIMPLE_GUIDE.md` - Easiest overview

## 🛠️ Prerequisites

**For Local Development:**
- Rust 1.76+
- Docker & Docker Compose
- Node.js 20+

**For Deployment:**
- Railway account (backend)
- Vercel account (frontend)
- GitHub repository

## ✅ Project Status

- ✅ Backend: Error-free compilation
- ✅ Frontend: Successful build
- ✅ Documentation: Complete
- ✅ Ready for deployment

See `PROJECT_STATUS.md` for details.

## 🚀 Deployment

### Railway (Backend)
```bash
cd backend
# Follow backend/README.md
# Or read RAILWAY_SETUP.md
```

### Vercel (Frontend)
```bash
cd frontend
# Follow frontend/README.md
# Or read DEPLOYMENT_GUIDE.md Part 2
```

## 💰 Cost Estimate

- **Development**: $0-5/month (free tiers)
- **Production**: $10-35/month

See `DEPLOYMENT_GUIDE.md` for details.
