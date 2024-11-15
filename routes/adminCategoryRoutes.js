import express from "express";
import adminCategoryController from "../controllers/adminCategoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create category route (admin only)
router.post("/create", adminCategoryController.createCategory);

// Get all categories route (admin only)
router.get("/", adminCategoryController.getAllCategories);

// Update category route (admin only)
router.put("/:id", adminCategoryController.updateCategory);

// Delete category route (admin only)
router.delete("/:id", adminCategoryController.deleteCategory);

export default router;
