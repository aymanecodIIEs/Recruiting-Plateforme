#!/bin/bash

# Script to start Docker daemon and fix common issues

set -e

echo "🐳 Starting Docker daemon..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}⚠️  This script needs sudo privileges${NC}"
    echo "Running with sudo..."
    exec sudo bash "$0" "$@"
fi

# Start Docker service
echo -e "${YELLOW}🔄 Starting Docker service...${NC}"
systemctl start docker

# Enable Docker to start on boot
systemctl enable docker

# Wait a moment for Docker to start
sleep 2

# Check if Docker is running
if systemctl is-active --quiet docker; then
    echo -e "${GREEN}✅ Docker daemon is running!${NC}"
else
    echo -e "${RED}❌ Failed to start Docker daemon${NC}"
    echo "Checking status..."
    systemctl status docker
    exit 1
fi

# Check Docker version
echo ""
echo "📊 Docker information:"
docker --version

# Check if user is in docker group
if groups $SUDO_USER | grep -q docker; then
    echo -e "${GREEN}✅ User $SUDO_USER is in docker group${NC}"
else
    echo -e "${YELLOW}⚠️  Adding user $SUDO_USER to docker group...${NC}"
    usermod -aG docker $SUDO_USER
    echo -e "${GREEN}✅ User added to docker group${NC}"
    echo -e "${YELLOW}⚠️  You may need to log out and log back in for changes to take effect${NC}"
fi

# Test Docker
echo ""
echo "🧪 Testing Docker..."
if docker ps &> /dev/null; then
    echo -e "${GREEN}✅ Docker is working correctly!${NC}"
else
    echo -e "${RED}❌ Docker test failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Docker is ready!${NC}"
echo "You can now run: ./deploy.sh"

