# Fix Nginx Restarting Issue

## Problème
Le conteneur Nginx redémarre en boucle (Restarting).

## Solution

### 1. Vérifier les logs Nginx

```bash
docker-compose logs nginx
```

Cela vous montrera l'erreur exacte.

### 2. Tester la configuration Nginx

```bash
# Entrer dans le conteneur Nginx
docker-compose exec nginx sh

# Tester la configuration
nginx -t

# Si erreur, voir le détail
nginx -T
```

### 3. Solutions communes

#### Solution A: Rebuild Nginx avec wget

```bash
cd backend
docker-compose build nginx
docker-compose up -d nginx
```

#### Solution B: Vérifier que le fichier nginx.conf existe

```bash
# Vérifier que le fichier existe
ls -la backend/nginx/nginx.conf

# Vérifier le contenu
cat backend/nginx/nginx.conf | head -20
```

#### Solution C: Vérifier les permissions

```bash
# Vérifier les permissions du fichier
ls -la backend/nginx/nginx.conf

# Si nécessaire, corriger
chmod 644 backend/nginx/nginx.conf
```

#### Solution D: Vérifier la syntaxe Nginx

Le problème peut venir de:
- Caractères spéciaux dans les commentaires
- Problème avec les upstreams
- Problème avec les locations

### 4. Rebuild complet

```bash
cd backend
docker-compose down
docker-compose build --no-cache nginx
docker-compose up -d
docker-compose logs -f nginx
```

### 5. Solution alternative: Utiliser curl au lieu de wget

Si wget pose problème, modifiez le healthcheck dans docker-compose.yml:

```yaml
healthcheck:
  test: ["CMD", "wget", "--spider", "--quiet", "http://localhost/health"]
  # ou
  test: ["CMD", "curl", "-f", "http://localhost/health"]
```

Mais curl n'est pas installé par défaut dans alpine, donc wget est préférable.

### 6. Vérifier que le port 80 n'est pas utilisé

```bash
# Vérifier si quelque chose utilise le port 80
sudo netstat -tulpn | grep :80

# Si Nginx système est installé, l'arrêter
sudo systemctl stop nginx
sudo systemctl disable nginx
```

## Commande de diagnostic complète

```bash
# 1. Voir les logs
docker-compose logs nginx

# 2. Entrer dans le conteneur
docker-compose exec nginx sh

# 3. Dans le conteneur, tester
nginx -t
cat /etc/nginx/conf.d/default.conf

# 4. Vérifier la connectivité
ping frontend
ping backend
```

