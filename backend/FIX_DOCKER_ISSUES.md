# Fix Docker Issues

## Problem 1: Docker daemon not running

**Error**: `Cannot connect to the Docker daemon at unix:///var/run/docker.sock`

### Solution:

```bash
# Start Docker service
sudo systemctl start docker

# Enable Docker to start on boot
sudo systemctl enable docker

# Check status
sudo systemctl status docker

# Or use the helper script
chmod +x start-docker.sh
sudo ./start-docker.sh
```

### Verify Docker is running:

```bash
docker ps
```

## Problem 2: Buildx version too old

**Error**: `compose build requires buildx 0.17 or later`

### Solution 1: Update Docker Buildx

```bash
# Check current buildx version
docker buildx version

# Update buildx (if using Docker Compose V2, buildx is included)
# For older versions, install buildx plugin:
mkdir -p ~/.docker/cli-plugins
curl -L "https://github.com/docker/buildx/releases/latest/download/buildx-v0.12.0.linux-amd64" -o ~/.docker/cli-plugins/docker-buildx
chmod +x ~/.docker/cli-plugins/docker-buildx

# Or update Docker to latest version (recommended)
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin
```

### Solution 2: Use standard Docker build (no buildx)

The Dockerfile has been updated to work without buildx. Just use:

```bash
docker-compose build
# or
docker compose build
```

## Problem 3: User permissions

If you get permission denied errors:

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and log back in, or:
newgrp docker

# Verify
docker ps
```

## Quick Fix Script

Run this to fix all issues at once:

```bash
cd backend

# Make scripts executable
chmod +x start-docker.sh
chmod +x install-docker-compose.sh

# Start Docker
sudo ./start-docker.sh

# Install/update Docker Compose if needed
./install-docker-compose.sh

# Deploy
./deploy.sh
```

## Manual Steps

If scripts don't work:

```bash
# 1. Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# 2. Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# 3. Verify
docker ps

# 4. Deploy
cd backend
./deploy.sh
```

