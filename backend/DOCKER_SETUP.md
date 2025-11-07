# Docker Setup - Backend + Nginx

Cette configuration Docker déploie le backend avec Nginx comme reverse proxy dans des conteneurs séparés.

## Structure des fichiers

```
backend/
├── Dockerfile                 # Image Docker pour le backend Node.js
├── .dockerignore              # Fichiers exclus du build backend
├── docker-compose.yml         # Orchestration des services (backend + nginx)
├── deploy.sh                  # Script de déploiement automatisé
│
└── nginx/
    ├── Dockerfile             # Image Docker pour Nginx
    ├── nginx.conf             # Configuration Nginx (pour Docker)
    ├── .dockerignore          # Fichiers exclus du build Nginx
    └── README.md              # Documentation Nginx
```

## Architecture Docker

```
┌─────────────────────────────────────┐
│         Internet (Port 80/443)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Nginx Container (recruiting-nginx) │
│   - Port 80 (HTTP)                   │
│   - Port 443 (HTTPS)                 │
│   - Reverse Proxy                    │
│   - Rate Limiting                    │
│   - CORS Headers                     │
└──────────────┬──────────────────────┘
               │
               │ Docker Network (app-network)
               │
┌──────────────▼──────────────────────┐
│  Backend Container (recruiting-backend)│
│   - Port 4000 (internal only)        │
│   - Node.js/Express                  │
│   - MongoDB Connection               │
│   - File Uploads                     │
└──────────────────────────────────────┘
```

## Services Docker

### 1. Backend Service
- **Image**: Node.js 18 Alpine
- **Port interne**: 4000 (non exposé directement)
- **Volumes**: 
  - `./uploads` → `/app/uploads` (fichiers uploadés)
  - `./.env` → `/app/.env` (variables d'environnement, lecture seule)

### 2. Nginx Service
- **Image**: Nginx Alpine
- **Ports exposés**: 80 (HTTP), 443 (HTTPS)
- **Volumes**:
  - `./nginx/nginx.conf` → Configuration
  - `nginx-logs` → Logs Nginx (volume Docker)

## Déploiement

### 1. Préparer le fichier .env

```bash
cd backend
nano .env
```

Contenu minimum:
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/recruiting
PORT=4000
NODE_ENV=production
CV_KEY=your_gemini_key
```

### 2. Mettre à jour CORS dans Nginx

Éditez `nginx/nginx.conf` et remplacez:
```
https://your-vercel-app.vercel.app
```

Par votre domaine Vercel réel.

### 3. Déployer

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Lancer le déploiement
./deploy.sh
```

Le script va:
- ✅ Vérifier les prérequis
- ✅ Builder les images Docker
- ✅ Démarrer les conteneurs
- ✅ Vérifier la santé des services
- ✅ Afficher le statut

## Commandes utiles

### Voir les logs
```bash
# Backend
docker-compose logs -f backend

# Nginx
docker-compose logs -f nginx

# Tous les services
docker-compose logs -f
```

### Redémarrer
```bash
# Redémarrer tous les services
docker-compose restart

# Redémarrer un service spécifique
docker-compose restart backend
docker-compose restart nginx
```

### Arrêter/Démarrer
```bash
# Arrêter
docker-compose down

# Démarrer
docker-compose up -d

# Rebuild et redémarrer
docker-compose up -d --build
```

### Vérifier le statut
```bash
# Statut des conteneurs
docker-compose ps

# Utilisation des ressources
docker stats

# Health checks
docker-compose ps
```

### Tester les endpoints
```bash
# Health check
curl http://localhost/health

# API health
curl http://localhost/api/health

# Depuis l'extérieur (remplacez par votre IP EC2)
curl http://35.180.152.70/api/health
```

## Configuration Nginx

### Rate Limiting
- **API générale**: 10 requêtes/seconde (burst: 20)
- **Uploads**: 2 requêtes/seconde (burst: 5)

### CORS
Configuré pour autoriser votre domaine Vercel. Mettez à jour dans `nginx/nginx.conf`.

### Uploads
- Taille max: 10MB
- Timeout: 60 secondes

## Mise à jour

### Mettre à jour le code
```bash
# Pull les dernières modifications
git pull

# Rebuild et redémarrer
./deploy.sh
```

### Mettre à jour la config Nginx
```bash
# Éditer la config
nano nginx/nginx.conf

# Rebuild Nginx
docker-compose build nginx
docker-compose up -d nginx

# Ou recharger sans redémarrer
docker-compose exec nginx nginx -s reload
```

## Troubleshooting

### Les conteneurs ne démarrent pas
```bash
# Voir les logs d'erreur
docker-compose logs

# Vérifier les ports
sudo netstat -tulpn | grep -E '80|443|4000'
```

### Nginx 502 Bad Gateway
```bash
# Vérifier que le backend est démarré
docker-compose ps backend

# Vérifier les logs backend
docker-compose logs backend

# Tester le backend directement (depuis le conteneur)
docker-compose exec backend curl http://localhost:4000/health
```

### CORS errors
- Vérifiez que votre domaine Vercel est correct dans `nginx/nginx.conf`
- Vérifiez les logs Nginx: `docker-compose logs nginx`
- Testez avec curl pour voir les headers:
```bash
curl -I -H "Origin: https://your-vercel-app.vercel.app" \
  http://35.180.152.70/api/health
```

### Problèmes de permissions (uploads)
```bash
# Vérifier les permissions
ls -la uploads/

# Corriger si nécessaire
sudo chown -R $USER:$USER uploads/
chmod -R 755 uploads/
```

## Sécurité

### Firewall EC2
Dans votre Security Group AWS:
- ✅ Port 80 (HTTP) - 0.0.0.0/0
- ✅ Port 443 (HTTPS) - 0.0.0.0/0 (si SSL configuré)
- ✅ Port 22 (SSH) - Votre IP uniquement
- ❌ Port 4000 - Ne PAS exposer (backend interne uniquement)

### Headers de sécurité
Déjà configurés dans Nginx:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

## SSL/HTTPS (Optionnel)

Pour ajouter HTTPS:

1. Obtenir un certificat SSL (Let's Encrypt)
2. Modifier `nginx/nginx.conf` pour ajouter le bloc `server` port 443
3. Rebuild Nginx: `docker-compose build nginx && docker-compose up -d nginx`

Voir `DEPLOY.md` pour les instructions détaillées.

## Monitoring

### Health Checks
Les deux services ont des health checks automatiques:
- Backend: vérifie `/health` toutes les 30s
- Nginx: vérifie le routing toutes les 30s

### Logs
Les logs sont persistés dans:
- Backend: `docker-compose logs backend`
- Nginx: volume Docker `nginx-logs`

## Performance

### Optimisations incluses
- ✅ Keep-alive connections (Nginx → Backend)
- ✅ Rate limiting pour protéger contre DDoS
- ✅ Cache des fichiers statiques (30 jours)
- ✅ Compression (si activée dans Nginx)

### Scaling
Pour scaler le backend:
```bash
docker-compose up -d --scale backend=3
```

Nginx répartira automatiquement la charge entre les instances.

