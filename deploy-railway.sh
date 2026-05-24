#!/bin/bash

# Nexus Storage - Railway Deployment Script
# This script helps you deploy all services to Railway

set -e

echo "🚀 Nexus Storage - Railway Deployment Helper"
echo "=============================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "✅ Railway CLI found"
echo ""

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

echo ""
echo "📋 Deployment Checklist:"
echo "1. Create a new Railway project"
echo "2. Add PostgreSQL database"
echo "3. Add Redis database"
echo "4. Deploy each service"
echo ""

read -p "Have you created a Railway project? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please create a Railway project first at https://railway.app"
    exit 1
fi

# Link to project
echo ""
echo "🔗 Linking to Railway project..."
railway link

# Run migrations
echo ""
read -p "Do you want to run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Running migrations..."
    railway run sqlx migrate run
    echo "✅ Migrations completed"
fi

echo ""
echo "📦 Services to deploy:"
echo "  1. auth-service"
echo "  2. metadata-service"
echo "  3. storage-node"
echo "  4. sync-service"
echo "  5. gateway-service"
echo ""

echo "⚠️  Note: You need to deploy each service separately in Railway UI"
echo "   Each service should use Dockerfile.backend with appropriate SERVICE build arg"
echo ""

echo "📝 Environment Variables Needed:"
echo ""
echo "Auth Service:"
echo "  PORT=8081"
echo "  DATABASE_URL=\${{Postgres.DATABASE_URL}}"
echo "  REDIS_URL=\${{Redis.REDIS_URL}}"
echo "  JWT_SECRET=your-secret-key"
echo ""

echo "Metadata Service:"
echo "  PORT=8082"
echo "  DATABASE_URL=\${{Postgres.DATABASE_URL}}"
echo "  REDIS_URL=\${{Redis.REDIS_URL}}"
echo ""

echo "Storage Node:"
echo "  PORT=8083"
echo "  STORAGE_DIR=/data"
echo ""

echo "Sync Service:"
echo "  PORT=8084"
echo "  REDIS_URL=\${{Redis.REDIS_URL}}"
echo ""

echo "Gateway Service:"
echo "  PORT=8080"
echo "  AUTH_SERVICE_URL=http://auth-service.railway.internal:8081"
echo "  METADATA_SERVICE_URL=http://metadata-service.railway.internal:8082"
echo "  STORAGE_SERVICE_URL=http://storage-node.railway.internal:8083"
echo ""

echo "✅ Setup complete!"
echo "🌐 Next: Deploy frontend to Vercel"
echo "   Run: cd frontend && vercel"
