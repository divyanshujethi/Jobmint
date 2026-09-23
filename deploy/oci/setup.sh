#!/bin/bash
# ==============================================================================
# JobMint OCI Always Free Automated Bootstrap Script
# Supports: Oracle Linux 8/9 & Ubuntu 22.04+ (x86_64 and ARM64)
# Optimizations: Automatic 4GB Swapfile for 1GB RAM instances, Docker, Firewall
# Cost: $0.00 Forever
# ==============================================================================

set -e

echo "🚀 Starting JobMint OCI Always Free Setup..."

# 1. Detect Package Manager & OS
if command -v dnf &> /dev/null; then
    PKG_MGR="dnf"
elif command -v apt-get &> /dev/null; then
    PKG_MGR="apt-get"
else
    PKG_MGR="yum"
fi

echo "📦 Detected package manager: $PKG_MGR"

# 2. Setup 4GB Swap Space (Crucial for 1GB RAM VM.Standard.E2.1.Micro)
if [ ! -f /swapfile ]; then
    echo "💾 Creating 4GB Swap file to prevent OOM errors..."
    sudo fallocate -l 4G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=4096
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ Swap active:"
    free -h
else
    echo "✅ Swap file already exists."
fi

# 3. System Update & Dependencies
if [ "$PKG_MGR" = "dnf" ] || [ "$PKG_MGR" = "yum" ]; then
    echo "🔄 Updating Oracle Linux packages..."
    sudo $PKG_MGR install -y dnf-plugins-core curl git wget tar
    sudo $PKG_MGR update -y
elif [ "$PKG_MGR" = "apt-get" ]; then
    echo "🔄 Updating Ubuntu packages..."
    sudo apt-get update && sudo apt-get upgrade -y
    sudo apt-get install -y curl git wget tar
fi

# 4. Install Docker & Docker Compose
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker Engine..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    sudo systemctl enable --now docker
    rm get-docker.sh
    echo "✅ Docker installed successfully."
fi

# 5. Install Node.js 22 & pnpm (for running JobMint Next.js app)
if ! command -v node &> /dev/null; then
    echo "🟢 Installing Node.js 22.x..."
    curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash - 2>/dev/null || curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    if [ "$PKG_MGR" = "dnf" ] || [ "$PKG_MGR" = "yum" ]; then
        sudo $PKG_MGR install -y nodejs
    else
        sudo apt-get install -y nodejs
    fi
fi

if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    sudo npm install -g pnpm@11.24.0 pm2
fi

# 6. Open OS Firewall (firewalld on Oracle Linux, iptables on Ubuntu)
echo "🛡️ Configuring local firewall rules..."
if systemctl is-active --quiet firewalld 2>/dev/null; then
    sudo firewall-cmd --permanent --add-port=80/tcp || true
    sudo firewall-cmd --permanent --add-port=443/tcp || true
    sudo firewall-cmd --permanent --add-port=3000/tcp || true
    sudo firewall-cmd --permanent --add-port=5432/tcp || true
    sudo firewall-cmd --permanent --add-port=6379/tcp || true
    sudo firewall-cmd --reload || true
elif command -v iptables &> /dev/null; then
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT 2>/dev/null || true
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT 2>/dev/null || true
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT 2>/dev/null || true
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5432 -j ACCEPT 2>/dev/null || true
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 6379 -j ACCEPT 2>/dev/null || true
fi

# 7. Create persistent data directories on the SSD
echo "📁 Initializing /data directories for PostgreSQL, Redis, and Resumes..."
sudo mkdir -p /data/postgres /data/redis /data/resumes
sudo chown -R $USER:$USER /data
sudo chmod -R 755 /data

# 8. Start Docker Services (Postgres & Redis)
cd "$(dirname "$0")"
echo "🚀 Starting Database & Cache Containers..."
docker compose up -d

echo "=============================================================================="
echo "🎉 SUCCESS: JobMint OCI Host Environment is Ready!"
echo "   - Swap: 4 GB active"
echo "   - Docker: $(docker --version)"
echo "   - Node.js: $(node --version)"
echo "   - pnpm: $(pnpm --version)"
echo "   - PostgreSQL 16: Running on port 5432 (/data/postgres)"
echo "   - Redis 7:       Running on port 6379 (/data/redis)"
echo "   - Resume Vault:  /data/resumes (ready for candidate uploads)"
echo "=============================================================================="