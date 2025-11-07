# Nginx Docker Configuration

This directory contains the Docker configuration for Nginx reverse proxy.

## Files

- **Dockerfile**: Builds Nginx image with custom configuration
- **nginx.conf**: Nginx configuration file for reverse proxy
- **.dockerignore**: Files to exclude from Docker build

## Configuration

### Update CORS for Vercel

Edit `nginx.conf` and replace all occurrences of:
```
https://your-vercel-app.vercel.app
```

With your actual Vercel domain, for example:
```
https://recruiting-platform.vercel.app
```

### Upstream Backend

The configuration connects to the backend service via Docker network:
```
upstream backend {
    server backend:4000;
}
```

This uses the service name from `docker-compose.yml`.

## Building

The Nginx service is automatically built when you run:
```bash
docker-compose build
```

Or build just Nginx:
```bash
docker-compose build nginx
```

## Testing

After deployment, test the endpoints:

```bash
# Health check
curl http://localhost/health

# API endpoint
curl http://localhost/api/health

# Through Nginx
curl http://35.180.152.70/api/health
```

## Logs

View Nginx logs:
```bash
docker-compose logs nginx
docker-compose logs -f nginx  # Follow logs
```

## Restart

Restart Nginx service:
```bash
docker-compose restart nginx
```

## Reload Configuration

To reload Nginx configuration without restarting:
```bash
docker-compose exec nginx nginx -s reload
```

Or rebuild and restart:
```bash
docker-compose build nginx
docker-compose up -d nginx
```

