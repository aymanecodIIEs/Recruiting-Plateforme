#!/bin/bash

# Deployment script for Recruiting Platform Backend
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please create a .env file with your configuration."
    exit 1
fi

# Load environment variables from .env file
echo -e "${YELLOW}📤 Loading environment variables from .env...${NC}"
export $(grep -v '^#' .env | xargs)

# Verify MONGO_URI is set
if [ -z "$MONGO_URI" ]; then
    echo -e "${RED}❌ Error: MONGO_URI is not set in .env file!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables loaded${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    exit 1
fi

# Check if Docker daemon is running
if ! docker ps &> /dev/null; then
    echo -e "${RED}❌ Docker daemon is not running!${NC}"
    echo ""
    echo "Please start Docker:"
    echo "  sudo systemctl start docker"
    echo ""
    echo "Or run: sudo ./start-docker.sh"
    exit 1
fi

# Detect Docker Compose command (docker-compose or docker compose)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo -e "${RED}❌ Docker Compose is not installed!${NC}"
    echo "Please install Docker Compose:"
    echo "  - For older versions: https://docs.docker.com/compose/install/"
    echo "  - For newer versions: Docker Compose is included with Docker Desktop"
    exit 1
fi

echo -e "${GREEN}✅ Using: $DOCKER_COMPOSE${NC}"

echo -e "${YELLOW}📦 Building Docker images...${NC}"
# Use DOCKER_BUILDKIT=0 to avoid buildx requirement if needed
DOCKER_BUILDKIT=0 $DOCKER_COMPOSE build || $DOCKER_COMPOSE build

echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
$DOCKER_COMPOSE down

echo -e "${YELLOW}🚀 Starting containers...${NC}"
$DOCKER_COMPOSE up -d

echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check backend health through Nginx
echo -e "${YELLOW}⏳ Waiting for backend...${NC}"
for i in {1..30}; do
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend health check failed after 30 attempts${NC}"
        echo -e "${YELLOW}Checking container logs...${NC}"
        $DOCKER_COMPOSE logs backend
        exit 1
    fi
    sleep 1
done

# Check frontend
echo -e "${YELLOW}⏳ Waiting for frontend...${NC}"
for i in {1..30}; do
    if curl -f http://localhost/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is healthy!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Frontend health check failed after 30 attempts${NC}"
        echo -e "${YELLOW}Checking container logs...${NC}"
        $DOCKER_COMPOSE logs frontend
        exit 1
    fi
    sleep 1
done

# Check Nginx routing
echo -e "${YELLOW}⏳ Checking Nginx routing...${NC}"
for i in {1..10}; do
    if curl -f http://localhost/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Nginx is routing API correctly!${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${YELLOW}⚠️  Nginx API routing check failed${NC}"
    fi
    sleep 1
done

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "📊 Container status:"
$DOCKER_COMPOSE ps

echo ""
echo "🌐 Services available at:"
echo "   - Frontend: http://localhost/"
echo "   - API: http://localhost/api"
echo "   - Health: http://localhost/health"
echo ""
echo "📝 View logs:"
echo "   - Frontend: $DOCKER_COMPOSE logs -f frontend"
echo "   - Backend: $DOCKER_COMPOSE logs -f backend"
echo "   - Nginx: $DOCKER_COMPOSE logs -f nginx"
echo "   - All: $DOCKER_COMPOSE logs -f"
echo ""
echo "🛑 Stop with: $DOCKER_COMPOSE down"
echo "🔄 Restart with: $DOCKER_COMPOSE restart"

