# Configuration des URLs et Variables d'Environnement

## ✅ Modifications effectuées

### Frontend

1. **`frontend/src/utils/config.js`** ✅ MODIFIÉ
   - Avant: `'http://35.180.152.70:4000/api'`
   - Après: `'/api'` (chemin relatif pour Docker)

2. **`frontend/src/pages/Recruiter/index.jsx`** ✅ MODIFIÉ
   - Supprimé: `"https://ec2-35-180-152-70.eu-west-3.compute.amazonaws.com"`
   - Utilise maintenant: `window.location.origin` (même domaine)

### Backend

3. **`backend/.env`** - À CRÉER sur EC2
   ```env
   MONGO_URI=mongodb+srv://Drakaas:12deathenote34@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
   PORT=4000
   NODE_ENV=production
   LOG_LEVEL=combined
   CV_KEY=your_gemini_api_key_here
   ```

### Frontend (pour build Docker)

4. **`frontend/.env.production`** ✅ CRÉÉ
   ```env
   VITE_API_BASE_URL=/api
   ```
   - Utilise un chemin relatif car frontend et backend sont sur le même domaine via Nginx

## 📋 Configuration requise sur EC2

### 1. Backend .env

Créez `Recruiting-Plateforme/backend/.env`:

```bash
cd Recruiting-Plateforme/backend
nano .env
```

Contenu:
```env
MONGO_URI=mongodb+srv://Drakaas:12deathenote34@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
PORT=4000
NODE_ENV=production
LOG_LEVEL=combined
CV_KEY=your_gemini_api_key_here
```

### 2. Frontend .env.production

Le fichier `frontend/.env.production` est déjà créé avec:
```env
VITE_API_BASE_URL=/api
```

**Important**: Ce chemin relatif fonctionne car:
- Frontend est servi sur `http://35.180.152.70/`
- Backend API est accessible sur `http://35.180.152.70/api/`
- Nginx route automatiquement `/api/*` vers le backend

## 🔄 Architecture des URLs

### En production (Docker sur EC2)

```
http://35.180.152.70/
  ├── /                    → Frontend (React SPA)
  ├── /api/                → Backend API
  ├── /api/health          → Backend health check
  ├── /api/applications    → Backend applications
  ├── /uploads/            → Backend static files
  └── /health              → Backend health (via Nginx)
```

### Comment ça fonctionne

1. **Frontend** (conteneur Docker) écoute sur port 80 interne
2. **Backend** (conteneur Docker) écoute sur port 4000 interne
3. **Nginx** (conteneur Docker) écoute sur port 80/443 externe et route:
   - `/` → Frontend
   - `/api/*` → Backend
   - `/uploads/*` → Backend

## ✅ Vérification

Tous les fichiers utilisent maintenant:
- **Frontend**: Chemin relatif `/api` (fonctionne avec Nginx)
- **Backend**: Variables d'environnement depuis `.env`
- **Nginx**: Configuration pour router frontend + backend

## 🚀 Déploiement

Après avoir créé le `.env` dans `backend/`, lancez:

```bash
cd Recruiting-Plateforme/backend
./deploy.sh
```

Tout devrait fonctionner avec les URLs relatives!

