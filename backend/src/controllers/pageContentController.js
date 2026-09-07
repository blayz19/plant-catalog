import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Получить контент страницы по ключу
export const getPageContent = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const content = await prisma.pageContent.findUnique({
      where: { pageKey },
    });

    if (!content) {
      // Если контента нет — возвращаем дефолтный
      return res.json({
        pageKey,
        title: "Страница в разработке",
        content: "<p>Контент будет добавлен позже.</p>",
      });
    }

    res.json(content);
  } catch (error) {
    console.error("Ошибка получения контента:", error);
    res.status(500).json({ error: "Ошибка получения контента" });
  }
};

// Получить все страницы (для админки)
export const getAllPageContents = async (req, res) => {
  try {
    const contents = await prisma.pageContent.findMany({
      orderBy: { pageKey: "asc" },
    });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: "Ошибка получения списка страниц" });
  }
};

// Создать или обновить контент страницы
export const upsertPageContent = async (req, res) => {
  try {
    const { pageKey, title, content, image, metaTitle, metaDesc } = req.body;

    const result = await prisma.pageContent.upsert({
      where: { pageKey },
      update: { title, content, image, metaTitle, metaDesc },
      create: { pageKey, title, content, image, metaTitle, metaDesc },
    });

    res.json(result);
  } catch (error) {
    console.error("Ошибка сохранения контента:", error);
    res.status(500).json({ error: "Ошибка сохранения контента" });
  }
};

// Удалить контент страницы
export const deletePageContent = async (req, res) => {
  try {
    const { pageKey } = req.params;
    await prisma.pageContent.delete({
      where: { pageKey },
    });
    res.json({ message: "Контент удалён" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка удаления контента" });
  }
};
