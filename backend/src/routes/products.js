import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateVariation,
  addVariation,
  deleteVariation,
  togglePopular,
} from "../controllers/productController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticateToken, createProduct);
router.put("/:id", authenticateToken, updateProduct);
router.delete("/:id", authenticateToken, deleteProduct);
router.patch("/:id/toggle-popular", authenticateToken, togglePopular); // НОВЫЙ РОУТ

// Variations
router.post("/:productId/variations", authenticateToken, addVariation);
router.put(
  "/:productId/variations/:variationId",
  authenticateToken,
  updateVariation,
);
router.delete("/variations/:variationId", authenticateToken, deleteVariation);

export default router;
