FROM node:18-alpine

WORKDIR /app

# Копируем package.json бэкенда
COPY backend/package*.json ./backend/

# Устанавливаем зависимости
WORKDIR /app/backend
RUN npm install

# Копируем весь код бэкенда
COPY backend/ ./

# Генерируем Prisma клиент
RUN npx prisma generate

# Открываем порт
EXPOSE 5000

# Запускаем сервер
CMD ["npm", "run", "start"]