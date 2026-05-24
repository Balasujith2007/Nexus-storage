# ⚡ Quick Deploy Guide

**5-minute deployment guide for Nexus Storage**

---

## 🎯 Prerequisites (2 minutes)

```bash
# Install CLIs
npm install -g @railway/cli vercel

# Login
railway login
vercel login
```

---

## 🚂 Railway Backend (15 minutes)

### 1. Create Project & Databases
1. Go to https://railway.app → New Project
2. Add PostgreSQL database
3. Add Redis database

### 2. Run Migrations
```bash
cd Nexus-storage
railway link
railway run sqlx migrate run
```

### 3. Deploy Services (Do this 5 times, once for each service)

**For each service (auth, metadata, storage-node, sync, gateway):**

1. Click "+ New" → "GitHub Repo"
2. Select your repository
3. Configure:
   - **Name**: `[service-name]`
   - **Build Args**: Add `SERVICE=[service-name]`
   - **Start Command**: `./[service-name]`

4. Add Environment Variables:

**Auth Service:**
```
PORT=8081
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=your-super-secret-key-min-32-chars
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
+ Add Volume: `/data` (10GB)

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
+ **Enable Public Domain** → Copy URL

---

## ▲ Vercel Frontend (5 minutes)

### 1. Deploy
```bash
cd frontend
vercel --prod
```

### 2. Set Environment Variable
When prompted or in Vercel Dashboard:
```
NEXT_PUBLIC_API_URL=https://your-gateway.railway.app
```

### 3. Update CORS
Go back to Railway → Gateway Service → Add variable:
```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

---

## ✅ Test

1. Visit your Vercel URL
2. Register a new account
3. Login
4. Upload a file
5. Done! 🎉

---

## 🆘 Quick Troubleshooting

**Services won't start?**
→ Check Railway logs for each service

**Frontend can't connect?**
→ Verify `NEXT_PUBLIC_API_URL` matches gateway URL

**CORS errors?**
→ Add your Vercel domain to `ALLOWED_ORIGINS` in gateway

**Database errors?**
→ Ensure migrations ran: `railway run sqlx migrate run`

---

## 📊 Service URLs Reference

After deployment, you'll have:

- **Gateway (Public)**: `https://gateway-service.railway.app`
- **Frontend**: `https://your-app.vercel.app`
- **Auth**: `http://auth-service.railway.internal:8081` (private)
- **Metadata**: `http://metadata-service.railway.internal:8082` (private)
- **Storage**: `http://storage-node.railway.internal:8083` (private)
- **Sync**: `http://sync-service.railway.internal:8084` (private)

---

## 💰 Cost Estimate

**Railway Free Tier:**
- $5 free credit/month
- ~5 services = ~$5-10/month after free credit

**Vercel Free Tier:**
- Unlimited deployments
- 100GB bandwidth
- Free for personal projects

**Total: ~$5-10/month** (after Railway free credit)

---

## 🔗 Useful Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Full Guide**: See `DEPLOYMENT_GUIDE.md`
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md`

---

## 🎓 Pro Tips

1. **Use Railway Templates**: Save your configuration as a template for faster redeployment
2. **Enable Auto-Deploy**: Connect GitHub for automatic deployments on push
3. **Monitor Logs**: Keep Railway logs open during first deployment
4. **Test Locally First**: Always test with `docker-compose up` before deploying
5. **Backup Database**: Set up automated backups in Railway settings

---

**Need help?** Check the full `DEPLOYMENT_GUIDE.md` for detailed instructions.
