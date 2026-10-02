#!/usr/bin/env bash
# ==============================================================================
# WeddingAlbums.in — Oracle Cloud Infrastructure (OCI) Automated VM Setup Script
# Tested on Ubuntu 22.04 LTS / 24.04 LTS (Ampere A1 ARM & AMD x86)
# ==============================================================================
set -e

echo "========================================================"
echo "🚀 Starting WeddingAlbums.in Oracle Cloud VM Setup..."
echo "========================================================"

# 1. Update OS Packages
echo "📦 Updating OS packages..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip iptables-persistent netfilter-persistent ufw

# 2. Configure Oracle Cloud Linux Firewall (Critical for OCI!)
echo "🛡️ Configuring Oracle Cloud OS Firewall rules for Ports 80 & 443..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT || true
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT || true
sudo netfilter-persistent save || true

# UFW Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# 3. Install Node.js 22 LTS
echo "🟢 Installing Node.js 22 LTS..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
echo "Node Version: $(node -v)"
echo "NPM Version: $(npm -v)"

# 4. Install Global Production Tools (PM2, Serve)
echo "⚡ Installing PM2 process manager..."
sudo npm install -g pm2 pm2-logrotate
sudo pm2 install pm2-logrotate
sudo pm2 set pm2-logrotate:max_size 10M
sudo pm2 set pm2-logrotate:retain 10

# 5. Install Nginx & Let's Encrypt Certbot
echo "🌐 Installing Nginx and Certbot..."
sudo apt install -y nginx certbot python3-certbot-nginx

# 6. Setup Web Application Directory
echo "📁 Setting up /var/www/weddingalbums..."
sudo mkdir -p /var/www/weddingalbums
sudo chown -R $USER:$USER /var/www/weddingalbums

# 7. Configure PM2 Systemd Service for Auto-Reboot
echo "🔄 Configuring PM2 auto-restart on system boot..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER || true

echo "========================================================"
echo "✅ Oracle Cloud VM Environment Setup Complete!"
echo "========================================================"
echo ""
echo "Next Steps:"
echo "1. Clone or copy your code to /var/www/weddingalbums"
echo "2. Copy server/.env.example to server/.env and fill in your MONGODB_URI and JWT_SECRET"
echo "3. Run: bash deploy.sh"
echo "4. Point your DNS records (A Records) to this VM's Public IP"
echo "5. Run: sudo certbot --nginx -d weddingalbums.in -d www.weddingalbums.in -d api.weddingalbums.in -d studio.weddingalbums.in -d creator.weddingalbums.in -d ops.weddingalbums.in -d cms.weddingalbums.in"
