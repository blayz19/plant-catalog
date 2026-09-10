import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { exec } from "child_process";
import util from "util";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import productRoutes from "./routes/products.js";
import bannerRoutes from "./routes/banners.js";
import pageRoutes from "./routes/pages.js";
import newsRoutes from "./routes/news.js";
import uploadRoutes from "./routes/upload.js";
import pageContentRoutes from "./routes/pageContent.js";
import galleryRoutes from "./routes/gallery.js";
import { authenticateToken } from "./middleware/auth.js";

const execPromise = util.promisify(exec);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();

// ⭐ CORS — РАЗРЕШАЕМ ВСЁ
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// ⭐ JSON и статика
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ⭐ Роуты
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/upload", authenticateToken, uploadRoutes);
app.use("/api/page-content", pageContentRoutes);
app.use("/api/gallery", galleryRoutes);

// ⭐ Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ========== ФУНКЦИИ ДЛЯ ИНИЦИАЛИЗАЦИИ ==========

// 1. Создание админа
async function seedAdmin() {
  try {
    const adminEmail = "admin@admin.com";
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.user.create({
        data: { email: adminEmail, password: hashedPassword },
      });
      console.log("✅ Админ создан: admin@admin.com / admin123");
    } else {
      console.log("✅ Админ уже существует");
    }
  } catch (error) {
    console.error("❌ Ошибка создания админа:", error.message);
  }
}

// 2. Создание категорий
// ⭐ ЗАПУСКАЕМ SEED-TEST.CJS ЧЕРЕЗ NODE
// ⭐ ЗАПУСК SEED-TEST.CJS
async function runSeedTest() {
  try {
    console.log("🌱 Запускаем seed-test.cjs...");
    const { stdout, stderr } = await execPromise("node prisma/seed-test.cjs");
    if (stderr) console.log("⚠️", stderr);
    console.log(stdout);
    console.log("✅ seed-test.cjs выполнен!");
  } catch (error) {
    console.error("❌ Ошибка запуска seed-test.cjs:", error.message);
  }
}

// ⭐ ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ
async function initDB() {
  try {
    await prisma.$connect();
    console.log("✅ База данных подключена");

    // Принудительно создаём таблицы
    console.log("📦 Проверяем и создаём таблицы...");
    const { stderr } = await execPromise("npx prisma db push --skip-generate");
    if (stderr) console.log("⚠️", stderr);
    console.log("✅ Таблицы созданы/обновлены");

    // Создаём админа
    await seedAdmin();

    // ⭐ ВСЕГДА ЗАПУСКАЕМ SEED-TEST (он сам проверит, что создавать)
    console.log("📂 Проверяем категории...");
    const count = await prisma.category.count();
    console.log(`📊 В базе ${count} категорий`);

    // Если категорий меньше 30 — запускаем seed-test
    if (count < 30) {
      console.log("⚠️ Категорий мало, запускаем seed-test.cjs...");
      await runSeedTest();
    } else {
      console.log("✅ Категории уже созданы");
    }
  } catch (error) {
    console.error("❌ Ошибка инициализации БД:", error.message);
  }
}

// Запускаем инициализацию
initDB();

// ⭐ Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
