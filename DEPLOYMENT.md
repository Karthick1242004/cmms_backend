# 🚀 Deployment Guide

## Critical Fixes Applied

### ✅ Memory Issues Fixed
- Added `--max-old-space-size=512` to build and start scripts
- Optimized TypeScript compilation (removed source maps, declarations)
- Added incremental compilation
- Reduced request body limits from 10MB to 5MB

### ✅ CORS Issues Fixed
- Added dynamic CORS origin validation
- Support for all `.vercel.app` and `.railway.app` domains
- Proper handling of production vs development origins

### ✅ Railway Configuration
- Added `nixpacks.toml` for proper Node.js setup
- Configured memory limits and CPU limits
- Added health check endpoint (`/health`)
- Optimized `.railwayignore`

## 🛠️ Railway Deployment

### Environment Variables Required:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cmms
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Deploy Options:

#### Option 1: Docker (Recommended)
Uses the included `Dockerfile` for reliable builds:
```bash
# Deploy with Docker
railway up
```

#### Option 2: Auto-Detection
If Docker fails, rename the configuration:
```bash
mv railway.json railway-docker.json
mv railway-backup.json railway.json
railway up
```

#### Option 3: Simple Script
```bash
# Run the deployment script
./deploy.sh
```

#### Option 4: Manual Railway Dashboard
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

## 🔍 Health Monitoring

- Health Check: `GET /health`
- Database Info: `GET /api/database/info`
- Logs: Available in Railway dashboard

## 🚨 Memory Monitoring

The server now includes:
- Automatic memory monitoring every 30 seconds
- Garbage collection triggers when memory > 512MB
- Comprehensive error logging with memory snapshots

## 📊 Performance Optimizations

- Gzip compression enabled
- Request timeouts: 30 seconds
- Keep-alive timeout: 5 seconds
- Connection pooling: max 10 connections
- Automatic database reconnection with exponential backoff

## 🔧 Troubleshooting

### If Nixpacks fails with "undefined variable 'npm'":
```bash
# Solution 1: Use Docker instead
# (Files already configured - just deploy)
railway up

# Solution 2: Switch to backup config
mv railway.json railway-docker.json
mv railway-backup.json railway.json
railway up

# Solution 3: Let Railway auto-detect
rm railway.json
railway up
```

### If server crashes with OOM:
1. Check Railway memory limits in dashboard
2. Increase memory limit in `railway.json`
3. Check logs for memory usage patterns

### If CORS errors persist:
1. Verify `FRONTEND_URL` environment variable
2. Check allowed origins in logs
3. Ensure frontend domain is correctly formatted

### If build fails:
1. Clear `dist/` folder: `rm -rf dist`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Run build with verbose: `npm run build --verbose`

### If Docker build fails:
1. Check Dockerfile syntax
2. Ensure all files are included (check `.dockerignore`)
3. Try building locally: `docker build -t test .`