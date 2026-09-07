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
import { authenticateToken } from "./middleware/auth.js";

import pageContentRoutes from "./routes/pageContent.js";
import galleryRoutes from "./routes/gallery.js";

const execPromise = util.promisify(exec);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();

// ⭐ СОЗДАЁМ АДМИНА, ЕСЛИ ЕГО НЕТ
async function seedAdmin() {
  try {
    const adminEmail = "admin@admin.com";
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
        },
      });
      console.log("✅ Админ создан: admin@admin.com / admin123");
    } else {
      console.log("✅ Админ уже существует");
    }
  } catch (error) {
    console.error("❌ Ошибка создания админа:", error.message);
  }
}

// ⭐ ЗАПОЛНЯЕМ ТЕСТОВЫМИ ДАННЫМИ
async function seedTestData() {
  try {
    const { stdout, stderr } = await execPromise("node prisma/seed-test.cjs");
    if (stderr) console.log("⚠️", stderr);
    console.log("✅ Тестовые данные загружены!");
  } catch (error) {
    console.error("❌ Ошибка заполнения тестовыми данными:", error.message);
  }
}

// ⭐ ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ
async function initDB() {
  try {
    await prisma.$connect();
    console.log("✅ База данных подключена");

    // Проверяем, есть ли таблицы
    await prisma.user.count();
    console.log("✅ Таблицы существуют");

    // Создаём админа
    await seedAdmin();

    // Проверяем, есть ли товары, если нет — заполняем тестовыми
    const productsCount = await prisma.product.count();
    if (productsCount === 0) {
      console.log("📦 Товаров нет, заполняем тестовыми данными...");
      await seedTestData();
    } else {
      console.log(`📦 В базе уже есть ${productsCount} товаров`);
    }
  } catch (error) {
    if (error.code === "P2021") {
      console.log("⚠️ Таблицы не найдены, создаём...");
      try {
        const { stdout, stderr } = await execPromise("npx prisma db push");
        if (stderr) console.log("⚠️", stderr);
        console.log("✅ Таблицы созданы!");

        // После создания таблиц — создаём админа
        await seedAdmin();

        // И заполняем тестовыми данными
        console.log("📦 Заполняем тестовыми данными...");
        await seedTestData();
      } catch (err) {
        console.error("❌ Ошибка создания таблиц:", err.message);
      }
    } else {
      console.error("❌ Ошибка подключения к БД:", error.message);
    }
  }
}

// Запускаем инициализацию
initDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/upload", authenticateToken, uploadRoutes);
app.use("/api/page-content", pageContentRoutes);
app.use("/api/gallery", galleryRoutes);

// ⭐ ЭНДПОИНТ ДЛЯ РУЧНОГО ЗАПУСКА ТЕСТОВЫХ ДАННЫХ
app.post("/api/seed-test", async (req, res) => {
  try {
    const { stdout, stderr } = await execPromise("node prisma/seed-test.cjs");
    if (stderr) console.log("⚠️", stderr);
    res.json({
      message: "✅ Тестовые данные успешно созданы!",
      output: stdout,
    });
  } catch (error) {
    res.status(500).json({
      error: "❌ Ошибка создания тестовых данных",
      details: error.message,
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
