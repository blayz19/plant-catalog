# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Устанавливаем Prisma отдельно (если используешь)
RUN npx prisma generate

# Копируем весь остальной код
COPY . .

# Открываем порт, который слушает приложение
EXPOSE 5000

# Команда для запуска сервера
CMD ["npm", "run", "start"]