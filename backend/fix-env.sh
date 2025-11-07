#!/bin/bash

# Script pour vérifier et corriger les variables d'environnement

echo "🔍 Vérification des variables d'environnement..."

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo "❌ Le fichier .env n'existe pas!"
    echo "📝 Création du fichier .env..."
    
    cat > .env << 'EOF'
MONGO_URI=mongodb+srv://Drakaas:12deathenote34@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
PORT=4000
NODE_ENV=production
LOG_LEVEL=combined
CV_KEY=your_gemini_api_key_here
EOF
    
    echo "✅ Fichier .env créé!"
    echo "⚠️  N'oubliez pas de mettre votre clé Gemini dans CV_KEY!"
else
    echo "✅ Le fichier .env existe"
fi

# Vérifier le contenu
echo ""
echo "📄 Contenu du fichier .env:"
cat .env | sed 's/\(MONGO_URI=.*@\)[^@]*\(@.*\)/\1****\2/' | sed 's/\(CV_KEY=\).*/\1****/'

# Vérifier que MONGO_URI est défini
if grep -q "^MONGO_URI=" .env; then
    echo ""
    echo "✅ MONGO_URI est défini dans .env"
else
    echo ""
    echo "❌ MONGO_URI n'est pas défini dans .env!"
    exit 1
fi

# Exporter les variables pour docker-compose
echo ""
echo "📤 Exportation des variables d'environnement..."
export $(grep -v '^#' .env | xargs)

# Vérifier que MONGO_URI est exporté
if [ -z "$MONGO_URI" ]; then
    echo "❌ MONGO_URI n'est pas exporté!"
    exit 1
else
    echo "✅ MONGO_URI est exporté"
    echo "   Préfixe: ${MONGO_URI:0:40}..."
fi

echo ""
echo "✅ Vérification terminée!"
echo ""
echo "💡 Pour redémarrer avec les nouvelles variables:"
echo "   docker-compose down"
echo "   docker-compose up -d"
echo "   docker-compose logs -f backend"

