FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

COPY backend/ ./

# ⭐ СОЗДАЁМ ТАБЛИЦЫ
RUN npx prisma generate
RUN npx prisma db push

EXPOSE 8080

CMD ["npm", "run", "start"]