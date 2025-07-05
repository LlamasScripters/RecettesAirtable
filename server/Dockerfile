FROM node:18-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Exposer le port
EXPOSE 5000

# Commande de démarrage en mode dev
CMD ["npm", "run", "dev"]