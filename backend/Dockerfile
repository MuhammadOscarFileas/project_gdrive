# Gunakan image nodejs
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pastikan .env dan credentials GCP diatur via secret/volume saat deploy
EXPOSE 3000
CMD ["node", "index.js"] 