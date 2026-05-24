# 🔐 Backend Environment Variables Guide

Complete guide for all environment variables needed for Railway deployment.

---

## 📋 Quick Reference

| Service | Variables Needed | Auto-Generated |
|---------|------------------|----------------|
| **PostgreSQL** | DATABASE_URL | ✅ Yes (Railway) |
| **Redis** | REDIS_URL | ✅ Yes (Railway) |
| **Auth Service** | 4 variables | ❌ Manual |
| **Metadata Service** | 3 variables | ❌ Manual |
| **Storage Node** | 2 variables | ❌ Manual |
| **Sync Service** | 2 variables | ❌ Manual |
| **Gateway Service** | 5+ variables | ❌ Manual |

---

## 🗄️ Database Variables (Auto-Generated)

### PostgreSQL

When you add PostgreSQL in Railway, these are **automatically created**:

```bash
# Main connection string (use this!)
DATABASE_URL=postgresql://postgres:password@host.railway.internal:5432/railway

# Individual components (also available)
PGHOST=host.railway.internal
PGPORT=5432
PGUSER=postgres
PGPASSWORD=generated-password
PGDATABASE=railway
```

**How to use in other services:**
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Redis

When you add Redis in Railway, these are **automatically created**:

```bash
# Main connection string (use this!)
REDIS_URL=redis://default:password@host.railway.internal:6379

# Individual components (also available)
REDIS_HOST=host.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=generated-password
```

**How to use in other services:**
```bash
REDIS_URL=${{Redis.REDIS_URL}}
```

---

## 🔧 Service-Specific Variables

### 1️⃣ Auth Service

**Required Variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `8081` | Service port |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | PostgreSQL connection |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` | Redis connection |
| `JWT_SECRET` | `your-secret-key` | JWT signing key (min 32 chars) |
| `RUST_LOG` | `info` | Log level (optional) |

**Example Configuration:**
```bash
PORT=8081
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=super-secret-key-change-this-in-production-min-32-characters
RUST_LOG=info
```

**⚠️ Important:**
- `JWT_SECRET` must be at least 32 characters
- Generate with: `openssl rand -base64 32`
- Keep it secret and secure!

---

### 2️⃣ Metadata Service

**Required Variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `8082` | Service port |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | PostgreSQL connection |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` | Redis connection |
| `RUST_LOG` | `info` | Log level (optional) |

**Example Configuration:**
```bash
PORT=8082
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
RUST_LOG=info
```

---

### 3️⃣ Storage Node

**Required Variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `8083` | Service port |
| `STORAGE_DIR` | `/data` | Storage directory path |
| `RUST_LOG` | `info` | Log level (optional) |

**Example Configuration:**
```bash
PORT=8083
STORAGE_DIR=/data
RUST_LOG=info
```

**⚠️ Important:**
- Must add a **Volume** in Railway:
  - Mount Path: `/data`
  - Size: 10GB (or more)

---

### 4️⃣ Sync Service

**Required Variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `8084` | Service port |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` | Redis connection |
| `RUST_LOG` | `info` | Log level (optional) |

**Example Configuration:**
```bash
PORT=8084
REDIS_URL=${{Redis.REDIS_URL}}
RUST_LOG=info
```

---

### 5️⃣ Gateway Service (Most Important!)

**Required Variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `8080` | Service port |
| `AUTH_SERVICE_URL` | `http://auth-service.railway.internal:8081` | Auth service URL |
| `METADATA_SERVICE_URL` | `http://metadata-service.railway.internal:8082` | Metadata service URL |
| `STORAGE_SERVICE_URL` | `http://storage-node.railway.internal:8083` | Storage service URL |
| `SYNC_SERVICE_URL` | `http://sync-service.railway.internal:8084` | Sync service URL (optional) |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | CORS allowed origins |
| `RUST_LOG` | `info` | Log level (optional) |

**Example Configuration:**
```bash
PORT=8080
AUTH_SERVICE_URL=http://auth-service.railway.internal:8081
METADATA_SERVICE_URL=http://metadata-service.railway.internal:8082
STORAGE_SERVICE_URL=http://storage-node.railway.internal:8083
SYNC_SERVICE_URL=http://sync-service.railway.internal:8084
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
RUST_LOG=info
```

**⚠️ Important:**
- Service names must match your Railway service names exactly
- Use `.railway.internal` for internal communication
- Add your Vercel domain to `ALLOWED_ORIGINS` after frontend deployment
- This is the **only service** that needs a public domain

---

## 🔨 Build Arguments

**Every service needs this build argument:**

| Variable | Value | Description |
|----------|-------|-------------|
| `SERVICE` | Service name | Which service to build |

**Values for each service:**
- Auth: `SERVICE=auth-service`
- Gateway: `SERVICE=gateway-service`
- Metadata: `SERVICE=metadata-service`
- Storage: `SERVICE=storage-node`
- Sync: `SERVICE=sync-service`

**Where to set:** Railway Dashboard → Service → Settings → Build → Build Args

---

## 📝 How to Set Variables in Railway

### Method 1: Railway Dashboard (Recommended)

1. Go to your service in Railway
2. Click "Variables" tab
3. Click "New Variable"
4. Add each variable:
   - **Variable Name**: `PORT`
   - **Value**: `8081`
5. Click "Add"
6. Repeat for all variables

### Method 2: Railway CLI

```bash
railway variables set PORT=8081
railway variables set DATABASE_URL='${{Postgres.DATABASE_URL}}'
railway variables set REDIS_URL='${{Redis.REDIS_URL}}'
```

### Method 3: Bulk Import

1. Create a file with all variables
2. Railway Dashboard → Variables → "Raw Editor"
3. Paste all variables
4. Save

---

## 🔗 Railway Variable References

Railway allows you to reference other services' variables:

**Syntax:**
```bash
${{ServiceName.VARIABLE_NAME}}
```

**Examples:**
```bash
# Reference PostgreSQL database URL
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Reference Redis URL
REDIS_URL=${{Redis.REDIS_URL}}

# Reference another service's port
AUTH_PORT=${{auth-service.PORT}}
```

**⚠️ Important:**
- Service names are case-sensitive
- Must match exactly as shown in Railway dashboard
- Railway auto-generates database variables

---

## 🔐 Security Best Practices

### JWT_SECRET

**Generate a secure key:**
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Requirements:**
- Minimum 32 characters
- Use random, unpredictable values
- Never commit to Git
- Rotate regularly in production

### Database Credentials

- ✅ Use Railway's auto-generated credentials
- ✅ Never hardcode passwords
- ✅ Use `${{Postgres.DATABASE_URL}}` reference
- ❌ Don't expose in logs

### CORS Configuration

```bash
# Development
ALLOWED_ORIGINS=http://localhost:3000

# Production
ALLOWED_ORIGINS=https://your-app.vercel.app

# Multiple domains
ALLOWED_ORIGINS=https://app1.vercel.app,https://app2.vercel.app
```

---

## 📊 Complete Variable Checklist

### Before Deployment

- [ ] PostgreSQL database added to Railway
- [ ] Redis database added to Railway
- [ ] Generated secure JWT_SECRET
- [ ] Know your Vercel domain (for CORS)

### Auth Service
- [ ] PORT=8081
- [ ] DATABASE_URL=${{Postgres.DATABASE_URL}}
- [ ] REDIS_URL=${{Redis.REDIS_URL}}
- [ ] JWT_SECRET=<your-secret>
- [ ] Build Arg: SERVICE=auth-service

### Metadata Service
- [ ] PORT=8082
- [ ] DATABASE_URL=${{Postgres.DATABASE_URL}}
- [ ] REDIS_URL=${{Redis.REDIS_URL}}
- [ ] Build Arg: SERVICE=metadata-service

### Storage Node
- [ ] PORT=8083
- [ ] STORAGE_DIR=/data
- [ ] Volume added: /data (10GB)
- [ ] Build Arg: SERVICE=storage-node

### Sync Service
- [ ] PORT=8084
- [ ] REDIS_URL=${{Redis.REDIS_URL}}
- [ ] Build Arg: SERVICE=sync-service

### Gateway Service
- [ ] PORT=8080
- [ ] AUTH_SERVICE_URL=http://auth-service.railway.internal:8081
- [ ] METADATA_SERVICE_URL=http://metadata-service.railway.internal:8082
- [ ] STORAGE_SERVICE_URL=http://storage-node.railway.internal:8083
- [ ] ALLOWED_ORIGINS=https://your-app.vercel.app
- [ ] Public domain enabled
- [ ] Build Arg: SERVICE=gateway-service

---

## 🆘 Troubleshooting

### "DATABASE_URL not found"
→ Make sure PostgreSQL service is added  
→ Use `${{Postgres.DATABASE_URL}}` syntax  
→ Check service name matches exactly

### "Connection refused"
→ Check service names in URLs  
→ Use `.railway.internal` domain  
→ Verify services are running

### "CORS error"
→ Add your Vercel domain to `ALLOWED_ORIGINS`  
→ Redeploy gateway-service  
→ Check domain spelling

### "JWT validation failed"
→ Ensure JWT_SECRET is the same across deployments  
→ Check it's at least 32 characters  
→ Verify it's set in auth-service

---

## 💡 Pro Tips

1. **Copy-paste carefully** - Variable names are case-sensitive
2. **Use Railway references** - `${{Postgres.DATABASE_URL}}` is better than hardcoding
3. **Set RUST_LOG=debug** - For troubleshooting (change to `info` in production)
4. **Save your JWT_SECRET** - You'll need it if you redeploy
5. **Update CORS after frontend deploy** - Add your Vercel URL to gateway

---

## 📚 Related Documentation

- **Deployment Guide**: `../DEPLOYMENT_GUIDE.md`
- **Railway Setup**: `../RAILWAY_SETUP.md`
- **Backend README**: `README.md`
- **Environment Template**: `.env.example`

---

## ✅ Quick Copy-Paste

### Auth Service
```
PORT=8081
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=CHANGE-THIS-TO-YOUR-GENERATED-SECRET-KEY
RUST_LOG=info
```

### Metadata Service
```
PORT=8082
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
RUST_LOG=info
```

### Storage Node
```
PORT=8083
STORAGE_DIR=/data
RUST_LOG=info
```

### Sync Service
```
PORT=8084
REDIS_URL=${{Redis.REDIS_URL}}
RUST_LOG=info
```

### Gateway Service
```
PORT=8080
AUTH_SERVICE_URL=http://auth-service.railway.internal:8081
METADATA_SERVICE_URL=http://metadata-service.railway.internal:8082
STORAGE_SERVICE_URL=http://storage-node.railway.internal:8083
ALLOWED_ORIGINS=https://your-app.vercel.app
RUST_LOG=info
```

**Remember to:**
1. Generate your own JWT_SECRET
2. Replace `your-app.vercel.app` with your actual domain
3. Set `SERVICE` build arg for each service

---

**Need help?** Check `../RAILWAY_SETUP.md` for more details!
