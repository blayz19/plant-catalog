FROM node:18-alpine

# Устанавливаем OpenSSL
RUN apk add --no-cache openssl

WORKDIR /app

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

COPY backend/ ./

# Генерируем Prisma клиент
RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "start"]