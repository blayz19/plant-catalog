import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  res.json(banners);
});

router.post('/', authenticateToken, async (req, res) => {
  const { title, imageUrl, link, isActive, sortOrder } = req.body;
  const banner = await prisma.banner.create({
    data: { title, imageUrl, link, isActive, sortOrder },
  });
  res.json(banner);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, imageUrl, link, isActive, sortOrder } = req.body;
  const banner = await prisma.banner.update({
    where: { id: parseInt(id) },
    data: { title, imageUrl, link, isActive, sortOrder },
  });
  res.json(banner);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  await prisma.banner.delete({ where: { id: parseInt(id) } });
  res.json({ message: 'Баннер удален' });
});

export default router;