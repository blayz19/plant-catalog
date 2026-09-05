const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начинаем заполнение тестовыми данными...\n");

  // ========== 1. СОЗДАЁМ АДМИНА ==========
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

  // ========== 2. УДАЛЯЕМ СТАРЫЕ ДАННЫЕ (опционально) ==========
  console.log("\n🗑️ Очищаем старые данные...");
  await prisma.productVariation.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log("✅ Старые данные удалены");

  // ========== 3. СОЗДАЁМ КАТЕГОРИИ ==========
  console.log("\n📂 Создаём категории...");

  // 3.1 Корневые категории
  const categoryPinus = await prisma.category.create({
    data: {
      nameRu: "Кедровые сосны",
      nameLat: "Pinus",
      description: "Коллекционные сорта кедровых сосен",
      isFinal: false,
      depth: 0,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categoryPinus.nameRu} (корневая)`);

  const categoryPinusStrobus = await prisma.category.create({
    data: {
      nameRu: "Веймутовы сосны",
      nameLat: "Pinus strobus",
      description: "Сосны группы веймутовых",
      isFinal: false,
      depth: 0,
      sortOrder: 1,
    },
  });
  console.log(`   ✅ ${categoryPinusStrobus.nameRu} (корневая)`);

  // 3.2 Промежуточные категории
  const categorySibirica = await prisma.category.create({
    data: {
      nameRu: "Кедр сибирский",
      nameLat: "Pinus sibirica",
      parentId: categoryPinus.id,
      description: "Основные сорта сибирского кедра",
      isFinal: false,
      depth: 1,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categorySibirica.nameRu} (промежуточная)`);

  const categoryCembra = await prisma.category.create({
    data: {
      nameRu: "Кедр европейский",
      nameLat: "Pinus cembra",
      parentId: categoryPinus.id,
      description: "Европейские сорта кедра",
      isFinal: false,
      depth: 1,
      sortOrder: 1,
    },
  });
  console.log(`   ✅ ${categoryCembra.nameRu} (промежуточная)`);

  const categoryKoraiensis = await prisma.category.create({
    data: {
      nameRu: "Кедр корейский",
      nameLat: "Pinus koraiensis",
      parentId: categoryPinus.id,
      description: "Корейские сорта кедра",
      isFinal: false,
      depth: 1,
      sortOrder: 2,
    },
  });
  console.log(`   ✅ ${categoryKoraiensis.nameRu} (промежуточная)`);

  // 3.3 КОНЕЧНЫЕ категории (для товаров)
  const categorySibiricaFinal = await prisma.category.create({
    data: {
      nameRu: "Кедр сибирский",
      nameLat: "Pinus sibirica",
      parentId: categorySibirica.id,
      description: "Основные сорта сибирского кедра",
      isFinal: true,
      depth: 2,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categorySibiricaFinal.nameRu} (конечная, товар)`);

  const categorySibiricaExtra = await prisma.category.create({
    data: {
      nameRu: 'Кедр сибирский "экстра"',
      nameLat: "Pinus sibirica «extra»",
      parentId: categorySibirica.id,
      description: "Элитные сорта сибирского кедра",
      isFinal: true,
      depth: 2,
      sortOrder: 1,
    },
  });
  console.log(`   ✅ ${categorySibiricaExtra.nameRu} (конечная, товар)`);

  const categoryCembraFinal = await prisma.category.create({
    data: {
      nameRu: "Кедр европейский",
      nameLat: "Pinus cembra",
      parentId: categoryCembra.id,
      description: "Основные сорта европейского кедра",
      isFinal: true,
      depth: 2,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categoryCembraFinal.nameRu} (конечная, товар)`);

  const categoryKoraiensisFinal = await prisma.category.create({
    data: {
      nameRu: "Кедр корейский",
      nameLat: "Pinus koraiensis",
      parentId: categoryKoraiensis.id,
      description: "Основные сорта корейского кедра",
      isFinal: true,
      depth: 2,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categoryKoraiensisFinal.nameRu} (конечная, товар)`);

  // ========== 4. СОЗДАЁМ ТОВАРЫ ==========
  console.log("\n🌲 Создаём товары...");

  // 4.1 Кедр сибирский 'Тамагочи'
  const product1 = await prisma.product.create({
    data: {
      categoryId: categorySibiricaFinal.id,
      nameRu: "Кедр сибирский 'Тамагочи'",
      nameLat: "Pinus sibirica 'Tamagochi'",
      description:
        "Декоративный миниатюрный сорт кедра сибирского. Отличается компактной кроной и медленным ростом. Идеально подходит для небольших садов.",
      characteristics: {
        высота: "до 1.5 м",
        "скорость роста": "медленная",
        морозостойкость: "-40°C",
        "форма кроны": "шаровидная",
      },
      isPopular: true,
      isActive: true,
      variations: {
        create: [
          { size: "50-70 см", priceMin: 2500, priceMax: 3500, stock: 10 },
          { size: "70-100 см", priceMin: 4000, priceMax: 5500, stock: 5 },
        ],
      },
    },
  });
  console.log(`   ✅ ${product1.nameRu} (⭐ популярный)`);

  // 4.2 Кедр сибирский 'Идеал'
  const product2 = await prisma.product.create({
    data: {
      categoryId: categorySibiricaFinal.id,
      nameRu: "Кедр сибирский 'Идеал'",
      nameLat: "Pinus sibirica 'Ideal'",
      description:
        "Карликовый декоративный сорт. Очень компактный, подходит для альпийских горок.",
      characteristics: {
        высота: "до 1 м",
        "скорость роста": "очень медленная",
        морозостойкость: "-45°C",
        "форма кроны": "подушковидная",
      },
      isPopular: true,
      isActive: true,
      variations: {
        create: [
          { size: "30-40 см", priceMin: 3000, priceMax: 4500, stock: 7 },
        ],
      },
    },
  });
  console.log(`   ✅ ${product2.nameRu} (⭐ популярный)`);

  // 4.3 Кедр сибирский "экстра"
  const product3 = await prisma.product.create({
    data: {
      categoryId: categorySibiricaExtra.id,
      nameRu: "Кедр сибирский 'Экстра'",
      nameLat: "Pinus sibirica 'Extra'",
      description:
        "Элитный сорт с особо крупными шишками и высокой урожайностью.",
      characteristics: {
        высота: "до 3 м",
        "скорость роста": "средняя",
        морозостойкость: "-40°C",
        "форма кроны": "конусовидная",
      },
      isPopular: false,
      isActive: true,
      variations: {
        create: [
          { size: "1-1.5 м", priceMin: 8000, priceMax: 10000, stock: 3 },
        ],
      },
    },
  });
  console.log(`   ✅ ${product3.nameRu}`);

  // 4.4 Кедр европейский 'Glauca Trento'
  const product4 = await prisma.product.create({
    data: {
      categoryId: categoryCembraFinal.id,
      nameRu: "Кедр европейский 'Glauca Trento'",
      nameLat: "Pinus cembra 'Glauca Trento'",
      description:
        "Сорт с эффектной сизой хвоей. Отличается высокой декоративностью.",
      characteristics: {
        высота: "до 5 м",
        "скорость роста": "средняя",
        морозостойкость: "-35°C",
        "цвет хвои": "сизый",
      },
      isPopular: false,
      isActive: true,
      variations: {
        create: [
          { size: "1-1.5 м", priceMin: 5000, priceMax: 7000, stock: 3 },
          { size: "1.5-2 м", priceMin: 8000, priceMax: 10000, stock: 2 },
        ],
      },
    },
  });
  console.log(`   ✅ ${product4.nameRu}`);

  // 4.5 Кедр корейский
  const product5 = await prisma.product.create({
    data: {
      categoryId: categoryKoraiensisFinal.id,
      nameRu: "Кедр корейский",
      nameLat: "Pinus koraiensis",
      description:
        "Классический корейский кедр. Высокое дерево с крупными шишками.",
      characteristics: {
        высота: "до 15 м",
        "скорость роста": "быстрая",
        морозостойкость: "-35°C",
        "форма кроны": "конусовидная",
      },
      isPopular: false,
      isActive: true,
      variations: {
        create: [{ size: "2-3 м", priceMin: 15000, priceMax: 20000, stock: 5 }],
      },
    },
  });
  console.log(`   ✅ ${product5.nameRu}`);

  console.log("\n" + "=".repeat(50));
  console.log("✅ ТЕСТОВЫЕ ДАННЫЕ УСПЕШНО СОЗДАНЫ!");
  console.log("=".repeat(50));
  console.log("\n📋 Что создано:");
  console.log(`   📂 ${categoryPinus.nameRu} (корневая)`);
  console.log(`     📂 ${categorySibirica.nameRu} (промежуточная)`);
  console.log(
    `       🌱 ${categorySibiricaFinal.nameRu} (конечная) → ${await prisma.product.count({ where: { categoryId: categorySibiricaFinal.id } })} товаров`,
  );
  console.log(
    `       🌱 ${categorySibiricaExtra.nameRu} (конечная) → ${await prisma.product.count({ where: { categoryId: categorySibiricaExtra.id } })} товаров`,
  );
  console.log(`     📂 ${categoryCembra.nameRu} (промежуточная)`);
  console.log(
    `       🌱 ${categoryCembraFinal.nameRu} (конечная) → ${await prisma.product.count({ where: { categoryId: categoryCembraFinal.id } })} товаров`,
  );
  console.log(`     📂 ${categoryKoraiensis.nameRu} (промежуточная)`);
  console.log(
    `       🌱 ${categoryKoraiensisFinal.nameRu} (конечная) → ${await prisma.product.count({ where: { categoryId: categoryKoraiensisFinal.id } })} товаров`,
  );
  console.log(`   📂 ${categoryPinusStrobus.nameRu} (корневая, пустая)`);
  console.log("\n⭐ Популярные товары (отображаются на главной):");
  const popular = await prisma.product.findMany({
    where: { isPopular: true },
    select: { nameRu: true },
  });
  popular.forEach((p) => console.log(`   - ${p.nameRu}`));
  console.log("\n🌐 Открой сайт и проверь:");
  console.log("   - Главная: показывает популярные товары");
  console.log("   - Каталог: показывает дерево категорий");
  console.log(
    '   - Клик на "Кедровые сосны" → покажет товары из всех подкатегорий',
  );
  console.log(
    '   - Клик на "Кедр сибирский" (конечная) → покажет только товары этой категории',
  );
}

main()
  .catch((e) => {
    console.error("❌ Ошибка:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
