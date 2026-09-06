import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import productRoutes from "./routes/products.js";
import bannerRoutes from "./routes/banners.js";
import pageRoutes from "./routes/pages.js";
import newsRoutes from "./routes/news.js";
import uploadRoutes from "./routes/upload.js";
import { authenticateToken } from "./middleware/auth.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();

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

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

async function initDB() {
  try {
    await prisma.$connect();
    console.log("✅ База данных подключена");

    // Проверяем, есть ли таблицы
    await prisma.user.count();
    console.log("✅ Таблицы существуют");
  } catch (error) {
    if (error.code === "P2021") {
      console.log("⚠️ Таблицы не найдены, создаём...");
      // Выполняем миграцию через exec
      const { exec } = await import("child_process");
      exec("npx prisma db push", (err, stdout) => {
        if (err) {
          console.error("❌ Ошибка создания таблиц:", err);
        } else {
          console.log("✅ Таблицы созданы!");
        }
      });
    } else {
      console.error("❌ Ошибка подключения к БД:", error.message);
    }
  }
}

initDB();
