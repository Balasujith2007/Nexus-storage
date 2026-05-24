# Nexus Storage - Complete Deployment Guide

## 🚀 Deployment Architecture

- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (Rust microservices)
- **Database**: Railway PostgreSQL
- **Redis**: Railway Redis

---

## Part 1: Railway Backend Deployment

### Step 1: Prepare Railway Account
1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Create a new project: Click "New Project"

### Step 2: Deploy PostgreSQL Database
1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will provision a PostgreSQL instance
4. Click on the PostgreSQL service
5. Go to "Variables" tab and note these values:
   - `DATABASE_URL` (you'll need this)
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### Step 3: Deploy Redis
1. Click "+ New" again
2. Select "Database" → "Redis"
3. Railway will provision a Redis instance
4. Go to "Variables" tab and note:
   - `REDIS_URL` (you'll need this)

### Step 4: Run Database Migrations
**Option A: From your local machine**
```bash
# Set the DATABASE_URL from Railway
export DATABASE_URL="postgresql://user:pass@host:port/dbname"

# Run migrations
cd Nexus-storage
sqlx migrate run
```

**Option B: Using Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run sqlx migrate run
```

### Step 5: Deploy Auth Service
1. In Railway project, click "+ New"
2. Select "GitHub Repo" (or "Empty Service" if not using GitHub)
3. If using GitHub:
   - Connect your GitHub account
   - Select the Nexus-storage repository
   - Railway will detect it's a Rust project
4. Configure the service:
   - **Name**: `auth-service`
   - **Root Directory**: Leave empty (we'll use Dockerfile)
   - **Build Command**: Uses Dockerfile.backend
   
5. Add Environment Variables (click "Variables" tab):
   ```
   PORT=8081
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CARGO_BUILD_TARGET=auth-service
   ```

6. Add Custom Start Command (Settings → Deploy):
   ```
   ./auth-service
   ```

7. Click "Deploy"

### Step 6: Deploy Metadata Service
1. Click "+ New" → "GitHub Repo" (same repo)
2. **Name**: `metadata-service`
3. Environment Variables:
   ```
   PORT=8082
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   CARGO_BUILD_TARGET=metadata-service
   ```
4. Start Command: `./metadata-service`
5. Deploy

### Step 7: Deploy Storage Node
1. Click "+ New" → "GitHub Repo"
2. **Name**: `storage-node`
3. Environment Variables:
   ```
   PORT=8083
   STORAGE_DIR=/data
   CARGO_BUILD_TARGET=storage-node
   ```
4. Add Volume (Settings → Volumes):
   - Mount Path: `/data`
   - Size: 10GB (or as needed)
5. Start Command: `./storage-node`
6. Deploy

### Step 8: Deploy Sync Service
1. Click "+ New" → "GitHub Repo"
2. **Name**: `sync-service`
3. Environment Variables:
   ```
   PORT=8084
   REDIS_URL=${{Redis.REDIS_URL}}
   CARGO_BUILD_TARGET=sync-service
   ```
4. Start Command: `./sync-service`
5. Deploy

### Step 9: Deploy Gateway Service (API Gateway)
1. Click "+ New" → "GitHub Repo"
2. **Name**: `gateway-service`
3. Environment Variables:
   ```
   PORT=8080
   AUTH_SERVICE_URL=${{auth-service.RAILWAY_PRIVATE_DOMAIN}}:8081
   METADATA_SERVICE_URL=${{metadata-service.RAILWAY_PRIVATE_DOMAIN}}:8082
   STORAGE_SERVICE_URL=${{storage-node.RAILWAY_PRIVATE_DOMAIN}}:8083
   CARGO_BUILD_TARGET=gateway-service
   ```
4. Start Command: `./gateway-service`
5. **Enable Public Domain** (Settings → Networking):
   - Click "Generate Domain"
   - Note this URL (e.g., `gateway-service.railway.app`)
6. Deploy

---

## Part 2: Vercel Frontend Deployment

### Step 1: Prepare Vercel Account
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"

### Step 2: Import Repository
1. Import your GitHub repository
2. Vercel will auto-detect it's a Next.js project
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Configure Environment Variables
In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_API_URL=https://your-gateway-service.railway.app
```

Replace `your-gateway-service.railway.app` with your actual Railway gateway URL from Step 9 above.

### Step 4: Deploy
1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. You'll get a URL like: `https://nexus-storage.vercel.app`

### Step 5: Configure Custom Domain (Optional)
1. In Vercel project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

## Part 3: Post-Deployment Configuration

### Update CORS Settings
The gateway service needs to allow requests from your Vercel domain.

**Option A: Update via Railway Environment Variables**
Add to gateway-service:
```
ALLOWED_ORIGINS=https://nexus-storage.vercel.app,https://your-custom-domain.com
```

**Option B: Update code** (if not using env var)
Edit `services/gateway-service/src/main.rs` and redeploy.

### Test the Deployment
1. Visit your Vercel URL
2. Try to register a new account
3. Login and test file operations
4. Check Railway logs for any errors:
   - Click on each service
   - Go to "Deployments" tab
   - Click "View Logs"

---

## Part 4: Monitoring & Maintenance

### Railway Monitoring
- **Logs**: Each service → Deployments → View Logs
- **Metrics**: Each service → Metrics tab
- **Database**: PostgreSQL service → Data tab (query interface)

### Vercel Monitoring
- **Analytics**: Project → Analytics
- **Logs**: Project → Deployments → Click deployment → Logs
- **Performance**: Built-in Web Vitals tracking

### Cost Optimization
**Railway Free Tier:**
- $5 free credit per month
- Shared resources
- Upgrade to Developer plan ($5/month) for more resources

**Vercel Free Tier:**
- Unlimited deployments
- 100GB bandwidth
- Serverless function execution

---

## Troubleshooting

### Backend Issues
**Services won't start:**
```bash
# Check Railway logs
railway logs --service auth-service

# Common issues:
# 1. DATABASE_URL not set correctly
# 2. Migrations not run
# 3. Build failed - check Dockerfile
```

**Database connection errors:**
- Verify DATABASE_URL format
- Check PostgreSQL service is running
- Ensure migrations were run

### Frontend Issues
**API calls failing:**
- Check NEXT_PUBLIC_API_URL is correct
- Verify CORS is configured on gateway
- Check browser console for errors

**Build failures:**
- Check environment variables are set
- Verify root directory is `frontend`
- Check build logs in Vercel

### Performance Issues
**Slow response times:**
- Check Railway service metrics
- Consider upgrading Railway plan
- Add Redis caching
- Optimize database queries

---

## Security Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS only (Railway/Vercel do this by default)
- [ ] Configure CORS properly (whitelist only your domains)
- [ ] Set up database backups in Railway
- [ ] Enable Railway's built-in DDoS protection
- [ ] Review and rotate secrets regularly
- [ ] Set up monitoring alerts
- [ ] Enable Vercel's security headers

---

## Useful Commands

### Railway CLI
```bash
# View logs
railway logs

# Run commands in Railway environment
railway run <command>

# Open service in browser
railway open

# Check service status
railway status
```

### Vercel CLI
```bash
# Install
npm i -g vercel

# Deploy from local
vercel

# View logs
vercel logs

# List deployments
vercel ls
```

---

## Next Steps

1. ✅ Deploy all services to Railway
2. ✅ Deploy frontend to Vercel
3. ✅ Configure environment variables
4. ✅ Test the application
5. 🔄 Set up custom domains
6. 🔄 Configure monitoring alerts
7. 🔄 Set up CI/CD pipelines
8. 🔄 Implement backup strategy

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Railway Discord**: https://discord.gg/railway
- **Vercel Discord**: https://discord.gg/vercel
