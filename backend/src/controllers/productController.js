import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
  try {
    const {
      categoryId,
      search,
      minPrice,
      maxPrice,
      isPopular,
      limit,
      characteristics,
    } = req.query;

    const where = {};

    // Поддержка множественных категорий (через запятую)
    if (categoryId) {
      const ids = categoryId.split(",").map((id) => parseInt(id));
      if (ids.length === 1) {
        where.categoryId = ids[0];
      } else {
        where.categoryId = { in: ids };
      }
    }

    if (search) {
      where.OR = [
        { nameRu: { contains: search, mode: "insensitive" } },
        { nameLat: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isPopular === "true") {
      where.isPopular = true;
    }

    if (minPrice || maxPrice) {
      where.variations = {
        some: {
          ...(minPrice && { priceMin: { gte: parseFloat(minPrice) } }),
          ...(maxPrice && { priceMax: { lte: parseFloat(maxPrice) } }),
        },
      };
    }

    if (characteristics) {
      const charFilters = JSON.parse(characteristics);
      where.characteristics = {
        path: ["$**"],
        array_contains: charFilters,
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variations: true,
        media: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении товаров" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
        variations: true,
        media: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении товара" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      categoryId,
      nameRu,
      nameLat,
      description,
      characteristics,
      isPopular,
      isActive,
      variations,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        categoryId: parseInt(categoryId),
        nameRu,
        nameLat,
        description,
        characteristics: characteristics || {},
        isPopular: isPopular || false,
        isActive: isActive !== undefined ? isActive : true,
        variations: {
          create: variations || [],
        },
      },
      include: {
        variations: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "CREATE_PRODUCT",
        details: `Создан товар: ${nameRu}`,
        ipAddress: req.ip,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при создании товара" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      categoryId,
      nameRu,
      nameLat,
      description,
      characteristics,
      isPopular,
      isActive,
    } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        categoryId: parseInt(categoryId),
        nameRu,
        nameLat,
        description,
        characteristics: characteristics || {},
        isPopular: isPopular || false,
        isActive,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "UPDATE_PRODUCT",
        details: `Обновлен товар: ${nameRu}`,
        ipAddress: req.ip,
      },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обновлении товара" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.productVariation.deleteMany({
      where: { productId: parseInt(id) },
    });

    await prisma.media.deleteMany({
      where: { entityType: "product", entityId: parseInt(id) },
    });

    const product = await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "DELETE_PRODUCT",
        details: `Удален товар: ${product.nameRu}`,
        ipAddress: req.ip,
      },
    });

    res.json({ message: "Товар удален" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении товара" });
  }
};

export const updateVariation = async (req, res) => {
  try {
    const { productId, variationId } = req.params;
    const { size, priceMin, priceMax, stock } = req.body;

    const variation = await prisma.productVariation.update({
      where: { id: parseInt(variationId) },
      data: {
        size,
        priceMin: parseFloat(priceMin),
        priceMax: parseFloat(priceMax),
        stock: parseInt(stock),
      },
    });

    res.json(variation);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обновлении вариации" });
  }
};

export const addVariation = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, priceMin, priceMax, stock } = req.body;

    const variation = await prisma.productVariation.create({
      data: {
        productId: parseInt(productId),
        size,
        priceMin: parseFloat(priceMin),
        priceMax: parseFloat(priceMax),
        stock: parseInt(stock),
      },
    });

    res.status(201).json(variation);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при добавлении вариации" });
  }
};

export const deleteVariation = async (req, res) => {
  try {
    const { variationId } = req.params;
    await prisma.productVariation.delete({
      where: { id: parseInt(variationId) },
    });
    res.json({ message: "Вариация удалена" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении вариации" });
  }
};

export const togglePopular = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPopular } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isPopular },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "TOGGLE_POPULAR",
        details: `Товар ${product.nameRu} ${isPopular ? "добавлен в" : "удален из"} популярных`,
        ipAddress: req.ip,
      },
    });

    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ошибка при обновлении статуса популярности" });
  }
};
