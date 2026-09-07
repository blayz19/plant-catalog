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
async function seedCategories() {
  try {
    // Проверяем, есть ли уже категории
    const count = await prisma.category.count();
    if (count > 0) {
      console.log(`✅ Категории уже есть (${count} шт.)`);
      return;
    }

    console.log("📂 Создаём категории...");

    // ========== КОРНЕВЫЕ КАТЕГОРИИ ==========
    const categories = {};

    // 1. Кедровые сосны
    categories.pinus = await prisma.category.create({
      data: {
        nameRu: "Кедровые сосны",
        nameLat: "Pinus",
        description: "Коллекционные сорта кедровых сосен",
        isFinal: false,
        depth: 0,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ ${categories.pinus.nameRu} (корневая)`);

    // 2. Веймутовы сосны
    categories.strobus = await prisma.category.create({
      data: {
        nameRu: "Веймутовы сосны",
        nameLat: "Pinus strobus",
        description: "Сосны группы веймутовых",
        isFinal: false,
        depth: 0,
        sortOrder: 1,
      },
    });
    console.log(`   ✅ ${categories.strobus.nameRu} (корневая)`);

    // 3. Другие хвойные
    categories.conifers = await prisma.category.create({
      data: {
        nameRu: "Другие хвойные",
        nameLat: "Conifers",
        description: "Ель, лиственница и другие хвойные",
        isFinal: false,
        depth: 0,
        sortOrder: 2,
      },
    });
    console.log(`   ✅ ${categories.conifers.nameRu} (корневая)`);

    // 4. Лиственные деревья
    categories.deciduous = await prisma.category.create({
      data: {
        nameRu: "Лиственные деревья",
        nameLat: "Deciduous trees",
        description: "Бархат, береза и другие",
        isFinal: false,
        depth: 0,
        sortOrder: 3,
      },
    });
    console.log(`   ✅ ${categories.deciduous.nameRu} (корневая)`);

    // 5. Кустарники
    categories.shrubs = await prisma.category.create({
      data: {
        nameRu: "Кустарники",
        nameLat: "Shrubs",
        description: "Айва, бузина и другие кустарники",
        isFinal: false,
        depth: 0,
        sortOrder: 4,
      },
    });
    console.log(`   ✅ ${categories.shrubs.nameRu} (корневая)`);

    // 6. Розы
    categories.roses = await prisma.category.create({
      data: {
        nameRu: "Розы",
        nameLat: "Rosa",
        description: "Видовые и чайно-гибридные розы",
        isFinal: false,
        depth: 0,
        sortOrder: 5,
      },
    });
    console.log(`   ✅ ${categories.roses.nameRu} (корневая)`);

    // 7. Лианы
    categories.lianas = await prisma.category.create({
      data: {
        nameRu: "Лианы",
        nameLat: "Lianas",
        description: "Актинидия, виноград и другие лианы",
        isFinal: false,
        depth: 0,
        sortOrder: 6,
      },
    });
    console.log(`   ✅ ${categories.lianas.nameRu} (корневая)`);

    // 8. Вересковые
    categories.heathers = await prisma.category.create({
      data: {
        nameRu: "Вересковые",
        nameLat: "Ericaceae",
        description: "Вакциниум, рододендрон и другие",
        isFinal: false,
        depth: 0,
        sortOrder: 7,
      },
    });
    console.log(`   ✅ ${categories.heathers.nameRu} (корневая)`);

    // 9. Травы многолетние
    categories.perennials = await prisma.category.create({
      data: {
        nameRu: "Травы многолетние",
        nameLat: "Perennials",
        description: "Арабис, армерия и другие",
        isFinal: false,
        depth: 0,
        sortOrder: 8,
      },
    });
    console.log(`   ✅ ${categories.perennials.nameRu} (корневая)`);

    // 10. Плодовые
    categories.fruit = await prisma.category.create({
      data: {
        nameRu: "Плодовые",
        nameLat: "Fruit trees",
        description: "Арония, вишня и другие",
        isFinal: false,
        depth: 0,
        sortOrder: 9,
      },
    });
    console.log(`   ✅ ${categories.fruit.nameRu} (корневая)`);

    // 11. Бонсай и дендроарт
    categories.bonsai = await prisma.category.create({
      data: {
        nameRu: "Бонсай и дендроарт",
        nameLat: "Bonsai & Dendroart",
        description: "Бонсай, дендроарт, топиар",
        isFinal: false,
        depth: 0,
        sortOrder: 10,
      },
    });
    console.log(`   ✅ ${categories.bonsai.nameRu} (корневая)`);

    // 12. Эксклюзивный крупномер
    categories.largeTrees = await prisma.category.create({
      data: {
        nameRu: "Эксклюзивный крупномер",
        nameLat: "Large trees",
        description: "Крупномерные растения",
        isFinal: false,
        depth: 0,
        sortOrder: 11,
      },
    });
    console.log(`   ✅ ${categories.largeTrees.nameRu} (корневая)`);

    // ========== ПРОМЕЖУТОЧНЫЕ КАТЕГОРИИ ==========

    // Кедр сибирский (промежуточная)
    categories.sibirica = await prisma.category.create({
      data: {
        nameRu: "Кедр сибирский",
        nameLat: "Pinus sibirica",
        parentId: categories.pinus.id,
        description: "Основные сорта сибирского кедра",
        isFinal: false,
        depth: 1,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ ${categories.sibirica.nameRu} (промежуточная)`);

    // Кедр европейский (промежуточная)
    categories.cembra = await prisma.category.create({
      data: {
        nameRu: "Кедр европейский",
        nameLat: "Pinus cembra",
        parentId: categories.pinus.id,
        description: "Европейские сорта кедра",
        isFinal: false,
        depth: 1,
        sortOrder: 1,
      },
    });
    console.log(`   ✅ ${categories.cembra.nameRu} (промежуточная)`);

    // Кедр корейский (промежуточная)
    categories.koraiensis = await prisma.category.create({
      data: {
        nameRu: "Кедр корейский",
        nameLat: "Pinus koraiensis",
        parentId: categories.pinus.id,
        description: "Корейские сорта кедра",
        isFinal: false,
        depth: 1,
        sortOrder: 2,
      },
    });
    console.log(`   ✅ ${categories.koraiensis.nameRu} (промежуточная)`);

    // ========== КОНЕЧНЫЕ КАТЕГОРИИ (ДЛЯ ТОВАРОВ) ==========

    // Кедр сибирский (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Кедр сибирский",
        nameLat: "Pinus sibirica",
        parentId: categories.sibirica.id,
        description: "Основные сорта сибирского кедра",
        isFinal: true,
        depth: 2,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Кедр сибирский (конечная, товар)`);

    // Кедр сибирский "экстра" (конечная)
    await prisma.category.create({
      data: {
        nameRu: 'Кедр сибирский "экстра"',
        nameLat: "Pinus sibirica «extra»",
        parentId: categories.sibirica.id,
        description: "Элитные сорта сибирского кедра",
        isFinal: true,
        depth: 2,
        sortOrder: 1,
      },
    });
    console.log(`   ✅ Кедр сибирский "экстра" (конечная, товар)`);

    // Кедр европейский (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Кедр европейский",
        nameLat: "Pinus cembra",
        parentId: categories.cembra.id,
        description: "Основные сорта европейского кедра",
        isFinal: true,
        depth: 2,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Кедр европейский (конечная, товар)`);

    // Кедр корейский (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Кедр корейский",
        nameLat: "Pinus koraiensis",
        parentId: categories.koraiensis.id,
        description: "Основные сорта корейского кедра",
        isFinal: true,
        depth: 2,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Кедр корейский (конечная, товар)`);

    // Ель (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Ель",
        nameLat: "Picea",
        parentId: categories.conifers.id,
        description: "Различные виды елей",
        isFinal: true,
        depth: 1,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Ель (конечная, товар)`);

    // Лиственница (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Лиственница",
        nameLat: "Larix",
        parentId: categories.conifers.id,
        description: "Различные виды лиственницы",
        isFinal: true,
        depth: 1,
        sortOrder: 1,
      },
    });
    console.log(`   ✅ Лиственница (конечная, товар)`);

    // Бархат (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Бархат",
        nameLat: "Phellodendron",
        parentId: categories.deciduous.id,
        description: "Амурский бархат и его виды",
        isFinal: true,
        depth: 1,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Бархат (конечная, товар)`);

    // Береза (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Береза",
        nameLat: "Betula",
        parentId: categories.deciduous.id,
        description: "Различные виды берез",
        isFinal: true,
        depth: 1,
        sortOrder: 1,
      },
    });
    console.log(`   ✅ Береза (конечная, товар)`);

    // Айва (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Айва",
        nameLat: "Chaenomeles",
        parentId: categories.shrubs.id,
        description: "Японская айва и её виды",
        isFinal: true,
        depth: 1,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Айва (конечная, товар)`);

    // Бузина (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Бузина",
        nameLat: "Sambucus",
        parentId: categories.shrubs.id,
        description: "Различные виды бузины",
        isFinal: true,
        depth: 1,
        sortOrder: 1,
      },
    });
    console.log(`   ✅ Бузина (конечная, товар)`);

    // Видовые розы (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Видовые розы",
        nameLat: "Rosa species",
        parentId: categories.roses.id,
        description: "Природные виды роз",
        isFinal: true,
        depth: 1,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Видовые розы (конечная, товар)`);

    // Чайно-гибридные розы (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Чайно-гибридные розы",
        nameLat: "Hybrid Tea Roses",
        parentId: categories.roses.id,
        description: "Современные сорта чайно-гибридных роз",
        isFinal: true,
        depth: 1,
        sortOrder: 1,
      },
    });
    console.log(`   ✅ Чайно-гибридные розы (конечная, товар)`);

    // Актинидия (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Актинидия",
        nameLat: "Actinidia",
        parentId: categories.lianas.id,
        description: "Различные виды актинидии",
        isFinal: true,
        depth: 1,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Актинидия (конечная, товар)`);

    // Виноград (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Виноград",
        nameLat: "Vitis",
        parentId: categories.lianas.id,
        description: "Различные виды винограда",
        isFinal: true,
        depth: 1,
        sortOrder: 1,
      },
    });
    console.log(`   ✅ Виноград (конечная, товар)`);

    // Вакциниум (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Вакциниум",
        nameLat: "Vaccinium",
        parentId: categories.heathers.id,
        description: "Голубика, брусника и другие вакциниумы",
        isFinal: true,
        depth: 1,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Вакциниум (конечная, товар)`);

    // Рододендрон (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Рододендрон",
        nameLat: "Rhododendron",
        parentId: categories.heathers.id,
        description: "Различные виды рододендронов",
        isFinal: true,
        depth: 1,
        sortOrder: 1,
      },
    });
    console.log(`   ✅ Рододендрон (конечная, товар)`);

    // Арабис (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Арабис",
        nameLat: "Arabis",
        parentId: categories.perennials.id,
        description: "Различные виды арабиса",
        isFinal: true,
        depth: 1,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Арабис (конечная, товар)`);

    // Армерия (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Армерия",
        nameLat: "Armeria",
        parentId: categories.perennials.id,
        description: "Различные виды армерии",
        isFinal: true,
        depth: 1,
        sortOrder: 1,
      },
    });
    console.log(`   ✅ Армерия (конечная, товар)`);

    // Арония (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Арония",
        nameLat: "Aronia",
        parentId: categories.fruit.id,
        description: "Различные виды аронии",
        isFinal: true,
        depth: 1,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Арония (конечная, товар)`);

    // Вишня (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Вишня",
        nameLat: "Prunus",
        parentId: categories.fruit.id,
        description: "Различные виды вишни",
        isFinal: true,
        depth: 1,
        sortOrder: 1,
      },
    });
    console.log(`   ✅ Вишня (конечная, товар)`);

    // Бонсай (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Бонсай",
        nameLat: "Bonsai",
        parentId: categories.bonsai.id,
        description: "Различные виды бонсай",
        isFinal: true,
        depth: 1,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Бонсай (конечная, товар)`);

    // Дендроарт (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Дендроарт",
        nameLat: "Dendroart",
        parentId: categories.bonsai.id,
        description: "Дендроарт и топиар",
        isFinal: true,
        depth: 1,
        sortOrder: 1,
      },
    });
    console.log(`   ✅ Дендроарт (конечная, товар)`);

    // Топиар (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Топиар",
        nameLat: "Topiary",
        parentId: categories.bonsai.id,
        description: "Топиарные формы",
        isFinal: true,
        depth: 1,
        sortOrder: 2,
      },
    });
    console.log(`   ✅ Топиар (конечная, товар)`);

    // Кедр сибирский (крупномер) (конечная)
    await prisma.category.create({
      data: {
        nameRu: "Кедр сибирский",
        nameLat: "Pinus sibirica",
        parentId: categories.largeTrees.id,
        description: "Крупномерный кедр сибирский",
        isFinal: true,
        depth: 1,
        sortOrder: 0,
      },
    });
    console.log(`   ✅ Кедр сибирский (крупномер, конечная, товар)`);

    console.log(`✅ Все категории созданы!`);
  } catch (error) {
    console.error("❌ Ошибка создания категорий:", error.message);
  }
}

// 3. Инициализация БД
// ⭐ ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ
async function initDB() {
  try {
    await prisma.$connect();
    console.log("✅ База данных подключена");

    // ⭐ ПРИНУДИТЕЛЬНО СОЗДАЁМ ТАБЛИЦЫ
    console.log("📦 Проверяем и создаём таблицы...");
    const { stdout, stderr } = await execPromise(
      "npx prisma db push --skip-generate",
    );
    if (stderr) console.log("⚠️", stderr);
    console.log("✅ Таблицы созданы/обновлены");

    const userCount = await prisma.user.count();
    console.log(`📊 В базе: ${userCount} пользователей`);

    await seedAdmin();
    await seedCategories();
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
