# Complete Docker Setup - Frontend + Backend + Nginx

This setup deploys both frontend and backend in Docker containers, with Nginx as reverse proxy on EC2.

## Architecture

```
Internet (Port 80/443)
    ↓
┌─────────────────────────────┐
│   Nginx Container          │
│   - Reverse Proxy          │
│   - Routes / → Frontend    │
│   - Routes /api → Backend  │
└──────────┬──────────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼────┐  ┌────▼─────┐
│Frontend│  │ Backend  │
│(React) │  │(Node.js) │
│Port 80 │  │Port 4000 │
└────────┘  └──────────┘
```

## File Structure

```
Recruiting-Plateforme/
├── frontend/
│   ├── Dockerfile              # Frontend Docker image
│   ├── nginx.conf              # Nginx config for SPA
│   ├── .dockerignore
│   └── .env.production         # Production env vars
│
└── backend/
    ├── Dockerfile              # Backend Docker image
    ├── docker-compose.yml      # Orchestrates all services
    ├── deploy.sh               # Deployment script
    └── nginx/
        ├── Dockerfile          # Nginx reverse proxy
        └── nginx.conf          # Routes frontend + backend
```

## Deployment

### 1. Prepare Environment

```bash
# On your EC2 instance
cd /home/ubuntu
git clone <your-repo> Recruiting-Plateforme
cd Recruiting-Plateforme/backend
```

### 2. Create .env file

```bash
nano .env
```

Add:
```env
MONGO_URI=mongodb+srv://Drakaas:12deathenote34@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
PORT=4000
NODE_ENV=production
CV_KEY=your_gemini_api_key
```

### 3. Update Frontend API URL

The frontend is configured to use `/api` (relative path) since it's on the same domain.

If you need to change it, edit `frontend/.env.production`:
```env
VITE_API_BASE_URL=/api
```

### 4. Deploy

```bash
# Make scripts executable
chmod +x deploy.sh start-docker.sh

# Start Docker (if not running)
sudo ./start-docker.sh

# Deploy all services
./deploy.sh
```

## Services

After deployment, you'll have 3 containers:

1. **recruiting-frontend** - React SPA (port 80 internal)
2. **recruiting-backend** - Node.js API (port 4000 internal)
3. **recruiting-nginx** - Reverse proxy (ports 80/443 exposed)

## Access Points

- **Frontend**: `http://35.180.152.70/`
- **API**: `http://35.180.152.70/api/`
- **Health Check**: `http://35.180.152.70/health`

## Routing

- `/` → Frontend (React SPA)
- `/api/*` → Backend API
- `/uploads/*` → Backend static files
- `/health` → Backend health check

## Commands

```bash
# View all containers
docker-compose ps

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f nginx
docker-compose logs -f  # All services

# Restart services
docker-compose restart frontend
docker-compose restart backend
docker-compose restart nginx
docker-compose restart  # All

# Stop all
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Updating

### Update Frontend

```bash
cd backend
git pull
docker-compose build frontend
docker-compose up -d frontend
```

### Update Backend

```bash
cd backend
git pull
docker-compose build backend
docker-compose up -d backend
```

### Update Both

```bash
cd backend
git pull
./deploy.sh
```

## Troubleshooting

### Frontend not loading

```bash
# Check frontend logs
docker-compose logs frontend

# Check if frontend container is running
docker-compose ps frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### API not working

```bash
# Check backend logs
docker-compose logs backend

# Test backend directly
docker-compose exec backend curl http://localhost:4000/health

# Test through Nginx
curl http://localhost/api/health
```

### Nginx 502 errors

```bash
# Check if services are up
docker-compose ps

# Check Nginx logs
docker-compose logs nginx

# Test connectivity
docker-compose exec nginx ping frontend
docker-compose exec nginx ping backend
```

## Environment Variables

### Frontend

The frontend uses `.env.production` during build. The API URL is set to `/api` (relative).

To change it, edit `frontend/.env.production` before building.

### Backend

Backend uses `.env` file in the `backend/` directory.

## Production Considerations

1. **SSL/HTTPS**: Add SSL certificates and configure HTTPS in `nginx/nginx.conf`
2. **Domain**: Update `server_name` in nginx config
3. **CORS**: Update CORS origins in nginx config if needed
4. **Monitoring**: Set up monitoring for all containers
5. **Backups**: Backup `uploads/` directory regularly

## Security

- Backend and Frontend are not directly exposed (only through Nginx)
- Rate limiting on API endpoints
- Security headers configured
- File upload size limits

