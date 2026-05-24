# 🚀 Deployment Checklist

Use this checklist to ensure smooth deployment of Nexus Storage.

## Pre-Deployment

- [ ] Code is error-free and tested locally
- [ ] All environment variables are documented
- [ ] Database migrations are ready
- [ ] Railway account created
- [ ] Vercel account created
- [ ] GitHub repository is up to date

---

## Railway Backend Deployment

### 1. Project Setup
- [ ] Create new Railway project
- [ ] Name project: "nexus-storage" (or your preferred name)

### 2. Database Setup
- [ ] Add PostgreSQL database
  - [ ] Note down DATABASE_URL
  - [ ] Note down connection details
- [ ] Add Redis database
  - [ ] Note down REDIS_URL

### 3. Run Migrations
- [ ] Install Railway CLI: `npm i -g @railway/cli`
- [ ] Login: `railway login`
- [ ] Link project: `railway link`
- [ ] Run migrations: `railway run sqlx migrate run`
- [ ] Verify migrations succeeded

### 4. Deploy Auth Service
- [ ] Create new service from GitHub repo
- [ ] Name: `auth-service`
- [ ] Set build args: `SERVICE=auth-service`
- [ ] Add environment variables:
  - [ ] `PORT=8081`
  - [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}`
  - [ ] `REDIS_URL=${{Redis.REDIS_URL}}`
  - [ ] `JWT_SECRET=<generate-secure-key>`
- [ ] Set start command: `./auth-service`
- [ ] Deploy and verify logs

### 5. Deploy Metadata Service
- [ ] Create new service from GitHub repo
- [ ] Name: `metadata-service`
- [ ] Set build args: `SERVICE=metadata-service`
- [ ] Add environment variables:
  - [ ] `PORT=8082`
  - [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}`
  - [ ] `REDIS_URL=${{Redis.REDIS_URL}}`
- [ ] Set start command: `./metadata-service`
- [ ] Deploy and verify logs

### 6. Deploy Storage Node
- [ ] Create new service from GitHub repo
- [ ] Name: `storage-node`
- [ ] Set build args: `SERVICE=storage-node`
- [ ] Add environment variables:
  - [ ] `PORT=8083`
  - [ ] `STORAGE_DIR=/data`
- [ ] Add volume:
  - [ ] Mount path: `/data`
  - [ ] Size: 10GB (adjust as needed)
- [ ] Set start command: `./storage-node`
- [ ] Deploy and verify logs

### 7. Deploy Sync Service
- [ ] Create new service from GitHub repo
- [ ] Name: `sync-service`
- [ ] Set build args: `SERVICE=sync-service`
- [ ] Add environment variables:
  - [ ] `PORT=8084`
  - [ ] `REDIS_URL=${{Redis.REDIS_URL}}`
- [ ] Set start command: `./sync-service`
- [ ] Deploy and verify logs

### 8. Deploy Gateway Service
- [ ] Create new service from GitHub repo
- [ ] Name: `gateway-service`
- [ ] Set build args: `SERVICE=gateway-service`
- [ ] Add environment variables:
  - [ ] `PORT=8080`
  - [ ] `AUTH_SERVICE_URL=http://auth-service.railway.internal:8081`
  - [ ] `METADATA_SERVICE_URL=http://metadata-service.railway.internal:8082`
  - [ ] `STORAGE_SERVICE_URL=http://storage-node.railway.internal:8083`
- [ ] Set start command: `./gateway-service`
- [ ] **Enable public networking**
- [ ] **Generate domain**
- [ ] Note down the public URL (e.g., `gateway-service.railway.app`)
- [ ] Deploy and verify logs

### 9. Verify Backend
- [ ] All services show "Active" status
- [ ] No errors in logs
- [ ] Test gateway health endpoint: `curl https://your-gateway.railway.app/health`

---

## Vercel Frontend Deployment

### 1. Project Setup
- [ ] Go to Vercel dashboard
- [ ] Click "Add New" → "Project"
- [ ] Import GitHub repository

### 2. Configure Build
- [ ] Framework: Next.js (auto-detected)
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build` (default)
- [ ] Output Directory: `.next` (default)

### 3. Environment Variables
- [ ] Add `NEXT_PUBLIC_API_URL`
  - Value: Your Railway gateway URL (e.g., `https://gateway-service.railway.app`)
- [ ] Apply to: Production, Preview, Development

### 4. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Note down Vercel URL (e.g., `nexus-storage.vercel.app`)

### 5. Update CORS
- [ ] Go back to Railway
- [ ] Open gateway-service
- [ ] Add environment variable:
  - [ ] `ALLOWED_ORIGINS=https://your-app.vercel.app`
- [ ] Redeploy gateway-service

---

## Post-Deployment Testing

### Backend Tests
- [ ] Test auth endpoint: `POST /api/auth/register`
- [ ] Test login: `POST /api/auth/login`
- [ ] Test metadata: `GET /api/files`
- [ ] Check all service logs for errors

### Frontend Tests
- [ ] Visit Vercel URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test file upload
- [ ] Test file download
- [ ] Test file deletion
- [ ] Check browser console for errors

### Integration Tests
- [ ] End-to-end user flow works
- [ ] API calls succeed
- [ ] No CORS errors
- [ ] Authentication works
- [ ] File operations work

---

## Security Hardening

- [ ] Change JWT_SECRET to strong random value
- [ ] Enable HTTPS only (default on Railway/Vercel)
- [ ] Configure CORS whitelist properly
- [ ] Review database access permissions
- [ ] Enable Railway's DDoS protection
- [ ] Set up Vercel security headers
- [ ] Review and rotate secrets regularly

---

## Monitoring Setup

### Railway
- [ ] Set up log alerts
- [ ] Configure resource alerts
- [ ] Enable metrics dashboard
- [ ] Set up uptime monitoring

### Vercel
- [ ] Enable Analytics
- [ ] Set up error tracking
- [ ] Configure performance monitoring
- [ ] Enable Web Vitals

---

## Optional Enhancements

- [ ] Set up custom domain on Vercel
- [ ] Set up custom domain on Railway
- [ ] Configure CDN for static assets
- [ ] Set up automated backups
- [ ] Implement CI/CD pipeline
- [ ] Add monitoring alerts (Sentry, DataDog, etc.)
- [ ] Set up staging environment
- [ ] Configure auto-scaling rules

---

## Troubleshooting

### If services won't start:
1. Check Railway logs for each service
2. Verify environment variables are set correctly
3. Ensure DATABASE_URL and REDIS_URL are accessible
4. Check if migrations ran successfully

### If frontend can't connect to backend:
1. Verify NEXT_PUBLIC_API_URL is correct
2. Check CORS configuration on gateway
3. Ensure gateway has public domain enabled
4. Check browser console for errors

### If database connection fails:
1. Verify PostgreSQL service is running
2. Check DATABASE_URL format
3. Ensure migrations completed
4. Test connection from Railway CLI

---

## Success Criteria

✅ All Railway services deployed and running
✅ Frontend deployed on Vercel
✅ Users can register and login
✅ File upload/download works
✅ No errors in logs
✅ CORS configured correctly
✅ HTTPS enabled
✅ Monitoring set up

---

## Next Steps After Deployment

1. Monitor logs for first 24 hours
2. Test with real users
3. Set up automated backups
4. Configure alerts
5. Document any issues
6. Plan for scaling
7. Set up staging environment
8. Implement CI/CD

---

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Project Issues: [Your GitHub Issues URL]

**Deployment Date:** _____________
**Deployed By:** _____________
**Production URL:** _____________
