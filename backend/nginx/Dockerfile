# Nginx Dockerfile
FROM nginx:alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Remove default nginx configuration
RUN rm -f /etc/nginx/conf.d/default.conf

# Create log directories
RUN mkdir -p /var/log/nginx

# Expose ports
EXPOSE 80 443

# Start nginx
# Note: nginx.conf is mounted as volume in docker-compose.yml as default.conf
CMD ["nginx", "-g", "daemon off;"]

