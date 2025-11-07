# Guide de Déploiement Complet - EC2 avec Docker

## 📋 Étapes de Déploiement

### ÉTAPE 1 : Préparer votre EC2 Instance

#### 1.1 Connectez-vous à votre EC2

```bash
ssh -i votre-cle.pem ec2-user@35.180.152.70
# ou
ssh -i votre-cle.pem ubuntu@35.180.152.70
```

#### 1.2 Mettez à jour le système

```bash
sudo apt update && sudo apt upgrade -y
# ou pour Amazon Linux:
# sudo yum update -y
```

#### 1.3 Installez Docker

```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Redémarrer la session (ou se déconnecter/reconnecter)
newgrp docker

# Vérifier l'installation
docker --version
```

#### 1.4 Installez Docker Compose

```bash
# Vérifier si Docker Compose V2 est déjà installé
docker compose version

# Si ça ne marche pas, installer Docker Compose V1 (standalone)
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    ARCH="x86_64"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    ARCH="aarch64"
fi

sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-${ARCH}" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Vérifier
docker-compose --version
# ou
docker compose version
```

#### 1.5 Configurez le Firewall (Security Group)

Dans la console AWS EC2:
- Ouvrez votre Security Group
- Ajoutez les règles:
  - **Port 80 (HTTP)** - Source: `0.0.0.0/0`
  - **Port 443 (HTTPS)** - Source: `0.0.0.0/0` (si vous utilisez SSL)
  - **Port 22 (SSH)** - Source: Votre IP uniquement

Ou via commande:
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

---

### ÉTAPE 2 : Cloner et Préparer le Projet

#### 2.1 Clonez votre repository

```bash
cd /home/ec2-user
# ou cd /home/ubuntu

git clone <votre-repo-url> Recruiting-Plateforme
cd Recruiting-Plateforme/backend
```

#### 2.2 Créez le fichier .env pour le backend

```bash
nano .env
```

Collez ce contenu (modifiez avec vos vraies valeurs):

```env
MONGO_URI=mongodb+srv://Drakaas:12deathenote34@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
PORT=4000
NODE_ENV=production
LOG_LEVEL=combined
CV_KEY=votre_cle_gemini_ici
```

Sauvegardez: `Ctrl+X`, puis `Y`, puis `Enter`

#### 2.3 Vérifiez que le fichier .env.production existe dans frontend

```bash
cat ../frontend/.env.production
```

Il doit contenir:
```env
VITE_API_BASE_URL=/api
```

Si le fichier n'existe pas, créez-le:
```bash
cd ../frontend
echo "VITE_API_BASE_URL=/api" > .env.production
cd ../backend
```

---

### ÉTAPE 3 : Déployer avec Docker

#### 3.1 Rendez les scripts exécutables

```bash
cd /home/ec2-user/Recruiting-Plateforme/backend
# ou cd /home/ubuntu/Recruiting-Plateforme/backend

chmod +x deploy.sh start-docker.sh
```

#### 3.2 Démarrer Docker (si pas déjà démarré)

```bash
sudo systemctl start docker
sudo systemctl enable docker

# Vérifier que Docker fonctionne
docker ps
```

Si vous avez des erreurs de permissions:
```bash
sudo usermod -aG docker $USER
newgrp docker
docker ps
```

#### 3.3 Lancer le déploiement

```bash
./deploy.sh
```

Le script va:
- ✅ Vérifier les prérequis
- ✅ Builder les images Docker (frontend, backend, nginx)
- ✅ Démarrer les conteneurs
- ✅ Vérifier la santé des services

**Temps estimé**: 5-10 minutes (première fois, build des images)

---

### ÉTAPE 4 : Vérifier le Déploiement

#### 4.1 Vérifier les conteneurs

```bash
docker-compose ps
# ou
docker compose ps
```

Vous devriez voir 3 conteneurs:
- `recruiting-frontend` (Up)
- `recruiting-backend` (Up)
- `recruiting-nginx` (Up)

#### 4.2 Tester les endpoints

```bash
# Health check backend
curl http://localhost/health

# API health
curl http://localhost/api/health

# Frontend
curl http://localhost/

# Depuis l'extérieur (remplacez par votre IP EC2)
curl http://35.180.152.70/health
curl http://35.180.152.70/api/health
```

#### 4.3 Vérifier les logs

```bash
# Voir tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f nginx
```

---

### ÉTAPE 5 : Accéder à l'Application

#### 5.1 Depuis votre navigateur

Ouvrez votre navigateur et allez à:
```
http://35.180.152.70/
```

Vous devriez voir:
- ✅ La page d'accueil du frontend
- ✅ Les appels API fonctionnent automatiquement via `/api`

#### 5.2 Tester l'API

```bash
# Test depuis votre machine locale
curl http://35.180.152.70/api/health
# Devrait retourner: {"status":"ok"}
```

---

## 🔧 Commandes Utiles

### Voir le statut
```bash
docker-compose ps
docker stats
```

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f nginx
```

### Redémarrer
```bash
# Redémarrer tous les services
docker-compose restart

# Redémarrer un service
docker-compose restart frontend
docker-compose restart backend
docker-compose restart nginx
```

### Arrêter/Démarrer
```bash
# Arrêter tous les services
docker-compose down

# Démarrer tous les services
docker-compose up -d

# Rebuild et redémarrer
docker-compose up -d --build
```

### Mettre à jour
```bash
cd /home/ec2-user/Recruiting-Plateforme/backend
git pull
./deploy.sh
```

---

## 🐛 Dépannage

### Problème: Docker daemon not running

```bash
sudo systemctl start docker
sudo systemctl status docker
```

### Problème: Permission denied

```bash
sudo usermod -aG docker $USER
newgrp docker
# ou déconnectez-vous et reconnectez-vous
```

### Problème: Port 80 already in use

```bash
# Vérifier ce qui utilise le port 80
sudo netstat -tulpn | grep :80

# Arrêter Nginx système si installé
sudo systemctl stop nginx
sudo systemctl disable nginx
```

### Problème: Frontend ne charge pas

```bash
# Vérifier les logs
docker-compose logs frontend

# Rebuild le frontend
docker-compose build frontend
docker-compose up -d frontend
```

### Problème: API ne répond pas

```bash
# Vérifier les logs backend
docker-compose logs backend

# Tester le backend directement
docker-compose exec backend curl http://localhost:4000/health

# Vérifier la connexion MongoDB
docker-compose exec backend node -e "console.log(process.env.MONGO_URI)"
```

### Problème: Nginx 502 Bad Gateway

```bash
# Vérifier que les services sont démarrés
docker-compose ps

# Vérifier les logs Nginx
docker-compose logs nginx

# Tester la connectivité
docker-compose exec nginx ping frontend
docker-compose exec nginx ping backend
```

---

## 📊 Vérification Finale

### Checklist

- [ ] Docker installé et fonctionnel
- [ ] Docker Compose installé
- [ ] Fichier `.env` créé dans `backend/`
- [ ] Fichier `.env.production` existe dans `frontend/`
- [ ] Security Group EC2 configuré (ports 80, 443, 22)
- [ ] Conteneurs démarrés (`docker-compose ps`)
- [ ] Frontend accessible: `http://35.180.152.70/`
- [ ] API accessible: `http://35.180.152.70/api/health`
- [ ] Logs sans erreurs critiques

---

## 🎯 Résultat Attendu

Après le déploiement, vous devriez avoir:

1. **Frontend React** accessible sur `http://35.180.152.70/`
2. **Backend API** accessible sur `http://35.180.152.70/api/`
3. **Nginx** qui route automatiquement:
   - `/` → Frontend
   - `/api/*` → Backend
   - `/uploads/*` → Fichiers statiques backend

Tout fonctionne sur le même domaine, donc pas de problèmes CORS!

---

## 📝 Notes Importantes

1. **Premier déploiement**: Le build peut prendre 10-15 minutes
2. **Variables d'environnement**: Ne jamais commiter le fichier `.env`
3. **Mises à jour**: Utilisez `git pull && ./deploy.sh` pour mettre à jour
4. **Backups**: Sauvegardez régulièrement le dossier `uploads/`
5. **Monitoring**: Surveillez les logs régulièrement

---

## 🚀 Commandes Rapides

```bash
# Déploiement complet
cd /home/ec2-user/Recruiting-Plateforme/backend
./deploy.sh

# Voir les logs en temps réel
docker-compose logs -f

# Redémarrer tout
docker-compose restart

# Arrêter tout
docker-compose down

# Mettre à jour
git pull && ./deploy.sh
```

---

**Prêt à déployer?** Suivez les étapes dans l'ordre! 🎉

