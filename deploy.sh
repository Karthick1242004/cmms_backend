#!/bin/bash

echo "🚀 Starting Railway Deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Checking Railway authentication..."
railway login

# Deploy the application
echo "🏗️ Deploying to Railway..."
railway up

echo "✅ Deployment initiated! Check Railway dashboard for status."
echo "🌐 Your backend will be available at: https://your-service.railway.app"
echo ""
echo "📋 Don't forget to set these environment variables in Railway:"
echo "   MONGODB_URI=your_mongodb_connection_string"
echo "   NODE_ENV=production"
echo "   FRONTEND_URL=https://your-frontend.vercel.app"