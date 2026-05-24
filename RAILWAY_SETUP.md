# Railway-Specific Setup Guide

## Understanding Railway Service Configuration

Railway uses a multi-service architecture. Each Rust microservice needs to be deployed as a separate Railway service.

---

## Service Architecture on Railway

```
Railway Project: nexus-storage
├── PostgreSQL (Database)
├── Redis (Cache)
├── auth-service (Rust)
├── metadata-service (Rust)
├── storage-node (Rust)
├── sync-service (Rust)
└── gateway-service (Rust) [PUBLIC]
```

---

## Step-by-Step Railway Configuration

### 1. Create Railway Project

```bash
# Option A: Via CLI
railway init

# Option B: Via Web
# Go to https://railway.app → New Project
```

### 2. Add Databases First

**PostgreSQL:**
1. Click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway auto-generates: `DATABASE_URL`, `PGHOST`, `PGPORT`, etc.

**Redis:**
1. Click "+ New"
2. Select "Database" → "Redis"
3. Railway auto-generates: `REDIS_URL`

### 3. Deploy Each Microservice

For **EACH** of the 5 services, follow these steps:

#### A. Create Service
1. Click "+ New"
2. Select "GitHub Repo"
3. Choose your repository
4. Railway will detect it's a Rust project

#### B. Configure Build

**Settings → Build:**
- Builder: `DOCKERFILE`
- Dockerfile Path: `Dockerfile.backend`
- Build Args: Add `SERVICE=<service-name>`

Example for auth-service:
```
SERVICE=auth-service
```

#### C. Configure Deploy

**Settings → Deploy:**
- Start Command: `./<service-name>`
- Health Check Path: `/health` (optional)
- Restart Policy: `ON_FAILURE`

Example for auth-service:
```
./auth-service
```

#### D. Add Environment Variables

**Settings → Variables:**

Click "New Variable" and add each one:

**Auth Service:**
| Variable | Value |
|----------|-------|
| PORT | 8081 |
| DATABASE_URL | `${{Postgres.DATABASE_URL}}` |
| REDIS_URL | `${{Redis.REDIS_URL}}` |
| JWT_SECRET | `your-secret-key-here` |
| RUST_LOG | info |

**Metadata Service:**
| Variable | Value |
|----------|-------|
| PORT | 8082 |
| DATABASE_URL | `${{Postgres.DATABASE_URL}}` |
| REDIS_URL | `${{Redis.REDIS_URL}}` |
| RUST_LOG | info |

**Storage Node:**
| Variable | Value |
|----------|-------|
| PORT | 8083 |
| STORAGE_DIR | /data |
| RUST_LOG | info |

**Sync Service:**
| Variable | Value |
|----------|-------|
| PORT | 8084 |
| REDIS_URL | `${{Redis.REDIS_URL}}` |
| RUST_LOG | info |

**Gateway Service:**
| Variable | Value |
|----------|-------|
| PORT | 8080 |
| AUTH_SERVICE_URL | `http://auth-service.railway.internal:8081` |
| METADATA_SERVICE_URL | `http://metadata-service.railway.internal:8082` |
| STORAGE_SERVICE_URL | `http://storage-node.railway.internal:8083` |
| RUST_LOG | info |

#### E. Enable Public Access (Gateway Only)

**For gateway-service ONLY:**
1. Go to Settings → Networking
2. Click "Generate Domain"
3. Copy the public URL (e.g., `gateway-service.railway.app`)
4. This is your API endpoint for the frontend

---

## Railway Service Naming Convention

Railway uses internal DNS for service-to-service communication:

```
http://<service-name>.railway.internal:<port>
```

Examples:
- `http://auth-service.railway.internal:8081`
- `http://metadata-service.railway.internal:8082`
- `http://storage-node.railway.internal:8083`

**Important:** Only the gateway service needs a public domain!

---

## Railway Variable References

Railway allows you to reference other services' variables:

```
${{ServiceName.VARIABLE_NAME}}
```

Examples:
- `${{Postgres.DATABASE_URL}}` - PostgreSQL connection string
- `${{Redis.REDIS_URL}}` - Redis connection string
- `${{auth-service.PORT}}` - Auth service port

---

## Build Args vs Environment Variables

**Build Args:**
- Set during Docker build
- Used in Dockerfile
- Example: `SERVICE=auth-service`

**Environment Variables:**
- Set at runtime
- Used by the application
- Example: `DATABASE_URL=postgresql://...`

---

## Storage Node Volume Configuration

The storage-node service needs persistent storage:

1. Go to storage-node service
2. Settings → Volumes
3. Click "New Volume"
4. Configure:
   - Mount Path: `/data`
   - Size: 10GB (or more)

---

## Deployment Order

Deploy in this order to avoid dependency issues:

1. ✅ PostgreSQL
2. ✅ Redis
3. ✅ Run migrations
4. ✅ Auth Service
5. ✅ Metadata Service
6. ✅ Storage Node
7. ✅ Sync Service
8. ✅ Gateway Service (last, depends on others)

---

## Running Migrations

**Option 1: Railway CLI**
```bash
railway link
railway run sqlx migrate run
```

**Option 2: Temporary Service**
1. Create a temporary service
2. Set DATABASE_URL
3. Run: `sqlx migrate run`
4. Delete the service

**Option 3: Local with Railway DB**
```bash
# Get DATABASE_URL from Railway
export DATABASE_URL="postgresql://..."
sqlx migrate run
```

---

## Monitoring & Logs

**View Logs:**
1. Click on any service
2. Go to "Deployments" tab
3. Click on latest deployment
4. Click "View Logs"

**View Metrics:**
1. Click on any service
2. Go to "Metrics" tab
3. See CPU, Memory, Network usage

**Database Access:**
1. Click on PostgreSQL service
2. Go to "Data" tab
3. Run SQL queries directly

---

## Common Issues & Solutions

### Issue: Service won't start
**Solution:**
- Check logs for errors
- Verify environment variables are set
- Ensure DATABASE_URL is accessible
- Check if migrations ran

### Issue: Services can't communicate
**Solution:**
- Use `.railway.internal` domain
- Verify service names match
- Check port numbers
- Ensure services are running

### Issue: Build fails
**Solution:**
- Check Dockerfile syntax
- Verify SERVICE build arg is set
- Check Rust version compatibility
- Review build logs

### Issue: Out of memory
**Solution:**
- Upgrade Railway plan
- Optimize Rust build (already done in Dockerfile)
- Reduce concurrent builds

---

## Cost Optimization

**Free Tier:**
- $5 free credit/month
- Shared resources
- Good for development

**Developer Plan ($5/month):**
- $5 credit + $5 usage
- Better resources
- Good for small production

**Tips to Reduce Costs:**
1. Use shared databases (don't create separate DB per service)
2. Scale down non-critical services
3. Use Railway's sleep feature for dev environments
4. Monitor usage in Railway dashboard

---

## CI/CD with Railway

**Auto-Deploy from GitHub:**
1. Connect GitHub repository
2. Railway auto-deploys on push to main
3. Configure branch in Settings → Source

**Manual Deploy:**
```bash
railway up
```

**Deploy Specific Service:**
```bash
railway up --service auth-service
```

---

## Backup Strategy

**Database Backups:**
1. Railway auto-backs up PostgreSQL
2. Manual backup: Use `pg_dump`
3. Download backup from Railway dashboard

**Code Backups:**
- Use GitHub (already done)
- Tag releases
- Keep deployment history

---

## Security Best Practices

1. ✅ Use strong JWT_SECRET (min 32 chars)
2. ✅ Enable private networking (default)
3. ✅ Only expose gateway publicly
4. ✅ Use Railway's secret management
5. ✅ Rotate secrets regularly
6. ✅ Enable 2FA on Railway account
7. ✅ Review access logs
8. ✅ Use environment-specific secrets

---

## Scaling

**Horizontal Scaling:**
- Railway supports multiple replicas
- Configure in Settings → Deploy
- Load balancing is automatic

**Vertical Scaling:**
- Upgrade Railway plan
- More CPU/Memory per service

**Database Scaling:**
- Upgrade PostgreSQL plan
- Add read replicas (higher tiers)
- Use connection pooling

---

## Useful Railway CLI Commands

```bash
# Login
railway login

# Link project
railway link

# List services
railway service

# View logs
railway logs

# Run command in Railway environment
railway run <command>

# Open service in browser
railway open

# Check status
railway status

# Deploy
railway up

# Environment variables
railway variables
```

---

## Next Steps

1. ✅ Deploy all services
2. ✅ Test each endpoint
3. ✅ Monitor logs for 24 hours
4. ✅ Set up alerts
5. ✅ Configure custom domain
6. ✅ Set up staging environment
7. ✅ Implement CI/CD
8. ✅ Document any customizations

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app
- **Railway Blog**: https://blog.railway.app

---

**Pro Tip:** Save your Railway configuration as a template for easy redeployment!
