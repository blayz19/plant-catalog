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

  // 3.1 Корневые категории (старые)
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

  // 3.2 Промежуточные категории (старые)
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

  // 3.3 КОНЕЧНЫЕ категории (старые, для товаров)
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

  // ========== НОВЫЕ КАТЕГОРИИ ==========
  console.log("\n📂 Создаём новые категории...");

  // 1. Другие хвойные
  const categoryConifers = await prisma.category.create({
    data: {
      nameRu: "Другие хвойные",
      nameLat: "Conifers",
      description: "Ель, лиственница и другие хвойные",
      isFinal: false,
      depth: 0,
      sortOrder: 2,
    },
  });
  console.log(`   ✅ ${categoryConifers.nameRu} (корневая)`);

  // 1.1 Ель (товарная)
  const categorySpruce = await prisma.category.create({
    data: {
      nameRu: "Ель",
      nameLat: "Picea",
      parentId: categoryConifers.id,
      description: "Различные виды елей",
      isFinal: true,
      depth: 1,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categorySpruce.nameRu} (конечная, товар)`);

  // 1.2 Лиственница (товарная)
  const categoryLarch = await prisma.category.create({
    data: {
      nameRu: "Лиственница",
      nameLat: "Larix",
      parentId: categoryConifers.id,
      description: "Различные виды лиственницы",
      isFinal: true,
      depth: 1,
      sortOrder: 1,
    },
  });
  console.log(`   ✅ ${categoryLarch.nameRu} (конечная, товар)`);

  // 2. Лиственные деревья
  const categoryDeciduous = await prisma.category.create({
    data: {
      nameRu: "Лиственные деревья",
      nameLat: "Deciduous trees",
      description: "Бархат, береза и другие",
      isFinal: false,
      depth: 0,
      sortOrder: 3,
    },
  });
  console.log(`   ✅ ${categoryDeciduous.nameRu} (корневая)`);

  // 2.1 Бархат (товарная)
  const categoryVelvet = await prisma.category.create({
    data: {
      nameRu: "Бархат",
      nameLat: "Phellodendron",
      parentId: categoryDeciduous.id,
      description: "Амурский бархат и его виды",
      isFinal: true,
      depth: 1,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categoryVelvet.nameRu} (конечная, товар)`);

  // 2.2 Береза (товарная)
  const categoryBirch = await prisma.category.create({
    data: {
      nameRu: "Береза",
      nameLat: "Betula",
      parentId: categoryDeciduous.id,
      description: "Различные виды берез",
      isFinal: true,
      depth: 1,
      sortOrder: 1,
    },
  });
  console.log(`   ✅ ${categoryBirch.nameRu} (конечная, товар)`);

  // 3. Кустарники
  const categoryShrubs = await prisma.category.create({
    data: {
      nameRu: "Кустарники",
      nameLat: "Shrubs",
      description: "Айва, бузина и другие кустарники",
      isFinal: false,
      depth: 0,
      sortOrder: 4,
    },
  });
  console.log(`   ✅ ${categoryShrubs.nameRu} (корневая)`);

  // 3.1 Айва (товарная)
  const categoryQuince = await prisma.category.create({
    data: {
      nameRu: "Айва",
      nameLat: "Chaenomeles",
      parentId: categoryShrubs.id,
      description: "Японская айва и её виды",
      isFinal: true,
      depth: 1,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categoryQuince.nameRu} (конечная, товар)`);

  // 3.2 Бузина (товарная)
  const categoryElder = await prisma.category.create({
    data: {
      nameRu: "Бузина",
      nameLat: "Sambucus",
      parentId: categoryShrubs.id,
      description: "Различные виды бузины",
      isFinal: true,
      depth: 1,
      sortOrder: 1,
    },
  });
  console.log(`   ✅ ${categoryElder.nameRu} (конечная, товар)`);

  // 4. Розы
  const categoryRoses = await prisma.category.create({
    data: {
      nameRu: "Розы",
      nameLat: "Rosa",
      description: "Видовые и чайно-гибридные розы",
      isFinal: false,
      depth: 0,
      sortOrder: 5,
    },
  });
  console.log(`   ✅ ${categoryRoses.nameRu} (корневая)`);

  // 4.1 Видовые розы (товарная)
  const categorySpeciesRoses = await prisma.category.create({
    data: {
      nameRu: "Видовые розы",
      nameLat: "Rosa species",
      parentId: categoryRoses.id,
      description: "Природные виды роз",
      isFinal: true,
      depth: 1,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categorySpeciesRoses.nameRu} (конечная, товар)`);

  // 4.2 Чайно-гибридные розы (товарная)
  const categoryHybridTeaRoses = await prisma.category.create({
    data: {
      nameRu: "Чайно-гибридные розы",
      nameLat: "Hybrid Tea Roses",
      parentId: categoryRoses.id,
      description: "Современные сорта чайно-гибридных роз",
      isFinal: true,
      depth: 1,
      sortOrder: 1,
    },
  });
  console.log(`   ✅ ${categoryHybridTeaRoses.nameRu} (конечная, товар)`);

  // 5. Лианы
  const categoryLianas = await prisma.category.create({
    data: {
      nameRu: "Лианы",
      nameLat: "Lianas",
      description: "Актинидия, виноград и другие лианы",
      isFinal: false,
      depth: 0,
      sortOrder: 6,
    },
  });
  console.log(`   ✅ ${categoryLianas.nameRu} (корневая)`);

  // 5.1 Актинидия (товарная)
  const categoryActinidia = await prisma.category.create({
    data: {
      nameRu: "Актинидия",
      nameLat: "Actinidia",
      parentId: categoryLianas.id,
      description: "Различные виды актинидии",
      isFinal: true,
      depth: 1,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categoryActinidia.nameRu} (конечная, товар)`);

  // 5.2 Виноград (товарная)
  const categoryGrape = await prisma.category.create({
    data: {
      nameRu: "Виноград",
      nameLat: "Vitis",
      parentId: categoryLianas.id,
      description: "Различные виды винограда",
      isFinal: true,
      depth: 1,
      sortOrder: 1,
    },
  });
  console.log(`   ✅ ${categoryGrape.nameRu} (конечная, товар)`);

  // 6. Вересковые
  const categoryHeathers = await prisma.category.create({
    data: {
      nameRu: "Вересковые",
      nameLat: "Ericaceae",
      description: "Вакциниум, рододендрон и другие",
      isFinal: false,
      depth: 0,
      sortOrder: 7,
    },
  });
  console.log(`   ✅ ${categoryHeathers.nameRu} (корневая)`);

  // 6.1 Вакциниум (товарная)
  const categoryVaccinium = await prisma.category.create({
    data: {
      nameRu: "Вакциниум",
      nameLat: "Vaccinium",
      parentId: categoryHeathers.id,
      description: "Голубика, брусника и другие вакциниумы",
      isFinal: true,
      depth: 1,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categoryVaccinium.nameRu} (конечная, товар)`);

  // 6.2 Рододендрон (товарная)
  const categoryRhododendron = await prisma.category.create({
    data: {
      nameRu: "Рододендрон",
      nameLat: "Rhododendron",
      parentId: categoryHeathers.id,
      description: "Различные виды рододендронов",
      isFinal: true,
      depth: 1,
      sortOrder: 1,
    },
  });
  console.log(`   ✅ ${categoryRhododendron.nameRu} (конечная, товар)`);

  // 7. Травы многолетние
  const categoryPerennials = await prisma.category.create({
    data: {
      nameRu: "Травы многолетние",
      nameLat: "Perennials",
      description: "Арабис, армерия и другие",
      isFinal: false,
      depth: 0,
      sortOrder: 8,
    },
  });
  console.log(`   ✅ ${categoryPerennials.nameRu} (корневая)`);

  // 7.1 Арабис (товарная)
  const categoryArabis = await prisma.category.create({
    data: {
      nameRu: "Арабис",
      nameLat: "Arabis",
      parentId: categoryPerennials.id,
      description: "Различные виды арабиса",
      isFinal: true,
      depth: 1,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categoryArabis.nameRu} (конечная, товар)`);

  // 7.2 Армерия (товарная)
  const categoryArmeria = await prisma.category.create({
    data: {
      nameRu: "Армерия",
      nameLat: "Armeria",
      parentId: categoryPerennials.id,
      description: "Различные виды армерии",
      isFinal: true,
      depth: 1,
      sortOrder: 1,
    },
  });
  console.log(`   ✅ ${categoryArmeria.nameRu} (конечная, товар)`);

  // 8. Плодовые
  const categoryFruit = await prisma.category.create({
    data: {
      nameRu: "Плодовые",
      nameLat: "Fruit trees",
      description: "Арония, вишня и другие",
      isFinal: false,
      depth: 0,
      sortOrder: 9,
    },
  });
  console.log(`   ✅ ${categoryFruit.nameRu} (корневая)`);

  // 8.1 Арония (товарная)
  const categoryAronia = await prisma.category.create({
    data: {
      nameRu: "Арония",
      nameLat: "Aronia",
      parentId: categoryFruit.id,
      description: "Различные виды аронии",
      isFinal: true,
      depth: 1,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categoryAronia.nameRu} (конечная, товар)`);

  // 8.2 Вишня (товарная)
  const categoryCherry = await prisma.category.create({
    data: {
      nameRu: "Вишня",
      nameLat: "Prunus",
      parentId: categoryFruit.id,
      description: "Различные виды вишни",
      isFinal: true,
      depth: 1,
      sortOrder: 1,
    },
  });
  console.log(`   ✅ ${categoryCherry.nameRu} (конечная, товар)`);

  // 9. Бонсай и дендроарт
  const categoryBonsai = await prisma.category.create({
    data: {
      nameRu: "Бонсай и дендроарт",
      nameLat: "Bonsai & Dendroart",
      description: "Бонсай, дендроарт, топиар",
      isFinal: false,
      depth: 0,
      sortOrder: 10,
    },
  });
  console.log(`   ✅ ${categoryBonsai.nameRu} (корневая)`);

  // 9.1 Бонсай (товарная)
  const categoryBonsaiArt = await prisma.category.create({
    data: {
      nameRu: "Бонсай",
      nameLat: "Bonsai",
      parentId: categoryBonsai.id,
      description: "Различные виды бонсай",
      isFinal: true,
      depth: 1,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categoryBonsaiArt.nameRu} (конечная, товар)`);

  // 9.2 Дендроарт (товарная)
  const categoryDendroart = await prisma.category.create({
    data: {
      nameRu: "Дендроарт",
      nameLat: "Dendroart",
      parentId: categoryBonsai.id,
      description: "Дендроарт и топиар",
      isFinal: true,
      depth: 1,
      sortOrder: 1,
    },
  });
  console.log(`   ✅ ${categoryDendroart.nameRu} (конечная, товар)`);

  // 9.3 Топиар (товарная)
  const categoryTopiary = await prisma.category.create({
    data: {
      nameRu: "Топиар",
      nameLat: "Topiary",
      parentId: categoryBonsai.id,
      description: "Топиарные формы",
      isFinal: true,
      depth: 1,
      sortOrder: 2,
    },
  });
  console.log(`   ✅ ${categoryTopiary.nameRu} (конечная, товар)`);

  // 10. Эксклюзивный крупномер
  const categoryLargeTrees = await prisma.category.create({
    data: {
      nameRu: "Эксклюзивный крупномер",
      nameLat: "Large trees",
      description: "Крупномерные растения",
      isFinal: false,
      depth: 0,
      sortOrder: 11,
    },
  });
  console.log(`   ✅ ${categoryLargeTrees.nameRu} (корневая)`);

  // 10.1 Кедр сибирский (товарная)
  const categorySiberianPine = await prisma.category.create({
    data: {
      nameRu: "Кедр сибирский",
      nameLat: "Pinus sibirica",
      parentId: categoryLargeTrees.id,
      description: "Крупномерный кедр сибирский",
      isFinal: true,
      depth: 1,
      sortOrder: 0,
    },
  });
  console.log(`   ✅ ${categorySiberianPine.nameRu} (конечная, товар)`);

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

  console.log("\n📂 Новые категории:");
  console.log(`   📂 ${categoryConifers.nameRu} (корневая)`);
  console.log(`     🌱 ${categorySpruce.nameRu} (конечная)`);
  console.log(`     🌱 ${categoryLarch.nameRu} (конечная)`);
  console.log(`   📂 ${categoryDeciduous.nameRu} (корневая)`);
  console.log(`     🌱 ${categoryVelvet.nameRu} (конечная)`);
  console.log(`     🌱 ${categoryBirch.nameRu} (конечная)`);
  console.log(`   📂 ${categoryShrubs.nameRu} (корневая)`);
  console.log(`     🌱 ${categoryQuince.nameRu} (конечная)`);
  console.log(`     🌱 ${categoryElder.nameRu} (конечная)`);
  console.log(`   📂 ${categoryRoses.nameRu} (корневая)`);
  console.log(`     🌱 ${categorySpeciesRoses.nameRu} (конечная)`);
  console.log(`     🌱 ${categoryHybridTeaRoses.nameRu} (конечная)`);
  console.log(`   📂 ${categoryLianas.nameRu} (корневая)`);
  console.log(`     🌱 ${categoryActinidia.nameRu} (конечная)`);
  console.log(`     🌱 ${categoryGrape.nameRu} (конечная)`);
  console.log(`   📂 ${categoryHeathers.nameRu} (корневая)`);
  console.log(`     🌱 ${categoryVaccinium.nameRu} (конечная)`);
  console.log(`     🌱 ${categoryRhododendron.nameRu} (конечная)`);
  console.log(`   📂 ${categoryPerennials.nameRu} (корневая)`);
  console.log(`     🌱 ${categoryArabis.nameRu} (конечная)`);
  console.log(`     🌱 ${categoryArmeria.nameRu} (конечная)`);
  console.log(`   📂 ${categoryFruit.nameRu} (корневая)`);
  console.log(`     🌱 ${categoryAronia.nameRu} (конечная)`);
  console.log(`     🌱 ${categoryCherry.nameRu} (конечная)`);
  console.log(`   📂 ${categoryBonsai.nameRu} (корневая)`);
  console.log(`     🌱 ${categoryBonsaiArt.nameRu} (конечная)`);
  console.log(`     🌱 ${categoryDendroart.nameRu} (конечная)`);
  console.log(`     🌱 ${categoryTopiary.nameRu} (конечная)`);
  console.log(`   📂 ${categoryLargeTrees.nameRu} (корневая)`);
  console.log(`     🌱 ${categorySiberianPine.nameRu} (конечная)`);

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
