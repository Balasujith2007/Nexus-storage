#!/bin/bash

# Nexus Storage - Vercel Deployment Script
# This script helps you deploy the frontend to Vercel

set -e

echo "🚀 Nexus Storage - Vercel Deployment Helper"
echo "============================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI found"
echo ""

# Navigate to frontend
cd frontend

echo "🔐 Logging into Vercel..."
vercel login

echo ""
echo "⚙️  Before deploying, make sure you have:"
echo "  1. ✅ Railway backend deployed"
echo "  2. ✅ Gateway service URL from Railway"
echo ""

read -p "Enter your Railway Gateway URL (e.g., https://gateway-service.railway.app): " GATEWAY_URL

if [ -z "$GATEWAY_URL" ]; then
    echo "❌ Gateway URL is required!"
    exit 1
fi

echo ""
echo "📝 Setting environment variable..."
echo "NEXT_PUBLIC_API_URL=$GATEWAY_URL"

# Deploy to Vercel
echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod -e NEXT_PUBLIC_API_URL="$GATEWAY_URL"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app should now be live on Vercel"
echo ""
echo "📋 Post-deployment checklist:"
echo "  1. Test user registration"
echo "  2. Test login functionality"
echo "  3. Test file upload/download"
echo "  4. Check Railway logs for any errors"
echo "  5. Configure custom domain (optional)"
