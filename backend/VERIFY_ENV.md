# Vérification des Variables d'Environnement

## Problème
Le backend essaie de se connecter à MongoDB local au lieu d'Atlas.

## Solution

### 1. Vérifier que le fichier .env existe

```bash
cd /home/ec2-user/Recruiting-Plateforme/backend
ls -la .env
cat .env
```

Le fichier doit contenir:
```env
MONGO_URI=mongodb+srv://Drakaas:12deathenote34@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
PORT=4000
NODE_ENV=production
LOG_LEVEL=combined
CV_KEY=votre_cle_gemini
```

### 2. Vérifier les variables dans le conteneur

```bash
# Vérifier que MONGO_URI est bien chargée
docker-compose exec backend node -e "console.log('MONGO_URI:', process.env.MONGO_URI)"

# Voir toutes les variables d'environnement
docker-compose exec backend env | grep MONGO
```

### 3. Si MONGO_URI n'est pas définie

Le problème peut venir de:
1. Le fichier .env n'existe pas
2. Le fichier .env n'est pas monté correctement
3. Le fichier .env a des erreurs de format

### 4. Recréer le fichier .env

```bash
cd /home/ec2-user/Recruiting-Plateforme/backend

# Supprimer l'ancien
rm -f .env

# Créer le nouveau
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

### 5. Redémarrer le backend

```bash
docker-compose restart backend

# Voir les logs
docker-compose logs -f backend
```

### 6. Alternative: Passer les variables directement

Si le .env ne fonctionne pas, modifiez docker-compose.yml pour passer les variables directement:

```yaml
environment:
  - MONGO_URI=mongodb+srv://Drakaas:12deathenote34@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
  - PORT=4000
  - NODE_ENV=production
  - CV_KEY=votre_cle
```

Mais ce n'est pas recommandé pour la sécurité.

