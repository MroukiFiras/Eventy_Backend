import express from "express";
import adminCategoryController from "../controllers/adminCategoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create category route (admin only)
router.post("/create", adminCategoryController.createCategory);

// Get all categories route (admin only)
router.get("/", adminCategoryController.getAllCategories);

// Update category route (admin only)
router.put("/:categoryId", adminCategoryController.updateCategory);

// Delete category route (admin only)
router.delete("/:categoryId", adminCategoryController.deleteCategory);

export default router;
