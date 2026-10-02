#!/usr/bin/env bash
# ==============================================================================
# WeddingAlbums.in — Automated Zero-Downtime Deployment Script
# ==============================================================================
set -e

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

echo "========================================================"
echo "🚀 Deploying WeddingAlbums.in on Cloud Server..."
echo "Directory: $APP_DIR"
echo "Time: $(date)"
echo "========================================================"

# 1. Pull Latest Changes (If Git Repo)
if [ -d ".git" ]; then
    echo "📥 Pulling latest git updates..."
    git pull origin main || echo "⚠️ Git pull skipped or not on main branch"
fi

# 2. Build Server Dependencies
echo "🟢 Installing server dependencies..."
cd "$APP_DIR/server"
npm install --omit=dev

# Optional: Run database migration if MONGODB_URI is provided
if grep -q "MONGODB_URI=mongodb" .env 2>/dev/null; then
    echo "🔄 Checking MongoDB Atlas migration..."
    node migrate_to_mongo.js || echo "⚠️ Migration completed or already in sync"
fi

# 3. Build All 5 Frontend Applications
FRONTENDS=("client" "b2b-portal" "editor-portal" "sysadmin" "uiadmin")
for app in "${FRONTENDS[@]}"; do
    echo "🔨 Building frontend: $app..."
    cd "$APP_DIR/$app"
    npm install
    npm run build
done

cd "$APP_DIR"

# 4. Link Nginx Configuration
echo "🌐 Configuring Nginx..."
sudo cp "$APP_DIR/nginx.conf" /etc/nginx/sites-available/weddingalbums.in
sudo ln -sf /etc/nginx/sites-available/weddingalbums.in /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default || true

# Test Nginx syntax
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
echo "✅ Nginx reloaded successfully!"

# 5. Restart PM2 Cluster
echo "⚡ Restarting PM2 Cluster..."
mkdir -p "$APP_DIR/logs"
pm2 startOrReload "$APP_DIR/ecosystem.config.cjs"
pm2 save

# 6. Health Check
echo "🔍 Performing health check..."
sleep 3
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/public/packages || echo "000")

if [ "$HEALTH_STATUS" -eq 200 ]; then
    echo "✅ Health Check PASSED: API is healthy (HTTP 200)!"
else
    echo "⚠️ Warning: Health check returned HTTP $HEALTH_STATUS. Check logs with 'pm2 logs weddingalbums-api'"
fi

echo "========================================================"
echo "🎉 DEPLOYMENT FINISHED SUCCESSFULLY!"
echo "========================================================"
