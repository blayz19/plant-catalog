import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Неверный формат файла"));
    }
  },
});

// ========== ЗАГРУЗКА ФОТО ДЛЯ БАННЕРОВ (без привязки к БД) ==========
router.post("/banner", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Файл не загружен" });
    }

    // Просто возвращаем путь к файлу, без сохранения в БД
    const url = `/uploads/${file.filename}`;
    res.json({
      url: url,
      message: "Файл загружен",
    });
  } catch (error) {
    console.error("Ошибка загрузки баннера:", error);
    res.status(500).json({ error: "Ошибка при загрузке файла" });
  }
});

// ========== ЗАГРУЗКА ФОТО ДЛЯ ТОВАРОВ (с привязкой к БД) ==========
router.post("/single", upload.single("file"), async (req, res) => {
  try {
    const { entityType, entityId, caption } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Файл не загружен" });
    }

    // Если entityId = 0 или не передан — не сохраняем в БД, просто возвращаем URL
    if (!entityId || entityId === "0" || entityId === 0) {
      return res.json({
        url: `/uploads/${file.filename}`,
        message: "Файл загружен (без привязки)",
      });
    }

    const media = await prisma.media.create({
      data: {
        entityType: entityType || "product",
        entityId: parseInt(entityId),
        url: `/uploads/${file.filename}`,
        caption: caption || "",
        sortOrder: 0,
      },
    });

    res.json({
      url: `/uploads/${file.filename}`,
      mediaId: media.id,
    });
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    res.status(500).json({ error: "Ошибка при загрузке файла" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const media = await prisma.media.delete({
      where: { id: parseInt(id) },
    });

    const filePath = path.join(__dirname, "../../", media.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: "Файл удален" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении файла" });
  }
});

export default router;
