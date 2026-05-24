# ⚡ Environment Variables - Quick Reference

## 🎯 What You Need

### Auto-Generated (Railway creates these)
- ✅ `DATABASE_URL` - PostgreSQL connection
- ✅ `REDIS_URL` - Redis connection

### You Must Set (Manual)
- ❌ `JWT_SECRET` - Generate yourself
- ❌ `ALLOWED_ORIGINS` - Your Vercel domain
- ❌ Service URLs - Internal Railway URLs
- ❌ Ports - Different for each service

---

## 📋 Copy-Paste for Each Service

### 1. Auth Service
```bash
PORT=8081
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=YOUR-32-CHAR-SECRET-HERE
RUST_LOG=info
```
**Build Arg:** `SERVICE=auth-service`

---

### 2. Metadata Service
```bash
PORT=8082
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
RUST_LOG=info
```
**Build Arg:** `SERVICE=metadata-service`

---

### 3. Storage Node
```bash
PORT=8083
STORAGE_DIR=/data
RUST_LOG=info
```
**Build Arg:** `SERVICE=storage-node`  
**⚠️ Also add Volume:** `/data` (10GB)

---

### 4. Sync Service
```bash
PORT=8084
REDIS_URL=${{Redis.REDIS_URL}}
RUST_LOG=info
```
**Build Arg:** `SERVICE=sync-service`

---

### 5. Gateway Service
```bash
PORT=8080
AUTH_SERVICE_URL=http://auth-service.railway.internal:8081
METADATA_SERVICE_URL=http://metadata-service.railway.internal:8082
STORAGE_SERVICE_URL=http://storage-node.railway.internal:8083
ALLOWED_ORIGINS=https://your-app.vercel.app
RUST_LOG=info
```
**Build Arg:** `SERVICE=gateway-service`  
**⚠️ Enable Public Domain**

---

## 🔐 Generate JWT_SECRET

```bash
# Run this command:
openssl rand -base64 32

# Copy the output and use it as JWT_SECRET
```

---

## 📝 Where to Set Variables

### In Railway Dashboard:
1. Click on your service
2. Go to "Variables" tab
3. Click "New Variable"
4. Add each variable
5. Deploy

### Build Args:
1. Click on your service
2. Go to "Settings" tab
3. Scroll to "Build"
4. Add `SERVICE=service-name`

---

## ✅ Checklist

Before deploying each service:

- [ ] Added all environment variables
- [ ] Set SERVICE build arg
- [ ] Generated JWT_SECRET (auth-service only)
- [ ] Added volume (storage-node only)
- [ ] Enabled public domain (gateway only)
- [ ] Updated ALLOWED_ORIGINS (gateway only, after frontend deploy)

---

## 🆘 Common Issues

**"DATABASE_URL not found"**
→ Add PostgreSQL database first

**"Connection refused"**
→ Check service names match exactly

**"CORS error"**
→ Add your Vercel domain to ALLOWED_ORIGINS

---

**Full details:** See `ENVIRONMENT_VARIABLES.md`
