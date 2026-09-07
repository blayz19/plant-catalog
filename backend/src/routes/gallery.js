import express from "express";
import {
  getAllGallery,
  getGalleryByYear,
  getGalleryYears,
  createGalleryPhoto,
  deleteGalleryPhoto,
} from "../controllers/galleryController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Публичные роуты
router.get("/years", getGalleryYears);
router.get("/year/:year", getGalleryByYear);

// Админские роуты
router.get("/", authenticateToken, getAllGallery);
router.post("/", authenticateToken, createGalleryPhoto);
router.delete("/:id", authenticateToken, deleteGalleryPhoto);

export default router;
