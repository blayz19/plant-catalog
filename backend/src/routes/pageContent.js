import express from "express";
import {
  getPageContent,
  getAllPageContents,
  upsertPageContent,
  deletePageContent,
} from "../controllers/pageContentController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Публичные роуты
router.get("/:pageKey", getPageContent);

// Админские роуты (с авторизацией)
router.get("/", authenticateToken, getAllPageContents);
router.post("/", authenticateToken, upsertPageContent);
router.put("/:pageKey", authenticateToken, upsertPageContent);
router.delete("/:pageKey", authenticateToken, deletePageContent);

export default router;
