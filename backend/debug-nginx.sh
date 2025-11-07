#!/bin/bash

# Script de diagnostic pour Nginx

echo "🔍 Diagnostic Nginx..."

# Voir les logs
echo ""
echo "📝 Logs Nginx:"
docker-compose logs --tail=50 nginx

echo ""
echo "🔍 Tester la configuration Nginx dans le conteneur..."
docker-compose exec nginx nginx -t 2>&1 || echo "Conteneur non accessible"

echo ""
echo "🔍 Vérifier que le fichier de config existe dans le conteneur..."
docker-compose exec nginx ls -la /etc/nginx/conf.d/ 2>&1 || echo "Conteneur non accessible"

echo ""
echo "🔍 Vérifier la connectivité réseau..."
docker-compose exec nginx ping -c 2 frontend 2>&1 || echo "Frontend non accessible"
docker-compose exec nginx ping -c 2 backend 2>&1 || echo "Backend non accessible"

echo ""
echo "✅ Diagnostic terminé"

