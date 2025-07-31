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

### Deploy Commands:
```bash
# Build locally first to test
npm run build

# Deploy to Railway
railway up
```

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