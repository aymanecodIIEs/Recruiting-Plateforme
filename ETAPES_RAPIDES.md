# 🚀 Étapes Rapides de Déploiement - EC2

## Checklist Rapide

### ✅ ÉTAPE 1 : Préparer EC2 (5 minutes)

```bash
# 1. Connectez-vous
ssh -i votre-cle.pem ec2-user@35.180.152.70

# 2. Installez Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# 3. Installez Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Vérifiez
docker --version
docker-compose --version
```

### ✅ ÉTAPE 2 : Cloner le Projet (2 minutes)

```bash
cd /home/ec2-user
git clone <votre-repo> Recruiting-Plateforme
cd Recruiting-Plateforme/backend
```

### ✅ ÉTAPE 3 : Créer le fichier .env (1 minute)

```bash
nano .env
```

Collez ce contenu:
```env
MONGO_URI=mongodb+srv://Drakaas:12deathenote34@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
PORT=4000
NODE_ENV=production
LOG_LEVEL=combined
CV_KEY=votre_cle_gemini
```

Sauvegardez: `Ctrl+X`, `Y`, `Enter`

### ✅ ÉTAPE 4 : Déployer (10-15 minutes)

```bash
# Rendre les scripts exécutables
chmod +x deploy.sh

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Déployer
./deploy.sh
```

### ✅ ÉTAPE 5 : Vérifier (1 minute)

```bash
# Vérifier les conteneurs
docker-compose ps

# Tester
curl http://localhost/health
curl http://localhost/api/health
```

### ✅ ÉTAPE 6 : Accéder à l'Application

Ouvrez dans votre navigateur:
```
http://35.180.152.70/
```

---

## 🎯 Résultat

- ✅ Frontend: `http://35.180.152.70/`
- ✅ API: `http://35.180.152.70/api/`
- ✅ Health: `http://35.180.152.70/health`

---

## 🔧 Commandes Utiles

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer
docker-compose restart

# Arrêter
docker-compose down

# Mettre à jour
git pull && ./deploy.sh
```

---

**Temps total estimé**: 20-25 minutes

