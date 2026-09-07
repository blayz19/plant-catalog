import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Получить все фото (для админки)
export const getAllGallery = async (req, res) => {
  try {
    const photos = await prisma.gallery.findMany({
      orderBy: { year: "desc" },
    });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: "Ошибка получения галереи" });
  }
};

// Получить фото по году (для клиента)
export const getGalleryByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const photos = await prisma.gallery.findMany({
      where: { year: parseInt(year) },
      orderBy: { sortOrder: "asc" },
    });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: "Ошибка получения фото" });
  }
};

// Получить все доступные годы
export const getGalleryYears = async (req, res) => {
  try {
    const years = await prisma.gallery.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });
    res.json(years.map((y) => y.year));
  } catch (error) {
    res.status(500).json({ error: "Ошибка получения годов" });
  }
};

// Создать фото
export const createGalleryPhoto = async (req, res) => {
  try {
    const { year, title, imageUrl, description, sortOrder } = req.body;

    const photo = await prisma.gallery.create({
      data: {
        year: parseInt(year),
        title,
        imageUrl,
        description: description || "",
        sortOrder: sortOrder || 0,
      },
    });

    res.status(201).json(photo);
  } catch (error) {
    console.error("Ошибка создания фото:", error);
    res.status(500).json({ error: "Ошибка создания фото" });
  }
};

// Удалить фото
export const deleteGalleryPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.gallery.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Фото удалено" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка удаления фото" });
  }
};
