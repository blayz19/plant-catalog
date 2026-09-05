import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: true,
        products: {
          where: { isActive: true },
          take: 5,
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
};

export const getCategoryTree = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении дерева категорий' });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        children: true,
        products: {
          include: {
            variations: true,
            media: true,
          },
        },
      },
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении категории' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { nameRu, nameLat, parentId, description, isFinal, sortOrder } = req.body;
    
    let depth = 0;
    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parseInt(parentId) },
      });
      if (parent) depth = parent.depth + 1;
    }

    const category = await prisma.category.create({
      data: {
        nameRu,
        nameLat,
        parentId: parentId ? parseInt(parentId) : null,
        description,
        isFinal: isFinal || false,
        depth,
        sortOrder: sortOrder || 0,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE_CATEGORY',
        details: `Создана категория: ${nameRu}`,
        ipAddress: req.ip,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании категории' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nameRu, nameLat, parentId, description, isFinal, sortOrder } = req.body;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        nameRu,
        nameLat,
        parentId: parentId ? parseInt(parentId) : null,
        description,
        isFinal,
        sortOrder,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE_CATEGORY',
        details: `Обновлена категория: ${nameRu}`,
        ipAddress: req.ip,
      },
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении категории' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем есть ли дочерние категории
    const children = await prisma.category.findMany({
      where: { parentId: parseInt(id) },
    });

    if (children.length > 0) {
      return res.status(400).json({ error: 'Нельзя удалить категорию с подкатегориями' });
    }

    const category = await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'DELETE_CATEGORY',
        details: `Удалена категория: ${category.nameRu}`,
        ipAddress: req.ip,
      },
    });

    res.json({ message: 'Категория удалена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении категории' });
  }
};