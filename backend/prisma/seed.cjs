import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начинаем заполнение БД...");

  // Создаем админа
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

  // Создаем тестовую категорию
  const category = await prisma.category.findFirst();
  if (!category) {
    await prisma.category.create({
      data: {
        nameRu: "Кедровые сосны",
        nameLat: "Pinus",
        description: "Коллекция кедровых сосен",
        isFinal: false,
        depth: 0,
        sortOrder: 0,
      },
    });
    console.log("✅ Тестовая категория создана");
  }

  console.log("✅ Заполнение БД завершено!");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
