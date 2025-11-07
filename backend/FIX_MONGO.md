# Fix MongoDB Connection Error

## Problème
Le backend essaie de se connecter à MongoDB local (`127.0.0.1:27017`) au lieu d'utiliser MongoDB Atlas.

## Solution

### Étape 1: Vérifier le fichier .env

Sur votre EC2, exécutez:

```bash
cd /home/ec2-user/Recruiting-Plateforme/backend

# Vérifier que le fichier .env existe
ls -la .env

# Voir le contenu (masque les mots de passe)
cat .env | sed 's/\(MONGO_URI=.*@\)[^@]*\(@.*\)/\1****\2/'
```

Le fichier doit contenir:
```env
MONGO_URI=mongodb+srv://Drakaas:12deathenote34@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
PORT=4000
NODE_ENV=production
LOG_LEVEL=combined
CV_KEY=votre_cle_gemini_ici
```

### Étape 2: Si le fichier .env n'existe pas ou est incorrect

```bash
cd /home/ec2-user/Recruiting-Plateforme/backend

# Créer/recréer le fichier .env
cat > .env << 'EOF'
MONGO_URI=mongodb+srv://Drakaas:12deathenote34@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
PORT=4000
NODE_ENV=production
LOG_LEVEL=combined
CV_KEY=votre_cle_gemini_ici
EOF

# Vérifier
cat .env
```

**⚠️ Important:** Remplacez `votre_cle_gemini_ici` par votre vraie clé Gemini API.

### Étape 3: Exporter les variables d'environnement

```bash
# Exporter les variables du fichier .env
export $(grep -v '^#' .env | xargs)

# Vérifier que MONGO_URI est exporté
echo $MONGO_URI
```

### Étape 4: Redémarrer les conteneurs

```bash
# Arrêter tous les conteneurs
docker-compose down

# Redémarrer avec les nouvelles variables
docker-compose up -d

# Voir les logs du backend
docker-compose logs -f backend
```

### Étape 5: Vérifier la connexion

Dans les logs, vous devriez voir:
```
[mongo] Using connection string prefix: mongodb+srv://Drakaas:12deathenote34@clu...
[mongo] MONGO_URI from env: SET
[mongo] Connecting to mongodb+srv://****:****@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
[mongo] connected
[mongo] connection open
[backend] listening on http://0.0.0.0:4000
```

Si vous voyez toujours `127.0.0.1:27017`, le problème persiste.

### Étape 6: Alternative - Utiliser le script de déploiement

```bash
# Utiliser le script de déploiement qui charge automatiquement les variables
chmod +x deploy.sh
./deploy.sh
```

### Étape 7: Vérifier dans le conteneur

```bash
# Vérifier que MONGO_URI est bien définie dans le conteneur
docker-compose exec backend node -e "console.log('MONGO_URI:', process.env.MONGO_URI)"

# Voir toutes les variables d'environnement
docker-compose exec backend env | grep MONGO
```

## Si le problème persiste

### Option 1: Passer les variables directement dans docker-compose.yml

Modifiez `docker-compose.yml` pour passer les variables directement (non recommandé pour la production):

```yaml
environment:
  - NODE_ENV=production
  - PORT=4000
  - MONGO_URI=mongodb+srv://Drakaas:12deathenote34@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
  - CV_KEY=votre_cle
  - LOG_LEVEL=combined
```

### Option 2: Utiliser un fichier .env.docker

Créez un fichier `.env.docker` et utilisez-le avec `docker-compose --env-file .env.docker up -d`.

## Vérification finale

```bash
# Tester la connexion MongoDB
docker-compose exec backend node -e "
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recruiting';
console.log('Connecting to:', uri.slice(0, 40) + '...');
mongoose.connect(uri, {serverSelectionTimeoutMS: 5000})
  .then(() => { console.log('✅ Connected!'); process.exit(0); })
  .catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
"
```

Si cette commande réussit, le problème est résolu!

