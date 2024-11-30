import express from "express";
import adminCategoryController from "../controllers/adminCategoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create category route (admin only)
router.post(
  "/create",
  // authMiddleware.isAdmin,
  adminCategoryController.createCategory
);

// Get all categories route (accessible to all authenticated users)
router.get(
  "/public/all",
  authMiddleware.authTokenCheck,
  adminCategoryController.getAllCategories
);

// Get all categories route (admin only)
router.get(
  "/all",
  authMiddleware.isAdmin,
  adminCategoryController.getAllCategories
);

// Update category route
router.put(
  "/:categoryId",
  authMiddleware.isAdmin,
  adminCategoryController.updateCategory
);

// Delete category route (admin only)
router.delete(
  "/:categoryId",
  authMiddleware.isAdmin,
  adminCategoryController.deleteCategory
);

export default router;
